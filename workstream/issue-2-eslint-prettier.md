## Summary

Add **ESLint** (linting) and **Prettier** (formatting) to the project. This is the first unchecked item in **Phase 0 — Foundations** of the roadmap and establishes a consistent code-quality baseline before physics work (Phase 1) begins.

The project is plain JavaScript with ES modules (`"type": "module"`), no bundler, and no build step. Tooling must fit that constraint: dev-only dependencies, no change to how the game is served or how tests run.

## Motivation

- The codebase already shows small inconsistencies that a formatter/linter would catch (e.g. `==` vs `===`, unused variables, spacing).
- A shared config removes style debate and makes future contributions (and PR reviews) cleaner.
- Phase 0 explicitly calls for it, and later phases assume a stable foundation.

## Scope

### In scope

- Add ESLint and Prettier as `devDependencies`.
- ESLint flat config (`eslint.config.js`) suited to the environment:
  - ES modules, modern ECMAScript.
  - Two runtime contexts: **browser** globals for `public/js/**` (where `PIXI` is a script-tag global — must be declared as a read-only global so `no-undef` does not fire), and **Node** globals for `tests/**` and tooling files.
  - `node:test` and `node:assert` usage in `tests/**` should lint cleanly.
- Prettier config (`.prettierrc`) and `.prettierignore`.
- ESLint + Prettier integration so they do not fight over formatting rules (`eslint-config-prettier`).
- npm scripts:
  - `lint` — check with ESLint
  - `lint:fix` — ESLint autofix
  - `format` — write with Prettier
  - `format:check` — verify formatting without writing
- Ignore generated/vendor paths (`node_modules`, `public/img`, etc.).

### Out of scope

- The PixiJS 8 migration (separate Phase 0 item).
- Moving PixiJS to npm + a bundler (separate Phase 0 item).
- CI wiring / GitHub Actions (tracked under the cross-cutting testing section).
- Any refactor of game logic beyond mechanical autofix/format.

## Implementation notes

- `PIXI` is loaded globally via a CDN `<script>` in `public/index.html` and referenced across `public/js/*.js`. It must be configured as a read-only global for the browser files.
- Prefer a single flat config with per-path overrides over multiple config files.
- The initial `format` run will touch many files; keep the formatting pass in its own commit, separate from the config/scripts commit, so review of the tooling change stays readable.
- Pin dependency versions (exact or caret per project preference; be explicit).

## Acceptance Criteria

- [ ] `npm run lint` runs ESLint over `public/js/**` and `tests/**` and exits 0 (or reports only intentional, agreed findings).
- [ ] `npm run lint:fix` applies safe autofixes.
- [ ] `npm run format` formats the codebase with Prettier.
- [ ] `npm run format:check` verifies formatting and exits non-zero when files are unformatted.
- [ ] ESLint does **not** report `PIXI` as undefined in `public/js/**`.
- [ ] ESLint and Prettier do not conflict on formatting rules (`eslint-config-prettier` applied).
- [ ] ESLint and Prettier are `devDependencies` only; runtime dependency footprint is unchanged.
- [ ] Existing tests still pass: `npm test` behaves exactly as before (`npm run test:current` stays green; the 12 `SPEC` tests remain the only expected failures).
- [ ] `node_modules` and `public/img` (and other generated/vendor paths) are ignored by both tools.
- [ ] `README.md` Phase 0 checklist item "Add a linter (ESLint) and a formatter (Prettier)" is checked, and the new scripts are documented briefly.

## Definition of Done

- Config files, `.prettierignore`, and updated `package.json` scripts are committed.
- The initial formatting pass is committed separately from the tooling config.
- README updated (Phase 0 checkbox + scripts note).
- All acceptance criteria met.

## References

- Roadmap: Phase 0 — Foundations (`README.md`).
- `docs/TESTING.md` for the test tiers that must remain unaffected.
