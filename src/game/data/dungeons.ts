// Multi-dungeon registry for Void Sovereigns Online.
// Phase 2 adds Coldframe Station-B alongside the existing Shalehook Dig Site.
// Phase 3 adds Void Relay 7-9 and Farpoint Waystation — Outer Ring.

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

    // ── Phase 3 — Void Relay 7-9 ─────────────────────────────────────────────
    'void-relay-7-9': {
        id: 'void-relay-7-9',
        name: 'Void Relay 7-9',
        location: 'Transit Corridor — Relay Approach Zone',
        tier: 2,
        tagline: 'Tier 2  ·  Relay Transit  ·  Anomaly Site',
        introText:
            'Void Relay 7-9 has been officially non-functional for two years. ' +
            'The Chapel records show a brief active window four months ago. No vessel was logged. ' +
            'Brother Caldus says the telemetry was inconsistent with a standard reactivation cycle.\n\n' +
            'You are the first relay-capable ship to approach under contract authority in eighteen months.\n\n' +
            'Your objectives: assess the relay structure, recover what data you can, ' +
            'and neutralize whatever automated systems have been running in there — unsupervised — ' +
            'for longer than anyone will admit.',
        rooms: [
            {
                id: 'relay-approach-lock',
                name: 'Approach Lock',
                type: 'entrance',
                description:
                    'The docking collar engages with a sound that vibrates through your hull — mechanical, ' +
                    'precise, and deeply old. Emergency lighting activates along the ingress tunnel. ' +
                    'The relay\'s internal atmosphere reads nominal. Temperature is twelve degrees below standard. ' +
                    'A brass plate near the inner lock reads: VOID RELAY 7-9 — COMMISSIONED YEAR 231. ' +
                    'The current year is 412. Whatever has been running in here has been running for a very long time.',
                enemies: [],
                cleared: false,
            },
            {
                id: 'signal-cascade-chamber',
                name: 'Signal Cascade Chamber',
                type: 'combat',
                description:
                    'A wide chamber lined with signal repeater arrays — most dark, a few cycling in slow pulse patterns. ' +
                    'Two relay guardian units track your entry and advance. ' +
                    'They move with a deliberateness that suggests threat-response, not malfunction. ' +
                    'On one repeater panel, a cascade of identifiers scrolls — ' +
                    'vessel names, approach codes, transit records. Hundreds of them. ' +
                    'The most recent timestamp is two years ago. The next most recent is forty-one.',
                enemies: ['relay-guardian-mk1', 'relay-guardian-mk1'],
                cleared: false,
            },
            {
                id: 'archive-node-room',
                name: 'Archive Node',
                type: 'loot',
                description:
                    'A narrow utility room housing the relay\'s local data archive. ' +
                    'The hardware is intact. The records are not. ' +
                    'Transit logs show vessels arriving at this relay — but the timestamps are wrong. ' +
                    'Ships that arrived six months ago are logged as arriving eighteen months from now. ' +
                    'The most recent entry, filed forty-three days ago, reads: ' +
                    'TRANSIT SUCCESSFUL — VESSEL: UNKNOWN — DESTINATION: UNKNOWN — DURATION: 0 SECONDS. ' +
                    'A zero-second transit. Through a relay that was supposed to be non-functional.',
                enemies: [],
                lootItems: ['relay-data-core', 'anomaly-trace-log', 'power-cell'],
                cleared: false,
            },
            {
                id: 'transit-corridor',
                name: 'Transit Corridor',
                type: 'combat',
                description:
                    'The main corridor leading to the relay core. Wide enough for a small craft to pass. ' +
                    'Something has been using it. ' +
                    'Three fractured probe units drift in holding patterns near the core entrance. ' +
                    'Their chassis designs are unfamiliar — not Guild, not Commonwealth, not any catalog you have seen. ' +
                    'They register your presence and orient. Waiting was apparently not their final instruction.',
                enemies: ['fractured-probe', 'fractured-probe', 'relay-guardian-mk1'],
                cleared: false,
            },
            {
                id: 'relay-core',
                name: 'Relay Core — Core Sentinel',
                type: 'boss',
                description:
                    'The heart of Void Relay 7-9. A cylindrical chamber running the full height of the structure. ' +
                    'At the center, suspended in a cradle of active cabling, the Relay Core Sentinel stands motionless. ' +
                    'It is larger than any standard automated unit — older, heavier, built for a purpose ' +
                    'that predates current manufacturing standards. ' +
                    'Every screen in the chamber shows the same image: a waveform. ' +
                    'Not the same one from Coldframe Station-B. A different one. But with the same shape. ' +
                    'The sentinel activates when you cross the threshold. ' +
                    'It does not speak. It does not broadcast a warning. It simply begins.',
                enemies: ['relay-core-sentinel'],
                cleared: false,
            },
        ],
        contractCompletions: [
            { contractId: 'relay-approach-survey',  requireAnyProgress: true },
            { contractId: 'ica-relay-assessment',   requireBossCleared: true },
            { contractId: 'covenant-relay-data',    requireLootCleared: true },
            { contractId: 'relay-ghost-telemetry',  requireAnyProgress: true },
        ],
        clearFlag: 'relay-jump-completed',
    },

    // ── Phase 3 — Farpoint Waystation ────────────────────────────────────────
    'farpoint-outer-ring': {
        id: 'farpoint-outer-ring',
        name: 'Farpoint Waystation — Outer Ring',
        location: 'Farpoint Waystation  ·  Grid Node 7-9-F',
        tier: 3,
        tagline: 'Tier 3  ·  Post-Relay  ·  Frontier Salvage',
        introText:
            'Farpoint Waystation was a major freight transfer node before the relay network collapsed. ' +
            'Two years of isolation. A skeleton crew running the core sections. ' +
            'The outer ring is officially uncontrolled — no manifest authority, no clearance requirement.\n\n' +
            'That also means no backup, no evac, and no record of you being here.\n\n' +
            'Your objectives: recover salvage from the freight holds, ' +
            'investigate the anomaly signal in Grid 4, ' +
            'and clear the automated security systems that have been running without human oversight ' +
            'for twenty-six months.',
        rooms: [
            {
                id: 'farpoint-docking-bay',
                name: 'Farpoint Docking Bay D',
                type: 'entrance',
                description:
                    'The docking bay is functional but neglected — emergency lighting only, ' +
                    'half the mooring clamps seized with corrosion. ' +
                    'A hand-painted sign near the inner door reads: FARPOINT WAYSTATION — OUTER RING — UNCONTROLLED ZONE. ' +
                    'Beyond the bay windows, the station sprawls across a dead freight node: ' +
                    'cargo rings, hab modules, loading scaffolds, most of it dark. ' +
                    'This is the edge of Meridian\'s local zone. Everything past this point is something different.',
                enemies: [],
                cleared: false,
            },
            {
                id: 'freight-hold-7',
                name: 'Freight Hold 7',
                type: 'loot',
                description:
                    'A sealed freight hold, untouched for at least two years. ' +
                    'Cargo containers stacked to the ceiling — manifested loads for routes that no longer exist. ' +
                    'Most are standard industrial: raw ore, spare parts, insulation fiber. ' +
                    'One container is different. Unmarked. Sealed with a non-standard lock. ' +
                    'The contents rattle when you shake it — something loose inside, something that was not packed. ' +
                    'You leave it sealed. For now.',
                enemies: [],
                lootItems: ['farpoint-cargo-bundle', 'power-cell', 'farpoint-cargo-bundle'],
                cleared: false,
            },
            {
                id: 'farpoint-security-checkpoint',
                name: 'Security Checkpoint — Level 2',
                type: 'combat',
                description:
                    'A former customs inspection point. The checkpoint equipment is still operational. ' +
                    'Two security sentry units patrol in fixed loops. ' +
                    'One of the units has a maintenance tag zip-tied to its chassis: UNIT FAULT — DO NOT RESTART. ' +
                    'Someone restarted it. Again.',
                enemies: ['farpoint-sentry', 'farpoint-sentry'],
                cleared: false,
            },
            {
                id: 'farpoint-logistics-core',
                name: 'Logistics Core',
                type: 'combat',
                description:
                    'The outer ring\'s freight coordination center — still running on minimal power. ' +
                    'A sentry unit stands between you and the administrative terminal. ' +
                    'Beside it, something else is active: a fractured probe unit of the same type found in the relay. ' +
                    'It has no business being here. ' +
                    'When you enter, it turns — not a sensor sweep, but the focused turn of something that was specifically waiting.',
                enemies: ['farpoint-sentry', 'fractured-probe'],
                cleared: false,
            },
            {
                id: 'farpoint-security-prime-room',
                name: 'Station Security Node — Prime Coordinator',
                type: 'boss',
                description:
                    'The outer ring\'s central security coordinator, in a hardened control room at the far end of the logistics wing. ' +
                    'It is overloaded — running coordination protocols for a station that is now a fraction of its original size, ' +
                    'routing security responses through systems that no longer exist. ' +
                    'Half its screens show ERROR. Half show live feeds of empty corridors it is still watching. ' +
                    'It registers you as an unauthorized access event and begins a lockdown sequence. ' +
                    'The lockdown is for a station ten times this size. It will not stop trying.',
                enemies: ['farpoint-security-prime'],
                cleared: false,
            },
        ],
        contractCompletions: [
            { contractId: 'farpoint-first-contact',      requireAnyProgress: true },
            { contractId: 'farpoint-salvage-extraction', requireLootCleared: true },
            { contractId: 'anomaly-trace-farpoint',      requireBossCleared: true },
        ],
        clearFlag: 'farpoint-cleared',
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
