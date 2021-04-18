import Phaser from 'phaser'
import WebFontFile from './WebFontFile'
import * as SceneKeys from '../consts/SceneKeys'
import * as Colors from '../consts/Colors'
import * as AudioKeys from '../consts/AudioKeys'

const GameState = {
    Running: 'running',
    PlayerWon: 'player-won',
    AIWon: 'ai-won'
}



export default class Game extends Phaser.Scene{

    init()
    {
        this.gameState = GameState.Running
        this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0)
        this.leftScore = 0
        this.rightScore = 0

        this.paused = false
    }

    preload()
    {
        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)

        this.load.audio(AudioKeys.PongBeep, 'assets/ping_pong_8bit_beeep.ogg')
        this.load.audio(AudioKeys.PongPlop, 'assets/ping_pong_8bit_plop.ogg')

    } 

    create()
    {
        this.scene.run(SceneKeys.GameBackground)
        this.scene.sendToBack(SceneKeys.GameBackground)

        this.physics.world.setBounds(-100, 0, 1000, 500)

        this.ball = this.add.circle(400,250,10,Colors.White,1)
        this.physics.add.existing(this.ball)
        this.ball.body.setCircle(10)
        this.ball.body.setBounce(1, 1)
        this.ball.body.setMaxSpeed(400)


        this.ball.body.setCollideWorldBounds(true, 1, 1)
        this.ball.body.onWorldBounds = true

        this.paddleLeft = this.add.rectangle(50, 250, 30, 100, Colors.White, 1)
        this.physics.add.existing(this.paddleLeft, true)

        this.paddleRight = this.add.rectangle(750,250,30,100,Colors.White, 1)
        this.physics.add.existing(this.paddleRight, true)



        this.physics.add.collider(this.paddleLeft, this.ball, this.handlePaddleBallCollision, undefined, this)
        this.physics.add.collider(this.paddleRight, this.ball, this.handlePaddleBallCollision, undefined, this)

        this.physics.world.on('worldbounds', this.handleWallBallCollision, this)

        const scoreStyle = {
            fontSize: 48,
            fontFamily: '"Press Start 2P"'
        }

        this.leftScoreLable = this.add.text(300, 125,'0',scoreStyle).setOrigin(0.5,0.5)

        this.rightScoreLable = this.add.text(500, 375,'0', scoreStyle).setOrigin(0.5,0.5)

        this.cursors = this.input.keyboard.createCursorKeys()
    
        this.time.delayedCall(1500, () => {
            this.resetBall()
        })
    }

    handlePaddleBallCollision()
    {
        this.sound.play(AudioKeys.PongBeep)

        /** @type {Phaser.Physics.Arcade.Body} */
        const body = this.ball.body
        const vel = body.velocity
        vel.x *= 1.05
        vel.y *= 1.05

        body.setVelocity(vel.x, vel.y)
    }

    handleWallBallCollision(body, up, down, left, right)
    {
        if(left || right)
        {
            return 
        }

        this.sound.play(AudioKeys.PongPlop)
    }

    update()
    {
        if (this.paused || this.gameState !== GameState.Running )
        {
            return 
        }

        this.handlePlayerInput()

        this.updateAI()

        this.checkScore()        
    }

    handlePlayerInput()
    {
         /** @type {Phaser.Physics.Arcade.StaticBody} */
         const body = this.paddleLeft.body
        
         if (this.cursors.up.isDown)
         {
             this.paddleLeft.y -= 10
             body.updateFromGameObject()
         }
         else if (this.cursors.down.isDown)
         {
             this.paddleLeft.y += 10
             body.updateFromGameObject()
         }
         
    }

    checkScore()
    {
        const x = this.ball.x
        const leftBounds = -30
        const rightBounds = 830
        if (x >= leftBounds && x <= rightBounds)
        {
            return 
        }

        if(this.ball.x < leftBounds)
        {
            //scored on the left side 
            this.incrementRightScore()
        }
        else if(this.ball.x > rightBounds)
        {
            // scored on the right side
            this.incrementLeftScore()
        }

        const maxScore = 2
        if (this.leftScore >= maxScore)
        {
            //Player Won 
            console.log("player won")
            // this.paused = true
            this.gameState = GameState.PlayerWon
        }
        else if (this.rightScore >= maxScore)
        {
            // AI Won
            console.log("AI won")
            // this.paused = true
            this.gameState = GameState.AIWon
        }

        if(this.gameState === GameState.Running)
        {
            this.resetBall()
        }
        else
        {
            this.ball.active = false
            this.physics.world.remove(this.ball.body)

            this.scene.stop(SceneKeys.GameBackground)

            // show gameover
            this.scene.start(SceneKeys.GameOver, {
                leftScore: this.leftScore,
                rightScore: this.rightScore
            })
        }
    }

    updateAI()
    {
        const diff = this.ball.y - this.paddleRight.y
        if (Math.abs(diff) < 10)
        {
            return 
        }
        
        const aiSpeed = 3
        if (diff < 0)
        {
            this.paddleRightVelocity.y = -aiSpeed
            if(this.paddleRightVelocity.y < -10)
            {
                this.paddleRightVelocity.y = -10
            }
        }
        else if (diff > 0)
        {
            this.paddleRightVelocity.y = aiSpeed
            if(this.paddleRightVelocity.y > 10)
            {
                this.paddleRightVelocity.y = 10
            }
        }
        this.paddleRight.y += this.paddleRightVelocity.y
        this.paddleRight.body.updateFromGameObject()
    }

    incrementLeftScore()
    {
        this.leftScore +=1
        this.leftScoreLable.text = this.leftScore
    }

    incrementRightScore()
    {
        this.rightScore +=1
        this.rightScoreLable.text = this.rightScore
    }

    resetBall()
    {
        this.ball.setPosition(400, 250)
        const angle = Phaser.Math.Between(0,360)
        const vec = this.physics.velocityFromAngle(angle, 200)

        this.ball.body.setVelocity(vec.x, vec.y)
    }
}