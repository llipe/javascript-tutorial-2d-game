import { Ninja } from "./Ninja.js";

export class Game {
  constructor(htmlId) {
    this.app = new PIXI.Application({
      width: 960,
      height: 540,
      antialias: true, // default: false
      transparent: false, // default: false
      resolution: 1,
    });
    this.app.renderer.background.color = 0x061639;
    document.querySelector(htmlId).appendChild(this.app.view);

    this.character = null;
    this.background = null;
  }

  start() {
    // Pending z-indez
    new Ninja(this.app).load().then((obj) => {
      this.character = obj;
      this.character.addToStage();
      this.character.changePosition(400, 400);
    });

    PIXI.Assets.load("../img/graveyardtilesetnew/png/BG.png").then(() => {
      this.background = PIXI.Sprite.from(
        PIXI.Texture.from("../img/graveyardtilesetnew/png/BG.png")
      );
      this.app.stage.scale.x = this.app.view.width / this.background.width;
      this.app.stage.scale.y = this.app.view.height / this.background.height;
      this.app.stage.addChild(this.background);
    });

    // Add a variable to count up the seconds our demo has been running
    let elapsed = 0.0;
    // Tell our application's ticker to run a new callback every frame, passing
    // in the amount of time that has passed since the last tick
    this.app.ticker.add((delta) => {
      // Add the time to our total elapsed time
      elapsed += delta;
      // Update the sprite's X position based on the cosine of our elapsed time.  We divide
      // by 50 to slow the animation down a bit...
      //nijaSprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
    });
  }
  inputGameStart() {}
  inputGameSelect() {}
  inputCharacterMoveRight() {}
  inputCharacterMoveLeft() {}
  inputCharacterJump() {
    console.log("inputCharacterJump");
    this.character.changePosition(Math.random()*this.app.view.width, Math.random()*this.app.view.height);
  }
  inputCharacterAttack() {}
}
