import { Faction } from '../../shared/types/faction';

export const factions: Faction[] = [
    {
        id: 'meridian-dock-authority',
        name: 'Meridian Dock Authority',
        description:
            'The bureaucratic body that manages docking rights, port fees, and station law on Meridian Station. ' +
            'Underfunded, understaffed, and perpetually behind on maintenance contracts. ' +
            'They still enforce the rules — just not always the same ones twice.',
        homeStation: 'meridian-station',
        defaultStanding: 'neutral',
        tags: ['station', 'law', 'bureaucracy', 'meridian'],
    },
    {
        id: 'ashwake-extraction-guild',
        name: 'Ashwake Extraction Guild',
        description:
            'A loose collective of independent miners, salvagers, and rig crews operating in the Ashwake Belt. ' +
            'No central leadership, but strong mutual loyalty among dues-paying members. ' +
            'Distrustful of outsiders until they have proven useful.',
        homeStation: 'meridian-station',
        defaultStanding: 'neutral',
        tags: ['mining', 'salvage', 'independent', 'ashwake'],
    },
    {
        id: 'void-covenant',
        name: 'The Void Covenant',
        description:
            'A secretive organization that studies — and some say worships — Void Relay phenomena and the relics left behind. ' +
            'Officially dismissed as a fringe cult by station authorities. ' +
            'Their presence on Meridian is unofficial, deniable, and growing.',
        defaultStanding: 'neutral',
        tags: ['psi', 'cult', 'void-relays', 'secretive', 'cosmic-horror'],
    },
    {
        id: 'free-transit-compact',
        name: 'Free Transit Compact',
        description:
            'A loose hauler and courier guild operating across the frontier. ' +
            'They negotiate fuel prices, route protection, and transit rights. ' +
            'On Meridian they run the last reliable freight desk.',
        homeStation: 'meridian-station',
        defaultStanding: 'friendly',
        tags: ['hauler', 'courier', 'trade', 'frontier'],
    },
    {
        id: 'interstellar-commonwealth-authority',
        name: 'Interstellar Commonwealth Authority',
        shortName: 'ICA',
        description:
            'The administrative and regulatory arm of the Interstellar Commonwealth — ' +
            'the broad governing body that technically covers most inhabited space. ' +
            'The ICA manages relay licensing, freight certification, and inter-station law. ' +
            'In practice, their reach depends entirely on relay access. ' +
            'When the relay network failed, the ICA\'s presence in the outer sectors collapsed with it. ' +
            'Now that Relay 7-9 is back, they are watching closely — ' +
            'and their agenda may not align with Meridian\'s survival.',
        defaultStanding: 'neutral',
        tags: ['government', 'law', 'relay', 'official', 'state', 'phase-3'],
    },
];
