import { Dungeon } from '../../shared/types/dungeon';

/**
 * Phase 3 dungeon definitions — editorial reference data.
 * Actual playable dungeon data lives in src/game/data/dungeons.ts (DUNGEON_REGISTRY).
 */
export const phase3Dungeons: Dungeon[] = [
    {
        id: 'void-relay-7-9',
        name: 'Void Relay 7-9',
        type: 'installation',
        tier: 2,
        sector: 'void-relay-7-9',
        description:
            'The first relay-jump dungeon. Void Relay 7-9 has been officially non-functional for two years, ' +
            'yet signal data recorded by the Relay Chapel suggests it has been running on its own. ' +
            'The relay structure is old, autonomous, and guarded by systems that predate the Commonwealth. ' +
            'Successfully clearing the relay core sets the relay-jump-completed flag and opens Farpoint Waystation.',
        rooms: [
            {
                id: 'relay-approach-lock',
                type: 'entrance',
                description:
                    'The docking collar engages. Emergency lighting activates. ' +
                    'A brass plate reads: VOID RELAY 7-9 — COMMISSIONED YEAR 231. ' +
                    'The current year is 412.',
            },
            {
                id: 'signal-cascade-chamber',
                type: 'combat',
                description:
                    'Signal repeater arrays, a few cycling in slow pulse patterns. ' +
                    'Two relay guardian units advance. The timestamp on the scroll panel ' +
                    'shows the most recent vessel entry as forty-one years ago.',
                encounters: ['relay-guardian-mk1', 'relay-guardian-mk1'],
            },
            {
                id: 'archive-node-room',
                type: 'loot',
                description:
                    'Transit logs with impossible timestamps — ships arriving months from now. ' +
                    'Most recent entry: TRANSIT SUCCESSFUL — VESSEL: UNKNOWN — DURATION: 0 SECONDS.',
            },
            {
                id: 'transit-corridor',
                type: 'combat',
                description:
                    'Three fractured probe units of unidentified manufacture drift in holding patterns. ' +
                    'Their chassis designs do not match any catalog.',
                encounters: ['fractured-probe', 'fractured-probe', 'relay-guardian-mk1'],
            },
            {
                id: 'relay-core',
                type: 'boss',
                description:
                    'The Relay Core Sentinel. Pre-Commonwealth manufacture. Internal clock returns no valid timestamp. ' +
                    'Every screen shows the same waveform — different from Coldframe, but the same shape.',
                encounters: ['relay-core-sentinel'],
            },
        ],
        bossId: 'relay-core-sentinel',
        rewards: {
            creditRange: [400, 700],
            xpRange: [300, 500],
            lootTable: ['relay-data-core', 'anomaly-trace-log', 'signal-fragment', 'void-pattern-record', 'power-cell'],
        },
        tags: ['tier-2', 'relay', 'anomaly', 'phase-3', 'milestone', 'void-adjacent'],
    },
    {
        id: 'farpoint-outer-ring',
        name: 'Farpoint Waystation — Outer Ring',
        type: 'installation',
        tier: 3,
        sector: 'farpoint-waystation',
        description:
            'The first post-relay dungeon. Farpoint Waystation was a major freight transfer node before ' +
            'the relay network collapsed. Two years of isolation have left the outer ring uncontrolled. ' +
            'Freight salvage, anomaly signals, overloaded security automation, and a fractured probe ' +
            'that has no business being this far from the relay.',
        rooms: [
            {
                id: 'farpoint-docking-bay',
                type: 'entrance',
                description:
                    'Emergency lighting. Half the mooring clamps seized with corrosion. ' +
                    'Sign reads: FARPOINT WAYSTATION — OUTER RING — UNCONTROLLED ZONE.',
            },
            {
                id: 'freight-hold-7',
                type: 'loot',
                description:
                    'Two years of untouched freight. Standard industrial cargo — and one unmarked, ' +
                    'non-standard-locked container with something loose inside.',
            },
            {
                id: 'farpoint-security-checkpoint',
                type: 'combat',
                description:
                    'Two security sentry units. One has a tag: UNIT FAULT — DO NOT RESTART. ' +
                    'Someone restarted it. Again.',
                encounters: ['farpoint-sentry', 'farpoint-sentry'],
            },
            {
                id: 'farpoint-logistics-core',
                type: 'combat',
                description:
                    'A fractured probe — same type as the relay — is active here. ' +
                    'It has no business being in Farpoint. It turns when you enter.',
                encounters: ['farpoint-sentry', 'fractured-probe'],
            },
            {
                id: 'farpoint-security-prime-room',
                type: 'boss',
                description:
                    'The Prime Coordinator: running lockdown protocols for a station ten times its current size. ' +
                    'Half its screens show ERROR. Half show live feeds of corridors it is still watching.',
                encounters: ['farpoint-security-prime'],
            },
        ],
        bossId: 'farpoint-security-prime',
        rewards: {
            creditRange: [600, 1000],
            xpRange: [420, 650],
            lootTable: ['farpoint-cargo-bundle', 'farpoint-access-chip', 'signal-fragment', 'power-cell'],
        },
        tags: ['tier-3', 'farpoint', 'post-relay', 'frontier', 'phase-3'],
    },
];
