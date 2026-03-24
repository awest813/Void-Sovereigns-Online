import { Sector } from '../../shared/types/sector';

/**
 * Phase 6 sectors — The Farpoint Hub and Transit Node Zero ghost site.
 * Transit Node Zero is not on any navigation chart; it is reached only
 * via the zero-second transit coordinate from the Kael Mourne questline.
 */
export const phase6Sectors: Sector[] = [
    {
        id: 'transit-node-zero-sector',
        name: 'Transit Node Zero',
        type: 'ghost-site',
        description:
            'A location not on any navigation chart. ' +
            'The coordinates were extracted from a transit record logged at Void Relay 7-9 — ' +
            'timestamp zero, origin unregistered. ' +
            'The relay calculated a destination. No one knows what it is. ' +
            'The navigation system acknowledged the destination without hesitation. ' +
            'It had been here before. Something has.',
        dangerLevel: 'extreme',
        factions: ['interstellar-commonwealth-authority', 'void-covenant'],
        dungeons: ['transit-node-zero'],
        contracts: [
            'ghost-site-ica-recovery',
            'ghost-site-covenant-witness',
        ],
        lore: [
            'transit-node-zero-approach',
            'transit-zero-interior-partial',
            'null-architect-encounter-report',
        ],
        tags: ['ghost-site', 'anomaly', 'unknown-entities', 'phase-6', 'redline', 'high-risk'],
    },
];
