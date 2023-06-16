export class Character {
  static Types = {
    Ninja: "ninja",
    Zombie: "zombie",
  };

  #Sprites = {
    ninja: {
      idle: [
        "../img/ninja/png/Idle__000.png",
        "../img/ninja/png/Idle__001.png",
        "../img/ninja/png/Idle__002.png",
        "../img/ninja/png/Idle__003.png",
        "../img/ninja/png/Idle__004.png",
        "../img/ninja/png/Idle__005.png",
        "../img/ninja/png/Idle__006.png",
        "../img/ninja/png/Idle__007.png",
        "../img/ninja/png/Idle__008.png",
        "../img/ninja/png/Idle__009.png",
      ],
      attack: [
        "../img/ninja/png/Attack__000.png",
        "../img/ninja/png/Attack__001.png",
        "../img/ninja/png/Attack__002.png",
        "../img/ninja/png/Attack__003.png",
        "../img/ninja/png/Attack__004.png",
        "../img/ninja/png/Attack__005.png",
        "../img/ninja/png/Attack__006.png",
        "../img/ninja/png/Attack__007.png",
        "../img/ninja/png/Attack__008.png",
        "../img/ninja/png/Attack__009.png",
      ],
    },
    zombie: {},
  };

  static States = {
    ninja: {
      idle: "idle",
      attack: "attack",
      climb: "climb",
      dead: "dead",
      glide: "glide",
      jump: "jump",
      jumpAttack: "jumpAttack",
      jumpThrow: "jumpThrow",
      run: "run",
      slide: "slide",
      throw: "throw",
    },
  };

  constructor(app, name, type) {
    this.app = app; // PIXI app
    this.name = name; // Any name
    this.type = type; // Check if exists in Types
    this.state = Character.States.idle;
    this.sprite = null;
    this.textures = {};
  }

  async load() {
    switch (this.type) {
      case Character.Types.Ninja:
        console.log(`Loading ${Character.Types.Ninja} - name: ${this.name}`);
        await this.#loadAssets();
        break;
      case Character.Types.Zombie:
        break;
    }
  }

  addToStage() {
    console.log("Add to stage");
    this.sprite.play();
    this.app.stage.addChild(this.sprite);
    return true;
  }

  changeState() {}

  updateSprite() {}

  async #loadAssets() {
    return new Promise((resolve, reject) => {
      this.#loadTextures()
        .then(() => {
          console.log("Loading sprites");
          this.sprite = new PIXI.AnimatedSprite(this.textures.idle);
          this.sprite.animationSpeed = 1 / 6; // 6 fps
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async #loadTextures() {
    console.log("Loading textures");
    let promises = [];
    for (const character in this.#Sprites) {
      for (const state in this.#Sprites[character]) {
        let assets = this.#Sprites[character][state];
        let promise = PIXI.Assets.load(assets).then(() => {
          this.textures[`${state}`] = [];
          console.log(`Loading textures: - ${character} ${state}`);
          for (let i = 0; i < assets.length; i++) {
            const texture = PIXI.Texture.from(assets[i]);
            this.textures[`${state}`].push(texture);
          }
        });
        promises.push(promise);
      }
    }
    return Promise.all(promises);
  }
}
