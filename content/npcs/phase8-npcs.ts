import { NPC } from '../../shared/types/npc';

/**
 * Phase 8 NPCs — Index Chamber operators and arriving faction authority.
 */
export const phase8NPCs: NPC[] = [
    {
        id: 'corvus-renn',
        name: 'Corvus Renn',
        role: ['info-broker', 'quest-giver'],
        faction: 'free-transit-compact',
        location: 'farpoint-waystation',
        description:
            'Veteran Free Transit navigator who has spent a decade charting anomaly-adjacent routes in the deep frontier. ' +
            'Quiet, precise, and visibly unsurprised by things that unsettle everyone else. ' +
            'He was the first person at Farpoint to correctly triangulate the Index Chamber coordinates.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'The coordinates are consistent. I have checked them four times. The site is there.',
            },
            {
                id: 'on-index-chamber',
                text: 'In ten years of frontier routing, I have never seen a site announce itself. This one did.',
                condition: 'flag.ashveil-deep-cleared',
            },
            {
                id: 'on-what-it-means',
                text: 'What it means is not my department. Getting there and back alive — that I can help with.',
                condition: 'reputation.free-transit-compact >= 40',
            },
        ],
        services: ['contracts', 'info-broker'],
        tags: ['free-transit-compact', 'farpoint', 'phase-8', 'index-chamber', 'navigator'],
    },
    {
        id: 'director-vael',
        name: 'Director Senne Vael',
        role: ['faction-rep', 'quest-giver'],
        faction: 'interstellar-commonwealth-authority',
        location: 'farpoint-waystation',
        description:
            'ICA Frontier Division director who arrived at Farpoint with a full authority mandate the day the Index coordinates were received. ' +
            'Organized, measured, and convinced that ICA must establish jurisdictional precedent before any faction claims the site. ' +
            'She is not hostile to field operators — she is simply operating on a different timeline than they are.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'ICA has jurisdiction over newly accessed infrastructure. That applies here. I am here to make it official.',
            },
            {
                id: 'on-index-chamber',
                text: 'The transmission went to everyone simultaneously. That was not an accident. The Architect chose the timing.',
                condition: 'flag.ashveil-deep-cleared',
            },
            {
                id: 'on-ica-precedent',
                text: 'I am not interested in what it wants. I am interested in what access to it means for the next fifty years.',
                condition: 'reputation.interstellar-commonwealth-authority >= 45',
            },
        ],
        services: ['contracts', 'faction-rep'],
        tags: ['ica', 'farpoint', 'phase-8', 'index-chamber', 'authority'],
    },
    {
        id: 'null-voice-echo',
        name: 'Echo Terminal — Null Voice',
        role: ['info-broker'],
        faction: 'void-covenant',
        location: 'farpoint-waystation',
        description:
            'A translation interface assembled by the Void Covenant to relay structured output from the Null Architect transmission. ' +
            'It does not originate speech — it outputs the closest parseable equivalent of received index responses. ' +
            'Tovan Vex maintains it and cautions that the outputs are interpretations, not transcriptions.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'YOU HAVE BEEN INDEXED. APPROACH IS ACKNOWLEDGED. DETERRENCE IS NOT THE INTENT OF THIS CONTACT.',
            },
            {
                id: 'on-purpose',
                text: 'THE RECORD IS INCOMPLETE. WITNESS ACCOUNTS ARE REQUIRED TO CLOSE OPEN CYCLE ENTRIES.',
                condition: 'flag.ashveil-deep-cleared',
            },
            {
                id: 'on-previous-civilizations',
                text: 'PREVIOUS ENTRANTS: FORTY-ONE. RECORDS CLOSED: THIRTY-NINE. STATUS OF REMAINING TWO: PENDING.',
                condition: 'reputation.void-covenant >= 50',
            },
        ],
        services: ['info-broker'],
        tags: ['void-covenant', 'farpoint', 'phase-8', 'null-architect', 'index-chamber'],
    },
];
