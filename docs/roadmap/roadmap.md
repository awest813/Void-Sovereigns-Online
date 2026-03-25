# Void Sovereigns Online — Roadmap

This document tracks completed phases and charts the planned arc for future development. Each phase adds a meaningful layer to the game loop, the world, and the central mystery.

---

## Completed Phases

### Phase 0 — Foundation
**Status: ✅ Complete**

- Project scaffold: Vite + Phaser 3 + React 19 + TypeScript 5
- Shared type system (`shared/types/`)
- Content schema: `Contract`, `Faction`, `NPC`, `Loot`, `DungeonRoom`, `Enemy`
- Content validation tooling (`tools/validate-content.ts`)
- Server directory placeholder with architecture notes

---

### Phase 1 — Meridian Loop
**Status: ✅ Complete**

Core game loop established end-to-end.

- **Scene flow:** MainMenu → HubScene → SectorMapScene → DungeonScene → HubScene
- **Hub panels:** Contracts board, Ship Status, NPC list, Debrief
- **Dungeon:** Shalehook Dig Site (5 rooms, turn-based combat)
- **Enemies:** Rogue mining drones, Ashwake Belt fauna
- **Contracts:** 5 starter contracts (salvage, bounty, delivery)
- **NPCs:** Dockmaster Renata Osei, Guild Rep Halvek Dross, Torrek Voss, Sova
- **Factions:** Meridian Dock Authority, Ashwake Extraction Guild (tracked, no rep gating)
- **GameState singleton** persisting player, ship, inventory, flags across scenes

---

### Phase 2 — Shipyard & Cold Signal
**Status: ✅ Complete**

Ship progression and second dungeon.

- **Shipyard panel** in HubScene — buy ship upgrades, install modules
- **Meridian Hauler II** (3,800c) — first major ship purchase
- **Ship upgrades:** Nav Computer, Class-II Drift Drive, Cargo Expander
- **Relay-capability detection** — `isCutterRelayCapable()` / `isRelayCapable()`
- **Coldframe Station-B** — new dungeon with distinct enemy set and loot
- **DUNGEON_REGISTRY** — multi-dungeon system replacing single dungeon
- **Phase 2 contracts** — 6 new contracts including first Coldframe ops
- **Items system** — `sellItem()` / `installUpgrade()` in GameState

---

### Phase 3 — Relay Transit
**Status: ✅ Complete**

The player punches through the first major threshold.

- **Relay jump milestone** — dedicated transit sequence and debrief; confirmation prompt: *"You are the first relay-capable ship to make approach in eighteen months."*
- **Void Relay 7-9** (Tier 2) — 5-room dungeon; Relay Core boss; sets `relay-jump-completed` flag
- **Farpoint Waystation — Outer Ring** (Tier 3) — 5-room post-relay dungeon; unlocked after relay clear
- **7 new contracts** — 3 pre-relay, 4 post-relay (board filters by flag)
- **3 new NPCs:** Agent Vorren (ICA), Kestrel Vin (Void Covenant), Kael Mourne (Farpoint Ops)
- **3 new factions:** ICA, Void Covenant, Free Transit Compact
- **5 enemies added:** Relay Guardian Mk.I, Fractured Probe, Relay Core Sentinel, Farpoint Sentry, Farpoint Security Prime
- **Mystery seeds:** zero-second transit record, Fractured Probes far from any relay, waveform match across Coldframe and the Relay Core, impossible timestamp on Kael Mourne's distress ping

---

### Phase 4 — Frontier Expansion
**Status: ✅ Complete**

Two new sectors, four new factions, and the first reputation gates.

- **2 new sectors:** Kalindra Drift, Orin's Crossing
- **2 new dungeons:** Kalindra Drift Dig Site, Orin's Crossing Wreck Field
- **10 new contracts** — 3 Frontier Compact, 2 Sol Union, 3 Aegis, 1 Vanta, 1 Redline-flagged
- **4 new NPCs:** Leva (Frontier Compact), Dresh (Sol Union), Sable (Aegis), Crow (Vanta/gray market)
- **4 new factions:** Frontier Compact, Sol Union, Aegis Directorate, Vanta (black market)
- **Faction reputation thresholds** (`FactionReputationThreshold`) — some contracts now require standing
- **Faction Standings panel** in HubScene — player can review all rep scores
- **`activeRunIsRedline` flag** and rep helpers in GameState
- **6 new enemies** added to Kalindra Drift and Orin's Crossing instances
- **`isRedline` / `redlineWarning` / `reputationRequirement`** fields on Contract type

---

### Phase 5 — Redline Protocol
**Status: ✅ Complete**

The risk layer escalates. High-stakes runs, corporate theology, and insurance brokers.

- **Redline run system** — opt-in runs with higher rewards and full-loot loss on death
- **Secure Slot** — lock one item in Services before departure; survives death unconditionally
- **Insurance** — purchase per-run coverage from Services panel; protects full run loot on death
- **Pre-run risk summary** and enhanced death / completion UI in DungeonScene
- **`confirmRedlineLaunch`** confirmation prompt in SectorMapScene
- **2 new Redline dungeons:** Vault of the Broken Signal, Ashveil Observation Post
- **8 new contracts** — 2 standard, 4 Redline-flagged, 2 Helion Synod investigation
- **1 new faction:** Helion Synod — corporate-theological; opaque agenda around Redline relics
- **2 new NPCs:** Aris Vel (Synod liaison), The Broker (anonymous Redline middleman)
- **8 new lore entries** — Synod charter fragments, Vault site reports, waveform escalation
- **GameState additions:** `redlineSecuredItemId`, `redlineInsuranceActive`, `lastRunRedlineLoss`, `sessionId`; `resolveRedlineDeath()`, `secureRunItem()`, `purchaseInsurance()` helpers

---

## Upcoming Phases

### Phase 6 — The Farpoint Hub
**Status: ✅ Complete**

Farpoint Waystation becomes a second fully operational hub, competing with Meridian.

- **Farpoint as a second hub** — clicking Farpoint on the sector map enters the hub directly; contract board, NPC contacts, and services panel all reflect the Farpoint context
- **Hub title and context** — hub header, contract board header, and NPC panel dynamically reflect the current hub (`currentHubId` state field)
- **Kael Mourne expanded questline** — three-stage questline: ping investigation → zero-second coordinates → Transit Node Zero; each stage unlocks the next via flags
- **3 new NPCs:** Kael Mourne (Farpoint expanded), Tovan Vex (Void Covenant observer), Aryn Voss (Farpoint merchant)
- **10 new contracts** — 7 standard Farpoint contracts + 2 Redline ghost-site contracts (visible only after questline stage 2) + 1 archive contract
- **Faction divergence** — `void-covenant-signal-trace` and `ica-relay-lockdown` are mutually conflicting; accepting one locks out the other
- **1 new dungeon:** Transit Node Zero (Tier 4, REDLINE) — ghost site accessible via sector map after questline stage 2 flag
- **5 new enemies:** Static-Form Alpha, Static-Form Prime, Phase-Drifter, Null-Relay Guardian, Null Architect (boss)
- **1 new sector:** Transit Node Zero — ghost-site type, extreme danger
- **Codex panel** — new main menu panel showing unlocked lore entries with category, source, and content; scroll-capable
- **Lore unlocks via contract turn-in** — 8 lore entries unlock on completing specific contracts
- **8 new lore entries** — Kael personal record, approach notes, ICA archive fragment, Covenant field report, ops log, Vorren analysis, interior recording, Null Architect encounter
- **GameState additions:** `currentHubId`, `unlockedLoreIds`; `setCurrentHub()`, `unlockLore()`, `isLoreUnlocked()` helpers; questline flags `kael-questline-stage-1`, `kael-questline-stage-2`

---

### Phase 7 — Ship Tier III & Deep Frontier
**Status: 🔄 In Progress**

Ship progression reaches its third tier; the frontier gets genuinely strange.

- **Ship Tier III frame** — a named hull designed for post-relay operation; distinct stats and visual identity
- **New sector: The Ashveil Deep** — anomalous space past the Observation Post; limited sensor data, hostile unknown entities
- **New dungeon tier: Void-class** — 7-room instances with environmental hazards (hull breach, signal interference)
- **Unknown entities** — enemies of non-faction origin; behaviors do not match any known faction
- **Psi ability mechanics** — first implementation of psi class abilities; quiet, strange, and expensive to use
- **Synod vs. Covenant escalation** — both factions are moving toward the same site; neither will explain why

---

### Phase 8 — The Waveform Answer
**Status: 🔲 Planned**

The mystery resolves its first layer. Not an answer — a name.

- **The source of the waveform** — the signal has a structure; it is a message, not a signature
- **Named antagonist faction** revealed — present in all prior phases in retrospect
- **Classified ICA records** — Agent Vorren's documents become accessible; partial, heavily redacted
- **Companion system (1 slot)** — one NPC can accompany the player into dungeons; Kestrel Vin or Aris Vel depending on rep
- **End-of-arc debrief** — a scene that recaps every mystery beat the player encountered; acknowledgment of what was found and what wasn't

---

### Phase 9 — Multiplayer Foundation
**Status: 🔲 Planned (post-single-player arc)**

Backend and network layer for persistent multiplayer.

- **Backend server** — Node.js + TypeScript; Express or Fastify; PostgreSQL state store
- **Player authentication** — session management and persistent save state
- **Contract world-state seeding** — shared world events that affect contract availability across all players
- **Co-op dungeon runs (2-player)** — synchronized turn-based combat with a second client
- **Leaderboards** — Redline run records, contract completion standings

---

## Long-Term Arc

The waveform is a message. The Void Relay network did not fail — it was repurposed. The zero-second transit record is not a data error. Humanity was not the first species to build a relay network, and whoever built the first one is not gone.

This is revealed incrementally, never explained directly, and always filtered through the perspectives of underfunded frontier workers who just need to pay docking fees.

---

## Milestone Reference

- [Milestone 01 — Vertical Slice (historical planning doc)](milestone-01-vertical-slice.md)
