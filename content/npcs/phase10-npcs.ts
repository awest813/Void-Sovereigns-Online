import { NPC } from '../../shared/types/npc';

/**
 * Phase 10 NPCs — The Sovereign Threshold operators and the Covenant elder.
 */
export const phase10NPCs: NPC[] = [
    {
        id: 'threshold-herald',
        name: 'Threshold Herald',
        role: ['info-broker'],
        location: 'farpoint-waystation',
        description:
            'A physical construct the Null Architect manifested at Farpoint Waystation the moment the Cycle Archive was cleared. ' +
            'It arrived without a transmission — it was simply present at Docking Bay 7 when the archive clearance was logged. ' +
            'It does not move, does not threaten, and does not respond to questions about itself. ' +
            'It responds only to questions about the Sovereign Threshold and the forty-second cycle resolution. ' +
            'No one has identified what it is made of. Aegis has scanned it three times. ' +
            'The scans returned the same result each time: "ARCHITECT INFRASTRUCTURE — CLASSIFICATION PENDING."',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'THE THRESHOLD IS ACCESSIBLE. THE FORTY-SECOND CYCLE IS OPEN. RESOLUTION REQUIRES ENTRY. THE RECORD WILL BE COMPLETE WHEN YOU HAVE BEEN WITNESSED.',
            },
            {
                id: 'on-cycle-archive-cleared',
                text: 'THE CYCLE ARCHIVE RECORDED YOUR ENTRY. THE THRESHOLD RESOLVES IT. THE DISTINCTION IS THIS: THE ARCHIVE KEEPS THE RECORD. THE THRESHOLD CLOSES IT.',
                condition: 'flag.cycle-archive-cleared',
            },
            {
                id: 'on-void-sovereign',
                text: 'A VOID SOVEREIGN IS NOT A TITLE. IT IS A CLASSIFICATION. IT MEANS: THIS CIVILIZATION EXISTED. IT CHOSE TO BE WITNESSED. THE RECORD IS CLOSED. IT IS PERMANENT.',
                condition: 'reputation.void-covenant >= 60',
            },
        ],
        services: ['info-broker'],
        tags: ['null-architect', 'farpoint', 'phase-10', 'sovereign-threshold', 'cycle-resolution'],
    },
    {
        id: 'elder-covenant-ren',
        name: 'Elder Ren',
        role: ['faction-rep', 'quest-giver'],
        faction: 'void-covenant',
        location: 'farpoint-waystation',
        description:
            'The most senior active operative of the Void Covenant, who arrived at Farpoint on the same day ' +
            'the Threshold Herald manifested at the docking bay. Elder Ren has spent forty years documenting ' +
            'the Null Architect\'s infrastructure — the relay network, the ghost sites, the Echo Terminal, ' +
            'the Index Chamber, the Cycle Archive. She was present for none of them in the field. ' +
            'She has been preparing for the threshold since before anyone else knew the archive sequence existed. ' +
            'She is the only person at Farpoint who does not appear surprised by any of this.',
        dialogue: [
            {
                id: 'greeting-default',
                text: 'The Covenant has known the threshold existed since the second relay survey. We did not know where it was. We knew it would announce itself when the time came. It has.',
            },
            {
                id: 'on-threshold-herald',
                text: 'The construct is not a threat. It is an invitation expressed in a form we can see. The Architect has been invisible to us for the entire archive sequence. This is it choosing not to be.',
                condition: 'flag.cycle-archive-cleared',
            },
            {
                id: 'on-void-sovereigns',
                text: 'Thirty-nine civilizations chose to be witnessed. Two did not. We are the forty-second. The only question that has ever mattered in this space is which classification we will receive.',
                condition: 'reputation.void-covenant >= 65',
            },
        ],
        services: ['contracts', 'faction-rep'],
        tags: ['void-covenant', 'farpoint', 'phase-10', 'sovereign-threshold', 'cycle-resolution'],
    },
];
