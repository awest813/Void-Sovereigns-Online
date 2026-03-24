import { NPC } from '../../shared/types/npc';

/**
 * Phase 6 NPCs — Farpoint Waystation contacts.
 * Kael Mourne (expanded questline version), Tovan Vex (Void Covenant observer),
 * and Aryn Voss (Farpoint merchant and long-term resident).
 */
export const phase6NPCs: NPC[] = [
    {
        id: 'farpoint-kael-expanded',
        name: 'Kael Mourne',
        role: ['quest-giver', 'info-broker'],
        faction: 'free-transit-compact',
        location: 'farpoint-waystation',
        description:
            'Kael Mourne runs Farpoint Waystation — coordinates logistics, files the reports, ' +
            'and has been sitting on a six-year-old mystery that is clearly affecting his sleep. ' +
            'Dry and practical in conversation. Noticeably rattled by something he refuses to show. ' +
            'His distress ping has his name on it, his ship ID, and his authentication codes, ' +
            'and it was sent before he was at Farpoint.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Six years. The ping has my name on it, my ship ID, my authentication codes. ' +
                    'I was running cargo in the Ashwake Belt when it sent. It\'s not a forgery. I checked.',
            },
            {
                id: 'on-timestamp',
                text: 'The relay logged the timestamp as zero. Not corrupted, not missing — zero. ' +
                    'That means the signal arrived before the relay was calibrated. Before it existed.',
                condition: 'flag.relay-jump-completed',
            },
            {
                id: 'questline-stage-1',
                text: 'You\'re looking into it. Good. I need the raw archive, not the processed log. ' +
                    'The processed log says "anomaly." The raw archive might say where it came from.',
                condition: 'flag.kael-questline-stage-1',
            },
            {
                id: 'questline-stage-2',
                text: 'I have the coordinates. They don\'t map to anything in the current chart set. ' +
                    'They map to something older — a pre-relay navigation marker that was decommissioned ' +
                    'eighty years ago. Except it\'s still there.',
                condition: 'flag.kael-questline-stage-2',
            },
            {
                id: 'on-transit-node-zero',
                text: 'Transit Node Zero. That\'s what the pre-relay records call it. It was a waypoint. ' +
                    'A rest stop. Whatever was using it didn\'t need to rest — they were using it to track.',
                condition: 'flag.kael-questline-stage-2',
            },
        ],
        services: ['contracts', 'info-broker'],
        tags: ['quest-giver', 'info-broker', 'free-transit-compact', 'farpoint', 'mystery', 'kael-questline', 'phase-6'],
    },

    {
        id: 'tovan-vex',
        name: 'Tovan Vex',
        role: ['info-broker', 'faction-rep'],
        faction: 'void-covenant',
        location: 'farpoint-waystation',
        description:
            'A Void Covenant field observer stationed at Farpoint on Kestrel Vin\'s instructions. ' +
            'Calm and patient in a way that reads as someone who has been waiting a long time ' +
            'and expected to keep waiting. Does not explain what he is waiting for. ' +
            'Has been at Farpoint for three months and shows no signs of leaving.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Kestrel sent me here. She said Farpoint is where the next signal will become audible. ' +
                    'I\'ve been here three months. She was right about the timing.',
            },
            {
                id: 'on-covenant',
                text: 'The Covenant doesn\'t seek to stop what is coming. ' +
                    'We seek to understand it before it introduces itself on its own terms. ' +
                    'There is a difference.',
            },
            {
                id: 'on-signal',
                text: 'The waveform we track isn\'t a broadcast. It\'s a query. ' +
                    'Something is asking a question. Every relay node, every mining platform, ' +
                    'every inhabited structure we build — we add more data to the answer.',
                condition: 'flag.relay-jump-completed',
            },
            {
                id: 'on-covenant-theory',
                text: 'Kestrel believes the answer includes us. I believe the question predates us ' +
                    'by a considerable margin and we are incidental. ' +
                    'We are, as far as I can determine, the most recent iteration.',
                condition: 'reputation.void-covenant >= 30',
            },
        ],
        services: ['faction-rep', 'contracts'],
        tags: ['info-broker', 'faction-rep', 'void-covenant', 'farpoint', 'mystery', 'signal-watcher', 'phase-6'],
    },

    {
        id: 'aryn-voss',
        name: 'Aryn Voss',
        role: ['merchant'],
        faction: 'free-transit-compact',
        location: 'farpoint-waystation',
        description:
            'A merchant and parts dealer who has been stationed at Farpoint long enough to notice things ' +
            'that the transit logs don\'t explain. Practical and good-natured. ' +
            'Slightly paranoid — not enough to affect her business judgment, just enough to keep good records.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Farpoint\'s been busier in the last four months than the four years before that. ' +
                    'Everyone\'s passing through. Nobody says why.',
            },
            {
                id: 'on-stock',
                text: 'I keep decent stock out here. Harder to get resupply, but I charge accordingly. Fair warning.',
            },
            {
                id: 'on-trade',
                text: 'You want the good stuff, you talk to Crow. You want the legal stuff, that\'s me.',
            },
            {
                id: 'on-archive',
                text: 'Kael asked me to pass this along. Said you earned it. ' +
                    'Something from the old archive. Don\'t ask me what it means — ' +
                    'I read it once and stopped.',
                condition: 'flag.farpoint-archive-pulled',
            },
        ],
        services: ['trade', 'repair'],
        tags: ['merchant', 'free-transit-compact', 'farpoint', 'practical', 'phase-6'],
    },
];
