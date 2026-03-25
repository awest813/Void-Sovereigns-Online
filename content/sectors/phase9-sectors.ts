import { Sector } from '../../shared/types/sector';

/**
 * Phase 9 sectors — The Cycle Archive.
 * Forty-eight hours after the Index Chamber was cleared, the Null Architect transmitted a second coordinate set.
 * The site it points to is the archive tier the Architect was never asked about.
 */
export const phase9Sectors: Sector[] = [
    {
        id: 'cycle-archive-sector',
        name: 'The Cycle Archive',
        type: 'anomaly',
        description:
            'A second transmission arrived forty-eight hours after the Index Chamber was cleared. ' +
            'The coordinates it contains point to a site one layer deeper than anything previously accessed. ' +
            'The Null Archivist interface at Farpoint output a single phrase when the signal arrived: ' +
            '"CYCLE RECORD REQUIRES TERMINAL WITNESS." ' +
            'Every faction that reached the Index Chamber received the same second message.',
        dangerLevel: 'extreme',
        factions: [
            'frontier-compact',
            'helion-synod',
            'void-covenant',
            'interstellar-commonwealth-authority',
            'aegis-division',
        ],
        dungeons: ['cycle-archive-sanctum'],
        contracts: [
            'frontier-cycle-approach-survey',
            'synod-cycle-cognitive-record',
            'covenant-cycle-archive-recovery',
            'ica-cycle-jurisdiction',
            'aegis-cycle-archive-scout',
            'redline-cycle-archive-forced-access',
            'redline-cycle-record-terminal',
        ],
        lore: [
            'cycle-archive-approach-brief',
            'null-architect-second-transmission',
            'synod-cycle-cognitive-study',
            'ica-cycle-jurisdiction-report',
            'cycle-record-civilization-log',
            'covenant-archive-witness-account',
            'aegis-cycle-extraction-notes',
            'null-architect-archive-purpose',
        ],
        tags: ['phase-9', 'cycle-archive', 'null-architect', 'void-class', 'extreme'],
    },
];
