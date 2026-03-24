# Void Sovereigns Online

A browser-first space opera RPG. Frontier survival, contract work, and slow-burn cosmic horror — set in a universe of worn utility hardware, declining stations, and things humanity was not meant to find.

> **Phase 3** — The First Relay Transit & The World Beyond

---

## Current Phase: 3 — Relay Transit & Frontier Expansion

### What Phase 3 Adds

**The player crosses the first major threshold:** from Meridian's local trap into the wider, stranger galaxy.

#### Ship Milestone
- The relay-capable ship milestone now triggers a fully distinct transit sequence and debrief
- Two upgrade paths remain from Phase 2: buy the **Meridian Hauler II** (3,800c) or install **Nav Computer + Class-II Drift Drive** on the Cutter
- Reaching relay capability unlocks the **INITIATE RELAY JUMP** action on the Sector Map
- A confirmation prompt frames the moment: *"You are the first relay-capable ship to make approach in eighteen months."*

#### Void Relay 7-9 (Tier 2 Dungeon)
- 5-room instance: Approach Lock → Signal Cascade Chamber → Archive Node → Transit Corridor → Relay Core
- New enemies: **Relay Guardian Mk.I**, **Fractured Probe**, **Relay Core Sentinel** (boss)
- New loot: Relay Data Core, Anomaly Trace Log, Signal Fragment, Void Pattern Record
- Clearing the relay sets `relay-jump-completed` flag and opens Farpoint Waystation
- The archive node contains timestamps that do not match — a zero-second transit through a relay that was supposed to be non-functional
- Boss room: every screen shows a waveform. A different one than Coldframe. But the same shape.

#### Farpoint Waystation — Outer Ring (Tier 3 Dungeon)
- 5-room post-relay instance: Docking Bay D → Freight Hold 7 → Security Checkpoint → Logistics Core → Security Node
- New enemies: **Farpoint Sentry**, **Farpoint Security Prime** (boss); Fractured Probe appears here too — far from any relay
- New loot: Farpoint Cargo Bundle, Farpoint Access Chip
- Contrasts with Meridian: larger, once-busier, now abandoned and overloaded

#### New Contracts (7 total)
- **Pre-relay (3):** Survey Relay 7-9 Exterior (Brother Caldus), ICA Field Assessment (Agent Vorren), Covenant Signal Capture (Kestrel Vin)
- **Post-relay (4):** ICA Transit Papers to Farpoint, Farpoint Salvage Extraction, Anomaly Trace Investigation, Relay Ghost Telemetry
- Post-relay contracts only appear on the board after the relay transit is completed

#### New Factions (3 active)
| Faction | Role | Representative |
|---------|------|----------------|
| **Interstellar Commonwealth Authority (ICA)** | Official/state | Agent Vorren |
| **Void Covenant** | Secretive / relic-interested | Kestrel Vin |
| **Free Transit Compact** | Practical/local | (existing) |

Reputation is now tracked for 5 factions: Meridian Dock Authority, Ashwake Extraction Guild, ICA, Void Covenant, Free Transit Compact.

#### New NPCs (3)
- **Agent Vorren** (ICA) — arrived on the first Commonwealth ship in 18 months; has classified records that match the anomaly pattern
- **Kestrel Vin** (Void Covenant) — has been waiting for someone to go through; says the relay was "quieted, not broken"
- **Kael Mourne** (Farpoint Ops) — kept Farpoint alive for two years; filed a distress ping 18 months ago that was received with a future timestamp

#### Mystery Escalation
- The relay archive contains a zero-second transit record for an unknown vessel
- Fractured Probe units of unknown manufacture appear both inside the relay and at Farpoint
- The waveform in the Relay Core matches the pattern from Coldframe Station-B — different data, same shape
- Kael Mourne's distress ping was received with an impossible timestamp
- Agent Vorren has classified Commonwealth records that match this pattern and will not share them

#### UI / Progression Milestones
- Sector Map gains: relay launch button, Farpoint node, post-relay goal strip
- Debrief panel shows "RELAY TRANSIT COMPLETE" with Farpoint unlock banner on relay clear
- Main panel and Ship Status panel reflect relay jump state throughout
- Contract board dynamically shows/hides post-relay contracts based on game flag

---

## Phase History

| Phase | Content |
|-------|---------|
| **Phase 0** | Technical foundation, shared types, content schema |
| **Phase 1** | MainMenu → HubScene → SectorMap → DungeonScene loop; Shalehook Dig Site; starter contracts and NPCs |
| **Phase 2** | Ship upgrades (Shipyard), Meridian Hauler II purchase, Coldframe Station-B dungeon, Phase 2 contracts, relay-capable detection |
| **Phase 3** | Void Relay 7-9 transit, Farpoint Waystation, 7 new contracts, 3 new NPCs, 3 active factions, mystery escalation |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Game Engine | [Phaser 3](https://phaser.io/) |
| UI Framework | [React 19](https://react.dev/) |
| Language | TypeScript 5 |
| Bundler | [Vite 6](https://vitejs.dev/) |

---

## Getting Started

```bash
npm install
npm run dev        # Start dev server at http://localhost:8080
npm run build      # Production build → dist/
```

---

## Project Structure

```
/
├── src/                   Client — Phaser scenes + React UI
│   ├── game/
│   │   ├── scenes/        Phaser scene files
│   │   │   ├── HubScene.ts        Meridian Station hub (contracts, NPCs, shipyard, debrief)
│   │   │   ├── SectorMapScene.ts  Sector map + relay/farpoint launch
│   │   │   └── DungeonScene.ts    Turn-based dungeon runner
│   │   ├── data/
│   │   │   ├── dungeons.ts        DUNGEON_REGISTRY (all phases)
│   │   │   ├── enemies.ts         Enemy stat blocks + loot tables
│   │   │   └── shipUpgrades.ts    Ship upgrade definitions
│   │   ├── state/
│   │   │   └── GameState.ts       Singleton player/ship state
│   │   └── main.ts                Phaser game config + entry
│   └── ...
│
├── content/               Game data files (TS data modules)
│   ├── contracts/         starter-contracts · phase2-contracts · phase3-contracts
│   ├── dungeons/          shalehook · ashwake · phase3-dungeons (editorial ref)
│   ├── factions/          5 factions including ICA and Void Covenant
│   ├── npcs/              meridian-npcs (all phases)
│   └── ...
│
├── shared/                Types used across all layers
└── ...
```

---

## Documentation

- [World Overview](docs/game-bible/world-overview.md)
- [Style Guide](docs/game-bible/style-guide.md)
- [Terminology](docs/game-bible/terminology.md)
- [Conventions](docs/conventions.md)
- [Milestone 01 — Vertical Slice](docs/roadmap/milestone-01-vertical-slice.md)

---

## Content Validation

```bash
npx ts-node --project tsconfig.content.json tools/validate-content.ts
```

Checks all content files for duplicate IDs and broken cross-references.

---

## Recommended Phase 4 Next Steps

- **Redline Runs** — high-risk extraction contracts with time pressure and heavier enemy density
- **Black-market salvage ops** — Jasso's network expands; gray-market relay components become relevant
- **Deeper anomaly contracts** — the waveform pattern leads somewhere; Kestrel Vin has a theory
- **Relay ghost-site expeditions** — the zero-second transit record points to something; who or what used the relay?
- **ICA vs. Covenant tension** — their agendas around the relay diverge; faction reputation begins to matter for contract access
- **Ship progression tier 3** — a new ship frame or major refit that reflects post-relay capabilities
- **Farpoint Station expansion** — Kael Mourne's core sections as a second hub with its own contract board

---

## License

MIT

