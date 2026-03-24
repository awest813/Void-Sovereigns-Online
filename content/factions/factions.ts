import { Faction } from '../../shared/types/faction';

export const factions: Faction[] = [
    {
        id: 'meridian-dock-authority',
        name: 'Meridian Dock Authority',
        description:
            'The bureaucratic body that manages docking rights, port fees, and station law on Meridian Station. ' +
            'Underfunded, understaffed, and perpetually behind on maintenance contracts. ' +
            'They still enforce the rules — just not always the same ones twice.',
        homeStation: 'meridian-station',
        defaultStanding: 'neutral',
        tags: ['station', 'law', 'bureaucracy', 'meridian'],
        reputationThresholds: [
            { minRep: -50, label: 'Flagged', shortLabel: 'Flagged', unlocks: [] },
            { minRep: 0,   label: 'Neutral', shortLabel: 'Neutral', unlocks: [] },
            { minRep: 25,  label: 'Registered', shortLabel: 'Reg.', unlocks: ['Standard contract access'] },
            { minRep: 60,  label: 'On Record', shortLabel: 'On Record', unlocks: ['Dockmaster priority slots', 'Extended freight permits'] },
            { minRep: 120, label: 'Certified Operator', shortLabel: 'Certified', unlocks: ['Restricted bay access', 'Authority endorsement letters'] },
        ],
    },
    {
        id: 'ashwake-extraction-guild',
        name: 'Ashwake Extraction Guild',
        description:
            'A loose collective of independent miners, salvagers, and rig crews operating in the Ashwake Belt. ' +
            'No central leadership, but strong mutual loyalty among dues-paying members. ' +
            'Distrustful of outsiders until they have proven useful.',
        homeStation: 'meridian-station',
        defaultStanding: 'neutral',
        tags: ['mining', 'salvage', 'independent', 'ashwake'],
        reputationThresholds: [
            { minRep: 0,   label: 'Outsider',    shortLabel: 'Outsider', unlocks: [] },
            { minRep: 20,  label: 'Known Hand',   shortLabel: 'Known', unlocks: ['Guild salvage tips', 'Belt contract access'] },
            { minRep: 60,  label: 'Guild Contact', shortLabel: 'Contact', unlocks: ['Halvek Dross salvage bounties', 'Gear at cost'] },
            { minRep: 120, label: 'Dues Member',   shortLabel: 'Member', unlocks: ['Priority salvage certifications', 'Guild rate repairs'] },
        ],
    },
    {
        id: 'void-covenant',
        name: 'The Void Covenant',
        description:
            'A secretive organization that studies — and some say worships — Void Relay phenomena and the relics left behind. ' +
            'Officially dismissed as a fringe cult by station authorities. ' +
            'Their presence on Meridian is unofficial, deniable, and growing.',
        defaultStanding: 'neutral',
        tags: ['psi', 'cult', 'void-relays', 'secretive', 'cosmic-horror'],
        reputationThresholds: [
            { minRep: 0,   label: 'Uninitiated',  shortLabel: 'None', unlocks: [] },
            { minRep: 20,  label: 'Observed',      shortLabel: 'Obs.', unlocks: ['Covenant data requests', 'Anomaly trace leads'] },
            { minRep: 60,  label: 'Trusted Lens',  shortLabel: 'Trusted', unlocks: ['Kestrel Vin advanced dialogue', 'Restricted relic data'] },
            { minRep: 120, label: 'Inner Circle',  shortLabel: 'Inner', unlocks: ['Covenant relic access', 'Classified site coordinates'] },
        ],
    },
    {
        id: 'free-transit-compact',
        name: 'Free Transit Compact',
        description:
            'A loose hauler and courier guild operating across the frontier. ' +
            'They negotiate fuel prices, route protection, and transit rights. ' +
            'On Meridian they run the last reliable freight desk.',
        homeStation: 'meridian-station',
        defaultStanding: 'friendly',
        tags: ['hauler', 'courier', 'trade', 'frontier'],
        reputationThresholds: [
            { minRep: 0,   label: 'Acquaintance',  shortLabel: 'Acquaint.', unlocks: [] },
            { minRep: 30,  label: 'Regular',        shortLabel: 'Regular', unlocks: ['Preferred freight rates', 'Route tips'] },
            { minRep: 80,  label: 'Compact Partner', shortLabel: 'Partner', unlocks: ['Co-delivery bonuses', 'Station relay usage'] },
        ],
    },
    {
        id: 'interstellar-commonwealth-authority',
        name: 'Interstellar Commonwealth Authority',
        shortName: 'ICA',
        description:
            'The administrative and regulatory arm of the Interstellar Commonwealth — ' +
            'the broad governing body that technically covers most inhabited space. ' +
            'The ICA manages relay licensing, freight certification, and inter-station law. ' +
            'In practice, their reach depends entirely on relay access. ' +
            'When the relay network failed, the ICA\'s presence in the outer sectors collapsed with it. ' +
            'Now that Relay 7-9 is back, they are watching closely — ' +
            'and their agenda may not align with Meridian\'s survival.',
        defaultStanding: 'neutral',
        tags: ['government', 'law', 'relay', 'official', 'state', 'phase-3'],
        reputationThresholds: [
            { minRep: -50, label: 'Person of Interest', shortLabel: 'Flagged', unlocks: [] },
            { minRep: 0,   label: 'Civilian',            shortLabel: 'Civilian', unlocks: [] },
            { minRep: 25,  label: 'Licensed Operator',   shortLabel: 'Licensed', unlocks: ['ICA relay permits', 'Assessment contracts'] },
            { minRep: 70,  label: 'Field Asset',          shortLabel: 'Asset', unlocks: ['ICA intelligence sharing', 'Protected transit routes'] },
            { minRep: 140, label: 'Commonwealth Affiliate', shortLabel: 'Affiliate', unlocks: ['Classified transit data', 'ICA escort priority'] },
        ],
    },

    // ── Phase 4 factions ──────────────────────────────────────────────────

    {
        id: 'frontier-compact',
        name: 'Frontier Compact',
        shortName: 'Compact',
        description:
            'A decentralized coalition of frontier operators — independent haulers, station crews, colony administrators, ' +
            'and salvage teams who depend on reliable routes between unincorporated systems. ' +
            'The Compact does not enforce law; it negotiates access, protects routes, and funds joint operations. ' +
            'It is the closest thing to a government most frontier settlers will ever deal with. ' +
            'Their central board operates out of Farpoint Waystation — the first major transit hub beyond Relay 7-9.',
        homeStation: 'farpoint-waystation',
        defaultStanding: 'neutral',
        tags: ['frontier', 'trade', 'coalition', 'independent', 'phase-4'],
        reputationThresholds: [
            { minRep: 0,   label: 'Transient',      shortLabel: 'Transient', unlocks: [] },
            { minRep: 25,  label: 'Registered',      shortLabel: 'Reg.', unlocks: ['Compact contract board access', 'Farpoint fueling priority'] },
            { minRep: 60,  label: 'Route Partner',   shortLabel: 'Partner', unlocks: ['Frontier Compact supply caches', 'Leva\'s advanced contracts'] },
            { minRep: 120, label: 'Compact Operative', shortLabel: 'Operative', unlocks: ['Compact-grade ship components', 'Restricted route access', 'Redline escort contracts'] },
        ],
    },
    {
        id: 'sol-union-directorate',
        name: 'Sol Union Directorate',
        shortName: 'Sol Union',
        description:
            'The enforcement arm of the Sol Union — a parallel governing authority that disputes Commonwealth jurisdiction ' +
            'over several contested frontier regions, including the Orin\'s Crossing transit zone. ' +
            'Where the ICA manages paperwork, the Sol Union enforces outcomes. ' +
            'They maintain military-grade inspection vessels at key transit checkpoints, ' +
            'classify entire sectors without notice, and operate under a charter that pre-dates the Commonwealth. ' +
            'Their stated mission is stability. Their actual priorities are less clear.',
        defaultStanding: 'neutral',
        tags: ['military', 'enforcement', 'state', 'frontier', 'contested', 'phase-4'],
        reputationThresholds: [
            { minRep: -50, label: 'Watched', shortLabel: 'Watched', unlocks: [] },
            { minRep: 0,   label: 'Civilian', shortLabel: 'Civilian', unlocks: [] },
            { minRep: 30,  label: 'Compliant Operator', shortLabel: 'Compliant', unlocks: ['Sol Union inspection waiver', 'Orin\'s Crossing standard access'] },
            { minRep: 75,  label: 'Field Contractor',   shortLabel: 'Contractor', unlocks: ['Sol Union enforcement contracts', 'Commander Dresh advanced tasks'] },
            { minRep: 150, label: 'Union-Aligned Operator', shortLabel: 'Aligned', unlocks: ['Classified sector access', 'Sol Union armament surplus'] },
        ],
    },
    {
        id: 'aegis-division',
        name: 'Aegis Division',
        shortName: 'Aegis',
        description:
            'A recovery and intelligence organization whose official mandate is the retrieval of Commonwealth assets from ' +
            'abandoned or compromised installations. In practice, Aegis investigates things that other agencies prefer not to find. ' +
            'They operate with unusual clearance levels, minimal oversight, and a habit of classifying their own mission reports. ' +
            'Operative Sable is the only confirmed Aegis contact on Meridian — and she will not confirm it. ' +
            'What they know about the anomaly patterns is not public. ' +
            'What they are not saying is more interesting than what they are.',
        defaultStanding: 'neutral',
        tags: ['intelligence', 'recovery', 'secretive', 'anomaly', 'gray-area', 'phase-4'],
        reputationThresholds: [
            { minRep: 0,   label: 'Unvetted',      shortLabel: 'Unvetted', unlocks: [] },
            { minRep: 20,  label: 'Noticed',        shortLabel: 'Noticed', unlocks: ['Aegis sealed-site access', 'Sable preliminary dialogue'] },
            { minRep: 60,  label: 'Field Contact',  shortLabel: 'Contact', unlocks: ['Aegis recovery contracts', 'Anomaly trace briefings'] },
            { minRep: 120, label: 'Cleared Asset',  shortLabel: 'Cleared', unlocks: ['Restricted anomaly site access', 'Aegis data cores', 'Sealed sector permits'] },
        ],
    },
    {
        id: 'vanta-corsairs',
        name: 'Vanta Corsairs',
        shortName: 'Vanta',
        description:
            'Not pirates — or so they say. The Vanta Corsairs are a loose network of independent salvagers, gray-market brokers, ' +
            'and off-book freight operators who work the frontier edges that official routes do not cover. ' +
            'They do not take passengers, do not file manifests, and do not exist on any Commonwealth registry. ' +
            'Their contact in the Meridian docking ring goes by Crow. ' +
            'Whatever you bring out of a sealed zone, Crow can move it. ' +
            'The question is what it costs you later.',
        defaultStanding: 'neutral',
        tags: ['gray-market', 'salvage', 'black-market', 'independent', 'frontier', 'phase-4'],
        reputationThresholds: [
            { minRep: 0,   label: 'Unknown',      shortLabel: 'Unknown', unlocks: [] },
            { minRep: 15,  label: 'On the List',   shortLabel: 'Listed', unlocks: ['Crow off-book contracts', 'Gray-market salvage rates'] },
            { minRep: 50,  label: 'Reliable Hand', shortLabel: 'Reliable', unlocks: ['Premium contraband rates', 'Off-map transit tips'] },
            { minRep: 100, label: 'Corsair-Vouched', shortLabel: 'Vouched', unlocks: ['Restricted Vanta supply cache', 'Black-market ship modules'] },
        ],
    },

    // ── Phase 5 factions ──────────────────────────────────────────────────

    {
        id: 'helion-synod',
        name: 'Helion Synod',
        shortName: 'Synod',
        description:
            'A research and documentation organization that studies void relay phenomena, relic sites, and anomaly activity. ' +
            'The Synod began as an academic body and has become something harder to categorize. ' +
            'Its membership is divided between those who believe the anomaly pattern is a natural phenomenon ' +
            'and those who believe it is not natural at all. ' +
            'Both factions agree that more data is needed. They disagree, sometimes violently, about how to get it. ' +
            'Field researcher Aris Vel represents the Synod in the frontier zone — ' +
            'cautious enough to survive, curious enough to keep going back.',
        defaultStanding: 'neutral',
        tags: ['research', 'anomaly', 'relic', 'frontier', 'divided', 'phase-5'],
        reputationThresholds: [
            { minRep: 0,   label: 'Unregistered', shortLabel: 'None', unlocks: [] },
            { minRep: 20,  label: 'Field Contact', shortLabel: 'Contact', unlocks: ['Synod data requests', 'Aris Vel introduction'] },
            { minRep: 55,  label: 'Research Asset', shortLabel: 'Asset', unlocks: ['Anomaly sample contracts', 'Synod field kit access'] },
            { minRep: 110, label: 'Inner Lens',     shortLabel: 'Inner', unlocks: ['Classified anomaly site data', 'Void resonance equipment'] },
        ],
    },
];
