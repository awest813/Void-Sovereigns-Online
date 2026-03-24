import { Contract } from '../../shared/types/contract';

/**
 * Starter contracts available at Meridian Station.
 * Three categories: salvage, bounty, delivery.
 * Phase 1 adds Shalehook Dig Site contracts linked to the playable dungeon.
 */
export const starterContracts: Contract[] = [

    // ── PHASE 1 — SHALEHOOK DIG SITE ──────────────────────────────────────

    {
        id: 'scrap-recovery-shalehook',
        title: 'Scrap Recovery: Shalehook Dig Site',
        category: 'salvage',
        tier: 1,
        description:
            'The Shalehook prospecting site on asteroid 44-Kheras has been offline for over a decade. ' +
            'The Guild wants salvageable equipment recovered before the site is written off entirely. ' +
            'A survey kit left behind by the last survey team is the priority. Scrap and power cells are a bonus.',
        giver: 'tamsin-vale',
        sector: 'ashwake-belt',
        objectives: [
            'Enter Shalehook Dig Site on asteroid 44-Kheras.',
            'Recover the survey kit from the equipment depot.',
            'Collect any salvageable components.',
            'Return to Meridian Station and report to Tamsin Vale.',
        ],
        reward: {
            credits: 280,
            xp: 140,
            reputationGain: {
                'meridian-dock-authority': 5,
                'ashwake-extraction-guild': 5,
            },
        },
        tags: ['salvage', 'ashwake', 'shalehook', 'tier-1', 'phase-1'],
    },

    {
        id: 'robot-suppression-shalehook',
        title: 'Robot Suppression: Shalehook Dig Site',
        category: 'bounty',
        tier: 1,
        description:
            'Automated units at Shalehook Dig Site have been flagged hostile — two Guild survey crews have been driven off ' +
            'in the past month. The Guild is authorizing suppression. ' +
            'The Excavator Prime unit at the dig core is the primary target. Bring back its control module as proof.',
        giver: 'tamsin-vale',
        sector: 'ashwake-belt',
        objectives: [
            'Enter Shalehook Dig Site on asteroid 44-Kheras.',
            'Clear rogue automated units throughout the site.',
            'Destroy Excavator Prime and recover its control module.',
            'Return the control module to Tamsin Vale at Meridian Station.',
        ],
        reward: {
            credits: 450,
            xp: 200,
            reputationGain: {
                'meridian-dock-authority': 8,
                'ashwake-extraction-guild': 10,
            },
            itemRewards: ['control-module'],
        },
        tags: ['bounty', 'combat', 'ashwake', 'shalehook', 'tier-1', 'phase-1'],
    },

    {
        id: 'equipment-retrieval-shalehook',
        title: 'Equipment Retrieval: Survey Kit Alpha',
        category: 'salvage',
        tier: 1,
        description:
            'Survey Kit Alpha went dark with the rest of Shalehook. ' +
            'The Guild\'s data recovery team says the unit\'s core is probably still intact. ' +
            'Nera Quill is willing to pay separately for any functioning components you bring back. ' +
            'Quick job if the site is clear.',
        giver: 'nera-quill',
        sector: 'ashwake-belt',
        objectives: [
            'Locate Survey Kit Alpha in the Shalehook Dig Site equipment depot.',
            'Return the survey kit to Nera Quill at Meridian Station.',
        ],
        reward: {
            credits: 200,
            xp: 100,
            reputationGain: {
                'ashwake-extraction-guild': 5,
            },
        },
        tags: ['salvage', 'retrieval', 'ashwake', 'shalehook', 'tier-1', 'phase-1'],
    },


    // ── SALVAGE ──────────────────────────────────────────────────────────────
    {
        id: 'salvage-rig-alpha-7',
        title: 'Salvage: Extraction Rig Alpha-7',
        category: 'salvage',
        tier: 1,
        description:
            'Extraction Rig Alpha-7 in the Ashwake Belt went silent three weeks ago. ' +
            'Dock Authority wants salvageable parts recovered before claim-jumpers strip it clean. ' +
            'Watch out — the automated systems may still be active.',
        giver: 'dockmaster-renata',
        sector: 'ashwake-belt',
        objectives: [
            'Reach Extraction Rig Alpha-7 in the Ashwake Belt.',
            'Recover at least 3 salvage crates from the rig.',
            'Return to Meridian Station docking bay.',
        ],
        reward: {
            credits: 320,
            xp: 150,
            reputationGain: {
                'meridian-dock-authority': 5,
            },
        },
        tags: ['salvage', 'ashwake', 'tier-1', 'automation-hazard'],
    },
    {
        id: 'salvage-cold-frame-components',
        title: 'Salvage: Cold Frame Station Components',
        category: 'salvage',
        tier: 1,
        description:
            'Independent salvager Torrek Voss has a lead on intact cryo-components in a derelict Cold Frame habitat. ' +
            'He cannot make the run himself. He will split the proceeds fifty-fifty.',
        giver: 'torrek-voss',
        sector: 'ashwake-belt',
        objectives: [
            'Enter Coldframe Station-B.',
            'Locate and extract the cryo-component crate.',
            'Return to Torrek Voss on Meridian Station.',
        ],
        reward: {
            credits: 280,
            xp: 120,
            reputationGain: {
                'ashwake-extraction-guild': 5,
            },
            itemRewards: ['cryo-component-x2'],
        },
        tags: ['salvage', 'ashwake', 'tier-1', 'npc-giver'],
    },

    // ── BOUNTY ───────────────────────────────────────────────────────────────
    {
        id: 'bounty-rogue-drone-mk3',
        title: 'Bounty: Rogue Mining Drone MK-3',
        category: 'bounty',
        tier: 1,
        description:
            'A MK-3 autonomous mining drone in Ashwake has gone rogue and destroyed two Guild vessels in the past week. ' +
            'The Extraction Guild is offering a bounty for confirmed destruction. ' +
            'Bring back the control module as proof.',
        giver: 'guild-rep-halvek',
        sector: 'ashwake-belt',
        objectives: [
            'Locate and destroy the Rogue Mining Drone MK-3.',
            'Recover the control module from the wreckage.',
            'Return the module to the Guild rep on Meridian Station.',
        ],
        reward: {
            credits: 500,
            xp: 200,
            reputationGain: {
                'ashwake-extraction-guild': 10,
            },
            itemRewards: ['drone-scrap-parts'],
        },
        tags: ['bounty', 'combat', 'ashwake', 'tier-1', 'drone'],
    },
    {
        id: 'bounty-claim-jumper-yevash',
        title: 'Bounty: Claim Jumper Yevash',
        category: 'bounty',
        tier: 2,
        description:
            'Yevash has been raiding legitimate salvage claims in the outer Ashwake Belt for months. ' +
            'Dock Authority has lost patience. The warrant is: alive preferred, dead accepted.',
        giver: 'dockmaster-renata',
        sector: 'ashwake-belt',
        objectives: [
            'Locate Yevash\'s vessel in the Ashwake Belt.',
            'Disable or destroy the ship.',
            'Return to Meridian Station to collect payment.',
        ],
        reward: {
            credits: 750,
            xp: 300,
            reputationGain: {
                'meridian-dock-authority': 15,
                'ashwake-extraction-guild': 5,
            },
        },
        tags: ['bounty', 'combat', 'ashwake', 'tier-2', 'ship-combat'],
    },

    // ── DELIVERY ─────────────────────────────────────────────────────────────
    {
        id: 'delivery-fuel-cells-ashwake',
        title: 'Delivery: Fuel Cells to Rig Bravo-3',
        category: 'delivery',
        tier: 1,
        description:
            'Rig Bravo-3 is running low on backup fuel cells and the crew cannot make the run themselves. ' +
            'Simple delivery. No hostiles reported on that route — recently.',
        giver: 'guild-rep-halvek',
        sector: 'ashwake-belt',
        objectives: [
            'Pick up the fuel cell crate from Meridian Station cargo bay 7.',
            'Deliver the crate to Rig Bravo-3 in the Ashwake Belt.',
            'Return delivery confirmation to the Guild rep.',
        ],
        reward: {
            credits: 180,
            xp: 80,
            reputationGain: {
                'ashwake-extraction-guild': 5,
                'free-transit-compact': 3,
            },
        },
        tags: ['delivery', 'low-risk', 'ashwake', 'tier-1'],
    },
    {
        id: 'survey-extraction-grid-9',
        title: 'Survey: Extraction Grid 9 Anomaly',
        category: 'survey',
        tier: 2,
        description:
            'Guild survey equipment in Grid 9 has been returning corrupted data for two months. ' +
            'They want eyes on the site. Find out what is interfering with the equipment and report back. ' +
            'Do not touch anything unusual.',
        giver: 'guild-rep-halvek',
        sector: 'ashwake-belt',
        objectives: [
            'Travel to Extraction Grid 9 in the Ashwake Belt.',
            'Inspect the survey equipment.',
            'Document and photograph the anomaly.',
            'Return the report to the Guild.',
        ],
        reward: {
            credits: 400,
            xp: 250,
            reputationGain: {
                'ashwake-extraction-guild': 10,
            },
        },
        tags: ['survey', 'mystery', 'ashwake', 'tier-2', 'void-adjacent'],
    },
];
