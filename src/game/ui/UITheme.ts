// UITheme.ts — Shared design tokens for all Phaser scenes in Void Sovereigns Online.
//
// Art direction: cold void terminus · electric signal noise · neon noir transit
//                deep-space isolation · sharp contrast · electric derelict
//
// Import at the top of each scene:
//   import { T } from '../ui/UITheme';
// Then replace the local `const C = { ... }` block with:
//   const C = T; (Hub/SectorMap)
// or extend with scene-specific overrides:
//   const C = { ...T, bg: T.bgDeep, ... };

export const T = {
    // ── Backgrounds (Phaser numeric) ──────────────────────────────────────
    /** Station interior — cold near-black with faint blue undertone. */
    bg:           0x04060e,
    /** Deep-space void — cold pitch-black for dungeon / sector-map scenes. */
    bgDeep:       0x020308,
    panelBg:      0x080d18,  // panel / card fill — dark cold navy
    panelDark:    0x050911,  // inner rows — near-black cold navy
    panelMid:     0x060a14,  // mid-dark panel (Dungeon scene panels)

    // ── Debug overlay ─────────────────────────────────────────────────────
    /** Near-black — used for the debug overlay background. */
    debugBg:       0x020306,
    /** Dark navy — used for the debug panel title bar. */
    debugTitleBg:  0x050a20,
    border:        0x1a2d48,  // steel-blue panel border
    borderFaint:   0x0e1c2e,  // faint cold border (Dungeon atmosphere)
    borderSuccess: 0x0a3020,  // dark teal border

    // ── Text colours (hex strings for Phaser Text objects) ────────────────
    textPrimary:  '#c0d8f0',  // ice white — cool off-white
    textSecond:   '#4a6880',  // steel blue-gray
    textMuted:    '#243040',  // dark cool gray
    textAccent:   '#00c8ff',  // electric cyan — primary UI accent
    textWarn:     '#ff9922',  // vivid amber-orange — hazard marking
    textDanger:   '#ff2244',  // hot neon red — critical threat
    textSuccess:  '#00ee77',  // neon green — healthy / success

    // ── Button colours ────────────────────────────────────────────────────
    btnNormal:    '#4a6880',  // steel blue-gray
    btnHover:     '#c0e8ff',  // ice blue
    btnAccent:    '#00c8ff',  // electric cyan — matches textAccent

    // ── Status bars (Phaser numeric) ──────────────────────────────────────
    barFull:      0x00aa66,  // neon tactical green — alias for barHull
    barHull:      0x00aa66,  // hull bar full health
    barDamaged:   0xcc4400,  // bright orange-red — damaged hull
    barCritical:  0xcc0030,  // neon red — critical hull
    barFuel:      0x0077bb,  // electric blue — fuel / energy
    barEnemy:     0xaa1a00,  // threat red — enemy HP

    // ── Progress bar tracks (Phaser numeric) ─────────────────────────────
    /** Default progress bar track — dark cold charcoal. */
    barBg:          0x080c14,
    /** Hull bar track — dark cold green-black. */
    barBgHull:      0x071008,
    /** Fuel bar track — dark cold blue-black. */
    barBgFuel:      0x060a14,
    /** Upgrade path progress fill — electric blue. */
    upgradeProgress: 0x0088cc,

    // ── Status highlights (Phaser numeric) ───────────────────────────────
    /** Active milestone / relay-unlocked highlight fill — dark teal-black. */
    highlightActiveBg:     0x040e10,
    /** Active milestone border — muted electric teal. */
    highlightActiveBorder: 0x0a4830,

    // ── Redline system (high-risk contracts / runs) ───────────────────────
    /** Redline modal / panel background — deep crimson-tinted black. */
    redlinePanelBg:  0x0c0508,
    /** Redline contract row tint — lighter crimson-tinted charcoal. */
    redlineRowBg:    0x160810,
    /** Redline border — vivid threat magenta-red. */
    redlineBorder:   0x880030,
    /** Redline label text — hot neon red. */
    redlineText:     '#ff1155',
    /** Redline subdued text — darker neon red. */
    redlineTextDim:  '#cc2244',
    /** Redline launch / confirm button — electric red. */
    redlineBtn:      '#ff0044',
    /** Secured / extracted-alive status — neon green. */
    redlineSecured:  '#00ffaa',
    /** Insurance active indicator — neon teal. */
    redlineInsure:   '#00ffcc',
    /** Item-lost indicator — vivid orange-red. */
    redlineLoss:     '#ff3322',

    // ── Ghost site — Transit Node Zero (Phase 6) ──────────────────────────
    /** Ghost site panel background — deep void-purple black. */
    ghostPanelBg:  0x060408,
    /** Ghost site border — bright deep purple. */
    ghostBorder:   0x5a1888,
    /** Ghost site label text — vivid neon purple. */
    ghostText:     '#aa44dd',
    /** Ghost site dim text — muted purple. */
    ghostTextDim:  '#7a2299',

    // ── Ashveil Observation Post — void-adjacent Redline (Phase 5) ────────
    /** Ashveil panel background — very dark crimson-void. */
    ashveilPanelBg: 0x080406,
    /** Ashveil border — vivid rose-red. */
    ashveilBorder:  0x881040,
    /** Ashveil label text — bright neon rose. */
    ashveilText:    '#cc2266',
    /** Ashveil dim text — muted dark rose. */
    ashveilTextDim: '#aa1055',

    // ── Index Chamber — Null Architect contact site (Phase 8) ─────────────
    /** Index Chamber panel background — deep void-teal black. */
    indexPanelBg:  0x040c0e,
    /** Index Chamber border — bright electric teal. */
    indexBorder:   0x0a5a48,
    /** Index Chamber label text — neon teal. */
    indexText:     '#00ccaa',
    /** Index Chamber dim text — muted teal. */
    indexTextDim:  '#009977',

    // ── Cycle Archive — Null Architect terminal site (Phase 9) ────────────
    /** Cycle Archive panel background — deep void-violet black. */
    cyclePanelBg:  0x060408,
    /** Cycle Archive border — bright electric violet. */
    cycleBorder:   0x4a1078,
    /** Cycle Archive label text — vivid neon violet. */
    cycleText:     '#9944ee',
    /** Cycle Archive dim text — muted violet. */
    cycleTextDim:  '#7722bb',

    // ── Sovereign Threshold — Null Architect final resolution site (Phase 10) ──
    /** Sovereign Threshold panel background — near-black with gold undertone. */
    sovereignPanelBg:  0x080700,
    /** Sovereign Threshold border — vivid amber-gold. */
    sovereignBorder:   0x664400,
    /** Sovereign Threshold label text — bright gold. */
    sovereignText:     '#ffaa00',
    /** Sovereign Threshold dim text — muted amber. */
    sovereignTextDim:  '#cc8800',

    // ── Origin Node — Null Architect first record site (Phase 11) ─────────
    /** Origin Node panel background — near-black with rust undertone. */
    originPanelBg:  0x080400,
    /** Origin Node border — vivid rust-copper. */
    originBorder:   0x662a00,
    /** Origin Node label text — bright copper-orange. */
    originText:     '#ff6622',
    /** Origin Node dim text — muted dark copper. */
    originTextDim:  '#cc4400',

    // ── ASCII Dungeon Terminal ────────────────────────────────────────────
    /** Terminal grid cell background — charcoal-black. */
    termBg:          0x080a0e,
    /** Terminal grid frame border — gunmetal. */
    termFrame:       0x1a2838,
    /** Terminal floor tile — dark teal. */
    termFloor:       '#1a2828',
    /** Terminal wall tile — steel blue-gray. */
    termWall:        '#2a3848',
    /** Terminal default symbol — green terminal text. */
    termGreen:       '#00ee77',
    /** Terminal amber — hazards, warnings. */
    termAmber:       '#ffaa22',
    /** Terminal cyan — interactables, relays, info. */
    termCyan:        '#00c8ff',
    /** Terminal red — enemies, danger. */
    termRed:         '#ff2244',
    /** Terminal white — player, highlighted. */
    termWhite:       '#e0f0ff',
    /** Terminal dim — unexplored, faded. */
    termDim:         '#1a2838',
    /** Terminal violet — anomalies, void fractures. */
    termViolet:      '#aa44dd',
    /** Terminal gold — loot, credits, salvage. */
    termGold:        '#ffdd44',
} as const;
