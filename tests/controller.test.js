/**
 * Controller — Tier 2 (real object, faked collaborator).
 *
 * The Controller's whole job is translating button semantics into Game inputs,
 * so a spy Game that records calls is the entire assertion surface. No PIXI
 * needed: the Controller never renders.
 */

import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { Controller } from "../public/js/Controller.js";
import { spyGame } from "./helpers/factories.js";

const { KeyPress, KeyRelease } = Controller.KeyPressingOptions;

describe("Controller movement mapping", () => {
  let game, controller;

  beforeEach(() => {
    game = spyGame();
    controller = new Controller(game);
  });

  test("pressing right starts rightward movement", () => {
    controller.moveRight(KeyPress);
    assert.deepEqual(game.names(), ["inputCharacterMoveRight"]);
  });

  test("releasing right stops rightward movement", () => {
    controller.moveRight(KeyRelease);
    assert.deepEqual(game.names(), ["inputCharacterMoveRightStop"]);
  });

  test("pressing left starts leftward movement", () => {
    controller.moveLeft(KeyPress);
    assert.deepEqual(game.names(), ["inputCharacterMoveLeft"]);
  });

  test("releasing left stops leftward movement", () => {
    controller.moveLeft(KeyRelease);
    assert.deepEqual(game.names(), ["inputCharacterMoveLeftStop"]);
  });

  test("a press/release pair produces a start then a stop", () => {
    controller.moveRight(KeyPress);
    controller.moveRight(KeyRelease);
    assert.deepEqual(game.names(), [
      "inputCharacterMoveRight",
      "inputCharacterMoveRightStop",
    ]);
  });

  // index.js sends Controller.KeyPressingOptions.KeyRepeat on held keys, but
  // that key is not declared on KeyPressingOptions, so the value is `undefined`.
  // It happens to behave correctly because the guard tests `!= KeyRelease`.
  // Pinned here so that adding the missing enum member cannot silently change
  // behaviour. See docs/TESTING.md, "Bugs the tests surfaced".
  test("an undeclared key option is treated as a press, not a release", () => {
    assert.equal(Controller.KeyPressingOptions.KeyRepeat, undefined);
    controller.moveRight(Controller.KeyPressingOptions.KeyRepeat);
    assert.deepEqual(game.names(), ["inputCharacterMoveRight"]);
  });
});

describe("Controller button mapping", () => {
  let game, controller;

  beforeEach(() => {
    game = spyGame();
    controller = new Controller(game);
  });

  test("button B jumps", () => {
    controller.buttonB(KeyPress);
    assert.deepEqual(game.names(), ["inputCharacterJump"]);
  });

  test("select toggles the debug overlay", () => {
    controller.buttonSelect(KeyPress);
    assert.deepEqual(game.names(), ["toggleUtils"]);
  });

  test("unwired buttons are silent no-ops", () => {
    for (const button of ["buttonA", "buttonX", "buttonY", "buttonL", "buttonR", "buttonStart"]) {
      assert.doesNotThrow(() => controller[button](KeyPress), `${button} threw`);
    }
    for (const direction of ["moveUp", "moveDown"]) {
      assert.doesNotThrow(() => controller[direction](KeyPress), `${direction} threw`);
    }
    assert.deepEqual(game.names(), [], "an unwired control reached the game");
  });
});
