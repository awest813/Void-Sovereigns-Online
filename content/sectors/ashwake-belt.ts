import { Sector } from '../../shared/types/sector';

export const ashwakeBelt: Sector = {
    id: 'ashwake-belt',
    name: 'Ashwake Belt',
    type: 'belt',
    description:
        'An asteroid mining zone a short jump from Meridian Station. ' +
        'Once a productive extraction region, Ashwake now features a mix of active independent rigs, ' +
        'abandoned corporate extraction platforms, and worker habitats left to decay. ' +
        'The machinery does not always stay shut down when it should. ' +
        'Close enough to Meridian for beginner contracts, but dangerous enough to kill the unprepared.',
    dangerLevel: 'low',
    factions: [
        'ashwake-extraction-guild',
        'meridian-dock-authority',
    ],
    dungeons: [
        'rig-alpha-7',
        'coldframe-station-b',
    ],
    contracts: [
        'salvage-rig-alpha-7',
        'bounty-rogue-drone-mk3',
        'survey-extraction-grid-9',
    ],
    lore: [
        'lore-ashwake-history',
        'lore-rogue-automation',
    ],
    tags: ['belt', 'mining', 'starter-zone', 'industrial', 'ashwake'],
};
