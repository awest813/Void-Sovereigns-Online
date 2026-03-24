import { Dungeon } from '../../shared/types/dungeon';

export const shalehookDigSite: Dungeon = {
    id: 'shalehook-dig-site',
    name: 'Shalehook Dig Site',
    type: 'asteroid-complex',
    tier: 1,
    sector: 'ashwake-belt',
    description:
        'An old Guild prospecting operation carved into the face of asteroid 44-Kheras. ' +
        'The dig was abandoned twelve years ago when the ore yield dropped below threshold. ' +
        'The automated systems — drill units, survey drones, excavators — were supposed to be mothballed. ' +
        'Someone apparently forgot to send that message.',
    rooms: [
        {
            id: 'shalehook-entry-shaft',
            type: 'entrance',
            description:
                'The access shaft is still intact. Emergency lighting casts everything in dull orange. ' +
                'Boot prints in the grime — old ones, weeks at least. ' +
                'Deeper in, you can hear the grind of machinery that should have been silent for years.',
        },
        {
            id: 'shalehook-upper-gallery',
            type: 'combat',
            description:
                'A wide excavation gallery. Two Mk.I mining drones are active, moving in lazy patrol loops. ' +
                'They register your presence and reorient. ' +
                'Someone has scratched a tally into the rock face — fourteen marks, crossed in groups of five.',
            encounters: ['mining-drone-mk1', 'mining-drone-mk1'],
        },
        {
            id: 'shalehook-equipment-depot',
            type: 'loot',
            description:
                'A storage alcove cut into the side wall. Racks of survey equipment, most of it corroded. ' +
                'A Guild survey kit in a sealed case is still intact — the data core light is green. ' +
                'A crate of salvageable components sits open nearby.',
        },
        {
            id: 'shalehook-lower-drill-chamber',
            type: 'combat',
            description:
                'The main drilling floor. Massive bore machinery fills the center of the room. ' +
                'A Mk.II drone and a Drill Sentinel are running coordinated patterns. ' +
                'The Sentinel turns its bore-head toward you.',
            encounters: ['mining-drone-mk2', 'drill-sentinel'],
        },
        {
            id: 'shalehook-core-access',
            type: 'boss',
            description:
                'The deepest chamber. The original excavator unit — a full-scale autonomous platform — ' +
                'stands motionless in the center until you step past the threshold. ' +
                'Then it moves. Its control module is visible through a cracked chassis panel. ' +
                'It seems to be running a task loop that has been cycling since the site went dark.',
            encounters: ['excavator-prime'],
        },
    ],
    bossId: 'excavator-prime',
    rewards: {
        creditRange: [180, 320],
        xpRange: [120, 200],
        lootTable: [
            'control-module',
            'salvage-crate-standard',
            'power-cell',
            'drill-component',
            'drone-scrap-parts',
            'survey-kit-damaged',
        ],
    },
    tags: ['tier-1', 'ashwake', 'asteroid-complex', 'rogue-automation', 'starter-dungeon', 'phase-1-primary'],
};
