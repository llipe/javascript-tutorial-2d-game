import { PhysicsEngine } from "./PhysicsEngine.js";

/**
 * Character class implements a moving Character inside the Game by extending a
 * drawable object from GameObject.
 */
export class Character {
  constructor(app, statesObject, spritesObject, name) {
    this.app = app; // PIXI App
    this.#states = statesObject; // object with states as keys and values
    this.#state = statesObject[0]; // defaults to 0
    this.#sprites = spritesObject; // object with states as keys and array of paths for values
    this.name = name; // Any name to identify thge type of character

    // Set initial dinamics - Velocity & Acceleration. Mass = 1 for simplicity.
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;

    this.physicsEngine = new PhysicsEngine();
  }

  /******************************************
   * STATIC PROPERTIES
   ******************************************/
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

  /******************************************
   * PROPERTIES WITH DEFAULT VALUES
   ******************************************/
  #state = null;
  #states = {};
  #sprites = {};
  sprite = null; // initial & active sprite
  textures = {}; // empty object for textures
  elapsed = 0;
  scale = {
    x: 1,
    y: 1,
  };
  animationSpeed = 1 / 6;
  horizontalMovementSpeed = 10; // Overriden in child classes
  #horizontalMovingDirection = Character.HorizontalMovingDirections.NOT_MOVING;
  #verticalMovingDirection = Character.VerticalMovingDirections.NOT_MOVING;

  /******************************************
   * GETTERS & SETTERS
   ******************************************/
  // Getter & Setter for #sprites
  get sprites() {
    return this.#sprites;
  }
  set sprites(spritesObject) {
    // ToDo: Implement validations on spritesObject
    this.#sprites = spritesObject;
    return this.#sprites;
  }
  // Getter & Setter for #states
  get states() {
    return this.#states;
  }
  set states(statesObject) {
    // ToDo: Implement validations on statesObject
    this.#states = statesObject;
    return this.#states;
  }
  // Getter & setter for #state
  get state() {
    return this.#state;
  }
  set state(state) {
    this.#state = this.#states[`${state}`];
    return this.#state;
  }
  // Getter for the position of the sprite
  get position() {
    if (this.sprite == null) {
      return false;
    }
    return { x: this.sprite.x, y: this.sprite.y };
  }
  // Getter for the width and height of the obejct/ sprite
  get width() {
    return this.sprite.width;
  }
  get height() {
    return this.sprite.height;
  }
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

  /******************************************
   * GETTERS & SETTERS
   ******************************************/
  addToStage() {
    this.sprite.play();
    this.app.stage.addChild(this.sprite);
  }
  /**
   * Change the sprite to the new one based on the state.
   * @param {*} state
   */
  updateSprite(state) {
    let { x, y } = this.position != false ? this.position : { x: 0, y: 0 };
    this.app.stage.removeChild(this.sprite);

    this.sprite = new PIXI.AnimatedSprite(this.textures[`${this.state}`]);
    this.sprite.scale.x = this.scale.x;
    this.sprite.scale.y = this.scale.y;
    this.sprite.animationSpeed = this.animationSpeed;

    this.sprite.x = x;
    this.sprite.y = y;

    this.addToStage();
  }

  /**
   * [DEPRECATED] Returns the point position of the sprite of the GameObject
   * @returns position in an object { x: x, y: y }
   */
  getPosition() {
    console.log(
      "getPostiion() is deprecated in favor of the .position property."
    );
    return this.position;
  }

  /**
   * Updates the position of the sprite behind the GameObject
   * @param {*} x
   * @param {*} y
   * @returns the updated point object { x: x, y: y }
   */
  updatePosition(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
    return { x: this.sprite.x, y: this.sprite.y };
  }

  // Assets loading -> Textures loading
  async load() {
    return new Promise((resolve, reject) => {
      // Loads all textures and then define the proper Sprite based on the character state
      this.#loadTextures()
        .then(() => {
          this.updateSprite(this.state);
          resolve(this);
        })
        .then(() => {
          this.app.ticker.add((delta) => {
            this.elapsed += delta;
            this.move(delta, this.elapsed);
            // this.checkCollision();
            // this.adjustPosition()
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
  /******************************************
   * MOVEMENT METHODS
   ******************************************/
  walkRight() {
    if (
      this.horizontalMovingDirection !=
      Character.HorizontalMovingDirections.RIGHT
    ) {
      this.horizontalMovingDirection =
        Character.HorizontalMovingDirections.RIGHT;
    }
    this.#updateVelicityX();
  }
  walkLeft() {
    if (
      this.horizontalMovingDirection !=
      Character.HorizontalMovingDirections.LEFT
    ) {
      this.horizontalMovingDirection =
        Character.HorizontalMovingDirections.LEFT;
    }
    this.#updateVelicityX();
  }
  walkStop() {
    if (
      this.horizontalMovingDirection !=
      Character.HorizontalMovingDirections.NOT_MOVING
    ) {
      this.horizontalMovingDirection =
        Character.HorizontalMovingDirections.NOT_MOVING;
    }
    this.#updateVelicityX();
  }
  #updateVelicityX() {
    let direction =
      this.horizontalMovingDirection ==
      Character.HorizontalMovingDirections.RIGHT
        ? 1
        : this.horizontalMovingDirection ==
          Character.HorizontalMovingDirections.LEFT
        ? -1
        : 0;
    this.vx = direction * this.horizontalMovementSpeed;
  }
  jump() {
    this.updatePosition(
      Math.random() * this.app.view.width,
      Math.random() * this.app.view.height
    );
  }

  // Gets called on every tick
  move(delta) {
    let position = this.physicsEngine.nextPosition(this, delta, this.elapsed);
    //console.log(position);

    let { x, y } = this.position;
    //this.updatePosition(position.x, position.y);
    this.updatePosition(position.x, y);
  }
}
