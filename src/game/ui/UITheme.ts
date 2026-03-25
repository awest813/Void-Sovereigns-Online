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
    /** Near-black — used for the debug overlay background. */
    debugBg:       0x020100,
    /** Dark navy — used for the debug panel title bar. */
    debugTitleBg:  0x0a0a22,
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

    // ── Progress bar tracks (Phaser numeric) ─────────────────────────────
    /** Default progress bar track — dark warm charcoal. */
    barBg:          0x110f0c,
    /** Hull bar track — warm dark brown. */
    barBgHull:      0x1e1a10,
    /** Fuel bar track — dark navy. */
    barBgFuel:      0x101820,
    /** Upgrade path progress fill — warm bronze. */
    upgradeProgress: 0x9a6818,

    // ── Status highlights (Phaser numeric) ───────────────────────────────
    /** Active milestone / relay-unlocked highlight fill — dark tactical green. */
    highlightActiveBg:     0x0a100a,
    /** Active milestone border — muted tactical green. */
    highlightActiveBorder: 0x3a6030,

    // ── Redline system (high-risk contracts / runs) ───────────────────────
    /** Redline modal / panel background — deep blood-tinted black. */
    redlinePanelBg:  0x0b0808,
    /** Redline contract row tint — lighter blood-tinted charcoal. */
    redlineRowBg:    0x130808,
    /** Redline border — muted threat red. */
    redlineBorder:   0x702020,
    /** Redline label text — muted brick red. */
    redlineText:     '#c03028',
    /** Redline subdued text — darker muted orange-brown. */
    redlineTextDim:  '#a05038',
    /** Redline launch / confirm button — bright warm red. */
    redlineBtn:      '#ff4422',
    /** Secured / extracted-alive status — bright tactical green. */
    redlineSecured:  '#44ff88',
    /** Insurance active indicator — bright teal. */
    redlineInsure:   '#44ffaa',
    /** Item-lost indicator — bright orange-red. */
    redlineLoss:     '#ff5533',

    // ── Ghost site — Transit Node Zero (Phase 6) ──────────────────────────
    /** Ghost site panel background — deep void-purple black. */
    ghostPanelBg:  0x070408,
    /** Ghost site border — deep purple. */
    ghostBorder:   0x401860,
    /** Ghost site label text — medium purple. */
    ghostText:     '#8860a8',
    /** Ghost site dim text — dark purple. */
    ghostTextDim:  '#6840a0',

    // ── Ashveil Observation Post — void-adjacent Redline (Phase 5) ────────
    /** Ashveil panel background — very dark void-purple. */
    ashveilPanelBg: 0x090608,
    /** Ashveil border — purple-red. */
    ashveilBorder:  0x601830,
    /** Ashveil label text — muted rose-purple. */
    ashveilText:    '#904060',
    /** Ashveil dim text — dark rose-purple. */
    ashveilTextDim: '#783050',

    // ── Index Chamber — Null Architect contact site (Phase 8) ─────────────
    /** Index Chamber panel background — deep void-teal black. */
    indexPanelBg:  0x040b0a,
    /** Index Chamber border — cold dark teal. */
    indexBorder:   0x1a4838,
    /** Index Chamber label text — cool teal. */
    indexText:     '#3a9878',
    /** Index Chamber dim text — muted dark teal. */
    indexTextDim:  '#2a7058',
} as const;
