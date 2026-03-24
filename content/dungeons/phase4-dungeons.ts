import { Dungeon } from '../../shared/types/dungeon';

/**
 * Phase 4 dungeon definitions — editorial reference data.
 * Actual playable dungeon data lives in src/game/data/dungeons.ts (DUNGEON_REGISTRY).
 */
export const phase4Dungeons: Dungeon[] = [
    {
        id: 'kalindra-processing-hub',
        name: 'Kalindra Processing Hub',
        type: 'installation',
        tier: 3,
        sector: 'kalindra-drift',
        description:
            'The core installation at the center of the Kalindra Drift debris field. ' +
            'Kalindra Hub processed bulk ore freight for relay transit until the network collapsed. ' +
            'The crew evacuated — or disappeared — two years ago. The automated systems kept running. ' +
            'The Frontier Compact has outer-zone salvage rights. ' +
            'Aegis Division has classified the inner sections. ' +
            'Whatever is in the signal relay room is why both of them are watching.',
        rooms: [
            {
                id: 'kalindra-docking-collar',
                type: 'entrance',
                description:
                    'The outer docking collar is intact. Emergency lighting activates on approach. ' +
                    'A Frontier Compact access authorization is posted at the inner lock — ' +
                    'below it, an Aegis Division classification notice with a date stamp eleven months old.',
            },
            {
                id: 'kalindra-freight-floor',
                type: 'loot',
                description:
                    'Two years of unclaimed freight. Standard ore manifests, processed and packed. ' +
                    'One container is non-standard — sealed with a lock code that predates the hub\'s own registry.',
            },
            {
                id: 'kalindra-processing-level',
                type: 'combat',
                description:
                    'The ore processing floor. Automated conveyor units still run their loops. ' +
                    'Two freight-handling drones have been repurposed — badly — for a security role they were not designed for.',
                encounters: ['kalindra-freight-drone', 'kalindra-freight-drone'],
            },
            {
                id: 'kalindra-operations-deck',
                type: 'combat',
                description:
                    'The hub operations deck. Consoles show process logs that end mid-cycle. ' +
                    'A Kalindra security sentinel is still running patrol patterns. ' +
                    'And something else is in the corner — a compact probe unit, same chassis pattern as the ones from the relay.',
                encounters: ['kalindra-security-sentinel', 'fractured-probe'],
            },
            {
                id: 'kalindra-signal-relay-room',
                type: 'boss',
                description:
                    'The signal relay room. Every screen is active. Every screen shows the same waveform. ' +
                    'The Kalindra Hub Coordinator stands in the center — running management protocols ' +
                    'for a station that has been dark for two years, receiving instructions from somewhere, ' +
                    'and sending responses back.',
                encounters: ['kalindra-hub-coordinator'],
            },
        ],
        bossId: 'kalindra-hub-coordinator',
        rewards: {
            creditRange: [700, 1200],
            xpRange: [550, 850],
            lootTable: ['kalindra-signal-archive', 'kalindra-nav-fragment', 'farpoint-cargo-bundle', 'signal-fragment', 'power-cell'],
        },
        tags: ['tier-3', 'kalindra', 'post-relay', 'frontier', 'anomaly', 'phase-4', 'void-adjacent'],
    },
    {
        id: 'orins-crossing-locked-sector',
        name: "Orin's Crossing — Locked Sector",
        type: 'installation',
        tier: 4,
        sector: 'orins-crossing',
        description:
            "A sealed section of Orin's Crossing that Commander Dresh will not discuss and Aegis has not officially classified. " +
            'It has been locked for at least three years — predating the recent anomaly events — ' +
            'and the access codes have been rotated seven times in the last four months. ' +
            'Someone keeps updating the locks. ' +
            'The sensor arrays inside are still active. ' +
            'Their logs have never been exported to the station record.',
        rooms: [
            {
                id: 'crossing-sealed-threshold',
                type: 'entrance',
                description:
                    'The access threshold to the locked sector. ' +
                    'Standard Sol Union lock panel — but the access log shows the last authorized entry as three years ago. ' +
                    'The last lock rotation was four days ago.',
            },
            {
                id: 'crossing-classified-storage',
                type: 'loot',
                description:
                    'A storage area filled with classified equipment containers. ' +
                    'Sol Union markings, Aegis Division markings, and one set of markings ' +
                    'that does not match any organization in the public registry.',
            },
            {
                id: 'crossing-enforcer-post',
                type: 'combat',
                description:
                    'Two Orin\'s Crossing enforcement units — still active, running patrol patterns. ' +
                    'Their identification codes are blanked. Running without a registered assignment.',
                encounters: ['crossing-enforcer', 'crossing-enforcer'],
            },
            {
                id: 'crossing-sensor-array-room',
                type: 'combat',
                description:
                    'The transit corridor sensor array hub. Every display shows the logged anomalous events. ' +
                    'An anomaly sensor unit is actively transmitting — on the same frequency as the relay ghost signal.',
                encounters: ['anomaly-sensor-array', 'crossing-enforcer'],
            },
            {
                id: 'crossing-core-node',
                type: 'boss',
                description:
                    'The locked sector\'s core processing node. ' +
                    'It is running a comparison protocol: cross-referencing transit records from twelve different relay sites. ' +
                    'The Orin\'s Defense Prime unit guarding it is configured for lethal response. ' +
                    'The data it is protecting may be more dangerous than the unit is.',
                encounters: ['orins-defense-prime'],
            },
        ],
        bossId: 'orins-defense-prime',
        rewards: {
            creditRange: [950, 1600],
            xpRange: [750, 1100],
            lootTable: ['crossing-classified-data', 'transit-anomaly-log', 'signal-fragment', 'power-cell', 'anomaly-trace-log'],
        },
        tags: ['tier-4', 'orins-crossing', 'post-relay', 'military', 'anomaly', 'mystery', 'phase-4', 'void-adjacent'],
    },
];
