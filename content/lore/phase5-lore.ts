import { LoreEntry } from '../../shared/types/lore';

/**
 * Phase 5 lore — anomaly escalation, Ashveil records, Vault transmissions,
 * and faction intelligence on the growing pattern.
 */
export const phase5Lore: LoreEntry[] = [
    {
        id: 'lore-ashveil-final-crew-log',
        title: 'Ashveil Post — Final Crew Log Entry',
        category: 'void-relays',
        content:
            `LEAD RESEARCHER: Maren Sol — Helion Synod Field Team
Day 241 of deployment

The emitters are doing something we didn't account for. The output readings are within nominal range but the subjective effect is not nominal. Tevess says he's been hearing footsteps in the empty corridors. I heard them last night and didn't tell him because I didn't want to reinforce the pattern. I'm filing this separately from the official log. The official log goes to the Synod board. This one stays here.

The waveform has changed. Not much. Maybe 3% amplitude shift on the primary harmonic. But it's consistent and it's directional — pointing toward the 7-9 relay corridor. Which means it's pointing toward us.

We built the monitoring post here because this was the most active signal site. I don't think the signal is a passive broadcast. I think it noticed the post.`,
        relatedEntries: ['lore-helion-synod-pattern-analysis', 'lore-vault-transmission-excerpt'],
        tags: ['ashveil', 'crew-log', 'anomaly', 'phase-5', 'void-adjacent'],
    },
    {
        id: 'lore-vault-transmission-excerpt',
        title: 'Vault of the Broken Signal — Recovered Transmission Excerpt',
        category: 'void-relays',
        content:
            `TRANSMISSION RECORD: VAULT NODE 7-B-DELTA
SENDER: UNREGISTERED RELAY FREQUENCY 7-9-P-VARIANT
CONTENT STATUS: PARTIAL DECODE — 73%

...inventory confirmation received...
...continue preparation...
...timing dependent on corridor clearance...
...human presence in approach zone flagged...
...recommend pause of overt activity until...
[DECODE FAILURE — 7 segments]
...arrival window calculated at...
...contingency protocols in place...
...this node continues to function within parameters...

END TRANSMISSION

ANALYST NOTE [Crow Veslin]: "Inventory confirmation." The Vault has been maintaining an inventory for something. Something that is coming.`,
        relatedEntries: ['lore-vanta-after-action-note'],
        tags: ['vault', 'transmission', 'mystery', 'phase-5', 'void-adjacent'],
    },
    {
        id: 'lore-aegis-internal-assessment',
        title: 'Aegis Division — Internal Assessment: Anomaly Pattern Status',
        category: 'faction',
        content:
            `OPERATIVE SABLE — Classified Distribution Only

Summary for field circulation only — do not forward to standard Aegis channels.

The comparison protocol running in the Orin's Crossing locked sector reached 97% completion twelve days before the Defense Prime unit was neutralized. The 3% gap is consistent across all six sites where similar protocols have been identified. My working assessment: the protocols are not comparing relay transit data to each other. They are comparing relay transit data to something else — a reference signal, a known pattern, a template we haven't identified.

The template is not from any human source in the Commonwealth registry.

The Vault of the Broken Signal adds a new data point: forty months of active correspondence between an unregistered sender and a facility that officially doesn't exist. Whatever this network is, it has been operational and undetected for years. It is not malfunctioning. It is not decaying. It is running according to a plan we do not have access to.

Recommended action: Ashveil extraction, full record recovery, cross-reference against Vault data. Recommended timeline: immediate.`,
        relatedEntries: ['lore-ashveil-final-crew-log', 'lore-vault-transmission-excerpt'],
        tags: ['aegis', 'internal', 'anomaly', 'pattern', 'phase-5', 'void-adjacent'],
    },
    {
        id: 'lore-frontier-compact-risk-briefing',
        title: 'Frontier Compact — Field Risk Briefing: Redline Operations',
        category: 'faction',
        content:
            `AGENT LEVA — Compact Field Operations

For operators considering Compact-sponsored Redline contracts:

The Compact does not issue Redline designations for bureaucratic reasons. A Redline contract means our intelligence assessment concluded that the site poses a realistic probability of operator fatality on any given run. We price accordingly. We do not minimize the risk in our briefings.

The Vault of the Broken Signal and the Ashveil Observation Post are both currently Redline-designated. The Vault because the Overseer unit has already destroyed two preliminary survey probes without leaving recoverable wreckage. Ashveil because the post was built by people who understood the risk and died anyway.

Field recommendations:
— Use the secure slot. Protect your most critical consumable.
— Purchase insurance if available. One extra item protected is the difference.
— Know your extraction route before you enter.
— The Compact will buy back recovered items at full value on successful extraction.

The frontier is bigger than the starter chapter suggested. Some jobs are truly dangerous. Go prepared.`,
        tags: ['frontier-compact', 'redline', 'field-briefing', 'phase-5'],
    },
    {
        id: 'lore-helion-synod-pattern-analysis',
        title: 'Helion Synod — Pattern Analysis Report #7',
        category: 'void-relays',
        content:
            `ARIS VEL — Field Research Lead

The void-resonance waveform documented at Coldframe Station-B, Void Relay 7-9, Kalindra Processing Hub, Ashveil Observation Post, and the Vault of the Broken Signal is the same waveform. Not similar. Identical within measurement tolerance.

The waveform predates any human infrastructure at any of these sites. At Void Relay 7-9, the relay was commissioned in Year 231. The waveform appears in the relay's oldest accessible telemetry — forty-one years before commissioning — in sensor logs from the approach buoys that were placed when the relay site was being assessed.

The waveform was there before we built anything to detect it.

The Synod board's current official position is that we are observing a natural phenomenon of cosmological origin that human infrastructure has been inadvertently resonating with. This is a defensible scientific position.

My personal position, which I am filing separately from the official report, is that the waveform has been getting louder for approximately four years and that the timing correlates precisely with the relay network failure.

I do not believe the relay network failed. I believe it was interrupted.`,
        relatedEntries: ['lore-ashveil-final-crew-log', 'lore-void-covenant-relay-fragment'],
        tags: ['helion-synod', 'pattern', 'anomaly', 'mystery', 'phase-5', 'void-adjacent'],
    },
    {
        id: 'lore-sol-union-suppressed-report',
        title: "Sol Union Directorate — Suppressed Transit Report: Orin's Crossing",
        category: 'faction',
        content:
            `COMMANDER DRESH — Transit Anomaly File (Internal)
Filed: Fourteen months prior — restricted

This report was not forwarded to Sol Union command. I am filing it in the local record because the alternative is destroying it, and I have decided I am not willing to destroy it.

Transit anomaly count at Orin's Crossing: 52 documented events over 18 months. My official report to command listed 12. The other 40 were removed on instructions I received through an encrypted channel that does not appear in the station's communication logs.

The instruction source identified itself as a Sol Union authority code. I have run that code against the full Sol Union registry four times. It does not exist in the registry. It has never existed in the registry. The instruction was authenticated with cryptographic credentials that are correct.

I do not know who instructed me to suppress those anomaly reports. I know that whoever it was has access to authentication systems I did not know existed.`,
        relatedEntries: ['lore-aegis-internal-assessment'],
        tags: ['sol-union', 'dresh', 'suppressed', 'anomaly', 'mystery', 'phase-5'],
    },
    {
        id: 'lore-vanta-after-action-note',
        title: 'Vanta Corsairs — After-Action Note: Vault Survey Outcome',
        category: 'locations',
        content:
            `CROW VESLIN — Informal Distribution

Note for anyone Crow sends into the Vault after this:

The Overseer stopped broadcasting the moment an approach vessel appeared on its sensors. It's been broadcasting for forty months. It stopped in under four seconds. That's not a coincidence and it's not a fault response.

The unit has been sending outgoing messages on the same unregistered frequency the Vault receives from. Not just receiving — answering. Whatever it's been talking to, it didn't want us to listen to the conversation.

My buyer has a theory about what's on the other end of that frequency. I'm not repeating the theory here because I'm not prepared to believe it yet. I'll believe it if the extraction team comes back with the coordination node and the log confirms what the buyer expects.

Go prepared. Crow does not say that to every crew.`,
        relatedEntries: ['lore-vault-transmission-excerpt'],
        tags: ['vanta', 'vault', 'crow', 'field-log', 'mystery', 'phase-5'],
    },
    {
        id: 'lore-void-covenant-relay-fragment',
        title: 'Void Covenant — Internal Fragment: "The Signal Is An Answer"',
        category: 'void-relays',
        content:
            `KESTREL VIN — Covenant inner correspondence (intercepted fragment)

What you are calling an anomaly, we have been calling a message.

The relay network was not built to transmit between human settlements. It was built on top of something that was already transmitting between places that do not appear on human maps. When the relay network "failed," it did not fail. It was quieted. The background signal became audible for the first time in decades because the human traffic stopped covering it.

The signal is an answer. The question was asked a very long time ago. We are, as far as I can determine, the question being asked.`,
        relatedEntries: ['lore-helion-synod-pattern-analysis', 'lore-ashveil-final-crew-log'],
        tags: ['void-covenant', 'kestrel', 'mystery', 'cosmic', 'phase-5', 'void-adjacent'],
    },
];
