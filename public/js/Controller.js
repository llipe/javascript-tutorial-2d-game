import { Game } from "./Game.js";
import { Character } from "./Character.js";
export class Controller {
  static KeyPressingOptions = {
    KeyPress: "KeyPres",
    KeyPressingOption: "KeyPressingOption",
    KeyRelease: "KeyRelease",
  };
  constructor(game) {
    this.controlType = "SuperNintendo";
    this.game = game;
  }
  moveUp(keyPressingOption) {}
  moveRight(keyPressingOption) {
    if (keyPressingOption != Controller.KeyPressingOptions.KeyRelease) {
      this.game.inputCharacterMoveRight();
    } else {
      this.game.inputCharacterMoveRightStop();
    }
  }
  moveDown(keyPressingOption) {}
  moveLeft(keyPressingOption) {
    if (keyPressingOption != Controller.KeyPressingOptions.KeyRelease) {
      this.game.inputCharacterMoveLeft();
    } else {
      this.game.inputCharacterMoveLeftStop();
    }
  }

  buttonA(leyPressingOption) {}
  buttonB(KeyPressingOption) {
    this.game.inputCharacterJump();
  }
  buttonX(keyPressingOption) {}
  buttonY(keyPressingOption) {}
  buttonL(keyPressingOption) {}
  buttonR(keyPressingOption) {}

  buttonStart(keyPressingOption) {}
  buttonSelet(keyPressingOption) {}
}
