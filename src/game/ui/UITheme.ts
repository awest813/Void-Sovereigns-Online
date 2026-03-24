// UITheme.ts — Shared design tokens for all Phaser scenes in Void Sovereigns Online.
//
// Art direction: 90s anime space opera · NASA-industrial hardware · analog tactical UI
//                worn militarized future · quiet melancholy · restrained palette
//
// Import at the top of each scene:
//   import { T } from '../ui/UITheme';
// Then replace the local `const C = { ... }` block with:
//   const C = T; (Hub/SectorMap)
// or extend with scene-specific overrides:
//   const C = { ...T, bg: T.bgDeep, ... };

export const T = {
    // ── Backgrounds (Phaser numeric) ──────────────────────────────────────
    /** Station interior — warm near-black with faint olive undertone. */
    bg:           0x08070a,
    /** Deep-space void — warmer pitch-black for dungeon / sector-map scenes. */
    bgDeep:       0x050403,
    panelBg:      0x0e0c09,  // panel / card fill — dark worn charcoal
    panelDark:    0x0b0a08,  // inner rows — near-black charcoal
    panelMid:     0x0d0c0a,  // mid-dark panel (Dungeon scene panels)

    // ── Debug overlay ─────────────────────────────────────────────────────
    /** Near-black — used for the debug overlay. */
    debugBg:      0x020100,
    border:        0x2c2818,  // weathered bronze-olive panel border
    borderFaint:   0x1e1c14,  // dark olive faint border (Dungeon atmosphere)
    borderSuccess: 0x283820,  // muted tactical-green border

    // ── Text colours (hex strings for Phaser Text objects) ────────────────
    textPrimary:  '#cfc5a8',  // aged paper — warm off-white
    textSecond:   '#7a7160',  // warm olive-gray
    textMuted:    '#4a4438',  // dark warm-gray
    textAccent:   '#c89040',  // amber — analog CRT phosphor / NASA panel
    textWarn:     '#b8722a',  // burnt orange — worn hazard marking
    textDanger:   '#a03428',  // muted brick red
    textSuccess:  '#607a48',  // tactical olive-green

    // ── Button colours ────────────────────────────────────────────────────
    btnNormal:    '#908070',  // warm weathered gray
    btnHover:     '#ddd0b4',  // warm cream
    btnAccent:    '#c89040',  // amber — matches textAccent

    // ── Status bars (Phaser numeric) ──────────────────────────────────────
    barFull:      0x4a7a3c,  // muted tactical olive-green — alias for barHull
    barHull:      0x4a7a3c,  // hull bar full health
    barDamaged:   0x8a4820,  // burnt sienna — damaged hull
    barCritical:  0x7a2820,  // muted dark red — critical hull
    barFuel:      0x3a5870,  // muted steel blue — fuel / energy
    barEnemy:     0x8a3020,  // muted threat red — enemy HP
} as const;
