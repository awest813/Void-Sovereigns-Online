import { NPC } from '../../shared/types/npc';

/**
 * Phase 5 NPCs — Helion Synod field researcher and Vanta deep-frontier broker.
 * These contacts become available post-relay alongside the Redline content.
 */
export const phase5NPCs: NPC[] = [
    {
        id: 'aris-vel',
        name: 'Aris Vel',
        role: ['info-broker', 'faction-rep', 'quest-giver'],
        faction: 'helion-synod',
        location: 'meridian-station',
        description:
            'A Helion Synod field researcher based on Meridian — ostensibly for data collection, ' +
            'practically because the post-relay frontier is the most active anomaly site in the known network. ' +
            'Aris Vel is methodical, honest about what she doesn\'t know, and deeply unsettled by what she does. ' +
            'Her research team is dead. She is still filing their reports.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'You found me. Good. I\'ve been here six months and you\'re the third person to look me in the eye ' +
                    'instead of backing away when I mentioned the Synod. ' +
                    'That either means you\'re brave or you haven\'t heard enough about us yet.',
            },
            {
                id: 'about-synod',
                text: 'The Helion Synod is a research organization. We study void relay phenomena and anomaly sites. ' +
                    'We take the position that understanding something is preferable to being surprised by it. ' +
                    'Some of our members take that position further than others. I am somewhere in the middle.',
            },
            {
                id: 'about-ashveil',
                text: 'My people built the Ashveil Observation Post. I approved the mission parameters. ' +
                    'Eleven months ago the crew stopped sending reports. ' +
                    'The post did not stop sending reports. ' +
                    'I\'ve been reading every one of them. Formatted identically to what my crew would have written. ' +
                    'Using their names. I need someone to go in there. Not because I think it will be safe.',
                condition: 'reputation.helion-synod >= 20',
            },
            {
                id: 'about-void-pattern',
                text: 'The waveform — the one that appears at Coldframe, at Void Relay 7-9, at Kalindra, at Ashveil — ' +
                    'we\'ve been tracking it for four years. Before any of the sites became notable. ' +
                    'We built Ashveil to monitor it. ' +
                    'The pattern is consistent, structured, and repeating on a schedule that implies intent. ' +
                    'The Synod is divided on what that means. I am not.',
                condition: 'reputation.helion-synod >= 55',
            },
            {
                id: 'about-factions',
                text: 'Aegis Division has more data than they share. The Void Covenant has theories that are more useful ' +
                    'than anyone respectable wants to admit. The Frontier Compact wants practical solutions ' +
                    'and will not wait for the full picture. ' +
                    'I try to work with all of them. It goes better some days than others.',
            },
            {
                id: 'redline-warning',
                text: 'The void resonance emitters at Ashveil are not passive. They affect cognition at extended exposure. ' +
                    'You will feel it as fatigue, then as certainty about things you should not be certain about. ' +
                    'Take the anomaly field kit. Move quickly. Don\'t stop to read the reports on the screens. ' +
                    'I\'ll read them when you bring them back.',
                condition: 'reputation.helion-synod >= 55',
            },
            {
                id: 'on-mystery',
                text: 'I\'ll tell you what I\'ve concluded and you can decide what to do with it. ' +
                    'The void relay network didn\'t fail. It was interrupted. ' +
                    'What interrupted it is still active, still broadcasting, and has been for at least two hundred years. ' +
                    'We built the relay network into something that was already there. ' +
                    'I don\'t think it noticed us until recently.',
                condition: 'reputation.helion-synod >= 110',
            },
        ],
        services: ['contracts', 'faction-rep', 'info-broker'],
        tags: ['faction-rep', 'helion-synod', 'info-broker', 'quest-giver', 'meridian', 'anomaly', 'phase-5'],
    },

    {
        id: 'the-broker',
        name: 'The Broker',
        role: ['merchant', 'info-broker'],
        faction: 'vanta-corsairs',
        location: 'meridian-station',
        description:
            'A deep-frontier contact vouched by Crow Veslin — no name given, no identification filed. ' +
            'Operates entirely through intermediaries and encrypted drops. ' +
            'Has a buyer for the Vault\'s coordination node transmission log ' +
            'and the patience to wait for an operator capable of retrieving it. ' +
            'The Broker has been waiting a long time.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Crow vouched for you. That\'s all I needed to know. ' +
                    'I\'m not going to tell you my name. The contract comes through Crow. ' +
                    'What I pay for is discretion, reliability, and the ability to walk out of a facility ' +
                    'that does not want you to walk out of it.',
            },
            {
                id: 'on-vault',
                text: 'The Vault has been broadcasting to something for forty months. ' +
                    'I need to know what it was receiving from. ' +
                    'The coordination node has a full log of every incoming message. ' +
                    'I don\'t need you to understand what\'s in it. I just need you to bring it back intact.',
                condition: 'reputation.vanta-corsairs >= 50',
            },
            {
                id: 'on-redline',
                text: 'I don\'t send people into places I expect them to die. ' +
                    'I send them into places where dying is a real possibility. ' +
                    'That\'s not the same thing. Know the difference before you accept the contract.',
            },
            {
                id: 'on-anomaly',
                text: 'I\'ve seen four facilities like the Vault in the last eight years. ' +
                    'Three of them were sending the same pattern. Two of those three had units inside ' +
                    'that shouldn\'t have been able to do what they were doing. ' +
                    'I don\'t have a theory about that. I have a buyer who does.',
                condition: 'reputation.vanta-corsairs >= 100',
            },
        ],
        services: ['trade', 'contracts'],
        tags: ['gray-market', 'vanta', 'merchant', 'info-broker', 'meridian', 'mystery', 'phase-5'],
    },
];
