import { NPC } from '../../shared/types/npc';

/**
 * Phase 4 NPCs — faction contacts encountered in the post-relay frontier.
 * Accessible through the Faction Standings panel in HubScene.
 */
export const phase4NPCs: NPC[] = [
    {
        id: 'frontier-agent-leva',
        name: 'Frontier Agent Leva',
        role: ['quest-giver', 'faction-rep'],
        faction: 'frontier-compact',
        location: 'farpoint-waystation',
        description:
            'The Frontier Compact\'s regional coordinator for the Kalindra sector approach. ' +
            'Leva is pragmatic, unimpressed by credentials, and deeply invested in the operational health ' +
            'of anyone willing to run supply routes through the Drift. ' +
            'She operates out of Farpoint\'s freight administrative office, which means ' +
            'she is technically in the ICA\'s jurisdiction and entirely ignores this.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Frontier Compact has salvage rights on the Kalindra outer zone. The problem is we need someone to actually go there.',
            },
            {
                id: 'greeting-known',
                text: 'You\'re the one running the Kalindra approach. Good. We need more like you.',
                condition: 'reputation.frontier-compact >= 25',
            },
            {
                id: 'flavor-compact',
                text: 'The Compact isn\'t a guild. Guilds ask for dues. We ask for reliability. Different thing entirely.',
            },
            {
                id: 'hint-kalindra',
                text: 'Kalindra Hub went dark fast. Faster than the relay failure alone accounts for. The logs from the last active crew are sealed — Aegis flagged them.',
                condition: 'reputation.frontier-compact >= 25',
            },
            {
                id: 'hint-aegis-conflict',
                text: 'Aegis filed a classified access notice on the inner sections two days after we filed salvage rights. Two days. I want to know who told them we were looking.',
                condition: 'reputation.frontier-compact >= 60',
            },
            {
                id: 'redline-hint',
                text: 'If you\'re the kind of operator who runs deep on principle, I have work for you. The kind we don\'t post on the board.',
                condition: 'reputation.frontier-compact >= 60',
            },
        ],
        services: ['contracts', 'faction-rep'],
        tags: ['faction-rep', 'frontier-compact', 'quest-giver', 'farpoint', 'phase-4'],
    },
    {
        id: 'commander-dresh',
        name: 'Commander Dresh Arkan',
        role: ['faction-rep', 'quest-giver'],
        faction: 'sol-union-directorate',
        location: 'orins-crossing',
        description:
            'Garrison commander at Orin\'s Crossing. Fifteen years in Sol Union enforcement. ' +
            'Direct to the point of rudeness, scrupulously fair within his own legal framework, ' +
            'and deeply suspicious of anyone who has been through Relay 7-9 recently. ' +
            'He does not explain why he is suspicious. He does not explain much of anything. ' +
            'He runs compliance checks, approves transit filings, and occasionally ' +
            'contracts independent operators for enforcement work that his garrison is too visible to handle.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'All transit through Orin\'s Crossing requires a filed manifest. You\'re in my jurisdiction now.',
            },
            {
                id: 'greeting-compliant',
                text: 'Your filing checked out. We\'ll keep this brief. I may have work for operators with clean transit records.',
                condition: 'reputation.sol-union-directorate >= 30',
            },
            {
                id: 'flavor-jurisdiction',
                text: 'The ICA sends a letter every six months about our charter status. We file it. We continue operating. The corridor stays stable.',
            },
            {
                id: 'hint-sealed-sector',
                text: 'There is a locked sector on this station. You do not have clearance. Most people do not ask about it. I notice when they do.',
                condition: 'reputation.sol-union-directorate >= 30',
            },
            {
                id: 'hint-anomaly',
                text: 'We have been logging anomalous transit readings from the relay corridor for four months. The patterns do not match any vessel signature in our registry. I have forwarded the data upchain. I have received no response.',
                condition: 'reputation.sol-union-directorate >= 75',
            },
        ],
        services: ['contracts', 'faction-rep'],
        tags: ['faction-rep', 'sol-union', 'quest-giver', 'orins-crossing', 'phase-4'],
    },
    {
        id: 'operative-sable',
        name: 'Operative Sable',
        role: ['info-broker', 'faction-rep', 'quest-giver'],
        faction: 'aegis-division',
        location: 'meridian-station',
        description:
            'The only Aegis Division contact known to operate in the Meridian sector. ' +
            'She does not confirm this. She operates under a courier license that technically identifies her ' +
            'as an independent freight consultant. ' +
            'She has been at Meridian for six weeks — since shortly after the relay became active. ' +
            'She does not discuss what she found on arrival or why she chose to stay. ' +
            'She pays well. She asks precise questions. ' +
            'The things she is not asking about are more unsettling than the things she is.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'I\'m not here in any official capacity. That said — if you\'ve been through the relay recently, I\'d like to ask you some questions.',
            },
            {
                id: 'greeting-noticed',
                text: 'You have an unusual run record for someone operating out of Meridian. That\'s not a complaint.',
                condition: 'reputation.aegis-division >= 20',
            },
            {
                id: 'flavor-aegis',
                text: 'Aegis Division is a recovery organization. That\'s the official description. What we recover and from where — that\'s where descriptions stop being useful.',
            },
            {
                id: 'hint-kalindra',
                text: 'The Kalindra inner sections were flagged under emergency classification before the relay even reopened. I was the one who flagged them. What I found in the preliminary survey is why I\'m still here.',
                condition: 'reputation.aegis-division >= 20',
            },
            {
                id: 'hint-patterns',
                text: 'Three separate sites. Three different relay zones. Same waveform signature in the automated logs. Coldframe. Void Relay 7-9. Kalindra Hub. Whatever that signal is, it preceded all three activation events.',
                condition: 'reputation.aegis-division >= 60',
            },
            {
                id: 'hint-missing-team',
                text: 'I had a four-person survey team in the Kalindra Drift. They went dark twelve days ago. Their last transmission was a partial log upload. What came through does not make sense.',
                condition: 'reputation.aegis-division >= 60',
            },
        ],
        services: ['contracts', 'info-broker'],
        tags: ['faction-rep', 'aegis', 'info-broker', 'quest-giver', 'meridian', 'mystery', 'phase-4'],
    },
    {
        id: 'crow-veslin',
        name: "'Crow' Veslin",
        role: ['merchant', 'info-broker'],
        faction: 'vanta-corsairs',
        location: 'meridian-station',
        description:
            'Officially: an independent freight logistics consultant. ' +
            'Actually: the Vanta Corsairs\' primary contact in the Meridian docking ring. ' +
            'Crow is relaxed, unhurried, and has the specific quality of someone who knows more than they say ' +
            'and says exactly what you need to hear. ' +
            'They move off-book salvage, manage gray-market freight, and occasionally post work ' +
            'for operators who prefer not to ask about the provenance of their contracts. ' +
            'Crow does not ask questions. This is either their best quality or their most dangerous one.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'I run logistics. Broad definition of logistics. If you have something that needs moving — or something that needs finding — I am professionally interested.',
            },
            {
                id: 'greeting-listed',
                text: 'You\'re on my list. That means you get the actual rates, not the posted rates.',
                condition: 'reputation.vanta-corsairs >= 15',
            },
            {
                id: 'flavor-vanta',
                text: 'The Vanta Corsairs is a polite name people use. We just call it the network. Everyone in it knows everyone else. Eventually.',
            },
            {
                id: 'hint-kalindra-offbook',
                text: 'Kalindra Hub had a freight manifest that was never logged with the ICA. Someone cleared the inner section before the relay closed. What they left behind is still there. I know someone interested in it.',
                condition: 'reputation.vanta-corsairs >= 15',
            },
            {
                id: 'hint-aegis-watch',
                text: 'Aegis is watching Kalindra. They\'re watching a lot of things right now. If you\'re planning a deep run in there, timing matters.',
                condition: 'reputation.vanta-corsairs >= 50',
            },
        ],
        services: ['trade', 'contracts', 'info-broker'],
        tags: ['gray-market', 'vanta', 'merchant', 'info-broker', 'meridian', 'phase-4'],
    },
];
