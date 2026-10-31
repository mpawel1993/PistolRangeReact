# Pistol Range — project guide

Polish firearms-license (pozwolenie na broń) exam trainer. Static React SPA in `frontend/`, no backend: questions are bundled JSON, progress lives in an in-browser SQLite DB. Hosted on GitHub Pages (`https://mpawel1993.github.io/PistolRangeReact/`), also deployable to any static/PHP host. User-facing docs: `README.md` (Polish). Default branch: `dev` (also the deploy branch). The user writes in Polish; answer in Polish.

## Commands (run in `frontend/`)

| Command | Purpose |
|---|---|
| `npm start` | dev server, http://localhost:3000 (service worker disabled in dev) |
| `CI=true npm test -- --watchAll=false` | all tests once (~40 s, monkey suite ~30 s of it) |
| `CI=true npx react-scripts test --watchAll=false src/components/learn` | run a subset (path pattern) |
| `CI=true npm run build` | production build → `build/`; `CI=true` makes lint warnings fail, keep it green |
| `npx tsc --noEmit -p .` | type-check incl. tests (build doesn't type-check test files) |
| `npx eslint --ext .ts,.tsx src` | lint incl. tests (`react-app` + `react-app/jest` rules); currently clean |
| `npm run deploy` | manual deploy: build + push `build/` to `gh-pages` branch (`--nojekyll`) |

Environment: Windows 11, Git Bash + PowerShell. Node 24 locally, Node 22 in CI. Python is not installed. Bash heredocs with long/multiline content have failed here — prefer the Write/Edit tools for files. Files may have CRLF line endings (normalize `\r\n` when parsing file contents in tests/scripts).

## Stack and versions (constraints)

- CRA 5 (`react-scripts` 5.0.1, webpack 5, Jest 27, ESLint), TypeScript 4.9, React 19, react-router-dom 7 (`HashRouter`), MUI 7 (only `Modal`/`Box` + `@mui/icons-material`), sql.js 1.15, Workbox 6.
- `workbox-*` must stay on **v6** (matches `workbox-webpack-plugin` inside react-scripts).
- Jest 27 can't resolve packages that only declare `exports` (react-router v7): `package.json → jest.moduleNameMapper` maps `react-router-dom`, `react-router`, `react-router/dom` to their CJS dist files. `src/setupTests.ts` polyfills `TextEncoder`/`TextDecoder`. If react-router is upgraded and dist paths change, fix those mappings.
- CRA's Jest config has `resetMocks: true`: mock implementations are wiped before every test → set `mockResolvedValue`/`mockReturnValue` in `beforeEach`, not in `jest.mock` factories.
- No jotai, no web-vitals, no localStorage/sessionStorage (removed in the refactor; do not reintroduce).

## Directory map

```
.github/workflows/deploy.yml     CI: on push to dev (or manual) → npm ci, tests, build, deploy via actions/deploy-pages
README.md                        user-facing docs (Polish): features, local run, GitHub Pages, PHP/Apache/nginx deploy
CLAUDE.MD                        this file
frontend/
  package.json                   homepage ".", scripts, jest.moduleNameMapper
  public/index.html              lang="pl", title "Pistol Range", %PUBLIC_URL% links only
  public/manifest.json           PWA manifest (name, start_url ".", icons are still CRA defaults logo192/512/favicon)
  src/
    index.tsx                    createRoot + StrictMode, calls registerServiceWorker()
    App.tsx                      HashRouter + routes, renders <UpdateBanner/>
    model.ts                     types (Question, Answer, AnswerState), CATEGORIES, ALL_CATEGORIES
    utils.ts                     formatCategory("SANKCJE_KARNE") → "SANKCJE KARNE"
    index.css                    @font-face Bahnschrift, CSS variables, global reset
    App.css                      all component styles (BEM-ish class names)
    react-app-env.d.ts           CRA types + `declare module "*.wasm"` (URL string)
    service-worker.ts            Workbox precache of the whole build + SKIP_WAITING message handler
    service-worker-registration.ts  registerServiceWorker(), useWaitingServiceWorker(), activateUpdate()
    setupTests.ts                jest-dom + TextEncoder polyfill
    test-utils.tsx               shared test helpers (see Tests)
    assets/questions.json        question bank (200 questions)
    assets/*.png|gif, fonts/     images used via imports; animal_header.png is unused
    services/question-service.ts question bank access + EXAM settings
    services/db.ts               sql.js SQLite + IndexedDB persistence
    components/                  pages and shared UI (below)
    **/*.test.ts(x)              tests (below)
```

## Routes (HashRouter, `App.tsx`)

| Hash route | Component | Notes |
|---|---|---|
| `#/` | `welcome-page` | full-screen logo button → `/activity-page` |
| `#/activity-page` | `activity-page` | menu: NAUKA → `/set-of-questions`, NAUKA (LOSOWE PYTANIA) → `/set-of-questions?random=true`, EGZAMIN → `/exam-page` |
| `#/set-of-questions[?random=true]` | `set-of-questions-page` | grid of `CATEGORIES` + WSZYSTKIE + home; forwards `?random=true` |
| `#/nauka/:category[?random=true]` | `learn-page` | `category` = lower-case category key (e.g. `sankcje_karne`, `wszystkie`); unknown → redirect to `/set-of-questions` |
| `#/exam-page` | `exam-page` | |
| anything else | redirect to `#/` | |

Navigation state that must survive reloads is in the URL (`?random=true`), not in storage.

## Domain data

`questions.json` items: `{id: null, displayId: null, value, goodAnswer: "a"|"b"|"c", paragraph: "(art. … uobia)", legacyId: number, category, possibleAnswer: [{id:"a",value}, {id:"b",value}, {id:"c",value}]}`.
- `question-service.ts` maps them to `Question {id: legacyId, value, paragraph, goodAnswer, category, possibleAnswer}`. `legacyId` is the stable id stored in saved progress — never renumber existing questions.
- Question text is NOT unique (173 unique `value+paragraph` among 200; duplicates differ in answers). To identify a question from the screen, compare text **and** all answer texts.
- Category counts: USTAWA_O_BRONI_I_AMUNICJI 156, BEZPIECZENSTWO_NA_STRZELNICACH 15, SANKCJE_KARNE 13, PRZECHOWYWANIE_I_NOSZENIE_BRONI 8, PRZEWOZENIE_BRONI_SRODKAMI_TRANSPORTU_PUBLICZNEGO 5, OBRONA_KONIECZNA_I_STAN_WYZSZEJ_KONIECZNOSCI 3. `CATEGORIES` in `model.ts` lists the 6 keys in menu order; `ALL_CATEGORIES = "WSZYSTKIE"`.
- `question-service.ts` API: `getQuestionsByCategory(category, random)` (case-insensitive, WSZYSTKIE = all, unknown = `[]`, random = Fisher–Yates copy), `loadExamQuestions()` (20 random distinct), `getQuestionsByIds(ids)` (keeps order, drops unknown ids), `EXAM = {durationSeconds: 1800, questionCount: 20, goodAnswersToPass: 18}`.
- Question objects are shared and never mutated; all per-session state lives in component state.

## Components

Shared:
- `question-card.tsx` — header (badger image, `position/total`, title), question text + `<span class="question-text__paragraph">`, 3 answers. Each answer: letter `<span class="answer__letter">` (+ `--marked` = underlined when `isMarked(id)`) and `<button class="answer__button" data-state={stateOf(id)} disabled={disabled}>`. Props are callbacks so pages own all logic.
- `question-nav.tsx` — 3-column grid: prev (`aria-label="Poprzednie pytanie"`), center (icon + label passed in), next (`aria-label="Następne pytanie"`).
- `app-modal.tsx` — MUI `Modal` + `Box className="modal"`. Closed modals are unmounted.
- `menu-button.tsx` — `<button class="menu-button">`, optional `label` (aria-label) for icon-only buttons.
- `update-banner.tsx` — fixed bottom banner "Dostępna nowa wersja aplikacji" + ODŚWIEŻ when a new service worker is waiting.

`learn-page.tsx`:
- `LearnPage` reads params and renders `LearnSession key={category:random}` so changing category/mode remounts with fresh state.
- State: `questions` (order), `solved: Set<id>`, `index`, `picked`, `isWrong`, `savedProgress`, `isModuleDone`.
- Rules: pick → `picked`, clears `isWrong` (ignored on solved questions, whose buttons are disabled). Next on a solved question → advance (unless last). Next on an unsolved question: no pick → nothing; wrong pick → `isWrong` (red), stay; good pick → add to `solved`, `saveProgress(...)`, advance, or open "UKOŃCZONO MODUŁ" if last. Prev → `index-1`. Every move (`goTo`) clears `picked`/`isWrong`.
- States: solved → good `correct`, others `idle`, all disabled. Unsolved → picked is `picked` or `wrong`, others `idle`. Letters are never marked in learning mode.
- Buttons: prev disabled at index 0, next disabled only when the current question is solved **and** last.
- Resume: on mount `loadProgress(category, random)`. If it has ≥1 solved id → modal "OD NOWA? / Poprzedni progres: (solved/total)". "Tak" → `clearProgress`, keep the fresh order. "Nie" → restore order via `getQuestionsByIds`, restore `solved`, jump to the first unsolved (or the last question if all are solved).
- Progress is keyed by (lower-case category, random), so ordered and random sessions are independent.

`exam-page.tsx`:
- `questions` fixed once via `useState(loadExamQuestions)`; `answers: Record<index, answerId>`; `isFinished`; `isSummaryOpen`; timer = fixed `deadline` + `now` ticking every 1 s (stops when finished). `timeLeft === 0` auto-finishes.
- During the exam: picked answer `picked` + letter marked; next disabled until the current question is answered or when on question 20; prev disabled at 1; center button = finish (`RuleIcon`, label "Zakończ egzamin"). No correctness is revealed.
- After finishing: answers disabled; next only blocked on question 20 (unanswered questions can be browsed); title "EGZAMIN: --:--"; center = home ("Strona główna"). States: answered → good `correct`, wrong pick `wrong`, rest `neutral`; unanswered → all `neutral` (correct answer intentionally not shown, matches the original app). The picked letter stays marked.
- Summary modal: "UKOŃCZONO EGZAMIN", passed.gif if good ≥ 18 else failed.gif, "DOBRZE: n", "ŹLE: 20-n", PRZEGLĄDAJ closes it. The exam is not persisted.

## Persistence (`services/db.ts`)

- `initSqlJs({locateFile: () => sqlWasmUrl})` where `sqlWasmUrl` is `import`ed from `sql.js/dist/sql-wasm-browser.wasm`. webpack emits it as a hashed asset with a relative URL — this is what makes it work in GitHub Pages subdirectories. Do not copy the wasm into `public/` or hard-code `/` paths.
- The DB is in memory; after every write `db.export()` bytes are `put` into IndexedDB (db `pistol-range`, store `sqlite`, key `main.db`) through a serialized `writeQueue`. On first use the bytes are loaded back. `getDb()` is a memoized promise.
- Schema: `learn_progress(category TEXT, random INTEGER, question_ids TEXT /*JSON array*/, solved_ids TEXT /*JSON array*/, PRIMARY KEY(category, random))`. Upsert via `ON CONFLICT … DO UPDATE`. Always use bound parameters.
- API: `loadProgress(category, random) → {questionIds, solvedIds} | null`, `saveProgress(category, random, progress)`, `clearProgress(category, random)`.
- After opening, `requestPersistentStorage()` calls `navigator.storage.persist()` so the browser doesn't evict IndexedDB (Firefox may show a permission prompt).
- To add a table: append `CREATE TABLE IF NOT EXISTS …` to `SCHEMA` (runs on every start). There is no migration system; for column changes add a `PRAGMA user_version` check.
- Data is per origin: GitHub Pages and a self-hosted copy have separate progress.

## Offline / PWA

- `src/service-worker.ts` exists → CRA's `InjectManifest` builds `build/service-worker.js` with `self.__WB_MANIFEST` (every build file, including the wasm, GIFs and font; max 5 MB per file — the GIFs are ~2.1/2.4 MB). `precacheAndRoute` + `cleanupOutdatedCaches` + a `NavigationRoute` to `index.html`.
- Registration (`service-worker-registration.ts`) only in `NODE_ENV=production`, path `${PUBLIC_URL}/service-worker.js` (relative → scope = app directory). An update found while a controller exists is stored in a tiny external store; `UpdateBanner` reads it with `useSyncExternalStore`; `activateUpdate` posts `SKIP_WAITING` and reloads on `controllerchange`. No auto-reload (it would kill a running exam).
- Requires HTTPS (or localhost). Verified: after one online visit the app works with the server down (hard reload, learning, exam, saving progress).
- To remove offline support: delete `service-worker.ts`, `service-worker-registration.ts`, `components/update-banner.tsx`, their usages in `index.tsx`/`App.tsx`, the `.update-banner` CSS and the `workbox-*` deps. Deleting `service-worker.ts` alone stops CRA from emitting the worker.

## Styling

- Plain CSS only: `index.css` (font, variables, reset) and `App.css` (components). No inline style objects, no CSS-in-JS (MUI `sx` not used).
- Variables: `--green` (gradient `#94c02b → #71912a`, default button background), `--text` `#98c135`, `--dark` `#2b2a29`, `--gap` `clamp(8px, 2vw, 14px)`, `--radius` 10px. Font: Bahnschrift (`src/assets/fonts/BAHNSCHRIFT.TTF`), fluid font size via `clamp`.
- Answer colours come from `data-state` on `.answer__button`: default (idle) = `--green`; `picked` yellow `#ffff2b → #ffff2a`; `correct` `#085908 → #28a628` + white text; `wrong` `#500000 → #740000` + white text; `neutral` grey `#6e736e → #a1a6a1`. `answer-colors.test.ts` asserts these exact values — update both together.
- Layout: `.app` (max-width 1000px, min-height 100dvh, flex column) → `.page` (flex column, gap) → nav pinned at the bottom with `margin-top: auto`. Category list `.menu--grid` uses `auto-fit minmax(min(100%, 320px), 1fr)`. Modals use `.modal` (centered, `min(90vw, 500px)`). Black background everywhere.
- UI text is Polish and mostly UPPERCASE.

## Tests

| File | Covers |
|---|---|
| `components/learn-page.test.tsx` | every answer state after each action, red/green rules, locking, navigation, saving args, module completion, random mode key, resume Tak/Nie, unknown category redirect |
| `components/exam-page.test.tsx` | picking/marking, next/prev rules, review colours, 17 fails / 18 and 20 pass, answer changes, timer (fake timers), timeout auto-finish, timer stops after finish |
| `components/navigation-monkey.test.tsx` | seeded random clicking (incl. disabled buttons) in 5 learning setups + exam, 8 seeds × 250 steps each, screen checked after every click against a reference model; progress guards (a run must complete each module; exam runs must reach Q20 and finish early). Failure message = seed, step, last 15 actions |
| `answer-colors.test.ts` | exact CSS colours per `data-state` (jsdom doesn't apply CSS, so it parses `App.css`/`index.css`) |
| `services/db.test.ts` | real sql.js + `fake-indexeddb` in `@jest-environment node`; `jest.isolateModules` = page reload; ordered/random separation, clear, rapid saves, SQL-injection-safe names |
| `services/question-service.test.ts` | bank integrity (every question well-formed), category filtering, shuffling, exam draw, id lookup |
| `App.test.tsx` | smoke: welcome → menu → exam starts at 1/20 |

Conventions:
- Page tests mock `../services/db` (`jest.mock` automock + `mockResolvedValue` in `beforeEach`) and replace `loadExamQuestions` with a fixed list (`jest.requireActual` spread) so expectations are exact.
- `test-utils.tsx`: `renderRoute(url, routePath, element)` (MemoryRouter + stub `/set-of-questions` and `/activity-page` pages showing `SET_OF_QUESTIONS_PAGE`/`ACTIVITY_PAGE`), `answerButton(id)`, `answerLetter(id)`, `answerStates()`, `statesWith(overrides, base)`, `position()`, `headerTitle()`, `questionText()`, `textOf(q)`, `nextButton()`, `previousButton()`, `modalText()`, `modalImageSource()`, `flushPromises()`, `wrongAnswerOf(q)`, `otherWrongAnswerOf(q)`, `seededRandom(seed)`. Direct DOM queries live here on purpose (speed in the monkey suite; keeps `testing-library/no-node-access` lint quiet in test files).
- Image imports resolve to their basename in Jest (`"passed.gif"`).
- `db.test.ts` polyfills `DOMException`, `structuredClone`, `navigator` (hidden by Jest 27's node env) and mocks the wasm import to the on-disk `sql-wasm.wasm`.
- The monkey suite spies on `console.error` in every test: any React warning fails it.
- When behaviour changes on purpose, update the page tests **and** the reference models in `navigation-monkey.test.tsx`.
- Mutation check done once: 15 deliberate bugs (wrong colours, skipping, thresholds, persistence) were all caught. Repeat for big refactors.

## Deployment

- Build portability: `"homepage": "."` → all asset URLs relative; `HashRouter` → only `index.html` is ever requested, no server rewrites. Works at a domain root, `/PistolRangeReact/`, or any subfolder. Keep both.
- GitHub Pages via Actions (`deploy.yml`): triggers on push to `dev` + `workflow_dispatch`; Node 22, `npm ci`, `CI=true` tests, build, `upload-pages-artifact` (`frontend/build`), `deploy-pages`. Requires Settings → Pages → Source: GitHub Actions. Free only for public repos.
- Manual: `npm run deploy` (needs Source: branch `gh-pages`). Only one Pages source can be active.
- Static/PHP hosting: upload the contents of `build/` (README has an `.htaccess` for `application/wasm` + cache headers and an nginx snippet). HTTPS is needed for offline mode. Embedding: subfolder link or a same-origin `<iframe>` (cross-origin iframes may lose IndexedDB access).

## Known gaps / ideas

- PWA icons/favicon are still CRA defaults (`public/logo192.png`, `logo512.png`, `favicon.ico`).
- passed.gif/failed.gif (~4.5 MB together) dominate the first load; WebP/MP4 would cut it.
- `src/assets/animal_header.png` is unused.
- The file is named `CLAUDE.MD`: fine on Windows, but case-sensitive systems expect `CLAUDE.md`.

## Code style

- Minimal, production-ready code; no over-engineering or boilerplate; comments only for non-obvious "why".
- Match the existing style: function components with arrow functions + `export default`, 4-space indent, double quotes, `{a, b}` imports without spaces, kebab-case file names.
- Derive UI from state; never mutate shared question objects.
- Keep `CI=true npm run build`, `tsc`, `eslint` and all tests green.
