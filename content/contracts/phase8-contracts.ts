import { Contract } from '../../shared/types/contract';

/**
 * Phase 8 contracts — The Index Chamber.
 * The Null Architect has transmitted coordinates. All factions have received the same message.
 * The Index Chamber is not hidden — it has been prepared.
 */
export const phase8Contracts: Contract[] = [
    {
        id: 'frontier-index-approach-survey',
        title: 'Compact: Index Approach Survey — Index Chamber',
        category: 'survey',
        tier: 5,
        factionId: 'frontier-compact',
        description:
            'Frontier navigator Corvus Renn has been mapping the transmission coordinates for three days. ' +
            'The approach corridor exists but the geometry is inconsistent with anything in the route registry. ' +
            'The Compact needs a survey package before it can classify the site or file transit advisories.',
        giver: 'corvus-renn',
        sector: 'index-chamber-sector',
        objectives: [
            'Navigate to the Index Chamber approach corridor.',
            'Record geometry and transit marker alignment.',
            'Document hazard envelope and stable ingress vectors.',
            'Return survey package to Corvus Renn.',
        ],
        reward: {
            credits: 4000,
            xp: 1500,
            reputationGain: {
                'frontier-compact': 26,
            },
        },
        tags: ['survey', 'frontier-compact', 'phase-8', 'index-chamber', 'null-architect'],
    },
    {
        id: 'synod-index-interaction-protocol',
        title: 'Synod: Index Interaction Protocol — Index Chamber',
        category: 'investigation',
        tier: 5,
        factionId: 'helion-synod',
        reputationRequirement: { factionId: 'helion-synod', minRep: 50 },
        description:
            'Synod Adept Marek Thane has drafted a first-contact cognitive interaction protocol. ' +
            'It requires live telemetry under Index Chamber conditions to validate. ' +
            'If the entities respond to structured engagement differently than deterrence, the protocol will capture it.',
        giver: 'synod-adept-marek',
        sector: 'index-chamber-sector',
        objectives: [
            'Carry Synod interaction kit into the Index Chamber.',
            'Capture response telemetry during structured engagement.',
            'Document any non-deterrence behavioral signatures.',
            'Return the interaction record to Synod Adept Marek.',
        ],
        reward: {
            credits: 4600,
            xp: 1650,
            reputationGain: {
                'helion-synod': 32,
            },
            itemRewards: ['architect-response-record'],
        },
        tags: ['investigation', 'helion-synod', 'phase-8', 'index-chamber', 'psi', 'null-architect'],
    },
    {
        id: 'covenant-index-cycle-witness',
        title: 'Covenant: Index Cycle Witness — Index Chamber',
        category: 'investigation',
        tier: 5,
        factionId: 'void-covenant',
        reputationRequirement: { factionId: 'void-covenant', minRep: 50 },
        description:
            'Tovan Vex believes the Index Cycle is a recurring operational state — not a single transmission but an ongoing sequence. ' +
            'The Covenant needs a direct witness account to document the transition.',
        giver: 'tovan-vex',
        sector: 'index-chamber-sector',
        objectives: [
            'Enter the Index Chamber under Covenant observation protocol.',
            'Observe and record Index Cycle state transitions.',
            'Return full witness account to Tovan Vex.',
        ],
        reward: {
            credits: 4400,
            xp: 1600,
            reputationGain: {
                'void-covenant': 34,
            },
        },
        tags: ['investigation', 'void-covenant', 'phase-8', 'index-chamber', 'index-cycle'],
    },
    {
        id: 'ica-index-access-control',
        title: 'ICA: Priority Access Control — Index Chamber',
        category: 'station',
        tier: 5,
        factionId: 'interstellar-commonwealth-authority',
        reputationRequirement: { factionId: 'interstellar-commonwealth-authority', minRep: 50 },
        description:
            'ICA Frontier Division Director Vael has arrived at Farpoint to personally oversee Index Chamber access. ' +
            'She needs priority access markers deployed before other factions can establish independent transit lines.',
        giver: 'director-vael',
        sector: 'index-chamber-sector',
        objectives: [
            'Deploy ICA priority access markers at Index Chamber ingress vectors.',
            'Verify marker signal is broadcasting on ICA-registered frequencies.',
            'File signed access control report with Director Vael.',
        ],
        reward: {
            credits: 4500,
            xp: 1620,
            reputationGain: {
                'interstellar-commonwealth-authority': 30,
            },
        },
        tags: ['station', 'ica', 'phase-8', 'index-chamber', 'access-control'],
    },
    {
        id: 'aegis-index-extraction-prep',
        title: 'Aegis: Extraction Point Mapping — Index Chamber',
        category: 'survey',
        tier: 5,
        factionId: 'aegis-division',
        reputationRequirement: { factionId: 'aegis-division', minRep: 55 },
        description:
            'Operative Sable needs verified extraction routes inside the Index Chamber before Aegis commits personnel. ' +
            'The entities here have not demonstrated kill behavior, but Sable does not trust that to hold under operational pressure.',
        giver: 'operative-sable',
        sector: 'index-chamber-sector',
        objectives: [
            'Survey viable extraction vectors inside the Index Chamber.',
            'Tag fallback positions against Index Cycle phase timing.',
            'Return extraction topology to Operative Sable.',
        ],
        reward: {
            credits: 4800,
            xp: 1700,
            reputationGain: {
                'aegis-division': 34,
            },
        },
        tags: ['survey', 'aegis', 'phase-8', 'index-chamber', 'extraction-prep'],
    },
    {
        id: 'redline-index-archive-breach',
        title: 'REDLINE: Index Archive Breach — Index Chamber',
        category: 'extraction',
        tier: 5,
        factionId: 'helion-synod',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. The Index Archive is in a restricted inner sanctum. ' +
            'Warden behavior escalates sharply under archive-breach conditions. ' +
            'On death, field gear loss rules apply. Secure critical items before launch.',
        reputationRequirement: { factionId: 'helion-synod', minRep: 75 },
        description:
            'Synod Adept Marek needs a forced extraction from the restricted Index archives — ' +
            'data the Null Architect has not volunteered. If the entities permit the outer chamber, ' +
            'they may not permit the archive. Marek wants to find out.',
        giver: 'synod-adept-marek',
        sector: 'index-chamber-sector',
        objectives: [
            'Force access to the Index Chamber inner archive.',
            'Extract a classified index data package.',
            'Defeat the archive enforcement response.',
            'Return the data intact to Synod Adept Marek.',
        ],
        reward: {
            credits: 7200,
            xp: 2900,
            reputationGain: {
                'helion-synod': 50,
                'interstellar-commonwealth-authority': -20,
            },
            itemRewards: ['warden-core-extract'],
        },
        tags: ['redline', 'extraction', 'helion-synod', 'phase-8', 'index-chamber', 'null-architect'],
    },
    {
        id: 'redline-index-cycle-record',
        title: 'REDLINE: Index Cycle Recovery — Index Chamber',
        category: 'extraction',
        tier: 5,
        factionId: 'void-covenant',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. The Index Cycle record is in the Chamber core, ' +
            'behind the primary Warden line. ICA is moving to classify and seal the record. ' +
            'On death, field gear loss rules apply and the data is unrecoverable.',
        reputationRequirement: { factionId: 'void-covenant', minRep: 75 },
        description:
            'Tovan Vex wants the full Index Cycle record before ICA priority access control locks the chamber. ' +
            'The Covenant believes the record contains the complete history of every civilization ' +
            'that has entered this space — and what happened to each of them.',
        giver: 'tovan-vex',
        sector: 'index-chamber-sector',
        objectives: [
            'Reach the Index Chamber core.',
            'Defeat the chamber Warden enforcement response.',
            'Recover the Index Cycle record.',
            'Extract alive and return the record to Tovan Vex.',
        ],
        reward: {
            credits: 7000,
            xp: 2800,
            reputationGain: {
                'void-covenant': 50,
                'interstellar-commonwealth-authority': -22,
            },
            itemRewards: ['index-access-token'],
        },
        tags: ['redline', 'extraction', 'void-covenant', 'phase-8', 'index-chamber', 'index-cycle'],
    },
];
