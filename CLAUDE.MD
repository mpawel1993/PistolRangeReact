# Pistol Range — project guide

Polish firearms-license exam trainer. Standalone React app in `frontend/` (CRA 5, React 19, TypeScript, MUI for modals/icons), deployed to GitHub Pages. There is no backend.

## Commands (run in `frontend/`)

- `npm start` — dev server
- `CI=true npm test -- --watchAll=false` — tests, single run
- `CI=true npm run build` — production build; `CI=true` turns lint warnings into errors, keep it passing
- `npm run deploy` — manual deploy to the `gh-pages` branch (CI deploy: `.github/workflows/deploy.yml`, on push to `dev`)

## Architecture

- `src/assets/questions.json` — question bank (`legacyId` is the stable question id, answers are always `a`/`b`/`c`).
- `src/services/question-service.ts` — question selection and exam settings (`EXAM`).
- `src/services/db.ts` — sql.js SQLite database, serialized into IndexedDB after every write. Table `learn_progress(category, random, question_ids, solved_ids)`. All persistence goes through here; do not use localStorage/sessionStorage.
- `src/components/` — pages (`welcome`, `activity`, `set-of-questions`, `learn`, `exam`) and shared pieces (`question-card`, `question-nav`, `app-modal`, `menu-button`).
- Offline/PWA: `src/service-worker.ts` (Workbox v6, built by CRA's InjectManifest) precaches the whole build; `src/service-worker-registration.ts` registers it in production only and exposes a waiting update to `components/update-banner.tsx`. Precached files must stay under 5 MB each. Keep `workbox-*` packages on v6 to match `react-scripts`.
- Answer colours are derived from state (`AnswerState` → `data-state` attribute styled in `App.css`); question objects are never mutated.
- Styling: plain CSS in `index.css` (globals/variables) and `App.css` (components), flexbox/grid, mobile-first. No inline style objects.

## Tests

- `components/learn-page.test.tsx`, `exam-page.test.tsx` — exact answer states (`data-state`), locking, navigation, saving/resuming, grading, timer. `db` is mocked; the exam's random draw is replaced with a fixed question list.
- `components/navigation-monkey.test.tsx` — seeded random clicking (including on disabled buttons) checked after every click against a small reference model. A failure prints the seed, step and last actions to replay it. Slowest suite (~30 s); adjust `SEEDS`/`STEPS` there.
- `answer-colors.test.ts` — reads `App.css`/`index.css` to assert the colour behind each answer state (jsdom does not apply CSS). Update it when changing colours.
- `services/db.test.ts` — real sql.js + `fake-indexeddb` under the node environment; a fresh module instance simulates a page reload.
- `services/question-service.test.ts` — question bank integrity and selection.
- Shared helpers live in `src/test-utils.tsx` (direct DOM queries there are intentional, for speed and to keep test files lint-clean).
- When behaviour changes on purpose, update the reference models in the monkey test together with the component.

## GitHub Pages constraints

- Keep `"homepage": "."` and `HashRouter` — the app must work from a subdirectory without server rewrites.
- Reference assets via imports (or `%PUBLIC_URL%` in `index.html`), never absolute `/` paths. The sql.js WASM file is imported from `sql.js/dist/sql-wasm-browser.wasm` so webpack emits it with a relative URL.
- Jest (CRA's Jest 27) can't resolve react-router v7's `exports`; the `jest.moduleNameMapper` in `package.json` and the TextEncoder polyfill in `setupTests.ts` work around that.

## Code style

- Minimal, production-ready code; no over-engineering, no boilerplate, no comments that restate the code.
- Fix bugs and anti-patterns you touch; keep the UI responsive on all screen sizes.
- UI text is Polish.
