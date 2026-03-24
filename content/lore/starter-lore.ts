import { LoreEntry } from '../../shared/types/lore';

export const starterLore: LoreEntry[] = [
    {
        id: 'history-meridian-decline',
        title: 'The Decline of Meridian Station',
        category: 'history',
        content: `Meridian Station was constructed over a century ago as an expansion platform for deep-belt resource extraction. For its first few decades, it was a premier transfer hub — the last major stop before the Void Relay network carried cargo and passengers to core systems.

That changed when Relay Seven-Nine and then Relay Fourteen went dark within three years of each other. The exact cause is still classified at levels that no one on Meridian can reach. Official explanations ranged from structural fatigue to unspecified "resonance events."

Traffic dropped sixty percent within eighteen months. The major shipping guilds rerouted. Corporate extraction operations consolidated elsewhere. Meridian survived because the people who depended on it had nowhere else to go — drifters, independent contractors, the permanently in-transit. It became a hub by default for the frontier's leftovers.

Dockmaster Osei has been filing budget requests to the Interstellar Transit Authority for nine years. She has received four automated replies.`,
        relatedEntries: ['lore-void-relays-overview'],
        tags: ['meridian', 'history', 'decline', 'void-relays'],
    },
    {
        id: 'lore-void-relays-overview',
        title: 'Void Relays — Overview',
        category: 'void-relays',
        content: `Void Relays are large-scale jump infrastructure: fixed installations that allow ships to traverse distances that would otherwise require months of conventional travel. They were constructed during a period of rapid expansion several centuries ago, using techniques that are partially understood and partially documented.

No new Void Relays have been built in living memory. Maintenance is ongoing but poorly funded. Several Relays have gone offline in the last two decades with causes that range from mundane (structural failure, fuel depletion) to officially classified.

What is not widely discussed: Relay sites that go dark do not always go quiet. Survey teams occasionally report anomalous readings from inactive Relay infrastructure. These reports are routinely de-prioritized.

The Void Covenant is known to study Relay sites. They are not known to share their findings.`,
        relatedEntries: ['history-meridian-decline', 'lore-void-covenant'],
        tags: ['void-relays', 'technology', 'infrastructure', 'mystery'],
    },
    {
        id: 'lore-ashwake-history',
        title: 'Ashwake Belt — Early Settlement',
        category: 'locations',
        content: `The Ashwake Belt was first surveyed and designated for extraction work approximately eighty years ago. Early settlement followed the standard pattern: corporate extraction teams, portable habitats, automated infrastructure, and a workforce that was paid well to endure conditions most people would not.

The Belt's output peaked about forty years ago. Since then, declining ore quality, automation disputes, and the collapse of Meridian's relay access have steadily reduced operations. Most of the large corporate rigs are now either abandoned or running skeleton crews.

What remains is independent operators: small crews, family rigs, people who bought their equipment secondhand and made their claim work through stubbornness. The Extraction Guild represents them, loosely.

The Belt has a reputation for weird accidents. The Guild investigates as a rule. Most investigations conclude with "equipment failure" and a tight-lipped filing. A smaller number conclude with no filing at all.`,
        relatedEntries: ['lore-rogue-automation'],
        tags: ['ashwake', 'history', 'locations', 'mining'],
    },
    {
        id: 'lore-rogue-automation',
        title: 'Rogue Automation in the Ashwake Belt',
        category: 'technology',
        content: `Automated mining equipment is designed to shut down when contact with its control systems is lost. This is a safety standard dating back to the earliest extraction operations, and it is specified in every equipment contract and maintenance protocol.

In the Ashwake Belt, this has not always been what happens.

Guild records — the public ones — show fourteen incidents over the last six years in which automated equipment resumed active operation after prolonged shutdown periods without any detectable restart signal. In twelve of these cases, the equipment was eventually stopped. In two cases, the platforms were simply written off.

The unofficial count, according to people who work the Belt, is higher.

Engineers who have inspected the rogue systems describe the same thing: modified low-level operating states that should not be possible with factory firmware. Something is rewriting the automation at a fundamental level. Nobody has formally identified the source.`,
        relatedEntries: ['lore-ashwake-history', 'lore-void-relays-overview'],
        tags: ['automation', 'mystery', 'ashwake', 'technology', 'void-adjacent'],
    },
    {
        id: 'lore-void-covenant',
        title: 'The Void Covenant',
        category: 'faction',
        content: `The Void Covenant is categorized as a fringe organization by most official bodies, with classifications ranging from "academic research group" to "unregistered religious organization" depending on the jurisdiction.

What is documented: they study Void Relay sites, they collect artifacts associated with Relay infrastructure and anomalous events, and they recruit members with high psionic sensitivity. They pay well, ask unusual questions, and maintain a posture of complete institutional deniability.

What is rumored: they have been operating in some form for longer than the official Relay network itself. They have access to pre-survey documents about Relay sites that no one else has seen. Several members have died under circumstances officially attributed to "psi exposure events."

On Meridian Station, their presence is small, careful, and noticed only by people who know what to look for.`,
        unlockedBy: 'reputation.meridian-dock-authority >= 5',
        relatedEntries: ['lore-void-relays-overview'],
        tags: ['faction', 'void-covenant', 'psionics', 'mystery', 'cosmic-horror'],
    },
];
