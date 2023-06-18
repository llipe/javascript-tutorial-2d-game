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
    };
    super(app, name, statesObject, spritesObject);
    this.state = this.states[`${initialState}`];
    this.horizontalMovementSpeed = 25;
  }
}
