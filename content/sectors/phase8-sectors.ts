import { Sector } from '../../shared/types/sector';

/**
 * Phase 8 sectors — The Index Chamber.
 * The Null Architect transmitted coordinates. The site was always there.
 */
export const phase8Sectors: Sector[] = [
    {
        id: 'index-chamber-sector',
        name: 'The Index Chamber',
        type: 'anomaly',
        description:
            'The Null Architect transmitted a single coordinate set to every active comm relay in the frontier corridor simultaneously. ' +
            'The site the coordinates point to does not appear in any route registry, survey log, or stellar cartography record. ' +
            'Every faction received the same message. Every faction has sent someone to look.',
        dangerLevel: 'extreme',
        factions: [
            'frontier-compact',
            'helion-synod',
            'void-covenant',
            'interstellar-commonwealth-authority',
            'aegis-division',
        ],
        dungeons: ['index-chamber-null-prime'],
        contracts: [
            'frontier-index-approach-survey',
            'synod-index-interaction-protocol',
            'covenant-index-cycle-witness',
            'ica-index-access-control',
            'aegis-index-extraction-prep',
            'redline-index-archive-breach',
            'redline-index-cycle-record',
        ],
        lore: [
            'index-chamber-approach-brief',
            'null-architect-first-transmission',
            'synod-index-interaction-protocol-v1',
            'ica-index-access-order',
            'index-cycle-first-observation',
            'covenant-index-voice-account',
            'frontier-index-approach-routes',
            'aegis-index-extraction-brief',
        ],
        tags: ['phase-8', 'index-chamber', 'null-architect', 'void-class', 'extreme'],
    },
];
