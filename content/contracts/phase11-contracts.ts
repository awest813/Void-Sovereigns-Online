import { Contract } from '../../shared/types/contract';

/**
 * Phase 11 contracts — The Origin Node.
 * When the Sovereign Threshold was cleared the Threshold Herald went silent.
 * Its last act was not a transmission — it burned a coordinate set directly into the Farpoint
 * nav systems, addressed to no faction and received by all of them simultaneously.
 * The coordinates point to a site that predates every known Architect installation by centuries:
 * the place where the first cycle entry was recorded.
 * The Origin Node has been active since before any civilization in the archive sequence existed.
 */
export const phase11Contracts: Contract[] = [
    {
        id: 'frontier-origin-node-survey',
        title: 'Compact: Origin Node Approach Survey',
        category: 'survey',
        tier: 5,
        factionId: 'frontier-compact',
        description:
            'Archivist Sol filed the approach request within minutes of the Herald\'s coordinate burn. ' +
            'The Compact needs a full survey of the Origin Node approach corridor — transit geometry, ' +
            'hazard profile, and stable ingress vectors. No existing nav record covers this site. ' +
            'Sol believes the approach itself will contain data older than any known Architect output. ' +
            'She wants the first survey report before anyone else files an approach.',
        giver: 'frontier-archivist-sol',
        sector: 'origin-node-sector',
        objectives: [
            'Navigate to the Origin Node approach corridor.',
            'Record transit geometry and all stable ingress vectors.',
            'Document the hazard profile and any anomalous infrastructure signatures.',
            'Return the survey to Archivist Sol.',
        ],
        reward: {
            credits: 5200,
            xp: 2000,
            reputationGain: {
                'frontier-compact': 32,
            },
        },
        tags: ['survey', 'frontier-compact', 'phase-11', 'origin-node', 'null-architect'],
    },
    {
        id: 'synod-origin-resonance-trace',
        title: 'Synod: Origin Node Resonance Trace',
        category: 'investigation',
        tier: 5,
        factionId: 'helion-synod',
        reputationRequirement: { factionId: 'helion-synod', minRep: 70 },
        description:
            'Synod Adept Marek Thane has updated his resonance hypothesis following the threshold data. ' +
            'The Origin Node predates the archive sequence. If psi-imprints accumulate over the duration of ' +
            'the recording process, the Origin Node should carry the highest imprint density of any known site — ' +
            'centuries of civilization-record resonance concentrated in one location. ' +
            'He has rebuilt the mapping kit for a deeper trace. It needs a carrier who has survived the threshold.',
        giver: 'synod-adept-marek',
        sector: 'origin-node-sector',
        objectives: [
            'Carry the Synod deep-resonance mapping kit into the Origin Node.',
            'Capture live resonance telemetry from the inner Origin chambers.',
            'Record psi-density measurements from the first-record gallery.',
            'Return the full resonance trace to Synod Adept Marek.',
        ],
        reward: {
            credits: 5500,
            xp: 2100,
            reputationGain: {
                'helion-synod': 42,
            },
            itemRewards: ['origin-cycle-fragment'],
        },
        tags: ['investigation', 'helion-synod', 'phase-11', 'origin-node', 'psi'],
    },
    {
        id: 'covenant-origin-first-record',
        title: 'Covenant: Origin First Record — Witness Account',
        category: 'investigation',
        tier: 5,
        factionId: 'void-covenant',
        reputationRequirement: { factionId: 'void-covenant', minRep: 70 },
        description:
            'Elder Ren of the Void Covenant stood at Farpoint when the Herald went silent. ' +
            'She was the only person present who did not appear surprised. ' +
            'The Covenant\'s archive research has always pointed to a first entry — a cycle zero, ' +
            'the moment the Architect decided that unknown was not acceptable. ' +
            'Elder Ren needs a documented witness account from inside the Origin Node\'s first-record gallery. ' +
            'She intends to close the Covenant\'s own archive with the entry that started the Architect\'s.',
        giver: 'elder-covenant-ren',
        sector: 'origin-node-sector',
        objectives: [
            'Enter the Origin Node under Covenant witness protocol.',
            'Reach and document the first-record gallery.',
            'Record the Architect\'s original cycle-zero classification notation.',
            'Return the full witness account to Elder Ren.',
        ],
        reward: {
            credits: 5300,
            xp: 2050,
            reputationGain: {
                'void-covenant': 44,
            },
        },
        tags: ['investigation', 'void-covenant', 'phase-11', 'origin-node', 'first-record'],
    },
    {
        id: 'ica-origin-node-jurisdiction',
        title: 'ICA: Origin Node Jurisdiction — Pre-Archive Filing',
        category: 'station',
        tier: 5,
        factionId: 'interstellar-commonwealth-authority',
        reputationRequirement: { factionId: 'interstellar-commonwealth-authority', minRep: 65 },
        description:
            'Director Vael is filing a pre-archive jurisdiction claim for the Origin Node. ' +
            'Her legal theory has expanded since the threshold filing: if the Architect has been classifying ' +
            'civilizations at the threshold since before ICA existed, then the Origin Node — the site where ' +
            'the process began — may predate Commonwealth law entirely. ' +
            'She needs witness documentation from the first-record gallery to determine if any prior jurisdiction ' +
            'claim could even theoretically apply to a site this old.',
        giver: 'director-vael',
        sector: 'origin-node-sector',
        objectives: [
            'Enter the Origin Node under ICA documentation protocol.',
            'Document the first-record gallery structure and original cycle notation.',
            'Retrieve a signed entry from the Origin Node access record.',
            'Return the documentation to Director Vael.',
        ],
        reward: {
            credits: 5600,
            xp: 2000,
            reputationGain: {
                'interstellar-commonwealth-authority': 38,
            },
        },
        tags: ['station', 'ica', 'phase-11', 'origin-node', 'jurisdiction'],
    },
    {
        id: 'aegis-origin-threat-assessment',
        title: 'Aegis: Origin Node Threat Assessment',
        category: 'survey',
        tier: 5,
        factionId: 'aegis-division',
        reputationRequirement: { factionId: 'aegis-division', minRep: 70 },
        description:
            'Commander Thess Dray is assembling the Origin Node threat brief before committing any Aegis assets. ' +
            'Her concern: the Origin Node constructs are centuries older than the threshold enforcement architecture ' +
            'and have had no operational contact with any known civilization since the first cycle. ' +
            'She does not know if they will behave according to established Architect enforcement patterns. ' +
            'She needs the threat profile before anyone else files an operational approach.',
        giver: 'commander-thess-dray',
        sector: 'origin-node-sector',
        objectives: [
            'Scout the Origin Node and document enforcement construct behavior.',
            'Map the full corridor topology and viable extraction routes.',
            'Assess whether Origin Node constructs differ operationally from threshold enforcement.',
            'Return the complete threat assessment to Commander Dray.',
        ],
        reward: {
            credits: 5800,
            xp: 2200,
            reputationGain: {
                'aegis-division': 44,
            },
        },
        tags: ['survey', 'aegis', 'phase-11', 'origin-node', 'threat-assessment'],
    },
    {
        id: 'redline-origin-record-extraction',
        title: 'REDLINE: First Record Extraction — Origin Node',
        category: 'extraction',
        tier: 5,
        factionId: 'helion-synod',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. The Origin Node Apex is the record-keeping construct for the first cycle entry. ' +
            'It is not a deterrence unit — it is the record itself, manifested as an enforcement entity. ' +
            'The Origin Node constructs are centuries older than the threshold architecture and behave ' +
            'according to a protocol that predates all known Architect operational data. ' +
            'On death, field gear loss rules apply. The first-record extract is non-recoverable on mission failure.',
        reputationRequirement: { factionId: 'helion-synod', minRep: 90 },
        description:
            'Synod Adept Marek Thane wants a physical extract from the first-record gallery — not a witness account ' +
            'but a tangible fragment of the original cycle-zero notation. ' +
            'He believes the first record contains the Architect\'s original decision framework: ' +
            'the rules it set for itself before it had any cycle data to work from. ' +
            'The resonance density in that fragment alone would answer questions the Synod has held for forty years. ' +
            'He will fund the run at any cost.',
        giver: 'synod-adept-marek',
        sector: 'origin-node-sector',
        objectives: [
            'Force access to the Origin Node first-record gallery.',
            'Defeat the Origin Node Apex construct.',
            'Extract a physical fragment of the cycle-zero first record.',
            'Return alive and deliver the first-record extract to Synod Adept Marek.',
        ],
        reward: {
            credits: 9000,
            xp: 3800,
            reputationGain: {
                'helion-synod': 65,
                'void-covenant': -20,
                'interstellar-commonwealth-authority': -28,
            },
            itemRewards: ['first-record-extract'],
        },
        tags: ['redline', 'extraction', 'helion-synod', 'phase-11', 'origin-node', 'null-architect'],
    },
    {
        id: 'redline-origin-architect-seal',
        title: 'REDLINE: Architect Origin Seal — Origin Node',
        category: 'extraction',
        tier: 5,
        factionId: 'void-covenant',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. The Origin Node Apex carries the Architect\'s origin seal — ' +
            'the classification token for the first cycle entry, predating all other Architect output. ' +
            'The Apex does not distinguish between witness protocol and forced access: ' +
            'any operative who reaches the first-record terminal is already in full enforcement contact. ' +
            'On death, field gear loss rules apply. The architect origin seal cannot be recovered after mission failure.',
        reputationRequirement: { factionId: 'void-covenant', minRep: 90 },
        description:
            'Elder Ren of the Void Covenant wants the Architect\'s origin seal: the classification token that ' +
            'the Architect created when it made its first cycle entry and decided, for the first time, ' +
            'that unknown was not acceptable. ' +
            'The Covenant\'s doctrine holds that this seal is the oldest intentional object in known space — ' +
            'not built, not found, but decided into existence. ' +
            'Elder Ren believes possessing it closes the Covenant\'s own cycle in a way that nothing else could.',
        giver: 'elder-covenant-ren',
        sector: 'origin-node-sector',
        objectives: [
            'Reach the Origin Node first-record terminal.',
            'Defeat the Origin Node Apex construct.',
            'Recover the Architect\'s origin seal from the Apex core.',
            'Extract alive and return the origin seal to Elder Ren.',
        ],
        reward: {
            credits: 8800,
            xp: 3700,
            reputationGain: {
                'void-covenant': 65,
                'interstellar-commonwealth-authority': -22,
            },
            itemRewards: ['architect-origin-seal'],
        },
        tags: ['redline', 'extraction', 'void-covenant', 'phase-11', 'origin-node', 'first-record'],
    },
];
