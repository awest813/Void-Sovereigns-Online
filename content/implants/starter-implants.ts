import { Implant } from '../../shared/types/implant';

export const starterImplants: Implant[] = [
    {
        id: 'reflex-booster-i',
        name: 'Reflex Booster I',
        slot: 'neural',
        description: 'A basic neural accelerant implant. Sharpens reaction time and target acquisition. Standard military-surplus hardware.',
        effects: [
            { stat: 'agility', value: 2 },
        ],
        psiRating: 0,
        rarity: 'common',
        tags: ['combat', 'agility', 'military-surplus'],
    },
    {
        id: 'bone-lace-i',
        name: 'Skeletal Reinforcement I',
        slot: 'skeletal',
        description: 'Carbon-composite skeletal weaving. Increases impact resistance and carrying capacity. Uncomfortable for the first month.',
        effects: [
            { stat: 'strength', value: 2 },
            { stat: 'endurance', value: 1 },
        ],
        psiRating: 0,
        rarity: 'common',
        tags: ['utility', 'strength', 'labor'],
    },
    {
        id: 'low-light-ocular',
        name: 'Low-Light Ocular Implant',
        slot: 'ocular',
        description: 'Augments vision in near-darkness. Essential for belt work. Does nothing for the headaches.',
        effects: [
            { stat: 'perception', value: 2 },
        ],
        psiRating: 0,
        rarity: 'common',
        tags: ['utility', 'perception', 'belt-work'],
    },
    {
        id: 'resonance-filament',
        name: 'Resonance Filament',
        slot: 'neural',
        description:
            'A non-standard implant of unclear origin. It amplifies psionic sensitivity and, according to users, allows perception of resonance fields near Relay infrastructure. ' +
            'Not officially licensed. The Dock Authority would like to know where you got it.',
        effects: [
            { stat: 'psi', value: 4 },
            { stat: 'intellect', value: 1 },
        ],
        psiRating: 7,
        rarity: 'rare',
        tags: ['psi', 'void-adjacent', 'suspicious', 'rare'],
    },
];
