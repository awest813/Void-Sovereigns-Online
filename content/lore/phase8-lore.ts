import { LoreEntry } from '../../shared/types/lore';

/**
 * Phase 8 lore — The Index Chamber and first contact with the Null Architect.
 */
export const phase8Lore: LoreEntry[] = [
    {
        id: 'index-chamber-approach-brief',
        title: 'Index Chamber — Approach Brief',
        category: 'site-report',
        source: 'Frontier Compact route office, Farpoint — Corvus Renn',
        content:
            `INDEX CHAMBER — APPROACH BRIEF (PRELIMINARY)

Coordinates received via broadcast transmission at 04:12 station time.
Signal origin: consistent with Null Architect infrastructure signature.
Route geometry: non-standard. Approach corridor does not appear in any registered survey.

Stable ingress confirmed at three vectors. All three vectors were marked in the transmission itself.

Assessment: the site was already prepared for arrival before the transmission was sent.`,
        tags: ['index-chamber', 'approach-brief', 'phase-8', 'null-architect'],
    },
    {
        id: 'null-architect-first-transmission',
        title: 'Null Architect — First Direct Transmission',
        category: 'intelligence-report',
        source: 'ICA Frontier Division — Director Vael, restricted distribution',
        content:
            `CLASSIFICATION: RESTRICTED — FRONTIER DIVISION ONLY

The transmission arrived simultaneously on all registered relay frequencies in the frontier corridor.
Duration: 4.3 seconds. Content: coordinate set, single ingress advisory, and a phrase in degraded Commonwealth Standard.

Translated phrase: "THE RECORD REQUIRES WITNESS ACCOUNTS."

There are no known prior instances of the Null Architect initiating communication.
ICA analysts have confirmed the transmission did not originate from any faction infrastructure.

Director Vael note: this is not an accident. This is an invitation.`,
        tags: ['null-architect', 'first-contact', 'transmission', 'ica', 'phase-8'],
    },
    {
        id: 'synod-index-interaction-protocol-v1',
        title: 'Synod Index Interaction Protocol — Version 1',
        category: 'faction-intel',
        source: 'Helion Synod Frontier Research Division — Adept Marek Thane',
        content:
            `INTERACTION PROTOCOL — INDEX CHAMBER v1.0

Working assumption: Index Chamber entities are not deterrence units in the conventional sense.
They escalate in response to threat postures, not presence.

Protocol steps:
1. Enter without aggressive posture. Document initial entity response state.
2. Engage only if entities initiate. Record escalation threshold.
3. Under engagement: structured response only. Measure deescalation lag.
4. At archive threshold: engage to test access permissions.

Hypothesis: the entities were designed to test intent, not eliminate intruders.
If the Architect wanted this site sealed, it would not have broadcast the coordinates.`,
        tags: ['helion-synod', 'interaction-protocol', 'index-chamber', 'phase-8', 'psi'],
    },
    {
        id: 'ica-index-access-order',
        title: 'ICA Priority Access Order — Index Chamber',
        category: 'faction-intel',
        source: 'ICA Frontier Division, Order signed by Director Vael',
        content:
            `PRIORITY ACCESS ORDER — INDEX CHAMBER SITE

By authority of the Interstellar Commonwealth Authority, Frontier Division:

1. The Index Chamber constitutes newly accessed infrastructure under Commonwealth jurisdiction.
2. All faction access must be filed with ICA Farpoint command prior to transit.
3. Priority access marker deployment is underway. Non-compliance will result in access suspension.

Operational note:
We do not know what the site contains. That is exactly why jurisdiction must be established now,
before any single faction can claim precedent.

Director Vael note: this order was issued before any field operatives cleared access.
That was deliberate.`,
        tags: ['ica', 'access-order', 'index-chamber', 'phase-8'],
    },
    {
        id: 'index-cycle-first-observation',
        title: 'Index Cycle — First Observation Log',
        category: 'after-action',
        source: 'Field operative debrief excerpt',
        content:
            `The entities inside did not attack on entry.

They observed. Then they moved to positions that blocked specific corridors — not all corridors.
The corridors they blocked led toward the inner archive. The ones they left open led toward the core record.

When I engaged the outer line, they responded with scaled force. Proportional. Not punitive.
When I broke contact and retreated to an open corridor, they stopped.

Assessment: these are access management units, not kill units.
The site has a preferred path through it. I think we were supposed to find it.`,
        tags: ['index-chamber', 'index-cycle', 'after-action', 'phase-8'],
    },
    {
        id: 'covenant-index-voice-account',
        title: 'Covenant Index Voice — Witness Account',
        category: 'personal-log',
        source: 'Tovan Vex, Void Covenant — personal field record',
        content:
            `The Echo Terminal has been running for six days since the transmission arrived.

What it outputs is not language in the way we use language.
It is closer to index notation — structured references to events in a classification system we do not have the key for.

One output keeps recurring: a reference to what the terminal parses as "cycle completion pending."
Two of forty-one prior entrants have open cycle records.

I do not know what closing a cycle record entails.
I am not certain the field operatives who return from the Index Chamber will be able to tell me either.

But I think the Architect is not satisfied with what it recorded about those two previous entrants.
And it needed someone new to go back in.`,
        tags: ['void-covenant', 'null-architect', 'index-cycle', 'tovan-vex', 'phase-8'],
    },
    {
        id: 'frontier-index-approach-routes',
        title: 'Frontier Index Approach Routes — Navigator Notes',
        category: 'operational-log',
        source: 'Corvus Renn, Free Transit Compact',
        content:
            `Three stable approach vectors, all transmitted in the original broadcast.

Vector Alpha: direct ingress, shortest approach, moderate sensor drift.
Vector Beta: wide arc, longer transit, cleanest geometry — recommended for first approach.
Vector Gamma: flagged in the transmission as "restricted." I have not tested it.

The coordinates are not difficult to navigate. They are unusually clean for frontier space.
That fact alone makes me more cautious about this site than anything in the Ashveil sector ever did.

Anomalies do not advertise themselves. This one did. I keep coming back to that.`,
        tags: ['frontier-compact', 'approach-routes', 'index-chamber', 'phase-8'],
    },
    {
        id: 'aegis-index-extraction-brief',
        title: 'Aegis Index Chamber — Extraction Prep Brief',
        category: 'operational-log',
        source: 'Operative Sable, Aegis Division',
        content:
            `Site assessment: non-standard.

The entities do not pursue beyond corridor threshold boundaries.
Extraction routing must account for Index Cycle phase timing — the available corridors rotate.

Fallback positions: mapped at three intervals. All three align with open-access corridors.
No viable position exists adjacent to the archive approach. That section has no deescalation lag.

Operational note: the safest path through this site is the one the site wants you to take.
That should concern everyone, and it does.`,
        tags: ['aegis', 'index-chamber', 'extraction-prep', 'phase-8'],
    },
];
