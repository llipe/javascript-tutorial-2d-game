# Product Context

> The "why" and "what" of this project. Read alongside [technical-guidelines.md](./technical-guidelines.md).
> This is a living document — update it on strategic pivots, not on routine feature work.

## Vision

A 2D platform game that exists primarily as a **vehicle for learning software development**. The game is real and playable, but the deliverable is understanding — of object-oriented design, numerical simulation, testing discipline, and the mechanics of a browser game — earned by building each piece by hand.

The guiding belief: a game gives immediate, honest feedback. When the code is wrong, you *see* it be wrong. That visual feedback loop is the pedagogical engine of the project.

## Primary Users

| User | Description | What they need |
| --- | --- | --- |
| **The learner-builder** | The person developing the project to practise software skills. Primary and only user today. | Code that is readable, well-tested, and hand-written; a roadmap ordered by what each phase *teaches*; no magic hidden behind frameworks. |
| **The player** | Whoever runs the finished game. Currently the same person as the builder. | A game that runs in the browser, responds to input, and behaves consistently frame-to-frame. |
| **Future contributors** | Others who fork or extend the project. | Clear conventions, a green-able test signal (`test:current`), and documentation that explains *why*, not just *what*. |

## Goals

1. **Learn by building, not by installing.** Physics, collision, animation state, and the game loop are written by hand on purpose. Reaching for a library that does the hard part defeats the goal.
2. **Keep the game playable at the end of every phase.** The roadmap is sized so each phase is finishable in a sitting or two and leaves a working game.
3. **Correctness before content.** The one hard rule: finish the physics engine before adding enemies, scoring, or multiplayer. Everything downstream assumes a character that reliably stands on the ground.
4. **Tests as specification.** The test suite defines "done." Unbuilt behaviour is specified as failing tests tagged `[SPEC]`; a feature is complete when its tests go green.
5. **Reproducibility and transparency.** Pinned dependencies, no hidden build magic, and decisions written down (e.g. why PixiJS is held at v7).

## Non-Goals

- **Not** a production or commercial game. Polish and performance matter only as far as they teach something.
- **Not** a framework showcase. Introducing bundlers, frameworks, or heavy tooling is resisted unless a phase explicitly calls for it as a learning exercise.
- **Not** optimizing for demo impressiveness. The roadmap is ordered by pedagogical value, not by what looks good in a screenshot.
- **Not** preserving current buggy behaviour. This is a project of *repair* — characterization testing of known-broken code (physics, jump, collision resolution) is explicitly rejected in favour of specifying intended behaviour.

## Product Principles

- **Hand-written is a feature, not a cost.** If writing it yourself teaches the concept, write it yourself.
- **Specify what you are fixing; characterize what you are keeping.** Broken code gets a spec that describes the intended behaviour; stable code you intend to keep can be pinned as-is.
- **A red test suite can be the correct state.** `npm test` failing on the 12 `SPEC` tests is expected until Phase 1 is complete. Use `npm run test:current` for a clean signal.
- **Write decisions down.** Deliberate holds (PixiJS 8) and design choices (contact-is-not-collision) live in docs, so they are decisions rather than accidents.
- **Keep the boundary thin.** Only third-party code (PixiJS) is stubbed in tests; the project's own classes are never mocked.

## Roadmap Context

The roadmap (canonical copy in [README.md](../README.md)) is phased by concept:

- **Phase 0 — Foundations:** dependency management, semver, tooling (linting/formatting), migration decisions.
- **Phase 1 — Physics engine:** the highest-value phase; the 12 `SPEC` tests are its definition of done. *Everything waits on this.*
- **Phase 2 — Character states & sprites:** state machines, animation lifecycle, inheritance.
- **Phase 3 — Data-driven worlds:** JSON level format, loading, validation.
- **Phase 4 — Character selection:** factories, config over inheritance.
- **Phase 5 — Game mechanics:** enemies, combat, scoring, game states.
- **Phase 6 — Audio:** Web Audio API, autoplay policy.
- **Phase 7 — Polish:** parallax, particles, gamepad/touch, responsive canvas.
- **Phase 8 — Multiplayer:** the largest jump; local co-op first, then networked.

Cross-cutting: a testing strategy is already in place (see [docs/TESTING.md](./TESTING.md)); CI is still pending.

## Success Criteria

- Each roadmap phase ends with a playable game and (where applicable) a green test suite for that phase's scope.
- The codebase remains readable and hand-authored, with decisions documented.
- Phase 1 success: `npm test` is green, and the ninja runs across a floor platform, jumps onto the floating platform, lands on it, and cannot walk through anything.
