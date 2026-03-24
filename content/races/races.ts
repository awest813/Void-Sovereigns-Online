import { Race } from '../../shared/types/race';

export const races: Race[] = [
    {
        id: 'terran',
        name: 'Terran',
        description:
            'Baseline humans. Resilient, adaptable, and found everywhere from core worlds to the outermost belt stations. ' +
            'No extraordinary traits — just a stubborn will to survive.',
        statBonuses: { endurance: 1 },
        loreNote:
            'The majority population on Meridian Station. Most factions treat them as default citizens with no special bias.',
        tags: ['human', 'common', 'adaptable'],
    },
    {
        id: 'karathi',
        name: 'Karathi',
        description:
            'A lean, four-fingered humanoid species with excellent low-light vision and a natural affinity for mechanical systems. ' +
            'Originally from a high-gravity mining world. Common in belt communities.',
        statBonuses: { agility: 1, strength: 1 },
        loreNote:
            'Karathi make up a significant portion of Ashwake Belt workers. The Extraction Guild often has Karathi leadership.',
        tags: ['humanoid', 'belt-worker', 'mechanic'],
    },
    {
        id: 'selvari',
        name: 'Selvari',
        description:
            'A tall, pale-complexioned species known for sharp cognition and an unsettling calm under pressure. ' +
            'Selvari have a statistically higher rate of psionic sensitivity than other species — a fact they find uncomfortable.',
        statBonuses: { intellect: 2, psi: 1 },
        loreNote:
            'Selvari are often viewed with low-grade suspicion near Void Relay zones. They are over-represented in both high academia and cult membership statistics.',
        tags: ['humanoid', 'psi-adjacent', 'intellectual'],
    },
    {
        id: 'droven',
        name: 'Droven',
        description:
            'A compact, broad-shouldered species from cold-world origins. Exceptional endurance and heat resistance. ' +
            'Known as reliable crew members who do not complain about conditions others would not tolerate.',
        statBonuses: { endurance: 2, strength: 1 },
        loreNote:
            'Droven are common on long-haul cargo ships and in engine-room crew positions. Respected by the Free Transit Compact.',
        tags: ['humanoid', 'tough', 'crew', 'cold-world'],
    },
];
