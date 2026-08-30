/**
 * Character / Ninja — Tier 3 (real objects against a stubbed PIXI global).
 *
 * Character and Ninja construct fine without PIXI because they only reach for
 * the global inside methods. That makes the whole movement and animation-state
 * system reachable from Node with the small stub in helpers/pixi-stub.js.
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import { Character } from "../public/js/Character.js";
import { makeNinja } from "./helpers/factories.js";
import { removePixiStub, fakeApp } from "./helpers/pixi-stub.js";

describe("Character construction", () => {
  afterEach(removePixiStub);

  test("starts at rest", () => {
    const character = new Character(fakeApp(), { 0: "idle" }, {}, "Test");
    assert.equal(character.vx, 0);
    assert.equal(character.vy, 0);
  });

  test("reports no position before a sprite exists", () => {
    const character = new Character(fakeApp(), { 0: "idle" }, {}, "Test");
    assert.equal(character.position, false);
  });

  test("starts in the NOT_MOVING direction", () => {
    const character = new Character(fakeApp(), { 0: "idle" }, {}, "Test");
    assert.equal(
      character.horizontalMovingDirection,
      Character.HorizontalMovingDirections.NOT_MOVING
    );
  });
});

describe("Character horizontal movement", () => {
  let ninja;

  beforeEach(() => {
    ({ ninja } = makeNinja());
  });
  afterEach(removePixiStub);

  test("walking right sets a positive velocity", () => {
    ninja.walkRight();
    assert.equal(ninja.vx, ninja.horizontalMovementSpeed);
  });

  test("walking left sets a negative velocity", () => {
    ninja.walkLeft();
    assert.equal(ninja.vx, -ninja.horizontalMovementSpeed);
  });

  test("stopping zeroes the velocity", () => {
    ninja.walkRight();
    ninja.walkStop();
    assert.equal(ninja.vx, 0);
  });

  test("direction tracks the last movement command", () => {
    ninja.walkRight();
    assert.equal(ninja.horizontalMovingDirection, "RIGHT");
    ninja.walkLeft();
    assert.equal(ninja.horizontalMovingDirection, "LEFT");
    ninja.walkStop();
    assert.equal(ninja.horizontalMovingDirection, "NOT_MOVING");
  });

  test("an unrecognised direction is rejected", () => {
    ninja.walkRight();
    ninja.horizontalMovingDirection = "SIDEWAYS";
    assert.equal(ninja.horizontalMovingDirection, "RIGHT");
  });
});

describe("Ninja animation state", () => {
  let ninja;

  beforeEach(() => {
    ({ ninja } = makeNinja());
  });
  afterEach(removePixiStub);

  test("running switches to the run animation", () => {
    ninja.walkRight();
    assert.equal(ninja.state, "run");
  });

  test("stopping returns to the idle animation", () => {
    ninja.walkRight();
    ninja.walkStop();
    assert.equal(ninja.state, "idle");
  });

  test("the active sprite plays", () => {
    ninja.walkRight();
    assert.equal(ninja.sprite.playing, true);
  });

  test("walking left mirrors the sprite", () => {
    ninja.walkLeft();
    assert.ok(ninja.sprite.scale.x < 0, `scale.x was ${ninja.sprite.scale.x}`);
  });

  test("turning back to the right un-mirrors the sprite", () => {
    ninja.walkLeft();
    ninja.walkRight();
    assert.ok(ninja.sprite.scale.x > 0, `scale.x was ${ninja.sprite.scale.x}`);
  });

  test("repeated direction changes do not accumulate scale", () => {
    ninja.walkRight();
    const original = ninja.sprite.scale.x;
    for (let i = 0; i < 5; i++) {
      ninja.walkLeft();
      ninja.walkRight();
    }
    assert.equal(ninja.sprite.scale.x, original);
  });
});

describe("Character positioning", () => {
  let ninja, app;

  beforeEach(() => {
    ({ ninja, app } = makeNinja());
  });
  afterEach(removePixiStub);

  test("updatePosition moves the sprite and returns the new point", () => {
    const point = ninja.updatePosition(120, 340);
    assert.deepEqual(point, { x: 120, y: 340 });
    assert.deepEqual(ninja.position, { x: 120, y: 340 });
  });

  test("changing animation preserves the position", () => {
    ninja.updatePosition(120, 340);
    ninja.walkRight();
    assert.deepEqual(ninja.position, { x: 120, y: 340 });
  });

  test("changing animation swaps the sprite on the stage", () => {
    const before = app.added.length;
    ninja.walkRight();
    assert.ok(app.added.length > before, "no sprite was added to the stage");
    assert.ok(app.removed.length > 0, "the previous sprite was not removed");
  });
});

describe("Character.move", () => {
  let ninja;

  beforeEach(() => {
    ({ ninja } = makeNinja());
  });
  afterEach(removePixiStub);

  test("advances horizontally while walking", () => {
    ninja.updatePosition(100, 100);
    ninja.walkRight();
    ninja.move(1);
    assert.ok(ninja.position.x > 100, `x stayed at ${ninja.position.x}`);
  });

  test("does not drift horizontally while standing still", () => {
    ninja.updatePosition(100, 100);
    ninja.move(1);
    assert.equal(ninja.position.x, 100);
  });
});

describe("Character.jump [SPEC — fails until Phase 1]", () => {
  let ninja;

  beforeEach(() => {
    ({ ninja } = makeNinja());
  });
  afterEach(removePixiStub);

  // jump() currently teleports the character to a random point on screen.
  test("gives the character upward velocity", () => {
    ninja.updatePosition(100, 300);
    ninja.jump();
    assert.ok(ninja.vy < 0, `expected upward velocity, vy was ${ninja.vy}`);
  });

  test("does not change horizontal position", () => {
    ninja.updatePosition(100, 300);
    ninja.jump();
    assert.equal(ninja.position.x, 100);
  });
});
