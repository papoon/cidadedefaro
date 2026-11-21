# UI — Faro Formoso Editorial Design System

Single source of truth for frontend design decisions. The executable version lives in:

- [assets/styles/style.css](../../assets/styles/style.css) — tokens, fonts, base type, site chrome
  (masthead, nav, index, colophon), shared components (buttons, forms, tables, callouts, entries,
  search, favorites, home, weather, maps).
- [assets/styles/components.css](../../assets/styles/components.css) — page-family components
  (timeline, emergency, recycling bins, hotel/restaurant entries, simulators…).
- [src/partials/icons.html](../../src/partials/icons.html) — the inline SVG icon sprite.

If this document and the CSS disagree, fix the drift rather than picking one.

## Direction: a printed city guide, not an app template

The site reads like a well-edited pocket guide (think Monocle / Wallpaper* city guides, newspaper
layouts): **typography and rules do the work, not boxes, shadows and gradients.** It is still a
public-utility tool used by residents, tourists and elderly people, so legibility and quick access
to urgent information always beat decoration.

Things this design deliberately does **not** do (they were the "AI template" tells of the old UI):

- No emoji as icons — anywhere (HTML, i18n JSON, JS-generated markup, map markers).
- No gradients (`linear-gradient`) on chrome, buttons or cards. No decorative wave SVGs.
- No grids of identical shadowed rounded cards with icon + title + blurb.
- No hover "lift" (`translateY`) or scale effects. Hover = colour/underline change.
- No coloured `border-left: 4px` callout stripes.
- No floating circular buttons stacked down the right edge — tools live in the masthead.
- No fade-in-on-scroll for content.

## Tokens

All colour comes from tokens on `:root` (light) and `body.dark-mode` (dark). High contrast mode
(`body.high-contrast`, in `accessibility.css`) overrides the same tokens with black/white/yellow.
Never hardcode a hex in new CSS.

| Token | Light | Use |
|---|---|---|
| `--paper` | `#f6f1e7` | Page background |
| `--paper-2` | `#ede5d5` | Tinted bands, neutral callouts, hover |
| `--surface` | `#fbf8f2` | Inputs, dropdowns, modals |
| `--rule` | `#d6cbb7` | Hairline rules between items |
| `--rule-strong` | `#1d2428` | Heavy editorial rules (top of lists, under page headers) |
| `--ink` | `#1d2428` | Headings, strong text |
| `--ink-2` | `#353d42` | Body text |
| `--ink-3` | `#5d605a` | Meta / muted text (≥ 5:1 on paper) |
| `--ink-4` | `#8a867c` | Placeholders, disabled, input borders |
| `--ria` / `--ria-deep` / `--ria-tint` | `#0f5872` / `#0a3e51` / `#e0eae8` | Links and actions; info callouts |
| `--terra` / `--terra-tint` | `#a84f26` / `#f2dfd0` | **Numbering and highlights only** (section numbers, active nav underline, featured badge) |
| `--danger` / `--danger-tint` | `#a3301d` / `#f5ddd6` | Emergency numbers, destructive actions, errors |
| `--warn` / `--warn-tint` | `#7d5200` / `#f2e4c4` | Warnings |
| `--ok` / `--ok-tint` | `#2b6439` / `#dfece0` | Success / confirmation / contact channels — never decorative |
| `--color-focus-ring` | `#ffca4f` | Keyboard focus — never reuse for anything else |

Legacy names (`--color-ocean-700`, `--color-sand-100`, `--color-text`, …) are kept as aliases at the
bottom of `:root` so older stylesheets keep working. Use the new names in new CSS.

Radius is nearly square (`--radius-sm` 2px … `--radius-lg` 4px). Shadows (`--shadow-md/lg`) are only
for things that float above the page: dropdowns, the index panel, toasts, modals.

## Typography

Self-hosted in `assets/fonts/` (SIL OFL, licences alongside), declared with `@font-face` at the top
of `style.css`. `font-display: swap`, latin + latin-ext subsets via `unicode-range`.

- **Fraunces** (variable, `opsz` + `wght`) — `--font-display`: `h1`–`h3`, wordmark, ledes, entry
  titles, big numbers (temperatures, phone numbers, emergency numbers, timeline dates).
- **Atkinson Hyperlegible** — `--font-body`: all body text, UI, labels. Chosen for low-vision
  legibility (important for `idosos.html`).
- Small-caps label voice (`.kicker` and friends): body font, `--font-size-xs`, 700, `letter-spacing:
  .09em`, uppercase, `--ink-3`. Use it for section kickers, meta labels, column headings.
- Scale: `--font-size-xs` .8125 · `sm` .9375 · `base` 1.0625 · `lg` 1.25 · `xl` 1.5 ·
  `2xl` fluid ~1.6–2.25 · `3xl` fluid 2.5–4.5rem (page `h1`).
- Body line-height 1.65; long text capped at `--measure` (68ch).
- `h4` is body-font bold, not serif.

## Layout

- `main` is centred at `--page-max` (1180px) with `--gutter` side padding.
- **Every content page opens with `<section class="hero">`** containing the page's only `<h1>` and a
  lede `<p>`. It is styled as an editorial page header (huge serif title, serif lede, heavy rule
  below). The masthead wordmark is not a heading.
- Top-level `main > section`s are separated by hairline rules. Their first `h2`/`h3` gets an
  automatic terracotta section number (`01`, `02`… via CSS counters, hidden from assistive tech).
  Add `.no-number` to opt out.
- "Article" sections (`.service-card`, `.transport-card`, `.info-section`, `.about-section`,
  `.privacy-section`, … or any section with `.is-article`) become a two-column layout ≥ 900px: sticky
  title on the left (4/12), content on the right (8/12).
- Repeated items are **entries**, not cards: a 1px `--rule-strong` top border, serif title, muted
  meta, laid out in auto-fill columns (`.entry-grid`, or the page-family grids in
  `components.css`). Use `.entry` for new ones.

## Site chrome

- **Masthead** (`src/partials/header.html`): kicker + tool row (language, theme, notifications;
  `accessibility.js` and `voice-navigation.js` append their buttons into `#masthead-tools`), serif
  wordmark + tagline, global search (injected by `search.js`), then the nav between a heavy and a thin
  rule.
- **Nav** (`src/partials/navigation.html`): max 7 primary links + favourites + the **Índice** button,
  which opens a panel listing every page in numbered groups (behaviour in `src/core/main.js`:
  `aria-expanded`, Esc and click-outside close). Current page = terracotta underline via
  `aria-current="page"` (set in `main.js`). New pages go in the index panel; only promote to the
  primary row if it's top-7 important.
- **Colophon** (`src/partials/footer.html`): dark ink band, columns for mission, sources, project
  links, donation.
- **Icons**: `<svg class="icon" aria-hidden="true"><use href="#i-name"></use></svg>`, ids listed in
  `src/partials/icons.html` (Lucide-derived, ISC). Always pair with visible text or an
  `aria-label` on the control. Add new symbols to the sprite rather than inlining paths.
  ⚠ i18n: `data-i18n` on a non-`<span>` element replaces its `innerHTML` — put the key on a child
  `<span>` next to the icon, never on the element that contains the `<svg>`.

## Components (all in style.css unless noted)

- **Buttons**: `.btn` (ink outline, fills ink on hover), `.btn-primary` (solid Ria — one per view),
  `.btn-secondary`, `.btn-outline`. In-list text actions (`.btn-maps`, `.btn-map`, `.btn-website`,
  `.external-link`) are underlined links, not buttons. `.btn-call-large` is the urgent red call button.
  Min height 2.75rem (44px).
- **Callouts**: `.callout` + `--info | --warn | --urgent | --ok`, tinted background, small-caps
  heading, no side stripe. Legacy names (`.info-box`, `.warning-box`, `.tips-box`, `.contact-box`,
  `.schedule-box`, `.highlight-box`, …) map onto the same look.
- **Tags**: `.tag` (and legacy `.activity-tag`, `.servico-badge`, …) — 1px outline, small caps-ish,
  no fill.
- **Filters**: `.filter-btn` / `.filter-checkbox` — outline; selected = solid ink.
- **Tables**: plain semantic markup; ruled, small-caps header, tabular numerals. Wrap wide tables in
  `.table-scroll`.
- **Home** (`index.html`): `.home-hero` (headline + Arco da Vila line drawing), `.urgent-line`
  (112 / SNS 24 / pharmacies / where to go now — keep it; it's the fastest path to urgent help),
  `.fact-row` (weather + municipality), `.section-index` (numbered table of contents),
  `.home-closing`.
- **Map pins**: `.map-pin` with `--pin` colour + sprite icon, used in Leaflet `divIcon`s.
- Page families (`components.css`): timeline, emergency numbers, recycling bins (the one place
  literal colour is information), hotel/restaurant entries, simulators, premium guide, offline.

## Dark mode

Token-driven only: `body.dark-mode` redefines the tokens and everything re-themes. **Do not add
`body.dark-mode .component { … }` rules** — if something looks wrong in dark mode, it's using a
hardcoded colour; switch it to a token. The only exceptions are the colophon background and text on
saturated fills (`.btn-call-large`, `.map-pin`, `.favorites-count`).

## Accessibility checklist

- [ ] Contrast ≥ 4.5:1 body / 3:1 large text & UI, in light, dark **and** high-contrast modes.
- [ ] One `<h1>` per page (in `.hero`); heading levels never skip.
- [ ] Visible `:focus-visible` (global rule; don't override).
- [ ] Keyboard: Índice panel, a11y menu, search results, modals all operable with Tab/Enter/Esc.
- [ ] Icon-only controls have `aria-label`; decorative SVGs have `aria-hidden="true"`.
- [ ] Touch targets ≥ 44×44px.
- [ ] Dynamic updates use `aria-live` (see `alerts.js`, weather widget).
- [ ] Respect `prefers-reduced-motion` (global rule in `style.css`).
- [ ] Works at 200% zoom and with the a11y font-size control (it scales the root `font-size`).

## Rules

**Do**
- Use tokens for every colour, space, radius and shadow.
- Reuse `.hero`, `.entry`, `.callout`, `.btn`, `.tag`, table/form base styles.
- Test at 1280, 768 and 375px; light, dark and high contrast; PT and EN.
- Add new pages to `vite.config.js` `htmlPages`, the Índice panel in `navigation.html`, and
  `sitemap.xml`.
- Add PT **and** EN strings for every new `data-i18n` key, with real translations.

**Don't**
- Add a `<style>` block or `style=""` attribute to a page — put it in `components.css`.
- Use emoji, gradients, hover lifts, or a new accent colour.
- Use `innerHTML` / string-built HTML for dynamic or data-driven text — build nodes with
  `createElement` + `textContent` (see `renderHoteis` in `src/data/hoteis.js`,
  `renderFavoritesList` in `src/utils/favorites.js`).
- Use green decoratively or reuse `--color-focus-ring`.

## New-page checklist

1. [ ] Uses `metaCommon`, `header`, `footer`, `scriptsCommon` partials.
2. [ ] Opens with `<section class="hero">` + single `<h1>` + lede.
3. [ ] Listed in `vite.config.js`, the Índice panel, and `sitemap.xml`.
4. [ ] No inline styles; only tokens; only shared components (or a new family in `components.css`).
5. [ ] PT + EN strings.
6. [ ] Accessibility checklist above.
7. [ ] If it should work offline: added to `sw.js` `HTML_PAGES`, `CACHE_VERSION` bumped.
8. [ ] Verified with a real build: `docker exec cidadedefaro-dev sh -c "cd /app && npm run build"`.
