import { Dungeon } from '../../shared/types/dungeon';

export const ashwakeDungeons: Dungeon[] = [
    {
        id: 'rig-alpha-7',
        name: 'Extraction Rig Alpha-7',
        type: 'installation',
        tier: 1,
        sector: 'ashwake-belt',
        description:
            'A medium-sized automated extraction rig that went dark three weeks ago. ' +
            'The facility is still powered — the automated systems simply stopped responding to remote commands. ' +
            'Several salvage crates remain in the cargo holds. The MK-2 drones patrolling the corridors do not seem to know the work day is over.',
        rooms: [
            {
                id: 'alpha7-entrance',
                type: 'entrance',
                description:
                    'The docking collar is intact. Emergency lighting is active — dim orange strips along the floor. ' +
                    'The main corridor stretches ahead, blast doors open. Faint mechanical sounds from deeper in.',
            },
            {
                id: 'alpha7-corridor-a',
                type: 'corridor',
                description: 'A long service corridor. Scorch marks on one wall. A broken drone lies in pieces near a support strut.',
                encounters: ['mining-drone-mk2-patrol'],
            },
            {
                id: 'alpha7-cargo-hold',
                type: 'loot',
                description:
                    'The main cargo hold. Three salvage crates are stacked near the loading bay. ' +
                    'One has been partially stripped — probably by whatever took out the crew.',
                encounters: ['mining-drone-mk2-guard'],
            },
            {
                id: 'alpha7-control-room',
                type: 'combat',
                description:
                    'The rig\'s control room. Consoles are still lit. Something is running the automation — and it is not factory default behavior.',
                encounters: ['mining-drone-mk2-patrol', 'mining-drone-mk2-guard'],
            },
            {
                id: 'alpha7-reactor-bay',
                type: 'boss',
                description:
                    'The reactor bay has been converted into a nest of sorts. ' +
                    'The Supervisor Unit — a heavy industrial automaton — stands here in standby mode. ' +
                    'It activates when you enter.',
                encounters: ['supervisor-unit-alpha7'],
            },
        ],
        bossId: 'supervisor-unit-alpha7',
        rewards: {
            creditRange: [200, 450],
            xpRange: [100, 200],
            lootTable: [
                'salvage-crate-standard',
                'power-cell',
                'drone-scrap-parts',
                'cryo-component',
                'std-9mm',
            ],
        },
        tags: ['tier-1', 'ashwake', 'industrial', 'rogue-automation', 'starter-dungeon'],
    },
    {
        id: 'coldframe-station-b',
        name: 'Coldframe Station B',
        type: 'derelict',
        tier: 1,
        sector: 'ashwake-belt',
        description:
            'A worker habitat from the early Belt expansion era. ' +
            'Cold Frame Station B was built to house extraction crews during long shifts. ' +
            'It has been abandoned for twelve years. ' +
            'The cryo-storage units still hold power. ' +
            'Some of them hold other things too.',
        rooms: [
            {
                id: 'coldframe-airlock',
                type: 'entrance',
                description:
                    'The external airlock is corroded but functional. ' +
                    'Cold air floods the suit when you open the inner door. ' +
                    'The habitat is cold, dark, and very quiet.',
            },
            {
                id: 'coldframe-barracks',
                type: 'hazard',
                description:
                    'The crew barracks. Bunks still made. Personal effects left behind. ' +
                    'The floor is slick with frozen condensation. ' +
                    'A collapsed section blocks the east passage — you will need to find a way around.',
            },
            {
                id: 'coldframe-cryo-wing',
                type: 'combat',
                description:
                    'The cryo-storage wing. Rows of preservation pods, most inactive. ' +
                    'One pod at the far end is cycling. ' +
                    'Three worker-class maintenance drones are active and hostile.',
                encounters: ['maintenance-drone-mk1', 'maintenance-drone-mk1', 'maintenance-drone-mk1'],
            },
            {
                id: 'coldframe-storage',
                type: 'loot',
                description:
                    'The main supply storage. Shelves of equipment, most degraded but some still useful. ' +
                    'The cryo-component crate Torrek Voss mentioned is here, sealed and intact.',
            },
            {
                id: 'coldframe-cryo-boss',
                type: 'boss',
                description:
                    'The cycling cryo pod has completed its sequence. ' +
                    'Whatever was preserved inside has been active and moving for days. ' +
                    'The lights in this room have all been broken from the inside.',
                encounters: ['revived-crew-mk1'],
            },
        ],
        bossId: 'revived-crew-mk1',
        rewards: {
            creditRange: [150, 350],
            xpRange: [80, 180],
            lootTable: [
                'cryo-component',
                'cryo-component-x2',
                'old-station-manifest',
                'medical-kit',
                'std-9mm',
                'power-cell',
            ],
        },
        tags: ['tier-1', 'ashwake', 'derelict', 'cryo-horror', 'starter-dungeon'],
    },
];
