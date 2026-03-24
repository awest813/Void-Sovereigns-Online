import { Sector } from '../../shared/types/sector';

/**
 * Phase 4 sectors — post-relay expansion beyond Farpoint Waystation.
 * Accessible after relay-jump-completed flag is set.
 */
export const phase4Sectors: Sector[] = [
    {
        id: 'kalindra-drift',
        name: 'Kalindra Drift',
        type: 'ruins',
        description:
            'A dense debris field surrounding the dead hulk of Kalindra Processing Hub — ' +
            'a mid-tier industrial waystation that went dark during the relay collapse two years ago. ' +
            'Before the relays failed, Kalindra was a significant freight transfer node: ' +
            'bulk ore from independent mining crews was processed here before being relayed to core systems. ' +
            'Now the hub is silent, the freight is unclaimed, and the automated systems are still running. ' +
            'The Frontier Compact has filed salvage rights on the outer zone. ' +
            'Aegis Division has filed a classified access notice on the inner sections. ' +
            'Both filings were received two days apart. No one is sure which one takes precedence.',
        dangerLevel: 'high',
        factions: [
            'frontier-compact',
            'aegis-division',
            'vanta-corsairs',
        ],
        dungeons: [
            'kalindra-processing-hub',
        ],
        contracts: [
            'frontier-supply-run-kalindra',
            'frontier-route-survey-kalindra',
            'aegis-sealed-site-recovery',
            'aegis-missing-team-kalindra',
            'vanta-off-book-salvage',
            'redline-kalindra-core',
        ],
        lore: [
            'lore-kalindra-collapse',
            'lore-aegis-sealed-notice',
            'lore-anomaly-pattern-escalation',
        ],
        tags: ['ruins', 'debris', 'salvage', 'post-relay', 'frontier', 'anomaly', 'phase-4'],
    },
    {
        id: 'orins-crossing',
        name: "Orin's Crossing",
        type: 'station',
        description:
            'A Sol Union Directorate transit checkpoint positioned at a contested relay-adjacent corridor ' +
            'between three disputed frontier systems. ' +
            'Orin\'s Crossing has operated continuously for sixty years — long before the Commonwealth ' +
            'claimed jurisdiction over this region and longer before the ICA tried to absorb its records. ' +
            'The checkpoint processes all transit filings for the surrounding corridor, ' +
            'maintains a standing enforcement garrison, and operates under a legal charter that ' +
            'the Sol Union insists supersedes Commonwealth transit authority. ' +
            'The ICA disputes this in writing approximately twice per year. ' +
            'The dispute has never been resolved. ' +
            'Vessels transiting through Orin\'s Crossing are subject to inspection without prior notice. ' +
            'The inspectors are thorough. The commander is not known for patience.',
        dangerLevel: 'high',
        factions: [
            'sol-union-directorate',
            'interstellar-commonwealth-authority',
            'frontier-compact',
        ],
        dungeons: [
            'orins-crossing-locked-sector',
        ],
        contracts: [
            'sol-union-compliance-check',
            'sol-union-sector-enforcement',
            'aegis-anomaly-trace-orin',
        ],
        lore: [
            'lore-orins-crossing-history',
            'lore-sol-union-jurisdiction',
            'lore-impossible-telemetry-orin',
        ],
        tags: ['station', 'military', 'transit', 'contested', 'post-relay', 'frontier', 'phase-4'],
    },
];
