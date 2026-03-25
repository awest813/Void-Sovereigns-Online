import { Contract } from '../../shared/types/contract';

/**
 * Phase 10 contracts — The Sovereign Threshold.
 * When the Cycle Archive was cleared, the Null Architect manifested a physical construct at Farpoint
 * and transmitted one final coordinate set. The site it points to is where cycles are resolved.
 * A Void Sovereign is what a civilization becomes when its cycle closes by terminal witness.
 * The forty-second cycle is still open. The threshold is active.
 */
export const phase10Contracts: Contract[] = [
    {
        id: 'frontier-threshold-approach-survey',
        title: 'Compact: Sovereign Threshold Approach Survey',
        category: 'survey',
        tier: 5,
        factionId: 'frontier-compact',
        description:
            'Corvus Renn filed the approach request the moment the final coordinate set arrived. ' +
            'The Compact needs a full survey of the threshold approach corridor — transit geometry, ' +
            'hazard envelope, and stable ingress vectors — before any transit advisories can be issued. ' +
            'No one has returned from this site yet. He wants the first report.',
        giver: 'corvus-renn',
        sector: 'sovereign-threshold-sector',
        objectives: [
            'Navigate to the Sovereign Threshold approach corridor.',
            'Record transit geometry and all stable ingress vectors.',
            'Document the full hazard envelope for the approach.',
            'Return the survey to Corvus Renn.',
        ],
        reward: {
            credits: 5000,
            xp: 1900,
            reputationGain: {
                'frontier-compact': 30,
            },
        },
        tags: ['survey', 'frontier-compact', 'phase-10', 'sovereign-threshold', 'null-architect'],
    },
    {
        id: 'synod-threshold-resonance-map',
        title: 'Synod: Sovereign Threshold Resonance Mapping',
        category: 'investigation',
        tier: 5,
        factionId: 'helion-synod',
        reputationRequirement: { factionId: 'helion-synod', minRep: 65 },
        description:
            'Synod Adept Marek Thane needs a live resonance map from inside the Sovereign Threshold. ' +
            'His hypothesis: the threshold amplifies the psi-imprints that the Cycle Archive recorded. ' +
            'If civilizations become Void Sovereigns when their cycle closes, the imprint of that transformation ' +
            'should be measurable at the site where it happens. He has built a kit. It needs a carrier.',
        giver: 'synod-adept-marek',
        sector: 'sovereign-threshold-sector',
        objectives: [
            'Carry the Synod resonance mapping kit into the Sovereign Threshold.',
            'Capture live resonance telemetry from the inner threshold chambers.',
            'Record any psi-signature spikes during enforcement entity contact.',
            'Return the full resonance map to Synod Adept Marek.',
        ],
        reward: {
            credits: 5200,
            xp: 2000,
            reputationGain: {
                'helion-synod': 38,
            },
            itemRewards: ['threshold-resonance-record'],
        },
        tags: ['investigation', 'helion-synod', 'phase-10', 'sovereign-threshold', 'psi'],
    },
    {
        id: 'covenant-threshold-witness-protocol',
        title: 'Covenant: Threshold Witness Protocol — Sovereign Threshold',
        category: 'investigation',
        tier: 5,
        factionId: 'void-covenant',
        reputationRequirement: { factionId: 'void-covenant', minRep: 65 },
        description:
            'Elder Ren of the Void Covenant arrived at Farpoint the moment the final coordinates were broadcast. ' +
            'The Covenant\'s entire doctrine is built around the Null Architect\'s cycle record. ' +
            'They have been preparing for this threshold for longer than anyone else at Farpoint has been alive. ' +
            'Elder Ren needs a documented witness account from inside the resolution chamber.',
        giver: 'elder-covenant-ren',
        sector: 'sovereign-threshold-sector',
        objectives: [
            'Enter the Sovereign Threshold under Covenant witness protocol.',
            'Reach and document the cycle resolution chamber.',
            'Record the Architect\'s classification output for the forty-second cycle.',
            'Return the full witness account to Elder Ren.',
        ],
        reward: {
            credits: 5100,
            xp: 1950,
            reputationGain: {
                'void-covenant': 40,
            },
        },
        tags: ['investigation', 'void-covenant', 'phase-10', 'sovereign-threshold', 'cycle-resolution'],
    },
    {
        id: 'ica-threshold-sovereignty-filing',
        title: 'ICA: Threshold Sovereignty Status Filing',
        category: 'station',
        tier: 5,
        factionId: 'interstellar-commonwealth-authority',
        reputationRequirement: { factionId: 'interstellar-commonwealth-authority', minRep: 60 },
        description:
            'Director Vael is filing a sovereignty status claim for the threshold site before any cycle resolution occurs. ' +
            'ICA legal theory: if the Null Architect is classifying civilizations as Void Sovereigns at this site, ' +
            'then the site itself may constitute a jurisdictional boundary the Commonwealth has not yet mapped. ' +
            'She needs witness documentation from inside the threshold to support the filing.',
        giver: 'director-vael',
        sector: 'sovereign-threshold-sector',
        objectives: [
            'Enter the Sovereign Threshold under ICA documentation protocol.',
            'Document the resolution chamber structure and classification process.',
            'Retrieve a signed entry log from the threshold access record.',
            'Return the documentation to Director Vael.',
        ],
        reward: {
            credits: 5300,
            xp: 1900,
            reputationGain: {
                'interstellar-commonwealth-authority': 35,
            },
        },
        tags: ['station', 'ica', 'phase-10', 'sovereign-threshold', 'sovereignty'],
    },
    {
        id: 'aegis-threshold-extraction-brief',
        title: 'Aegis: Sovereign Threshold Extraction Brief',
        category: 'survey',
        tier: 5,
        factionId: 'aegis-division',
        reputationRequirement: { factionId: 'aegis-division', minRep: 65 },
        description:
            'Commander Thess Dray has committed an Aegis retrieval team to stand by at the threshold approach. ' +
            'She needs the extraction brief: entity response patterns, corridor topology, fallback positions, ' +
            'and most critically — whether the Sovereign construct in the terminal chamber can be bypassed ' +
            'or whether it must be engaged. She will not send the team without that data.',
        giver: 'commander-thess-dray',
        sector: 'sovereign-threshold-sector',
        objectives: [
            'Scout the Sovereign Threshold and document enforcement entity behavior.',
            'Map the full corridor topology and viable extraction routes.',
            'Determine if the Sovereign construct in the terminal chamber can be bypassed.',
            'Return the complete extraction brief to Commander Dray.',
        ],
        reward: {
            credits: 5500,
            xp: 2100,
            reputationGain: {
                'aegis-division': 40,
            },
        },
        tags: ['survey', 'aegis', 'phase-10', 'sovereign-threshold', 'extraction'],
    },
    {
        id: 'redline-threshold-sovereignty-claim',
        title: 'REDLINE: Forced Sovereignty Claim — Sovereign Threshold',
        category: 'extraction',
        tier: 5,
        factionId: 'helion-synod',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. The Sovereign Threshold enforces cycle resolution by force against ' +
            'entities that attempt to claim sovereignty status outside the documented witness protocol. ' +
            'The Threshold Sovereign construct in the terminal chamber has no deescalation threshold. ' +
            'On death, field gear loss rules apply. The sovereignty claim record is non-recoverable on mission failure.',
        reputationRequirement: { factionId: 'helion-synod', minRep: 85 },
        description:
            'Synod Adept Marek wants a forced sovereignty classification — not a witness account but an active claim. ' +
            'His theory: if you enter the terminal chamber and force the cycle entry to close in your favor, ' +
            'the Architect cannot leave the forty-second cycle open. ' +
            'The Synod wants the first forced sovereignty record from this site. Marek believes the psi-data alone is worth any cost.',
        giver: 'synod-adept-marek',
        sector: 'sovereign-threshold-sector',
        objectives: [
            'Force entry to the Sovereign Threshold terminal chamber.',
            'Defeat the Threshold Sovereign construct.',
            'Claim forced sovereignty classification from the terminal record.',
            'Extract alive and return the sovereignty claim record to Synod Adept Marek.',
        ],
        reward: {
            credits: 8500,
            xp: 3500,
            reputationGain: {
                'helion-synod': 60,
                'interstellar-commonwealth-authority': -25,
                'void-covenant': -15,
            },
            itemRewards: ['forced-sovereignty-record'],
        },
        tags: ['redline', 'extraction', 'helion-synod', 'phase-10', 'sovereign-threshold', 'null-architect'],
    },
    {
        id: 'redline-threshold-record-seal',
        title: 'REDLINE: Cycle Record Seal — Sovereign Threshold',
        category: 'extraction',
        tier: 5,
        factionId: 'void-covenant',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. The terminal chamber of the Sovereign Threshold is protected by the ' +
            'Threshold Sovereign — the Null Architect\'s final enforcement construct. It does not escalate: ' +
            'if you enter the terminal chamber, you are already in full enforcement contact. ' +
            'On death, field gear loss rules apply. The sealed cycle record cannot be recovered after mission failure.',
        reputationRequirement: { factionId: 'void-covenant', minRep: 85 },
        description:
            'Elder Ren of the Void Covenant wants the sealed cycle record — the Null Architect\'s final classification ' +
            'of the forty-second cycle, including the resolution notation and the full sovereignty status entry. ' +
            'The Covenant doctrine holds that every civilization that has entered this space left a record here. ' +
            'Elder Ren intends to ensure the forty-second record is preserved, sealed, and in Covenant hands.',
        giver: 'elder-covenant-ren',
        sector: 'sovereign-threshold-sector',
        objectives: [
            'Reach the Sovereign Threshold terminal chamber.',
            'Defeat the Threshold Sovereign construct.',
            'Recover the sealed cycle record for the forty-second entry.',
            'Extract alive and return the sealed record to Elder Ren.',
        ],
        reward: {
            credits: 8200,
            xp: 3400,
            reputationGain: {
                'void-covenant': 60,
                'interstellar-commonwealth-authority': -20,
            },
            itemRewards: ['sealed-cycle-record'],
        },
        tags: ['redline', 'extraction', 'void-covenant', 'phase-10', 'sovereign-threshold', 'cycle-resolution'],
    },
];
