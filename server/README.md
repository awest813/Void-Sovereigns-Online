# Server — Void Sovereigns Online

**Phase 0: Placeholder**

The server directory is reserved for the backend implementation in Phase 1+.

## Planned Scope

- Player authentication and session management
- Persistent game state storage (player, inventory, ship, reputation)
- Contract state and world-event seeding
- Leaderboards and social features (later)
- Multiplayer (not planned for Phase 1 vertical slice)

## Tech Direction

Likely stack (decide in Phase 1):
- **Node.js + TypeScript** — consistent with the rest of the codebase
- **Express or Fastify** — lightweight HTTP server
- **PostgreSQL or SQLite** — persistent state store
- **Shared types** from `shared/types/` for API request/response shapes

## Phase 1 Note

The vertical slice (Milestone 01) targets session-only state with no persistent backend. Server implementation begins in Milestone 02.

## Structure (Phase 1 target)

```
server/
├── src/
│   ├── routes/        HTTP route handlers
│   ├── services/      Business logic (contracts, players, etc.)
│   ├── db/            Database models and migrations
│   └── index.ts       Server entry point
├── package.json
└── tsconfig.json
```
