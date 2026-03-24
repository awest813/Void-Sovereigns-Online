// UITheme.ts — Shared design tokens for all Phaser scenes in Void Sovereigns Online.
//
// Import at the top of each scene:
//   import { T } from '../ui/UITheme';
// Then replace the local `const C = { ... }` block with:
//   const C = T; (Hub/SectorMap)
// or extend with scene-specific overrides:
//   const C = { ...T, bg: T.bgDeep, ... };

export const T = {
    // ── Backgrounds (Phaser numeric) ──────────────────────────────────────
    /** Station interior background (Hub, main menus). */
    bg:           0x080818,
    /** Deep-space background for outdoor/dungeon/sector-map scenes. */
    bgDeep:       0x04070f,
    panelBg:      0x0d0d22,  // panel / card fill
    panelDark:    0x0a0a1a,  // inner rows (shop items, log blocks)
    panelMid:     0x0a0d16,  // mid-dark panel (Dungeon scene panels)

    // ── Debug overlay ─────────────────────────────────────────────────────
    /** Near-black with slight blue tint — used for the debug overlay. */
    debugBg:      0x000010,
    border:        0x223355,  // standard panel border (Hub / SectorMap)
    borderFaint:   0x1a2a3a,  // subtle border (Dungeon atmosphere)
    borderSuccess: 0x335544,  // relay / positive highlight

    // ── Text colours (hex strings for Phaser Text objects) ────────────────
    textPrimary:  '#e8e0cc',
    textSecond:   '#888899',
    textMuted:    '#555566',
    textAccent:   '#5599ee',
    textWarn:     '#dd9944',
    textDanger:   '#dd4444',
    textSuccess:  '#44cc88',

    // ── Button colours ────────────────────────────────────────────────────
    btnNormal:    '#aabbcc',
    btnHover:     '#ffffff',
    btnAccent:    '#55aaff',

    // ── Status bars (Phaser numeric) ──────────────────────────────────────
    barFull:      0x44aa66,  // hull/HP OK — alias for barHull
    barHull:      0x44aa66,  // hull bar full health
    barDamaged:   0xcc6622,  // hull bar damaged
    barCritical:  0xcc3322,  // hull bar critical
    barFuel:      0x4488cc,  // fuel / energy bar
    barEnemy:     0xcc4422,  // enemy HP bar
} as const;
