import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

// HubScene: the station hub — contracts board, shops, NPCs, and sector access.
// Phase 0: placeholder layout. Phase 1 will wire in real hub UI via React overlays.
export class HubScene extends Scene
{
    private camera: Phaser.Cameras.Scene2D.Camera;

    constructor ()
    {
        super('Hub');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x080818);

        this.add.text(512, 180, 'MERIDIAN STATION', {
            fontFamily: 'Arial Black',
            fontSize: 36,
            color: '#e8e0cc',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
        }).setOrigin(0.5);

        this.add.text(512, 240, 'Low-rent. Busy. Yours for now.', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#888888',
            align: 'center',
        }).setOrigin(0.5);

        const menuItems = [
            { label: '[ CONTRACTS BOARD ]',  y: 340, target: 'Dungeon' },
            { label: '[ SECTOR MAP ]',        y: 390, target: 'Dungeon' },
            { label: '[ SHIP YARD ]',         y: 440, target: 'Hub' },
            { label: '[ BACK TO TITLE ]',     y: 540, target: 'MainMenu' },
        ];

        for (const item of menuItems)
        {
            const btn = this.add.text(512, item.y, item.label, {
                fontFamily: 'Arial',
                fontSize: 20,
                color: '#cccccc',
                align: 'center',
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            btn.on('pointerover', () => btn.setColor('#ffffff'));
            btn.on('pointerout',  () => btn.setColor('#cccccc'));
            btn.on('pointerdown', () => this.scene.start(item.target));
        }

        EventBus.emit('current-scene-ready', this);
    }
}
