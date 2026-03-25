import { Contract } from '../../shared/types/contract';

/**
 * Phase 9 contracts — The Cycle Archive.
 * After the Index Chamber was cleared, the Null Architect opened a deeper site.
 * The Cycle Archive holds the full records of every civilization that has entered this space.
 * All factions understand: this is the final layer the Architect is willing to show.
 */
export const phase9Contracts: Contract[] = [
    {
        id: 'frontier-cycle-approach-survey',
        title: 'Compact: Cycle Archive Approach Survey',
        category: 'survey',
        tier: 5,
        factionId: 'frontier-compact',
        description:
            'Corvus Renn has been watching the Architect\'s signal since the Index Chamber was cleared. ' +
            'A second coordinate set arrived forty-eight hours later — same signature, deeper vector. ' +
            'The Compact needs a full approach survey before any transit advisories can be issued.',
        giver: 'corvus-renn',
        sector: 'cycle-archive-sector',
        objectives: [
            'Navigate to the Cycle Archive approach corridor.',
            'Record transit geometry and stable ingress vectors.',
            'Document the corridor hazard envelope.',
            'Return the approach survey to Corvus Renn.',
        ],
        reward: {
            credits: 4400,
            xp: 1600,
            reputationGain: {
                'frontier-compact': 28,
            },
        },
        tags: ['survey', 'frontier-compact', 'phase-9', 'cycle-archive', 'null-architect'],
    },
    {
        id: 'synod-cycle-cognitive-record',
        title: 'Synod: Cognitive Record Protocol — Cycle Archive',
        category: 'investigation',
        tier: 5,
        factionId: 'helion-synod',
        reputationRequirement: { factionId: 'helion-synod', minRep: 55 },
        description:
            'Synod Adept Marek Thane believes the Cycle Archive records contain psi-resonant indexing — ' +
            'structured cognitive imprints from each civilization the Architect catalogued. ' +
            'He needs live telemetry from inside the archive to validate the hypothesis before Aegis locks access.',
        giver: 'synod-adept-marek',
        sector: 'cycle-archive-sector',
        objectives: [
            'Carry the Synod cognitive sampling kit into the Cycle Archive.',
            'Capture psi-resonance telemetry from active record chambers.',
            'Document any anomalous cognitive signature patterns.',
            'Return the full cognitive record to Synod Adept Marek.',
        ],
        reward: {
            credits: 4800,
            xp: 1720,
            reputationGain: {
                'helion-synod': 34,
            },
            itemRewards: ['cycle-record-fragment'],
        },
        tags: ['investigation', 'helion-synod', 'phase-9', 'cycle-archive', 'psi', 'null-architect'],
    },
    {
        id: 'covenant-cycle-archive-recovery',
        title: 'Covenant: Archive Cycle Recovery — Cycle Archive',
        category: 'investigation',
        tier: 5,
        factionId: 'void-covenant',
        reputationRequirement: { factionId: 'void-covenant', minRep: 55 },
        description:
            'Tovan Vex believes the two pending cycle entries from the Index Chamber record belong to civilizations ' +
            'that attempted to force archive access rather than witness it. ' +
            'The Covenant needs direct documentation of the archive\'s classification of those entries.',
        giver: 'tovan-vex',
        sector: 'cycle-archive-sector',
        objectives: [
            'Enter the Cycle Archive under Covenant documentation protocol.',
            'Locate and record the two unresolved cycle entries.',
            'Document the Architect\'s classification notation for each entry.',
            'Return full findings to Tovan Vex.',
        ],
        reward: {
            credits: 4600,
            xp: 1680,
            reputationGain: {
                'void-covenant': 36,
            },
        },
        tags: ['investigation', 'void-covenant', 'phase-9', 'cycle-archive', 'index-cycle'],
    },
    {
        id: 'ica-cycle-jurisdiction',
        title: 'ICA: Cycle Archive Jurisdiction Markers',
        category: 'station',
        tier: 5,
        factionId: 'interstellar-commonwealth-authority',
        reputationRequirement: { factionId: 'interstellar-commonwealth-authority', minRep: 55 },
        description:
            'Director Vael is moving to extend ICA jurisdictional control to the Cycle Archive before ' +
            'Aegis field teams can establish independent access. ' +
            'She needs priority jurisdiction markers deployed inside the archive before any extraction operations begin.',
        giver: 'director-vael',
        sector: 'cycle-archive-sector',
        objectives: [
            'Deploy ICA jurisdiction markers at Cycle Archive primary access points.',
            'Verify marker broadcast on ICA-registered frequencies.',
            'File signed deployment confirmation with Director Vael.',
        ],
        reward: {
            credits: 4700,
            xp: 1700,
            reputationGain: {
                'interstellar-commonwealth-authority': 32,
            },
        },
        tags: ['station', 'ica', 'phase-9', 'cycle-archive', 'jurisdiction'],
    },
    {
        id: 'aegis-cycle-archive-scout',
        title: 'Aegis: Cycle Archive Scout Report',
        category: 'survey',
        tier: 5,
        factionId: 'aegis-division',
        reputationRequirement: { factionId: 'aegis-division', minRep: 60 },
        description:
            'Commander Thess Dray arrived at Farpoint the day the Cycle Archive coordinates were received. ' +
            'Aegis wants a full scout report — entity behavior, corridor topology, and extraction vectors — ' +
            'before committing a retrieval team.',
        giver: 'commander-thess-dray',
        sector: 'cycle-archive-sector',
        objectives: [
            'Scout the Cycle Archive interior and document entity response behavior.',
            'Map viable extraction corridors against archive enforcement patterns.',
            'Tag three fallback positions for Aegis retrieval team use.',
            'Return the scout report to Commander Dray.',
        ],
        reward: {
            credits: 5000,
            xp: 1800,
            reputationGain: {
                'aegis-division': 36,
            },
        },
        tags: ['survey', 'aegis', 'phase-9', 'cycle-archive', 'scout'],
    },
    {
        id: 'redline-cycle-archive-forced-access',
        title: 'REDLINE: Forced Archive Access — Cycle Archive',
        category: 'extraction',
        tier: 5,
        factionId: 'helion-synod',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. The restricted archive tier responds to forced access with ' +
            'maximum enforcement entities. The Cycle Archive Executors operate without deescalation. ' +
            'On death, field gear loss rules apply. Secure critical items before launch.',
        reputationRequirement: { factionId: 'helion-synod', minRep: 80 },
        description:
            'Synod Adept Marek wants a forced extraction from the Cycle Archive\'s restricted terminal tier — ' +
            'the classification records the Architect has not volunteered and the ICA is moving to seal. ' +
            'If the terminal records the psi-signatures of civilizations the Architect terminated, Marek needs them now.',
        giver: 'synod-adept-marek',
        sector: 'cycle-archive-sector',
        objectives: [
            'Force access to the Cycle Archive restricted terminal tier.',
            'Extract the full psi-resonance classification record.',
            'Defeat the archive enforcement response.',
            'Return the classification record intact to Synod Adept Marek.',
        ],
        reward: {
            credits: 7800,
            xp: 3100,
            reputationGain: {
                'helion-synod': 55,
                'interstellar-commonwealth-authority': -22,
            },
            itemRewards: ['archive-classification-core'],
        },
        tags: ['redline', 'extraction', 'helion-synod', 'phase-9', 'cycle-archive', 'null-architect'],
    },
    {
        id: 'redline-cycle-record-terminal',
        title: 'REDLINE: Cycle Terminal Recovery — Cycle Archive',
        category: 'extraction',
        tier: 5,
        factionId: 'void-covenant',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. The Cycle Archive terminal is protected by the Warden construct — ' +
            'the Architect\'s primary enforcement entity for this site. There is no deescalation path from the terminal chamber. ' +
            'On death, field gear loss rules apply and the terminal record is unrecoverable.',
        reputationRequirement: { factionId: 'void-covenant', minRep: 80 },
        description:
            'Tovan Vex wants the complete cycle terminal record — the full indexed history of what ' +
            'the Null Architect has recorded about every civilization that entered this space, ' +
            'including the two whose cycle entries remain unresolved. ' +
            'The Covenant believes this record is the closest thing to the truth about this space that exists.',
        giver: 'tovan-vex',
        sector: 'cycle-archive-sector',
        objectives: [
            'Reach the Cycle Archive terminal chamber.',
            'Defeat the archive Warden construct.',
            'Recover the complete cycle terminal record.',
            'Extract alive and return the record to Tovan Vex.',
        ],
        reward: {
            credits: 7600,
            xp: 3000,
            reputationGain: {
                'void-covenant': 55,
                'interstellar-commonwealth-authority': -24,
            },
            itemRewards: ['cycle-terminal-record'],
        },
        tags: ['redline', 'extraction', 'void-covenant', 'phase-9', 'cycle-archive', 'index-cycle'],
    },
];
