// Enemy stat blocks for dungeon encounters.

export interface LootEntry {
    itemId: string;
    chance: number; // 0.0 – 1.0
    qty: number;
}

export interface EnemyDef {
    id: string;
    name: string;
    description: string;
    hp: number;
    attackMin: number;
    attackMax: number;
    defense: number;
    xpReward: number;
    creditDropMin: number;
    creditDropMax: number;
    lootPool: LootEntry[];
}

export const ENEMIES: Record<string, EnemyDef> = {
    'mining-drone-mk1': {
        id: 'mining-drone-mk1',
        name: 'Mining Drone Mk.I',
        description: 'A compact automated mining unit. Laser cutters repurposed for combat.',
        hp: 30,
        attackMin: 6,
        attackMax: 12,
        defense: 2,
        xpReward: 20,
        creditDropMin: 10,
        creditDropMax: 25,
        lootPool: [
            { itemId: 'scrap-metal',      chance: 0.8, qty: 1 },
            { itemId: 'power-cell',       chance: 0.3, qty: 1 },
        ],
    },
    'mining-drone-mk2': {
        id: 'mining-drone-mk2',
        name: 'Mining Drone Mk.II',
        description: 'Heavier chassis and reinforced cutters. Slower but significantly more durable.',
        hp: 55,
        attackMin: 10,
        attackMax: 18,
        defense: 5,
        xpReward: 40,
        creditDropMin: 20,
        creditDropMax: 45,
        lootPool: [
            { itemId: 'drone-scrap-parts', chance: 0.7, qty: 1 },
            { itemId: 'power-cell',        chance: 0.5, qty: 1 },
            { itemId: 'drill-component',   chance: 0.4, qty: 1 },
        ],
    },
    'drill-sentinel': {
        id: 'drill-sentinel',
        name: 'Drill Sentinel',
        description: 'A repurposed rock-boring unit. Slow, heavily armored, dangerous at close range.',
        hp: 70,
        attackMin: 14,
        attackMax: 22,
        defense: 8,
        xpReward: 55,
        creditDropMin: 30,
        creditDropMax: 60,
        lootPool: [
            { itemId: 'drill-component',   chance: 0.8, qty: 1 },
            { itemId: 'drone-scrap-parts', chance: 0.6, qty: 1 },
            { itemId: 'power-cell',        chance: 0.4, qty: 1 },
        ],
    },
    'excavator-prime': {
        id: 'excavator-prime',
        name: 'Excavator Prime',
        description: 'The dig site\'s original foreman unit — now running without oversight or restraint.',
        hp: 140,
        attackMin: 18,
        attackMax: 30,
        defense: 10,
        xpReward: 120,
        creditDropMin: 80,
        creditDropMax: 150,
        lootPool: [
            { itemId: 'control-module',        chance: 1.0, qty: 1 },
            { itemId: 'power-cell',            chance: 0.9, qty: 2 },
            { itemId: 'drill-component',       chance: 0.8, qty: 2 },
            { itemId: 'salvage-crate-standard', chance: 0.7, qty: 1 },
        ],
    },

    // ── Coldframe Station-B enemies ─────────────────────────────────────────

    'atmo-hazard-unit': {
        id: 'atmo-hazard-unit',
        name: 'Atmosphere Hazard Unit',
        description: 'A pressurized maintenance bot running a fault loop. Vents hazardous gas on proximity contact.',
        hp: 38,
        attackMin: 8,
        attackMax: 16,
        defense: 3,
        xpReward: 28,
        creditDropMin: 12,
        creditDropMax: 28,
        lootPool: [
            { itemId: 'scrap-metal',    chance: 0.7, qty: 1 },
            { itemId: 'pressure-valve', chance: 0.5, qty: 1 },
        ],
    },
    'cryo-locked-unit': {
        id: 'cryo-locked-unit',
        name: 'Cryo-Locked Maintenance Unit',
        description: 'A maintenance robot that was powered up inside a cryogenic environment. Partially frozen, partially functional — and extremely confused about what it is trying to protect.',
        hp: 62,
        attackMin: 12,
        attackMax: 20,
        defense: 6,
        xpReward: 50,
        creditDropMin: 25,
        creditDropMax: 50,
        lootPool: [
            { itemId: 'cryo-component',       chance: 0.65, qty: 1 },
            { itemId: 'drone-scrap-parts',    chance: 0.55, qty: 1 },
            { itemId: 'power-cell',           chance: 0.35, qty: 1 },
        ],
    },
    'facility-controller-alpha': {
        id: 'facility-controller-alpha',
        name: 'Facility Controller Alpha',
        description: 'The central network hub for Coldframe Station-B. Six-limbed chassis, full sensor array, running a behavior pattern that no factory default should produce.',
        hp: 160,
        attackMin: 20,
        attackMax: 34,
        defense: 12,
        xpReward: 140,
        creditDropMin: 90,
        creditDropMax: 170,
        lootPool: [
            { itemId: 'black-box-fragment',    chance: 1.0, qty: 1 },
            { itemId: 'cryo-component',        chance: 0.85, qty: 2 },
            { itemId: 'power-cell',            chance: 0.90, qty: 2 },
            { itemId: 'salvage-crate-standard', chance: 0.65, qty: 1 },
        ],
    },

    // ── Void Relay 7-9 enemies ──────────────────────────────────────────────

    'relay-guardian-mk1': {
        id: 'relay-guardian-mk1',
        name: 'Relay Guardian Mk.I',
        description: 'An aged automated security unit built into Relay 7-9\'s original design. Heavily outdated but well-maintained — by something. Responds to intrusion with methodical, unhurried precision.',
        hp: 58,
        attackMin: 12,
        attackMax: 22,
        defense: 5,
        xpReward: 48,
        creditDropMin: 22,
        creditDropMax: 52,
        lootPool: [
            { itemId: 'signal-fragment',     chance: 0.70, qty: 1 },
            { itemId: 'power-cell',          chance: 0.45, qty: 1 },
            { itemId: 'drone-scrap-parts',   chance: 0.55, qty: 1 },
        ],
    },
    'fractured-probe': {
        id: 'fractured-probe',
        name: 'Fractured Probe',
        description: 'A compact signal probe of unidentified manufacture. Its chassis is partially degraded — as if subjected to something corrosive that left no residue. It is actively transmitting on a frequency that does not match any standard beacon protocol.',
        hp: 44,
        attackMin: 10,
        attackMax: 19,
        defense: 3,
        xpReward: 38,
        creditDropMin: 16,
        creditDropMax: 40,
        lootPool: [
            { itemId: 'signal-fragment',     chance: 0.80, qty: 1 },
            { itemId: 'anomaly-trace-log',   chance: 0.25, qty: 1 },
            { itemId: 'scrap-metal',         chance: 0.60, qty: 1 },
        ],
    },
    'relay-core-sentinel': {
        id: 'relay-core-sentinel',
        name: 'Relay Core Sentinel',
        description: 'The primary automated guardian of Void Relay 7-9\'s core. Pre-Commonwealth manufacture. Its operating cycle has run continuously for an indeterminate period — the internal clock does not return a valid timestamp. It has been waiting for something that never arrived. It has decided you are close enough.',
        hp: 225,
        attackMin: 24,
        attackMax: 42,
        defense: 14,
        xpReward: 200,
        creditDropMin: 140,
        creditDropMax: 240,
        lootPool: [
            { itemId: 'relay-data-core',       chance: 1.0,  qty: 1 },
            { itemId: 'void-pattern-record',   chance: 0.75, qty: 1 },
            { itemId: 'signal-fragment',       chance: 0.90, qty: 2 },
            { itemId: 'power-cell',            chance: 0.85, qty: 2 },
        ],
    },

    // ── Farpoint Waystation enemies ─────────────────────────────────────────

    'farpoint-sentry': {
        id: 'farpoint-sentry',
        name: 'Farpoint Security Sentry',
        description: 'A decommissioned commercial security unit reactivated by Farpoint\'s automated systems. Standard chassis, reinforced for a freight-protection role. Running a protocol that was never designed to run unsupervised for this long.',
        hp: 64,
        attackMin: 14,
        attackMax: 24,
        defense: 6,
        xpReward: 54,
        creditDropMin: 28,
        creditDropMax: 58,
        lootPool: [
            { itemId: 'farpoint-cargo-bundle', chance: 0.40, qty: 1 },
            { itemId: 'drone-scrap-parts',     chance: 0.65, qty: 1 },
            { itemId: 'power-cell',            chance: 0.40, qty: 1 },
        ],
    },
    'farpoint-security-prime': {
        id: 'farpoint-security-prime',
        name: 'Prime Security Coordinator',
        description: 'Farpoint Waystation\'s outer ring security coordinator — a heavy multi-role command unit running crowd-control, lockdown, and threat-response routines simultaneously across a station that is mostly empty. The overload shows. It is still running all of them.',
        hp: 195,
        attackMin: 22,
        attackMax: 38,
        defense: 13,
        xpReward: 185,
        creditDropMin: 125,
        creditDropMax: 210,
        lootPool: [
            { itemId: 'farpoint-access-chip',  chance: 1.0,  qty: 1 },
            { itemId: 'farpoint-cargo-bundle', chance: 0.80, qty: 2 },
            { itemId: 'power-cell',            chance: 0.85, qty: 2 },
            { itemId: 'signal-fragment',       chance: 0.50, qty: 1 },
        ],
    },

    // ── Kalindra Processing Hub enemies ─────────────────────────────────────

    'kalindra-freight-drone': {
        id: 'kalindra-freight-drone',
        name: 'Kalindra Freight-Handling Drone',
        description: 'A bulk ore freight management drone repurposed — badly — for a security role. Its manipulator arms were designed for cargo containers. They are being used for something else. The transition has not improved its temperament.',
        hp: 72,
        attackMin: 15,
        attackMax: 26,
        defense: 7,
        xpReward: 62,
        creditDropMin: 32,
        creditDropMax: 68,
        lootPool: [
            { itemId: 'drone-scrap-parts',      chance: 0.70, qty: 1 },
            { itemId: 'kalindra-nav-fragment',  chance: 0.35, qty: 1 },
            { itemId: 'power-cell',             chance: 0.45, qty: 1 },
        ],
    },
    'kalindra-security-sentinel': {
        id: 'kalindra-security-sentinel',
        name: 'Kalindra Security Sentinel',
        description: 'A dedicated security unit from Kalindra Hub\'s original installation. Heavier than a freight drone, better calibrated for threat-response. It has been running uninterrupted for two years. The maintenance logs suggest it has also been running active updates during that time — from somewhere.',
        hp: 90,
        attackMin: 18,
        attackMax: 30,
        defense: 9,
        xpReward: 82,
        creditDropMin: 45,
        creditDropMax: 90,
        lootPool: [
            { itemId: 'signal-fragment',        chance: 0.55, qty: 1 },
            { itemId: 'drone-scrap-parts',      chance: 0.65, qty: 1 },
            { itemId: 'power-cell',             chance: 0.50, qty: 1 },
        ],
    },
    'kalindra-hub-coordinator': {
        id: 'kalindra-hub-coordinator',
        name: 'Kalindra Hub Coordinator',
        description: 'Kalindra Processing Hub\'s central management unit — running logistics, access management, and freight coordination for a station that has been dark for two years. It receives instructions from somewhere. It sends responses. The instructions are not from any human crew. Its primary defense protocol was never designed for a station this empty.',
        hp: 280,
        attackMin: 28,
        attackMax: 46,
        defense: 16,
        xpReward: 260,
        creditDropMin: 180,
        creditDropMax: 300,
        lootPool: [
            { itemId: 'kalindra-signal-archive', chance: 1.0,  qty: 1 },
            { itemId: 'signal-fragment',         chance: 0.90, qty: 2 },
            { itemId: 'void-pattern-record',     chance: 0.60, qty: 1 },
            { itemId: 'power-cell',              chance: 0.85, qty: 2 },
        ],
    },

    // ── Orin's Crossing enemies ──────────────────────────────────────────────

    'crossing-enforcer': {
        id: 'crossing-enforcer',
        name: "Orin's Crossing Enforcer Unit",
        description: "A Sol Union-spec enforcement unit — heavier and more capable than the standard security sentry. Running patrol patterns with blanked identification codes and no registered assignment in the station's active roster. Whoever deployed these units did not file the standard authorization.",
        hp: 88,
        attackMin: 20,
        attackMax: 32,
        defense: 10,
        xpReward: 80,
        creditDropMin: 50,
        creditDropMax: 100,
        lootPool: [
            { itemId: 'crossing-classified-data', chance: 0.30, qty: 1 },
            { itemId: 'drone-scrap-parts',         chance: 0.60, qty: 1 },
            { itemId: 'power-cell',                chance: 0.50, qty: 1 },
        ],
    },
    'anomaly-sensor-array': {
        id: 'anomaly-sensor-array',
        name: 'Anomaly Sensor Array',
        description: 'A transit sensor array unit that has been modified — or has modified itself — to actively transmit on a frequency matching the relay ghost signal. Its chassis is standard Sol Union issue. Its current behavior is not. It is aware of your presence and treats you as interference.',
        hp: 65,
        attackMin: 16,
        attackMax: 28,
        defense: 6,
        xpReward: 68,
        creditDropMin: 40,
        creditDropMax: 80,
        lootPool: [
            { itemId: 'transit-anomaly-log', chance: 0.55, qty: 1 },
            { itemId: 'signal-fragment',     chance: 0.75, qty: 1 },
            { itemId: 'power-cell',          chance: 0.55, qty: 1 },
        ],
    },
    'orins-defense-prime': {
        id: 'orins-defense-prime',
        name: "Orin's Defense Prime",
        description: "The Orin's Crossing locked sector's primary security unit — a hardened command-grade enforcer configured for lethal response. It guards a processing node that has been running a comparison protocol for four months. The protocol is at 94%. The unit will not allow you to interrupt it.",
        hp: 320,
        attackMin: 32,
        attackMax: 52,
        defense: 18,
        xpReward: 300,
        creditDropMin: 210,
        creditDropMax: 360,
        lootPool: [
            { itemId: 'crossing-classified-data', chance: 1.0,  qty: 1 },
            { itemId: 'transit-anomaly-log',      chance: 0.80, qty: 1 },
            { itemId: 'signal-fragment',          chance: 0.90, qty: 2 },
            { itemId: 'power-cell',               chance: 0.85, qty: 2 },
            { itemId: 'void-pattern-record',      chance: 0.45, qty: 1 },
        ],
    },
};

/** Roll loot from an enemy's loot pool. Returns InventoryItem-shaped objects. */
export function rollLoot(enemyId: string): Array<{ id: string; name: string; qty: number; type: 'consumable' | 'salvage' | 'ammo' | 'key'; value: number }> {
    const enemy = ENEMIES[enemyId];
    if (!enemy) return [];
    const results: Array<{ id: string; name: string; qty: number; type: 'consumable' | 'salvage' | 'ammo' | 'key'; value: number }> = [];

    // Import names/types from a small inline map to avoid circular deps
    const meta: Record<string, { name: string; type: 'consumable' | 'salvage' | 'ammo' | 'key'; value: number }> = {
        'scrap-metal':           { name: 'Scrap Metal',           type: 'salvage',    value: 15 },
        'power-cell':            { name: 'Power Cell',            type: 'salvage',    value: 45 },
        'drill-component':       { name: 'Drill Component',       type: 'salvage',    value: 35 },
        'drone-scrap-parts':     { name: 'Drone Scrap Parts',     type: 'salvage',    value: 25 },
        'control-module':        { name: 'Control Module',        type: 'key',        value: 80 },
        'salvage-crate-standard':{ name: 'Salvage Crate',         type: 'salvage',    value: 60 },
        'survey-kit-damaged':    { name: 'Survey Kit (Damaged)',  type: 'key',        value: 50 },
        'pressure-valve':        { name: 'Pressure Valve',        type: 'salvage',    value: 20 },
        'cryo-component':        { name: 'Cryo Component',        type: 'salvage',    value: 55 },
        'black-box-fragment':    { name: 'Black Box Fragment',    type: 'key',        value: 120 },
        'corrupted-maintenance-log': { name: 'Corrupted Maintenance Log', type: 'key', value: 40 },
        // Phase 3 items
        'signal-fragment':       { name: 'Signal Fragment',       type: 'salvage',    value: 80 },
        'relay-data-core':       { name: 'Relay Data Core',       type: 'key',        value: 150 },
        'anomaly-trace-log':     { name: 'Anomaly Trace Log',     type: 'key',        value: 120 },
        'void-pattern-record':   { name: 'Void Pattern Record',   type: 'key',        value: 200 },
        'farpoint-cargo-bundle': { name: 'Farpoint Cargo Bundle', type: 'salvage',    value: 75 },
        'farpoint-access-chip':  { name: 'Farpoint Access Chip',  type: 'key',        value: 100 },
        // Phase 4 items
        'kalindra-nav-fragment':    { name: 'Kalindra Nav Fragment',    type: 'salvage', value: 90 },
        'kalindra-signal-archive':  { name: 'Kalindra Signal Archive',  type: 'key',     value: 220 },
        'aegis-field-log':          { name: 'Aegis Field Log',          type: 'key',     value: 180 },
        'transit-anomaly-log':      { name: 'Transit Anomaly Log',      type: 'key',     value: 160 },
        'crossing-classified-data': { name: 'Crossing Classified Data', type: 'key',     value: 200 },
    };

    for (const entry of enemy.lootPool) {
        if (Math.random() < entry.chance) {
            const m = meta[entry.itemId];
            if (m) {
                results.push({ id: entry.itemId, ...m, qty: entry.qty });
            }
        }
    }
    return results;
}

/** Roll a random credit drop in the enemy's range. */
export function rollCredits(enemyId: string): number {
    const enemy = ENEMIES[enemyId];
    if (!enemy) return 0;
    return Math.floor(
        enemy.creditDropMin + Math.random() * (enemy.creditDropMax - enemy.creditDropMin + 1),
    );
}
