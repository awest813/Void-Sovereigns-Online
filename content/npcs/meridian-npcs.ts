import { NPC } from '../../shared/types/npc';

export const meridianNPCs: NPC[] = [
    {
        id: 'dockmaster-renata',
        name: 'Dockmaster Renata Osei',
        role: ['quest-giver', 'faction-rep'],
        faction: 'meridian-dock-authority',
        location: 'meridian-station',
        description:
            'A tired but sharp woman who has been running Meridian\'s docking operations for eleven years. ' +
            'She has watched the station decline, sent the reports, and received nothing in return. ' +
            'She is not bitter — she is realistic. She needs help she cannot officially pay for.',
        portrait: 'assets/npcs/renata.png',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Dock fees are due on arrival. If you are here for work, check the board.',
            },
            {
                id: 'greeting-friendly',
                text: 'You are still alive. Good. I have another job if you want it.',
                condition: 'reputation.meridian-dock-authority >= 10',
            },
            {
                id: 'story-decline',
                text: 'Used to be thirty ships a day through here. Now? Maybe eight. The Relays went out and everyone forgot we existed.',
                condition: 'flag.asked-about-meridian',
            },
        ],
        services: ['contracts', 'docking-clearance'],
        tags: ['quest-giver', 'faction', 'story', 'starter'],
    },
    {
        id: 'guild-rep-halvek',
        name: 'Halvek Dross',
        role: ['quest-giver', 'faction-rep', 'merchant'],
        faction: 'ashwake-extraction-guild',
        location: 'meridian-station',
        description:
            'The Extraction Guild\'s standing representative on Meridian. ' +
            'Halvek is a thick-fingered Karathi who has worked every job in the Belt at least once. ' +
            'He is quiet, direct, and will give a fair deal to someone who proves they can handle themselves.',
        portrait: 'assets/npcs/halvek.png',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'You a worker or a tourist? Belt is not for tourists.',
            },
            {
                id: 'greeting-trusted',
                text: 'Heard good things. I might have something more serious for you.',
                condition: 'reputation.ashwake-extraction-guild >= 20',
            },
            {
                id: 'warning-drones',
                text: 'Three crews lost ships to rogue automation this month. Old Guild infrastructure is coming back online wrong. Take that seriously.',
            },
        ],
        services: ['contracts', 'trade', 'salvage-clearance'],
        tags: ['quest-giver', 'faction', 'trade', 'starter', 'karathi'],
    },
    {
        id: 'torrek-voss',
        name: 'Torrek Voss',
        role: ['quest-giver', 'info-broker'],
        location: 'meridian-station',
        description:
            'A wiry independent salvager with an eye patch and a reputation for finding things in places other people avoid. ' +
            'No faction affiliation. Runs on a handshake and a percentage cut. ' +
            'He knows Ashwake Belt better than anyone — and he knows what to stay away from.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'If you are looking for trouble, try the Belt. If you are looking for profit, also try the Belt — but be smart about it.',
            },
            {
                id: 'hint-survey-grid',
                text: 'Grid 9 has been throwing off weird readings for months. Guild keeps sending survey teams. None of them file full reports. Just saying.',
                condition: 'flag.met-halvek',
            },
            {
                id: 'hint-void-covenant',
                text: 'You see the people in the grey coats hanging around bay 14? Do not ask them about Relays. Seriously.',
                condition: 'reputation.meridian-dock-authority >= 5',
            },
        ],
        services: ['info', 'contracts'],
        tags: ['info-broker', 'salvager', 'independent', 'story-hint'],
    },
    {
        id: 'barkeep-sova',
        name: 'Sova',
        role: ['bartender', 'info-broker'],
        location: 'meridian-station',
        description:
            'Nobody knows Sova\'s last name. Nobody asks. She has been behind the bar at the Rust Anchor for as long as anyone can remember. ' +
            'She hears everything. She sells information at a fair price and gossip for free.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Drink or information? Both will cost you.',
            },
            {
                id: 'rumor-covenant',
                text: 'Grey coats paying in hard currency. Not dock scrip. Real credits. Whatever they are buying with it is not on any manifest I have seen.',
                condition: 'flag.asked-about-station-rumor',
            },
            {
                id: 'rumor-relay',
                text: 'Someone came through last week claiming Relay Seven-Nine flickered back on for six hours. Then silence. Make of that what you will.',
                condition: 'reputation.meridian-dock-authority >= 5',
            },
        ],
        services: ['info', 'drinks'],
        tags: ['bartender', 'info-broker', 'rumor-source', 'story'],
    },
];
