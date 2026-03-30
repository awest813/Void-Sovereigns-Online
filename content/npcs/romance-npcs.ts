import { NPC } from '../../shared/types/npc';

/**
 * Romanceable mission-operator NPCs.
 * Each has romanceable: true and affection-gated dialogue conditions
 * in the form `affection.<npc-id> >= <value>`.
 *
 * Affection is tracked per-NPC in GameState (0–100).
 * Relationship tiers: Stranger (0), Acquaintance (25), Friend (50), Close (75), Partner (100).
 */
export const romanceNPCs: NPC[] = [
    // ── Mira Sael — Independent mission coordinator (Meridian) ─────────────
    {
        id: 'mira-sael',
        name: 'Mira Sael',
        role: ['quest-giver', 'info-broker'],
        location: 'meridian-station',
        description:
            'Independent mission coordinator based on Meridian. ' +
            'She parses sector contract feeds and routes salvage and recovery work to operators she trusts. ' +
            'Direct, warm, and quietly observant — she developed a dry sense of humor running shipments ' +
            'through contested corridors before she decided she preferred the desk side of the operation. ' +
            'She takes contracts others won\'t touch and finds the same quality in people attractive.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'You look like you can handle a salvage run in bad weather. Or at least like you won\'t complain about it.',
            },
            {
                id: 'on-services',
                text: 'I route work for operators I trust. The contract board is one thing — I keep the better jobs off it. Prove you\'re worth it and we\'ll talk.',
            },
            {
                id: 'on-acquaintance',
                text: 'There\'s a reason I check the arrival logs. Most operators come in looking for quick credits. You actually come back. That\'s rarer than it should be.',
                condition: 'affection.mira-sael >= 25',
            },
            {
                id: 'on-friend',
                text: 'I\'ve been doing this long enough to know when someone\'s worth knowing. You\'re starting to make that list.',
                condition: 'affection.mira-sael >= 50',
            },
            {
                id: 'on-close',
                text: 'The salvage work started as a cover for something else. I\'ll tell you about it sometime. Maybe over drinks, if Meridian ever has anything worth drinking.',
                condition: 'affection.mira-sael >= 75',
            },
            {
                id: 'on-partner',
                text: 'I used to run these contracts alone. I\'m starting to think I like this arrangement better. Don\'t tell anyone — it\'ll ruin my reputation for being difficult.',
                condition: 'affection.mira-sael >= 100',
            },
        ],
        services: ['contracts', 'info-broker'],
        romanceable: true,
        tags: ['quest-giver', 'info-broker', 'meridian', 'romance', 'independent'],
    },

    // ── Tavos Rynn — Aegis Division field coordinator (Meridian) ───────────
    {
        id: 'tavos-rynn',
        name: 'Tavos Rynn',
        role: ['quest-giver', 'faction-rep'],
        faction: 'aegis-division',
        location: 'meridian-station',
        description:
            'Aegis Division field coordinator assigned to Meridian Station to monitor border security incidents ' +
            'and distribute contract work that requires independent-operator deniability. ' +
            'Methodical and contained, with dry humor that surfaces when he thinks you\'ve earned it. ' +
            'He reads people with uncomfortable accuracy and keeps most of what he concludes to himself. ' +
            'Getting past the professional distance is a long process. Apparently worth it.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Aegis contracts require vetting. You\'ve passed the preliminary. Don\'t make me regret the classification.',
            },
            {
                id: 'on-aegis-work',
                text: 'The division prefers operators who ask questions before taking fire, not after. You seem capable of that. Most aren\'t.',
                condition: 'reputation.aegis-division >= 10',
            },
            {
                id: 'on-acquaintance',
                text: 'You handle unusual briefings without flinching. That\'s either training or temperament. Either way, it\'s useful in this work.',
                condition: 'affection.tavos-rynn >= 25',
            },
            {
                id: 'on-friend',
                text: 'I\'ve been watching operator patterns for three years. You\'re an outlier. I haven\'t decided if that\'s a compliment yet. Probably.',
                condition: 'affection.tavos-rynn >= 50',
            },
            {
                id: 'on-close',
                text: 'The file on you says "unpredictable under pressure." The analyst who wrote that has never worked under pressure. I have. The word I\'d use is different.',
                condition: 'affection.tavos-rynn >= 75',
            },
            {
                id: 'on-partner',
                text: 'There is a briefing I\'ve been holding back. Not because you weren\'t cleared — because I wasn\'t ready to trust it to anyone. You qualify. ' +
                    'That\'s not something I say to contractors.',
                condition: 'affection.tavos-rynn >= 100',
            },
        ],
        services: ['contracts', 'faction-rep'],
        romanceable: true,
        tags: ['quest-giver', 'faction-rep', 'aegis-division', 'meridian', 'romance'],
    },

    // ── Rysa Ofen — Frontier Compact route specialist (Farpoint) ───────────
    {
        id: 'rysa-ofen',
        name: 'Rysa Ofen',
        role: ['quest-giver', 'faction-rep'],
        faction: 'frontier-compact',
        location: 'farpoint-waystation',
        description:
            'Frontier Compact route specialist and mission coordinator at Farpoint Waystation, ' +
            'running contract logistics for deep-frontier salvage and survey operations. ' +
            'She grew up on relay transports and has an infectious confidence in corridors ' +
            'most operators avoid. She is very good at pretending nothing worries her ' +
            'and very bad at hiding when something actually does.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Farpoint contracts don\'t come with handholding. But they pay better than anything you\'ll find back at Meridian.',
            },
            {
                id: 'on-frontier-work',
                text: 'Most of the Compact\'s real work happens out here, not at the relay hubs. If you want the interesting jobs, you\'re in the right place.',
                condition: 'reputation.frontier-compact >= 10',
            },
            {
                id: 'on-acquaintance',
                text: 'Most operators who reach Farpoint are running from something. You seem like you\'re running toward it. That\'s the distinction I look for.',
                condition: 'affection.rysa-ofen >= 25',
            },
            {
                id: 'on-friend',
                text: 'I\'ve routed contracts to a hundred operators. Most of them I couldn\'t pick out of a corridor lineup. You\'re in the shorter list.',
                condition: 'affection.rysa-ofen >= 50',
            },
            {
                id: 'on-close',
                text: 'The Compact assigned me to Farpoint because I volunteered for it. Everyone thought that was strange. You probably understand why I did it.',
                condition: 'affection.rysa-ofen >= 75',
            },
            {
                id: 'on-partner',
                text: 'I keep routing the best contracts to you. Professionally questionable. ' +
                    'Personally — I\'m not even slightly sorry about it.',
                condition: 'affection.rysa-ofen >= 100',
            },
        ],
        services: ['contracts', 'faction-rep'],
        romanceable: true,
        tags: ['quest-giver', 'faction-rep', 'frontier-compact', 'farpoint', 'romance'],
    },
];
