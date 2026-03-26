// GameState: singleton player/ship state that persists across scene transitions.

export interface InventoryItem {
    id: string;
    name: string;
    qty: number;
    type: 'consumable' | 'salvage' | 'ammo' | 'key';
    value: number;
}

export interface ContractEntry {
    id: string;
    accepted: boolean;
    completed: boolean;
    turnedIn: boolean;
}

interface ShipStatOverrides {
    hullBonus: number;
    shieldingBonus: number;
    cargoBonus: number;
    fuelBonus: number;
    jumpRangeBonus: number;
}

interface State {
    credits: number;
    xp: number;
    level: number;
    pilotHull: number;
    pilotMaxHull: number;
    shipHull: number;
    shipMaxHull: number;
    shipFuel: number;
    shipMaxFuel: number;
    /** Active ship ID (links to content/ships/ships.ts) */
    activeShipId: string;
    /** Installed upgrade IDs */
    installedUpgrades: string[];
    /** Cumulative stat bonuses from installed upgrades */
    shipStatOverrides: ShipStatOverrides;
    inventory: InventoryItem[];
    contracts: ContractEntry[];
    reputation: Record<string, number>;
    flags: Record<string, boolean>;
    returnFromDungeon: boolean;
    lastRunLoot: InventoryItem[];
    lastRunCredits: number;
    lastRunXp: number;
    lastRunSuccess: boolean;
    lastDungeonId: string | null;
    pendingDungeon: string | null;
    /** Whether the active dungeon run is a Redline contract. */
    activeRunIsRedline: boolean;
    // ── Phase 5: Redline system ──────────────────────────────────────────
    /** Item ID the player has secured for the current Redline run (survives death). */
    redlineSecuredItemId: string | null;
    /** Whether field insurance is active (purchased, protects one extra item on death). */
    redlineInsuranceActive: boolean;
    /** Items lost on the last Redline death — shown in the debrief. */
    lastRunRedlineLoss: InventoryItem[];
    /**
     * Session ID stub for future co-op compatibility.
     * Not used yet but reserved so multiplayer can be layered on without state migration.
     */
    sessionId: string | null;
    /** Which hub the player is currently visiting ('meridian' or 'farpoint'). */
    currentHubId: 'meridian' | 'farpoint';
    /** IDs of lore entries the player has unlocked (shown in Codex panel). */
    unlockedLoreIds: string[];
}

const state: State = {
    credits: 120,
    xp: 0,
    level: 1,
    pilotHull: 100,
    pilotMaxHull: 100,
    shipHull: 60,
    shipMaxHull: 80,
    shipFuel: 14,
    shipMaxFuel: 20,
    activeShipId: 'cutter-mk1',
    installedUpgrades: [],
    shipStatOverrides: {
        hullBonus: 0,
        shieldingBonus: 0,
        cargoBonus: 0,
        fuelBonus: 0,
        jumpRangeBonus: 0,
    },
    inventory: [
        { id: 'medical-kit',  name: 'Medical Kit',  qty: 2, type: 'consumable', value: 30 },
        { id: 'repair-kit',   name: 'Repair Kit',   qty: 1, type: 'consumable', value: 40 },
    ],
    contracts: [],
    reputation: {
        'meridian-dock-authority': 0,
        'ashwake-extraction-guild': 0,
        'interstellar-commonwealth-authority': 0,
        'void-covenant': 0,
        'free-transit-compact': 0,
        // Phase 4 factions
        'frontier-compact': 0,
        'sol-union-directorate': 0,
        'aegis-division': 0,
        'vanta-corsairs': 0,
        // Phase 5 factions
        'helion-synod': 0,
    },
    flags: {},
    returnFromDungeon: false,
    lastRunLoot: [],
    lastRunCredits: 0,
    lastRunXp: 0,
    lastRunSuccess: false,
    lastDungeonId: null,
    pendingDungeon: null,
    activeRunIsRedline: false,
    redlineSecuredItemId: null,
    redlineInsuranceActive: false,
    lastRunRedlineLoss: [],
    sessionId: null,
    currentHubId: 'meridian',
    unlockedLoreIds: [],
};

function clampMin(n: number, min = 0): number {
    return n < min ? min : n;
}

export const GameState = {
    get: (): Readonly<State> => state,

    // ── Credits ────────────────────────────────────────────────────────────
    addCredits(amount: number) {
        state.credits += amount;
    },
    spendCredits(amount: number): boolean {
        if (state.credits < amount) return false;
        state.credits -= amount;
        return true;
    },

    // ── XP / Level ─────────────────────────────────────────────────────────
    addXp(amount: number) {
        state.xp += amount;
        // Use while so multiple thresholds can be crossed in a single gain (e.g. large boss reward).
        while (state.xp >= 300 * state.level) {
            state.xp -= 300 * state.level;
            state.level += 1;
            state.pilotMaxHull += 10;
            state.pilotHull = state.pilotMaxHull;
        }
    },

    // ── Pilot health ───────────────────────────────────────────────────────
    healPilot(amount: number) {
        state.pilotHull = Math.min(state.pilotHull + amount, state.pilotMaxHull);
    },
    damagePilot(amount: number) {
        state.pilotHull = clampMin(state.pilotHull - amount);
    },

    // ── Ship condition ─────────────────────────────────────────────────────
    healShip(amount: number) {
        state.shipHull = Math.min(state.shipHull + amount, state.shipMaxHull);
    },
    damageShip(amount: number) {
        state.shipHull = clampMin(state.shipHull - amount);
    },
    refuelShip(amount: number) {
        state.shipFuel = Math.min(state.shipFuel + amount, state.shipMaxFuel);
    },
    consumeFuel(amount: number) {
        state.shipFuel = clampMin(state.shipFuel - amount);
    },

    // ── Ship upgrades ──────────────────────────────────────────────────────
    isUpgradeInstalled(upgradeId: string): boolean {
        return state.installedUpgrades.includes(upgradeId);
    },
    installUpgrade(upgradeId: string, statBonus: {
        hull?: number;
        shielding?: number;
        cargoCapacity?: number;
        fuelCapacity?: number;
        jumpRange?: number;
    }) {
        if (state.installedUpgrades.includes(upgradeId)) return;
        state.installedUpgrades.push(upgradeId);
        if (statBonus.hull) {
            state.shipStatOverrides.hullBonus += statBonus.hull;
            state.shipMaxHull += statBonus.hull;
            state.shipHull = Math.min(state.shipHull + statBonus.hull, state.shipMaxHull);
        }
        if (statBonus.shielding) {
            state.shipStatOverrides.shieldingBonus += statBonus.shielding;
        }
        if (statBonus.cargoCapacity) {
            state.shipStatOverrides.cargoBonus += statBonus.cargoCapacity;
        }
        if (statBonus.fuelCapacity) {
            state.shipStatOverrides.fuelBonus += statBonus.fuelCapacity;
            state.shipMaxFuel += statBonus.fuelCapacity;
        }
        if (statBonus.jumpRange) {
            state.shipStatOverrides.jumpRangeBonus += statBonus.jumpRange;
        }
    },
    /** Returns true when the Cutter is relay-capable via upgrades. */
    isCutterRelayCapable(): boolean {
        return state.installedUpgrades.includes('nav-computer') &&
               state.installedUpgrades.includes('drift-drive-upgrade');
    },
    /** Returns true when the player owns a relay-capable ship. */
    isRelayCapable(): boolean {
        if (state.activeShipId === 'meridian-hauler-ii' || state.activeShipId === 'deepfrontier-lancer-iii') return true;
        return GameState.isCutterRelayCapable();
    },

    // ── Salvage selling ────────────────────────────────────────────────────
    /** Remove one (or all) of an item from inventory, return credits earned. */
    sellItem(id: string, qty: number = 1): number {
        const item = state.inventory.find(i => i.id === id);
        if (!item || item.qty < qty) return 0;
        const earned = item.value * qty;
        item.qty -= qty;
        if (item.qty === 0) {
            state.inventory = state.inventory.filter(i => i.id !== id);
        }
        state.credits += earned;
        return earned;
    },

    // ── Inventory ──────────────────────────────────────────────────────────
    addItem(item: InventoryItem) {
        const existing = state.inventory.find(i => i.id === item.id);
        if (existing) {
            existing.qty += item.qty;
        } else {
            state.inventory.push({ ...item });
        }
    },
    useItem(id: string): InventoryItem | null {
        const item = state.inventory.find(i => i.id === id);
        if (!item || item.qty <= 0) return null;
        const copy = { ...item };
        item.qty -= 1;
        if (item.qty === 0) {
            state.inventory = state.inventory.filter(i => i.id !== id);
        }
        return copy;
    },
    countItem(id: string): number {
        return state.inventory.find(i => i.id === id)?.qty ?? 0;
    },

    // ── Contracts ──────────────────────────────────────────────────────────
    acceptContract(id: string) {
        if (!state.contracts.find(c => c.id === id)) {
            state.contracts.push({ id, accepted: true, completed: false, turnedIn: false });
        }
    },
    markContractComplete(id: string) {
        const c = state.contracts.find(c => c.id === id);
        if (c) c.completed = true;
    },
    turnInContract(id: string) {
        const c = state.contracts.find(c => c.id === id);
        if (c) c.turnedIn = true;
    },
    isContractAccepted(id: string): boolean {
        return !!state.contracts.find(c => c.id === id && c.accepted && !c.turnedIn);
    },
    isContractCompleted(id: string): boolean {
        return !!state.contracts.find(c => c.id === id && c.completed && !c.turnedIn);
    },

    // ── Reputation ─────────────────────────────────────────────────────────
    gainReputation(faction: string, amount: number) {
        state.reputation[faction] = (state.reputation[faction] ?? 0) + amount;
    },

    /** Returns the numeric reputation for a faction (0 if not tracked). */
    getReputation(faction: string): number {
        return state.reputation[faction] ?? 0;
    },

    /** Returns a short standing label for the given numeric reputation value. */
    getReputationLabel(rep: number): string {
        if (rep >= 150) return 'Honored';
        if (rep >= 100) return 'Allied';
        if (rep >= 50)  return 'Trusted';
        if (rep >= 20)  return 'Friendly';
        if (rep >= 0)   return 'Neutral';
        if (rep >= -50) return 'Cold';
        return 'Hostile';
    },

    /** Returns a color hex string for the given reputation label. */
    getReputationColor(rep: number): string {
        if (rep >= 150) return '#ffdd44';
        if (rep >= 100) return '#44ff88';
        if (rep >= 50)  return '#44ddff';
        if (rep >= 20)  return '#88ccff';
        if (rep >= 0)   return '#aaaaaa';
        if (rep >= -50) return '#ff8844';
        return '#ff4444';
    },

    /** Returns true if the player meets a faction reputation requirement. */
    meetsReputationRequirement(factionId: string, minRep: number): boolean {
        return GameState.getReputation(factionId) >= minRep;
    },

    // ── Flags ──────────────────────────────────────────────────────────────
    setFlag(key: string, value: boolean) {
        state.flags[key] = value;
    },
    getFlag(key: string): boolean {
        return !!state.flags[key];
    },

    // ── Dungeon return ─────────────────────────────────────────────────────
    launchDungeon(dungeonId: string, isRedline = false) {
        state.pendingDungeon = dungeonId;
        state.activeRunIsRedline = isRedline;
        state.lastRunRedlineLoss = [];
        GameState.consumeFuel(2); // fuel burn to reach site
    },
    setReturnFromDungeon(
        loot: InventoryItem[],
        credits: number,
        xp: number,
        success: boolean,
        affectedContractIds: string[],
        dungeonId?: string,
    ) {
        state.returnFromDungeon = true;
        state.lastRunLoot = loot;
        state.lastRunCredits = credits;
        state.lastRunXp = xp;
        state.lastRunSuccess = success;
        state.lastDungeonId = dungeonId ?? state.pendingDungeon;
        state.pendingDungeon = null;
        // Apply rewards immediately
        state.credits += credits;
        if (xp > 0) GameState.addXp(xp);
        for (const item of loot) GameState.addItem(item);
        for (const id of affectedContractIds) GameState.markContractComplete(id);
    },

    /**
     * Resolves a Redline run death: removes up to 2 field consumables from inventory
     * (respecting the secured item and insurance), records lost items for debrief.
     */
    resolveRedlineDeath() {
        const lossItems: InventoryItem[] = [];
        let lossQuota = 2;

        // Insurance halves the quota (one-time use)
        if (state.redlineInsuranceActive) {
            lossQuota = 1;
            state.redlineInsuranceActive = false;
        }

        // Iterate all consumables; prefer ones that are NOT secured
        const consumables = state.inventory.filter(i => i.type === 'consumable');
        for (const item of consumables) {
            if (lossQuota <= 0) break;
            if (state.redlineSecuredItemId === item.id) continue; // secured — skip
            const lostQty = Math.min(item.qty, 1);
            item.qty -= lostQty;
            if (item.qty === 0) state.inventory = state.inventory.filter(i => i.id !== item.id);
            lossItems.push({ id: item.id, name: item.name, qty: lostQty, type: item.type, value: item.value });
            lossQuota--;
        }

        state.lastRunRedlineLoss = lossItems;
        return lossItems;
    },

    clearReturnFromDungeon() {
        state.returnFromDungeon = false;
        state.lastRunLoot = [];
        state.lastRunCredits = 0;
        state.lastRunXp = 0;
        state.lastRunSuccess = false;
        state.activeRunIsRedline = false;
        state.redlineSecuredItemId = null;
        state.lastRunRedlineLoss = [];
    },

    // ── Phase 5: Redline helpers ───────────────────────────────────────────
    /** Mark an inventory item as secured for the upcoming Redline run. */
    secureRunItem(itemId: string | null) {
        state.redlineSecuredItemId = itemId;
    },

    /** Purchase field insurance (250c). Returns false if insufficient credits. */
    purchaseInsurance(): boolean {
        if (state.redlineInsuranceActive) return true; // already active
        if (!GameState.spendCredits(250)) return false;
        state.redlineInsuranceActive = true;
        return true;
    },

    // ── Hub navigation ─────────────────────────────────────────────────────
    setCurrentHub(hub: 'meridian' | 'farpoint') {
        state.currentHubId = hub;
    },

    // ── Lore codex ─────────────────────────────────────────────────────────
    unlockLore(id: string) {
        if (!state.unlockedLoreIds.includes(id)) {
            state.unlockedLoreIds.push(id);
        }
    },
    isLoreUnlocked(id: string): boolean {
        return state.unlockedLoreIds.includes(id);
    },
};
