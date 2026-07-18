# Faro Formoso — Project Guidelines

Free, public-utility PWA guide for living in and visiting Faro, Portugal. Bilingual (PT/EN), fully static frontend — no backend.

For any UI/design work (new pages, components, styling, colors), see
[.claude/skills/ui-modernization.md](skills/ui-modernization.md) — the project's single source of
truth for the Faro-inspired design system (palette, typography, spacing, components, a11y checklist).

## Stack

- Plain HTML5 + CSS3 + vanilla JavaScript (ES6+, `type: module`), no framework
- Vite (multi-page app) as build tool — see [vite.config.js](../vite.config.js)
- EJS partials injected into HTML pages at build time from `src/partials/` (header, navigation, footer, common meta/scripts)
- Service worker ([sw.js](../sw.js)) for offline support and caching
- Leaflet.js + OpenStreetMap for interactive maps
- Custom i18n system (`src/intl/i18n.js`) — no i18n library

## Structure

- `*.html` at repo root — one file per page (index, transportes, saude, ambiente, lazer, restaurantes, hoteis, mobilidade, etc.), each listed in `htmlPages` in `vite.config.js`
- `src/core/` — app bootstrap
- `src/data/` — static data modules (e.g. `mapa.js`, `restaurantes.js`, `hoteis.js`, `mobilidade.js`, `farmacias.js`, `dados-api.js`)
- `src/ui/` — UI behavior (accessibility, alerts, UX helpers, voice navigation)
- `src/utils/` — search, favorites, PWA install helpers
- `src/intl/` — i18n
- `src/partials/` — shared EJS HTML fragments reused across pages
- `assets/` — styles, images, static assets

## Conventions

- New pages must be added to the `htmlPages` array in `vite.config.js` or they won't be built.
- Shared header/nav/footer/meta live in `src/partials/*.html` — edit there, not per-page, to change site-wide chrome.
  New scripts common to all pages go in `src/partials/scripts-common.html`; new global stylesheets go in
  `src/partials/meta-common.html`. Never add a manual `<script>`/`<link>` for something already included via
  `scriptsCommon`/`metaCommon` in a page — check first, or it double-loads.
- All user-facing strings must support both Portuguese and English via `src/intl/i18n.js` and
  `assets/lang/pt.json` / `assets/lang/en.json`. When adding a `data-i18n` key, add it to **both** files with an
  actual translation — don't copy the Portuguese string into `en.json` as a placeholder and forget it (this has
  shipped broken before, e.g. `guia_premium.*` keys). Prefer clean, semantic key names (`section.field_name`)
  over auto-generated accent-stripped slugs.
- Never render user-supplied or dynamic content via `innerHTML`/string-interpolated HTML (e.g. in `src/ui/alerts.js`).
  Build DOM nodes with `createElement`/`textContent` instead — this codebase had a real XSS bug from exactly this pattern.
- Keep the site fully static — no backend/server-side logic. Data comes from public/open APIs and sources listed in the root [README.md](../README.md).
- Respect accessibility (WCAG) and dark-mode support already present in `src/ui/accessibility.js` and site-wide styles.
- Newer pages have gone in without being linked from `src/partials/navigation.html` and without a `sitemap.xml`
  entry (e.g. `saude-onde-ir-agora.html`) — when adding a page, add both, not just the `vite.config.js` entry.

## The build actually bundles and hashes JS/CSS — don't assume it doesn't

This tripped up a prior session badly, so it's spelled out explicitly:

- `vite.config.js` builds a real multi-page Rollup app (`rollupOptions.input` = every page in `htmlPages`).
  Any `<script src="src/...">` or `<link href="assets/styles/...">` referenced **from an HTML entry page** gets
  bundled and renamed to a content-hashed file under `dist/assets/` (e.g. `assets/main-<hash>.js`,
  `assets/mapa-<hash>.js`, `assets/main-<hash>.css`). The built HTML is rewritten to point at these hashed files.
- Separately, `viteStaticCopy` (also in `vite.config.js`) copies `src/`, `assets/`, etc. **verbatim** into `dist/`
  too. Those verbatim copies (`dist/src/...`, `dist/assets/styles/style.css`) are **not** what the built pages
  actually request — they're dead weight left over from the copy step. Don't assume "files under `src/` are the
  real shipped production files" — verify against the actual built HTML's `<script src>`/`<link href>` first
  (`docker exec cidadedefaro-dev npm run build` then `grep` `dist/*.html`).
- Practical implication for `sw.js`: you **cannot** statically list the real JS/CSS bundle URLs in
  `PRECACHE_URLS`/`HTML_PAGES` — their filenames are hash-derived and unknown until build time. Don't add raw
  `src/*.js` or `assets/styles/*.css` paths there. Instead rely on the runtime "Cache First" fetch handler
  (already in `sw.js`, matches any `.css`/`.js`/`.json` request) to opportunistically cache the real hashed
  bundles as pages are visited. Only precache things requested at their literal, unhashed path: page HTML itself
  (`index.html`, `mapa.html`, ...) and JSON files fetched at runtime via `fetch()` from `assets/data/*.json`
  (these are not part of the HTML import graph, so Vite doesn't touch them).
- Whenever you touch `sw.js`'s cached asset lists, bump `CACHE_VERSION` — otherwise already-installed clients can
  keep serving a stale cache under the same cache name indefinitely.

## Dependencies — keep `package.json` and `package-lock.json` in sync

- CI (`.github/workflows/deploy.yml`) runs `npm ci`, which installs **strictly** from `package-lock.json` and
  fails hard on any drift from `package.json`. If you edit `devDependencies`/`dependencies` in `package.json`,
  you must regenerate the lockfile in the same change (`npm install` inside the dev container, see below), or
  the next push breaks the GitHub Pages deploy.
- `ejs` is a direct dependency (used in `vite.config.js` for partial rendering) — it must be declared in
  `package.json`. It has shipped before as an undeclared, install-order-dependent leftover in `node_modules`,
  which works locally by accident but fails under `npm ci` in CI with
  `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'ejs'`. If `vite.config.js` ever imports a new package
  directly, declare it as a `devDependency`.
- Before considering a dependency change done, verify with the CI-equivalent sequence, not just `npm install`:
  `npm ci` (clean install from lock) followed by `npm run build`. A change that only passes `npm install` can
  still break CI.

## Running commands — use the Docker dev container, not the host

- The user's host Node version is older than this project requires (Vite 7 needs Node 20.19+/22.12+); running
  `npm`/`vite` directly on the host fails or gives misleading errors. Always run through the existing container
  instead of installing/upgrading anything on the host:
  `docker exec cidadedefaro-dev sh -c "cd /app && <command>"` (container name `cidadedefaro-dev`, defined in
  `docker-compose.yml`, bind-mounts the repo at `/app` so host edits are live — no rebuild needed for code
  changes, only if `Dockerfile`/base image itself changes). If the container isn't running, ask before starting
  one rather than trying to install tooling on the host.
- Don't run `rm -rf node_modules` inside the container — the named volume mount can report "Resource busy".
  `npm ci` clears and reinstalls `node_modules` itself, so it's unnecessary anyway.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally

(Run all of the above via `docker exec cidadedefaro-dev sh -c "cd /app && <command>"`, not directly on the host.)