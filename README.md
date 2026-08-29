# 2D Platformer — Learning JS in the process

## Overview

This project develops a simple 2D platform game as a way to learn software development. Unlike the usual beginner exercises — REST APIs, calculators, to-do lists — a game gives you immediate visual feedback: when you get it wrong, you *see* it get it wrong.

It is written in **plain JavaScript**, with no framework, no bundler and no build step. The only runtime dependency is [PixiJS](https://pixijs.com/) for 2D rendering. Everything else — the game loop wiring, physics, collision detection, animation state — is written by hand, on purpose, because writing it by hand is the point.

The code leans deliberately on **object-oriented patterns**: classes, inheritance, private fields, getters/setters, static enums. It is a chance to practise those patterns on a problem where they actually earn their keep.

## How to run

```bash
git clone https://github.com/llipe/javascript-tutorial-2d-game.git
cd javascript-tutorial-2d-game

npm install
npm run start
```

Then open <http://localhost:8080>.

The game is a static site, so any static file server works. You do need a server — opening `public/index.html` directly from the filesystem will fail, because `js/index.js` is loaded as an ES module and browsers block module loading over `file://`.

### Controls

| Key | Action |
| --- | --- |
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| `W` / `↑` | (reserved — no-op) |
| `S` / `↓` | (reserved — no-op) |
| `Space` | Jump |
| `H` | Toggle the debug stats bar (FPS, elapsed time) |

## Architecture

The entry point is `public/js/index.js`. It instantiates a `Game` and a `Controller`, then forwards raw `keydown` / `keyup` events to the controller, which maps them to game actions. Keeping input translation in its own class means the rest of the game never knows a keyboard exists — which is what makes gamepad or touch input a later addition rather than a rewrite.

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

### The classes

| File | Responsibility |
| --- | --- |
| `Controller.js` | Models a SNES-style pad (`moveUp/Down/Left/Right`, `buttonA/B/X/Y/L/R`, `buttonStart/Select`) and distinguishes press / repeat / release. Most buttons are still stubs. |
| `Game.js` | Creates the `PIXI.Application`, starts the `Level`, exposes `inputCharacter*` methods the controller calls, and renders the debug stats overlay. |
| `Level.js` | Builds the world: background, three platforms, and the character. Holds `collidableObjects`, the list the physics code tests against. |
| `Platform.js` | Assembles platforms from the tileset at runtime. Two types: `FloorPlatform` (a length × height block with proper edge/middle/corner tiles) and `FloatingPlatform` (a single row). |
| `Character.js` | Base class for anything animated and moving: texture loading per state, velocity/acceleration, direction tracking, and the per-tick `move()` that applies physics and resolves collisions. |
| `Ninja.js` | Extends `Character` with the ninja's states and sprite sets, and swaps the animation on direction change (including the horizontal flip when running left). |
| `PhysicsEngine.js` | Gravity integration and AABB collision detection / resolution. |

### Reading the code in a sensible order

If you are picking this up for the first time: `index.js` → `Controller.js` → `Game.js` → `Level.js` → `Character.js` → `Ninja.js`. Leave `PhysicsEngine.js` for last; it is the least finished part and the easiest to get lost in.

## Current status

**Working:**

- Rendering, game loop, and asset/texture loading through PixiJS
- Keyboard input mapped through the controller abstraction
- Horizontal movement with idle ↔ run animation switching and sprite flipping
- Procedural platform generation from the tileset (floor and floating)
- Background scaled to the viewport
- Debug stats overlay (FPS, elapsed time)

**Known incomplete or broken:**

- **Physics.** `PhysicsEngine.nextPosition()` uses `delta ^ 2` — that is a bitwise XOR, not exponentiation, so the gravity term is wrong. Vertical velocity is never integrated. Collision resolution returns positions that do not correspond to a real separation axis.
- **Jump.** `Character.jump()` teleports the character to a random point on screen. It is a placeholder, not a jump.
- **Collision.** Detection runs and logs, but the resolved position is not usable yet — the character does not actually stand on platforms.
- **Attack** is stubbed everywhere (`inputCharacterAttack()` is empty).
- **Enemies** do not exist in code, though zombie sprites are already in `public/img`.
- **Unused assets.** The `ninjagirl` sprite set and several ninja states (climb, glide, slide, throw, dead, jump-attack, jump-throw) are on disk but not wired up.
- **No tests.** `npm test` is still the npm placeholder that exits 1.

## Dependencies

| Dependency | Version | How it is loaded | Notes |
| --- | --- | --- | --- |
| `http-server` | `^14.1.1` | npm dependency (via `npm run start`) | Current — 14.1.1 is the latest release. Local development server only; arguably belongs in `devDependencies`. |
| PixiJS | `7.4.3` | CDN `<script>` in `public/index.html` | Pinned to an exact version. |

### On the PixiJS version

The CDN tag used to be `pixi.js@7.x`, a floating range that resolved to whatever the latest 7.x release happened to be at page load. That makes the build non-reproducible: the same commit could behave differently on two different days, with nothing in git to explain it. It is now pinned to `7.4.3`.

**PixiJS 8.x is available and this project does not use it.** That is a deliberate hold, not neglect. v8 is a breaking major:

- `PIXI.Application` initialisation became asynchronous — `await app.init({...})` instead of a constructor that returns a ready instance. `Game.js` uses the synchronous v7 form.
- The renderer/backend model changed, and options like `transparent` were replaced.
- `PIXI.utils.isWebGLSupported()`, called in `index.js`, moved.

Migrating is a worthwhile exercise in its own right — reading a migration guide and working through the breakages is a real skill — but it should be its own piece of work, not something that happens by accident during a routine dependency bump. See phase 0 of the roadmap.

A further improvement: move PixiJS out of the CDN `<script>` tag and into `package.json` as a real dependency. That brings it under `npm outdated` and `npm audit`, and makes the whole dependency surface visible in one place. The cost is that you then need a bundler or a copy step, which is the first bit of build tooling this project would take on.

## Roadmap

This is a learning project, so the roadmap is ordered by **what each phase teaches**, not by what would look most impressive in a demo. Each phase is meant to be finishable in a sitting or two and to leave the game playable at the end of it.

The one rule worth keeping: **finish the physics before adding content.** Every later feature — enemies, scoring, multiplayer — assumes a character that reliably stands on the ground. Building on top of broken collision means rebuilding all of it later.

---

### Phase 0 — Foundations

*Concepts: dependency management, semantic versioning, reading migration guides.*

- [x] Pin the PixiJS CDN version
- [ ] Add a linter (ESLint) and a formatter (Prettier)
- [ ] Decide on the PixiJS 8 migration — do it, or write down explicitly why not
- [ ] Optionally move PixiJS to npm + a bundler (Vite is the smallest step)

### Phase 1 — Complete the physics engine ⬅️ *start here*

*Concepts: numerical integration, frame-rate independence, separating axis logic, state machines.*

The single highest-value phase, and the one everything else waits on.

- [ ] Fix the gravity integration (`delta ^ 2` → `delta ** 2`) and integrate vertical velocity properly
- [ ] Make the simulation frame-rate independent — same behaviour at 30fps and 144fps
- [ ] Implement a real jump: upward impulse, gravity brings it down, no double-jump unless grounded
- [ ] Rewrite collision resolution to push the character out along the **minimum penetration axis**, so landing on a platform stops downward motion and walking into a wall stops horizontal motion
- [ ] Track a `grounded` flag and use it to gate jumping and to drive idle/run/jump/fall animation states
- [ ] Add friction and terminal velocity
- [ ] Add a debug draw mode: render collision boxes as outlines (`H` already gives you somewhere to put it)

**Done when:** the ninja runs across a floor platform, jumps onto the floating platform, lands on it, and cannot walk through anything.

### Phase 2 — Character states and sprites

*Concepts: state machines, animation lifecycle, class inheritance in practice.*

- [ ] Wire up the unused ninja states already on disk: attack, slide, climb, glide, throw, dead
- [ ] Build an explicit animation state machine — looping vs. one-shot animations, and legal transitions between states
- [ ] Fix the sprite-flip logic (currently it mutates scale and anchor on every direction change, which is fragile)
- [ ] Separate the collision box from the sprite bounds; a sprite has transparent padding, a hitbox should not

### Phase 3 — Data-driven worlds

*Concepts: separating data from code, schema design, parsing and validation, async loading.*

This is the phase where the project stops being a hardcoded scene and becomes an actual game engine.

- [ ] Define a level format as JSON — platforms, spawn point, background, entities, collectibles
- [ ] Write a `LevelLoader` that reads it and builds the scene, replacing the hardcoded constructor in `Level.js`
- [ ] Validate the level data and fail with useful errors on malformed input
- [ ] Move to a tile-grid representation rather than absolute pixel coordinates
- [ ] Support multiple levels with transitions between them
- [ ] Add a camera that follows the character, so levels can be wider than the viewport

```jsonc
// sketch of what a level might look like
{
  "name": "Graveyard 1",
  "background": "graveyardtilesetnew/png/BG.png",
  "spawn": { "x": 100, "y": 100 },
  "platforms": [
    { "type": "FloorPlatform", "x": 100, "y": 400, "length": 4, "height": 2 },
    { "type": "FloatingPlatform", "x": 700, "y": 200, "length": 3 }
  ],
  "enemies": [{ "type": "zombie", "variant": "male", "x": 600, "y": 380 }],
  "collectibles": [{ "type": "coin", "x": 720, "y": 160, "value": 10 }]
}
```

### Phase 4 — Character selection

*Concepts: factories, configuration over inheritance, UI state outside the canvas.*

- [ ] Wire up the `ninjagirl` sprite set (identical animation names — a good test of whether `Character` is genuinely reusable)
- [ ] Extract character definitions into data instead of subclasses, so adding a character is a config change
- [ ] Add a selection screen before the level starts
- [ ] Give characters differing stats — speed, jump height — so the choice means something

### Phase 5 — Game mechanics

*Concepts: game state management, event systems, collision categories.*

- [ ] Enemies: `Enemy` extends `Character`, with the zombie sprites already on disk
- [ ] Simple enemy AI: patrol a platform, turn at edges, chase when the player is near
- [ ] Combat: attack hitboxes, damage, health, invulnerability frames after a hit
- [ ] Death and respawn, with a lives counter
- [ ] Collectibles and a score
- [ ] A HUD: health, score, lives (distinct from the debug overlay)
- [ ] Win condition — reach the level exit
- [ ] Game states: menu → playing → paused → game over

### Phase 6 — Audio

*Concepts: the Web Audio API, browser autoplay policies, resource preloading.*

- [ ] Background music with looping
- [ ] Sound effects: jump, land, attack, hit, collect
- [ ] Volume controls and a mute toggle, persisted to `localStorage`
- [ ] Handle the autoplay policy properly — audio cannot start before a user gesture

### Phase 7 — Polish

*Concepts: performance profiling, accessibility, responsive design.*

- [ ] Parallax scrolling backgrounds
- [ ] Particle effects — dust on landing, impact on hit
- [ ] Screen shake and hit-pause
- [ ] Gamepad support via the Gamepad API (the `Controller` abstraction already anticipates this)
- [ ] Touch controls for mobile
- [ ] Responsive canvas sizing
- [ ] Save progress to `localStorage`

### Phase 8 — Multiplayer

*Concepts: networking, client-server architecture, state synchronisation, latency compensation.*

By far the largest jump in difficulty. Worth attempting only once everything above is solid.

- [ ] Local co-op first — two characters, two input maps, one shared screen. No networking, and it forces the input and camera systems to stop assuming a single player.
- [ ] Then online: a Node server, WebSockets, an authoritative server model
- [ ] Client-side prediction and reconciliation
- [ ] Interpolation for remote players
- [ ] Lobby and matchmaking

### Cross-cutting: testing

Worth starting at Phase 1 rather than saving for later. The physics engine is pure computation with no rendering — it is the easiest thing in the codebase to test and the thing most likely to break silently.

- [ ] Add a test runner (Node's built-in `node:test` needs no dependency at all)
- [ ] Unit-test `PhysicsEngine` — collision detection, resolution, gravity integration
- [ ] Unit-test level parsing once Phase 3 exists
- [ ] Add CI via GitHub Actions

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes and commit them
4. Push: `git push origin feature/your-feature`
5. Open a pull request describing your changes

## License

MIT — see [LICENSE](LICENSE).

## Acknowledgements

Assets — characters, tiles and backgrounds — come from the freebies offered by [Game Art 2D](https://www.gameart2d.com/freebies.html).
