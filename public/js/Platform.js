import { GameObject } from "./GameObject.js";

export class Platform {
  static Type = {
    Floor: "floor",
  };

  #gameObjects = [];
  sprite = null;
  #sprites = {};
  #states = {};
  textures = {}; // empty object for textures

  constructor(app, platformType, platformLenth) {
    this.app = app;
    this.#states = {
      enabled: "enabled",
    };

    this.#sprites = {
      enabled: [
        "../img/graveyardtilesetnew/png/Tiles/Tile (1).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (2).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (3).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (4).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (5).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (6).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (7).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (8).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (9).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (10).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (11).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (12).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (13).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (14).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (15).png",
        "../img/graveyardtilesetnew/png/Tiles/Tile (16).png",
      ],
    };
  }

  // Assets loading -> Textures loading
  async load() {
    return new Promise((resolve, reject) => {
      // Loads all textures and then define the proper Sprite based on the character state
      this.#loadTextures()
        .then(() => {
          this.sprite = PIXI.Sprite.from(
            "../img/graveyardtilesetnew/png/Tiles/Tile (1).png"
          );
          resolve(this);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // Textures loading
  async #loadTextures() {
    let promises = [];

    for (const state in this.#sprites) {
      let assets = this.#sprites[state];
      let promise = PIXI.Assets.load(assets).then(() => {
        this.textures[`${state}`] = [];
        for (let i = 0; i < assets.length; i++) {
          const texture = PIXI.Texture.from(assets[i]);
          this.textures[`${state}`].push(texture);
        }
      });
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  addToStage() {
    this.app.stage.addChild(this.sprite);
  }

  updatePosition(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
    return { x: this.sprite.x, y: this.sprite.y };
  }
}
