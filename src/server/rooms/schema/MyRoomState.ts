import { Schema, Context, type } from "@colyseus/schema";

// export enum GameStatus {
//   WAITING = 0,
//   PLAYING,
//   FINISHED,
//   INTERRUPTED, // a player has left the match
// }


export const GameDimensions = {
  width: 800,
  height: 500,
}

const center = {
  x: Math.round(GameDimensions.width / 2),
  y: Math.round(GameDimensions.height / 2),
}

// to represent paddles 

enum PaddleSide {
  LEFT = 0,
  RIGHT,
}

export class Paddle extends Schema {
  public static readonly offset = 30;
  public static readonly width = 30;
  public static readonly height = 100;

  @type('int32')
  public x: number;

  @type('int32')
  public y = center.y;

  constructor(side: PaddleSide) {
    super();
    const actualOffset = Paddle.width / 2 + Paddle.offset;

    switch (side) {
      case PaddleSide.LEFT:
        this.x = actualOffset;
        break;

      case PaddleSide.RIGHT:
        this.x = GameDimensions.width - actualOffset;
        break;
    }
  }
}

export class Ball extends Schema {
  public static readonly radius = 10;

  @type('int32')
  public x = center.x;

  @type('int32')
  public y = center.y;

  public center() {
    this.x = center.x;
    this.y = center.y;
  }
}

export class Scoreboard extends Schema {
  @type('int8')
  public left = 0;

  @type('int8')
  public right = 0;
}



export class MyRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";

}
