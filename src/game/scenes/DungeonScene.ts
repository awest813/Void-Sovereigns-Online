import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

// DungeonScene: instanced dungeon run — Ashwake Belt layouts and encounters.
// Phase 0: placeholder stub. Phase 1 will implement room traversal and combat.
export class DungeonScene extends Scene
{
    private camera: Phaser.Cameras.Scene2D.Camera;

    constructor ()
    {
        super('Dungeon');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x0a0505);

        this.add.text(512, 200, 'ASHWAKE BELT — RUN INITIATED', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#cc4400',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center',
        }).setOrigin(0.5);

        this.add.text(512, 260, 'Sector: Ashwake Belt\nDungeon: Collapsed Extraction Rig Alpha-7\nTier: 1', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#aaaaaa',
            align: 'center',
        }).setOrigin(0.5);

        const exitBtn = this.add.text(512, 440, '[ EXTRACT — RETURN TO STATION ]', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#cccccc',
            align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        exitBtn.on('pointerover', () => exitBtn.setColor('#ffffff'));
        exitBtn.on('pointerout',  () => exitBtn.setColor('#cccccc'));
        exitBtn.on('pointerdown', () => this.scene.start('Hub'));

        EventBus.emit('current-scene-ready', this);
    }
}
