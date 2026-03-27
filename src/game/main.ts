import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { TutorialScene } from './scenes/TutorialScene';
import { HubScene } from './scenes/HubScene';
import { SectorMapScene } from './scenes/SectorMapScene';
import { DungeonScene } from './scenes/DungeonScene';
import { AUTO, Game, Scale } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#050510',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        width: 1024,
        height: 768,
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        TutorialScene,
        HubScene,
        SectorMapScene,
        DungeonScene,
    ],
};

const StartGame = (parent: string) => new Game({ ...config, parent });

export default StartGame;

