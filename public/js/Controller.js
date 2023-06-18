import { Game } from "./Game.js";
export class Controller {
  constructor(game) {
    this.controlType = "SuperNintendo";
    this.game = game
  }
  moveUp() {}
  moveRight() {}
  moveDown() {}
  moveLeft() {}

  buttonA() {}
  buttonB() {
    this.game.inputCharacterJump();
  }
  buttonX() {}
  buttonY() {}
  buttonL() {}
  buttonR() {}

  buttonStart() {}
  buttonSelet() {}
}
