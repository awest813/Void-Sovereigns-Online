import { Sector } from '../../shared/types/sector';

/**
 * Phase 7 sectors — Deep frontier expansion beyond Ashveil.
 */
export const phase7Sectors: Sector[] = [
    {
        id: 'ashveil-deep-sector',
        name: 'Ashveil Deep',
        type: 'anomaly',
        description:
            'An anomalous deep-frontier corridor beyond the Ashveil Observation Post. ' +
            'Navigation drift, synchronized breach hazards, and non-faction entities are all documented. ' +
            'No route is stable for long.',
        dangerLevel: 'extreme',
        factions: ['frontier-compact', 'helion-synod', 'void-covenant', 'interstellar-commonwealth-authority', 'aegis-division'],
        dungeons: ['ashveil-deep-void-class'],
        contracts: [
            'ashveil-deep-recon',
            'synod-psi-calibration',
            'covenant-deep-echo',
            'ica-deepfrontier-quarantine',
            'aegis-hull-breach-mapping',
            'redline-ashveil-deep-core',
            'redline-null-lattice-extract',
        ],
        lore: [
            'ashveil-deep-approach-brief',
            'tier-iii-hull-design-note',
            'synod-cognitive-drift-log',
            'ica-quarantine-order-ashveil',
            'deepfrontier-core-encounter',
            'null-lattice-fragment-note',
            'aegis-breach-topology-report',
            'farpoint-tier-iii-requisition',
        ],
        tags: ['phase-7', 'deep-frontier', 'ashveil-deep', 'void-class', 'extreme'],
    },
];
