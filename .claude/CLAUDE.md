# Faro Formoso — Project Guidelines

Free, public-utility PWA guide for living in and visiting Faro, Portugal. Bilingual (PT/EN), fully static frontend — no backend.

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
- When adding cacheable pages/assets, update `sw.js` (`PRECACHE_URLS` / `HTML_PAGES`) and bump `CACHE_VERSION` so clients pick up the change.
- Do not precache raw files under `src/` in production — only built/output assets.
- All user-facing strings must support both Portuguese and English via `src/intl/i18n.js`; avoid hardcoding text in only one language.
- Keep the site fully static — no backend/server-side logic. Data comes from public/open APIs and sources listed in the root [README.md](../README.md).
- Respect accessibility (WCAG) and dark-mode support already present in `src/ui/accessibility.js` and site-wide styles.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally