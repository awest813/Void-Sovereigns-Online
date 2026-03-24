// DebugPanel.ts — Toggleable developer debug overlay for Void Sovereigns Online.
//
// Usage: add one line to each scene's create():
//   this._debug = new DebugPanel(this);
// Store the reference in a private field so it isn't GC-ed.
//
// Press F1 to toggle the panel on/off at any time during play.
// The panel is purely additive — it does NOT modify game state.

import { T } from './UITheme';
import { GameState } from '../state/GameState';

const TOGGLE_KEY = 'F1';

export class DebugPanel {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container | null = null;
    private visible = false;
    private readonly keyHandler: () => void;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.keyHandler = () => this.toggle();
        scene.input.keyboard?.on(`keydown-${TOGGLE_KEY}`, this.keyHandler);

        // Clean up when the scene shuts down to avoid duplicate listeners on restart.
        scene.events.once('shutdown', () => {
            scene.input.keyboard?.off(`keydown-${TOGGLE_KEY}`, this.keyHandler);
            this.container?.destroy();
            this.container = null;
        });
    }

    toggle() {
        this.visible = !this.visible;
        if (this.visible) {
            this.render();
        } else {
            this.container?.destroy();
            this.container = null;
        }
    }

    /** Re-render the panel with fresh data (call from scene update if desired). */
    refresh() {
        if (this.visible) this.render();
    }

    private render() {
        this.container?.destroy();

        const scene = this.scene;
        const gs = GameState.get();
        const c = scene.add.container(0, 0).setDepth(9999);
        this.container = c;

        const panelW = 340;
        const panelH = 440;
        const panelX = 1024 - panelW / 2 - 6;
        const panelY = panelH / 2 + 6;

        // Background + border
        c.add(scene.add.rectangle(panelX, panelY, panelW, panelH, T.debugBg, 0.93)
            .setStrokeStyle(1, T.border));

        // Title bar
        c.add(scene.add.rectangle(panelX, panelY - panelH / 2 + 12, panelW, 24, 0x0a0a22)
            .setStrokeStyle(1, T.border));
        c.add(scene.add.text(panelX - panelW / 2 + 8, panelY - panelH / 2 + 3, 'DEBUG  —  F1 to close', {
            fontFamily: 'monospace', fontSize: 11, color: T.textWarn,
        }));

        // Close button
        const closeBtn = scene.add.text(panelX + panelW / 2 - 8, panelY - panelH / 2 + 3, '✕', {
            fontFamily: 'Arial', fontSize: 12, color: T.textSecond,
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerover', () => closeBtn.setColor(T.textDanger));
        closeBtn.on('pointerout',  () => closeBtn.setColor(T.textSecond));
        closeBtn.on('pointerdown', () => this.toggle());
        c.add(closeBtn);

        // Content lines
        const activeContracts = gs.contracts.filter(ct => ct.accepted && !ct.turnedIn);
        const readyContracts  = gs.contracts.filter(ct => ct.completed && !ct.turnedIn);

        const activeFlags = Object.entries(gs.flags).filter(([, v]) => v).map(([k]) => k);

        const lines: Array<{ text: string; color?: string }> = [
            { text: `Scene: ${scene.scene.key}`, color: T.textAccent },
            { text: '' },
            { text: '── Player ──────────────', color: T.textWarn },
            { text: `Credits:   ${gs.credits}c` },
            { text: `XP:        ${gs.xp}  (Lv ${gs.level})` },
            { text: `Pilot HP:  ${gs.pilotHull} / ${gs.pilotMaxHull}`, color: gs.pilotHull < gs.pilotMaxHull * 0.4 ? T.textDanger : undefined },
            { text: '' },
            { text: '── Ship ────────────────', color: T.textWarn },
            { text: `Hull:      ${gs.shipHull} / ${gs.shipMaxHull}`, color: gs.shipHull < gs.shipMaxHull * 0.4 ? T.textDanger : undefined },
            { text: `Fuel:      ${gs.shipFuel} / ${gs.shipMaxFuel}`, color: gs.shipFuel < 4 ? T.textDanger : undefined },
            { text: `Ship ID:   ${gs.activeShipId}` },
            { text: `Relay:     ${GameState.isRelayCapable() ? '✓ YES' : '✗ no'}`, color: GameState.isRelayCapable() ? T.textSuccess : T.textSecond },
            { text: `Upgrades:  ${gs.installedUpgrades.length > 0 ? gs.installedUpgrades.join(', ') : 'none'}`, color: T.textSecond },
            { text: '' },
            { text: '── Contracts ───────────', color: T.textWarn },
            { text: `Active:    ${activeContracts.length}` },
            { text: `Ready:     ${readyContracts.length}`, color: readyContracts.length > 0 ? T.textSuccess : undefined },
            { text: `Turned in: ${gs.contracts.filter(ct => ct.turnedIn).length}` },
            { text: '' },
            { text: '── Inventory ───────────', color: T.textWarn },
            ...gs.inventory.slice(0, 5).map(item => ({
                text: `  ${item.name.padEnd(20)} x${item.qty}`,
            })),
            gs.inventory.length > 5 ? { text: `  +${gs.inventory.length - 5} more items`, color: T.textSecond } : { text: '' },
            { text: '' },
            { text: '── Flags ───────────────', color: T.textWarn },
            ...(activeFlags.length > 0
                ? activeFlags.map(k => ({ text: `  ✓ ${k}`, color: T.textSuccess }))
                : [{ text: '  (none)', color: T.textMuted }]),
        ];

        const startY = panelY - panelH / 2 + 28;
        const lineH  = 13;
        lines.forEach((line, i) => {
            c.add(scene.add.text(
                panelX - panelW / 2 + 10,
                startY + i * lineH,
                line.text,
                { fontFamily: 'monospace', fontSize: 11, color: line.color ?? T.textSecond },
            ));
        });
    }
}
