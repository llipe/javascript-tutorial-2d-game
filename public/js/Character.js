export class Character {
  static MovingDirections = {
    NOT_MOVING: "NOT_MOVING",
    RIGHT: "RIGHT",
    LEFT: "LEFT",
    JUMPING: "JUMPING",
    JUMPING_RIGHT: "JUMPING_RIGHT",
    JUMPING_LEFT: "JUMPING",
  };

  #movingDirection = Character.MovingDirections.NOT_MOVING;

  constructor(app, name, statesObject, spritesObject) {
    this.app = app; // PIXI app
    this.name = name; // Any name to identify thge type of character
    this.states = statesObject; // object with states as keys and values
    this.state = statesObject[0]; // defaults to 0
    this.sprites = spritesObject; // object with states as keys and array of paths for values
    this.sprite = null; // initial & active sprite
    this.textures = {}; // empty object for textures
    this.horizontalMovementSpeed = 10; // default 10
  }

  get movingDirection() {
    return this.#movingDirection;
  }
  set movingDirection(direction) {
    if (Character.MovingDirections[`${direction}`] == direction) {
      this.#movingDirection = Character.MovingDirections[`${direction}`];
      console.log(this.#movingDirection);
      return this.#movingDirection;
    } else {
      return false;
    }
  }

  addToStage() {
    console.log(`Add ${this.name} to stage`);
    this.sprite.play();
    this.app.stage.addChild(this.sprite);
    return true;
  }

  changeState(state) {
    console.log(`Changing state from ${this.state} to ${state}`);
    this.state = this.states[`${state}`];
    let { x, y } = this.getPosition();
    this.app.stage.removeChild(this.sprite);

    this.sprite = new PIXI.AnimatedSprite(this.textures[`${this.state}`]);
    this.sprite.scale.x = 0.5;
    this.sprite.scale.y = 0.5;
    this.sprite.animationSpeed = 1 / 6; // 6 fps
    this.sprite.play();
    this.sprite.x = x;
    this.sprite.y = y;
    this.app.stage.addChild(this.sprite);
  }

  updateSprite() {}

  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }
  updatePosition(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
    return { x: this.sprite.x, y: this.sprite.y };
  }

  async load() {
    return new Promise((resolve, reject) => {
      // Loads all textures and then define the proper Sprite based on the character state
      this.#loadTextures()
        .then(() => {
          console.log("Loading sprites");
          this.sprite = new PIXI.AnimatedSprite(this.textures[`${this.state}`]);
          this.sprite.scale.x = 0.5;
          this.sprite.scale.y = 0.5;
          this.sprite.animationSpeed = 1 / 6; // 6 fps
          resolve(this);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async #loadTextures() {
    console.log(`Loading all textures for ${this.name}`);
    let promises = [];

    for (const state in this.sprites) {
      let assets = this.sprites[state];
      let promise = PIXI.Assets.load(assets).then(() => {
        this.textures[`${state}`] = [];
        console.log(`Loading textures: - ${state}`);
        for (let i = 0; i < assets.length; i++) {
          const texture = PIXI.Texture.from(assets[i]);
          this.textures[`${state}`].push(texture);
        }
      });
      promises.push(promise);
    }

    return Promise.all(promises);
  }
}
