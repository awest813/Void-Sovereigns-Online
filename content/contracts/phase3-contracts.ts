import { Contract } from '../../shared/types/contract';

/**
 * Phase 3 contracts — the relay push and the world beyond.
 * Pre-relay: approach survey, ICA assessment, Covenant data run.
 * Post-relay: Farpoint first contact, freight salvage, anomaly trace, ghost telemetry.
 */
export const phase3Contracts: Contract[] = [

    // ── PRE-RELAY (require relay-capable ship) ────────────────────────────

    {
        id: 'relay-approach-survey',
        title: 'Survey: Void Relay 7-9 Exterior Approach',
        category: 'survey',
        tier: 2,
        description:
            'Brother Caldus of the Relay Chapel needs close-range observational data from Void Relay 7-9. ' +
            'Standard remote scans have been returning corrupted results for months. ' +
            'A relay-capable vessel can approach the structure directly and record signal telemetry from the docking collar. ' +
            '"The readings we have so far do not match any prior operational cycle," he says. "I need to know why."',
        giver: 'brother-caldus',
        sector: 'void-relay-7-9',
        objectives: [
            'Approach Void Relay 7-9 with a relay-capable ship.',
            'Conduct close-range exterior scan of the relay structure.',
            'Record telemetry data during approach.',
            'Return the data to Brother Caldus at the Relay Chapel.',
        ],
        reward: {
            credits: 450,
            xp: 220,
            reputationGain: {
                'meridian-dock-authority': 8,
            },
            itemRewards: ['relay-static-archive'],
        },
        tags: ['survey', 'relay', 'tier-2', 'phase-3', 'pre-relay', 'void-adjacent'],
    },

    {
        id: 'ica-relay-assessment',
        title: 'ICA Field Assessment: Relay 7-9 Status Report',
        category: 'investigation',
        tier: 2,
        description:
            'ICA Agent Vorren has been stationed at Meridian for three weeks with one task: ' +
            'file an accurate status report on Void Relay 7-9. ' +
            'Every previous report has been based on long-range data. The Commonwealth wants ground truth. ' +
            '"You have a relay-capable ship. I have authority and a fee schedule. This benefits both of us."',
        giver: 'ica-agent-vorren',
        sector: 'void-relay-7-9',
        objectives: [
            'Board or dock at Void Relay 7-9.',
            'Assess structural integrity and operational systems.',
            'Recover any accessible station logs or operational records.',
            'Report findings to ICA Agent Vorren at Meridian Station.',
        ],
        reward: {
            credits: 620,
            xp: 290,
            reputationGain: {
                'interstellar-commonwealth-authority': 14,
                'meridian-dock-authority': 5,
            },
        },
        tags: ['investigation', 'relay', 'ica', 'tier-2', 'phase-3', 'pre-relay'],
    },

    {
        id: 'covenant-relay-data',
        title: 'Covenant Request: Relay Interior Signal Capture',
        category: 'investigation',
        tier: 2,
        description:
            'Void Covenant operative Kestrel Vin has been on Meridian for months, waiting for someone ' +
            'with a relay-capable ship and the judgment to use it. That is you now. ' +
            '"We do not need the whole relay," she says. "Just the signal archive from the core transit node. ' +
            'If the relay is behaving the way we believe it is, what you find inside will not match any record on file." ' +
            'She offers no official documentation. She does offer a substantial fee.',
        giver: 'void-covenant-kestrel',
        sector: 'void-relay-7-9',
        objectives: [
            'Enter Void Relay 7-9.',
            'Access the archive node in the relay interior.',
            'Recover the signal data from the transit core.',
            'Return the data to Kestrel Vin on Meridian Station.',
        ],
        reward: {
            credits: 540,
            xp: 260,
            reputationGain: {
                'void-covenant': 18,
            },
            itemRewards: ['anomaly-trace-log'],
        },
        tags: ['investigation', 'relay', 'covenant', 'tier-2', 'phase-3', 'pre-relay', 'void-adjacent'],
    },

    // ── POST-RELAY (require relay jump completed) ─────────────────────────

    {
        id: 'farpoint-first-contact',
        title: 'Courier: ICA Transit Papers to Farpoint Waystation',
        category: 'delivery',
        tier: 3,
        description:
            'With Relay 7-9 now accessible, the ICA wants to reopen the Farpoint Waystation route. ' +
            'First step: deliver a sealed transit packet to the station\'s administrative contact. ' +
            '"The waystation has been running independently for two years," Vorren says. "They may not be enthusiastic. ' +
            'Be professional. You represent Commonwealth interest whether you want to or not." ' +
            'The Free Transit Compact has offered a co-fee for confirming the route is safe.',
        giver: 'ica-agent-vorren',
        sector: 'farpoint-waystation',
        objectives: [
            'Transit Void Relay 7-9 to reach Farpoint Waystation.',
            'Locate the station administrative office.',
            'Deliver the sealed ICA transit packet.',
            'Return route confirmation to Vorren and the Free Transit Compact rep on Meridian.',
        ],
        reward: {
            credits: 820,
            xp: 390,
            reputationGain: {
                'interstellar-commonwealth-authority': 16,
                'free-transit-compact': 12,
            },
        },
        tags: ['delivery', 'farpoint', 'ica', 'tier-3', 'phase-3', 'post-relay'],
    },

    {
        id: 'farpoint-salvage-extraction',
        title: 'Salvage: Farpoint Waystation Outer Ring',
        category: 'salvage',
        tier: 3,
        description:
            'Halvek Dross of the Extraction Guild is already calculating the haul potential of a newly opened transit route. ' +
            '"Farpoint was a major freight node before the relays went dark. Two years of untouched cargo. ' +
            'The outer ring sections are unoccupied — no clearance required." ' +
            'He is wrong about the clearance. He may also be wrong about the unoccupied part. ' +
            'But the manifest he is waving suggests the cargo value is real.',
        giver: 'guild-rep-halvek',
        sector: 'farpoint-waystation',
        objectives: [
            'Transit to Farpoint Waystation via Void Relay 7-9.',
            'Enter the outer ring freight sections.',
            'Recover abandoned cargo and salvage.',
            'Return salvage to Halvek Dross at Meridian Station.',
        ],
        reward: {
            credits: 980,
            xp: 430,
            reputationGain: {
                'ashwake-extraction-guild': 18,
                'meridian-dock-authority': 6,
            },
        },
        tags: ['salvage', 'farpoint', 'guild', 'tier-3', 'phase-3', 'post-relay'],
    },

    {
        id: 'anomaly-trace-farpoint',
        title: 'Investigation: Anomaly Signals — Farpoint Grid 4',
        category: 'investigation',
        tier: 3,
        description:
            'Tamsin Vale has flagged an anomaly report that came in through the relay channel — the first relay-sourced ' +
            'communication Meridian has received in over a year. ' +
            'The report is a partial automated distress ping from Farpoint Grid 4, time-stamped eighteen months ago. ' +
            '"That timestamp is wrong," she says. "We were not receiving relay traffic eighteen months ago. ' +
            'Either the relay\'s internal clock is corrupted, or something was in there sending signals we were not picking up." ' +
            'Investigate and return whatever records you can find.',
        giver: 'tamsin-vale',
        sector: 'farpoint-waystation',
        objectives: [
            'Transit to Farpoint Waystation.',
            'Locate the source of the anomalous Grid 4 distress ping.',
            'Recover any accessible records or signal source hardware.',
            'Return findings to Tamsin Vale at Meridian Station.',
        ],
        reward: {
            credits: 1120,
            xp: 500,
            reputationGain: {
                'meridian-dock-authority': 18,
                'void-covenant': 10,
            },
            itemRewards: ['void-pattern-record'],
        },
        tags: ['investigation', 'mystery', 'farpoint', 'tier-3', 'phase-3', 'post-relay', 'void-adjacent'],
    },

    {
        id: 'relay-ghost-telemetry',
        title: 'Survey: Relay Ghost Signal — Route 7-9 Corridor',
        category: 'survey',
        tier: 2,
        description:
            'Brother Caldus has identified a second anomaly — not from the relay structure itself, ' +
            'but from the transit corridor between Meridian and Relay 7-9. ' +
            'During your relay approach runs, his instruments recorded a secondary signal ' +
            'that does not correspond to any known vessel, beacon, or automated system. ' +
            '"It has a pattern," he says. "It repeats. That is what worries me. ' +
            'Random noise does not repeat. Whatever this is, it is not random."',
        giver: 'brother-caldus',
        sector: 'void-relay-7-9',
        objectives: [
            'Re-enter the transit corridor toward Relay 7-9.',
            'Log the secondary signal origin using enhanced scan mode.',
            'Recover any physical signal source if accessible.',
            'Return data to Brother Caldus at the Relay Chapel.',
        ],
        reward: {
            credits: 720,
            xp: 340,
            reputationGain: {
                'meridian-dock-authority': 10,
                'void-covenant': 8,
            },
        },
        tags: ['survey', 'mystery', 'relay', 'tier-2', 'phase-3', 'post-relay', 'void-adjacent'],
    },
];
