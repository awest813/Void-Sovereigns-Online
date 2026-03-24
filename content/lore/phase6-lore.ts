import { LoreEntry } from '../../shared/types/lore';

/**
 * Phase 6 lore — The Farpoint Hub, Kael Mourne's zero-second ping,
 * Transit Node Zero, and the escalating intelligence war between
 * ICA and the Void Covenant over what the relay network is actually for.
 */
export const phase6Lore: LoreEntry[] = [
    {
        id: 'kael-personal-record',
        title: 'Kael Mourne — Personal Record, Fragment',
        category: 'personal-log',
        source: 'Kael Mourne, Farpoint Waystation',
        content:
            `I have been over this for six years and I keep arriving at the same place.

The ping has my name on it. My ship ID. My authentication codes — the ones I generated at certification, that I have never shared with anyone, that are not stored in any system I have ever accessed remotely. Every field of that transmission identifies me specifically.

The timestamp says zero. Not corrupted. Not null. Zero. The relay engineers I consulted told me the relay was calibrated to a starting epoch of zero before its first active use. A timestamp of zero means the transmission arrived before active use began.

I was running cargo in the Ashwake Belt when that ping transmitted. I was not at Farpoint. I was not near the relay. I did not send it.

I have considered every explanation. Forgery requires access I didn't have. Echo requires a relay signal I never sent. Pre-echo requires physics that don't exist. I have been left with: it is real, and I don't understand it, and I am going to find out what I can before I stop being able to.`,
        tags: ['kael-mourne', 'zero-second', 'ping', 'personal', 'phase-6', 'questline'],
    },

    {
        id: 'transit-node-zero-approach',
        title: 'Transit Node Zero — Approach Notes',
        category: 'site-report',
        source: 'Kael Mourne, encrypted field log',
        content:
            `Approach to Transit Node Zero, personal log.

The navigation system acknowledged the destination. It didn't flag it as unknown. It had a record. An old one — pre-relay standard, the kind of entry the system doesn't generate anymore, the kind that exists in the base nav database and never gets overwritten because nothing accesses it. The record says: waypoint active.

It also says: last confirmed transit — four hundred and twelve years ago.

The facility is visible on approach. Intact. Running lights on the exterior, slow pulse pattern. The same interval as the waveform from every other site I've documented. I watched it for forty minutes before I decided to dock.

The docking interface accepted my approach. The airlock cycled as if it had done this ten thousand times. A registration code request came through — the code format is four hundred years obsolete and my system accepted it without complaint.

Whatever this place is, it has been here since before we started building relay networks. It has been running the whole time.`,
        tags: ['transit-node-zero', 'approach', 'kael-mourne', 'ghost-site', 'phase-6', 'questline'],
    },

    {
        id: 'ica-relay-archive-fragment',
        title: 'ICA Classified Relay Archive — Fragment R-7',
        category: 'intelligence-report',
        source: 'ICA Internal Archive, access level 4 (Agent Vorren, declassified for operational use)',
        content:
            `FRAGMENT R-7 — RELAY NETWORK ANOMALY LOG (PARTIAL DECLASSIFICATION)
Filed: ICA Technical Division, Relay Infrastructure Assessment

The relay network was constructed on top of pre-existing navigational infrastructure that ICA survey teams assessed as derelict at time of installation. The assessment was accurate given available instrumentation — the infrastructure showed no active power signatures and no response to standard handshake protocols.

During calibration of relay nodes across the network, ICA technical teams logged transit arrivals from unregistered sources. These arrivals occurred during calibration windows, before the nodes were considered operationally active. Each arrival was logged as a sensor artifact and filed accordingly.

This fragment covers the period from network activation through the first three operational years.

Total sensor artifacts logged during that period: 847.

Distribution of artifacts across the network: non-random. The artifacts cluster at specific nodes — nodes which have subsequently shown the highest incidence of void-resonance anomaly activity.

A pattern analysis was initiated following this correlation. The analysis was completed. The findings were classified. This fragment does not include the findings.`,
        tags: ['ica', 'relay-archive', 'sensor-artifacts', 'pattern', 'phase-6', 'intelligence'],
    },

    {
        id: 'covenant-field-report-tovan',
        title: 'Void Covenant Field Report — Tovan Vex',
        category: 'faction-intel',
        source: 'Tovan Vex, Farpoint Station',
        content:
            `Field report submitted to Kestrel Vin, Void Covenant Operations.

The waveform query is intensifying at Farpoint specifically. I have been monitoring for ninety-three days and the amplitude increase follows a consistent curve — not logarithmic, not exponential. Deliberate.

The relay node here is positioned at a convergence point I can't explain with human cartography. We did not choose this location for its relay properties. We chose it for its transit access. Whatever placed this node here placed it here for a reason that predates the choice of location by several orders of magnitude.

Supplemental observation: the zero-second ping in Kael Mourne's records is not an anomaly. I have cross-referenced it against every documented waveform event in the Covenant database. The timestamp zero corresponds exactly to an escalation event in the waveform — a jump in amplitude that occurred simultaneously across every monitored site.

Kael's ping is not an anomaly. Kael's ping is a response. Something responded to the amplitude event using his credentials. I do not have an explanation for why his credentials specifically.`,
        tags: ['tovan-vex', 'void-covenant', 'farpoint', 'waveform', 'kael-mourne', 'phase-6'],
    },

    {
        id: 'farpoint-ops-log-month-14',
        title: 'Farpoint Waystation Operations Log — Month 14',
        category: 'operational-log',
        source: 'Farpoint Station Ops, Kael Mourne presiding',
        content:
            `FARPOINT WAYSTATION — MONTH 14 OPERATIONAL LOG
Filed by: K. Mourne, Station Coordinator

WEEK 1: Routine transit clearances, twelve ships processed. Supply inventory within acceptable range. Relay node maintenance conducted without incident. One anomalous reading during maintenance, logged separately.

WEEK 2: Seven ships processed. One unauthorized transit signature detected in the outer relay corridor. No ship found upon investigation. Signal characteristics noted: match the waveform pattern that the Compact's contracted observers have been tracking. Filed the report.

WEEK 3: Nine ships processed. Two more unauthorized transit signatures. Same characteristics. No ships found. I ran the signatures against the relay archive. The pattern was present in the calibration logs from when this relay was first activated. I am noting this without interpretation.

WEEK 4: Eleven ships processed. Routine operations. Third unauthorized transit signature this week. Same pattern.

Summary note: Three unauthorized transit signatures in one week. No ships found in the transit corridor afterward. Signal characteristics match the waveform pattern the Void Covenant has been tracking.

I have filed the reports. I have not filed the interpretation. The interpretation is not something I want in an official log.`,
        tags: ['farpoint', 'kael-mourne', 'operations-log', 'transit-signatures', 'waveform', 'phase-6'],
    },

    {
        id: 'vorren-zero-second-analysis',
        title: 'Zero-Second Record Analysis — Agent Vorren',
        category: 'intelligence-report',
        source: 'Agent Vorren, ICA Field Division',
        content:
            `ZERO-SECOND TRANSIT RECORD ANALYSIS
Prepared by: Agent Vorren, ICA Field Division
Classification: Field Operational — Restricted Distribution

I have now reviewed 23 zero-second transit records across four relay nodes. This review was authorized under standing anomaly investigation protocols and does not constitute an official ICA position on the nature of these records.

They are not artifacts. I have confirmed this through independent technical review. Each one has a departure point encoded in the signal structure — a departure point that was not apparent in the initial logged data and required non-standard extraction methods to retrieve.

The departure points do not correspond to any known location in the current navigation database, the ICA restricted database, or the pre-relay navigational infrastructure records I was granted access to for this review.

The arrival points — every single one — are locations where anomalous void-resonance waveform signatures have subsequently been recorded.

Something is navigating. Something has been navigating to the anomaly sites before we designated them as anomaly sites. Something has been navigating for longer than we have had relay technology, using infrastructure that predates our relay network, arriving at locations that subsequently become significant to us.

I am not including a conclusion in this report. The conclusion is apparent.`,
        tags: ['ica', 'agent-vorren', 'zero-second', 'transit-records', 'navigation', 'phase-6'],
    },

    {
        id: 'transit-zero-interior-partial',
        title: 'Transit Node Zero — Interior Recording, Partial',
        category: 'site-report',
        source: 'Field operative recording, recovered',
        content:
            `[RECORDING — PARTIAL — BEGIN]

The architecture is... it predates everything I've seen. Not abandoned. Maintained. The maintenance isn't recent — the maintenance is continuous. There's no dust accumulation timeline here. This has been maintained without interruption.

There are systems running that I can't identify the purpose of. They're not life support. They're not navigation. They're not weapons systems. They are processing something. I can hear it — a low-frequency cycling that my instruments register as a data operation but can't decode.

One of the systems responded to my presence. Not with hostility. With logging. A panel I hadn't touched lit up when I entered the room. A recording indicator activated. Whatever this system does, part of what it does is record visitors.

I am in someone's records now. I don't know whose.

[RECORDING — PARTIAL — END]`,
        tags: ['transit-node-zero', 'interior', 'ghost-site', 'logging', 'phase-6'],
    },

    {
        id: 'null-architect-encounter-report',
        title: 'Null Architect — Post-Encounter Report',
        category: 'after-action',
        source: 'Field operative post-mission debrief',
        content:
            `POST-ENCOUNTER DEBRIEF — TRANSIT NODE ZERO, CORE CHAMBER ENTITY

The entity in the core chamber is not a weapon system. I want to be clear about this because the instinct on contact is to classify it as a threat and respond accordingly. It is not a weapon system.

It is not a guardian in the conventional sense either. My best description: a caretaker. It responded to my intrusion with escalating deterrence — each layer more comprehensive than the last, like a system methodically checking credentials I didn't have and adjusting its response when each check failed.

At no point did it attempt to destroy me. The maximum escalation I encountered was a suppression response that would have driven a less-prepared operator out of the facility. It seemed calibrated for deterrence rather than elimination.

When I completed my objective and moved toward the extraction point, it stopped. Not because I defeated it. Because I was leaving. It returned to its post in the core chamber.

I have two theories about this. One: it was satisfied that I had completed whatever task it considered legitimate. Two: it had finished logging my presence and had no further use for the interaction.

I don't know which one is correct. Both bother me equally.`,
        tags: ['null-architect', 'transit-node-zero', 'encounter', 'caretaker', 'phase-6'],
    },
];
