/**
 * AsciiRoomRenderer — Renders a styled ASCII tactical terminal view of a dungeon room.
 *
 * The renderer draws:
 *   1. A terminal-style frame with scanline effect
 *   2. The ASCII grid with per-symbol coloring
 *   3. A symbol legend sidebar
 *   4. Interactable highlights (clickable symbols)
 *
 * Design: "styled ASCII tactical dungeon view" — black/charcoal/gunmetal background,
 * green/amber/cyan/red terminal colors, chunky UI frame, animated scanline.
 */
import Phaser from 'phaser';
import { T } from './UITheme';
import { Room, RoomInteractable } from '../data/dungeons';
import { ZoneTheme } from '../data/AsciiZoneThemes';

// ── Symbol → colour mapping ──────────────────────────────────────────────────

/** Returns the terminal color string for a given ASCII map symbol, optionally themed. */
function symbolColor(ch: string, theme?: ZoneTheme): string {
    switch (ch) {
        // Structural — use zone theme colors when available
        case '#': return theme?.wallColor ?? T.termWall;
        case '.': return theme?.floorColor ?? T.termFloor;
        case '+': return theme?.doorColor ?? T.termCyan;
        case '=': return theme?.floorColor ?? T.termFloor;
        case '>': return T.termGreen;
        case '<': return T.termAmber;
        case '@': return T.termWhite;

        // Interactables — use zone theme
        case 'T': return theme?.interactColor ?? T.termCyan;
        case 'C': return T.termGold;
        case 'R': return theme?.interactColor ?? T.termCyan;
        case 'V': return T.termViolet;

        // Hazards / pickups — use zone theme
        case '^': return theme?.hazardColor ?? T.termAmber;
        case '!': return T.termGreen;
        case '$': return T.termGold;
        case '?': return T.termViolet;

        // Enemies — use zone theme
        case 'd': return theme?.enemyColor ?? T.termRed;
        case 'r': return theme?.enemyColor ?? T.termRed;
        case 's': return theme?.enemyColor ?? T.termRed;
        case 'A': return theme?.enemyColor ?? T.termRed;
        case 'B': return theme?.enemyColor ?? T.termRed;

        // Whitespace / unknown
        case ' ': return 'transparent';
        default:  return T.termDim;
    }
}

/** Returns a human-readable default legend label for built-in symbols. */
function defaultLegend(ch: string): string {
    switch (ch) {
        case '@': return 'You';
        case '.': return 'Open floor';
        case '#': return 'Wall / structure';
        case '+': return 'Door / hatch';
        case '=': return 'Corridor';
        case '>': return 'Exit / descent';
        case '<': return 'Fallback route';
        case '!': return 'Consumable';
        case '$': return 'Salvage / credits';
        case '?': return 'Unknown signal';
        case '^': return 'Hazard / trap';
        case 'd': return 'Drone';
        case 'r': return 'Raider';
        case 's': return 'Sentinel';
        case 'A': return 'Elite anomaly';
        case 'B': return 'Boss';
        case 'T': return 'Terminal';
        case 'C': return 'Crate';
        case 'R': return 'Relay node';
        case 'V': return 'Void fracture';
        default:  return ch;
    }
}

// ── Render configuration ─────────────────────────────────────────────────────

/** Pixel size of each grid cell. */
const CELL_SIZE = 22;
/** Font size for grid symbols. */
const CELL_FONT = 16;
/** Font used for the monospace grid. */
const MONO_FONT = '"Courier New", Courier, monospace';
/** Padding inside the terminal frame. */
const FRAME_PAD = 10;
/** Legend font size. */
const LEGEND_FONT = 11;
/** Hex color for movable-cell highlights (green). */
const MOVABLE_CELL_COLOR = 0x00ee77;

// ── Public API ───────────────────────────────────────────────────────────────

export interface AsciiRenderResult {
    /** The Phaser container holding all rendered objects. */
    container: Phaser.GameObjects.Container;
    /** Width of the rendered terminal (frame included). */
    width: number;
    /** Height of the rendered terminal (frame included). */
    height: number;
}

/**
 * Optional rendering extensions for movement and fog-of-war.
 */
export interface AsciiRenderOptions {
    /**
     * Fog-of-war state indexed [row][col].
     * Cells where revealed[r][c] is false are rendered dim and unidentified.
     * If omitted, all cells render at full visibility.
     */
    revealed?: boolean[][];
    /**
     * Set of "row,col" keys for floor cells the player can move to.
     * These cells receive a subtle green highlight and a click handler.
     */
    movableCells?: Set<string>;
    /** Called with the row and column when the player clicks a movable cell. */
    onMove?: (row: number, col: number) => void;
}

/**
 * Render an ASCII room grid inside a Phaser scene.
 *
 * @param scene  The active Phaser scene.
 * @param room   The Room data (must have asciiMap populated).
 * @param x      Top-left X position for the terminal frame.
 * @param y      Top-left Y position for the terminal frame.
 * @param onInteract  Optional callback when a player clicks an interactable symbol.
 * @param zoneTheme   Optional zone-specific color palette.
 * @param options     Optional fog-of-war and movement configuration.
 * @returns An AsciiRenderResult with the container and dimensions.
 */
export function renderAsciiRoom(
    scene: Phaser.Scene,
    room: Room,
    x: number,
    y: number,
    onInteract?: (interactable: RoomInteractable) => void,
    zoneTheme?: ZoneTheme,
    options?: AsciiRenderOptions,
): AsciiRenderResult {
    const container = scene.add.container(x, y);
    const grid = room.asciiMap ?? [];
    if (grid.length === 0) {
        return { container, width: 0, height: 0 };
    }

    const rows = grid.length;
    const cols = Math.max(...grid.map(r => r.length));
    const gridW = cols * CELL_SIZE;
    const gridH = rows * CELL_SIZE;

    // ── Build legend entries ─────────────────────────────────────────────
    const usedSymbols = new Set<string>();
    for (const row of grid) {
        for (const ch of row) {
            if (ch !== ' ' && ch !== '.') usedSymbols.add(ch);
        }
    }
    // Always include floor/wall for context
    usedSymbols.add('.');
    usedSymbols.add('#');

    const customLegend = room.legend ?? {};

    // Interactable symbols for legend click-indicator (► marker).
    // Each distinct ASCII symbol is assumed to represent one interactable type —
    // if a symbol appears at any interactable position it is marked as clickable in the legend.
    const interactableSymbols = new Set<string>(
        (room.interactables ?? []).map(ia => {
            const row = room.asciiMap?.[ia.row] ?? '';
            return row[ia.col] ?? '';
        }).filter(Boolean),
    );

    interface LegendEntry { symbol: string; label: string; color: string; clickable?: boolean }
    interface LegendSection { header: string; entries: LegendEntry[] }

    // Symbol groups — structural, interactive, threats
    const STRUCTURAL_SYMS  = ['@', '.', '#', '+', '=', '>', '<'];
    const TACTICAL_SYMS    = ['T', 'C', 'R', '!', '$', '^', '?', 'V'];
    const THREAT_SYMS      = ['d', 'r', 's', 'A', 'B'];

    const buildSection = (syms: string[]): LegendEntry[] => {
        const entries: LegendEntry[] = [];
        for (const sym of syms) {
            if (!usedSymbols.has(sym)) continue;
            // Use zone-theme symbol overrides for the visual symbol in legend
            let displaySym = sym;
            if (sym === '#' && zoneTheme?.wallSymbol) displaySym = zoneTheme.wallSymbol;
            if (sym === '.' && zoneTheme?.floorSymbol) displaySym = zoneTheme.floorSymbol;
            entries.push({
                symbol: displaySym,
                label: customLegend[sym] ?? defaultLegend(sym),
                color: symbolColor(sym, zoneTheme),
                clickable: interactableSymbols.has(sym),
            });
        }
        return entries;
    };

    // Custom symbols not in any standard group
    const allStandardSyms = [...STRUCTURAL_SYMS, ...TACTICAL_SYMS, ...THREAT_SYMS];
    const extraEntries: LegendEntry[] = [];
    for (const sym of usedSymbols) {
        if (!allStandardSyms.includes(sym)) {
            extraEntries.push({
                symbol: sym,
                label: customLegend[sym] ?? sym,
                color: symbolColor(sym, zoneTheme),
                clickable: interactableSymbols.has(sym),
            });
        }
    }

    const legendSections: LegendSection[] = [
        { header: 'STRUCTURAL', entries: buildSection(STRUCTURAL_SYMS) },
        { header: 'TACTICAL',   entries: buildSection(TACTICAL_SYMS) },
        { header: 'THREATS',    entries: buildSection(THREAT_SYMS) },
    ].filter(s => s.entries.length > 0);
    if (extraEntries.length > 0) legendSections.push({ header: 'OTHER', entries: extraEntries });

    const legendW = 160;
    const totalW = gridW + FRAME_PAD * 3 + legendW;
    const totalH = gridH + FRAME_PAD * 2;

    // ── Terminal frame background ────────────────────────────────────────
    container.add(
        scene.add.rectangle(totalW / 2, totalH / 2, totalW, totalH, T.termBg)
            .setStrokeStyle(2, T.termFrame),
    );

    // Subtle inner grid background
    container.add(
        scene.add.rectangle(
            FRAME_PAD + gridW / 2,
            FRAME_PAD + gridH / 2,
            gridW, gridH, 0x040608,
        ).setStrokeStyle(1, T.termFrame),
    );

    // ── Grid scanline overlay (subtle horizontal lines) ──────────────────
    for (let r = 0; r < rows; r++) {
        if (r % 2 === 0) {
            container.add(
                scene.add.rectangle(
                    FRAME_PAD + gridW / 2,
                    FRAME_PAD + r * CELL_SIZE + CELL_SIZE / 2,
                    gridW, CELL_SIZE, 0x000000,
                ).setAlpha(0.12),
            );
        }
    }

    // ── Render grid cells ────────────────────────────────────────────────
    // Build a lookup of interactable positions for click handling
    const interactableMap = new Map<string, RoomInteractable>();
    if (room.interactables) {
        for (const ia of room.interactables) {
            interactableMap.set(`${ia.row},${ia.col}`, ia);
        }
    }

    for (let r = 0; r < rows; r++) {
        const rowStr = grid[r] ?? '';
        for (let c = 0; c < cols; c++) {
            const ch = c < rowStr.length ? rowStr[c] : ' ';
            if (ch === ' ') continue;

            const cx = FRAME_PAD + c * CELL_SIZE + CELL_SIZE / 2;
            const cy = FRAME_PAD + r * CELL_SIZE + CELL_SIZE / 2;

            // ── Fog-of-war visibility ─────────────────────────────────────
            const isRevealed = !options?.revealed || (options.revealed[r]?.[c] ?? false);
            // Unrevealed cells: render at very low opacity in a near-black tint.
            // Structural tiles (walls, floors) faintly visible so the room shape is hinted.
            const color  = isRevealed ? symbolColor(ch, zoneTheme) : '#1e2232';
            const alpha  = isRevealed ? 1.0 : 0.20;

            // Apply zone-theme symbol overrides for revealed cells.
            // Logical grid always uses '#'/'.' for movement, but the display char
            // can be overridden per zone for visual flavor.
            let displayCh: string;
            if (!isRevealed) {
                // Hint structural shape even when unrevealed
                displayCh = (ch === '#') ? (zoneTheme?.wallSymbol ?? '#') : '?';
            } else if (ch === '#' && zoneTheme?.wallSymbol) {
                displayCh = zoneTheme.wallSymbol;
            } else if (ch === '.' && zoneTheme?.floorSymbol) {
                displayCh = zoneTheme.floorSymbol;
            } else {
                displayCh = ch;
            }

            const txt = scene.add.text(cx, cy, displayCh, {
                fontFamily: MONO_FONT,
                fontSize: CELL_FONT,
                color,
                align: 'center',
            }).setOrigin(0.5).setAlpha(alpha);

            container.add(txt);

            // ── Click-to-move highlight (only on revealed floor tiles) ────
            const cellKey = `${r},${c}`;
            const isMovable = isRevealed && options?.movableCells?.has(cellKey) && options.onMove;
            if (isMovable) {
                const moveHighlight = scene.add.rectangle(cx, cy, CELL_SIZE - 2, CELL_SIZE - 2, MOVABLE_CELL_COLOR)
                    .setAlpha(0.14);
                container.add(moveHighlight);
                scene.tweens.add({
                    targets: moveHighlight,
                    alpha: { from: 0.12, to: 0.30 },
                    duration: 600,
                    yoyo: true,
                    repeat: -1,
                });
                txt.setInteractive({ useHandCursor: true });
                txt.on('pointerover', () => txt.setStyle({ color: `#${MOVABLE_CELL_COLOR.toString(16).padStart(6, '0')}` }));
                txt.on('pointerout',  () => txt.setStyle({ color }));
                txt.on('pointerdown', () => options.onMove!(r, c));
            }

            // ── Interactable highlight (only on revealed, unused interactables) ─
            const ia = interactableMap.get(cellKey);
            if (ia && !ia.used && onInteract && isRevealed) {
                // Highlight interactable cells with a pulsing cyan background
                const highlight = scene.add.rectangle(cx, cy, CELL_SIZE - 2, CELL_SIZE - 2, 0x00c8ff)
                    .setAlpha(0.14);
                container.add(highlight);
                scene.tweens.add({
                    targets: highlight,
                    alpha: { from: 0.12, to: 0.30 },
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                });

                txt.setInteractive({ useHandCursor: true });
                txt.on('pointerover', () => txt.setScale(1.3));
                txt.on('pointerout', () => txt.setScale(1.0));
                txt.on('pointerdown', () => {
                    ia.used = true;
                    onInteract(ia);
                });
            }
        }
    }

    // ── Animated cursor sweep (scanline that scrolls down) ───────────────
    const scanline = scene.add.rectangle(
        FRAME_PAD + gridW / 2,
        FRAME_PAD,
        gridW, 2, 0x00ee77,
    ).setAlpha(0.15);
    container.add(scanline);
    scene.tweens.add({
        targets: scanline,
        y: { from: FRAME_PAD, to: FRAME_PAD + gridH },
        duration: 3000,
        repeat: -1,
        ease: 'Linear',
    });

    // ── Legend panel ──────────────────────────────────────────────────────
    const legendX = FRAME_PAD * 2 + gridW;
    const legendY = FRAME_PAD;

    container.add(
        scene.add.text(legendX, legendY, 'SCAN LEGEND', {
            fontFamily: 'Arial Black',
            fontSize: LEGEND_FONT,
            color: T.textSecond,
        }),
    );

    // Clickable indicator note
    container.add(
        scene.add.text(legendX, legendY + 12, '► = clickable', {
            fontFamily: 'Arial',
            fontSize: LEGEND_FONT - 1,
            color: T.termCyan,
            fontStyle: 'italic',
        }),
    );

    let legendCursorY = legendY + 26;
    const LEGEND_SECTION_GAP = 4;
    const LEGEND_ENTRY_H     = 15;
    const LEGEND_HEADER_H    = 14;

    for (const section of legendSections) {
        // Section separator + header
        container.add(
            scene.add.rectangle(legendX + 70, legendCursorY + 1, 140, 1, T.borderFaint).setOrigin(0.5, 0),
        );
        legendCursorY += LEGEND_SECTION_GAP;
        container.add(
            scene.add.text(legendX, legendCursorY, section.header, {
                fontFamily: 'Arial Black',
                fontSize: LEGEND_FONT - 1,
                color: T.textMuted,
            }),
        );
        legendCursorY += LEGEND_HEADER_H;

        for (const entry of section.entries) {
            container.add(
                scene.add.text(legendX, legendCursorY, entry.symbol, {
                    fontFamily: MONO_FONT,
                    fontSize: LEGEND_FONT + 1,
                    color: entry.color,
                }),
            );
            // Show ► indicator for clickable interactable symbols
            const labelX = legendX + (entry.clickable ? 28 : 16);
            if (entry.clickable) {
                container.add(
                    scene.add.text(legendX + 14, legendCursorY, '►', {
                        fontFamily: 'Arial',
                        fontSize: LEGEND_FONT - 1,
                        color: T.termCyan,
                    }),
                );
            }
            container.add(
                scene.add.text(labelX, legendCursorY, entry.label, {
                    fontFamily: 'Arial',
                    fontSize: LEGEND_FONT,
                    color: T.textSecond,
                }),
            );
            legendCursorY += LEGEND_ENTRY_H;
        }
    }

    return { container, width: totalW, height: totalH };
}
