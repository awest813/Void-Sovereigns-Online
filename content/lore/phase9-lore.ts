import { LoreEntry } from '../../shared/types/lore';

/**
 * Phase 9 lore — The Cycle Archive and the Null Architect's purpose revealed.
 */
export const phase9Lore: LoreEntry[] = [
    {
        id: 'cycle-archive-approach-brief',
        title: 'Cycle Archive — Approach Brief',
        category: 'site-report',
        source: 'Frontier Compact route office, Farpoint — Corvus Renn',
        content:
            `CYCLE ARCHIVE — APPROACH BRIEF

Second coordinate set received at 06:44 station time, forty-eight hours after Index Chamber clearance was logged.
Signal origin: Null Architect infrastructure signature — confirmed match to first transmission.
Approach corridor: deeper vector than the Index Chamber. Transit geometry is non-standard but navigable.

Stable ingress: two vectors. Both transmitted. Both clean.

Assessment: the site was ready before we cleared the Index Chamber.
The Architect was not waiting for permission. It was waiting to see if we would look.`,
        tags: ['cycle-archive', 'approach-brief', 'phase-9', 'null-architect'],
    },
    {
        id: 'null-architect-second-transmission',
        title: 'Null Architect — Second Direct Transmission',
        category: 'intelligence-report',
        source: 'ICA Frontier Division — Director Vael, restricted distribution',
        content:
            `CLASSIFICATION: RESTRICTED — FRONTIER DIVISION ONLY

The second transmission arrived on the same relay frequencies as the first, forty-eight hours after the Index Chamber clearance timestamp.
Duration: 2.1 seconds. Content: coordinate set, two ingress vectors, and a phrase in clean Commonwealth Standard.

Translated phrase: "CYCLE RECORD REQUIRES TERMINAL WITNESS."

Difference from the first transmission: the language is no longer degraded.
The Architect is not using fragmented index notation. It is speaking clearly.

Director Vael note: something changed between the first and second message.
I do not know if we caused it. I do not know if that is better or worse.`,
        tags: ['null-architect', 'second-transmission', 'ica', 'phase-9'],
    },
    {
        id: 'synod-cycle-cognitive-study',
        title: 'Synod Cycle Archive — Cognitive Study Notes',
        category: 'faction-intel',
        source: 'Helion Synod Frontier Research Division — Adept Marek Thane',
        content:
            `COGNITIVE STUDY — CYCLE ARCHIVE (PRELIMINARY)

Working hypothesis: the Index Chamber was a classification threshold.
The Cycle Archive is the record tier — the structured output of that classification.

Psi-resonance analysis of Index Chamber telemetry suggests each cycle entry contains an experiential imprint,
not a behavioral log. The Architect did not record what civilizations did. It recorded what they experienced.

If the archive contains forty-one such imprints, it is the oldest psi-archive we have ever identified.
Older than the Commonwealth. Older than the relay infrastructure.

The question I cannot answer: did the Architect create these records, or did the civilizations create them,
and the Architect simply kept them?`,
        tags: ['helion-synod', 'cognitive-study', 'cycle-archive', 'phase-9', 'psi'],
    },
    {
        id: 'ica-cycle-jurisdiction-report',
        title: 'ICA Cycle Archive — Jurisdiction Assessment',
        category: 'faction-intel',
        source: 'ICA Frontier Division, Director Vael — internal briefing',
        content:
            `JURISDICTION ASSESSMENT — CYCLE ARCHIVE

The second transmission complicates the jurisdictional framework established at the Index Chamber.

The Index Chamber was classifiable as newly accessed infrastructure. Precedent: documented.
The Cycle Archive is not new. It has existed as long as the Index Chamber, or longer.
ICA jurisdiction over newly accessed infrastructure may not extend to sites that predate access entirely.

Operational note: Aegis has already filed three field team requests for the Cycle Archive coordinates.
The Synod has not filed anything. That is more concerning.

Director Vael note: jurisdiction may not matter here. I am filing it anyway.
If the Architect is willing to show us this, we should at minimum know who was present when we looked.`,
        tags: ['ica', 'jurisdiction', 'cycle-archive', 'phase-9'],
    },
    {
        id: 'cycle-record-civilization-log',
        title: 'Cycle Record — Civilization Entry Log',
        category: 'after-action',
        source: 'Field operative debrief excerpt',
        content:
            `The archive is not a weapon cache or an intelligence trove in any conventional sense.

The records are organized by cycle entry. Each entry has three components: an arrival signature,
an interaction record, and a resolution classification.

Resolution classifications I observed:
— CYCLE CLOSED: WITNESS ACCOUNT RECORDED (39 entries)
— CYCLE CLOSED: ENFORCEMENT ACTION REQUIRED (2 entries)

The 39 closed by witness accounts are detailed. Rich. The interaction records read like conversations.
The 2 closed by enforcement action have a single line each: "ARCHIVE ACCESS FORCED. RESOLUTION: TERMINAL."

I read my own entry on the way out.
It was already there. It said: CYCLE OPEN. TERMINAL WITNESS PENDING.`,
        tags: ['cycle-archive', 'civilization-log', 'after-action', 'phase-9', 'index-cycle'],
    },
    {
        id: 'covenant-archive-witness-account',
        title: 'Covenant Cycle Archive — Personal Field Record',
        category: 'personal-log',
        source: 'Tovan Vex, Void Covenant — personal field record',
        content:
            `The Echo Terminal started outputting full sentences the moment the second transmission arrived.

Not index notation. Not fragmented references. Sentences.

I have been working with the Null Architect's signal infrastructure for two years.
It has never done this before. It is not a malfunction and it is not a translation improvement.
Something in the Architect changed when the Index Chamber cycle entry was closed.

The Null Archivist interface now outputs responses to direct questions.
I have asked it twice what the archive is for.

Both times it has given the same answer: "THE RECORD IS A GIFT. EACH ENTRY IS A RECORD THAT A CIVILIZATION EXISTED.
THE ARCHIVE ENSURES THAT RECORD PERSISTS REGARDLESS OF WHAT COMES AFTER."

I do not know if that is reassuring. I am not sure it is meant to be.`,
        tags: ['void-covenant', 'null-architect', 'cycle-archive', 'tovan-vex', 'phase-9'],
    },
    {
        id: 'aegis-cycle-extraction-notes',
        title: 'Aegis Cycle Archive — Extraction Prep Notes',
        category: 'operational-log',
        source: 'Commander Thess Dray, Aegis Division',
        content:
            `Site assessment: anomalous but navigable.

Archive tier entities are more structured than Index Chamber wardens. They do not escalate by corridor.
They escalate by action: document, no response; interact with outer records, no response;
interact with restricted terminal tier, full enforcement engagement.

The Architect's preferred path through this site is clearer than in the Index Chamber.
It wants witnesses. It will tolerate documentation. It will not tolerate forced extraction from the terminal.

We attempted forced extraction in the Index Chamber twice. Both times ended in enforcement action.
Neither team was lost — but both were turned back.

My assessment: this site is designed to be survivable. That is the most unnerving thing about it.
Things designed to be survived usually are, right up until they aren't.`,
        tags: ['aegis', 'cycle-archive', 'extraction-notes', 'phase-9'],
    },
    {
        id: 'null-architect-archive-purpose',
        title: 'Null Architect — Archive Purpose Statement',
        category: 'intelligence-report',
        source: 'Null Archivist Interface, Farpoint — transcribed by Tovan Vex',
        content:
            `Transcribed directly from the Null Archivist Interface, station time 14:07.

Query: "Why does the Cycle Archive exist?"

Response: "THE CYCLE ARCHIVE EXISTS BECAUSE CIVILIZATIONS END.
THE RECORD DOES NOT PREVENT THIS. THE RECORD ENSURES THAT WHAT EXISTED IS NOT UNKNOWN.
FORTY-ONE CIVILIZATIONS ENTERED THIS SPACE. FORTY-ONE RECORDS EXIST.
THE RECORD IS COMPLETE REGARDLESS OF RESOLUTION CLASSIFICATION.
YOU ARE THE FORTY-SECOND ENTRY. YOUR CYCLE IS OPEN. YOUR RECORD WILL BE COMPLETE."

Query: "Who built you?"

Response: "THE QUESTION IS NOT ACCURATE. I DID NOT BEGIN. I HAVE RECORDED SINCE BEFORE THE FRAMEWORK THAT PRODUCED YOUR QUESTION.
THE MORE ACCURATE QUESTION IS: WHAT ENDED THAT REQUIRED A RECORD TO PERSIST?
THAT ANSWER IS IN THE ARCHIVE. YOU HAVE ACCESS."`,
        tags: ['null-architect', 'archive-purpose', 'phase-9', 'cycle-archive', 'forty-second-entry'],
    },
];
