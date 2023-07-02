import { Platform } from "./Platform.js";

export class Level {
  collidableObjects = []; // Character can collide with this objects
  enemies = [];
  character = null;
  background = null;

  constructor(app) {
    this.app = app;

    // Adds background
    PIXI.Assets.load("../img/graveyardtilesetnew/png/BG.png").then(() => {
      this.background = PIXI.Sprite.from(
        PIXI.Texture.from("../img/graveyardtilesetnew/png/BG.png")
      );
      this.background.scale.x = this.app.view.width / this.background.width;
      this.background.scale.y = this.app.view.height / this.background.height;
      this.background.zIndex = -1;
      this.app.stage.addChild(this.background);
    });

    // Adds platforms
    let p1 = new Platform(this.app, Platform.Type.FloorPlatform, {
      length: 4,
      height: 2,
      scale: 0.5,
    })
      .load()
      .then((obj) => {
        obj.addToStage();
        obj.updatePosition(100, this.app.view.height - 140);
        obj.zIndex = 1000;
        this.collidableObjects.push(obj);
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
        obj.zIndex = 1000;
        this.collidableObjects.push(obj);
      });

    let p3 = new Platform(this.app, Platform.Type.FloatingPlatform, {
      length: 3,
      scale: 0.5,
    })
      .load()
      .then((obj) => {
        obj.addToStage();
        obj.updatePosition(700, 200);
        obj.zIndex = 1000;
        this.collidableObjects.push(obj);
      });
  }

  addCharacter(character) {
    this.character = character;
    this.character.load().then((obj) => {
      this.character = obj;
      this.character.addToStage();
      this.character.updatePosition(100, 100);
      this.character.zIndex = 10000;
      // Informs the character the Level we are playing
      this.character.currentLevel = this;
    });
  }
}
