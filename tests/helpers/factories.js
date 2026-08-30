/**
 * Test fixtures. Keeping construction out of the test bodies means the
 * assertions stay readable and the setup stays in one place.
 */

import { Ninja } from "../../public/js/Ninja.js";
import { installPixiStub, fakeApp } from "./pixi-stub.js";

/**
 * A rectangle in the shape the PhysicsEngine expects: anything with
 * `position`, `width`, `height` and velocity. Both Characters and Platforms
 * satisfy this, which is why the engine can take either.
 */
export function box(x, y, width = 10, height = 10, { vx = 0, vy = 0 } = {}) {
  return { position: { x, y }, width, height, vx, vy };
}

/** True when two boxes strictly overlap (zero-area contact does not count). */
export function overlaps(a, b) {
  return (
    a.position.x + a.width > b.position.x &&
    a.position.x < b.position.x + b.width &&
    a.position.y + a.height > b.position.y &&
    a.position.y < b.position.y + b.height
  );
}

/**
 * A Ninja wired up with the PIXI stub and pre-loaded textures, ready to move.
 * Skips the real asset loading, which needs a browser and a network.
 */
export function makeNinja() {
  installPixiStub();
  const app = fakeApp();
  const ninja = new Ninja(app);
  ninja.textures = {
    idle: ["idle-0", "idle-1"],
    run: ["run-0", "run-1"],
    jump: ["jump-0", "jump-1"],
    attack: ["attack-0", "attack-1"],
  };
  ninja.updateSprite();
  return { ninja, app };
}

/**
 * A stand-in for Game that records which input methods the Controller called.
 * The Controller's job is translation, so recording the calls is the whole
 * assertion surface.
 */
export function spyGame() {
  const calls = [];
  const record =
    (name) =>
    (...args) => {
      calls.push({ name, args });
    };
  return {
    calls,
    names: () => calls.map((c) => c.name),
    toggleUtils: record("toggleUtils"),
    inputGameStart: record("inputGameStart"),
    inputGameSelect: record("inputGameSelect"),
    inputCharacterMoveRight: record("inputCharacterMoveRight"),
    inputCharacterMoveRightStop: record("inputCharacterMoveRightStop"),
    inputCharacterMoveLeft: record("inputCharacterMoveLeft"),
    inputCharacterMoveLeftStop: record("inputCharacterMoveLeftStop"),
    inputCharacterJump: record("inputCharacterJump"),
    inputCharacterAttack: record("inputCharacterAttack"),
  };
}

/** Deterministic PRNG, so property tests fail reproducibly. */
export function seededRandom(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
