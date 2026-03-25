import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { T } from '../ui/UITheme';
import { DebugPanel } from '../ui/DebugPanel';

// MainMenu: title screen with game logo and start prompt.
export class MainMenu extends Scene
{
    private debugPanel?: DebugPanel;

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

        this.add.image(cx, cy, 'background').setAlpha(0.6);

        // Game title treatment
        const gfx = this.add.graphics().setDepth(100);
        gfx.lineStyle(1, T.border, 0.45);
        const titleTopY = Math.round(h * 0.32);
        const titleBottomY = titleTopY + 92;
        const titleLineW = Math.min(440, Math.round(w * 0.7));
        gfx.lineBetween(cx - titleLineW / 2, titleTopY, cx + titleLineW / 2, titleTopY);
        gfx.lineBetween(cx - titleLineW / 2, titleBottomY, cx + titleLineW / 2, titleBottomY);

        this.add.text(cx, titleTopY + 46, 'VOID SOVEREIGNS', {
            fontFamily: 'Arial Black',
            fontSize: 52,
            color: T.textPrimary,
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
        }).setOrigin(0.5).setDepth(100);

        this.add.text(cx, titleBottomY + 6, 'O  N  L  I  N  E', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: T.textAccent,
            align: 'center',
        }).setOrigin(0.5).setDepth(100);

        this.add.text(cx, Math.round(h * 0.56), 'Press any key to dock at Meridian Station', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: T.textSecond,
            align: 'center',
        }).setOrigin(0.5).setDepth(100);

        this.debugPanel = new DebugPanel(this);

        this.input.keyboard?.once('keydown', () => this.changeScene());
        this.input.once('pointerdown', () => this.changeScene());

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Hub');
    }
}
