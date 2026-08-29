# Testing strategy

[← back to the README](../README.md)

This document explains how this project is tested, why it is tested that way, and how to add to it. It is written to be read start to finish once, then skimmed.

## Quick start

```bash
npm test           # everything — currently RED on purpose, see below
npm run test:current   # only the tests that should pass today — green
npm run test:watch     # re-run on file change
```

## A red suite is the expected state

Running `npm test` today gives you this:

```
# tests 50
# pass 38
# fail 12
```

**That is correct.** Those 12 failures are not broken tests — they are the specification for work that has not been done yet.

Roadmap Phase 1 is *repair the physics engine*. The gravity integration, the jump, and the collision resolution are all known to be wrong. So the tests describe what those functions are supposed to do, and they will keep failing until the engine actually does it. When the last one goes green, Phase 1 is finished. That is the whole point: **the test suite is the definition of done.**

Suites that describe unbuilt behaviour are tagged in their name:

```js
describe("PhysicsEngine.resolveCollision [SPEC — fails until Phase 1]", () => { ... });
```

If you want a green signal in the meantime — a pre-commit check, or CI — use `npm run test:current`, which skips anything tagged `SPEC` and passes cleanly.

### Why not write tests that match the current behaviour?

There is a legitimate technique called *characterization testing*, where you pin down whatever the code does today — bugs included — so you can refactor safely without changing behaviour. It is the right tool when you are restructuring code you intend to keep.

It is the wrong tool here. We are not preserving this physics engine, we are replacing it. Writing a test that asserts gravity vanishes at `delta = 2` would carefully protect a bug. So the tests describe the intended behaviour instead, and start red.

The rule of thumb: **characterize what you are keeping, specify what you are fixing.**

## The runner: `node:test`

Tests use Node's built-in test runner and assertion library. No Jest, no Vitest, no dependencies at all.

That is a deliberate fit with the rest of the project, which has no build step and no framework. You are here to learn how things work; a runner that needs its own config file and transform pipeline puts a layer between you and the code. `node:test` is a standard library — `describe`, `test`, `beforeEach`, and `assert` behave the way the documentation says they do.

One consequence worth knowing: `package.json` now sets `"type": "module"`. Without it Node treats `.js` files as CommonJS, fails to parse the `import` statements, and prints a `MODULE_TYPELESS_PACKAGE_JSON` warning on every run. Every `.js` file in this project was already an ES module, so the change is purely declarative.

## The four tiers

The game loads PixiJS from a CDN `<script>` tag, so `PIXI` is a **global**, not an import. Under Node that global does not exist, and any code that reaches for it throws `ReferenceError: PIXI is not defined`. That single fact determines what is cheap to test and what is expensive.

Probing every module under bare Node gives the real picture:

| Tier | Modules | Setup | State |
| --- | --- | --- | --- |
| **1 — Pure logic** | `PhysicsEngine` | none | ✅ implemented |
| **2 — Injected collaborator** | `Controller` | a spy `Game` | ✅ implemented |
| **3 — Stubbed PIXI** | `Character`, `Ninja` | ~30-line stub + fake app | ✅ implemented |
| **4 — Browser** | `Game`, `Level`, `Platform` | Playwright | ⬜ not yet |

All seven modules **import** cleanly under Node. Only `Platform` and `Game` throw on **construction**, because they build `PIXI.Container` and `PIXI.Application` in their constructors. `Character` and `Ninja` construct fine — they only touch PIXI inside methods.

That is a happy accident of the existing design, and it is what makes Tier 3 worth doing. The entire movement and animation-state system — velocity, direction tracking, animation switching, sprite mirroring, positioning — is reachable from a plain Node process with a stub small enough to read in one sitting.

### Tier 1 — pure logic

`PhysicsEngine` imports nothing and touches no globals. It is arithmetic on plain objects. No doubles, no setup, no ceremony:

```js
const engine = new PhysicsEngine();
assert.equal(engine.detectCollision(box(0, 0), box(5, 5)), true);
```

This is the most valuable tier by a wide margin, and it is the reason to keep rendering out of the physics code. Anything you can move into this tier gets cheap to test.

### Tier 2 — inject the collaborator

`Controller` translates button semantics into `Game` method calls. It never renders. Hand it a fake `Game` that records what it was asked to do, and the recording *is* the assertion:

```js
const game = spyGame();
new Controller(game).moveRight(KeyRelease);
assert.deepEqual(game.names(), ["inputCharacterMoveRightStop"]);
```

Note what is *not* asserted: whether the character actually moved. That belongs to `Character`'s tests. A controller test that checked movement would fail for two unrelated reasons, and you would not know which.

### Tier 3 — stub the boundary

`tests/helpers/pixi-stub.js` provides a `FakeAnimatedSprite` and a `fakeApp()` whose stage records what was added and removed. `makeNinja()` in `factories.js` wires them together and pre-loads fake textures, skipping the real asset loading (which needs a browser and a network).

The stub replaces **only** PixiJS — the third-party boundary. `PhysicsEngine` and `Character` are never mocked, because they are the things under test. Mocking code you own is how a suite ends up passing while the application is broken.

### Tier 4 — browser (not implemented)

`Game`, `Level` and `Platform` build real PIXI objects in their constructors. Stubbing enough of PixiJS to satisfy them would mean reimplementing a chunk of the library, and the stub would drift from the real thing — a test that passes against a fiction. These belong in a real browser with real PixiJS, driven by Playwright.

This tier is deliberately deferred rather than half-built. It is also the natural home for the real acceptance test of Phase 1:

- the page loads with no console errors and a canvas is attached
- pressing `D` moves the character right
- pressing `H` toggles the stats overlay
- **the character comes to rest on a platform instead of falling through it**

Keep this layer thin when it lands. Browser tests are slow and flaky compared to the tiers above; use them for "the whole thing is wired together", not for logic that Tier 1 could cover.

## What the tests found

Writing the suite surfaced three things that reading the code had not made obvious. This is the argument for tests in a learning project, more than regression safety: they force you to state precisely what you expect, and the gap between that and reality is where the bugs live.

### Collision *detection* is already correct

The four-way `||` chains in `horizontalCollisionDetection` and `verticalCollisionDetection` look alarming, but they collapse to a standard AABB overlap test — the paired vertices being compared share identical coordinates, so each chain reduces to a single comparison.

This changes the Phase 1 plan. Detection does not need rewriting, only simplifying, and the tests now guard that simplification. It is **resolution** that is broken.

### The contact problem

`detectCollision` uses `>=`, so two boxes that merely touch edges count as colliding. That is currently harmless, because resolution never produces touching boxes — it teleports things to the origin instead.

It stops being harmless the moment resolution is fixed. If resolution places a character exactly on a platform's surface, detection reports a collision again on the very next frame, and the character jitters forever.

So Phase 1 has to make a decision, and the two options are not interchangeable:

1. Resolution leaves a sub-pixel gap, and detection keeps `>=`.
2. Resolution produces exact contact, and detection switches to strict `>`.

Option 2 is cleaner. Either way, the choice is now pinned by two tests that will argue with each other if you only change one side:

- `"treats edge contact as a collision (current behaviour)"` in the detection suite
- `"resolution separates the two boxes"` in the resolution suite

The second is a property test: it generates 200 overlapping box pairs from a seeded PRNG and asserts that resolution actually separates them. Seeded, so a failure reproduces exactly.

### `KeyRepeat` does not exist

`index.js` passes `Controller.KeyPressingOptions.KeyRepeat` for held keys, but `KeyPressingOptions` declares `KeyPress`, `KeyPressingOption` and `KeyRelease`. There is no `KeyRepeat`, so the value is `undefined`.

It works anyway, because the guard tests `!= KeyRelease` and `undefined` satisfies that. But it works by accident. A test pins the current behaviour so that adding the missing enum member is a deliberate change rather than a silent one.

## Conventions

**Name tests as behavioural sentences.** `"landing on a platform places the character on top of it"`, not `"test resolveCollision"`. Test output should read as a list of violated expectations.

**One behaviour per test.** When a test fails you should know what broke without reading the body.

**Arrange, act, assert** — in that order, with the fixtures built by helpers so the assertion is the interesting part of the test.

**Give failures a useful message.** `assert.ok(a > b)` prints nothing you can act on. Pass a message with the actual values:

```js
assert.ok(drop(2) > drop(1), `expected drop(2) to exceed drop(1), got ${drop(2)} and ${drop(1)}`);
```

**Only stub at the third-party boundary.** PixiJS gets a double. Your own classes do not.

**Prefer `node:assert/strict`.** `assert.equal` in strict mode is `===`; the loose default will tell you `"5" == 5` is fine, which is rarely what you meant.

**Tag unbuilt behaviour with `[SPEC — ...]`** in the suite name, so a red run is self-explanatory and `test:current` can filter it.

## Layout

```
tests/
  helpers/
    pixi-stub.js         PIXI double: FakeAnimatedSprite, fakeApp()
    factories.js         box(), overlaps(), makeNinja(), spyGame(), seededRandom()
  physics-engine.test.js Tier 1
  controller.test.js     Tier 2
  character.test.js      Tier 3
```

`node --test` discovers `*.test.js` automatically. Files under `helpers/` are not matched, so they are never run as tests.

## Adding a test

1. Pick the lowest tier that can reach the behaviour. If it needs the browser, ask whether the logic could be moved somewhere the browser is not needed — usually it can, and the code is better for it.
2. If the behaviour does not exist yet, write the test anyway and tag the suite `[SPEC]`.
3. Watch it fail, and read the failure. A test you have never seen fail is a test you have not verified — it may be asserting nothing at all.
4. Then make it pass.

## Roadmap for the suite

- [x] Tier 1 — `PhysicsEngine`
- [x] Tier 2 — `Controller`
- [x] Tier 3 — `Character` / `Ninja`
- [ ] Turn the 12 `SPEC` tests green (roadmap Phase 1)
- [ ] Tier 4 — Playwright smoke tests
- [ ] Level-format parsing and validation tests (roadmap Phase 3)
- [ ] CI via GitHub Actions, running `npm test`
