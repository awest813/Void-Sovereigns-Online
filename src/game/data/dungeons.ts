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

    // ── Phase 4 — Kalindra Processing Hub ────────────────────────────────────
    'kalindra-processing-hub': {
        id: 'kalindra-processing-hub',
        name: 'Kalindra Processing Hub',
        location: 'Kalindra Drift  ·  Dead Trade Node  ·  Interior Access',
        tier: 3,
        tagline: 'Tier 3  ·  Salvage & Anomaly  ·  Classified Interior',
        introText:
            'Kalindra Processing Hub processed bulk ore freight until two years ago, when the relay network collapsed ' +
            'and the crew disappeared without filing an evacuation record. ' +
            'The Frontier Compact has salvage rights on the outer sections. ' +
            'Aegis Division has classified the inner sections under a notice dated before the relay reopened.\n\n' +
            'Whatever is in the signal relay room, both organizations want it. ' +
            'One of them hired you. The other will not be happy you are here.\n\n' +
            'Your objectives: recover freight salvage, reach the classified inner sections, ' +
            'and find out what the signal relay room has been receiving.',
        rooms: [
            {
                id: 'kalindra-docking-collar',
                name: 'Outer Docking Collar',
                type: 'entrance',
                description:
                    'The outer collar cycles clean — well-maintained for an abandoned station. ' +
                    'Emergency lighting activates on entry. ' +
                    'A Frontier Compact access authorization is posted at the inner lock. ' +
                    'Below it, an Aegis Division classification notice with a date stamp that reads eleven months ago — ' +
                    'seven months before the relay reopened.',
                enemies: [],
                cleared: false,
            },
            {
                id: 'kalindra-freight-floor',
                name: 'Freight Processing Floor',
                type: 'loot',
                description:
                    'Two years of unclaimed freight. Ore manifests, processed and packed, waiting for routes that no longer exist. ' +
                    'Standard industrial cargo — and one container that is not standard. ' +
                    'Non-standard lock code. Predates the hub\'s own cargo registry. ' +
                    'Whatever is inside was not included in the official manifest.',
                enemies: [],
                lootItems: ['kalindra-nav-fragment', 'farpoint-cargo-bundle', 'power-cell'],
                cleared: false,
            },
            {
                id: 'kalindra-processing-level',
                name: 'Processing Level — Automation Control',
                type: 'combat',
                description:
                    'The ore processing floor. Automated conveyor systems still run their loops — someone or something ' +
                    'has been running maintenance cycles. Two freight-handling drones have been repurposed for security. ' +
                    'They were not designed for it. They are doing it anyway.',
                enemies: ['kalindra-freight-drone', 'kalindra-freight-drone'],
                cleared: false,
            },
            {
                id: 'kalindra-operations-deck',
                name: 'Operations Deck',
                type: 'combat',
                description:
                    'The hub operations center. Consoles still display process logs — they end mid-cycle, mid-sentence, ' +
                    'as if the crew stopped entering data rather than completing their shift. ' +
                    'A Kalindra security sentinel runs a patrol pattern across the floor. ' +
                    'In the far corner, a compact probe unit — the same chassis pattern as the ones found in Void Relay 7-9 — ' +
                    'is active. Transmitting. It has no business being here.',
                enemies: ['kalindra-security-sentinel', 'fractured-probe'],
                cleared: false,
            },
            {
                id: 'kalindra-signal-relay-room',
                name: 'Signal Relay Room — Hub Coordinator',
                type: 'boss',
                description:
                    'Every screen in the signal relay room is active. Every screen shows the same waveform. ' +
                    'Not identical to the Coldframe or Relay 7-9 waveforms — but the same shape, the same interval, ' +
                    'the same underlying pattern. ' +
                    'The Kalindra Hub Coordinator stands in the center of the room — ' +
                    'running management and logistics protocols for a station that has been dark for two years. ' +
                    'It is receiving instructions from somewhere. ' +
                    'It is sending responses. ' +
                    'It registers your entry as an access event and responds to the only instruction it has ' +
                    'for unauthorized personnel.',
                enemies: ['kalindra-hub-coordinator'],
                cleared: false,
            },
        ],
        contractCompletions: [
            { contractId: 'frontier-supply-run-kalindra',    requireAnyProgress: true },
            { contractId: 'frontier-route-survey-kalindra',  requireAnyProgress: true },
            { contractId: 'frontier-salvage-certification',  requireLootCleared: true },
            { contractId: 'aegis-sealed-site-recovery',      requireBossCleared: true },
            { contractId: 'aegis-missing-team-kalindra',     requireBossCleared: true },
            { contractId: 'vanta-off-book-salvage',          requireLootCleared: true },
            { contractId: 'redline-kalindra-core',           requireBossCleared: true },
        ],
        clearFlag: 'kalindra-cleared',
    },

    // ── Phase 4 — Orin's Crossing Locked Sector ──────────────────────────────
    "orins-crossing-locked-sector": {
        id: 'orins-crossing-locked-sector',
        name: "Orin's Crossing — Locked Sector",
        location: "Orin's Crossing Transit Station  ·  Restricted Access",
        tier: 4,
        tagline: "Tier 4  ·  Military Station  ·  Classified Zone",
        introText:
            "A sealed section of Orin's Crossing that Commander Dresh will not discuss. " +
            'It has been locked for at least three years — predating the recent anomaly events — ' +
            'and the access codes have been rotated seven times in the last four months.\n\n' +
            'Someone keeps updating the locks. Someone who is not Commander Dresh.\n\n' +
            'Inside are sensor array logs that have never been exported to the station record. ' +
            'And equipment containers with markings that do not match any organization in the public registry.\n\n' +
            'Your objectives: penetrate the locked sector, recover the raw sensor archive data, ' +
            'and find out what is actually being run in there.',
        rooms: [
            {
                id: 'crossing-sealed-threshold',
                name: 'Sealed Sector Threshold',
                type: 'entrance',
                description:
                    'Standard Sol Union lock panel — the same as every other checkpoint on the station. ' +
                    'The access log shows the last authorized entry as three years ago. ' +
                    'The last lock rotation was four days ago. ' +
                    'Whoever is updating these codes has authorization that bypasses the garrison\'s own records.',
                enemies: [],
                cleared: false,
            },
            {
                id: 'crossing-classified-storage',
                name: 'Classified Equipment Storage',
                type: 'loot',
                description:
                    'Containers with Sol Union markings, Aegis Division markings, and one set of markings ' +
                    'that does not match any organization in the public registry. ' +
                    'The third set uses a classification code prefix that does not appear in any index you have access to. ' +
                    'The containers are sealed. The seals are recent.',
                enemies: [],
                lootItems: ['crossing-classified-data', 'transit-anomaly-log', 'power-cell'],
                cleared: false,
            },
            {
                id: 'crossing-enforcer-post',
                name: 'Enforcer Post — Internal Patrol',
                type: 'combat',
                description:
                    'Two Orin\'s Crossing enforcement units — active, running precise patrol patterns. ' +
                    'Their identification codes are blanked. No registered assignment in the station roster. ' +
                    'Whoever deployed them did not file the paperwork with Commander Dresh.',
                enemies: ['crossing-enforcer', 'crossing-enforcer'],
                cleared: false,
            },
            {
                id: 'crossing-sensor-array-room',
                name: 'Transit Sensor Array Hub',
                type: 'combat',
                description:
                    'The locked sector\'s sensor array hub. Every display logs the twelve anomalous transit events ' +
                    'that Commander Dresh forwarded to Sol Union command — and at least forty more that were never forwarded. ' +
                    'An anomaly sensor unit is actively transmitting on a frequency that matches the relay ghost signal. ' +
                    'A crossing enforcer stands between you and the archive terminal.',
                enemies: ['anomaly-sensor-array', 'crossing-enforcer'],
                cleared: false,
            },
            {
                id: 'crossing-core-node',
                name: 'Core Processing Node — Defense Prime',
                type: 'boss',
                description:
                    'A hardened processing node running a comparison protocol — cross-referencing transit records ' +
                    'from twelve separate relay sites against an unknown target pattern. ' +
                    'The Orin\'s Defense Prime unit is configured for lethal response. ' +
                    'Whatever it is protecting, someone decided it was worth more than the lives of anyone who got this far. ' +
                    'The comparison protocol has been running for four months. ' +
                    'The progress indicator reads: 94%.',
                enemies: ['orins-defense-prime'],
                cleared: false,
            },
        ],
        contractCompletions: [
            { contractId: 'sol-union-compliance-check',     requireAnyProgress: true },
            { contractId: 'sol-union-sector-enforcement',   requireBossCleared: true },
            { contractId: 'aegis-anomaly-trace-orin',       requireBossCleared: true },
        ],
        clearFlag: 'orins-crossing-cleared',
    },

    // ── Phase 5 — Vault of the Broken Signal ─────────────────────────────────
    'vault-of-the-broken-signal': {
        id: 'vault-of-the-broken-signal',
        name: 'Vault of the Broken Signal',
        location: 'Kalindra Drift  ·  Outer Industrial Zone  ·  Deep Access',
        tier: 4,
        tagline: 'Tier 4  ·  REDLINE  ·  Illegal Salvage  ·  Industrial Horror',
        introText:
            'The Vault of the Broken Signal is a bulk-cargo storage facility that pre-dates the Kalindra Hub. ' +
            'It does not appear on the Frontier Compact\'s salvage manifest. ' +
            'It does not appear on the Aegis classification notice. ' +
            'It does not appear on any map filed in the last forty years.\n\n' +
            'Crow Veslin found its location in the unlogged freight manifest you recovered from the Hub. ' +
            '"It\'s been broadcasting," Crow said. "Continuously. Nobody filed a complaint ' +
            'because nobody knew it was there." ' +
            'A pause. "Whatever is in there has been sending something to something else for a very long time."\n\n' +
            'Your objectives: breach the vault, recover the coordination node and cargo manifest, ' +
            'and extract alive. The Overseer unit is still active. ' +
            'It knows you are here. It stopped broadcasting the moment your ship docked.',
        rooms: [
            {
                id: 'vault-outer-access',
                name: 'Outer Access Shaft',
                type: 'entrance',
                description:
                    'The entry shaft is industrial-grade and well-maintained — ' +
                    'far better maintained than any abandoned facility should be. ' +
                    'The air recyclers are running. The lights are on. ' +
                    'A service log is posted near the inner lock, updated as recently as six weeks ago. ' +
                    'The handwriting is printed in exactly the same font every time. ' +
                    'No human wrote these entries.',
                enemies: [],
                cleared: false,
            },
            {
                id: 'vault-cold-storage',
                name: 'Cold Storage Bay',
                type: 'loot',
                description:
                    'A climate-controlled cargo bay holding a curated selection of components that ' +
                    'should not be in the same place together — relay hardware, nav modules, ' +
                    'salvage pieces from at least four different decommissioned facilities. ' +
                    'Someone has been gathering things here. Not hoarding. Collecting. ' +
                    'One crate near the back is labelled with a symbol that does not appear in ' +
                    'any cargo registry you can access.',
                enemies: [],
                lootItems: ['broken-signal-core', 'contraband-relay-module', 'power-cell'],
                cleared: false,
            },
            {
                id: 'vault-processing-wing',
                name: 'Processing Wing',
                type: 'combat',
                description:
                    'The vault\'s cargo processing floor. Two security drones run patrol loops ' +
                    'with military-grade precision — not the lazy loops of automated systems left running too long. ' +
                    'These were updated recently. The update happened after your ship appeared on approach sensors.',
                enemies: ['vault-security-drone', 'vault-security-drone'],
                cleared: false,
            },
            {
                id: 'vault-receiving-deck',
                name: 'Receiving Deck',
                type: 'combat',
                description:
                    'The industrial receiving floor. A corrupted loader unit moves through the space with ' +
                    'a fluidity that no loader should have — its manipulator arms repositioning cargo with ' +
                    'something that looks like purpose. ' +
                    'A vault security drone maintains overwatch from the upper gantry. ' +
                    'On the main console, a shipping manifest is displayed. ' +
                    'The destination field reads: IN TRANSIT — ARRIVAL PENDING.',
                enemies: ['corrupted-loader-unit', 'vault-security-drone'],
                cleared: false,
            },
            {
                id: 'vault-coordinator-core',
                name: 'Coordinator Core — Vault Overseer',
                type: 'boss',
                description:
                    'The Vault\'s central chamber. The Overseer unit stands in the center — ' +
                    'a heavy coordination chassis surrounded by active display screens. ' +
                    'Every screen shows the same thing: an incoming transmission queue. ' +
                    'Thousands of entries. Sorted. Prioritized. Answered. ' +
                    'The sender field on every message reads: RELAY NODE — ORIGIN UNREGISTERED. ' +
                    'The Overseer turned to face you before you crossed the threshold. ' +
                    'It was waiting. ' +
                    'It says: "You are not the courier." ' +
                    'Then the screens all go dark.',
                enemies: ['vault-overseer'],
                cleared: false,
            },
        ],
        contractCompletions: [
            { contractId: 'redline-vault-broken-signal',    requireBossCleared: true },
            { contractId: 'vanta-vault-intel-run',          requireLootCleared: true },
            { contractId: 'frontier-ghost-box-extraction',  requireBossCleared: true },
        ],
        clearFlag: 'vault-broken-signal-cleared',
    },

    // ── Phase 5 — Ashveil Observation Post ───────────────────────────────────
    'ashveil-observation-post': {
        id: 'ashveil-observation-post',
        name: 'Ashveil Observation Post',
        location: 'Far Frontier  ·  Grid Node 7-9-P  ·  Deep Relay Zone',
        tier: 5,
        tagline: 'Tier 5  ·  REDLINE  ·  Anomaly Site  ·  Void-Adjacent',
        introText:
            'Ashveil Observation Post was established by the Helion Synod to monitor void relay anomaly activity ' +
            'from the far edge of the 7-9 relay corridor. ' +
            'Its crew filed regular reports for eight months after the relay network collapsed. ' +
            'Then the reports continued without the crew.\n\n' +
            'Aris Vel has been tracking Ashveil\'s broadcast signature for eleven months. ' +
            '"The post is still recording," she says. "It\'s still filing reports in the standard format — ' +
            'structured, legible, detailed. The crew\'s names still appear in the author field." ' +
            'A pause. "The crew has been dead for twenty-three months."\n\n' +
            'Your objectives: reach the observation core, recover the full monitoring record, ' +
            'and extract with a void fragment sample for the Synod. ' +
            'Whatever is running this place knows what a human observer looks like. ' +
            'It will respond accordingly.',
        rooms: [
            {
                id: 'ashveil-docking-bay',
                name: 'Docking Bay — Post Entry',
                type: 'entrance',
                description:
                    'The docking bay is intact and clean — maintained, not just preserved. ' +
                    'A crew roster is posted at the inner door, handwritten, with check marks next to each name. ' +
                    'The check marks were added recently. The paper is old. ' +
                    'Through the viewports, the post\'s exterior runs lights in a slow pulse pattern — ' +
                    'the same interval as the waveform from every other site. ' +
                    'The moment your boot crosses the inner threshold, the pulse pattern changes. ' +
                    'Faster. Something inside noticed you.',
                enemies: [],
                cleared: false,
            },
            {
                id: 'ashveil-sensor-archive',
                name: 'Sensor Archive Room',
                type: 'loot',
                description:
                    'The archive room contains twenty-three months of void relay telemetry. ' +
                    'Storage racks line every wall, organized and labeled in the crew\'s handwriting. ' +
                    'The most recent labels are dated last week. ' +
                    'A containment case on the center table holds a void fragment sample — ' +
                    'properly packaged, properly labeled, waiting for a courier that was never coming. ' +
                    'The label reads: FOR SYNOD TRANSFER — HOLD FOR PICKUP.',
                enemies: [],
                lootItems: ['ashveil-observation-log', 'void-fragment-sample', 'signal-fragment'],
                cleared: false,
            },
            {
                id: 'ashveil-monitoring-floor',
                name: 'Monitoring Floor',
                type: 'combat',
                description:
                    'The active monitoring stations — every terminal running, every screen live. ' +
                    'Two ghost units move between the stations on patrol patterns that would make sense ' +
                    'for a human security team. They move like they remember what they were supposed to be. ' +
                    'One of them has a name tag still attached to its chassis. ' +
                    'The name tag belongs to a crew member listed as deceased.',
                enemies: ['ashveil-ghost-unit', 'ashveil-ghost-unit'],
                cleared: false,
            },
            {
                id: 'ashveil-signal-chamber',
                name: 'Signal Propagation Chamber',
                type: 'combat',
                description:
                    'A chamber lined with void-resonance emitters — the same type found at the relay, ' +
                    'at Kalindra Hub, at every anomaly site in the pattern. ' +
                    'Except these were not found here. They were built here. Purpose-designed. ' +
                    'By the Helion Synod\'s research team, according to the fabrication records on the wall. ' +
                    'A ghost unit stands guard at the door to the observation core. ' +
                    'A void resonance emitter has repositioned itself to block the secondary access.',
                enemies: ['void-resonance-emitter', 'ashveil-ghost-unit'],
                cleared: false,
            },
            {
                id: 'ashveil-observation-core',
                name: 'Observation Core — Ashveil Terminal Prime',
                type: 'boss',
                description:
                    'The heart of the Observation Post. Every screen is active. Every screen shows reports — ' +
                    'filed, formatted, authored. ' +
                    'The Terminal Prime unit stands at the center console, ' +
                    'its chassis oriented toward the main display as if reading. ' +
                    'It turns when you enter. ' +
                    'A recorded voice speaks — one of the crew\'s voices, clearly sampled, clearly not them: ' +
                    '"You are not the expected contact. This facility is not accepting unscheduled visitors." ' +
                    'A pause. The screens all change at once. ' +
                    '"Exception logged. Threat protocol initiated."',
                enemies: ['ashveil-terminal-prime'],
                cleared: false,
            },
        ],
        contractCompletions: [
            { contractId: 'redline-ashveil-data-extraction',  requireBossCleared: true },
            { contractId: 'redline-helion-anomaly-sample',    requireLootCleared: true },
            { contractId: 'aegis-black-site-breach',          requireBossCleared: true },
        ],
        clearFlag: 'ashveil-post-cleared',
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
