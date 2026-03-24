import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { HubScene } from './scenes/HubScene';
import { DungeonScene } from './scenes/DungeonScene';
import { AUTO, Game } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#050510',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        HubScene,
        DungeonScene,
    ],
};

const StartGame = (parent: string) => new Game({ ...config, parent });

export default StartGame;
