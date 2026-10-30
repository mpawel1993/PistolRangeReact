# Pistol Range

Nauka do egzaminu na pozwolenie na broń: tryb nauki po kategoriach (opcjonalnie w losowej kolejności) z zapisem postępu oraz 30-minutowy egzamin próbny (20 pytań, 18 do zaliczenia).

Static React app (Create React App) — no backend. Questions are bundled from `src/assets/questions.json`; learning progress is stored in an in-browser SQLite database (sql.js / WebAssembly), persisted to IndexedDB.

The app is a PWA: after the first visit it works fully offline and can be installed to the home screen. When a new version is deployed, a "Dostępna nowa wersja" banner offers a reload. The service worker only runs in production builds (`npm run build`), not under `npm start`.

## Development

```bash
npm install
npm start          # http://localhost:3000
npm test           # watch mode; CI=true npm test -- --watchAll=false for a single run
npm run build      # production build in build/
```

## Deploying to GitHub Pages

The build is path-independent (`"homepage": "."`, `HashRouter`, the WASM file emitted as a hashed asset), so it works from any subdirectory such as `https://<user>.github.io/PistolRangeReact/`.

**Automatic (recommended):** `.github/workflows/deploy.yml` tests, builds and deploys on every push to `dev`.
One-time setup: GitHub → Settings → Pages → Source: **GitHub Actions**.

**Manual:** with Pages source set to *Deploy from a branch → `gh-pages` / root*:

```bash
npm run deploy     # builds, then pushes build/ to the gh-pages branch
```
