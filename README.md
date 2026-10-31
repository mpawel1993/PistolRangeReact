# Pistol Range 🎯

Aplikacja do nauki na egzamin teoretyczny na **pozwolenie na broń** (ustawa o broni i amunicji). Działa w przeglądarce na telefonie i komputerze, bez logowania i bez serwera.

**▶ Wersja online:** https://mpawel1993.github.io/PistolRangeReact/

## Funkcje

- **Nauka według kategorii** — 200 pytań w 6 działach:
  ustawa o broni i amunicji, przechowywanie i noszenie broni, przewożenie broni środkami transportu publicznego, bezpieczeństwo na strzelnicach, sankcje karne, obrona konieczna i stan wyższej konieczności — albo wszystkie naraz.
- **Kolejność zwykła lub losowa.**
- **Natychmiastowa informacja zwrotna** — zła odpowiedź podświetla się na czerwono i trzeba spróbować ponownie, dobra na zielono i przechodzi do kolejnego pytania.
- **Zapamiętywanie postępu** — po powrocie do kategorii aplikacja pyta, czy zacząć od nowa, czy kontynuować tam, gdzie skończyłeś (osobno dla trybu zwykłego i losowego).
- **Egzamin próbny** jak na prawdziwym egzaminie — 20 losowych pytań, 30 minut, zaliczenie od 18 poprawnych odpowiedzi. Po zakończeniu można przejrzeć wszystkie pytania z zaznaczonymi błędami i poprawnymi odpowiedziami.
- **Działa offline** — po pierwszym otwarciu aplikacja działa bez internetu i można ją dodać do ekranu głównego telefonu („Dodaj do ekranu głównego”). Gdy pojawi się nowa wersja, aplikacja zaproponuje odświeżenie.
- **Responsywny wygląd** — telefon, tablet, komputer.

## Technologia

| | |
|---|---|
| Interfejs | React 19 + TypeScript (Create React App), Material UI (okna i ikony) |
| Dane | pytania wbudowane w aplikację (`frontend/src/assets/questions.json`) |
| Zapis postępu | SQLite w przeglądarce ([sql.js](https://sql.js.org), WebAssembly), zapisywany w IndexedDB — dane zostają na urządzeniu użytkownika |
| Offline | Service worker (Workbox) |
| Testy | Jest + Testing Library, w tym losowe „monkey” testy nawigacji |
| Hosting | statyczne pliki — GitHub Pages lub dowolny serwer WWW |

Aplikacja **nie ma backendu** — serwer tylko udostępnia pliki. Dzięki temu można ją hostować za darmo na GitHub Pages albo na zwykłym hostingu PHP.

## Uruchomienie lokalne

Wymagany [Node.js](https://nodejs.org) 18 lub nowszy.

```bash
cd frontend
npm install
npm start                                  # http://localhost:3000
```

Pozostałe polecenia (w katalogu `frontend/`):

```bash
CI=true npm test -- --watchAll=false       # wszystkie testy jednorazowo (~40 s)
npm test                                   # testy w trybie obserwowania zmian
npm run build                              # wersja produkcyjna do katalogu frontend/build/
```

> W PowerShellu zamiast `CI=true npm test ...` użyj: `$env:CI="true"; npm test -- --watchAll=false`

## Wdrożenie

Build jest **gotowy pod GitHub Pages i dowolny podkatalog** — wszystkie ścieżki są względne (`"homepage": "."`), a nawigacja działa przez `#` w adresie (np. `.../#/exam-page`), więc serwer nie potrzebuje żadnych reguł przekierowań.

### GitHub Pages — automatycznie (zalecane)

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) przy każdym pushu na gałąź `dev` uruchamia testy, buduje aplikację i publikuje ją na GitHub Pages.

Jednorazowa konfiguracja: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Potem wystarczy:

```bash
git push origin dev
```

Postęp widać w zakładce **Actions**, po ok. 2–3 minutach nowa wersja jest online. Workflow można też uruchomić ręcznie (Actions → *Deploy to GitHub Pages* → *Run workflow*).

### GitHub Pages — ręcznie

Jednorazowo: **Settings → Pages → Source: Deploy from a branch → `gh-pages` / `(root)`**. Potem:

```bash
cd frontend
npm run deploy        # buduje i wypycha katalog build/ na gałąź gh-pages
```

> Wybierz jeden sposób — ustawienie *Source* w GitHub Pages obsługuje tylko jeden naraz.

### Serwer PHP / zwykły hosting (Apache, nginx, dowolny)

PHP nie jest potrzebne — to statyczne pliki, ale zwykły hosting PHP w zupełności wystarczy.

1. Zbuduj aplikację:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Wgraj **zawartość** katalogu `frontend/build/` (nie sam katalog) przez FTP/SFTP, np. FileZillą, do:
   - `public_html/` — aplikacja pod `https://twojadomena.pl/`, albo
   - dowolnego podkatalogu, np. `public_html/strzelnica/` — aplikacja pod `https://twojadomena.pl/strzelnica/`.

   Przy aktualizacji wgraj nowy build w to samo miejsce. Pliki w `static/` mają w nazwach skróty (np. `main.4ef35c16.js`), więc stare się nie nadpisują — można je po prostu usunąć przed wgraniem nowych.
3. **(Apache, zalecane)** dodaj obok `index.html` plik `.htaccess`:
   ```apache
   # Poprawny typ pliku SQLite (WebAssembly) — szybsze ładowanie
   AddType application/wasm .wasm

   <IfModule mod_headers.c>
     # index.html i service worker zawsze świeże, żeby użytkownicy dostawali aktualizacje
     <FilesMatch "^(index\.html|service-worker\.js)$">
       Header set Cache-Control "no-cache"
     </FilesMatch>

     # Pliki z hashem w nazwie można cache'ować na stałe
     <FilesMatch "\.[0-9a-f]{8,}\.(js|css|png|gif|wasm|ttf)$">
       Header set Cache-Control "public, max-age=31536000, immutable"
     </FilesMatch>
   </IfModule>
   ```
   Aby `.htaccess` trafiał do każdego buildu automatycznie, zapisz go w `frontend/public/.htaccess`.

   Dla **nginx** (od wersji 1.21 typ `.wasm` jest już znany) wystarczy w bloku `server`:
   ```nginx
   location ~ (index\.html|service-worker\.js)$ { add_header Cache-Control "no-cache"; }
   ```
4. **HTTPS jest wymagane do trybu offline** (service worker) — na zwykłym `http://` aplikacja działa, ale bez offline. Większość hostingów daje darmowy certyfikat Let's Encrypt.

**Osadzenie na istniejącej stronie:** najprościej wgrać aplikację do podkatalogu i dodać link w menu (`<a href="/strzelnica/">Nauka do egzaminu</a>`) albo osadzić ją w podstronie:

```html
<iframe src="/strzelnica/" style="width:100%; height:90vh; border:0;"></iframe>
```

Ramka musi wskazywać na tę samą domenę co strona — inaczej przeglądarki (zwłaszcza Safari) mogą blokować zapis postępu.

> Postęp nauki jest zapisywany w przeglądarce **osobno dla każdej domeny** — wersja na GitHub Pages i na własnym serwerze mają niezależne postępy.

## Struktura repozytorium

```
.github/workflows/deploy.yml   automatyczne wdrożenie na GitHub Pages
CLAUDE.MD                      szczegółowa dokumentacja techniczna (architektura, konwencje, testy)
frontend/                      aplikacja React
  public/                      index.html, manifest, ikony
  src/
    assets/questions.json      baza pytań
    components/                ekrany i komponenty
    services/                  pytania (question-service) i baza SQLite (db)
    service-worker.ts          tryb offline
```

## Edycja pytań

Pytania są w `frontend/src/assets/questions.json`. Każde pytanie ma unikalne `legacyId` (używane do zapisu postępu — nie zmieniaj go dla istniejących pytań), treść, przepis (`paragraph`), kategorię, trzy odpowiedzi `a`/`b`/`c` i poprawną odpowiedź `goodAnswer`. Testy (`npm test`) sprawdzają poprawność całego pliku.
