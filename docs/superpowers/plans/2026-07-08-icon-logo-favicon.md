# RUSH Icon & Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the "Rushing Caret" mark (approved in `docs/specs/2026-07-08-rush-icon-logo-design.md`) as the browser favicon and as an icon+wordmark lockup in the app header.

**Architecture:** Pure SVG, no build tooling changes. One new icon component follows the existing `src/components/icons/*` pattern (`fill="currentColor"`, 24×24 viewBox) so it drops into the header and inherits the same `text-signal` color the "RUSH" text already uses. The favicon is a standalone static SVG file (ink tile + mark) replacing the current Vite-default `public/favicon.svg`.

**Tech Stack:** React 19 + TypeScript, Tailwind v4 utility classes, no new dependencies.

## Global Constraints

- Mark geometry, colors, and layer order are exact — see `docs/specs/2026-07-08-rush-icon-logo-design.md` §3 (Mark spec). Do not freehand new coordinates.
- The header component must not introduce a hardcoded hex for the mark's color — it must inherit `currentColor` from the wrapping `text-signal` class, matching how the "RUSH" text is already colored.
- No PNG/ICO/apple-touch-icon generation (no rasterizer available on this machine) — SVG-only, per spec §5 (Out of scope).
- `public/icons.svg` (the unrelated social-icon sprite sheet) stays untouched.

---

### Task 1: Favicon, header icon component, and header wiring

**Files:**
- Modify: `public/favicon.svg` (full replace)
- Create: `src/components/icons/RushMark.tsx`
- Modify: `src/components/icons/index.ts`
- Modify: `src/components/Header/index.tsx`
- Modify: `index.html`

**Interfaces:**
- Produces: `RushMark` — a zero-prop React component (`export function RushMark()`), same call signature as its siblings (`IconCaret()`, `IconConfig()`, etc. all take no props). Renders one `<svg>` with `fill="currentColor"` shapes; consumers set color via a wrapping `className` (e.g. `text-signal`), never via a prop.

This is one task because the three pieces (favicon file, icon component, header JSX) share the same geometry and can only be visually verified together — there's no meaningful intermediate state to gate on.

- [ ] **Step 1: Replace the favicon**

Write `public/favicon.svg` (full file, replacing the existing Vite-default content):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <rect x="1" y="1" width="38" height="38" rx="9" fill="#0B0F14" stroke="#232C3A"/>
  <g filter="url(#rush-glow)">
    <rect x="22" y="8" width="4" height="24" rx="2" fill="#F5A623"/>
    <rect x="14" y="18.2" width="5" height="3.6" rx="1.8" fill="#F5A623" opacity="0.9"/>
    <rect x="8" y="18.2" width="4" height="3.6" rx="1.8" fill="#F5A623" opacity="0.55"/>
    <rect x="4" y="18.2" width="2.4" height="3.6" rx="1.8" fill="#F5A623" opacity="0.3"/>
  </g>
  <defs>
    <filter id="rush-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#F5A623" flood-opacity="0.55"/>
    </filter>
  </defs>
</svg>
```

- [ ] **Step 2: Create the header icon component**

Write `src/components/icons/RushMark.tsx` (new file):

```tsx
export function RushMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="13.2" y="4.8" width="2.4" height="14.4" rx="1.2" />
      <rect x="8.4" y="10.9" width="3" height="2.2" rx="1.1" opacity="0.9" />
      <rect x="4.8" y="10.9" width="2.4" height="2.2" rx="1.1" opacity="0.55" />
      <rect x="2.4" y="10.9" width="1.4" height="2.2" rx="1.1" opacity="0.3" />
    </svg>
  );
}
```

This mirrors `src/components/icons/IconCaret.tsx`'s structure (no props, hardcoded size, one `<svg>` return) — the only difference is `fill="currentColor"` instead of `stroke="currentColor"`, since this mark is drawn as solid shapes, not outlines.

- [ ] **Step 3: Export it from the icons barrel**

Modify `src/components/icons/index.ts` — add one line, alphabetically ordered with its siblings:

```ts
export { IconCaret } from "./IconCaret";
export { IconConfig } from "./IconConfig";
export { IconInfo } from "./IconInfo";
export { IconLang } from "./IconLang";
export { IconSoundOff } from "./IconSoundOff";
export { IconSoundOn } from "./IconSoundOn";
export { RushMark } from "./RushMark";
```

- [ ] **Step 4: Wire it into the header**

In `src/components/Header/index.tsx`, the current brand span reads:

```tsx
          <span className="text-signal mr-2 px-1 font-mono text-xs font-bold tracking-tight sm:mr-2 sm:text-sm">
            RUSH
          </span>
```

(Exact current classes may differ slightly after the responsive-header pass earlier in this session — find the `<span>` that renders the literal text `RUSH` and wraps it in `text-signal`.)

Replace it with an icon+wordmark lockup — wrap both in a flex container carrying the existing color/spacing classes, and drop the bare text into its own inner span:

```tsx
          <span className="text-signal mr-2 flex items-center gap-1 px-1 font-mono text-xs font-bold tracking-tight sm:mr-2 sm:text-sm">
            <RushMark />
            RUSH
          </span>
```

Add the import at the top of the file, alongside the other icon imports:

```tsx
import { IconCaret, IconConfig, IconSoundOff, IconSoundOn, RushMark } from "../icons";
```

- [ ] **Step 5: Add the theme-color meta tag**

In `index.html`, add one line after the existing favicon `<link>`:

```html
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="theme-color" content="#0B0F14" />
```

- [ ] **Step 6: Verify visually**

Run: `rtk pnpm dev`

Open the printed local URL in a browser and confirm:
- The browser tab shows the ink tile with the amber caret + trail (not the old purple Vite icon) — hard-refresh (Cmd+Shift+R) if the browser cached the old favicon.
- The header pill shows the mark immediately to the left of "RUSH", same amber color, vertically centered with the text.

Stop the dev server when done (`Ctrl+C`, or `lsof -ti :5181 | xargs kill` if it was backgrounded).

- [ ] **Step 7: Run the validation suite**

Run: `rtk pnpm validate`
Expected: prettier, eslint, and `tsc` all pass with no errors (this project has no per-component unit tests for icons — `TypingArena.test.tsx` is unaffected by this change).

Run: `rtk pnpm build`
Expected: build succeeds; note the emitted `dist/assets/*.svg`/favicon reference is unaffected since `public/favicon.svg` is copied as a static asset by Vite.

- [ ] **Step 8: Commit**

```bash
git add public/favicon.svg src/components/icons/RushMark.tsx src/components/icons/index.ts src/components/Header/index.tsx index.html
git commit -m "feat: add RUSH icon mark as favicon and header lockup"
```

(This stages only the icon/logo change — the other uncommitted work from earlier in the session, if any remains, is intentionally left for the user to commit separately.)
