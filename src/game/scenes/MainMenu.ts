import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GameState } from '../state/GameState';
import { T } from '../ui/UITheme';
import { DebugPanel } from '../ui/DebugPanel';

// MainMenu: title screen with game logo and start prompt.
export class MainMenu extends Scene
{
    private debugPanel?: DebugPanel;
    private sceneChanging = false;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const w = this.scale.width;
        const h = this.scale.height;
        const cx = w / 2;
        const cy = h / 2;

        // Visual layer depth constants
        const DEPTH_UI        = 100;
        const DEPTH_VIGNETTE  = 150;
        const DEPTH_SCANLINES = 200;

        // Scan-line parameters
        const SCANLINE_INTERVAL_PX   = 3;
        const PROMPT_PULSE_DURATION_MS = 1100;

        this.add.image(cx, cy, 'background').setAlpha(0.45);

        // Subtle scan-line overlay (every SCANLINE_INTERVAL_PX horizontal line at low opacity)
        const scanlines = this.add.graphics().setDepth(DEPTH_SCANLINES).setAlpha(0.10);
        scanlines.fillStyle(0x000000, 1);
        for (let y = 0; y < h; y += SCANLINE_INTERVAL_PX) {
            scanlines.fillRect(0, y, w, 1);
        }

        // Vignette — dark gradient corners
        const vignette = this.add.graphics().setDepth(DEPTH_VIGNETTE).setAlpha(0.55);
        vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.9, 0.9, 0, 0);
        vignette.fillRect(0, 0, w, h * 0.25);
        vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.9, 0.9);
        vignette.fillRect(0, h * 0.75, w, h * 0.25);

        // Game title treatment
        const gfx = this.add.graphics().setDepth(DEPTH_UI);
        const titleTopY = Math.round(h * 0.32);
        const titleBottomY = titleTopY + 96;
        const titleLineW = Math.min(460, Math.round(w * 0.72));
        const bracketSize = 14;

        // Corner brackets — top-left, top-right, bottom-left, bottom-right
        const bx0 = cx - titleLineW / 2;
        const bx1 = cx + titleLineW / 2;
        const by0 = titleTopY - 6;
        const by1 = titleBottomY + 6;

        // Cyan outer brackets
        gfx.lineStyle(1, 0x00c8ff, 0.55);
        // Top-left
        gfx.lineBetween(bx0, by0, bx0 + bracketSize, by0);
        gfx.lineBetween(bx0, by0, bx0, by0 + bracketSize);
        // Top-right
        gfx.lineBetween(bx1 - bracketSize, by0, bx1, by0);
        gfx.lineBetween(bx1, by0, bx1, by0 + bracketSize);
        // Bottom-left
        gfx.lineBetween(bx0, by1, bx0 + bracketSize, by1);
        gfx.lineBetween(bx0, by1 - bracketSize, bx0, by1);
        // Bottom-right
        gfx.lineBetween(bx1 - bracketSize, by1, bx1, by1);
        gfx.lineBetween(bx1, by1 - bracketSize, bx1, by1);

        // Centre horizontal rules (faint)
        gfx.lineStyle(1, 0x1a2d48, 0.70);
        gfx.lineBetween(bx0 + bracketSize + 8, by0, bx1 - bracketSize - 8, by0);
        gfx.lineBetween(bx0 + bracketSize + 8, by1, bx1 - bracketSize - 8, by1);

        // Title glow layer (wider, transparent — gives neon-bloom feel)
        this.add.text(cx, titleTopY + 48, 'VOID SOVEREIGNS', {
            fontFamily: 'Arial Black',
            fontSize: 54,
            color: '#003c4a',
            stroke: '#00c8ff',
            strokeThickness: 18,
            align: 'center',
        }).setOrigin(0.5).setDepth(DEPTH_UI - 1).setAlpha(0.35);

        // Title main layer
        this.add.text(cx, titleTopY + 48, 'VOID SOVEREIGNS', {
            fontFamily: 'Arial Black',
            fontSize: 54,
            color: T.textPrimary,
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
        }).setOrigin(0.5).setDepth(DEPTH_UI);

        // Sub-title
        this.add.text(cx, titleBottomY + 8, 'O  N  L  I  N  E', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: T.textAccent,
            align: 'center',
        }).setOrigin(0.5).setDepth(DEPTH_UI);

        // Prompt — with pulsing alpha tween
        const prompt = this.add.text(cx, Math.round(h * 0.57), 'PRESS ANY KEY TO DOCK AT MERIDIAN STATION', {
            fontFamily: 'Arial',
            fontSize: 14,
            color: T.textSecond,
            align: 'center',
            letterSpacing: 2,
        }).setOrigin(0.5).setDepth(DEPTH_UI);

        this.tweens.add({
            targets: prompt,
            alpha: { from: 1, to: 0.25 },
            duration: PROMPT_PULSE_DURATION_MS,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        this.debugPanel = new DebugPanel(this);

        this.input.keyboard?.once('keydown', () => this.changeScene());
        this.input.once('pointerdown', () => this.changeScene());

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        if (this.sceneChanging) return;
        this.sceneChanging = true;
        // First-time players get the tutorial; returning players go straight to the Hub.
        if (!GameState.get().tutorialSeen) {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Tutorial');
            });
        } else {
            this.scene.start('Hub');
        }
    }
}
