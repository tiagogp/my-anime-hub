# DESIGN.md

## Visual Design System — Dithered Pixel / Editorial

### Catalog density override

The catalog uses 1 column on phones, 2 from 640px, 3 from 768px,
4 from 1024px, and 5 from 1280px. This explicit product preference
supersedes the two-column gallery limits below. Recommendations with four
items remain four columns on desktop. Preserve the existing typography,
colors, and page width; use smaller gaps to keep covers readable.

A design system for a dark, contemplative interface that fuses **low-resolution dithered pixel art** with **classic editorial typography**. This document is the single source of truth for reproducing the aesthetic consistently across pages and components. It is written to be implementable directly by a developer or an AI coding agent.

---

## 1. Design philosophy

This system is not a UI kit — it is an atmosphere. Every decision should be evaluated against one question: *does this feel handcrafted, quiet, and slightly strange, or does it feel like software?* If it feels like software, it's wrong.

**Target emotional qualities:**

- **Contemplative** — space to breathe; nothing competes for attention at once.
- **Mysterious** — meaning is implied through abstraction, not spelled out.
- **Poetic** — text reads like captions in a poetry book, not marketing copy.
- **Retro-futuristic** — old computational textures (pixels, grids, dithering) applied to a modern, refined layout.
- **Intimate** — small scale, close reading distance, low volume.
- **Artistic** — every screen is treated as a composed piece, not a "view."
- **Restrained** — one accent, one focal point, one gesture at a time.
- **Slightly melancholic** — muted tones, negative space, imperfection over polish.
- **Handcrafted despite being digital** — visible grid, visible pixels, visible construction — nothing frictionless or "auto-generated" looking.

**Explicitly avoid:**

- Looking like a SaaS dashboard (cards with shadows, blue primary buttons, KPI tiles).
- Looking like a modern corporate landing page (big gradient hero, rounded pill buttons, stock illustration).
- Looking like a generic portfolio template (centered hero + 3-column features + testimonials).

If a layout choice could be mistaken for a Stripe/Linear/Notion clone, reject it and pull back toward gallery/print/poster references instead.

---

## 2. Color system

### Base palette (foundation for all UI)

| Token | Value | Usage |
|---|---|---|
| Background black | `#0D0D0D` | Page background |
| Elevated black | `#151515` | Cards, panels, raised surfaces |
| Grid outline | `#252525` | Borders, dividers, pixel grid lines |
| Warm white | `#F1EEE7` | Primary text, headings |
| Muted text | `#A8A5A0` | Secondary/supporting text |

The base palette is almost entirely achromatic. Color is a privilege earned only inside artwork or small interactive moments — never spent on chrome.

### Accent palettes (for pixel illustrations & small indicators only)

#### Cool palette
- Deep teal — `#1B3A3A`
- Muted cyan — `#5FA8A0`
- Desaturated blue — `#3D5A73`
- Burgundy — `#5C2A3A`
- Dusty rose — `#B98080`
- Warm white — `#F1EEE7`

#### Warm palette
- Amber — `#C98A3E`
- Golden yellow — `#E0B454`
- Burnt orange — `#B8542E`
- Muted red — `#9E3B33`
- Dark crimson — `#5C1F22`
- Warm white — `#F1EEE7`

### Rules for accent color usage

- Accent colors live **inside pixel artwork**, in **small status indicators** (dots, tags), in **hover/selected states**, and nowhere else.
- Never use an accent color for large surfaces, backgrounds, gradients, or primary buttons.
- No gradients as a design element. If a tonal transition is needed, use **ordered dithering** (see §3), not a CSS gradient.
- One accent family (cool *or* warm) should dominate per page/section — mixing both freely reads as noisy and undermines the restrained mood.
- Saturation stays muted/dusty even within accents — nothing neon, nothing pure/primary.

---

## 3. Dithered pixel-art system

Pixel artwork is the emotional core of the system — it carries the "art" while typography carries the "editorial." Treat every artwork as a small, deliberate composition, not decoration.

### Construction rules

- Build every illustration on a **visible square grid** — the grid is a feature, not a wireframe to hide.
- Use only **whole square cells**; never partial-cell shapes or diagonal antialiasing.
- Keep **pixel size consistent** within a single artwork (e.g., all cells 8×8, 12×12, or 16×16 — never mixed).
- Compose at **low native resolution** (think 16×16 to 48×32 source grids) and scale up — never draw at high-res and downsample.
- Scale using **nearest-neighbor** rendering only (`image-rendering: pixelated`) — never smoothed/bicubic scaling.
- **Never** anti-alias edges.
- **Never** use smooth vector curves for the subject itself (curves may exist structurally in layout, never in the pixel art).
- **Never** blur pixel edges (no box-shadow/blur filters over pixel art).
- Avoid realistic/detailed rendering — subjects stay abstract and symbolic.
- Use **color clustering** (flat blocks of 3–6 tones) instead of gradients to imply form.
- Simulate tonal transitions with **ordered dithering** — prefer **Bayer matrix** patterns (2×2, 4×4, or 8×8 thresholds) over noise/Floyd–Steinberg for a more mechanical, retro-computing feel.
- Leave **empty grid cells visible** around the subject — negative space inside the frame is as important as the subject.
- Favor **asymmetry**: off-center subjects, uneven margins within the grid, subjects that bleed toward one edge.
- Scatter a few **isolated single pixels** away from the main mass to suggest motion, atmosphere, sparks, dust, or stars.

### Suggested subject vocabulary

Keep subjects reduced to silhouette-level abstraction — legible in under 2 seconds, ambiguous on longer looking:

- Two figures briefly meeting (a moment, not a scene)
- Flame / candle
- Star field / single star
- An eye
- A flower, single stem
- Distant mountain line
- Crescent or full moon
- A portal / doorway of light
- A lone silhouette, walking or still
- Abstract emotional marks (a crack, a spiral, a wave, a held hand)

Each artwork should read as a **single idea**, not an illustrated scene with multiple competing focal points.

---

## 4. Grid construction

A reusable pixel-art frame that all artwork components share.

**Frame rules:**

- Rectangular canvas, typically `4:3`, `1:1`, or `16:10` — pick one ratio per artwork family and stay consistent.
- 20–32 columns of square cells (rows follow from aspect ratio × cell size).
- Cells are perfectly square; gaps between cells are small and consistent (1–3px at display size).
- Inactive/background cells remain **visible** (rendered in `--color-grid` or the surface tone), never fully transparent/invisible — the grid itself should read even where there's no subject.
- The subject occupies roughly **50–75%** of the total grid area; the remainder is deliberate dark space.
- Generous dark margin surrounds the composition on at least two sides.
- The grid must stay legible (cells still readable as squares) from mobile widths up to large desktop — never let it scale down into a blurry mush.

### CSS approach

```css
.pixel-canvas {
  display: grid;
  grid-template-columns: repeat(var(--grid-cols, 28), 1fr);
  gap: var(--pixel-gap);
  aspect-ratio: 4 / 3;
  background: var(--color-grid);
  width: 100%;
  max-width: var(--artwork-max-width, 480px);
}

.pixel-cell {
  aspect-ratio: 1 / 1;
  background: var(--color-surface);
}

.pixel-canvas img,
.pixel-canvas canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges; /* fallback for browsers without pixelated support */
  width: 100%;
  height: 100%;
}
```

If artwork is authored as a raster image rather than DOM cells, it must still be produced at native low resolution and displayed with `image-rendering: pixelated` — never let the browser smooth-scale it.

---

## 5. Typography

Two categories only. Never introduce a third typeface family.

### Display typography (editorial serif)

Used for: page titles, artwork titles, section headers, pull quotes.

**Qualities:** elegant, literary, dramatic, slightly narrow, strong vertical strokes, high contrast between thick/thin strokes.

**Font stack (pick one primary):**
```css
--font-display: "Fraunces", "Cormorant Garamond", "Playfair Display", "Bodoni Moda", "Instrument Serif", serif;
```

**Scale & usage:**

| Role | Size (desktop) | Size (mobile) | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|
| Hero / page title | `4rem`–`5.5rem` | `2.25rem`–`2.75rem` | 400–500 | 1.05 | `-0.01em` |
| Section title | `2.5rem` | `1.75rem` | 400 | 1.1 | `-0.01em` |
| Artwork/card title | `1.75rem`–`2rem` | `1.375rem` | 400 | 1.15 | normal |
| Pull quote | `1.5rem`–`2rem` italic | `1.25rem` italic | 400 italic | 1.3 | normal |

Display type is **never bold beyond 500 weight** — drama comes from scale and stroke contrast, not boldness. Avoid all-caps in display serif; let the letterforms be the ornament.

### Interface typography (neutral sans/mono)

Used for: navigation, descriptions, metadata, labels, buttons, captions, timestamps, category tags.

**Qualities:** small, clean, understated, highly legible, slightly technical.

**Font stack (pick one primary sans + optionally one mono for metadata):**
```css
--font-interface: "IBM Plex Sans", "Inter", "Geist", sans-serif;
--font-mono: "IBM Plex Mono", "Space Mono", monospace;
```

**Scale & usage:**

| Role | Size | Weight | Line height | Letter spacing | Case |
|---|---|---|---|---|---|
| Body / description | `0.9375rem`–`1rem` | 400 | 1.6 | normal | sentence case |
| Navigation link | `0.8125rem` | 400–500 | 1.4 | `0.02em` | sentence case |
| Category / metadata label | `0.6875rem`–`0.75rem` | 500 | 1.4 | `0.08em`–`0.12em` | UPPERCASE |
| Button label | `0.75rem`–`0.8125rem` | 500 | 1.2 | `0.04em` | UPPERCASE or sentence |
| Timestamp / fine print | `0.6875rem` | 400 | 1.4 | `0.02em` | sentence case, mono optional |

**Responsive behavior:** interface text never scales below `0.6875rem` (11px) even on mobile — legibility over aesthetic shrinkage. Display type may scale down aggressively (up to ~45% of desktop size) since it's decorative-structural, but should never wrap awkwardly; prefer `clamp()`:

```css
.editorial-heading {
  font-size: clamp(2rem, 6vw, 5rem);
}
```

---

## 6. Layout system

The layout borrows from an art gallery catalog or a stack of printed cards laid on a dark table — not from an app shell.

**Rules:**

- Full-page dark background (`--color-bg`), edge to edge.
- Content constrained to a restrained max width (`--max-width-content: 960px`–`1080px`), centered.
- Artwork pieces displayed in **1 column** (mobile/tablet) or **2 columns** (desktop) — never 3+ across; density kills the gallery feeling.
- Each piece: large artwork area on top, text section beneath.
- Strong vertical rhythm — sections separated by large spacing (`--space-16` / `--space-24`), not boxes.
- Separators, when used, are **thin single hairlines** in `--color-grid`, full or partial width — never a heavy rule.
- No nested containers/boxes-within-boxes. One level of surface at most.
- Mobile collapses to a single column with the same vertical rhythm, just tighter spacing values.

**Each artwork card contains, top to bottom:**

1. Pixel-art grid (dominant, top)
2. Large serif title
3. Short descriptive text (1–3 sentences, narrow measure)
4. Optional metadata/category label (small caps, muted, sits above title or beside it)

```css
.gallery-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-16);
  max-width: var(--max-width-content);
  margin-inline: auto;
  padding-inline: var(--space-6);
}

@media (min-width: 900px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-12) var(--space-8);
  }
}
```

---

## 7. Card design

Cards present, they do not contain. Think exhibition label next to a framed piece — not a dashboard widget.

**Styling rules:**

- Background at or near page black (`--color-bg` or `--color-surface`) — cards should nearly disappear into the page.
- No drop shadows, ever.
- No border-radius, or a very minimal one (`0`–`2px`) — hard edges match the pixel aesthetic.
- Optional `1px solid var(--color-grid)` border — thin, quiet, easy to omit entirely if spacing alone provides separation.
- Generous internal padding (`--space-8` to `--space-12`).
- Artwork is always the visual anchor; text is secondary in size but not in care.
- Text alignment is consistent across all cards (pick left-aligned as default; center only for a single hero piece).
- Title sits with clear air between it and the artwork above (`--space-6` minimum).
- Description column width capped (`max-width: 42ch`–`52ch`) for comfortable reading regardless of card width.
- Adjacent cards may alternate between `--color-bg` and `--color-surface` for the faintest rhythm — the difference must stay subtle enough to require a second look.

---

## 8. Interaction design

Interaction is a whisper, not a performance.

**Include:**

- Hover: slight brightness increase (`filter: brightness(1.08)`) on artwork or card surface.
- Hover: small pixel highlights — e.g., one or two cells in the grid shift to an accent tone.
- Subtle grid-cell animation on hover/focus (a cell fades in/out, not moves).
- Title underline (thin, `1px`) or color shift from `--color-text` to `--color-text-muted`/accent on hover.
- Card translation on hover limited to `2px`–`4px` vertical, nothing more.
- Transitions between `180ms` and `350ms`, `ease` or `ease-out` — never spring/bounce easing.
- Visible keyboard focus states (outline or offset border in warm white or accent, never `outline: none` without replacement).
- Full `prefers-reduced-motion` support — disable translations and pixel animations, keep only instant or opacity-only state changes.

**Avoid:**

- Spring/bounce animations
- Large scale transforms (`scale(1.1)`+)
- Glossy/gradient buttons
- Neon glow / box-shadow bloom
- Heavy parallax scrolling
- Smooth morphing shapes
- Custom cursor effects, trailing cursors, magnetic buttons

```css
:root {
  --transition-fast: 180ms ease;
  --transition-base: 280ms ease;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: opacity var(--transition-fast) !important;
  }
}
```

**Optional pixel animations:** a small sequence of cells (3–8) may cycle opacity or tone on a slow loop (2s–6s) to suggest flickering fire, twinkling stars, a breathing light, or drifting dust. Keep amplitude low (opacity 0.6–1.0) and timing irregular/staggered rather than synchronized, so it reads as organic rather than mechanical blinking.

---

## 9. Buttons and controls

Buttons read as small technical/editorial controls — closer to a museum wall-label toggle than an app CTA.

**Rules:**

- Compact dimensions (`padding: 0.5rem 1rem`–`0.625rem 1.25rem`), never full-width unless mobile-forced.
- Square corners, or `1px`–`2px` radius max.
- Label set in interface font (sans or mono), uppercase with letter-spacing, or clean sentence case — pick one convention per app.
- Text color: warm white (`--color-text`) on default state.
- Background: transparent or `--color-surface`.
- Border: `1px solid var(--color-grid)` (or warm-white border for a primary action).
- Small pixel icon (constructed per §10) may precede the label when helpful — never a smooth SVG icon glyph.

**Hover state:** invert foreground/background (dark text on warm-white fill), or activate a small dithered pattern behind the label. Transition at `--transition-fast`.

```css
.pixel-button {
  font-family: var(--font-interface);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-grid);
  border-radius: 0;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.pixel-button:hover,
.pixel-button:focus-visible {
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
}

.pixel-button:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 2px;
}
```

---

## 10. Image and icon rules

- Icons are constructed the same way as artwork: pixel grid, hard edges, no anti-aliasing.
- Prefer **1-bit** (two-tone) or very limited palette (2–3 tones) icons.
- Simple geometric silhouettes only — a star, a flame, an arrow, a moon, a dot grid — nothing with fine detail that will blur at small sizes.
- Maintain consistent visual weight (stroke/fill density) across the whole icon set — no mixing a heavy filled icon next to a thin outline one.
- Do not drop in a standard icon library (Lucide, Feather, Font Awesome, etc.) as-is — its smooth, anti-aliased vector style breaks the system. If a modern icon library must be used for functional/accessibility reasons (e.g., a form input), restyle it to hard edges and monochrome, or confine it to purely utilitarian contexts users won't associate with the artwork.

---

## 11. Responsive behavior

| Breakpoint | Range | Columns | Notes |
|---|---|---|---|
| Large desktop | `≥1440px` | 2 | Max content width caps growth; extra space stays as page margin, not stretched content |
| Laptop | `1024–1439px` | 2 | Standard gallery layout |
| Tablet | `640–1023px` | 1–2 | Prefer 1 column below ~800px for comfortable artwork size |
| Mobile | `<640px` | 1 | Full single-column stack |

**Pixel grid scaling:** the grid must scale via container width, not raster upscaling of a fixed-size image where avoidable — use `aspect-ratio` + `%`-based cell sizing so cells stay perfectly square and crisp at every breakpoint. If raster artwork is used, size it in exact multiples of the source pixel grid where possible to avoid uneven cell scaling artifacts.

**On mobile:**

- Single-column layout, full width minus page padding.
- Artwork reduced in max-width but never in aspect ratio or cell-squareness.
- Vertical spacing between sections stays generous (reduce by ~25–35% from desktop, not more).
- Serif titles remain legible — don't drop below `1.375rem` for card titles.
- Descriptions stay at or above `0.875rem` — never shrink body copy purely to fit.

---

## 12. Accessibility

- Text contrast: warm white (`#F1EEE7`) on background black (`#0D0D0D`) exceeds WCAG AAA; muted text (`#A8A5A0`) on black meets AA for normal text — verify any new color pairing against at least AA.
- All interactive elements have visible `:focus-visible` states (never suppressed without replacement).
- Use semantic HTML: `<nav>`, `<main>`, `<article>` per artwork card, `<h1>`–`<h3>` in real hierarchy (don't skip levels for style reasons).
- Respect `prefers-reduced-motion` everywhere animation is used (see §8).
- Decorative pixel artwork gets `alt=""` / `aria-hidden="true"` when purely atmospheric; artwork that conveys meaning gets a real, descriptive `alt` text.
- Never rely on color alone to convey state (e.g., pair an accent-colored status dot with a text label).
- Interactive artwork (clickable pixel canvases, animated pieces) gets an accessible name via `aria-label` and is reachable via keyboard (`tabindex="0"` + key handlers if not a native control).
- Minimum readable body size stays at `0.875rem`/14px equivalent or larger; metadata/labels may go to `0.6875rem`/11px but only for non-essential supporting text.

---

## 13. Design tokens

```css
:root {
  /* Colors — base */
  --color-bg: #0d0d0d;
  --color-surface: #151515;
  --color-grid: #252525;
  --color-text: #f1eee7;
  --color-text-muted: #a8a5a0;

  /* Colors — cool accent */
  --accent-cool-teal: #1b3a3a;
  --accent-cool-cyan: #5fa8a0;
  --accent-cool-blue: #3d5a73;
  --accent-cool-burgundy: #5c2a3a;
  --accent-cool-rose: #b98080;

  /* Colors — warm accent */
  --accent-warm-amber: #c98a3e;
  --accent-warm-gold: #e0b454;
  --accent-warm-orange: #b8542e;
  --accent-warm-red: #9e3b33;
  --accent-warm-crimson: #5c1f22;

  /* Typography */
  --font-display: "Fraunces", "Cormorant Garamond", "Playfair Display", serif;
  --font-interface: "IBM Plex Sans", "Inter", sans-serif;
  --font-mono: "IBM Plex Mono", "Space Mono", monospace;

  --text-hero: clamp(2.25rem, 6vw, 5.5rem);
  --text-section: clamp(1.75rem, 4vw, 2.5rem);
  --text-card-title: clamp(1.375rem, 2.5vw, 2rem);
  --text-body: 1rem;
  --text-nav: 0.8125rem;
  --text-label: 0.75rem;
  --text-fine: 0.6875rem;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* Pixel grid */
  --pixel-size: 12px;
  --pixel-gap: 3px;
  --grid-cols: 28;

  /* Layout */
  --max-width-content: 1080px;
  --artwork-max-width: 480px;
  --card-padding: var(--space-8);

  /* Borders */
  --border-hairline: 1px solid var(--color-grid);

  /* Motion */
  --transition-fast: 180ms ease;
  --transition-base: 280ms ease;
  --transition-slow: 350ms ease;
}
```

---

## 14. Component examples

### `ArtworkCard`
- **Purpose:** the atomic gallery unit — one piece of art plus its editorial caption.
- **Anatomy:** `PixelCanvas` → `space-6` gap → `CategoryLabel` (optional) → `EditorialHeading` (card-title scale) → `space-3` → `ArtworkDescription`.
- **Visual rules:** no shadow, no/minimal radius, optional hairline border, background `--color-bg` or `--color-surface`.
- **Spacing:** `--card-padding` internal padding if bordered/surfaced; artwork may bleed to card edge while text respects padding.
- **Typography:** title in `--font-display`; label/description in `--font-interface`.
- **Interaction:** hover raises artwork brightness slightly and shifts title color toward accent or muted; `2px` translateY max.
- **Mobile:** full width, artwork first, unchanged internal order.

### `PixelCanvas`
- **Purpose:** container/renderer for a single pixel-art composition.
- **Anatomy:** CSS grid of `PixelCell`s, or a `<canvas>`/`<img>` rendered pixelated at a fixed aspect ratio.
- **Visual rules:** square aspect (`1/1`, `4/3`, or `16/10`), `image-rendering: pixelated`, background `--color-grid` showing through empty cells.
- **Spacing:** `--pixel-gap` between cells.
- **Interaction:** hosts optional cell-flicker animation; hover may trigger 1–2 cells to shift to accent tone.
- **Mobile:** scales via container width; never rasterized below native pixel resolution.

### `PixelCell`
- **Purpose:** single addressable unit of pixel artwork.
- **Anatomy:** a square `div` or grid cell with a flat background color.
- **Visual rules:** solid fill only, no gradient, no radius, no shadow; color from base or accent palette.
- **Interaction:** may animate `opacity` or `background-color` only (never size/position) for flicker effects.

### `GalleryGrid`
- **Purpose:** layout wrapper arranging `ArtworkCard`s.
- **Anatomy:** CSS grid, 1 column mobile → 2 columns desktop, capped at `--max-width-content`, centered.
- **Spacing:** `--space-16` mobile gap, `--space-12`/`--space-8` (row/col) desktop.
- **Mobile:** single column, same component order.

### `EditorialHeading`
- **Purpose:** any serif display heading (hero, section, card title).
- **Anatomy:** semantic heading tag (`h1`–`h3`) styled with `--font-display`.
- **Visual rules:** weight 400–500 only, tight line-height, `clamp()`-based responsive size, no uppercase.
- **Interaction:** may underline or shift color on hover when the heading is itself a link.

### `ArtworkDescription`
- **Purpose:** short supporting prose beneath a title.
- **Anatomy:** `<p>` in `--font-interface`, `--text-body`, max-width `42–52ch`.
- **Visual rules:** color `--color-text-muted`, line-height `1.6`.
- **Mobile:** unchanged font size; width becomes fluid to container.

### `CategoryLabel`
- **Purpose:** small metadata/category tag above or beside a title.
- **Anatomy:** `<span>` or `<p class="label">`, uppercase, letter-spaced.
- **Visual rules:** `--text-label` size, `--color-text-muted` or an accent tone, optional leading pixel-dot glyph.
- **Spacing:** sits `--space-2`–`--space-3` above the title it labels.

### `PixelButton`
- **Purpose:** primary interactive control (see §9 for full spec).
- **Anatomy:** `<button>`, optional leading pixel icon, uppercase or sentence-case label.
- **Interaction:** invert-on-hover/focus, `--transition-fast`.
- **Mobile:** same size; avoid full-width unless it's the sole action in a stacked mobile flow.

### `Navigation`
- **Purpose:** top-level wayfinding.
- **Anatomy:** logo/mark (small pixel glyph or serif wordmark) + interface-font nav links, minimal, left/right split or centered.
- **Visual rules:** transparent or `--color-bg` background, hairline bottom border optional, no shadow.
- **Interaction:** links underline or shift to warm white on hover; active link marked with a small pixel dot rather than a bold/color block.
- **Mobile:** collapses to a minimal hamburger or single-row scrollable list — avoid heavy slide-in drawers with shadow/blur; keep the mobile menu itself dark and flat.

### `Footer`
- **Purpose:** closing element, quiet by design.
- **Anatomy:** thin hairline top border, small interface-font links/metadata, optional tiny pixel motif.
- **Visual rules:** matches `--color-text-muted` for most text; generous top padding (`--space-16`+).
- **Mobile:** stacks vertically, left-aligned, same spacing scale reduced by ~25%.

---

## 15. Do and do not rules

### Do
- Use visible pixel grids as a structural, celebrated element.
- Use limited, muted palettes — base palette dominant, accents rare.
- Maintain large dark negative space around every composition.
- Pair serif titles with quiet, small sans-serif descriptions.
- Keep layouts restrained: 1–2 columns, generous spacing, minimal chrome.
- Use ordered/Bayer dithering for any implied shading or tonal transition.
- Use abstraction rather than detailed, realistic illustration.
- Prioritize atmosphere and composition over information density.

### Do not
- Use smooth gradients as a primary visual treatment.
- Apply anti-aliasing to pixel artwork.
- Add glassmorphism (blur, translucency, frosted panels).
- Use excessive rounded corners on cards or buttons.
- Add large drop shadows or elevation effects.
- Use bright neon or saturated color outside of small artwork/accent moments.
- Create generic SaaS components (stat tiles, gradient hero banners, pill badges, blue primary buttons).
- Use highly saturated colors in UI chrome.
- Add unnecessary decorative elements (icon soup, badge clutter, stray emoji).
- Mix inconsistent pixel sizes within or across related artworks.
- Stretch, blur, or bicubic-scale pixel artwork at any breakpoint.

---

## 16. Final implementation checklist

Before considering any page "done," verify:

- [ ] Background uses `--color-bg`/`--color-surface`, no unintended pure black/white or off-palette grays.
- [ ] All pixel artwork uses `image-rendering: pixelated` (or DOM-cell grid) and shows no blur/anti-aliasing at any zoom level.
- [ ] Every pixel-art grid has consistent, square cell sizing throughout.
- [ ] Empty/inactive grid cells remain visible, not transparent.
- [ ] Accent colors appear only in artwork, indicators, or interactive states — never as large fills.
- [ ] Display headings use the serif `--font-display`; all other text uses `--font-interface`/`--font-mono`.
- [ ] No heading skips a semantic level; page has exactly one `<h1>`.
- [ ] Layout is 1 column on mobile, max 2 columns on desktop — never 3+.
- [ ] Cards have no drop shadow, no/minimal border-radius, at most a 1px hairline border.
- [ ] Description text width is capped for readability (~42–52ch).
- [ ] Hover states are subtle: brightness/color shift, ≤4px translation, `180–350ms` transitions.
- [ ] No spring easing, no scale-up hover effects >1.02, no glow/neon shadows.
- [ ] `:focus-visible` is styled and visible on every interactive element.
- [ ] `prefers-reduced-motion` disables translation/animation, keeping only safe opacity transitions.
- [ ] Color contrast checked for any new text/background pairing (AA minimum).
- [ ] Decorative artwork has `alt=""`/`aria-hidden`; meaningful artwork has descriptive `alt`/`aria-label`.
- [ ] Spacing follows the token scale (`--space-*`) — no arbitrary one-off pixel values.
- [ ] Page does not visually resemble a SaaS dashboard, corporate landing page, or generic portfolio template on first glance.
