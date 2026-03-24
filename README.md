# Void Sovereigns Online

A browser-first space opera RPG. Frontier survival, contract work, and slow-burn cosmic horror — set in a universe of worn utility hardware, declining stations, and things humanity was not meant to find.

> **Phase 0** — Technical & Content Foundation

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
│   │   ├── EventBus.ts    React ↔ Phaser event bridge
│   │   └── main.ts        Phaser game config + entry
│   ├── App.tsx            Root React component
│   └── PhaserGame.tsx     React ↔ Phaser bridge component
│
├── shared/                Types used by client and server
│   └── types/             TypeScript interfaces for all data domains
│
├── content/               Game data files (TS data modules)
│   ├── factions/
│   ├── races/
│   ├── ships/
│   ├── sectors/
│   ├── contracts/
│   ├── npcs/
│   ├── dungeons/
│   └── lore/
│
├── docs/
│   ├── game-bible/        World overview, style guide, terminology
│   ├── roadmap/           Milestone plans
│   └── conventions.md     Naming, IDs, file org, and code conventions
│
├── server/                Server placeholder (Phase 1+)
├── tools/                 Content validation scripts
└── public/                Static assets
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

## License

MIT
