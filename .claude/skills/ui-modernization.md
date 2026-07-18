# UI Modernization — Faro Formoso Design System

This is the **single source of truth** for frontend design decisions in this project. Reference it
whenever creating or updating any page, component, or piece of UI. The tokens and rules here are
implemented in [assets/styles/style.css](../../assets/styles/style.css) (`:root` block at the top) —
treat that file as the executable version of this document; if they ever disagree, fix the drift
rather than picking one to trust.

## Design philosophy

- **Faro-inspired, not generic SaaS.** The palette and mood should evoke the Algarve coast — ocean,
  sand, sun-warmed clay — not a default indigo/purple admin-panel look.
- **Light, professional, welcoming.** Generous whitespace, soft shadows, rounded corners. Nothing
  loud or gimmicky — this is a public-utility guide used by residents and tourists, including
  elderly users (see `idosos.html`), not a marketing site.
- **Calm, not flashy.** Motion and color are used to clarify state and hierarchy, never for
  decoration. If an animation or color doesn't help the user understand something, cut it.
- **Consistency over novelty.** Reuse the components and tokens below instead of inventing new
  one-off patterns per page. A new page should look like it belongs to this site without anyone
  having to think about it.
- **Accessible by default.** WCAG AA is the floor, not a follow-up task.

## Faro-inspired color palette

All colors are CSS custom properties defined in `assets/styles/style.css`'s `:root`. Always use the
variable, never hardcode a hex value in new CSS.

| Token | Value | Use |
|---|---|---|
| `--color-ocean-900` | `#0d3b4f` | Deepest ocean — gradient ends, dark text on light bg, table headers |
| `--color-ocean-700` | `#146a8c` | **Primary brand color** — links, primary buttons, active states, headings accents |
| `--color-ocean-500` | `#2f8fb8` | Lighter ocean — info states, secondary accents |
| `--color-ocean-100` | `#e3f2f7` | Info background tint |
| `--color-sand-50` | `#faf7f2` | Page background |
| `--color-sand-100` | `#f3ede1` | Card/section alt background, secondary button bg |
| `--color-sand-300` | `#e6ddce` | Default border color |
| `--color-sand-500` | `#ded3bd` | Stronger border / divider |
| `--color-terracotta-700` | `#a85a2f` | Terracotta accent, dark variant |
| `--color-terracotta-600` | `#c8703f` | Terracotta accent — sparing highlight, badges, icons |
| `--color-terracotta-100` | `#f8e3d3` | Terracotta background tint |
| `--color-green-700` | `#2c623c` | Success text |
| `--color-green-600` | `#4c8c5b` | **Natural green — success/confirmation ONLY, used sparingly** |
| `--color-green-100` | `#eef6ee` | Success background tint |
| `--color-ink-900` | `#2c3338` | Headings, strongest body text |
| `--color-ink-700` | `#4a4a45` | Default body text |
| `--color-ink-500` | `#6b6a63` | Muted/secondary text |
| `--color-ink-300` | `#9c968a` | Placeholder text, disabled state, faint labels |
| `--color-error` / `--color-error-dark` | `#c0392b` / `#9c2e22` | Error states, destructive actions |
| `--color-error-bg` | `#fdece9` | Error background tint |
| `--color-warning` | `#d98324` | Warning states |
| `--color-warning-bg` | `#f7e8d0` | Warning background tint |
| `--color-focus-ring` | `#ffca4f` | Keyboard focus outline (accessibility-critical, kept high-contrast — do not theme this away) |
| `--gradient-ocean` | `linear-gradient(135deg, var(--color-ocean-700), var(--color-ocean-900))` | Header, footer, primary button, hero accents |

**Rules:**
- Ocean blue is the primary/dominant color. Sand/cream is the base background. Terracotta is an
  *accent* — use it for highlights, badges, and calls to attention, not large surfaces. Green is
  reserved for success/confirmation semantics only (don't use it decoratively — that dilutes its
  meaning when a user actually needs to see "this worked").
- Never repurpose `--color-focus-ring` for anything but keyboard focus. It's tuned for maximum
  visibility against both the ocean gradient and the sand background.
- If a new semantic color is needed (e.g. a new alert type), derive it from the existing hue
  families above rather than introducing an unrelated color.

## Typography

- Font stack: system UI stack already in `body` (`-apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, "Helvetica Neue", Arial, sans-serif`) — no webfonts, keeps the site fast and dependency-free.
- Type scale (`--font-size-*` tokens): `sm` 0.875rem, `base` 1rem, `lg` 1.125rem, `xl` 1.5rem,
  `2xl` 1.875rem, `3xl` a fluid `clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem)` for page-level hero headings.
- Base line-height is `1.6` on `body` — keep it there or higher for paragraph text; never drop
  below `1.4` for body copy (readability, especially for older users).
- Headings use `--color-ink-900`; body text uses `--color-ink-700`; secondary/meta text uses
  `--color-ink-500`.
- Heading weight: 600–700. Don't go below 600 for `h1`–`h3` — thin headings read poorly at small
  sizes on mobile.

## Spacing system

4px-based scale, exposed as `--space-1` through `--space-8`:

| Token | Value | Typical use |
|---|---|---|
| `--space-1` | 0.25rem (4px) | Icon gaps, tight inline spacing |
| `--space-2` | 0.5rem (8px) | Form field label gap, small gaps |
| `--space-3` | 0.75rem (12px) | Button padding (vertical), compact card padding |
| `--space-4` | 1rem (16px) | Standard padding, form input padding |
| `--space-5` | 1.5rem (24px) | Section/card internal padding, form field spacing |
| `--space-6` | 2rem (32px) | Section margins, page `main` padding |
| `--space-7` | 3rem (48px) | Hero padding, large section separation |
| `--space-8` | 4rem (64px) | Rare — major page-section breaks |

Always use a token instead of an arbitrary `px`/`rem` value in new CSS. If none of the steps fit,
that's a signal to reconsider the layout rather than inventing a one-off value.

## Buttons

Base class `.btn` + a modifier. Never write a bespoke button style per page — extend these.

- `.btn-primary` — `--gradient-ocean` background, white text. The single default call-to-action
  style. One primary button per view/section; don't have two competing primary CTAs side by side.
- `.btn-secondary` — sand background (`--color-sand-100`), ink text, sand border. Use for secondary
  actions next to a primary button.
- `.btn-outline` — transparent background, ocean border + text, fills solid ocean on hover. Use for
  tertiary/low-emphasis actions.
- All buttons: `var(--radius-md)` corners, `var(--space-3) var(--space-5)` padding, hover = subtle
  `translateY(-2px)` lift + shadow (already wired via `.btn-primary:hover` etc.) — keep this
  consistent, don't add heavier hover effects (scaling, rotation, color flips) elsewhere.
- Destructive actions (e.g. "remove favorite") use `--color-error`/`--color-error-dark`, not a new
  red.

## Form guidelines

Generic `input[type=...]`, `select`, `textarea`, and `label` styles are defined globally in
`style.css` — most forms need **zero** custom CSS.

- Wrap a labeled field in `.form-field` for consistent bottom margin (`--space-5`).
- Use `.form-hint` for helper text below a field, `.form-error` for validation errors (always paired
  with `aria-describedby` pointing at the hint/error element, and `aria-invalid="true"` on the input
  when in an error state).
- Focus state is handled globally (ocean border + soft ocean glow) — don't override `:focus` styles
  per page.
- Every input needs a visible `<label>`; placeholder text is not a substitute for a label.
- Disabled state is handled globally (sand background, muted text) — don't hand-roll a disabled look.

## Card layouts

- `.card` — white surface, `var(--radius-lg)`, `var(--shadow-sm)`, lifts to `var(--shadow-lg)` +
  ocean border on hover. This is the default content-tile pattern (see homepage nav cards).
- `.card-premium` — ocean gradient background variant for a single highlighted/premium card; don't
  reuse this treatment for more than one card per page or it stops reading as "special."
  variant for a single
- Card grids use `.cards-grid` (`repeat(auto-fit, minmax(250px, 1fr))`) — reuse this instead of a
  bespoke grid per page.
- Keep card content hierarchy consistent: icon → `h3` title → short description paragraph. Don't mix
  in unrelated content types (forms, tables) inside a `.card`.

## Table styling

Global `table`/`thead`/`tbody` styles now exist in `style.css` — ocean-900 header row, white body,
sand hover row, soft shadow, rounded container corners. Use plain semantic `<table>` markup
(`<caption>`, `<thead><th scope="col">`, `<tbody>`) — the styling is automatic.

- Wrap any table whose columns can't reasonably shrink on mobile in `<div class="table-scroll">…</div>`
  for horizontal scroll instead of squeezing columns unreadably.
- Don't build tabular data as a grid of `<div>`s — use real `<table>` markup for anything genuinely
  tabular (schedules, price comparisons, opening hours) so screen readers and this shared styling
  both work correctly.

## Navigation standards

- Header/footer use `--gradient-ocean`. Don't introduce a different gradient or flat color for either.
- Nav links: pill-shaped, semi-transparent dark background over the gradient for contrast, white
  bold text, active/current page uses the high-contrast `--color-focus-ring` (`#ffca4f`) amber pill
  with black text — this is intentional (WCAG contrast on a busy gradient background), don't swap it
  for an ocean or terracotta highlight.
- Every nav link needs `aria-current="page"` set server-side/templated when it matches the current
  page — this drives both the active visual state and assistive-tech announcement.
- New pages must be added to `src/partials/navigation.html` (not just `vite.config.js`'s `htmlPages`
  array) or they're unreachable from the UI — see the "Do's and Don'ts" checklist below.

## Responsive design principles

- Mobile-first content, but the CSS in this codebase is written desktop-first with `max-width`
  breakpoints at `768px` (tablet) and `480px` (small mobile) — follow that existing pattern for
  consistency rather than switching to `min-width` mid-file.
- Every new component needs at least a `768px` breakpoint pass: check nav wrapping, card grid
  collapsing to 1 column, font-size reduction, and padding reduction, mirroring the adjustments
  already made for `.hero`, `.cards-grid`, `.info-grid`, tables, etc.
- Never let a fixed-width element (image, embed, table) overflow the viewport — use `max-width: 100%`
  and, for tables, `.table-scroll`.
- Touch targets (buttons, nav links, form controls) must stay ≥ 44×44px on mobile breakpoints.

## Accessibility checklist

Run through this for every new page/component, not just at the end of a big change:

- [ ] Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text (18px+/bold 14px+) and UI
      components, against their actual background — verify ocean-on-white, white-on-ocean-gradient,
      and any status-color combinations you introduce.
- [ ] Every interactive element (link, button, input, custom control) has a visible
      `:focus-visible` state — the global rule in `style.css` covers standard elements; verify custom
      JS-driven controls (dropdowns, modals) don't suppress it.
- [ ] Full keyboard operability: tab order is logical, nothing is a keyboard trap, custom widgets
      (modals, the search dropdown, the alerts close button) are operable with Enter/Space/Escape as
      appropriate.
- [ ] Semantic HTML first: `<button>` for actions, `<a>` for navigation, real `<table>` for tabular
      data, heading levels (`h1`→`h2`→`h3`) never skipped.
- [ ] Every `<img>` has meaningful `alt` text (or `alt=""` if purely decorative).
- [ ] Form inputs have associated `<label>`s (not placeholder-only), and error/hint text is wired
      via `aria-describedby`.
- [ ] Dynamic content updates (alerts, search results, favorites count) use appropriate `aria-live`
      regions — see `src/ui/alerts.js`'s `aria-live="polite"` container as the reference pattern.
- [ ] `prefers-reduced-motion: reduce` is respected — the global rule in `style.css` already
      disables/shortens all animations and transitions site-wide; don't add an animation that
      bypasses it (e.g. via `!important` or JS-driven inline styles).
- [ ] Text remains readable and layout doesn't break at 200% browser zoom.

## Animation guidelines

- Motion should communicate state change (hover, focus, appearing, dismissing), never be purely
  decorative.
- Standard durations: `--transition-fast` (0.15s) for micro-interactions (icon color change),
  `--transition-base` (0.25s) for hover/focus lifts and color transitions, `--transition-slow`
  (0.4s) for larger appearance changes (modals, the `.fade-in-up` utility).
- Standard hover pattern for clickable surfaces (cards, buttons): `translateY(-2px)` to
  `translateY(-5px)` lift + shadow increase. Don't introduce scale/rotate/skew hover effects — it
  would be inconsistent with every existing component.
- Use the `.fade-in-up` utility class (`animation: fade-in-up var(--transition-slow) both`) for
  opt-in entrance animation on a section/card; don't hand-write new `@keyframes` for the same effect.
- All animation/transition is automatically shortened to near-zero under
  `prefers-reduced-motion: reduce` — never fight this with `!important`.

## Component consistency rules

- Before writing new CSS for a page, check whether `assets/styles/style.css` already has a
  component that fits (`.card`, `.btn-*`, `.hero`, `.info-grid`, `.notification`, table styles, form
  styles) — reuse it. Duplicating a near-identical block inside a page's own `<style>` tag is exactly
  the pattern this redesign is moving away from.
- If a page-specific `<style>` block only contains color/spacing values that already exist as
  tokens, replace the literals with `var(--token-name)` rather than leaving hardcoded hex/px — this
  keeps future palette or spacing changes a one-line edit instead of a repo-wide search.
- If two or more pages need the same new component, add it to `assets/styles/style.css` (or a
  dedicated shared stylesheet loaded via `src/partials/meta-common.html`) instead of copy-pasting it
  into each page's inline `<style>` block.
- Shared chrome (header, nav, footer, common meta tags/scripts) lives in `src/partials/*.html` —
  never fork it into a page-local copy.

## Do's and Don'ts

**Do:**
- Use the design tokens (`var(--color-...)`, `var(--space-...)`, `var(--radius-...)`,
  `var(--shadow-...)`) for anything new.
- Reuse `.btn`, `.card`, `.cards-grid`, form, and table base styles.
- Test every new/changed page at 768px and 480px breakpoints.
- Keep green reserved for success/confirmation states.
- Add new pages to both `vite.config.js`'s `htmlPages` array **and**
  `src/partials/navigation.html` **and** `sitemap.xml`.
- Add both PT and EN translations for any new `data-i18n` key at the same time you add it.

**Don't:**
- Don't hardcode a hex color, arbitrary spacing value, or one-off shadow when a token exists.
- Don't introduce a second gradient, accent hue, or button style "just for this page."
- Don't use `innerHTML`/string-built HTML for anything containing dynamic or user-influenced text —
  build DOM nodes and use `textContent` (see `src/ui/alerts.js` for the reference pattern; this
  codebase has shipped an XSS bug from violating this before).
- Don't suppress or override the global focus-visible outline for aesthetic reasons.
- Don't use green decoratively — it reads as "success" to users by convention.
- Don't build tabular data as styled `<div>`s instead of a real `<table>`.
- Don't add a new inline `<style>` block to a page for something that belongs in shared CSS.
- Don't ship an animation that ignores `prefers-reduced-motion`.

## New-page checklist

Before considering any new page or major component change complete:

1. [ ] Uses `src/partials/meta-common.html`, `header`, `navigation` (via `header`), `footer`, and
       `scriptsCommon` partials — no forked/duplicated chrome.
2. [ ] Added to `vite.config.js`'s `htmlPages` array, `src/partials/navigation.html`, and
       `sitemap.xml`.
3. [ ] Uses design tokens (colors/spacing/radius/shadow) — no new hardcoded hex or arbitrary spacing.
4. [ ] Reuses `.btn`, `.card`, table, and form base styles instead of duplicating them locally.
5. [ ] All visible text has PT and EN entries in `assets/lang/pt.json` / `assets/lang/en.json` via
       `data-i18n`, with real translations (not a copy-pasted placeholder in the other language).
6. [ ] Passes the accessibility checklist above (contrast, focus states, keyboard nav, semantic
       markup, alt text, labels, `aria-live` where relevant, reduced-motion respected).
7. [ ] Responsive at 768px and 480px — no overflow, nav wraps sanely, touch targets stay ≥44px.
8. [ ] No `innerHTML`/string-HTML interpolation of dynamic content.
9. [ ] If it should be available offline, added to `sw.js`'s `HTML_PAGES` (and `CACHE_VERSION`
       bumped) — see `.claude/CLAUDE.md` for the caveats on what `sw.js` can and can't precache in
       this project's build.
10. [ ] Verified with a real build (`docker exec cidadedefaro-dev sh -c "cd /app && npm run build"`),
        not just the dev server — this project's CI failed before from drift that only showed up in
        `npm ci && npm run build`.

## Reusable page patterns (extracted from duplicated inline styles)

These live in the "PADRÕES DE PÁGINA REUTILIZÁVEIS" section of `style.css`, extracted from
near-identical `<style>` blocks that were previously copy-pasted across 2–5 pages each. Use these
instead of redefining the same box/grid/panel locally on a new page:

| Class | Purpose |
|---|---|
| `.info-box` (+ `.info-box--warning`) | Neutral informational callout; warning variant for cautionary content |
| `.highlight-box` / `.warning-box` | Aside/callout note; warning variant for cautionary standalone notes |
| `.tips-box` (+ `.tips-box--success`) | Friendly tip/suggestion callout; success variant for positive tips |
| `.contact-box` | Success-toned block highlighting a contact/help channel |
| `.no-results` / `.no-results-icon` | Card-style empty state for search/filter results |
| `.location-grid` / `.location-item` | Grid of place/address cards |
| `.emergency-grid` | Grid layout for emergency-contact listings (item styling stays page-local — see note in `style.css`) |
| `.search-filter-section`, `.search-box`, `.search-input-container`, `.filters-section`, `.filter-group`, `.filter-options`, `.filter-checkbox`, `.filter-actions`, `.results-header` | Full search + filter panel used by browse/listing pages (`hoteis.html`, `restaurantes.html`) |

`hoteis.html` and `restaurantes.html` still each have their own `.hotel-*`/`.restaurante-*` card
styling (near-identical structure, different class names) — see Future enhancements below for why
that wasn't merged in this pass.

## Print styles

`assets/styles/print.css` (loaded via `<link ... media="print">` in `meta-common.html`, so it never
affects screen rendering) hides navigation/PWA chrome and interactive-only controls, flattens colors
to black-on-white, expands external link URLs, and prevents cards/tables from breaking across pages.
Applies site-wide; most relevant to `guia-premium.html`, which references a downloadable PDF guide —
the on-site page itself should also print cleanly. Reuses the same component classes
(`.card`, `.info-box`, `table`, ...) so new components generally don't need print-specific rules.

## Dark mode

Dark mode is toggled via `body.dark-mode` (see `src/ui/ux.js`). `style.css`'s `:root` defines a
`body.dark-mode { --color-bg, --color-surface, --color-border, --color-text, --color-text-strong,
--color-text-muted, --color-sand-* }` override block right after the base tokens. **Any component
built from those semantic/sand tokens re-themes for dark mode automatically — no per-component
`.dark-mode` override needed.** This is why the new reusable page patterns above, the table/form
styles, and `.card`/`.hero`/`.dados-faro-section`/`.info-item`/`.filtro-checkbox` all support dark
mode with zero dedicated dark-mode CSS.

Some older components (search bar, favorites list, notifications, header/footer gradients, the
dark-mode toggle button itself) still have hand-tuned `body.dark-mode .selector { ... }` overrides in
`ux.css`/`alerts.css`/`pwa-install-modal.css`. These are intentionally left as-is — they're more
specific than the token-driven base rules so they keep working unchanged, and their values were
tuned individually rather than being safe to blanket-replace. When touching one of those components,
prefer converting it to token-driven styling (removing the manual override once you've verified the
token-driven result matches) over adding a new manual override.

## Future enhancements (not done in this pass)

- **`hoteis.html` / `restaurantes.html` card markup unification**: these two pages are near-identical
  templates with parallel `.hotel-*`/`.restaurante-*` class names for the same card structure. The
  shared search/filter panel was extracted (see above), but merging the card styling itself would
  require renaming classes in the HTML markup — riskier, since `src/data/hoteis.js` /
  `src/data/restaurantes.js` may reference those class names when rendering cards. Do this as a
  dedicated pass that checks the JS first.
- **Further component extraction**: `.emergency-item` (idosos.html vs saude.html) and `.contact-box`
  on `idosos.html` were deliberately left page-local because their visual weight is intentionally
  different (larger/bolder treatment for senior readability) — don't force these into the shared
  classes without a design decision on whether that differentiation should remain.
- **FAQ accordions, comparison tables, step-by-step guides** that still exist as bespoke per-page CSS
  in 2–3 pages each and weren't part of this pass's audit.
