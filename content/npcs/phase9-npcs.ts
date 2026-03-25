import { NPC } from '../../shared/types/npc';

/**
 * Phase 9 NPCs — Cycle Archive operators and the Architect's direct interface.
 */
export const phase9NPCs: NPC[] = [
    {
        id: 'commander-thess-dray',
        name: 'Commander Thess Dray',
        role: ['faction-rep', 'quest-giver'],
        faction: 'aegis-division',
        location: 'farpoint-waystation',
        description:
            'Aegis Division field commander who arrived at Farpoint the day the Cycle Archive coordinates were received. ' +
            'Veteran of three void-class extraction operations and skeptical of anything the Architect volunteers willingly. ' +
            'She runs every site as if the briefing is incomplete, because in her experience it always is.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'Aegis has been watching this sequence since phase one. A site that announces itself twice is either a trap or a test. Either way, I want extraction vectors before we go in.',
            },
            {
                id: 'on-cycle-archive',
                text: 'The Index Chamber was an invitation. This is the second message from an entity that does not repeat itself. That should concern everyone.',
                condition: 'flag.index-chamber-cleared',
            },
            {
                id: 'on-aegis-posture',
                text: 'I am not here to study it. I am here to ensure that when this site stops being cooperative, we have a way out.',
                condition: 'reputation.aegis-division >= 50',
            },
        ],
        services: ['contracts', 'faction-rep'],
        tags: ['aegis', 'farpoint', 'phase-9', 'cycle-archive', 'extraction'],
    },
    {
        id: 'null-archivist',
        name: 'Null Archivist Interface',
        role: ['info-broker'],
        faction: 'void-covenant',
        location: 'farpoint-waystation',
        description:
            'An upgraded relay built by the Void Covenant from the Echo Terminal components after the Index Chamber was cleared. ' +
            'Where the Echo Terminal output fragmented index notation, the Null Archivist now produces structured sentences ' +
            'in Commonwealth Standard — a deliberate change the Architect appears to have initiated from its end. ' +
            'Tovan Vex has not explained how.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'THE CYCLE ARCHIVE IS ACCESSIBLE. YOU HAVE BEEN INDEXED AS A WITNESS. YOUR CYCLE ENTRY IS OPEN.',
            },
            {
                id: 'on-second-transmission',
                text: 'THE ARCHIVE TIER WAS PREPARED BEFORE THE FIRST TRANSMISSION. YOU WERE ALWAYS EXPECTED TO REACH IT. THE RECORD REQUIRES COMPLETION.',
                condition: 'flag.index-chamber-cleared',
            },
            {
                id: 'on-previous-civilizations',
                text: 'FORTY-ONE CYCLE ENTRIES. THIRTY-NINE CLOSED BY WITNESS ACCOUNTS. TWO CLOSED BY ENFORCEMENT ACTION. CURRENT ENTRY: OPEN. CLASSIFICATION PENDING.',
                condition: 'reputation.void-covenant >= 55',
            },
        ],
        services: ['info-broker'],
        tags: ['void-covenant', 'farpoint', 'phase-9', 'null-architect', 'cycle-archive'],
    },
];
