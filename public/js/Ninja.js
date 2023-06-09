import { Character } from "./Character.js";
export class Ninja extends Character {
  constructor(app, initialState = "idle") {
    let name = "Ninja";
    let statesObject = {
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
    };

    let spritesObject = {
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
      run: [
        "../img/ninja/png/Run__000.png",
        "../img/ninja/png/Run__001.png",
        "../img/ninja/png/Run__002.png",
        "../img/ninja/png/Run__003.png",
        "../img/ninja/png/Run__004.png",
        "../img/ninja/png/Run__005.png",
        "../img/ninja/png/Run__006.png",
        "../img/ninja/png/Run__007.png",
        "../img/ninja/png/Run__008.png",
        "../img/ninja/png/Run__009.png",
      ],
      jump: [
        "../img/ninja/png/Jump__000.png",
        "../img/ninja/png/Jump__001.png",
        "../img/ninja/png/Jump__002.png",
        "../img/ninja/png/Jump__003.png",
        "../img/ninja/png/Jump__004.png",
        "../img/ninja/png/Jump__005.png",
        "../img/ninja/png/Jump__006.png",
        "../img/ninja/png/Jump__007.png",
        "../img/ninja/png/Jump__008.png",
        "../img/ninja/png/Jump__009.png",
      ],
    };
    super(app, statesObject, spritesObject, name);
    this.state = this.states[`${initialState}`];
    this.horizontalMovementSpeed = 5;
    this.animationSpeed = 1/2;
    this.scale.x = this.scale.y = 0.25;
  }

  get horizontalMovingDirection() {
    return super.horizontalMovingDirection;
  }
  set horizontalMovingDirection(direction) {
    super.horizontalMovingDirection = direction;
    // if HorizontalMovingDirections exists
    if (Character.HorizontalMovingDirections[`${direction}`] == direction) {
      // Set the correct animations
      switch (direction) {
        case Character.HorizontalMovingDirections.RIGHT:
          this.state = this.states["run"];
          this.updateSprite();
          break;
        case Character.HorizontalMovingDirections.LEFT:
          this.state = this.states["run"];
          this.updateSprite();
          this.sprite.anchor.x = 0.5;
          this.sprite.scale.x *= -1;
          this.sprite.anchor.x = 1;
          break;
        case Character.HorizontalMovingDirections.NOT_MOVING:
          this.state = this.states["idle"];
          this.updateSprite();
          break;
      }
    }
    return this.horizontalMovingDirection;
  }
}
