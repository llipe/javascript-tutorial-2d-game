import { Ninja } from "./Ninja.js";
import { Platform } from "./Platform.js";

export class Game {
  stats = {
    enabled: false,
    sprite: null,
    timeElapsed: 0,
  };
  name = "2D Platformer";

  constructor(htmlId) {
    this.app = new PIXI.Application({
      width: 960,
      height: 540,
      antialias: true, // default: false
      transparent: false, // default: false
      resolution: 1,
    });
    this.app.renderer.background.color = 0x061639;
    this.app.stage.sortableChildren = true;
    document.querySelector(htmlId).appendChild(this.app.view);

    this.character = null;
    this.background = null;
  }

  start() {
    // Pending z-indez
    new Ninja(this.app).load().then((obj) => {
      this.character = obj;
      this.character.addToStage();
      this.character.updatePosition(100, 100);
    });

    // new Platform(this.app, Platform.Type.FloorPlatform, {length: 3, height:2, scale: 1}).load().then((obj) => {
    //   obj.addToStage();
    //   obj.updatePosition(100,100);
    // });

    let p1 = new Platform(this.app, Platform.Type.FloorPlatform, {
      length: 10,
      height: 2,
      scale: 0.5,
    })
      .load()
      .then((obj) => {
        obj.addToStage();
        obj.updatePosition(100, this.app.view.height - 140);
      });

    let p2 = new Platform(this.app, Platform.Type.FloorPlatform, {
      length: 3,
      height: 2,
      scale: 0.5,
    })
      .load()
      .then((obj) => {
        obj.addToStage();
        obj.updatePosition(800, this.app.view.height - 140);
      });

    let p3 = new Platform(this.app, Platform.Type.FloatingPlatform, {
      length: 3,
      scale: 0.5,
    })
      .load()
      .then((obj) => {
        obj.addToStage();
        obj.updatePosition(700, 200);
      });

    PIXI.Assets.load("../img/graveyardtilesetnew/png/BG.png").then(() => {
      this.background = PIXI.Sprite.from(
        PIXI.Texture.from("../img/graveyardtilesetnew/png/BG.png")
      );
      // this.app.stage.scale.x = this.app.view.width / this.background.width;
      // this.app.stage.scale.y = this.app.view.height / this.background.height;
      this.background.scale.x = this.app.view.width / this.background.width;
      this.background.scale.y = this.app.view.height / this.background.height;
      this.background.zIndex = -1;
      this.app.stage.addChild(this.background);
    });

    this.toggleUtils();
  }

  /**
   * Enable the stats display bar on the bottom (mapped to the key letter H)
   */
  toggleUtils() {
    if (this.stats.enabled == false) {
      this.stats.sprite = new PIXI.Text("", {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xffffff,
        align: "right",
      });

      // Information handler
      this.app.ticker.add((delta) => {
        this.stats.timeElapsed += delta;
        let message = `Game: ${this.name} | FPS: ${Math.round(
          this.app.ticker.FPS
        )} | Time Elapsed: ${Math.round(this.stats.timeElapsed)} ms`;
        this.stats.sprite.text = message;
        // Sizing
        this.stats.sprite.x = this.app.view.width - this.stats.sprite.width - 5;
        this.stats.sprite.y = this.app.view.height - 25;
      });

      // Adds to stage
      this.stats.sprite.zIndex = 1000;
      this.app.stage.addChild(this.stats.sprite);
      this.stats.enabled = true;
    } else {
      this.app.stage.removeChild(this.stats.sprite);
      this.stats.enabled = false;
    }
  }
  inputGameStart() {}
  inputGameSelect() {}
  inputCharacterMoveRight() {
    this.character.walkRight();
  }
  inputCharacterMoveRightStop() {
    this.character.walkStop();
  }
  inputCharacterMoveLeft() {
    this.character.walkLeft();
  }
  inputCharacterMoveLeftStop() {
    this.character.walkStop();
  }
  inputCharacterJump() {
    this.character.jump();
  }
  inputCharacterAttack() {}
}
