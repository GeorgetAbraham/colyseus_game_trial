import Phaser from 'phaser'
import WebFontFile from './WebFontFile'
import {Game} from '../consts/SceneKeys'
import *  as AudioKeys from '../consts/AudioKeys'
import * as Colyseus from 'colyseus.js'

export default class TitleScreen extends Phaser.Scene{
    
    // maybe we have to add constructor
    private client: Colyseus.Client
    
    init()
    {
        this.client = new Colyseus.Client('ws://localhost:2567')
    }

    preload()
    {
        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)

        this.load.audio(AudioKeys.PongBeep, 'assets/ping_pong_8bit_beeep.ogg')
        this.load.audio(AudioKeys.PongPlop, 'assets/ping_pong_8bit_plop.ogg')
    }

    async create()
    {
        const room = await this.client.joinOrCreate("my_room")
        console.log(room.sessionId)
        room.onMessage('keydown',(message)=>{console.log(message)})
        this.input.keyboard.on('keydown',(evt:KeyboardEvent)=>{room.send('keydown',evt.key)})

        const title = this.add.text(400,200,'Old School Tennis', {
            fontSize: 38,
            fontFamily: '"Press Start 2P"'
        })
        title.setOrigin(0.5,0.5)

        this.add.text(400, 300,'Press Space to Start', {
            fontFamily: '"Press Start 2P"'
        } ).setOrigin(0.5)

        this.input.keyboard.once('keydown-SPACE', ()=> {
            this.sound.play(AudioKeys.PongBeep)
            this.scene.start(Game)
        })

    }
}