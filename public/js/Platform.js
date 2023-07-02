export class Platform {
  static Type = {
    FloorPlatform: "FloorPlatform",
    FloatingPlatform: "FloatingPlatform",
  };

  spriteParts = [];
  #sprites = {};
  #states = {};
  textures = {}; // empty object for textures

  constructor(app, platformType, platformParams) {
    this.app = app;
    this.platformType = platformType;
    this.platformParams = platformParams;
    this.scale = platformParams.scale;

    this.container = new PIXI.Container();

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
          switch (this.platformType) {
            case Platform.Type.FloorPlatform:
              this.#initFloorPlatform(this.scale);
              break;
            case Platform.Type.FloatingPlatform:
              this.#initFloatingPlatform(this.scale);
              break;
          }
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

  #initFloatingPlatform(scale) {
    // min size 2
    let length = Math.max(this.platformParams.length, 2);

    // Generate the sprites
    this.spriteParts.push(
      PIXI.Sprite.from("../img/graveyardtilesetnew/png/Tiles/Tile (14).png")
    );
    for (let i = 0; i < length - 2; i++) {
      this.spriteParts.push(
        PIXI.Sprite.from("../img/graveyardtilesetnew/png/Tiles/Tile (15).png")
      );
    }
    this.spriteParts.push(
      PIXI.Sprite.from("../img/graveyardtilesetnew/png/Tiles/Tile (16).png")
    );
    
    // For all spriteParts (adjust scale)
    this.spriteParts.forEach((value) => {
      value.scale.x = scale;
      value.scale.y = scale;
    });

    // To space them property
    this.spriteParts[1].x = this.spriteParts[0].width;
    for (let i = 1; i < this.spriteParts.length; i++) {
      this.spriteParts[i].x =
        this.spriteParts[i - 1].x + this.spriteParts[i - 1].width;
    }
  }

  #initFloorPlatform(scale) {
    // min size 2x2
    let length = Math.max(this.platformParams.length, 2);
    let height = Math.max(this.platformParams.height, 2);

    let assetNamesTopRow = {
      startSection: "../img/graveyardtilesetnew/png/Tiles/Tile (1).png",
      middleSection: "../img/graveyardtilesetnew/png/Tiles/Tile (2).png",
      endSection: "../img/graveyardtilesetnew/png/Tiles/Tile (3).png",
    };
    let assetNamesMiddle = {
      startSection: "../img/graveyardtilesetnew/png/Tiles/Tile (4).png",
      middleSection: "../img/graveyardtilesetnew/png/Tiles/Tile (5).png",
      endSection: "../img/graveyardtilesetnew/png/Tiles/Tile (6).png",
    };
    let assetNamesEnd = {
      startSection: "../img/graveyardtilesetnew/png/Tiles/Tile (12).png",
      middleSection: "../img/graveyardtilesetnew/png/Tiles/Tile (9).png",
      endSection: "../img/graveyardtilesetnew/png/Tiles/Tile (13).png",
    };
    let topRow = this.#generatePlatformRow(length, assetNamesTopRow, scale);
    let bottomRow = this.#generatePlatformRow(length, assetNamesEnd, scale);

    this.spriteParts.push(topRow);

    for (let i = 1; i < height - 1; i++) {
      let middleRow = this.#generatePlatformRow(
        length,
        assetNamesMiddle,
        scale
      );
      middleRow.forEach((value, index) => {
        middleRow[index].y = topRow[0].y + i * topRow[0].height;
      });
      this.spriteParts.push(middleRow);
    }

    bottomRow.forEach((value, index) => {
      let lastMiddleRow = this.spriteParts[this.spriteParts.length - 1];
      bottomRow[index].y = lastMiddleRow[0].y + lastMiddleRow[0].height;
    });
    this.spriteParts.push(bottomRow);
  }

  /**
   * Generates an array with Sprites to assemble a row of the platform
   * @param {*} length length of the platform
   * @param {*} assetNames object with image paths for the start, middle en end sections of the row
   * @returns
   */
  #generatePlatformRow(length, assetNames, scale = 1) {
    // Sample format
    // let assetNames = {
    //   startSection: "../img/graveyardtilesetnew/png/Tiles/Tile (1).png",
    //   middleSection: "../img/graveyardtilesetnew/png/Tiles/Tile (2).png",
    //   endSection: "../img/graveyardtilesetnew/png/Tiles/Tile (3).png",
    // };
    let row = [];

    let sprite = PIXI.Sprite.from(assetNames.startSection);
    sprite.scale.x = sprite.scale.y = scale;
    row.push(sprite);

    for (let i = 1; i < length - 1; i++) {
      let sprite = PIXI.Sprite.from(assetNames.middleSection);
      sprite.scale.x = sprite.scale.y = scale;
      sprite.x = sprite.width * i;
      row.push(sprite);
    }

    sprite = PIXI.Sprite.from(assetNames.endSection);
    sprite.scale.x = sprite.scale.y = scale;
    sprite.x = sprite.width * (length - 1);
    row.push(sprite);

    return row;
  }

  addToStage() {
    this.spriteParts.forEach((obj) => {
      if (Array.isArray(obj)) {
        obj.forEach((sprite) => {
          this.container.addChild(sprite);
        });
      } else {
        this.container.addChild(obj);
      }
    });
    this.app.stage.addChild(this.container);
  }

  updatePosition(x, y) {
    this.container.x = x;
    this.container.y = y;
    return { x: this.container.x, y: this.container.y };
  }

  getPosition() {
    return { x: this.container.x, y: this.container.y };
  }
  get height() {
    return this.container.height;
  }
  get width() {
    return this.container.width;
  }
}
