import { PlayerClass } from '../../shared/types/playerClass';

export const playerClasses: PlayerClass[] = [
    {
        id: 'salvager',
        name: 'Salvager',
        description:
            'You have spent years stripping value from dead ships and abandoned rigs. ' +
            'You know where things break, where they hide, and how to carry more than you should. ' +
            'Not a soldier — but dangerous in the right corridor.',
        primaryStat: 'agility',
        abilities: [
            {
                id: 'scavenge',
                name: 'Scavenge',
                description: 'Search a room for additional loot. Chance scales with Agility.',
                unlockLevel: 1,
            },
            {
                id: 'field-strip',
                name: 'Field Strip',
                description: 'Disassemble a defeated enemy or broken machine for components.',
                unlockLevel: 3,
            },
            {
                id: 'overload-cell',
                name: 'Overload Cell',
                description: 'Sacrifice a power cell to stun an enemy for one round.',
                unlockLevel: 6,
            },
        ],
        startingEquipment: ['compact-autopistol', 'std-9mm', 'pry-tool', 'patched-flight-suit'],
        tags: ['utility', 'loot-focused', 'ranged'],
    },
    {
        id: 'hauler',
        name: 'Hauler',
        description:
            'You have run cargo across half the frontier and survived things the manifests never mentioned. ' +
            'You know the shipping lanes, the docking fees, and which customs officers to avoid. ' +
            'Your ship is your business.',
        primaryStat: 'endurance',
        abilities: [
            {
                id: 'overloaded-run',
                name: 'Overloaded Run',
                description: 'Move at full speed while carrying over cargo capacity. Short duration.',
                unlockLevel: 1,
            },
            {
                id: 'trade-contact',
                name: 'Trade Contact',
                description: 'Access a secondary shop inventory not available to standard players.',
                unlockLevel: 4,
            },
            {
                id: 'ballistic-patch',
                name: 'Ballistic Patch',
                description: 'Apply an emergency hull patch in the field. Restores a small amount of ship hull.',
                unlockLevel: 7,
            },
        ],
        startingEquipment: ['compact-autopistol', 'std-9mm', 'hull-patch-kit', 'worn-enviro-suit'],
        tags: ['utility', 'trade-focused', 'tanky'],
    },
    {
        id: 'enforcer',
        name: 'Enforcer',
        description:
            'You have worked security, debt collection, or worse. You know how to end a fight quickly ' +
            'and how to stay standing after one. Not picky about who is paying — just about getting paid.',
        primaryStat: 'strength',
        abilities: [
            {
                id: 'suppressing-fire',
                name: 'Suppressing Fire',
                description: 'Reduce enemy action speed for one round.',
                unlockLevel: 1,
            },
            {
                id: 'breacher',
                name: 'Breacher',
                description: 'Force open locked doors or containers without a key.',
                unlockLevel: 3,
            },
            {
                id: 'close-quarters',
                name: 'Close Quarters',
                description: 'Deal bonus damage with sidearms and melee weapons in confined rooms.',
                unlockLevel: 5,
            },
        ],
        startingEquipment: ['heavy-autopistol', 'std-12mm', 'combat-knife', 'armored-vest'],
        tags: ['combat', 'melee-adjacent', 'durable'],
    },
    {
        id: 'psi-adept',
        name: 'Psi Adept',
        description:
            'You do not talk about the things you have seen near Relay wreckage sites. ' +
            'You have sensitivity — maybe from exposure, maybe from birth. ' +
            'People distrust you for it. Probably smart of them.',
        primaryStat: 'psi',
        abilities: [
            {
                id: 'read-resonance',
                name: 'Read Resonance',
                description: 'Sense nearby enemies or relics through walls. Short range.',
                unlockLevel: 1,
            },
            {
                id: 'neural-burn',
                name: 'Neural Burn',
                description: 'Deal void damage to a single target. No ammo required.',
                unlockLevel: 3,
            },
            {
                id: 'static-veil',
                name: 'Static Veil',
                description: 'Briefly scramble enemy sensors and detection. Useful for avoiding combat.',
                unlockLevel: 6,
            },
        ],
        startingEquipment: ['compact-autopistol', 'std-9mm', 'relic-fragment', 'worn-enviro-suit'],
        tags: ['psi', 'glass-cannon', 'utility'],
    },
];
