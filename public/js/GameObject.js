/**
 * Implements the base drawable object in the Game. This are static objects.
 * For moving ones try Character.
 */
export class GameObject {
  constructor(app, statesObject, spritesObject) {
    this.app = app; // PIXI App
    this.#states = statesObject; // object with states as keys and values
    this.#state = statesObject[0]; // defaults to 0
    this.#sprites = spritesObject; // object with states as keys and array of paths for values
  }

  // Properties w/ default values
  #state = null;
  #states = {};
  #sprites = {};
  sprite = null; // initial & active sprite
  textures = {}; // empty object for textures

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

  get state() {
    return this.#state;
  }
  set state(state) {
    this.#state = this.#states[`${state}`];
    return this.#state;
  }

  // Methods
  addToStage() {
    this.sprite.play();
    this.app.stage.addChild(this.sprite);
  }
  /**
   * Change the sprite to the new one based on the state.
   * @param {*} state
   */
  updateSprite(state) {
    let { x, y } =
      this.getPosition() != false ? this.getPosition() : { x: 0, y: 0 };
    this.app.stage.removeChild(this.sprite);

    this.sprite = new PIXI.AnimatedSprite(this.textures[`${this.state}`]);
    this.sprite.scale.x = 0.5;
    this.sprite.scale.y = 0.5;
    this.sprite.animationSpeed = 1 / 3; // 3 fps

    this.sprite.x = x;
    this.sprite.y = y;

    this.addToStage();
  }

  /**
   * Returns the point position of the sprite of the GameObject
   * @returns position in an object { x: x, y: y }
   */
  getPosition() {
    if (this.sprite == null) {
      return false;
    }
    return { x: this.sprite.x, y: this.sprite.y };
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

  /**
   * Interface method to be implemented by the moving classes
   */
  move() {}
}
