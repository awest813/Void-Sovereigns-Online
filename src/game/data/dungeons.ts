// Multi-dungeon registry for Void Sovereigns Online.
// Phase 2 adds Coldframe Station-B alongside the existing Shalehook Dig Site.

export interface Room {
    id: string;
    name: string;
    type: 'entrance' | 'combat' | 'loot' | 'hazard' | 'boss';
    description: string;
    /** Enemy IDs to spawn in this room. */
    enemies: string[];
    /** Item IDs always found in loot/hazard rooms. */
    lootItems?: string[];
    cleared: boolean;
}

export interface ContractCompletion {
    contractId: string;
    requireBossCleared?: boolean;
    requireLootCleared?: boolean;
    requireAnyProgress?: boolean;
}

export interface DungeonDef {
    id: string;
    name: string;
    location: string;
    tier: number;
    tagline: string;
    introText: string;
    rooms: Room[];
    contractCompletions: ContractCompletion[];
    /** Flag to set when full-clearing the dungeon. */
    clearFlag?: string;
}

// ── Shalehook Dig Site ───────────────────────────────────────────────────────

const shalehookRooms: Room[] = [
    {
        id: 'entry-shaft',
        name: 'Entry Shaft',
        type: 'entrance',
        description:
            'The access shaft is still intact. Emergency lighting casts everything in dull orange. ' +
            'Boot prints in the grime — old ones, weeks at least. ' +
            'Deeper in, you can hear the grind of machinery that should have been silent for years.',
        enemies: [],
        cleared: false,
    },
    {
        id: 'upper-gallery',
        name: 'Upper Gallery',
        type: 'combat',
        description:
            'A wide excavation gallery. Two Mk.I mining drones move in lazy patrol loops. ' +
            'They register your presence and reorient. ' +
            'Someone has scratched a tally into the rock face — fourteen marks, crossed in groups of five.',
        enemies: ['mining-drone-mk1', 'mining-drone-mk1'],
        cleared: false,
    },
    {
        id: 'equipment-depot',
        name: 'Equipment Depot',
        type: 'loot',
        description:
            'A storage alcove cut into the side wall. Racks of survey equipment, most corroded. ' +
            'A Guild survey kit in a sealed case is still intact — the data core light is green. ' +
            'A crate of salvageable components sits open nearby.',
        enemies: [],
        lootItems: ['survey-kit-damaged', 'scrap-metal', 'power-cell'],
        cleared: false,
    },
    {
        id: 'lower-drill-chamber',
        name: 'Lower Drill Chamber',
        type: 'combat',
        description:
            'The main drilling floor. Massive bore machinery fills the center of the room. ' +
            'A Mk.II drone and a Drill Sentinel run coordinated patterns. ' +
            'The Sentinel turns its bore-head toward you.',
        enemies: ['mining-drone-mk2', 'drill-sentinel'],
        cleared: false,
    },
    {
        id: 'core-access',
        name: 'Core Access — Excavator Prime',
        type: 'boss',
        description:
            'The deepest chamber. The original excavator unit stands motionless until you step past the threshold. ' +
            'Then it moves. Its control module glows through a cracked chassis panel. ' +
            'It seems to be running a task loop that has been cycling since the site went dark.',
        enemies: ['excavator-prime'],
        cleared: false,
    },
];

// ── Coldframe Station-B ──────────────────────────────────────────────────────

const coldframeRooms: Room[] = [
    {
        id: 'coldframe-airlock',
        name: 'Docking Airlock',
        type: 'entrance',
        description:
            'The airlock cycles with a groan. Ambient temperature inside is far below standard — ' +
            'the life support recyclers are running on minimum. ' +
            'A crew manifest is posted by the inner door. Seven names. ' +
            'The "last check-in" column has been left blank for forty-two days.',
        enemies: [],
        cleared: false,
    },
    {
        id: 'cryo-corridor',
        name: 'Cryo Storage Corridor',
        type: 'combat',
        description:
            'A long corridor lined with emergency cryo-pods, most dark. One is open — empty. ' +
            'Two atmosphere hazard units move between the pods, exhaust venting in low-pressure mist. ' +
            'A maintenance tag on the wall reads: UNIT FAULT — DO NOT RESTART. The unit has been restarted.',
        enemies: ['atmo-hazard-unit', 'atmo-hazard-unit'],
        cleared: false,
    },
    {
        id: 'operations-bay',
        name: 'Operations Bay',
        type: 'loot',
        description:
            'The operations center is intact but dark. Consoles show partial logs from six weeks ago — ' +
            'routine extraction records that end mid-shift with no note. ' +
            'A sealed kit rack and a cryo-component crate are secured to the wall. ' +
            'On the main console screen, one line of text repeats: NODE QUERY UNRESOLVED.',
        enemies: [],
        lootItems: ['cryo-component', 'corrupted-maintenance-log', 'power-cell'],
        cleared: false,
    },
    {
        id: 'habitat-ring',
        name: 'Habitat Ring',
        type: 'combat',
        description:
            'The crew quarters. Personal effects still in bunks. A meal half-eaten. ' +
            'Someone left in a hurry — or did not leave at all. ' +
            'A Mk.II drone and a cryo-locked unit patrol the corridor. ' +
            'The cryo unit moves wrong — stiff, lurching, as if it does not understand its own joints.',
        enemies: ['mining-drone-mk2', 'cryo-locked-unit'],
        cleared: false,
    },
    {
        id: 'facility-control',
        name: 'Facility Control — Controller Alpha',
        type: 'boss',
        description:
            'The heart of Coldframe Station-B\'s automated network. ' +
            'Controller Alpha stands in the center of the room, six limbs extended in a full-radial scan posture. ' +
            'Every terminal in the room is active. The screens all show the same thing: a waveform. ' +
            'Steady. Regular. Something is still broadcasting from here.',
        enemies: ['facility-controller-alpha'],
        cleared: false,
    },
];

// ── Registry ─────────────────────────────────────────────────────────────────

export const DUNGEON_REGISTRY: Record<string, DungeonDef> = {
    'shalehook-dig-site': {
        id: 'shalehook-dig-site',
        name: 'Shalehook Dig Site',
        location: 'Asteroid 44-Kheras  ·  Ashwake Belt',
        tier: 1,
        tagline: 'Tier 1  ·  Rogue Automation',
        introText:
            'An old Guild prospecting operation — abandoned twelve years ago. ' +
            'The automated systems were supposed to be shut down.\n\n' +
            'They were not.\n\n' +
            'Your objectives: clear the site, recover salvage, and eliminate Excavator Prime. ' +
            'Complete your accepted contracts to earn the full payout on return.',
        rooms: shalehookRooms,
        contractCompletions: [
            { contractId: 'robot-suppression-shalehook', requireBossCleared: true },
            { contractId: 'scrap-recovery-shalehook',    requireLootCleared: true },
            { contractId: 'equipment-retrieval-shalehook', requireLootCleared: true },
        ],
        clearFlag: 'completed-first-run',
    },

    'coldframe-station-b': {
        id: 'coldframe-station-b',
        name: 'Coldframe Station-B',
        location: 'Outer Ashwake Belt  ·  Sector Grid 7',
        tier: 1,
        tagline: 'Tier 1  ·  Missing Crew / Environmental Hazard',
        introText:
            'A worker habitat on the outer edge of the Ashwake Belt — forty-two days dark. ' +
            'The Guild sent a survey ping three weeks ago. No response.\n\n' +
            'Seven crew members were last logged aboard. Nobody filed a departure record.\n\n' +
            'Your objectives: recover salvage, retrieve the crew\'s black box data, ' +
            'and neutralize whatever reactivated the facility automation.',
        rooms: coldframeRooms,
        contractCompletions: [
            { contractId: 'missing-crew-coldframe',        requireBossCleared: true },
            { contractId: 'scrap-recovery-coldframe',      requireLootCleared: true },
            { contractId: 'salvage-cold-frame-components', requireLootCleared: true },
        ],
        clearFlag: 'completed-coldframe',
    },
};

/** Returns a fresh copy of a dungeon (rooms reset to uncleared). */
export function loadDungeon(dungeonId: string): DungeonDef | null {
    const def = DUNGEON_REGISTRY[dungeonId];
    if (!def) return null;
    return {
        ...def,
        rooms: def.rooms.map(r => ({ ...r, enemies: [...r.enemies], cleared: false })),
    };
}
