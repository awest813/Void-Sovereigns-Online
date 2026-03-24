# Terminology — Void Sovereigns Online

This document defines canonical terms used across writing, code, and content. Use these exact terms consistently.

---

## World Terms

| Term | Definition |
|------|-----------|
| **Void Relay** | A fixed jump infrastructure installation. Enables FTL travel between systems. Capital V, capital R. Never "relay gate," "jump gate," or "warp point." |
| **Relay-capable** | A ship that meets the technical threshold to use Void Relay jump networks. Requires jumpRange ≥ relay minimum in ship stats. |
| **The Void** | The space between Relay nodes — uncharted, dangerous, and not fully understood. |
| **Void Pocket** | An anomalous dungeon-type zone associated with Relay wreckage or collapse. Hostile to unshielded ships and psi-unprotected crew. |
| **Meridian Station** | The starter hub. Always "Meridian Station" — never "Meridian" alone in lore text (characters may use shorthand). |
| **Ashwake Belt** | The starter sector. Asteroid mining zone near Meridian. |
| **Relic** | An object of unclear origin associated with Void Relay sites or pre-settlement infrastructure. Not magical in tone — strange and poorly understood. |
| **Black Program** | Rumored classified research involving psionics and Relay phenomena. Not confirmed canon in Phase 0. |
| **Psi** | Short for psionic ability. Not "psychic," not "magic," not "the Force." Always lowercase. |
| **Psi Adept** | A character class and general term for psi-sensitive individuals. |
| **Psi Rating** | A stat on implants indicating psionic contamination level. 0 = clean. 10 = significant Covenant interest. |
| **Resonance** | Ambient psionic or Relay-adjacent energy phenomena. Can be passive (background field) or active (event-triggered). |

---

## Faction Terms

| Term | Definition |
|------|-----------|
| **Dock Authority** | Short form for "Meridian Dock Authority." Acceptable in dialogue. |
| **The Guild** | Short form for "Ashwake Extraction Guild." Used by Belt workers and Guild members. |
| **The Compact** | Short form for "Free Transit Compact." Used in trade and shipping contexts. |
| **The Covenant** | Short form for "The Void Covenant." Used cautiously in-universe. |

---

## Gameplay Terms

| Term | Definition |
|------|-----------|
| **Contract** | A repeatable or story job accepted from the contracts board or an NPC. Not "quest," not "mission." |
| **Run** | A single dungeon instance session. "Going on a run," "running the Belt." |
| **Hub** | The station-side menu layer where players interact with NPCs, shops, and the contracts board. |
| **Sector** | A named region of space accessible from the sector map. Contains dungeons and contract sites. |
| **Dungeon** | An instanced location — rig, derelict, void pocket, etc. Always a distinct run environment. |
| **Tier** | Difficulty/power level for contracts and dungeons. Tier 1 = starter. Tier 5 = endgame. |
| **Hull** | Ship health. Not "HP," not "health points" in ship context. Player character uses "HP." |
| **Credits** | The in-game currency. Not "gold," not "creds" in formal text (characters may say "creds" in dialogue). |
| **Salvage** | Items or components recovered from dungeons. A contract category. Also a verb. |
| **Loot Table** | The pool of items that can drop in a dungeon or encounter. |
| **Standing** | A player's reputation with a faction. Use "standing" not "reputation" in UI. (Both are fine in writing.) |

---

## Code Terms

| Term | Convention |
|------|-----------|
| **Scene** | A Phaser Scene class. Named with `Scene` suffix: `HubScene`, `DungeonScene`. |
| **Content file** | A TypeScript data module in `content/`. Named by category: `ashwake-dungeons.ts`. |
| **Type/Interface** | TypeScript interface in `shared/types/`. One interface per file concept. |
| **ID** | All game object IDs use `kebab-case`. Always a string. Must be unique per domain. |
| **Tag** | A string label in the `tags` array of any game object. Lowercase, hyphenated. |

---

## Out-of-Bounds Terms

The following terms should not appear in game text, NPC dialogue, or lore unless deliberately subverted with in-universe irony:

- "Quest" (use: Contract)
- "Magic" (use: Psi, Resonance, or Void-adjacent)
- "Teleport" (use: Jump, Relay transit)
- "Respawn" (never — use narrative framing)
- "Dungeon Master" (never — use contract giver, handler)
- "Skill tree" (use: abilities, training)
- "Grind" (never in official copy)
