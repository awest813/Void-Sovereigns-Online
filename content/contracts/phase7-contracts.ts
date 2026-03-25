import { Contract } from '../../shared/types/contract';

/**
 * Phase 7 contracts — Ship Tier III & Deep Frontier.
 * The Ashveil Deep introduces void-class expedition contracts and
 * escalating Synod/Covenant/ICA conflict around unknown entities.
 */
export const phase7Contracts: Contract[] = [
    {
        id: 'ashveil-deep-recon',
        title: 'Compact: Deep Corridor Recon — Ashveil Deep',
        category: 'survey',
        tier: 5,
        factionId: 'frontier-compact',
        description:
            'Frontier Agent Leva needs verified route data beyond Ashveil Observation Post. ' +
            'Convoys are disappearing from the transit ledger with no debris fields and no distress records. ' +
            'The Compact needs a working map before it commits heavier traffic into the corridor.',
        giver: 'frontier-agent-leva',
        sector: 'ashveil-deep-sector',
        objectives: [
            'Transit to the Ashveil Deep approach corridor.',
            'Record stable ingress and extraction vectors.',
            'Mark hazard zones for civilian navigation updates.',
            'Return route package to Frontier Agent Leva.',
        ],
        reward: {
            credits: 3600,
            xp: 1300,
            reputationGain: {
                'frontier-compact': 24,
            },
        },
        tags: ['survey', 'frontier-compact', 'phase-7', 'ashveil-deep', 'void-class'],
    },
    {
        id: 'synod-psi-calibration',
        title: 'Synod: Cognitive Drift Calibration — Ashveil Deep',
        category: 'investigation',
        tier: 5,
        factionId: 'helion-synod',
        reputationRequirement: { factionId: 'helion-synod', minRep: 45 },
        description:
            'Aris Vel has drafted a field protocol for what she calls cognitive drift events in deep anomaly zones. ' +
            'She needs active telemetry under live combat stress conditions to calibrate it.',
        giver: 'aris-vel',
        sector: 'ashveil-deep-sector',
        objectives: [
            'Carry Synod calibration kit into Ashveil Deep.',
            'Capture cognition telemetry at three anomaly points.',
            'Return the calibration package intact to Aris Vel.',
        ],
        reward: {
            credits: 4100,
            xp: 1450,
            reputationGain: {
                'helion-synod': 28,
            },
            itemRewards: ['psi-lattice-sample'],
        },
        tags: ['investigation', 'helion-synod', 'phase-7', 'ashveil-deep', 'psi'],
    },
    {
        id: 'covenant-deep-echo',
        title: 'Covenant: Echo-Witness Sweep — Ashveil Deep',
        category: 'investigation',
        tier: 5,
        factionId: 'void-covenant',
        reputationRequirement: { factionId: 'void-covenant', minRep: 45 },
        description:
            'Tovan Vex wants a witness-grade account of the Ashveil Deep echo pattern. ' +
            'The Covenant believes the local signal is not a transmission but a response cycle.',
        giver: 'tovan-vex',
        sector: 'ashveil-deep-sector',
        objectives: [
            'Transit to Ashveil Deep under Covenant observation protocol.',
            'Record echo pattern transitions during hostile engagement.',
            'Debrief Tovan Vex with full witness account.',
        ],
        reward: {
            credits: 3950,
            xp: 1400,
            reputationGain: {
                'void-covenant': 30,
            },
        },
        tags: ['investigation', 'void-covenant', 'phase-7', 'ashveil-deep', 'echo-pattern'],
    },
    {
        id: 'ica-deepfrontier-quarantine',
        title: 'ICA: Quarantine Enforcement — Ashveil Deep',
        category: 'station',
        tier: 5,
        factionId: 'interstellar-commonwealth-authority',
        reputationRequirement: { factionId: 'interstellar-commonwealth-authority', minRep: 45 },
        description:
            'Agent Vorren is moving ICA quarantine markers deeper into the frontier corridor. ' +
            'He needs field confirmation that hazardous vectors are sealed and traffic can be interdicted.',
        giver: 'ica-agent-vorren',
        sector: 'ashveil-deep-sector',
        objectives: [
            'Deploy ICA quarantine beacons at designated vectors.',
            'Verify hazard exclusion envelopes are stable.',
            'File signed enforcement report with Agent Vorren.',
        ],
        reward: {
            credits: 4000,
            xp: 1420,
            reputationGain: {
                'interstellar-commonwealth-authority': 26,
            },
        },
        tags: ['station', 'ica', 'phase-7', 'ashveil-deep', 'quarantine'],
    },
    {
        id: 'aegis-hull-breach-mapping',
        title: 'Aegis: Hull-Breach Hazard Mapping — Ashveil Deep',
        category: 'survey',
        tier: 5,
        factionId: 'aegis-division',
        reputationRequirement: { factionId: 'aegis-division', minRep: 50 },
        description:
            'Operative Sable needs verified hazard maps for rapid decompression zones in the deep facility shell. ' +
            'Aegis teams can hold the line if they know where the environment will kill them first.',
        giver: 'operative-sable',
        sector: 'ashveil-deep-sector',
        objectives: [
            'Map decompression fractures and breach corridors.',
            'Tag viable fallback points for Aegis operators.',
            'Return breach topology map to Operative Sable.',
        ],
        reward: {
            credits: 4300,
            xp: 1500,
            reputationGain: {
                'aegis-division': 30,
            },
        },
        tags: ['survey', 'aegis', 'phase-7', 'ashveil-deep', 'hazard'],
    },
    {
        id: 'redline-ashveil-deep-core',
        title: 'REDLINE: Core Array Breach — Ashveil Deep',
        category: 'extraction',
        tier: 5,
        factionId: 'helion-synod',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. Ashveil Deep has no stable extraction window and no reliable comms chain. ' +
            'On death, field gear loss rules apply. Secure critical items before launch.',
        reputationRequirement: { factionId: 'helion-synod', minRep: 70 },
        description:
            'Aris Vel needs direct access to the deep-core relay lattice to test her Synod model. ' +
            'The chamber is guarded by entities outside known faction manufacture.',
        giver: 'aris-vel',
        sector: 'ashveil-deep-sector',
        objectives: [
            'Reach the Ashveil Deep core array.',
            'Defeat the core deterrence entity.',
            'Extract core lattice sample and return alive.',
        ],
        reward: {
            credits: 6400,
            xp: 2600,
            reputationGain: {
                'helion-synod': 44,
                'void-covenant': 16,
            },
            itemRewards: ['deepfrontier-core-signature'],
        },
        tags: ['redline', 'extraction', 'helion-synod', 'phase-7', 'ashveil-deep', 'void-class'],
    },
    {
        id: 'redline-null-lattice-extract',
        title: 'REDLINE: Null Lattice Retrieval — Ashveil Deep',
        category: 'extraction',
        tier: 5,
        factionId: 'void-covenant',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. The lattice chamber runs active deterrence in overlapping phases. ' +
            'On death, field gear loss rules apply and mission data is unrecoverable.',
        reputationRequirement: { factionId: 'void-covenant', minRep: 70 },
        description:
            'Tovan Vex wants a recovered lattice segment before ICA can classify and lock the chamber. ' +
            'The Covenant believes the segment records historical transit responses.',
        giver: 'tovan-vex',
        sector: 'ashveil-deep-sector',
        objectives: [
            'Enter the null lattice chamber in Ashveil Deep.',
            'Neutralize chamber deterrence systems.',
            'Recover a valid lattice segment and extract alive.',
        ],
        reward: {
            credits: 6200,
            xp: 2500,
            reputationGain: {
                'void-covenant': 45,
                'interstellar-commonwealth-authority': -18,
            },
            itemRewards: ['null-lattice-segment'],
        },
        tags: ['redline', 'extraction', 'void-covenant', 'phase-7', 'ashveil-deep', 'void-class'],
    },
];
