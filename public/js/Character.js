import { GameObject } from "./GameObject.js";

export class Character extends GameObject {
  constructor(app, statesObject, spritesObject, name) {
    super(app, statesObject, spritesObject);
    this.name = name; // Any name to identify thge type of character
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
  #horizontalMovingDirection = Character.HorizontalMovingDirections.NOT_MOVING;
  #verticalMovingDirection = Character.VerticalMovingDirections.NOT_MOVING;

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

  // Methods
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
}
