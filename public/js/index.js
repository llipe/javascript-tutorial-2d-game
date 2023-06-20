import { Controller } from "./Controller.js";
import { Game } from "./Game.js";
let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}
let game = new Game("#display");
let controller = new Controller(game);
game.start();

// onKeyDown & onKeyUp can be put on a single function with KeyPressingOptions set properly
const onKeyDown = (key) => {
  let KeyPressingOptions =
    key.repeat == false
      ? Controller.KeyPressingOptions.KeyPress
      : Controller.KeyPressingOptions.KeyRepeat;
  // W Key is 87 & Up arrow is 38
  if (key.keyCode === 87 || key.keyCode === 38) {
    controller.moveUp(KeyPressingOptions);
  }
  // S Key is 83 & Down arrow is 40
  if (key.keyCode === 83 || key.keyCode === 40) {
    controller.moveDown(KeyPressingOptions);
  }
  // A Key is 65 & Left arrow is 37
  if (key.keyCode === 65 || key.keyCode === 37) {
    controller.moveLeft(KeyPressingOptions);
  }
  // D Key is 68 & Right arrow is 39
  if (key.keyCode === 68 || key.keyCode === 39) {
    controller.moveRight(KeyPressingOptions);
  }
  // Spacebar is 32
  if (key.keyCode === 32) {
    controller.buttonB(KeyPressingOptions);
  }
};
const onKeyUp = (key) => {
  let KeyPressingOptions = Controller.KeyPressingOptions.KeyRelease;

  if (key.keyCode === 87 || key.keyCode === 38) {
    controller.moveUp(KeyPressingOptions);
  }
  // S Key is 83 & Down arrow is 40
  if (key.keyCode === 83 || key.keyCode === 40) {
    controller.moveDown(KeyPressingOptions);
  }
  // A Key is 65 & Left arrow is 37
  if (key.keyCode === 65 || key.keyCode === 37) {
    controller.moveLeft(KeyPressingOptions);
  }
  // D Key is 68 & Right arrow is 39
  if (key.keyCode === 68 || key.keyCode === 39) {
    controller.moveRight(KeyPressingOptions);
  }
  // Spacebar is 32
  if (key.keyCode === 32) {
    // Only jump on press, no up
    // controller.buttonB(KeyPressingOptions);
  }
};
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
