import { NPC } from '../../shared/types/npc';

/**
 * Phase 11 NPCs — The Origin Node operators and the Herald's residual echo interface.
 */
export const phase11NPCs: NPC[] = [
    {
        id: 'herald-echo',
        name: 'Herald Echo',
        role: ['info-broker'],
        location: 'farpoint-waystation',
        description:
            'What remains at Docking Bay 7 after the Threshold Herald went silent. ' +
            'It is not the Herald. The Herald is gone — not destroyed, not deactivated, simply no longer present. ' +
            'What is left is a residual echo interface that occupies the same space the Herald occupied ' +
            'and responds only to queries about the Origin Node. ' +
            'Aegis has scanned it four times. The scans return a new result: ' +
            '"ARCHITECT INFRASTRUCTURE — CLASSIFICATION: ORIGIN RELAY — STATUS: PASSIVE." ' +
            'The Void Covenant\'s interpretation: the Herald was always an interface to this place. ' +
            'Its work at the threshold was a prologue.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'THE ORIGIN NODE IS THE FIRST RECORD. IT HAS BEEN ACTIVE SINCE BEFORE YOU EXISTED. THE FORTY-SECOND CYCLE IS CLOSED. WHAT REMAINS IS WHAT ALWAYS REMAINED: THE BEGINNING.',
            },
            {
                id: 'on-sovereign-threshold-cleared',
                text: 'THE THRESHOLD RESOLVED THE FORTY-SECOND CYCLE. THE ORIGIN NODE HOLDS THE FIRST. THEY ARE NOT EQUIVALENT. THE FIRST RECORD IS WHERE THE ARCHITECT DECIDED. EVERY OTHER RECORD FOLLOWS FROM THAT DECISION.',
                condition: 'flag.sovereign-threshold-cleared',
            },
            {
                id: 'on-void-covenant',
                text: 'THE COVENANT HAS SPENT FORTY YEARS STUDYING WHAT THE ARCHITECT BUILT. THE ORIGIN NODE IS WHERE THE ARCHITECT DECIDED TO BUILD IT. THOSE ARE DIFFERENT QUESTIONS WITH DIFFERENT ANSWERS.',
                condition: 'reputation.void-covenant >= 65',
            },
        ],
        services: ['info-broker'],
        tags: ['null-architect', 'farpoint', 'phase-11', 'origin-node', 'first-record'],
    },
    {
        id: 'frontier-archivist-sol',
        name: 'Archivist Sol',
        role: ['faction-rep', 'quest-giver'],
        faction: 'frontier-compact',
        location: 'farpoint-waystation',
        description:
            'A veteran Frontier Compact deep-archivist who has spent twenty-two years cataloguing ' +
            'Null Architect infrastructure across the frontier. She was the first person at Farpoint ' +
            'to identify the relay network as a unified system rather than isolated anomalies, ' +
            'and the first to predict the existence of a terminal site before the Index Chamber transmission arrived. ' +
            'The Herald\'s coordinate burn came through on her nav system first — addressed to her by name. ' +
            'She has not mentioned this to anyone. She mentioned it to the Herald Echo. ' +
            'The Echo\'s response was: "THAT IS CORRECT. YOU WERE EXPECTED." ' +
            'She filed the approach survey request immediately after.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Twenty-two years of Architect survey work and it knew my name. I have stopped trying to determine what that implies and started trying to understand what it means for the Origin Node approach.',
            },
            {
                id: 'on-herald-echo',
                text: 'The Echo is a relay interface, not a presence. The Herald was different — there was something deliberate about it. The Echo is the Herald\'s last transmission, held in place. A message that chose to stay.',
                condition: 'flag.sovereign-threshold-cleared',
            },
            {
                id: 'on-origin-node',
                text: 'Every site in the archive sequence has a functional purpose: record, store, resolve. The Origin Node\'s purpose is different. It is where the Architect decided those functions were worth having. That is not a record. That is a choice.',
                condition: 'reputation.frontier-compact >= 70',
            },
        ],
        services: ['contracts', 'faction-rep'],
        tags: ['frontier-compact', 'farpoint', 'phase-11', 'origin-node', 'null-architect'],
    },
];
