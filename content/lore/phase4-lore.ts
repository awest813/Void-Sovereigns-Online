import { LoreEntry } from '../../shared/types/lore';

/**
 * Phase 4 lore entries — post-relay frontier, faction records, and escalating anomaly thread.
 */
export const phase4Lore: LoreEntry[] = [
    {
        id: 'lore-kalindra-collapse',
        title: 'Kalindra Processing Hub — Station Record',
        category: 'locations',
        content: `Kalindra Processing Hub was commissioned approximately forty years ago as a mid-range bulk transfer facility. Its function was simple: ore from independent extraction crews in the outer belt would be processed, manifested, and relayed to core-system buyers via the Void Relay network.

At peak operation, Kalindra processed twelve to fifteen freighter loads per transit cycle. It was not a prestigious posting, but it was a functional one. The crew of approximately sixty rotated on standard cycle schedules.

When the relay network failed two years ago, the outbound freight backed up. The processing crew stayed on standard rotation, managing inventory, running maintenance, and filing requests for transit authorization that were never answered.

The station went dark six weeks after the last relay closure.

The official record lists the cause as "unplanned station evacuation following life-support fault." No evacuation vessel was logged at any nearby station. No crew members filed for reintegration assistance at any ICA office.

The freight they were holding is still there. The logs from the last active crew shift are sealed under an Aegis Division classification notice dated eleven months ago — seven months before the relay reopened.`,
        relatedEntries: ['lore-aegis-sealed-notice', 'lore-void-relays-overview'],
        tags: ['kalindra', 'locations', 'mystery', 'phase-4'],
    },
    {
        id: 'lore-aegis-sealed-notice',
        title: 'Aegis Division — Classification Notice (Excerpt)',
        category: 'records',
        content: `CLASSIFICATION NOTICE
ISSUING AUTHORITY: Aegis Division — Field Operations
REFERENCE: KALINDRA-HUB-INNER / SECTOR-SEAL-001
DATE: [REDACTED]

The following areas are designated RESTRICTED under Aegis Division Field Protocol 7, Section 4:

• Kalindra Processing Hub — Engineering Level B and below
• Kalindra Processing Hub — Signal Archive Node
• Kalindra Transit Corridor — Grid Sectors 4 through 9

Access to restricted areas requires Aegis Division clearance, Level 3 or above. All previously filed transit or salvage authorizations for the listed areas are suspended pending Aegis review.

Basis for classification: [REDACTED]

Duration of classification: Indefinite, pending internal assessment completion.

Persons found in restricted areas without valid Aegis clearance will be subject to detention and review.

NOTE: The Frontier Compact's salvage filing for the Kalindra outer zone remains valid for non-restricted sections. Aegis Division does not contest the Compact's outer-zone access. We are only asking about the inner sections.

[END NOTICE]`,
        relatedEntries: ['lore-kalindra-collapse', 'lore-anomaly-pattern-escalation'],
        tags: ['aegis', 'records', 'mystery', 'restricted', 'phase-4'],
    },
    {
        id: 'lore-anomaly-pattern-escalation',
        title: 'Survey Log — Signal Pattern Correlation',
        category: 'anomaly',
        content: `SURVEY LOG — COMPILED BY: OPERATIVE SABLE, AEGIS DIVISION
STATUS: INTERNAL — NOT FOR DISTRIBUTION

Three sites. Three relay-adjacent installations. Three separate events. One signal pattern.

SITE ONE: Shalehook Dig Site, Ashwake Belt. Automation anomaly, approximately fourteen months ago. Signal detected in maintenance logs: waveform pattern, steady, 4.7 Hz. Source: unidentified. Automation systems remained active past scheduled shutdown.

SITE TWO: Coldframe Station-B, outer Ashwake Belt. Crew disappearance, approximately eight months ago. Signal detected in facility controller logs: same waveform, same frequency. Controller behavior: anomalous task loop, pattern consistent with external instruction rather than fault state.

SITE THREE: Kalindra Processing Hub, Kalindra Drift. Station evacuation event, approximately two years ago. Signal detected in signal archive node — pending recovery. Preliminary scan confirms waveform match. Event preceded relay closure or occurred concurrently.

ADDITIONAL NOTE: Void Relay 7-9 signal log, recovered during recent operator-contracted investigation, contains partial waveform match in transit corridor records. Timestamp on relay entry: TRANSIT SUCCESSFUL — VESSEL: UNKNOWN — DURATION: 0 SECONDS.

ASSESSMENT: The signal does not originate from any known automated system, beacon protocol, or manufacturing catalog. Repetition rules out random noise. Consistency across geographically distributed sites rules out local interference.

Something is broadcasting. It has been broadcasting for at least two years, possibly longer. The relay network appears to be the medium.

Recommendation: Recover the Kalindra signal archive node. Identify the source.

[NOTE: If this is what I think it is, "recommendation" may be the wrong word. We may not have the option of choosing whether to proceed.]`,
        relatedEntries: ['lore-kalindra-collapse', 'lore-void-relays-overview'],
        tags: ['anomaly', 'mystery', 'signal', 'escalation', 'aegis', 'phase-4', 'void-adjacent'],
    },
    {
        id: 'lore-orins-crossing-history',
        title: "Orin's Crossing — Station History",
        category: 'locations',
        content: `Orin's Crossing was established sixty-three years ago as a neutral transit checkpoint at the intersection of three frontier system approaches. The founding charter was authored jointly by the Sol Union and two independent system councils that no longer exist.

The station has changed hands on paper three times. In practice, it has always been administered by whoever had the most armed vessels in the corridor at any given time. Currently: the Sol Union Directorate.

The Interstellar Commonwealth Authority has disputed Sol Union jurisdiction over the station since the Commonwealth was formed forty years ago. The ICA position is that all transit infrastructure within relay-adjacent space falls under Commonwealth charter. The Sol Union position is that the ICA did not exist when the station was built and can therefore get in line.

The station processes transit filings for approximately forty vessels per week — down from two hundred at peak relay operation. Commander Dresh Arkan has commanded the garrison for seven years. He is not interested in the jurisdictional dispute, the history of the station, or whether visitors find the inspection process inconvenient.

He has, in the last four months, logged twelve anomalous transit events in the relay corridor approaches. He has forwarded all twelve to Sol Union command. He has received no response. He has continued logging.`,
        relatedEntries: ['lore-sol-union-jurisdiction', 'lore-impossible-telemetry-orin'],
        tags: ['orins-crossing', 'locations', 'history', 'sol-union', 'phase-4'],
    },
    {
        id: 'lore-sol-union-jurisdiction',
        title: 'Sol Union Directorate — Jurisdiction Notice to ICA',
        category: 'records',
        content: `FROM: Sol Union Directorate — Frontier Operations Command
TO: Interstellar Commonwealth Authority — Transit Regulatory Division
RE: Orin's Crossing Jurisdictional Status — Annual Reaffirmation

This notice reaffirms the Sol Union Directorate's operational authority over Orin's Crossing Transit Station, as established under the Frontier Infrastructure Charter of Year 349.

The Sol Union recognizes the ICA's general administrative authority in Commonwealth-chartered space. The Sol Union does not recognize that Orin's Crossing falls within that space. We have included, for the forty-first consecutive year, a certified copy of the founding charter.

We note the ICA's additional query regarding anomalous transit data recorded by our garrison in the relay corridor. We confirm that we are collecting this data. We confirm that we are not sharing it at this time.

Our legal position regarding data sharing is as follows: data collected by Sol Union assets in Sol Union-administered space belongs to the Sol Union. We will share it when and if we determine that doing so serves a Sol Union interest.

We wish the ICA continued success in its important work elsewhere.

SIGNED: Directorate Legal Affairs`,
        relatedEntries: ['lore-orins-crossing-history'],
        tags: ['records', 'sol-union', 'ica', 'jurisdiction', 'bureaucracy', 'phase-4'],
    },
    {
        id: 'lore-impossible-telemetry-orin',
        title: "Orin's Crossing — Garrison Transit Log (Anomalous Entries)",
        category: 'anomaly',
        content: `TRANSIT LOG — ORIN'S CROSSING GARRISON
FLAGGED ENTRIES — COMMANDER DRESH ARKAN, REVIEWING OFFICER

ENTRY 1 — Day 112:
Transit filing received from vessel MERIDIAN FREIGHT 7. Vessel confirmed departure at 0630. Transit corridor sensors recorded vessel passage at 0630.
Transit corridor sensors also recorded vessel passage at 0618 — twelve minutes before departure.

ENTRY 2 — Day 119:
No transit filings received. No vessels on dock. Transit corridor sensors recorded three separate vessel signatures at 0200, 0201, and 0201 respectively. All three signatures are identical. All three disappeared simultaneously at 0203.

ENTRY 6 — Day 134:
Relay corridor long-range scan returned a vessel signature at bearing 004-mark-32. Standard identification query was sent. Response received: vessel ID KALINDRA FREIGHT UNIT 9 — a vessel whose registration was cancelled eleven months ago when Kalindra Hub was classified. The signature disappeared before intercept was possible.

ENTRY 9 — Day 148:
Automated checkpoint logged entry filing from a vessel. Filing listed the destination as: VOID RELAY 7-9 — APPROACH — INBOUND. This destination does not exist as an outbound filing category. The vessel associated with the filing does not appear in any registry. No vessel was physically present at the checkpoint.

ENTRY 12 — Day 156:
Transit corridor sensors logged a passage event with a duration of zero seconds. No vessel. No signature. Just the event record. The timestamp matches the exact second that Relay 7-9 recorded its last anomalous transit.

I have forwarded all entries to command. I am still waiting for a response.`,
        relatedEntries: ['lore-orins-crossing-history', 'lore-anomaly-pattern-escalation'],
        tags: ['anomaly', 'telemetry', 'mystery', 'impossible', 'orins-crossing', 'phase-4', 'void-adjacent'],
    },
    {
        id: 'lore-frontier-compact-frontier',
        title: 'Frontier Compact — Operational Charter Excerpt',
        category: 'factions',
        content: `The Frontier Compact exists because the frontier does not.

What we mean by this: the frontier as a governing concept — the idea that there are people and stations out here who have claims, who have rights, who have operational needs — does not exist in the records of any governing body that has the authority to act on it.

The ICA covers relay-licensed space. The Sol Union covers whatever it can hold by force. The Guilds cover their members when it is profitable.

The frontier is what is left.

The Compact represents the operators, crew members, station administrators, independent haulers, and colony coordinators who live and work in the spaces between those jurisdictions. We do not have enforcement authority. We do not have military assets. We have shared interest and mutual reliability, which turns out to be more durable than most people expect.

We ask for one thing from the people we work with: do what you say you will do. The frontier is hard enough without having to guess which of your partners will hold their end.

If you are reading this because someone handed you a Compact contact card — welcome. We will ask you to do something specific, we will tell you what it pays, and we will not lie to you about what you are walking into. We do not have the luxury of wasting operators on jobs they are not prepared for.

AGENT LEVA — REGIONAL COORDINATOR, KALINDRA APPROACH`,
        relatedEntries: ['lore-orins-crossing-history', 'lore-kalindra-collapse'],
        tags: ['frontier-compact', 'factions', 'phase-4'],
    },
    {
        id: 'lore-redline-runs-briefing',
        title: 'Station Briefing — Redline Runs',
        category: 'operations',
        content: `OPERATIONAL BRIEFING — CLASSIFICATION: SENSITIVE

What operators around the Meridian docking ring call "Redline Runs" are not a formal designation. The term comes from the risk threshold notation used in early frontier contract filings — any contract rated above standard risk tolerance was literally marked with a red line in the filing margin.

The practice has become slang. Redline Runs are contracts where the operational risk is high enough that the standard crew survival and equipment recovery guarantees are suspended.

What this means in practice: if a Redline Run goes wrong, you come back with whatever you can carry. Your equipment does not get a recovery clause. Your ship does not get a salvage guarantee. The Compact, the Guild, and every other organization that normally backstops operator losses will tell you, politely, that they told you this was a Redline contract.

The rewards are proportionally higher. The contracts only go to operators with a demonstrated track record in their relevant sector.

Redline Runs are never mandatory. They are posted with full risk disclosure. The people who take them do so with full knowledge of the terms.

The people who take them tend to be operators who have been in the frontier long enough to know that sometimes the best way to find out what is actually in a sealed zone is to go in without asking permission.

If you are reading this because someone handed you a Redline contract slip — they have decided you are that kind of operator.`,
        relatedEntries: ['lore-kalindra-collapse', 'lore-aegis-sealed-notice'],
        tags: ['operations', 'redline', 'high-risk', 'briefing', 'phase-4'],
    },
];
