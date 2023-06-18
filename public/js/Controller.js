import { Game } from "./Game.js";
export class Controller {
  constructor(game) {
    this.controlType = "SuperNintendo";
    this.game = game
  }
  moveUp() {}
  moveRight() {
    this.game.inputCharacterMoveRight();
  }
  moveDown() {}
  moveLeft() {
    this.game.inputCharacterMoveLeft();
  }

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
