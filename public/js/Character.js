export class Character {
  constructor(app, name, statesObject, spritesObject) {
    this.app = app; // PIXI app
    this.name = name; // Any name to identify thge type of character
    this.states = statesObject; // object with states as keys and values
    this.#state = statesObject[0]; // defaults to 0
    this.sprites = spritesObject; // object with states as keys and array of paths for values
  }

  // Static Properties
  static HorizontalMovingDirections = {
    NOT_MOVING: "NOT_MOVING",
    RIGHT: "RIGHT",
    LEFT: "LEFT",
  };
  static VerticalMovingDirections = {
    NOT_MOVING: "NOT_MOVING",
    UP: "UP",
    DOWN: "DOWN",
  };

  // Properties w/ default values
  horizontalMovementSpeed = 10; // Overriden in child classes
  sprite = null; // initial & active sprite
  textures = {}; // empty object for textures
  #horizontalMovingDirection = Character.HorizontalMovingDirections.NOT_MOVING;
  #verticalMovingDirection = Character.VerticalMovingDirections.NOT_MOVING;
  #state = null;

  // Getter & Setter for #horizontalMovingDirection
  get horizontalMovingDirection() {
    return this.#horizontalMovingDirection;
  }
  set horizontalMovingDirection(direction) {
    if (Character.HorizontalMovingDirections[`${direction}`] == direction) {
      this.#horizontalMovingDirection =
        Character.HorizontalMovingDirections[`${direction}`];
      this.updateSprite();
    }
    return this.#horizontalMovingDirection;
  }

  // Getter & Setter for #verticalMovingDirection
  get verticalMovingDirection() {
    return this.#verticalMovingDirection;
  }
  set verticalMovingDirection(direction) {
    if (Character.VerticalMovingDirections[`${direction}`] == direction) {
      this.#verticalMovingDirection =
        Character.VerticalMovingDirections[`${direction}`];
    }
    return this.#verticalMovingDirection;
  }
  get state() {
    return this.#state;
  }
  set state(state) {
    this.#state = this.states[`${state}`];
    return this.#state;
  }

  // Methods
  addToStage() {
    this.sprite.play();
    this.app.stage.addChild(this.sprite);
  }

  updateSprite(state) {
    // Change the sprite to the new one
    let { x, y } = this.getPosition();
    this.app.stage.removeChild(this.sprite);

    this.sprite = new PIXI.AnimatedSprite(this.textures[`${this.state}`]);
    this.sprite.scale.x = 0.5;
    this.sprite.scale.y = 0.5;
    this.sprite.animationSpeed = 1 / 3; // 6 fps

    this.sprite.x = x;
    this.sprite.y = y;

    this.sprite.play();
    this.app.stage.addChild(this.sprite);
  }

  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }
  updatePosition(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
    return { x: this.sprite.x, y: this.sprite.y };
  }

  // Movements
  walkRight() {
    if (
      this.horizontalMovingDirection !=
      Character.HorizontalMovingDirections.RIGHT
    ) {
      this.horizontalMovingDirection =
        Character.HorizontalMovingDirections.RIGHT;
    }
  }
  walkLeft() {
    if (
      this.horizontalMovingDirection !=
      Character.HorizontalMovingDirections.LEFT
    ) {
      this.horizontalMovingDirection =
        Character.HorizontalMovingDirections.LEFT;
    }
  }
  walkStop() {
    if (
      this.horizontalMovingDirection !=
      Character.HorizontalMovingDirections.NOT_MOVING
    ) {
      this.horizontalMovingDirection =
        Character.HorizontalMovingDirections.NOT_MOVING;
    }
  }
  jump() {
    this.updatePosition(
      Math.random() * this.app.view.width,
      Math.random() * this.app.view.height
    );
  }

  // Gets called on every tick
  move() {
    let { x, y } = this.getPosition();
    let direction =
      this.horizontalMovingDirection ==
      Character.HorizontalMovingDirections.RIGHT
        ? 1
        : this.horizontalMovingDirection ==
          Character.HorizontalMovingDirections.LEFT
        ? -1
        : 0;
    this.updatePosition(x + direction * this.horizontalMovementSpeed, y);
  }

  // Assets loading -> Textures loading
  async load() {
    return new Promise((resolve, reject) => {
      // Loads all textures and then define the proper Sprite based on the character state
      this.#loadTextures()
        .then(() => {
          // ToDo: us updateSprite function. Duplicated code.
          this.sprite = new PIXI.AnimatedSprite(this.textures[`${this.state}`]);
          this.sprite.scale.x = 0.5;
          this.sprite.scale.y = 0.5;
          this.sprite.animationSpeed = 1 / 6; // 6 fps
          resolve(this);
        })
        .then(() => {
          this.app.ticker.add(() => {
            this.move();
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // Textures loading
  async #loadTextures() {
    let promises = [];

    for (const state in this.sprites) {
      let assets = this.sprites[state];
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
}
