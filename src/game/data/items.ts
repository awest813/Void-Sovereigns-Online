// Item catalog — consumables, salvage, ammo, and key items.

export interface ItemDef {
    id: string;
    name: string;
    type: 'consumable' | 'salvage' | 'ammo' | 'key';
    value: number;
    description: string;
    effect?: {
        healPilot?: number;
        healShip?: number;
        /** Regenerate this many pilot HP per turn for regenTurns turns. */
        regenPilot?: number;
        regenTurns?: number;
        /** Multiply the player's attack output by (1 + boostAttack) for boostTurns turns. */
        boostAttack?: number;
        boostTurns?: number;
    };
}

export const ITEMS: Record<string, ItemDef> = {
    'medical-kit': {
        id: 'medical-kit',
        name: 'Medical Kit',
        type: 'consumable',
        value: 30,
        description: 'Standard emergency trauma kit. Restores 35 pilot HP.',
        effect: { healPilot: 35 },
    },
    'repair-kit': {
        id: 'repair-kit',
        name: 'Repair Kit',
        type: 'consumable',
        value: 40,
        description: 'Patch compound and micro-welders for field hull repairs. Restores 30 ship HP.',
        effect: { healShip: 30 },
    },
    'scrap-metal': {
        id: 'scrap-metal',
        name: 'Scrap Metal',
        type: 'salvage',
        value: 15,
        description: 'Processed alloy fragments. Low-grade but sellable.',
    },
    'power-cell': {
        id: 'power-cell',
        name: 'Power Cell',
        type: 'salvage',
        value: 45,
        description: 'Intact industrial-grade power cell. Still holds charge.',
    },
    'drill-component': {
        id: 'drill-component',
        name: 'Drill Component',
        type: 'salvage',
        value: 35,
        description: 'Salvaged mining drill mechanism. Useful for equipment traders.',
    },
    'drone-scrap-parts': {
        id: 'drone-scrap-parts',
        name: 'Drone Scrap Parts',
        type: 'salvage',
        value: 25,
        description: 'Wreckage from a rogue mining drone. Partially functional circuits and chassis plating.',
    },
    'control-module': {
        id: 'control-module',
        name: 'Control Module',
        type: 'key',
        value: 80,
        description: 'Central command core recovered from a rogue drone. Proof of destruction for Guild contracts.',
    },
    'salvage-crate-standard': {
        id: 'salvage-crate-standard',
        name: 'Salvage Crate',
        type: 'salvage',
        value: 60,
        description: 'A sealed cargo crate from an abandoned dig site. Contents unverified.',
    },
    'survey-kit-damaged': {
        id: 'survey-kit-damaged',
        name: 'Survey Kit (Damaged)',
        type: 'key',
        value: 50,
        description: 'A Guild-issue survey instrument. Battered but the data core is intact.',
    },
    'std-9mm': {
        id: 'std-9mm',
        name: 'Ammo: 9mm Standard',
        type: 'ammo',
        value: 8,
        description: 'Standard-issue 9mm rounds. Common and reliable.',
    },

    // ── Phase 2 items ─────────────────────────────────────────────────────

    'pressure-valve': {
        id: 'pressure-valve',
        name: 'Pressure Valve',
        type: 'salvage',
        value: 20,
        description: 'A pressurized valve housing salvaged from a Coldframe unit. Useful to mechanics and equipment traders.',
    },
    'cryo-component': {
        id: 'cryo-component',
        name: 'Cryo Component',
        type: 'salvage',
        value: 55,
        description: 'An intact cryo-storage module from Coldframe Station-B. Nera Quill will pay well for these.',
    },
    'cryo-component-x2': {
        id: 'cryo-component-x2',
        name: 'Cryo Component Set',
        type: 'salvage',
        value: 110,
        description: 'Two intact cryo modules bundled for transport. Torrek Voss would want these back.',
    },
    'black-box-fragment': {
        id: 'black-box-fragment',
        name: 'Black Box Fragment',
        type: 'key',
        value: 120,
        description:
            'A partially corrupted flight data recorder recovered from Coldframe Station-B\'s Controller Alpha. ' +
            'The last 90 minutes of sensor logs are intact. The content is — unusual. ' +
            'Tamsin Vale will want to see this.',
    },
    'corrupted-maintenance-log': {
        id: 'corrupted-maintenance-log',
        name: 'Corrupted Maintenance Log',
        type: 'key',
        value: 40,
        description:
            'A hardcopy maintenance sheet from the Coldframe operations bay. ' +
            'Most of the entries are routine. The final entry is dated six weeks ago and reads: ' +
            '"UNIT RESTART ORIGIN: EXTERNAL QUERY. SOURCE: UNKNOWN RELAY NODE."',
    },
    'relay-static-archive': {
        id: 'relay-static-archive',
        name: 'Relay Static Archive',
        type: 'key',
        value: 80,
        description:
            'A data chip from Brother Caldus\'s archives. Contains partial recordings of unexplained transmission ' +
            'activity from Void Relay 7-9 across the past six months. Some windows match known dates. ' +
            'Others do not correspond to anything on record.',
    },
    'nav-chart-outer-belt': {
        id: 'nav-chart-outer-belt',
        name: 'Nav Chart: Outer Belt',
        type: 'key',
        value: 60,
        description: 'A navigational chart covering Ashwake Belt\'s outer grid sectors. Useful for longer-range runs.',
    },

    // ── Phase 3 items ─────────────────────────────────────────────────────

    'signal-fragment': {
        id: 'signal-fragment',
        name: 'Signal Fragment',
        type: 'salvage',
        value: 80,
        description: 'A physical component of a relay signal array — partially fused, partially crystallized. ' +
            'The Void Covenant pays well for these. The ICA wants to know where they came from.',
    },
    'relay-data-core': {
        id: 'relay-data-core',
        name: 'Relay Data Core',
        type: 'key',
        value: 150,
        description: 'The primary data storage node from Void Relay 7-9\'s archive. ' +
            'Contains transit records, sensor logs, and encrypted timestamps that should not exist.',
    },
    'anomaly-trace-log': {
        id: 'anomaly-trace-log',
        name: 'Anomaly Trace Log',
        type: 'key',
        value: 120,
        description: 'A compiled sensor record of anomalous signal activity — multiple site sources, ' +
            'impossible timestamps, repeating waveform signatures that do not match any known protocol.',
    },
    'void-pattern-record': {
        id: 'void-pattern-record',
        name: 'Void Pattern Record',
        type: 'key',
        value: 200,
        description: 'A detailed waveform analysis record recovered from an automated system that ' +
            'should not have been able to produce it. The pattern is consistent across every site. ' +
            'What it means is not written down anywhere.',
    },
    'farpoint-cargo-bundle': {
        id: 'farpoint-cargo-bundle',
        name: 'Farpoint Cargo Bundle',
        type: 'salvage',
        value: 75,
        description: 'A bundle of miscellaneous cargo from Farpoint Waystation\'s unclaimed freight holds. ' +
            'Mixed contents — some tradeable, some unidentifiable.',
    },
    'farpoint-access-chip': {
        id: 'farpoint-access-chip',
        name: 'Farpoint Access Chip',
        type: 'key',
        value: 100,
        description: 'An access authorization chip recovered from Farpoint\'s security prime coordinator. ' +
            'Still active. Unlocks several sealed bays in the outer ring.',
    },

    // ── Phase 4 items ─────────────────────────────────────────────────────

    'kalindra-nav-fragment': {
        id: 'kalindra-nav-fragment',
        name: 'Kalindra Nav Fragment',
        type: 'salvage',
        value: 90,
        description: 'A navigational data chip recovered from Kalindra Processing Hub. ' +
            'Contains the hub\'s local routing tables — including approach vectors the official charts do not show.',
    },
    'kalindra-signal-archive': {
        id: 'kalindra-signal-archive',
        name: 'Kalindra Signal Archive',
        type: 'key',
        value: 220,
        description: 'The signal relay room\'s primary archive node. ' +
            'Contains incoming transmission records from a source that is not on any registered frequency. ' +
            'The record count covers a period when the relay network was officially down.',
    },
    'aegis-field-log': {
        id: 'aegis-field-log',
        name: 'Aegis Field Log',
        type: 'key',
        value: 180,
        description: 'The final log upload from Operative Sable\'s missing survey team. ' +
            'The last entry cuts off mid-sentence. What comes before it is carefully worded — ' +
            'the kind of language a trained operative uses when trying not to sound afraid.',
    },
    'transit-anomaly-log': {
        id: 'transit-anomaly-log',
        name: 'Transit Anomaly Log',
        type: 'key',
        value: 160,
        description: 'Raw sensor data from the Orin\'s Crossing transit corridor arrays. ' +
            'Twelve documented anomalous transit events — plus at least forty more that were never forwarded ' +
            'to Sol Union command.',
    },
    'crossing-classified-data': {
        id: 'crossing-classified-data',
        name: 'Crossing Classified Data',
        type: 'key',
        value: 200,
        description: 'A data container recovered from the locked sector of Orin\'s Crossing. ' +
            'Classification prefix does not appear in any index. The seal is recent. ' +
            'Whatever is inside, someone updated the access restrictions four days ago.',
    },

    // ── Phase 5 items ─────────────────────────────────────────────────────

    'void-fragment-sample': {
        id: 'void-fragment-sample',
        name: 'Void Fragment Sample',
        type: 'key',
        value: 280,
        description: 'A physical sample of material recovered from the Ashveil Observation Post. ' +
            'The sample reads as standard alloy on most scanners. ' +
            'On a void-resonance scanner it reads as something that should not be here. ' +
            'The Helion Synod will not discuss how they know the difference.',
    },
    'broken-signal-core': {
        id: 'broken-signal-core',
        name: 'Broken Signal Core',
        type: 'key',
        value: 240,
        description: 'The primary coordination node from the Vault of the Broken Signal. ' +
            'It was transmitting when you found it. It stopped the moment it registered your presence. ' +
            'Whatever it was transmitting to was listening.',
    },
    'ashveil-observation-log': {
        id: 'ashveil-observation-log',
        name: 'Ashveil Observation Log',
        type: 'key',
        value: 320,
        description: 'The complete observation record from Ashveil Post\'s monitoring equipment — ' +
            'twenty-three months of uninterrupted void relay telemetry, collected long after the crew stopped being alive to collect it. ' +
            'The final 400 entries were recorded by the building itself.',
    },
    'vault-encoded-manifest': {
        id: 'vault-encoded-manifest',
        name: 'Vault Encoded Manifest',
        type: 'key',
        value: 190,
        description: 'An encrypted cargo manifest from the Vault of the Broken Signal. ' +
            'The encryption is standard-grade — but the cargo descriptions are not. ' +
            'Crow Veslin will know what to do with this.',
    },
    'restricted-nav-module': {
        id: 'restricted-nav-module',
        name: 'Restricted Nav Module',
        type: 'key',
        value: 350,
        description: 'A navigational processing module rated for deep-relay transit. ' +
            'Frontier Compact certification stamp on the casing — but it predates the Compact by fifteen years. ' +
            'Whatever ship this came from was going somewhere the maps do not show.',
    },
    'helion-research-data': {
        id: 'helion-research-data',
        name: 'Helion Research Data',
        type: 'key',
        value: 220,
        description: 'A compiled data packet from the Helion Synod\'s field research program. ' +
            'Aris Vel calls it "preliminary findings." The attached void-resonance readings suggest ' +
            'the Synod has been monitoring something with a consistency that implies they knew what to look for.',
    },
    'contraband-relay-module': {
        id: 'contraband-relay-module',
        name: 'Contraband Relay Module',
        type: 'salvage',
        value: 180,
        description: 'A signal relay component with registry markings that have been deliberately obscured. ' +
            'Functional, high-grade, and technically illegal to possess without a transit waiver. ' +
            'The Vanta Corsairs have buyers who do not ask about the waivers.',
    },
    'anomaly-field-kit': {
        id: 'anomaly-field-kit',
        name: 'Anomaly Field Kit',
        type: 'consumable',
        value: 90,
        description: 'An advanced composite trauma and environmental kit rated for void-adjacent field conditions. ' +
            'Treats standard injuries plus void-exposure symptoms. Restores 50 pilot HP. ' +
            'The integrated signal disruptor suppresses enemy targeting for one turn — no counter-attack.',
        effect: { healPilot: 50 },
    },
    'nano-repair-kit': {
        id: 'nano-repair-kit',
        name: 'Nano-Repair Kit',
        type: 'consumable',
        value: 55,
        description: 'A canister of autonomous repair nano-bots. Injected mid-combat, they work over several turns ' +
            'rather than providing instant healing. Regenerates 10 pilot HP per turn for 3 turns.',
        effect: { regenPilot: 10, regenTurns: 3 },
    },
    'combat-stim': {
        id: 'combat-stim',
        name: 'Combat Stimulant',
        type: 'consumable',
        value: 65,
        description: 'A military-grade neuro-stimulant that sharpens reflexes and amplifies strike force. ' +
            'Boosts all attack output by 50% for 2 turns. Heavy crash afterward — handle with caution.',
        effect: { boostAttack: 0.5, boostTurns: 2 },
    },

    // ── Phase 6 items ─────────────────────────────────────────────────────

    'transit-key-fragment': {
        id: 'transit-key-fragment',
        name: 'Transit Key Fragment',
        type: 'key',
        value: 175,
        description: 'A credential fragment recovered from a Transit Node Zero patrol unit. ' +
            'The format is four hundred years obsolete — but the facility still reads it. ' +
            'Grants access to sealed internal chambers.',
    },
    'null-archive-data': {
        id: 'null-archive-data',
        name: 'Null Archive Data',
        type: 'key',
        value: 420,
        description: 'A data extract from Transit Node Zero\'s archive chamber. ' +
            'The compression format is not in any known standard. ' +
            'The Void Covenant and ICA both want this. ' +
            'They have different reasons.',
    },
    // ── Phase 7 items ─────────────────────────────────────────────────────
    'psi-lattice-sample': {
        id: 'psi-lattice-sample',
        name: 'Psi Lattice Sample',
        type: 'key',
        value: 360,
        description: 'A synod-tagged lattice sample recovered from Ashveil Deep. ' +
            'Its harmonic profile changes under direct observation.',
    },
    'deepfrontier-core-signature': {
        id: 'deepfrontier-core-signature',
        name: 'Deepfrontier Core Signature',
        type: 'key',
        value: 520,
        description: 'A compressed core-signature record extracted from the Ashveil Deep core array. ' +
            'Aegis, Synod, and ICA all classify this as priority material.',
    },
    'null-lattice-segment': {
        id: 'null-lattice-segment',
        name: 'Null Lattice Segment',
        type: 'key',
        value: 500,
        description: 'A structured lattice shard carrying non-linear transit indexing data from deep frontier systems.',
    },

    // ── Phase 8 items ─────────────────────────────────────────────────────

    'warden-core-extract': {
        id: 'warden-core-extract',
        name: 'Warden Core Extract',
        type: 'key',
        value: 700,
        description: 'The extracted core processing unit from the Index Chamber Warden. ' +
            'It continued running diagnostic cycles for six minutes after the housing was destroyed. ' +
            'The ICA classifies the architecture as belonging to no known construction lineage.',
    },
    'index-cycle-fragment': {
        id: 'index-cycle-fragment',
        name: 'Index Cycle Fragment',
        type: 'key',
        value: 480,
        description: 'A data shard recovered from the Index Chamber annex racks. ' +
            'Its classification timestamp predates the Chamber\'s construction by four hundred years. ' +
            'The ICA wants this flagged as priority material. The Covenant disagrees about what it means.',
    },
    'architect-response-record': {
        id: 'architect-response-record',
        name: 'Architect Response Record',
        type: 'key',
        value: 560,
        description: 'A direct-response log from the Null Architect — formatted as a reply to a query ' +
            'that was never logged in the Chamber\'s intake records. ' +
            'Whatever prompted this response, the Architect answered it. The question is not here.',
    },
    'index-access-token': {
        id: 'index-access-token',
        name: 'Index Access Token',
        type: 'key',
        value: 420,
        description: 'A credential token recovered from the Index Chamber annex. ' +
            'It does not match any known authorization format, but every sealed door in the facility reads it without hesitation. ' +
            'Aegis will pay well to understand how.',
    },

    // ── Phase 9 items ─────────────────────────────────────────────────────

    'cycle-record-fragment': {
        id: 'cycle-record-fragment',
        name: 'Cycle Record Fragment',
        type: 'key',
        value: 520,
        description: 'A partial record extracted from the Cycle Archive annex racks. ' +
            'The entry classification reads RESOLVED — VOID SOVEREIGN. ' +
            'The civilization it describes does not appear anywhere in the ICA historical index.',
    },
    'archive-classification-core': {
        id: 'archive-classification-core',
        name: 'Archive Classification Core',
        type: 'key',
        value: 640,
        description: 'The indexing core for a completed cycle classification. ' +
            'It contains the Null Architect\'s complete evaluation criteria for forty-one civilizations. ' +
            'What distinguishes a Void Sovereign from an ENFORCEMENT TERMINAL outcome is written here, plainly. ' +
            'It is not what the factions have theorized.',
    },
    'cycle-terminal-record': {
        id: 'cycle-terminal-record',
        name: 'Cycle Terminal Record',
        type: 'key',
        value: 580,
        description: 'A terminal-state record from a closed cycle. ' +
            'The final classification notation reads ENFORCEMENT TERMINAL — SELF-DIRECTED. ' +
            'The Covenant will not share what that means. The Archivist said it is the second most common outcome.',
    },

    // ── Phase 10 items ────────────────────────────────────────────────────

    'threshold-resonance-record': {
        id: 'threshold-resonance-record',
        name: 'Threshold Resonance Record',
        type: 'key',
        value: 680,
        description: 'A resonance trace record from the Sovereign Threshold annex. ' +
            'The pattern is identical to the signal first detected at Ashveil — amplified by a factor ' +
            'that should require a facility ten times this size to produce. ' +
            'The Helion Synod has been looking for this for twelve years.',
    },
    'forced-sovereignty-record': {
        id: 'forced-sovereignty-record',
        name: 'Forced Sovereignty Record',
        type: 'key',
        value: 720,
        description: 'A classification record from one of the two enforcement-terminal cycles. ' +
            'The notation reads VOID SOVEREIGN — ENFORCEMENT OVERRIDE. ' +
            'The override was filed by the civilization itself, on the final day of their cycle. ' +
            'The Architect accepted it.',
    },
    'sealed-cycle-record': {
        id: 'sealed-cycle-record',
        name: 'Sealed Cycle Record',
        type: 'key',
        value: 760,
        description: 'A sealed classification record from the Threshold annex. ' +
            'The seal format is the Architect\'s own — unbreakable without the Sovereign key. ' +
            'Inside, according to the manifest header, is the complete resolution protocol ' +
            'for the forty-second cycle. Your cycle.',
    },

    // ── Phase 11 items ────────────────────────────────────────────────────

    'origin-cycle-fragment': {
        id: 'origin-cycle-fragment',
        name: 'Origin Cycle Fragment',
        type: 'key',
        value: 800,
        description: 'A fragment from the first record — the Architect\'s original cycle-zero entry. ' +
            'The resonance density is orders of magnitude above anything recovered from later-phase sites. ' +
            'It reads as actively transmitting on every scanner protocol tested against it.',
    },
    'first-record-extract': {
        id: 'first-record-extract',
        name: 'First Record Extract',
        type: 'key',
        value: 960,
        description: 'A direct data extract from the Origin Node\'s cycle-zero record. ' +
            'The Architect\'s first decision, unredacted. ' +
            'The first civilization classified. What they chose. What the Architect recorded. ' +
            'Every faction in the frontier has been looking for this for different reasons. ' +
            'None of them will be satisfied with the same answer.',
    },
    'origin-node-access-token': {
        id: 'origin-node-access-token',
        name: 'Origin Node Access Token',
        type: 'key',
        value: 880,
        description: 'A credential token recovered from the Origin Node gallery. ' +
            'It is the oldest artifact you have encountered — the authorization format is the Architect\'s original, ' +
            'before any revision or update. It opens doors that should not exist in any facility built after it.',
    },
    'architect-origin-seal': {
        id: 'architect-origin-seal',
        name: 'Architect Origin Seal',
        type: 'key',
        value: 1100,
        description: 'The original authorization seal recovered from the Origin Node Apex. ' +
            'The Null Architect affixed this to the first cycle-zero record at the moment of creation. ' +
            'It is the oldest manufactured object you have ever held. ' +
            'Every faction considers it the most significant recovered artifact in frontier history.',
    },
};
