import { Contract } from '../../shared/types/contract';

/**
 * Phase 4 contracts — faction-shaped work in the post-relay frontier.
 * Kalindra Drift (Frontier Compact, Aegis Division, Vanta Corsairs)
 * Orin's Crossing (Sol Union Directorate, ICA, Aegis Division)
 * Includes the first Redline contract groundwork.
 */
export const phase4Contracts: Contract[] = [

    // ── FRONTIER COMPACT ──────────────────────────────────────────────────

    {
        id: 'frontier-supply-run-kalindra',
        title: 'Compact: Supply Courier — Kalindra Approach',
        category: 'delivery',
        tier: 3,
        factionId: 'frontier-compact',
        description:
            'Frontier Agent Leva needs a courier to carry a supply manifest and route assessment packet ' +
            'to the Frontier Compact\'s holding crew near the Kalindra Drift approach. ' +
            '"It\'s not glamorous work," she says. "But we need someone out there on record. ' +
            'If the Compact has active operators in the Drift, the Aegis classification notice carries less weight in arbitration." ' +
            'This is as much a legal move as a logistics run.',
        giver: 'frontier-agent-leva',
        sector: 'kalindra-drift',
        objectives: [
            'Accept the supply manifest packet from Agent Leva at Farpoint.',
            'Transit to the Kalindra Drift approach zone.',
            'Locate the Compact holding crew and deliver the manifest.',
            'Return route assessment confirmation to Leva.',
        ],
        reward: {
            credits: 1100,
            xp: 520,
            reputationGain: {
                'frontier-compact': 20,
                'free-transit-compact': 8,
            },
        },
        tags: ['delivery', 'frontier-compact', 'kalindra', 'tier-3', 'phase-4', 'post-relay'],
    },

    {
        id: 'frontier-route-survey-kalindra',
        title: 'Compact: Route Survey — Kalindra Drift Approaches',
        category: 'survey',
        tier: 3,
        factionId: 'frontier-compact',
        description:
            'The Frontier Compact needs a proper navigational survey of the Kalindra Drift debris field — ' +
            'safe approach vectors, hazard markers, and a preliminary assessment of what automation systems ' +
            'are still active in the outer sections. ' +
            '"We have salvage rights on the outer zone," Leva says. "What we don\'t have is a map that\'s less than two years old. ' +
            'The debris field has shifted. Probably. We need someone to go find out."',
        giver: 'frontier-agent-leva',
        sector: 'kalindra-drift',
        objectives: [
            'Transit to the Kalindra Drift debris field.',
            'Conduct approach vector survey of outer zone debris patterns.',
            'Identify and mark active hazard zones.',
            'Return survey data to Agent Leva.',
        ],
        reward: {
            credits: 1280,
            xp: 600,
            reputationGain: {
                'frontier-compact': 22,
                'meridian-dock-authority': 8,
            },
            itemRewards: ['kalindra-nav-fragment'],
        },
        tags: ['survey', 'frontier-compact', 'kalindra', 'tier-3', 'phase-4', 'post-relay'],
    },

    {
        id: 'frontier-salvage-certification',
        title: 'Compact: Certified Salvage Recovery — Kalindra Outer Zone',
        category: 'salvage',
        tier: 3,
        factionId: 'frontier-compact',
        description:
            'The Frontier Compact has certified salvage rights on the Kalindra Drift outer sections. ' +
            'What they need now is someone to actually recover the cargo — legally, on record, ' +
            'with a manifest the Compact can use in their arbitration filing against the Aegis classification. ' +
            '"Bring it back clean," Leva says. "No shortcuts. We need this on the record."',
        giver: 'frontier-agent-leva',
        sector: 'kalindra-drift',
        reputationRequirement: { factionId: 'frontier-compact', minRep: 25 },
        objectives: [
            'Transit to Kalindra Drift outer zone.',
            'Recover certified salvage using Compact manifest authorization.',
            'Log recovery data for arbitration record.',
            'Return salvage to Frontier Compact holding at Farpoint.',
        ],
        reward: {
            credits: 1550,
            xp: 720,
            reputationGain: {
                'frontier-compact': 28,
                'ashwake-extraction-guild': 12,
            },
        },
        tags: ['salvage', 'frontier-compact', 'kalindra', 'tier-3', 'phase-4', 'post-relay'],
    },

    // ── SOL UNION DIRECTORATE ─────────────────────────────────────────────

    {
        id: 'sol-union-compliance-check',
        title: "Sol Union: Compliance Inspection — Orin's Crossing Approach",
        category: 'investigation',
        tier: 3,
        factionId: 'sol-union-directorate',
        description:
            'Commander Dresh is short-staffed and has a backlog of transit compliance checks for vessels ' +
            'that passed through Orin\'s Crossing without completing full manifest inspection. ' +
            '"I can\'t send garrison personnel — they\'re visible, and half these vessels will scatter before we dock. ' +
            'I need an independent operator with a clean transit record to conduct the inspections. ' +
            'You will be acting under Sol Union authority. You will be compensated proportionally. ' +
            'You will file accurate reports."',
        giver: 'commander-dresh',
        sector: 'orins-crossing',
        objectives: [
            'Receive Sol Union inspection authorization from Commander Dresh.',
            'Locate and board three flagged vessels in the Crossing approach.',
            'Conduct compliance inspections and file accurate reports.',
            'Return completed reports to Commander Dresh.',
        ],
        reward: {
            credits: 1400,
            xp: 660,
            reputationGain: {
                'sol-union-directorate': 25,
                'interstellar-commonwealth-authority': 8,
            },
        },
        tags: ['investigation', 'sol-union', 'orins-crossing', 'tier-3', 'phase-4', 'post-relay'],
    },

    {
        id: 'sol-union-sector-enforcement',
        title: "Sol Union: Enforcement — Unauthorized Salvagers in Restricted Corridor",
        category: 'bounty',
        tier: 4,
        factionId: 'sol-union-directorate',
        reputationRequirement: { factionId: 'sol-union-directorate', minRep: 30 },
        description:
            'A group of unauthorized salvagers has been operating in the Sol Union\'s restricted transit corridor ' +
            'adjacent to Orin\'s Crossing. They have ignored three standard broadcast warnings. ' +
            '"I could send the garrison," Dresh says. "Then I have incident reports, jurisdiction filings, ' +
            'and an ICA query about why Sol Union enforcement was active in a contested zone. ' +
            'Or I can have a private operator persuade them to leave. Your choice of method. My preference is no bodies."',
        giver: 'commander-dresh',
        sector: 'orins-crossing',
        objectives: [
            'Locate the unauthorized salvage operation in the restricted corridor.',
            'Compel their departure by any non-lethal means available.',
            'Confirm the corridor is clear.',
            'Report to Commander Dresh.',
        ],
        reward: {
            credits: 1900,
            xp: 880,
            reputationGain: {
                'sol-union-directorate': 32,
                'vanta-corsairs': -10,
            },
        },
        tags: ['bounty', 'enforcement', 'sol-union', 'orins-crossing', 'tier-4', 'phase-4', 'post-relay'],
    },

    // ── AEGIS DIVISION ────────────────────────────────────────────────────

    {
        id: 'aegis-sealed-site-recovery',
        title: 'Aegis: Sealed-Site Data Recovery — Kalindra Signal Archive',
        category: 'investigation',
        tier: 3,
        factionId: 'aegis-division',
        description:
            'Operative Sable needs the signal archive node from Kalindra Hub\'s engineering section — ' +
            'the section covered by the Aegis classification notice. ' +
            '"Technically, you need Aegis clearance to access the inner sections," she says. ' +
            '"I am Aegis. I\'m authorizing you. If anyone asks, you\'re operating under my field authority." ' +
            'She pauses. "No one will ask. The people who would ask are not paying attention to Kalindra right now. ' +
            'I want to know why they aren\'t."',
        giver: 'operative-sable',
        sector: 'kalindra-drift',
        reputationRequirement: { factionId: 'aegis-division', minRep: 20 },
        objectives: [
            'Transit to Kalindra Drift.',
            'Gain access to Kalindra Hub engineering section (Aegis classification zone).',
            'Recover the signal archive node.',
            'Return the archive node to Operative Sable at Meridian.',
        ],
        reward: {
            credits: 1650,
            xp: 780,
            reputationGain: {
                'aegis-division': 30,
                'void-covenant': 12,
            },
            itemRewards: ['kalindra-signal-archive'],
        },
        tags: ['investigation', 'aegis', 'kalindra', 'mystery', 'tier-3', 'phase-4', 'post-relay', 'void-adjacent'],
    },

    {
        id: 'aegis-missing-team-kalindra',
        title: 'Aegis: Missing Field Team — Kalindra Drift Interior',
        category: 'investigation',
        tier: 4,
        factionId: 'aegis-division',
        reputationRequirement: { factionId: 'aegis-division', minRep: 60 },
        description:
            'Operative Sable\'s four-person survey team has been dark for twelve days in the Kalindra Drift. ' +
            'Their last transmission was a partial log upload. The contents are not public. ' +
            '"I need someone to go in and find them," she says. ' +
            '"Not because I think they are alive. Because I need to know what they found. ' +
            'The last entry in their log is a partial sensor record from the signal archive room. ' +
            'The record cuts off at a data point I need to understand." ' +
            'She looks at you for a long moment. "Go prepared."',
        giver: 'operative-sable',
        sector: 'kalindra-drift',
        objectives: [
            'Transit to Kalindra Drift.',
            'Locate the Aegis survey team\'s last known position in the hub interior.',
            'Recover their equipment log and final sensor data.',
            'Return findings to Operative Sable.',
        ],
        reward: {
            credits: 2100,
            xp: 980,
            reputationGain: {
                'aegis-division': 40,
                'void-covenant': 18,
            },
            itemRewards: ['aegis-field-log', 'void-pattern-record'],
        },
        tags: ['investigation', 'aegis', 'kalindra', 'mystery', 'tier-4', 'phase-4', 'post-relay', 'void-adjacent'],
    },

    {
        id: 'aegis-anomaly-trace-orin',
        title: "Aegis: Anomaly Trace — Orin's Crossing Transit Log",
        category: 'investigation',
        tier: 4,
        factionId: 'aegis-division',
        reputationRequirement: { factionId: 'aegis-division', minRep: 20 },
        description:
            'Commander Dresh\'s twelve flagged transit anomalies at Orin\'s Crossing represent the largest single-site ' +
            'anomaly cluster Operative Sable has catalogued. ' +
            '"Dresh forwarded his logs to Sol Union command. They did not respond. He forwarded them to me instead." ' +
            'She slides a data chip across the table. ' +
            '"I need you to go to Orin\'s Crossing, pull the raw sensor data from the transit corridor arrays, ' +
            'and bring it back intact. Not a copy. The originals. Someone may have already edited the copies."',
        giver: 'operative-sable',
        sector: 'orins-crossing',
        objectives: [
            "Transit to Orin's Crossing.",
            'Locate the transit corridor sensor array data archives.',
            'Recover the raw, unedited sensor records.',
            'Return the records to Operative Sable at Meridian.',
        ],
        reward: {
            credits: 1800,
            xp: 840,
            reputationGain: {
                'aegis-division': 35,
                'sol-union-directorate': 10,
                'void-covenant': 10,
            },
            itemRewards: ['transit-anomaly-log'],
        },
        tags: ['investigation', 'aegis', 'orins-crossing', 'mystery', 'anomaly', 'tier-4', 'phase-4', 'post-relay', 'void-adjacent'],
    },

    // ── VANTA CORSAIRS ────────────────────────────────────────────────────

    {
        id: 'vanta-off-book-salvage',
        title: 'Off-Book: Kalindra Hub — Unlogged Freight Recovery',
        category: 'salvage',
        tier: 3,
        factionId: 'vanta-corsairs',
        description:
            'Crow has a contact who has a manifest for freight that was loaded at Kalindra Hub ' +
            'the week before the relay network closed — freight that was never officially logged ' +
            'and therefore does not appear on any Aegis classification notice or Compact salvage filing. ' +
            '"From a legal standpoint," Crow says, "it\'s just cargo sitting there." ' +
            'They pause. "From every other standpoint, this requires some nuance." ' +
            'Crow does not specify what kind of nuance. Crow never does.',
        giver: 'crow-veslin',
        sector: 'kalindra-drift',
        objectives: [
            'Transit to Kalindra Drift.',
            'Locate the unlogged freight hold in the Kalindra Hub interior.',
            'Recover the unmarked cargo.',
            'Return the cargo to Crow at Meridian.',
        ],
        reward: {
            credits: 1750,
            xp: 800,
            reputationGain: {
                'vanta-corsairs': 28,
                'aegis-division': -8,
                'sol-union-directorate': -6,
            },
        },
        tags: ['salvage', 'gray-market', 'vanta', 'kalindra', 'tier-3', 'phase-4', 'post-relay'],
    },

    // ── REDLINE CONTRACTS ─────────────────────────────────────────────────

    {
        id: 'redline-kalindra-core',
        title: 'REDLINE: Deep Recovery — Kalindra Hub Core Section',
        category: 'extraction',
        tier: 4,
        factionId: 'frontier-compact',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. If you are killed or forced to emergency-extract during this run, ' +
            'most of your equipped field gear will not be recovered. ' +
            'Your ship will return on autopilot with whatever is secured in the cargo hold. ' +
            'Your equipped items stay in the zone. ' +
            'This contract pays triple standard rate because the risk is real. ' +
            'Do not accept this contract unless you are prepared for that outcome.',
        reputationRequirement: { factionId: 'frontier-compact', minRep: 60 },
        description:
            'The Kalindra Hub core section contains the processing facility\'s primary control systems, ' +
            'freight manifest archive, and — according to Aegis classification records that Leva obtained ' +
            'through methods she will not describe — something in the signal relay room that the Aegis team ' +
            'found and filed under a classification code that does not appear in any public index. ' +
            '"I need whatever is in that room," Leva says. ' +
            '"I need it more than Aegis does. And I need it before they decide to send someone better than you." ' +
            'She slides the contract slip across. The red line along the margin is not decorative.',
        giver: 'frontier-agent-leva',
        sector: 'kalindra-drift',
        objectives: [
            'Transit to Kalindra Drift with full field equipment.',
            'Reach the Kalindra Hub core section.',
            'Recover the contents of the signal relay room.',
            'Extract alive.',
            'Return findings to Agent Leva.',
        ],
        reward: {
            credits: 4200,
            xp: 1800,
            reputationGain: {
                'frontier-compact': 55,
                'aegis-division': -20,
                'void-covenant': 25,
            },
            itemRewards: ['kalindra-signal-archive', 'void-pattern-record', 'anomaly-trace-log'],
        },
        tags: ['extraction', 'redline', 'frontier-compact', 'kalindra', 'tier-4', 'phase-4', 'post-relay', 'void-adjacent', 'high-risk'],
    },
];
