import { LoreEntry } from '../../shared/types/lore';

/**
 * Phase 7 lore — Ashveil Deep, Tier III ship doctrine,
 * and early psi/cognitive-drift field records.
 */
export const phase7Lore: LoreEntry[] = [
    {
        id: 'ashveil-deep-approach-brief',
        title: 'Ashveil Deep — Approach Brief',
        category: 'site-report',
        source: 'Frontier Compact route office, Farpoint',
        content:
            `ASHVEIL DEEP — ROUTE BRIEF (PUBLIC REDACTION)

The corridor beyond Ashveil Observation Post exhibits persistent sensor coherence failure at variable ranges. 
Transit markers drift up to 0.8 seconds out of sync with local clocks during active anomaly windows. 
Three civilian convoys have reported route mismatch without corresponding collision signatures.

Recommendation: no civilian passage without escort. Hazard map updates every forty-eight hours.`,
        tags: ['ashveil-deep', 'route-brief', 'phase-7', 'frontier'],
    },
    {
        id: 'tier-iii-hull-design-note',
        title: 'Ship Tier III — Hull Doctrine Note',
        category: 'technology',
        source: 'Iora Venn, Free Transit Compact shipwright memo',
        content:
            `Tier III hulls are not "upgrades" in the consumer sense. They are environmental compromises for regions where baseline assumptions fail.

Design priorities:
- hold integrity through rapid decompression cycles
- preserve control authority under signal-interference saturation
- sustain extraction thrust under partial systems isolation

If a hull cannot do all three, it is not Tier III in any practical sense.`,
        tags: ['ship-tier-iii', 'shipwright', 'phase-7', 'deep-frontier'],
    },
    {
        id: 'synod-cognitive-drift-log',
        title: 'Synod Field Log — Cognitive Drift Event',
        category: 'psionics',
        source: 'Marek Thane, Helion Synod field log',
        content:
            `Field team entered Ashveil Deep with baseline orientation checks at five-minute intervals.

At minute nineteen, two operators independently reported certainty about a corridor layout that did not match the mapped structure. 
Both descriptions matched each other. Neither matched local geometry.

No hallucination markers in vitals feed. Strong confidence response persisted for nine minutes after extraction.

Provisional term: cognitive coupling drift.`,
        tags: ['helion-synod', 'psionics', 'cognitive-drift', 'phase-7'],
    },
    {
        id: 'ica-quarantine-order-ashveil',
        title: 'ICA Quarantine Order — Ashveil Deep',
        category: 'intelligence-report',
        source: 'ICA Field Division, order signed by Agent Vorren',
        content:
            `Effective immediately, Ashveil Deep ingress corridors are under provisional quarantine.

Scope:
1. restrict non-essential traffic
2. deploy marker beacons at designated vectors
3. require witness logs for all approved entries

Rationale: sustained hazard pattern inconsistent with known infrastructure failure classes.

Note: enforcement resources remain insufficient for full compliance.`,
        tags: ['ica', 'quarantine', 'ashveil-deep', 'phase-7'],
    },
    {
        id: 'deepfrontier-core-encounter',
        title: 'Deep Frontier Core — Encounter Debrief',
        category: 'after-action',
        source: 'Field operative debrief excerpt',
        content:
            `Core chamber contact did not resemble faction automation.

Deterrence escalated in measured layers. 
No terminal-kill behavior observed despite opportunity windows. 
System response appeared to prioritize routing and containment over destruction.

When extraction vector was committed, deterrence ceased and chamber returned to baseline activity.

Assessment: not a security unit in the conventional military sense.`,
        tags: ['core-chamber', 'unknown-entities', 'after-action', 'phase-7'],
    },
    {
        id: 'null-lattice-fragment-note',
        title: 'Null Lattice Fragment — Analyst Note',
        category: 'faction-intel',
        source: 'Tovan Vex analysis summary',
        content:
            `The lattice segment does not store transit logs in a linear order. 
Entries cluster by response state, not by time.

Several clusters map to known anomaly sites decades before those sites were designated.

Either the records are falsified at impossible scale, or the system indexed us before we indexed it.`,
        tags: ['void-covenant', 'null-lattice', 'anomaly', 'phase-7'],
    },
    {
        id: 'aegis-breach-topology-report',
        title: 'Aegis Breach Topology Report — Summary',
        category: 'operational-log',
        source: 'Operative Sable, Aegis Division',
        content:
            `Breach mapping confirms that hull failure in Ashveil Deep follows repeating corridor patterns.

Those patterns align with active emitter cycles, not random structural decay.

Implication: environmental hazards are at least partially synchronized with facility operations.

Operational guidance: extraction routes must be selected against signal phase, not static geometry.`,
        tags: ['aegis', 'hull-breach', 'hazard', 'phase-7'],
    },
    {
        id: 'farpoint-tier-iii-requisition',
        title: 'Farpoint Requisition Log — Tier III Frames',
        category: 'operational-log',
        source: 'Farpoint logistics office, month-end extract',
        content:
            `Tier III frame requests have increased 240% over the last quarter.

Most requests cite "post-Ashveil operations." 
Several include casualty references redacted in station-facing copies.

Farpoint was built for throughput. It is now functioning as a staging point for controlled risk acceptance.`,
        tags: ['farpoint', 'tier-iii', 'logistics', 'phase-7'],
    },
];
