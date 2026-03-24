import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

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
        this.add.image(512, 260, 'logo').setDepth(100);

        this.add.text(512, 420, 'VOID SOVEREIGNS ONLINE', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#e8e0cc',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
        }).setOrigin(0.5).setDepth(100);

        this.add.text(512, 470, 'Press any key to dock at Meridian Station', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#aaaaaa',
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
