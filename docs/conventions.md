# Project Conventions — Void Sovereigns Online

This document defines the conventions all contributors should follow. When in doubt, follow what is already established before introducing something new.

---

## 1. Naming Conventions

### IDs
- All game object IDs use `kebab-case`
- IDs must be unique within their domain (factions, ships, contracts, etc. each have their own namespace)
- IDs never change once assigned — they are referenced across content files
- Format: `[category-hint]-[name][-variant]` — e.g. `meridian-dock-authority`, `rig-alpha-7`, `std-9mm`

### TypeScript
| Construct | Convention | Example |
|-----------|-----------|---------|
| Interfaces | PascalCase | `PlayerClass`, `DungeonRoom` |
| Type aliases | PascalCase | `ItemRarity`, `SectorDanger` |
| Variables / functions | camelCase | `starterContracts`, `getContractById` |
| Constants (top-level) | camelCase | `factions`, `ashwakeDungeons` |
| Phaser Scene classes | PascalCase + `Scene` suffix | `HubScene`, `DungeonScene` |
| React components | PascalCase | `PhaserGame`, `HubOverlay` |
| Enums | PascalCase (avoid; prefer string unions) | — |

### Files
| Type | Convention | Example |
|------|-----------|---------|
| Content data files | `kebab-case.ts` | `starter-contracts.ts`, `meridian-npcs.ts` |
| Phaser scene files | PascalCase matching class name | `HubScene.ts`, `DungeonScene.ts` |
| React components | PascalCase matching component | `HubOverlay.tsx`, `ContractCard.tsx` |
| Shared type files | lowercase noun | `faction.ts`, `playerClass.ts` |
| Doc files | `kebab-case.md` | `world-overview.md`, `style-guide.md` |

---

## 2. Folder Organization

```
shared/types/       One file per data domain. Export all via index.ts.
content/[domain]/   One file or folder per content domain.
src/game/scenes/    One file per Phaser Scene.
src/components/     React UI components (Phase 1+).
docs/game-bible/    World, tone, and style documentation.
docs/roadmap/       Milestone plans.
tools/              Validation and build scripts.
server/             Backend placeholder (Phase 1+).
```

Content files in `content/` are named after what they contain, not what phase they were created in. Do not add phase prefixes to content files.

---

## 3. Content File Organization

- Each content file exports a named array constant: `export const [name]: [Type][] = [...]`
- Example: `export const factions: Faction[] = [...]`
- Import the type from `../../shared/types/[type]`
- Do not duplicate type definitions in content files
- Do not use `default` exports in content files — named exports only

---

## 4. Content Loading

In Phase 0 and Phase 1, content is loaded by direct TypeScript import — no runtime JSON fetch.

```typescript
// Good — direct typed import
import { factions } from '../../content/factions/factions';

// Not yet — avoid in Phase 1
fetch('/content/factions.json').then(...)
```

This keeps the build fast, tree-shakeable, and fully type-checked. Migrate to runtime loading when content volume or hot-reload requirements demand it.

---

## 5. Scene Naming

Phaser scenes are identified by their scene key string. The key must match the class name without the `Scene` suffix.

| File | Class | Scene Key |
|------|-------|-----------|
| `Boot.ts` | `Boot` | `'Boot'` |
| `Preloader.ts` | `Preloader` | `'Preloader'` |
| `MainMenu.ts` | `MainMenu` | `'MainMenu'` |
| `HubScene.ts` | `HubScene` | `'Hub'` |
| `DungeonScene.ts` | `DungeonScene` | `'Dungeon'` |

New scenes follow this pattern. Register in `src/game/main.ts`.

---

## 6. React ↔ Phaser Communication

Use the existing `EventBus` for cross-boundary events. Do not import Phaser objects directly into React components.

```typescript
// In Phaser scene — signal React
EventBus.emit('hub:open', { playerId: this.playerId });

// In React — listen for Phaser signal
EventBus.on('hub:open', (data) => setHubVisible(true));
```

Prefix event names by direction: `hub:*` for hub/React events, `scene:*` for Phaser scene events.

---

## 7. Tags

Tags are lowercase, hyphenated strings on game objects. They are used for filtering, display grouping, and future validation.

- Use existing tags where possible before creating new ones
- Tags describe what something **is** or **does**, not its tier or phase
- Tier information belongs in the `tier` field, not in tags
- Example valid tags: `starter`, `psi-adjacent`, `void-relays`, `rogue-automation`, `tier-1` (exception: tier tags acceptable for quick filtering)

---

## 8. Validation Rules

Run `tools/validate-content.ts` before any content PR. It checks:

- All IDs are unique within their domain
- All cross-references (sector → dungeon IDs, contract → sector IDs, etc.) resolve
- No empty required string fields
- No missing required arrays

---

## 9. TypeScript Rules

- `strict: true` is enforced in `tsconfig.json`. Do not work around it.
- Prefer `type` and `interface` from `shared/types/` over inline type definitions
- Avoid `any`. Use `unknown` if the type is genuinely unknown.
- `noUnusedLocals` and `noUnusedParameters` are enforced — clean up before committing
- Do not disable ESLint rules unless justified in a comment

---

## 10. Commit Messages

Use conventional commit format:

```
feat: add Ashwake Belt dungeon content
fix: correct dungeon reward XP range for rig-alpha-7
chore: update tsconfig to include shared/
docs: add terminology entry for Void Pocket
content: add Coldframe Station-B dungeon
```

Prefixes: `feat`, `fix`, `chore`, `docs`, `content`, `refactor`, `test`
