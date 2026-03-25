# Void Sovereigns Online

A browser-first space opera RPG. Frontier survival, contract work, and slow-burn cosmic horror — set in a universe of worn utility hardware, declining stations, and things humanity was not meant to find.

> **Current Phase: 7** — Ship Tier III & Deep Frontier

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

---

## Current Phase: 7 — Ship Tier III & Deep Frontier

### What Phase 7 Adds

**The frontier gets stranger.** Ashveil Deep extends the post-relay arc with void-class operations, unknown entities, and escalating multi-faction conflict over deep-core records.

#### Deep Frontier Operations
- **Ashveil Deep** unlocked after Transit Node Zero clear
- **Void-class tier** dungeon contract mapping in `DUNGEON_REGISTRY`
- **Unknown entities** added to enemy roster for deep-frontier combat pacing
- **Cross-faction contract pressure** (Compact, Synod, Covenant, ICA, Aegis)
- **Expanded codex unlocks** for deep-frontier intelligence records

#### New Dungeon (Void-class)
- **Ashveil Deep** — Tier 5 Redline/void-class site beyond Ashveil Observation Post

#### New Contracts (7)
- 5 high-tier deep-frontier operations
- 2 Redline extractions at Ashveil Deep core layers

#### New Ship Data (Tier III)
- **Deepfrontier Lancer III** ship frame added to ship content registry
- Relay-capable Tier III hull classification in ship-state checks

#### New NPCs (3)
- **Lyra Kesh** — ICA hazard specialist at Farpoint
- **Marek Thane** — Synod cognitive-drift field adept
- **Iora Venn** — Free Transit shipwright for Tier III doctrine

#### New Lore (8 entries)
- Ashveil Deep route and hazard briefs
- Tier III hull doctrine memo
- Synod cognitive drift and ICA quarantine records
- Core encounter and lattice analysis debriefs

#### Integration Fixes Included
- Codex now aggregates unlocked lore across Phase 5/6/7 pools
- Dungeon completion screen contract title lookup now includes Phase 6/7 contracts
- Hub NPC aggregation now consistently includes Phase 5+ arrays across panels

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
│   ├── contracts/                starter · phase2 · phase3 · phase4 · phase5
│   ├── factions/                 factions.ts — all factions, all phases
│   ├── lore/                     starter · phase4 · phase5
│   ├── npcs/                     meridian-npcs · phase4-npcs · phase5-npcs
│   └── sectors/                  meridian-station · ashwake-belt · phase4 · phase5
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
