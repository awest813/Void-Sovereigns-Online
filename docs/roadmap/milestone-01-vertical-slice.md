# Milestone 01 — Vertical Slice

**Target:** A playable browser session demonstrating the core VSO loop end-to-end.

---

## Definition of Done

A player can:
1. Launch the game in a browser
2. Create a character (choose race and class)
3. Arrive at Meridian Station hub
4. Browse and accept a contract
5. Travel to the Ashwake Belt and enter a dungeon
6. Complete at least one combat encounter and reach the exit
7. Return to Meridian Station with loot and credit reward
8. See updated credits, inventory, and contract status

---

## Scope

### In Scope

**Hub layer (React UI)**
- [ ] Character creation screen (race + class selection)
- [ ] Station hub menu: contracts board, ship status, inventory, NPC list
- [ ] Contracts board: list available contracts, show details, accept/abandon
- [ ] Inventory panel: display items, equip/unequip weapons and implants
- [ ] Ship status panel: hull, shielding, cargo, modules
- [ ] NPC interaction modal: dialogue tree with basic branching
- [ ] Credits and basic player stats always visible

**Sector / dungeon layer (Phaser)**
- [ ] Sector map scene: Ashwake Belt selectable from Meridian
- [ ] Dungeon entry scene: show dungeon info, confirm entry
- [ ] Dungeon run scene: room-to-room traversal
- [ ] Combat system: turn-based or active-pause, player and enemy actions
- [ ] Loot drop and inventory pickup after combat
- [ ] Dungeon exit / extract flow

**Game state**
- [ ] Persistent player state across scenes (credits, inventory, contracts, ship)
- [ ] Contract completion detection and reward delivery
- [ ] Basic faction standing tracking (Dock Authority, Extraction Guild)

**Content required**
- [ ] Meridian Station hub fully navigable
- [ ] Ashwake Belt sector map
- [ ] 2 dungeons playable end-to-end (Rig Alpha-7, Coldframe Station-B)
- [ ] 3 contracts completable (1 salvage, 1 bounty, 1 delivery)
- [ ] 4 NPC dialogue trees (Renata, Halvek, Torrek, Sova)
- [ ] Starter weapon and ammo set functional
- [ ] 1 ship functional with real stats

### Out of Scope for M01
- Multiplayer / networking
- Faction rep above basic tracking
- Ship-to-ship combat
- Relay travel
- Psi ability implementation (class exists, abilities listed but no mechanics)
- Codex / lore unlock UI
- Character save/load (session state only in M01)
- Audio

---

## Architecture Notes for Phase 1

### State Management
Use a central `GameState` singleton or context (React context + Zustand recommended). Shared between React (hub UI) and Phaser (scenes via EventBus).

```
GameState {
  player: { id, name, race, class, credits, hp, stats }
  ship: { id, hull, cargo, modules }
  inventory: Item[]
  contracts: { active: Contract[], completed: string[] }
  reputation: Record<string, number>
  flags: Record<string, boolean>
}
```

### React ↔ Phaser Communication
Use the existing `EventBus` for:
- `hub:open` — Phaser signals React to show hub overlay
- `dungeon:start` — React signals Phaser to start dungeon scene with contract context
- `dungeon:complete` — Phaser signals React to process rewards
- `scene:ready` — existing pattern, keep

### Content Loading
Content files in `content/` are imported directly by the modules that need them. No runtime JSON loading in Phase 1. This keeps the build simple and type-safe.

### Scene Flow
```
Boot → Preloader → MainMenu → Hub ⇄ DungeonScene
                               ↕
                          (React overlay handles most hub UI)
```

---

## Deliverable
A deployed build at a public URL (GitHub Pages or similar) that demonstrates the full loop described above.
