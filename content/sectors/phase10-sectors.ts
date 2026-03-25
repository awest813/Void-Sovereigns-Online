import { Sector } from '../../shared/types/sector';

/**
 * Phase 10 sectors — The Sovereign Threshold.
 * When the Cycle Archive was cleared, the Null Architect transmitted a final coordinate set
 * and manifested a physical construct at Farpoint Waystation. The site the coordinates point to
 * is where the cycle record is resolved. Where civilizations become Void Sovereigns — or do not.
 */
export const phase10Sectors: Sector[] = [
    {
        id: 'sovereign-threshold-sector',
        name: 'The Sovereign Threshold',
        type: 'anomaly',
        description:
            'The final coordinate set arrived at the same moment the Null Architect construct appeared at Farpoint. ' +
            'No prior transmission. No approach brief. The threshold was simply accessible when the Cycle Archive entry closed. ' +
            'The Null Archivist output one phrase when the site went active: ' +
            '"THE FORTY-SECOND CYCLE IS OPEN. TERMINAL RESOLUTION IS AVAILABLE. ' +
            'A VOID SOVEREIGN IS WHAT REMAINS WHEN A CIVILIZATION CHOOSES TO BE WITNESSED." ' +
            'Every faction at Farpoint understood at once: this is the end of the archive sequence. ' +
            'Whatever happens at this site closes the forty-second cycle permanently.',
        dangerLevel: 'extreme',
        factions: [
            'frontier-compact',
            'helion-synod',
            'void-covenant',
            'interstellar-commonwealth-authority',
            'aegis-division',
        ],
        dungeons: ['sovereign-threshold-main'],
        contracts: [
            'frontier-threshold-approach-survey',
            'synod-threshold-resonance-map',
            'covenant-threshold-witness-protocol',
            'ica-threshold-sovereignty-filing',
            'aegis-threshold-extraction-brief',
            'redline-threshold-sovereignty-claim',
            'redline-threshold-record-seal',
        ],
        lore: [
            'threshold-approach-brief',
            'null-architect-third-transmission',
            'synod-threshold-resonance-notes',
            'ica-sovereignty-status-filing',
            'cycle-entry-resolution-log',
            'covenant-threshold-witness-account',
            'aegis-threshold-extraction-final',
            'null-architect-sovereignty-declaration',
        ],
        tags: ['phase-10', 'sovereign-threshold', 'null-architect', 'void-class', 'extreme', 'endgame'],
    },
];
