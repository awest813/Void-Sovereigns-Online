# Void Sovereigns Online

A browser-first space opera RPG. Frontier survival, contract work, and slow-burn cosmic horror — set in a universe of worn utility hardware, declining stations, and things humanity was not meant to find.

> **Current Phase: 9** — The Cycle Archive

---

## What Is This Game?

You start broke, on a dying station, with a ship that can barely hold vacuum. You take contracts — salvage runs, bounties, deliveries — to pay for upgrades, earn faction standing, and eventually punch through to the wider galaxy. The further you go, the stranger it gets.

**Core pillars:**
- Contract-driven progression with faction stakes
- Turn-based dungeon runs with permadeath-adjacent risk
- Slow-burn cosmic mystery threading through every phase
- NASA-punk tone — functional hardware, worn surfaces, dry humor

---

## Phase History

| Phase | Title | Key Content |
|-------|-------|-------------|
| **0** | Foundation | Technical scaffold, shared types, content schema |
| **1** | Meridian Loop | MainMenu → Hub → SectorMap → DungeonScene; Shalehook Dig Site; starter contracts and NPCs |
| **2** | Shipyard & Cold Signal | Ship upgrade panel, Meridian Hauler II, Coldframe Station-B dungeon, relay-capability detection |
| **3** | Relay Transit | Void Relay 7-9, Farpoint Waystation, relay jump milestone, ICA / Void Covenant factions, waveform mystery |
| **4** | Frontier Expansion | Kalindra Drift & Orin's Crossing sectors, 10 new contracts, faction reputation thresholds, Frontier Compact / Sol Union / Aegis / Vanta factions |
| **5** | Redline Protocol | High-stakes Redline runs, Vault of the Broken Signal & Ashveil Observation Post, Helion Synod faction, item insurance & secure-slot system |
| **6** | Farpoint Hub | Farpoint second hub, Kael questline, Transit Node Zero ghost-site contracts, codex lore unlock system |
| **7** | Ship Tier III & Deep Frontier | Ashveil Deep void-class dungeon, unknown entities, Tier III ship frame data, deep-frontier contract/lore expansion |
| **8** | The Index Chamber | The Null Architect broadcasts coordinates to every faction simultaneously; Index Chamber void-class dungeon, multi-faction first-contact arc, Null Voice echo interface |
| **9** | The Cycle Archive | Second transmission arrives after Index Chamber cleared; Cycle Archive sanctum dungeon, Architect purpose revealed, terminal witness arc |

---

## Current Phase: 9 — The Cycle Archive

### What Phase 9 Adds

**The Architect reveals its purpose.** A second transmission arrives forty-eight hours after the Index Chamber is cleared — coordinates to a site one layer deeper, accompanied by a single phrase: *"CYCLE RECORD REQUIRES TERMINAL WITNESS."* Every faction that reached the Index Chamber receives the same message.

#### The Cycle Archive
- **Cycle Archive Sanctum** — void-class dungeon, unlocked after Index Chamber cleared
- **5-room layout**: Threshold → Outer Hall → Record Annex → Restricted Tier → Terminal
- **New enemies**: `cycle-archive-seraph`, `cycle-archive-arbiter`, `cycle-archive-executor`, `cycle-archive-warden` (boss)
- **`cycle-archive-cleared`** flag gates next content

#### New Contracts (7)
- 1 Frontier Compact approach survey
- 1 Helion Synod cognitive record protocol
- 1 Void Covenant recovery operation
- 1 ICA access-control brief
- 1 Aegis scout extraction
- 2 Redline forced-access runs

#### New NPCs (2)
- **Commander Thess Dray** — Aegis Division field commander, skeptical of anything the Architect volunteers willingly
- **Null Archivist Interface** — the Architect's direct output terminal; communicates in structured record notation

#### New Lore (8 entries)
- Cycle Archive approach brief
- Archivist transmission record and faction response briefs
- Cognitive imprint analysis and psi-resonance telemetry debriefs
- Terminal witness debrief and Architect purpose records

---

### What Phase 8 Added

**The Index Chamber.** The Null Architect transmitted a single coordinate set to every active comm relay in the frontier corridor simultaneously. The site does not appear in any route registry. Every faction received the same message. Every faction sent someone to look.

#### The Index Chamber
- **Index Chamber Null-Prime** — void-class dungeon, unlocked after Ashveil Deep cleared
- **4-room layout**: Approach Corridor → Signal Hall → Archive Ring → Core
- **New enemies**: `index-warden-sentry`, `index-warden-herald`, `index-warden-guardian`, `index-chamber-warden` (boss)
- **`index-chamber-cleared`** flag gates Phase 9

#### New Contracts (7)
- 1 Frontier Compact approach survey
- 1 Helion Synod interaction protocol
- 1 Void Covenant cycle-witness brief
- 1 ICA access-control operation
- 1 Aegis extraction prep
- 2 Redline deep-access runs

#### New NPCs (3)
- **Corvus Renn** — veteran Free Transit navigator; first person at Farpoint to triangulate the Index Chamber coordinates
- **Director Senne Vael** — ICA authority who arrived the same hour the transmission did
- **Echo Terminal — Null Voice** — passive relay interface for the Architect's pre-transmission output logs

#### New Lore (8 entries)
- Index Chamber approach brief and faction arrival summaries
- Null Voice echo logs and ICA quarantine field notes
- Warden entity behavioral analysis and first-contact debrief records

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
├── src/                          Client — Phaser scenes + React UI
│   └── game/
│       ├── scenes/
│       │   ├── HubScene.ts       Hub panels: contracts, NPCs, shipyard, services, debrief
│       │   ├── SectorMapScene.ts Sector map, relay/Redline launch, Farpoint node
│       │   └── DungeonScene.ts   Turn-based dungeon runner, Redline UI
│       ├── data/
│       │   ├── dungeons.ts       DUNGEON_REGISTRY (all phases)
│       │   ├── enemies.ts        Enemy stat blocks + loot tables
│       │   └── shipUpgrades.ts   Ship upgrade definitions
│       ├── state/
│       │   └── GameState.ts      Singleton: player, ship, faction rep, Redline state
│       └── ui/
│           ├── UITheme.ts        Shared color tokens (export const T)
│           └── DebugPanel.ts     F1 toggle debug overlay
│
├── content/                      Game data modules (TypeScript)
│   ├── contracts/                starter · phase2–phase9
│   ├── factions/                 factions.ts — all factions, all phases
│   ├── lore/                     starter · phase4–phase9
│   ├── npcs/                     meridian-npcs · phase4–phase9
│   └── sectors/                  meridian-station · ashwake-belt · phase4–phase9
│
├── shared/                       Types shared across all layers
├── docs/
│   ├── game-bible/               World overview, style guide, terminology
│   └── roadmap/                  Milestone 01 (vertical slice) · roadmap
└── tools/
    └── validate-content.ts       Content validation script
```

---

## Documentation

- [World Overview](docs/game-bible/world-overview.md)
- [Style Guide](docs/game-bible/style-guide.md)
- [Terminology](docs/game-bible/terminology.md)
- [Conventions](docs/conventions.md)
- [Roadmap](docs/roadmap/roadmap.md)
- [Milestone 01 — Vertical Slice (historical)](docs/roadmap/milestone-01-vertical-slice.md)

---

## Content Validation

```bash
npx ts-node --project tsconfig.content.json tools/validate-content.ts
```

Checks all content files for duplicate IDs and broken cross-references.

---

## License

MIT
