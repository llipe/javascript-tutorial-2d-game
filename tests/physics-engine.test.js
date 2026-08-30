/**
 * PhysicsEngine — Tier 1 (pure logic, no test doubles needed).
 *
 * Suites tagged [SPEC] describe intended behaviour and FAIL today. They are the
 * definition of done for roadmap Phase 1. Everything else passes and guards
 * behaviour that already works.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { PhysicsEngine } from "../public/js/PhysicsEngine.js";
import { box, overlaps, seededRandom } from "./helpers/factories.js";

describe("PhysicsEngine.detectCollision", () => {
  const engine = new PhysicsEngine();

  test("detects two overlapping boxes", () => {
    assert.equal(engine.detectCollision(box(0, 0), box(5, 5)), true);
  });

  test("detects a box fully contained in another", () => {
    assert.equal(engine.detectCollision(box(10, 10), box(0, 0, 100, 100)), true);
  });

  test("rejects boxes separated on the x axis", () => {
    assert.equal(engine.detectCollision(box(0, 0), box(100, 0)), false);
  });

  test("rejects boxes separated on the y axis", () => {
    assert.equal(engine.detectCollision(box(0, 0), box(0, 100)), false);
  });

  test("rejects boxes that overlap on x but not on y", () => {
    assert.equal(engine.detectCollision(box(0, 0), box(5, 100)), false);
  });

  test("passes the result to a callback when one is given", () => {
    const seen = [];
    engine.detectCollision(box(0, 0), box(5, 5), (r) => seen.push(r));
    engine.detectCollision(box(0, 0), box(99, 99), (r) => seen.push(r));
    assert.deepEqual(seen, [true, false]);
  });

  // Contact is not collision. This is what lets resolution place a character
  // exactly on a platform surface without it colliding again on the next frame
  // and jittering. See docs/TESTING.md, "The contact problem".
  test("treats side-by-side contact as separation", () => {
    assert.equal(engine.detectCollision(box(0, 0), box(10, 0)), false);
  });

  test("treats resting on a surface as separation", () => {
    // A character whose feet are exactly on a platform's top edge.
    assert.equal(engine.detectCollision(box(0, 0), box(0, 10)), false);
  });

  // Guards against over-correcting: strict comparisons must still catch a
  // genuine overlap, however shallow.
  test("detects a one-unit overlap on x", () => {
    assert.equal(engine.detectCollision(box(0, 0), box(9, 0)), true);
  });

  test("detects a one-unit overlap on y", () => {
    assert.equal(engine.detectCollision(box(0, 0), box(0, 9)), true);
  });

  // Cross-checks all sixteen comparisons in the two axis functions against an
  // independent geometric oracle, so a single flipped operator cannot slip by.
  test("agrees with strict geometric overlap across random pairs", () => {
    const random = seededRandom(7);
    const a = box(100, 100, 60, 90);
    let overlapping = 0;

    for (let i = 0; i < 500; i++) {
      const b = box(
        60 + Math.round(random() * 140),
        60 + Math.round(random() * 160),
        40 + Math.round(random() * 60),
        40 + Math.round(random() * 60)
      );
      if (overlaps(a, b)) overlapping++;
      assert.equal(
        engine.detectCollision(a, b),
        overlaps(a, b),
        `disagreement at ${JSON.stringify(b.position)} ${b.width}x${b.height}`
      );
    }

    // Guards against a vacuous pass if the generator stopped producing overlaps.
    assert.ok(overlapping > 50, `only ${overlapping} overlapping pairs generated`);
  });
});

describe("PhysicsEngine axis detection", () => {
  const engine = new PhysicsEngine();

  test("horizontal detection ignores vertical separation", () => {
    assert.equal(engine.horizontalCollisionDetection(box(0, 0), box(5, 500)), true);
  });

  test("vertical detection ignores horizontal separation", () => {
    assert.equal(engine.verticalCollisionDetection(box(0, 0), box(500, 5)), true);
  });
});

describe("PhysicsEngine.nextPosition [SPEC — fails until Phase 1]", () => {
  const engine = new PhysicsEngine();
  const dropOver = (delta) => engine.nextPosition(box(0, 0), delta, 0).y;

  // The single cheapest test that catches `delta ^ 2` being a bitwise XOR
  // rather than exponentiation. Measured today: delta 1 -> 15, delta 2 -> 0.
  test("fall distance grows as the timestep grows", () => {
    assert.ok(
      dropOver(2) > dropOver(1),
      `expected drop(2) to exceed drop(1), got ${dropOver(2)} and ${dropOver(1)}`
    );
  });

  test("fall distance is monotonic across a range of timesteps", () => {
    const deltas = [0.5, 1, 1.5, 2, 3, 4];
    const drops = deltas.map(dropOver);
    const sorted = [...drops].sort((a, b) => a - b);
    assert.deepEqual(drops, sorted, `non-monotonic fall distances: ${drops.join(", ")}`);
  });

  test("an object with downward velocity falls further than one at rest", () => {
    const moving = engine.nextPosition(box(0, 0, 10, 10, { vy: 20 }), 1, 0);
    const resting = engine.nextPosition(box(0, 0, 10, 10, { vy: 0 }), 1, 0);
    assert.ok(
      moving.y > resting.y,
      `vy is being ignored: both ended at y=${moving.y}`
    );
  });

  // Requires the engine to advance velocity, not just position. With exact
  // kinematics (y += v*t + ½gt², v += g*t) one step of 2 and two steps of 1
  // agree precisely; that only holds if velocity carries between steps.
  test("simulation is frame-rate independent", () => {
    const oneBigStep = engine.nextPosition(box(0, 0), 2, 0).y;

    const stepped = box(0, 0);
    for (let i = 0; i < 2; i++) {
      const next = engine.nextPosition(stepped, 1, i);
      stepped.position = { x: next.x, y: next.y };
    }

    assert.equal(
      stepped.position.y,
      oneBigStep,
      `two steps of 1 gave ${stepped.position.y}, one step of 2 gave ${oneBigStep}`
    );
  });

  test("horizontal displacement scales with the timestep", () => {
    const slow = engine.nextPosition(box(0, 0, 10, 10, { vx: 3 }), 1, 0).x;
    const fast = engine.nextPosition(box(0, 0, 10, 10, { vx: 3 }), 2, 0).x;
    assert.equal(fast, slow * 2, `x advanced by ${slow} and ${fast}`);
  });

  test("gravity does not affect horizontal position", () => {
    const { x } = engine.nextPosition(box(50, 0, 10, 10, { vx: 0 }), 1, 0);
    assert.equal(x, 50);
  });
});

describe("PhysicsEngine.resolveCollision [SPEC — fails until Phase 1]", () => {
  const engine = new PhysicsEngine();

  // Today every one of these returns { x: 0, y: 0 }: Math.min(0, ...) clamps
  // any positive coordinate to zero, teleporting the character to the origin.

  test("landing on a platform places the character on top of it", () => {
    const ninja = box(150, 380, 60, 90);
    const platform = box(100, 400, 200, 80);
    assert.deepEqual(engine.resolveCollision(ninja, platform), { x: 150, y: 310 });
  });

  test("walking into a wall pushes the character back horizontally", () => {
    const ninja = box(90, 300, 60, 90);
    const wall = box(100, 300, 200, 80);
    assert.deepEqual(engine.resolveCollision(ninja, wall), { x: 40, y: 300 });
  });

  test("hitting a ceiling pushes the character down", () => {
    const ninja = box(150, 460, 60, 90);
    const ceiling = box(100, 400, 200, 80);
    assert.deepEqual(engine.resolveCollision(ninja, ceiling), { x: 150, y: 480 });
  });

  test("resolves along the axis of least penetration", () => {
    // Overlaps the platform's top-left corner: 10px deep vertically,
    // 40px deep horizontally. The shallow axis wins, so it lands on top.
    const ninja = box(70, 390, 60, 90);
    const platform = box(100, 470, 200, 80);
    const { y } = engine.resolveCollision(ninja, platform);
    assert.equal(y, 380, "expected a vertical resolution onto the platform top");
  });

  // The point of the strict-comparison decision: resolution may place objects
  // in exact contact, and the engine's own detector must then agree they are
  // separated. Checked against an independent oracle as well, so the property
  // cannot pass just because detection and resolution are wrong in step.
  test("resolution separates the boxes, by both the engine and geometry", () => {
    const random = seededRandom(42);
    const platform = box(100, 400, 200, 80);
    let resolved = 0;

    for (let i = 0; i < 200; i++) {
      const mover = box(
        60 + Math.round(random() * 260),
        330 + Math.round(random() * 130),
        40 + Math.round(random() * 40),
        40 + Math.round(random() * 60)
      );
      if (!overlaps(mover, platform)) continue;
      resolved++;

      const moved = { ...mover, position: engine.resolveCollision(mover, platform) };
      const where = `resolved to ${JSON.stringify(moved.position)} from ${JSON.stringify(mover.position)}`;
      assert.ok(!overlaps(moved, platform), `still overlapping: ${where}`);
      assert.ok(!engine.detectCollision(moved, platform), `still colliding: ${where}`);
    }

    assert.ok(resolved > 20, `only ${resolved} overlapping pairs generated`);
  });
});
