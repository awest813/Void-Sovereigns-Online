import { NPC } from '../../shared/types/npc';

/**
 * Phase 7 NPCs — Deep frontier operators and specialists.
 */
export const phase7NPCs: NPC[] = [
    {
        id: 'ica-specialist-lyra',
        name: 'Lyra Kesh',
        role: ['faction-rep', 'quest-giver'],
        faction: 'interstellar-commonwealth-authority',
        location: 'farpoint-waystation',
        description:
            'ICA hazard specialist assigned to Farpoint to formalize quarantine corridors in the Ashveil Deep approach zone. ' +
            'Professional, direct, and visibly exhausted by the amount of undocumented infrastructure she keeps finding.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'ICA sent me to build a quarantine map. The map keeps changing. That is not normal.',
            },
            {
                id: 'on-deepfrontier',
                text: 'Ashveil Deep is not "newly discovered." It is newly acknowledged. That distinction matters.',
                condition: 'flag.transit-node-zero-cleared',
            },
            {
                id: 'on-ica-protocol',
                text: 'If you cross the quarantine markers, file a report. If you survive, file two.',
                condition: 'reputation.interstellar-commonwealth-authority >= 35',
            },
        ],
        services: ['contracts', 'faction-rep'],
        tags: ['ica', 'farpoint', 'phase-7', 'deep-frontier', 'quarantine'],
    },
    {
        id: 'synod-adept-marek',
        name: 'Marek Thane',
        role: ['info-broker', 'quest-giver'],
        faction: 'helion-synod',
        location: 'farpoint-waystation',
        description:
            'Helion Synod field adept focused on psi-adjacent resonance effects around Ashveil Deep. ' +
            'Measured tone, precise language, and an obvious preference for data over doctrine.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'The Deep is expensive to study and more expensive to misunderstand.',
            },
            {
                id: 'on-psi',
                text: 'Call it psi if you need a short word. We call it cognitive coupling drift.',
            },
            {
                id: 'on-risk',
                text: 'If the room gets quiet, leave. If it gets quieter, run.',
                condition: 'reputation.helion-synod >= 40',
            },
        ],
        services: ['contracts', 'info-broker'],
        tags: ['helion-synod', 'farpoint', 'phase-7', 'psi', 'deep-frontier'],
    },
    {
        id: 'free-transit-shipwright-iora',
        name: 'Iora Venn',
        role: ['shipwright', 'merchant'],
        faction: 'free-transit-compact',
        location: 'farpoint-waystation',
        description:
            'Independent shipwright contracted through the Free Transit Compact to prep deep-frontier hulls. ' +
            'She tracks every structural failure report and treats each one as design feedback.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Tier III hulls are not luxury ships. They are survival math.',
            },
            {
                id: 'on-tier-iii',
                text: 'If your frame can\'t hold a breach cycle, the Deep decides your shift is over.',
            },
            {
                id: 'on-farpoint',
                text: 'Farpoint used to service traffic. Now it services people who came back wrong and stubborn.',
                condition: 'flag.relay-jump-completed',
            },
        ],
        services: ['trade', 'repair'],
        tags: ['free-transit-compact', 'farpoint', 'phase-7', 'shipwright', 'tier-iii'],
    },
];
