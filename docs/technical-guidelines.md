# Technical Guidelines

> The "how" of this project — standards, patterns, and constraints for all code.
> Read alongside [product-context.md](./product-context.md). Living document; update on real technical pivots.

## Tech Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Language | **Plain JavaScript (ES modules)** | `"type": "module"` in `package.json`. Every `.js` file is a native ES module. No TypeScript, no transpilation. |
| Rendering | **PixiJS 7.4.3** | Loaded via CDN `<script>` in `public/index.html`, so `PIXI` is a **browser global**, not an import. Pinned to an exact version for reproducibility. |
| Runtime | Browser (client-side only) | The game is a static site. No server, no backend. |
| Dev server | **`http-server`** (`^14.1.1`) | `npm run start` serves `./public` on port 8080. A server is required — ES modules will not load over `file://`. |
| Test runner | **Node's built-in `node:test`** + `node:assert/strict` | Zero test dependencies. Deliberate: no config file or transform pipeline between the learner and the code. |
| Build step | **None** | No bundler, no compilation. This is a deliberate constraint (see Non-Goals in product context). |

## Architecture

Client-side, object-oriented, single entry point. Composition/ownership flows top-down:

```
index.html
  └── index.js ............ entry point; DOM key events → Controller
        ├── Controller.js . SNES-style button abstraction → Game inputs
        └── Game.js ....... owns the PIXI.Application, the Level, debug overlay
              └── Level.js  background, platforms, character, collidable objects
                    ├── Platform.js ...... procedurally assembled tile platforms
                    └── Character.js ..... base class: sprites, states, movement
                          ├── Ninja.js ... concrete character; per-state animations
                          └── PhysicsEngine.js  gravity, collision detect/resolve
```

**Separation of concerns is load-bearing:**

- Input translation lives entirely in `Controller`. The rest of the game never knows a keyboard exists — which is what makes gamepad/touch input a later addition rather than a rewrite.
- Rendering stays out of physics. `PhysicsEngine` is arithmetic on plain objects; keeping it PIXI-free is what makes it cheaply testable (Tier 1).

## Coding Standards

- **Object-oriented by design.** Use classes, inheritance, private fields (`#field`), getters/setters, and static enums. This project practises OO patterns on a problem where they earn their keep.
- **ES modules everywhere.** `import`/`export`; no CommonJS `require`.
- **Strict equality.** Prefer `===`/`!==` and `node:assert/strict`. The physics engine's collision detection deliberately uses strict comparison (see Key Decisions).
- **Hand-written core logic.** Do not introduce a library to do the part a phase exists to teach (physics, collision, animation state, game loop).
- **Readability over cleverness.** This is a learning codebase; code is read more than written. Prefer clear over terse.
- **Frame-rate independence.** Simulation math must scale with `delta` so behaviour is identical at 30fps and 144fps. (Currently violated in `PhysicsEngine` — a Phase 1 fix.)

## Linting & Formatting

> Being introduced in Phase 0 (see the open issue in `workstream/`). Once landed, these are the standards.

- **ESLint** for linting, **Prettier** for formatting; integrated via `eslint-config-prettier` so they do not conflict.
- ESLint flat config (`eslint.config.js`) with per-path contexts:
  - `public/js/**` → **browser** globals, with `PIXI` declared as a **read-only global** (it is a CDN script-tag global, so `no-undef` must not fire on it).
  - `tests/**` and tooling → **Node** globals; `node:test`/`node:assert` must lint cleanly.
- Canonical npm scripts: `lint`, `lint:fix`, `format`, `format:check`.
- Tooling is **dev-only** — it must not change the runtime dependency footprint or how the game is served/tested.
- Vendor/generated paths (`node_modules`, `public/img`) are ignored by both tools.

## Testing Standards

Full strategy in [docs/TESTING.md](./TESTING.md). The essentials:

- **Four tiers**, chosen by how much of the PixiJS boundary the code touches:
  1. **Pure logic** (`PhysicsEngine`) — no setup.
  2. **Injected collaborator** (`Controller`) — a spy `Game`.
  3. **Stubbed PIXI** (`Character`, `Ninja`) — a ~30-line stub + fake app.
  4. **Browser** (`Game`, `Level`, `Platform`) — Playwright; not yet implemented.
- **Pick the lowest tier that can reach the behaviour.** If it needs the browser, ask whether the logic can move somewhere the browser is not needed.
- **Only stub the third-party boundary (PixiJS).** Never mock the project's own classes.
- **Specify, don't characterize, broken code.** Unbuilt/intended behaviour is written as failing tests tagged `[SPEC — ...]` in the suite name. A red `npm test` is expected until those go green; `npm run test:current` gives a clean signal.
- **Conventions:** behavioural sentence test names, one behaviour per test, arrange/act/assert, useful failure messages, seeded PRNG for property tests (reproducible failures, no vacuous passes).
- **Commands:** `npm test` (full, currently red on purpose), `npm run test:current` (green today), `npm run test:watch`.

## Dependency Management

- **Pin for reproducibility.** PixiJS is pinned to an exact CDN version (`7.4.3`); a floating range (`7.x`) previously made builds non-reproducible.
- **Major upgrades are their own work.** The PixiJS 8 migration is a deliberate hold, not neglect — v8 makes `Application` init async, changes the renderer model, and moves `PIXI.utils.isWebGLSupported()`. It must be a separate, intentional piece of work with a migration guide, never an accidental bump.
- **Keep the dependency surface visible.** A known future improvement is moving PixiJS from the CDN tag into `package.json` (bringing it under `npm outdated`/`npm audit`) — at the cost of adopting a bundler or copy step.
- **New dependencies need justification.** Given the no-build, learn-by-hand constraints, adding a runtime dependency is a deliberate decision, not a default.

## Key Technical Decisions

- **Contact is not collision (resolved).** `PhysicsEngine` uses **strict** comparisons in collision detection, so two boxes sharing an edge are *separated*; only genuine overlap counts. This lets resolution place a character exactly on a surface without re-colliding and jittering. Consequence: a resting character is *not* colliding, so a `grounded` flag needs its own downward ground-sensor probe rather than reading `detectCollision`.
- **Detection is correct; resolution is broken.** The verbose four-way `||` chains in detection collapse to a standard AABB overlap test and are test-guarded — they should be *simplified, not rewritten*. Collision *resolution* is the broken half (returns `{x:0, y:0}`) and is the Phase 1 target.
- **`node:test` over Jest/Vitest.** A standard-library runner keeps zero config between the learner and the code, matching the no-build ethos.
- **`"type": "module"`** is purely declarative — every file was already an ES module; it silences the `MODULE_TYPELESS_PACKAGE_JSON` warning and lets Node parse `import`.

## Known Technical Debt (as of this writing)

- `PhysicsEngine.nextPosition()` uses `delta ^ 2` (bitwise XOR, not exponentiation); vertical velocity is never integrated; simulation is not frame-rate independent.
- `Character.jump()` teleports to a random point — a placeholder, not a jump.
- Collision resolution returns `{x:0, y:0}` for every collision.
- `Controller.KeyPressingOptions.KeyRepeat` referenced in `index.js` does not exist (evaluates to `undefined`; works by accident).
- Attack is stubbed; enemies do not exist in code; several ninja states and the `ninjagirl` sprite set are on disk but unwired.
- No CI yet; Tier 4 (browser) tests not implemented.

## Conventions

- **Branches:** `feature/<name>` (per README contributing guide); agent workflows use `issue/<n>-<desc>` or `story/<id>-<desc>`.
- **Do not merge/push to `main` directly** — human PR review is the gate.
- **Commit messages:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`).
- **Documentation explains *why*.** Deliberate holds and design decisions are written down, not left implicit.
