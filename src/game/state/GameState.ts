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
    inventory: InventoryItem[];
    contracts: ContractEntry[];
    reputation: Record<string, number>;
    flags: Record<string, boolean>;
    returnFromDungeon: boolean;
    lastRunLoot: InventoryItem[];
    lastRunCredits: number;
    lastRunXp: number;
    lastRunSuccess: boolean;
    pendingDungeon: string | null;
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
    inventory: [
        { id: 'medical-kit',  name: 'Medical Kit',  qty: 2, type: 'consumable', value: 30 },
        { id: 'repair-kit',   name: 'Repair Kit',   qty: 1, type: 'consumable', value: 40 },
    ],
    contracts: [],
    reputation: {
        'meridian-dock-authority': 0,
        'ashwake-extraction-guild': 0,
    },
    flags: {},
    returnFromDungeon: false,
    lastRunLoot: [],
    lastRunCredits: 0,
    lastRunXp: 0,
    lastRunSuccess: false,
    pendingDungeon: null,
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
        const threshold = 300 * state.level;
        if (state.xp >= threshold) {
            state.xp -= threshold;
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

    // ── Flags ──────────────────────────────────────────────────────────────
    setFlag(key: string, value: boolean) {
        state.flags[key] = value;
    },
    getFlag(key: string): boolean {
        return !!state.flags[key];
    },

    // ── Dungeon return ─────────────────────────────────────────────────────
    launchDungeon(dungeonId: string) {
        state.pendingDungeon = dungeonId;
        GameState.damageShip(2); // fuel burn to reach site
    },
    setReturnFromDungeon(
        loot: InventoryItem[],
        credits: number,
        xp: number,
        success: boolean,
        affectedContractIds: string[],
    ) {
        state.returnFromDungeon = true;
        state.lastRunLoot = loot;
        state.lastRunCredits = credits;
        state.lastRunXp = xp;
        state.lastRunSuccess = success;
        state.pendingDungeon = null;
        // Apply rewards immediately
        state.credits += credits;
        if (xp > 0) GameState.addXp(xp);
        for (const item of loot) GameState.addItem(item);
        for (const id of affectedContractIds) GameState.markContractComplete(id);
    },
    clearReturnFromDungeon() {
        state.returnFromDungeon = false;
        state.lastRunLoot = [];
        state.lastRunCredits = 0;
        state.lastRunXp = 0;
        state.lastRunSuccess = false;
    },
};
