# STRATA — Field Research Console · design kit

A portable, reusable design system. Drop this `strata-kit/` folder into any
project and you have the tokens, Tailwind wiring, spec, and component recipes to
build in the STRATA visual language.

**What it is:** a dark "instrument console" system for tools people scan and
operate daily. Near-black grounds, one amber signal colour, mono-for-data,
depth-from-luminance (no shadows), one signature "stamp" motion.

## Files

| File                 | What it's for                                                                        |
| -------------------- | ------------------------------------------------------------------------------------ |
| `tokens.css`         | **Source of truth.** All CSS custom properties (primitives → semantic).              |
| `tokens.ts`          | TS mirror + `cssVar()` helpers for JS-styled elements / charts / canvas.             |
| `tailwind.preset.js` | Tailwind **v3** preset mapping utilities → the CSS vars.                             |
| `design-system.md`   | The portable spec — the three laws, colour/type/layout, do & don't. Read this first. |
| `components.md`      | Copy-paste HTML + Tailwind recipes for every component.                              |
| `README.md`          | This file.                                                                           |

## Install (Tailwind v3)

1. Copy `strata-kit/` into your project (anywhere; `src/design/` is a good home).
2. Import the variables **once**, globally:
   ```css
   /* app.css / globals.css — before Tailwind's layers is fine */
   @import "./strata-kit/tokens.css";
   ```
3. Register the preset:

   ```js
   // tailwind.config.js
   import strata from "./strata-kit/tailwind.preset.js";

   export default {
     presets: [strata],
     content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
   };
   ```

4. Load the fonts (CSP-permitting) — Fraunces 600, Inter 400/500/600,
   IBM Plex Mono 400/600:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link
     rel="stylesheet"
     href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap"
   />
   ```
   Self-hosting instead? Point `@font-face` at your files and keep the family
   names identical to the ones in `tokens.css`.
5. Set the shell class on your root: `class="min-h-full bg-ink text-text-primary font-body"`.
6. Build from `components.md`.

## Install (Tailwind v4)

v4 configures theme in CSS, so skip the preset and import `tokens.css`, then map
the vars in an `@theme` block:

```css
@import "tailwindcss";
@import "./strata-kit/tokens.css";

@theme {
  --color-ink: var(--strata-bg);
  --color-panel: var(--strata-panel);
  --color-panel-hover: var(--strata-panel-hover);
  --color-line: var(--strata-line);
  --color-text-primary: var(--strata-text);
  --color-text-muted: var(--strata-text-muted);
  --color-accent: var(--strata-accent);
  --color-accent-soft: var(--strata-accent-soft);
  --color-status-complete: var(--strata-status-complete);
  --color-status-streak: var(--strata-status-streak);
  --color-status-info: var(--strata-status-info);
  --font-display: var(--strata-font-display);
  --font-body: var(--strata-font-body);
  --font-data: var(--strata-font-data);
}
```

## Install (no Tailwind)

Import `tokens.css` and write plain CSS against the variables — every recipe in
`components.md` names the variable it maps to. Example:

```css
.card {
  background: var(--strata-panel);
  border: 1px solid var(--strata-line);
  border-radius: var(--strata-radius-md);
}
```

## Re-theming

Edit **`tokens.css` only.** Everything — Tailwind classes, TS tokens via
`cssVar`, plain CSS — resolves through those variables, so changing
`--s-amber-500` (or swapping which primitive `--strata-accent` points at)
re-skins the whole system. Keep the _structure_ (three grounds, one accent,
mono-for-data) and you can re-hue it for a new brand without touching a
component.

## Using it with Claude on your next project

Two ways to hand STRATA to a fresh Claude session:

1. **Drop the folder in and point at it.** Add this to the new project's
   `CLAUDE.md`:

   ```md
   ## Design system

   This project uses the STRATA design kit in `strata-kit/`.

   - Read `strata-kit/design-system.md` before building any UI — follow the
     "three laws" (amber = the only active colour; mono = data only; depth =
     luminance, never shadow).
   - Use the Tailwind classes from `strata-kit/tailwind.preset.js`
     (`bg-panel`, `text-muted`, `border-line`, `font-data`, `rounded-md`, …) —
     never hardcode a hex.
   - Copy component structures from `strata-kit/components.md`.
   ```

2. **Paste the spec.** `design-system.md` is self-contained — pasting it into a
   chat is enough for Claude to build in-language even without the files.

## The three laws (never break these)

1. **Amber is the only "active" colour** — one meaning per screen.
2. **Mono is reserved for data** — numbers/code/status only; prose never.
3. **Depth is luminance, not shadow** — `ink → panel → panel-hover` + 1px
   hairlines. No shadows, gradients, or glassmorphism.

Full rationale, colour table, type scale, and accessibility rules live in
`design-system.md`.
