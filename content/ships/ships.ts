import { Ship } from '../../shared/types/ship';

export const ships: Ship[] = [
    {
        id: 'cutter-mk1',
        name: 'Cutter Mk. I',
        class: 'shuttle',
        description:
            'A battered single-crew utility shuttle. Cheap, heavily patched, and barely jump-capable. ' +
            'The Cutter Mk. I is the default ship for broke spacers on Meridian Station. ' +
            'It will get you to Ashwake Belt and back — probably.',
        stats: {
            hull: 80,
            shielding: 0,
            cargoCapacity: 4,
            fuelCapacity: 20,
            speed: 6,
            jumpRange: 1,
        },
        slots: {
            weapons: 1,
            modules: 1,
            implantBays: 0,
        },
        relayCapable: false,
        tags: ['starter', 'utility', 'single-crew', 'low-cost'],
    },
    {
        id: 'meridian-hauler-ii',
        name: 'Meridian Hauler II',
        class: 'hauler',
        description:
            'A mid-range cargo hauler common on frontier stations. Slow but sturdy. ' +
            'Enough range for relay-adjacent jumps if properly maintained. ' +
            'The realistic goal for a player breaking out of Meridian\'s local economy.',
        stats: {
            hull: 150,
            shielding: 20,
            cargoCapacity: 16,
            fuelCapacity: 60,
            speed: 4,
            jumpRange: 3,
        },
        slots: {
            weapons: 2,
            modules: 3,
            implantBays: 1,
        },
        relayCapable: true,
        tags: ['hauler', 'cargo', 'mid-tier', 'relay-capable'],
    },
    {
        id: 'ashwake-runner',
        name: 'Ashwake Runner',
        class: 'frigate',
        description:
            'A stripped-down combat frigate originally built for Extraction Guild escort work. ' +
            'Fast, lightly armed, and designed to operate in dense asteroid fields. ' +
            'Popular with bounty hunters and aggressive salvagers.',
        stats: {
            hull: 120,
            shielding: 40,
            cargoCapacity: 8,
            fuelCapacity: 40,
            speed: 8,
            jumpRange: 2,
        },
        slots: {
            weapons: 3,
            modules: 2,
            implantBays: 1,
        },
        relayCapable: false,
        tags: ['combat', 'fast', 'belt-runner', 'mid-tier'],
    },
];
