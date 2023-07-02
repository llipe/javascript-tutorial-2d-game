import { Level } from "./Level.js";
import { Ninja } from "./Ninja.js";

export class Game {
  stats = {
    enabled: false,
    sprite: null,
    timeElapsed: 0,
  };
  name = "2D Platformer";
  level = null;

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
  }

  start() {
    this.level = new Level(this.app);
    this.level.addCharacter(
      // Adds character
      new Ninja(this.app)
    );
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
    this.level.character.walkRight();
  }
  inputCharacterMoveRightStop() {
    this.level.character.walkStop();
  }
  inputCharacterMoveLeft() {
    this.level.character.walkLeft();
  }
  inputCharacterMoveLeftStop() {
    this.level.character.walkStop();
  }
  inputCharacterJump() {
    this.level.character.jump();
  }
  inputCharacterAttack() {}
}
