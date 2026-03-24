import { Contract } from '../../shared/types/contract';

/**
 * Phase 6 contracts — The Farpoint Hub.
 * Kael Mourne questline, ICA/Void Covenant faction divergence, and
 * Transit Node Zero ghost-site expedition.
 */
export const phase6Contracts: Contract[] = [

    // ── FARPOINT HUB CONTRACTS ────────────────────────────────────────────

    {
        id: 'farpoint-outer-ring-survey',
        title: 'Compact: Outer Ring Survey — Farpoint Waystation',
        category: 'survey',
        tier: 3,
        factionId: 'frontier-compact',
        description:
            'The Frontier Compact wants the outer ring beyond Farpoint Waystation surveyed and charted. ' +
            'Transit traffic is increasing and the Compact needs accurate data on access routes, ' +
            'debris fields, and signal interference zones. The outer ring is uncontrolled. ' +
            'That is what makes the data valuable.',
        giver: 'frontier-agent-leva',
        sector: 'farpoint-waystation-sector',
        objectives: [
            'Transit to the Farpoint outer ring.',
            'Chart the current sector status.',
            'Note any unauthorized transit signatures.',
            'Return survey data to Kael Mourne.',
        ],
        reward: {
            credits: 1800,
            xp: 600,
            reputationGain: {
                'frontier-compact': 20,
            },
        },
        tags: ['survey', 'frontier-compact', 'farpoint', 'phase-6', 'post-relay'],
    },

    {
        id: 'kael-ping-investigation',
        title: 'Off-Book: Relay Archive Pull — Zero-Second Timestamp',
        category: 'investigation',
        tier: 3,
        factionId: 'free-transit-compact',
        description:
            'Kael Mourne\'s distress ping predates his arrival at Farpoint by six years. ' +
            'He needs someone to pull the raw timestamp data from the relay archive. ' +
            '"Not the processed log," he says. "The raw archive. ' +
            'The processed log says \'anomaly.\' The raw archive might say where it came from." ' +
            'He\'s been sitting on this for six years. He is not calm about it.',
        giver: 'farpoint-kael-expanded',
        sector: 'farpoint-waystation-sector',
        reputationRequirement: { factionId: 'free-transit-compact', minRep: 10 },
        objectives: [
            'Access the Farpoint relay archive.',
            'Retrieve the raw timestamp data for the zero-second ping.',
            'Return raw archive data to Kael Mourne.',
        ],
        reward: {
            credits: 2200,
            xp: 800,
            reputationGain: {
                'free-transit-compact': 15,
            },
        },
        tags: ['investigation', 'questline', 'free-transit-compact', 'farpoint', 'phase-6', 'post-relay', 'kael-questline'],
    },

    {
        id: 'void-covenant-signal-trace',
        title: 'Covenant: Signal Analysis — Farpoint Relay Node',
        category: 'investigation',
        tier: 3,
        factionId: 'void-covenant',
        description:
            'Kestrel Vin wants analysis of the repeating waveform at the Farpoint relay node. ' +
            '"The pattern is intensifying," she says. "I need a current reading, not a theoretical model." ' +
            'ICA will register this as unauthorized signal analysis. ' +
            'The Covenant is aware of this and considers it an acceptable operational cost.',
        giver: 'tovan-vex',
        sector: 'farpoint-waystation-sector',
        objectives: [
            'Access the Farpoint relay node signal array.',
            'Conduct waveform analysis of the repeating signature.',
            'Return analysis data to Tovan Vex.',
        ],
        reward: {
            credits: 1600,
            xp: 550,
            reputationGain: {
                'void-covenant': 25,
            },
        },
        tags: ['investigation', 'void-covenant', 'farpoint', 'phase-6', 'post-relay', 'signal-analysis'],
    },

    {
        id: 'ica-relay-lockdown',
        title: 'ICA: Signal Analysis Interdiction — Farpoint Node',
        category: 'station',
        tier: 3,
        factionId: 'interstellar-commonwealth-authority',
        description:
            'Agent Vorren wants unauthorized signal analysis stopped at the Farpoint relay node. ' +
            '"The Covenant is operating outside ICA jurisdiction at this node," he says. ' +
            '"I need that stopped." ' +
            'Accepting this contract while the Covenant signal trace is active will cancel that agreement. ' +
            'ICA regards this as the correct outcome.',
        giver: 'ica-agent-vorren',
        sector: 'farpoint-waystation-sector',
        reputationRequirement: { factionId: 'interstellar-commonwealth-authority', minRep: 20 },
        objectives: [
            'Identify unauthorized signal analysis operations at the Farpoint relay node.',
            'File a formal ICA interdiction notice.',
            'Confirm cessation of unauthorized analysis.',
            'Report to Agent Vorren.',
        ],
        reward: {
            credits: 1800,
            xp: 620,
            reputationGain: {
                'interstellar-commonwealth-authority': 20,
            },
        },
        tags: ['station', 'ica', 'farpoint', 'phase-6', 'post-relay', 'faction-conflict'],
    },

    {
        id: 'farpoint-ghost-route-patrol',
        title: 'Compact: Ghost Route Patrol — Outer Relay Corridor',
        category: 'survey',
        tier: 3,
        factionId: 'frontier-compact',
        description:
            'Patrol the outer relay corridor for unauthorized transit signatures. ' +
            '"We\'ve had three clean-transit anomalies in the last month," says Leva. ' +
            '"Nothing in the transit log. No ships on sensor. ' +
            'I need eyes on that corridor." ' +
            'Standard patrol contract. The anomalies are not standard.',
        giver: 'frontier-agent-leva',
        sector: 'farpoint-waystation-sector',
        objectives: [
            'Transit the outer relay corridor at Farpoint.',
            'Log any unauthorized transit signatures.',
            'Note sensor anomalies and signal irregularities.',
            'Return patrol data to Frontier Agent Leva.',
        ],
        reward: {
            credits: 1400,
            xp: 500,
            reputationGain: {
                'frontier-compact': 15,
            },
        },
        tags: ['survey', 'frontier-compact', 'farpoint', 'phase-6', 'post-relay', 'patrol'],
    },

    {
        id: 'aegis-farpoint-audit',
        title: 'Aegis: Transit Anomaly Verification — Farpoint Relay',
        category: 'investigation',
        tier: 4,
        factionId: 'aegis-division',
        description:
            'Operative Sable wants independent verification of transit anomalies at the Farpoint relay node. ' +
            '"The ICA data is incomplete," she says. "I need a field-verified reading from someone who\'s ' +
            'not going to sanitize the numbers before filing." ' +
            'Aegis pays well for confirmation that something is there. ' +
            'Sable does not say what she expects you to find.',
        giver: 'operative-sable',
        sector: 'farpoint-waystation-sector',
        reputationRequirement: { factionId: 'aegis-division', minRep: 30 },
        objectives: [
            'Access the Farpoint relay node independently of ICA oversight.',
            'Conduct a full transit anomaly audit.',
            'Cross-reference findings against Aegis baseline data.',
            'File independent report with Operative Sable.',
        ],
        reward: {
            credits: 2800,
            xp: 950,
            reputationGain: {
                'aegis-division': 25,
            },
        },
        tags: ['investigation', 'aegis', 'farpoint', 'phase-6', 'post-relay', 'anomaly'],
    },

    {
        id: 'kael-zero-second-expedition',
        title: 'Off-Book: Zero-Second Coordinates — Farpoint Expedition',
        category: 'investigation',
        tier: 4,
        factionId: 'free-transit-compact',
        description:
            'The ping timestamp leads to a specific set of coordinates. ' +
            'Kael knows where it points. He won\'t send anyone alone. ' +
            '"The coordinates map to something older — a pre-relay navigation marker ' +
            'that was decommissioned eighty years ago. Except it\'s still there." ' +
            'Completion reveals Transit Node Zero on the sector map.',
        giver: 'farpoint-kael-expanded',
        sector: 'farpoint-waystation-sector',
        reputationRequirement: { factionId: 'free-transit-compact', minRep: 25 },
        objectives: [
            'Review the zero-second coordinate data with Kael Mourne.',
            'Cross-reference against pre-relay navigation records.',
            'Confirm the existence of the mapped destination.',
            'Return findings to Kael Mourne.',
        ],
        reward: {
            credits: 3200,
            xp: 1100,
            reputationGain: {
                'free-transit-compact': 20,
            },
        },
        tags: ['investigation', 'questline', 'free-transit-compact', 'farpoint', 'phase-6', 'post-relay', 'kael-questline', 'unlocks-ghost-site'],
    },

    // ── GHOST SITE CONTRACTS (require kael-questline-stage-2 flag) ────────

    {
        id: 'ghost-site-ica-recovery',
        title: 'REDLINE: ICA Probe Recovery — Transit Node Zero',
        category: 'extraction',
        tier: 4,
        factionId: 'interstellar-commonwealth-authority',
        isRedline: true,
        redlineWarning:
            'Transit Node Zero has no chart entry. ' +
            'No extraction window. No comms relay. ' +
            'If something goes wrong inside, no one knows where you are. ' +
            'ICA has a probe inside that facility. They need the data it collected. ' +
            'This contract pays at Redline rate because the risk is real and the ICA knows it.',
        reputationRequirement: { factionId: 'interstellar-commonwealth-authority', minRep: 40 },
        description:
            'Agent Vorren has confirmed an ICA probe was sent to Transit Node Zero ' +
            'before the coordinates were known to field operators. ' +
            '"The probe has been in there for eleven months," he says. ' +
            '"It has been transmitting. We have not been able to receive." ' +
            'Recover the ICA probe data from Transit Node Zero. ' +
            'Note: completing this contract will register as conflicting with Void Covenant interests.',
        giver: 'ica-agent-vorren',
        sector: 'transit-node-zero-sector',
        objectives: [
            'Transit to Transit Node Zero.',
            'Locate the ICA probe unit inside the facility.',
            'Recover the probe data core.',
            'Extract alive.',
            'Return data to Agent Vorren.',
        ],
        reward: {
            credits: 5500,
            xp: 2200,
            reputationGain: {
                'interstellar-commonwealth-authority': 40,
                'void-covenant': -20,
            },
        },
        tags: ['extraction', 'redline', 'ica', 'ghost-site', 'transit-node-zero', 'tier-4', 'phase-6', 'post-relay', 'high-risk'],
    },

    {
        id: 'ghost-site-covenant-witness',
        title: 'REDLINE: Covenant Witness Account — Transit Node Zero',
        category: 'investigation',
        tier: 4,
        factionId: 'void-covenant',
        isRedline: true,
        redlineWarning:
            'You are going somewhere the charts say does not exist. ' +
            'The Covenant believes something is still active inside. ' +
            'Kestrel Vin does not want the data. She wants testimony. ' +
            'You are being sent in as a witness, not an extraction operative. ' +
            'The distinction may not matter to whatever is inside.',
        reputationRequirement: { factionId: 'void-covenant', minRep: 35 },
        description:
            'Kestrel Vin doesn\'t want the data. She wants testimony. ' +
            '"I need someone to go inside Transit Node Zero and tell me what they experienced. ' +
            'Not a sensor log. Not a camera feed. ' +
            'A human account of what it is like to be inside that facility." ' +
            'Note: completing this contract will register as conflicting with ICA field operations.',
        giver: 'tovan-vex',
        sector: 'transit-node-zero-sector',
        objectives: [
            'Transit to Transit Node Zero.',
            'Navigate the facility and observe its operational state.',
            'Defeat or bypass the facility\'s deterrence systems.',
            'Extract alive.',
            'Provide a witness account to Kestrel Vin.',
        ],
        reward: {
            credits: 4800,
            xp: 2000,
            reputationGain: {
                'void-covenant': 45,
                'interstellar-commonwealth-authority': -15,
            },
        },
        tags: ['investigation', 'redline', 'void-covenant', 'ghost-site', 'transit-node-zero', 'tier-4', 'phase-6', 'post-relay', 'high-risk'],
    },

    {
        id: 'farpoint-archive-lore-pull',
        title: 'Off-Book: Old Relay Data Archive — Farpoint Records',
        category: 'investigation',
        tier: 3,
        factionId: 'free-transit-compact',
        description:
            'Kael\'s been compiling records at Farpoint. He needs someone to access the old relay data archive. ' +
            '"Not dangerous," he says. "Just complicated. ' +
            'The archive predates the current relay network. ' +
            'The access system doesn\'t recognize current authentication formats." ' +
            'Aryn Voss can pass on what you find.',
        giver: 'farpoint-kael-expanded',
        sector: 'farpoint-waystation-sector',
        objectives: [
            'Access the old relay data archive at Farpoint Waystation.',
            'Retrieve historical transit records in pre-relay format.',
            'Pass the compiled archive data to Aryn Voss for handoff.',
        ],
        reward: {
            credits: 1200,
            xp: 400,
            reputationGain: {
                'free-transit-compact': 10,
            },
        },
        tags: ['investigation', 'free-transit-compact', 'farpoint', 'phase-6', 'post-relay', 'archive'],
    },
];
