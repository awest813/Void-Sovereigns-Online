import { Contract } from '../../shared/types/contract';

/**
 * Phase 2 contracts for Meridian Station.
 * Introduces missing crew investigation, escort/freight, station trouble,
 * and deeper survey work — all tied to ship progression and faction rep.
 */
export const phase2Contracts: Contract[] = [

    // ── COLDFRAME STATION-B ───────────────────────────────────────────────

    {
        id: 'missing-crew-coldframe',
        title: 'Missing Crew: Coldframe Station-B',
        category: 'investigation',
        tier: 1,
        description:
            'Seven crew members were stationed at Coldframe Station-B in outer Ashwake. ' +
            'Forty-two days ago, all comms from the station ceased. No distress signal. No departure record. ' +
            'The Guild has written it off as an automation fault. ' +
            'Tamsin Vale is not satisfied with that answer. Find out what happened.',
        giver: 'tamsin-vale',
        sector: 'ashwake-belt',
        objectives: [
            'Enter Coldframe Station-B.',
            'Locate any sign of the missing crew.',
            'Recover the station\'s black box data.',
            'Return to Tamsin Vale with a report.',
        ],
        reward: {
            credits: 520,
            xp: 260,
            reputationGain: {
                'meridian-dock-authority': 12,
                'ashwake-extraction-guild': 5,
            },
            itemRewards: ['black-box-fragment'],
        },
        tags: ['investigation', 'mystery', 'coldframe', 'ashwake', 'tier-1', 'phase-2', 'void-adjacent'],
    },

    {
        id: 'scrap-recovery-coldframe',
        title: 'Scrap Recovery: Coldframe Station-B',
        category: 'salvage',
        tier: 1,
        description:
            'Now that the station is flagged compromised, the Guild wants anything recoverable ' +
            'before the site is locked off. Cryo-components, power cells, and any intact equipment. ' +
            'The station\'s automation has reportedly reactivated — approach with caution.',
        giver: 'guild-rep-halvek',
        sector: 'ashwake-belt',
        objectives: [
            'Enter Coldframe Station-B.',
            'Recover cryo-components and salvage from the operations bay.',
            'Return the salvage to Halvek Dross on Meridian Station.',
        ],
        reward: {
            credits: 380,
            xp: 180,
            reputationGain: {
                'ashwake-extraction-guild': 10,
            },
        },
        tags: ['salvage', 'coldframe', 'ashwake', 'tier-1', 'phase-2'],
    },

    // ── ESCORT / FREIGHT ─────────────────────────────────────────────────

    {
        id: 'escort-ore-convoy',
        title: 'Escort: Guild Ore Convoy to Rig Delta-4',
        category: 'escort',
        tier: 2,
        description:
            'The Extraction Guild is running an ore convoy from Rig Delta-4 back to Meridian Station. ' +
            'Recent claim-jumper activity in the outer belt has the Guild nervous. ' +
            'They want a second ship in the convoy. Your job: keep the hauler alive. ' +
            'If you own a Meridian Hauler class or better, the Guild will fast-track your certification.',
        giver: 'guild-rep-halvek',
        sector: 'ashwake-belt',
        objectives: [
            'Launch with the convoy from the Meridian Station docking ring.',
            'Escort the Guild hauler through the outer belt.',
            'Arrive at Rig Delta-4 and return with the convoy.',
            'Report to Halvek Dross at Meridian Station.',
        ],
        reward: {
            credits: 640,
            xp: 280,
            reputationGain: {
                'ashwake-extraction-guild': 15,
                'meridian-dock-authority': 5,
            },
        },
        tags: ['escort', 'combat', 'ashwake', 'tier-2', 'phase-2', 'ship-related'],
    },

    {
        id: 'freight-medical-outer-hab',
        title: 'Freight Run: Medical Supplies to Outer Habitat Ring',
        category: 'delivery',
        tier: 1,
        description:
            'Workers in the outer Ashwake hab-ring are running low on medical supplies. ' +
            'Their supply line was disrupted when Rig Bravo went dark. ' +
            'Simple run. No known hostile activity — recently. ' +
            'The crew chief says she will throw in a ship part if you can get there in one piece.',
        giver: 'torrek-voss',
        sector: 'ashwake-belt',
        objectives: [
            'Pick up the medical supply crate from Bay 12 on Meridian Station.',
            'Deliver the crate to the outer hab-ring workers.',
            'Return delivery confirmation to Torrek Voss.',
        ],
        reward: {
            credits: 240,
            xp: 110,
            reputationGain: {
                'ashwake-extraction-guild': 5,
                'free-transit-compact': 8,
            },
            itemRewards: ['repair-kit'],
        },
        tags: ['delivery', 'low-risk', 'ashwake', 'tier-1', 'phase-2'],
    },

    // ── STATION TROUBLE ──────────────────────────────────────────────────

    {
        id: 'station-trouble-stolen-kit',
        title: 'Station Trouble: Stolen Survey Kit',
        category: 'station',
        tier: 1,
        description:
            'Nera Quill\'s stall was hit. A high-value survey instrument — the kind the Guild pays ' +
            'good money for — was taken from her back storage room. ' +
            'Nera is not filing a formal report. She wants it back quietly. ' +
            '"Check who\'s been hanging around Bay 14," she says.',
        giver: 'nera-quill',
        sector: 'meridian-station',
        objectives: [
            'Investigate Nera Quill\'s stall in the Ash Market.',
            'Follow the lead to Bay 14.',
            'Recover the stolen survey kit.',
            'Return the kit to Nera Quill.',
        ],
        reward: {
            credits: 300,
            xp: 130,
            reputationGain: {
                'meridian-dock-authority': 6,
            },
            itemRewards: ['nav-chart-outer-belt'],
        },
        tags: ['station', 'social', 'meridian', 'tier-1', 'phase-2', 'jasso-adjacent'],
    },

    {
        id: 'station-trouble-debt-collection',
        title: 'Station Trouble: Halvek\'s Outstanding Account',
        category: 'station',
        tier: 1,
        description:
            'A contractor named Davesh owes the Guild three months of rig fees and has gone to ground ' +
            'somewhere on Meridian Station. The Guild is not asking for violence — just a conversation, ' +
            'and proof that the conversation happened. Halvek will know what that means.',
        giver: 'guild-rep-halvek',
        sector: 'meridian-station',
        objectives: [
            'Locate Davesh on Meridian Station.',
            'Negotiate repayment or obtain written acknowledgment of the debt.',
            'Report back to Halvek Dross.',
        ],
        reward: {
            credits: 200,
            xp: 90,
            reputationGain: {
                'ashwake-extraction-guild': 8,
            },
        },
        tags: ['station', 'social', 'meridian', 'tier-1', 'phase-2'],
    },

    // ── SURVEY + SCAN ────────────────────────────────────────────────────

    {
        id: 'deep-survey-relay-static',
        title: 'Survey: Relay 7-9 Transmission Window',
        category: 'survey',
        tier: 2,
        description:
            'Brother Caldus of the Relay Chapel has identified a recurring six-hour window ' +
            'during which Relay 7-9 emits uncharacterized signals. He wants observational data from ' +
            'inside the belt — closer to the relay signal origin. ' +
            'He is offering an archive chip in exchange. "The data will mean more to you later," he says.',
        giver: 'brother-caldus',
        sector: 'ashwake-belt',
        objectives: [
            'Position your ship in Grid 9 during the identified transmission window.',
            'Record signal data using your ship\'s standard scanner.',
            'Return the data to Brother Caldus at the Relay Chapel.',
        ],
        reward: {
            credits: 350,
            xp: 200,
            reputationGain: {
                'meridian-dock-authority': 5,
            },
            itemRewards: ['relay-static-archive'],
        },
        tags: ['survey', 'mystery', 'relay', 'ashwake', 'tier-2', 'phase-2', 'void-adjacent'],
    },

    // ── BOUNTY ───────────────────────────────────────────────────────────

    {
        id: 'bounty-automated-sentinel-pack',
        title: 'Bounty: Outer Belt Sentinel Pack',
        category: 'bounty',
        tier: 2,
        description:
            'A pack of three rogue industrial sentinels has been destroying unlicensed salvage vessels ' +
            'in the outer Ashwake Belt. Two ships lost in the past two weeks — one with crew. ' +
            'The Guild and the Dock Authority have put up a joint bounty. ' +
            'Bring back their control modules as proof.',
        giver: 'dockmaster-renata',
        sector: 'ashwake-belt',
        objectives: [
            'Locate and destroy the Outer Belt Sentinel Pack.',
            'Recover at least 2 control modules from the wreckage.',
            'Return the modules to Dockmaster Renata Osei.',
        ],
        reward: {
            credits: 820,
            xp: 350,
            reputationGain: {
                'meridian-dock-authority': 18,
                'ashwake-extraction-guild': 8,
            },
        },
        tags: ['bounty', 'combat', 'ashwake', 'tier-2', 'phase-2'],
    },
];
