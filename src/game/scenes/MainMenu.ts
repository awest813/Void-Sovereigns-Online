import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { T } from '../ui/UITheme';

// MainMenu: title screen with game logo and start prompt.
export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background').setAlpha(0.6);

        // Game title treatment
        const gfx = this.add.graphics().setDepth(100);
        gfx.lineStyle(1, T.border, 0.45);
        gfx.lineBetween(292, 248, 732, 248);
        gfx.lineBetween(292, 340, 732, 340);

        this.add.text(512, 294, 'VOID SOVEREIGNS', {
            fontFamily: 'Arial Black',
            fontSize: 52,
            color: T.textPrimary,
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
        }).setOrigin(0.5).setDepth(100);

        this.add.text(512, 346, 'O  N  L  I  N  E', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: T.textAccent,
            align: 'center',
        }).setOrigin(0.5).setDepth(100);

        this.add.text(512, 430, 'Press any key to dock at Meridian Station', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: T.textSecond,
            align: 'center',
        }).setOrigin(0.5).setDepth(100);

        this.input.keyboard?.once('keydown', () => this.changeScene());
        this.input.once('pointerdown', () => this.changeScene());

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Hub');
    }
}
