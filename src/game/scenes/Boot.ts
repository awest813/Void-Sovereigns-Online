import { Scene } from 'phaser';

// Boot: loads the minimal assets needed for the Preloader screen, then hands off.
export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image('background', 'assets/bg.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
