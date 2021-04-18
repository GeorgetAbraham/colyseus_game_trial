import Phaser from 'phaser'
import WebFontFile from './WebFontFile'
import {TitleScreen} from '../consts/SceneKeys'
import {PressStart2P} from '../consts/Fonts'

export default class GameOver extends Phaser.Scene
{

    preload()
    {
        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)
    }

    /** 
     * @param {{leftScore: number, rightScore: number}}
     * */ 
    create(data)
    {
        console.log(data)
        let titleText = 'Game Over'
        if(data.leftScore > data.rightScore)
        {
            //playerwin
            titleText = 'You Win!' 
        }
        else
        {
            // AI won
            titleText = 'You Lose!'
        }

        this.add.text(400, 200, titleText, {
            fontFamily: '"Press Start 2P"',
            fontSize: 38
        }).setOrigin(0.5)

        this.add.text(400, 300, 'Press Space to Continue', {
            fontFamily: '"Press Start 2P"',
            fontSize: 18
        }).setOrigin(0.5)

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(TitleScreen)
        })
    }
} 