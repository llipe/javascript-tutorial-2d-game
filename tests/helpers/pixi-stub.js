/**
 * Test double for the parts of PixiJS the game touches.
 *
 * The game loads PixiJS from a CDN <script> tag, so `PIXI` is a global rather
 * than an import. Under Node that global does not exist, and any code path that
 * reaches for it throws `ReferenceError: PIXI is not defined`.
 *
 * Character and Ninja only touch PIXI inside methods (never in the
 * constructor), so this small stub is enough to exercise all of their movement
 * and animation-state logic. Platform and Game touch PIXI in their
 * constructors and need the browser tier instead.
 */

/** Stands in for PIXI.AnimatedSprite. */
export class FakeAnimatedSprite {
  constructor(textures) {
    this.textures = textures;
    this.scale = { x: 1, y: 1 };
    this.anchor = { x: 0, y: 0 };
    this.x = 0;
    this.y = 0;
    // Fixed dimensions so collision maths in tests is predictable.
    this.width = 60;
    this.height = 90;
    this.playing = false;
  }
  play() {
    this.playing = true;
  }
}

/** Installs the global PIXI stub. Call before any code that renders. */
export function installPixiStub() {
  globalThis.PIXI = { AnimatedSprite: FakeAnimatedSprite };
}

/** Removes the stub so a leaked reference fails loudly instead of silently. */
export function removePixiStub() {
  delete globalThis.PIXI;
}

/**
 * Minimal stand-in for a PIXI.Application. Records what was added to the stage
 * so tests can assert on it.
 */
export function fakeApp() {
  const added = [];
  const removed = [];
  return {
    added,
    removed,
    stage: {
      addChild(child) {
        added.push(child);
      },
      removeChild(child) {
        removed.push(child);
      },
    },
    view: { width: 960, height: 540 },
    ticker: { add() {}, FPS: 60 },
  };
}
