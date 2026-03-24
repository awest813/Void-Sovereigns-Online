import { NPC } from '../../shared/types/npc';

export const meridianNPCs: NPC[] = [
    // ── PHASE 1 CANON NPCs ────────────────────────────────────────────────

    {
        id: 'tamsin-vale',
        name: 'Tamsin Vale',
        role: ['quest-giver', 'faction-rep'],
        faction: 'meridian-dock-authority',
        location: 'meridian-station',
        description:
            'Meridian\'s contract dispatcher. Sharp, direct, and perpetually undersupported. ' +
            'She manages the contract board, vets incoming jobs, and keeps a mental list of who delivered and who did not. ' +
            'She has a habit of knowing things she should not.',
        portrait: 'assets/npcs/tamsin.png',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Board is updated this morning. Tier-1 jobs are open — pick one before someone else does.',
            },
            {
                id: 'greeting-returning',
                text: 'You came back. That already puts you ahead of three other crews this month.',
                condition: 'flag.completed-first-run',
            },
            {
                id: 'hint-shalehook',
                text: 'Shalehook has been quiet on comms for two weeks. Guild says automation fault. I say someone should look.',
            },
            {
                id: 'anomaly-hint',
                text: 'One of the survey teams filed a partial report about Grid 9. The rest of the report was — I don\'t know what happened to it. It just stopped mid-sentence.',
                condition: 'reputation.meridian-dock-authority >= 5',
            },
        ],
        services: ['contracts'],
        tags: ['quest-giver', 'faction', 'story', 'starter', 'phase-1'],
    },

    {
        id: 'rook-mendera',
        name: 'Rook Mendera',
        role: ['faction-rep'],
        faction: 'meridian-dock-authority',
        location: 'meridian-station',
        description:
            'Dockmaster of Meridian Station\'s Dock Nine Belt. Heavyset, methodical, and deeply tired. ' +
            'He keeps the bay running through stubbornness alone and is not interested in explanations for why something cannot be done.',
        portrait: 'assets/npcs/rook.png',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Bay clearance is current. Keep your ship in your assigned slot and we won\'t have a problem.',
            },
            {
                id: 'flavor-busy',
                text: 'Used to run forty slips. Now running nine. I keep the records the same as if it were forty. Old habit.',
            },
            {
                id: 'hint-traffic',
                text: 'Had a ship come in from deep belt last week. No manifest, no crew listed on record. Left before I could file a proper inquiry. You didn\'t hear that from me.',
                condition: 'reputation.meridian-dock-authority >= 5',
            },
        ],
        services: ['docking-clearance'],
        tags: ['faction', 'dockmaster', 'story', 'starter', 'phase-1'],
    },

    {
        id: 'ilya-sorn',
        name: 'Ilya Sorn',
        role: ['shipwright'],
        location: 'meridian-station',
        description:
            'Meridian\'s best ship mechanic, which is a title she holds by default since the other two left. ' +
            'Ilya is quiet and practical. She will not talk much while she works. ' +
            'She charges fair and does not cut corners.',
        portrait: 'assets/npcs/ilya.png',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Hull work or engine work? Either way, I\'ll need an hour.',
            },
            {
                id: 'repair-offer',
                text: 'That hull condition is going to get you killed in the Belt. Twenty credits per ten HP. You want me to patch it?',
            },
            {
                id: 'ship-upgrade-hint',
                text: 'Cutter Mk.I is a fine ship for local runs. But if you ever want to reach a Relay, you\'ll need something bigger. Meridian Hauler II — or a Runner if you are in a hurry. Save your credits.',
                condition: 'flag.asked-about-upgrade',
            },
        ],
        services: ['repair', 'ship-upgrade'],
        tags: ['shipwright', 'mechanic', 'services', 'starter', 'phase-1'],
    },

    {
        id: 'nera-quill',
        name: 'Nera Quill',
        role: ['merchant'],
        location: 'meridian-station',
        description:
            'Parts broker and general equipment trader operating out of a cramped stall in the Ash Market. ' +
            'Nera deals in everything from consumables to ship modules. ' +
            'She has a good memory for prices and a better memory for people who owe her.',
        portrait: 'assets/npcs/nera.png',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'I\'ve got medical kits, repair compound, and a few modules. What do you need?',
            },
            {
                id: 'salvage-offer',
                text: 'Bring me salvage from the Belt and I\'ll give you a fair price. Not Guild rates — my rates. Better.',
            },
            {
                id: 'rumor-parts',
                text: 'Someone has been buying control modules in bulk. Not from me — from the Guild office. More than any repair job needs. Just noticed.',
                condition: 'flag.returned-control-module',
            },
        ],
        services: ['trade', 'salvage-buy'],
        tags: ['merchant', 'parts-broker', 'services', 'starter', 'phase-1'],
    },

    {
        id: 'brother-caldus',
        name: 'Brother Caldus',
        role: ['info-broker'],
        faction: 'relay-chapel',
        location: 'meridian-station',
        description:
            'The archivist of Meridian\'s Relay Chapel — a small order that maintains records of the Void Relay network, ' +
            'active and inactive. Brother Caldus is old, precise, and deeply concerned about things he will not explain directly.',
        portrait: 'assets/npcs/caldus.png',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'The Chapel is open to anyone who respects the records. Most people do not come here.',
            },
            {
                id: 'relay-info',
                text: 'The Relays did not simply break down. The record of their deactivation is — inconsistent. There are entries that do not match the official report. I have been trying to reconcile them for three years.',
            },
            {
                id: 'anomaly-hint',
                text: 'Relay Seven-Nine showed a six-hour active window four months ago. Unprompted. No vessel was registered on approach. I have no explanation for that.',
                condition: 'flag.asked-about-relays',
            },
        ],
        services: ['info', 'lore'],
        tags: ['info-broker', 'archivist', 'story', 'relay', 'void-adjacent', 'phase-1'],
    },

    // ── PHASE 0 NPCs (retained) ───────────────────────────────────────────

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
