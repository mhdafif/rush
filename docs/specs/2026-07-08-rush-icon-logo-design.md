---
title: RUSH Icon & Logo Design
doc_type: Design Spec
version: 1.0
date: 2026-07-08
---

# RUSH Icon & Logo Design

## Context

The app's favicon was still the unmodified Vite starter icon (a purple
abstract "flash" mark) — visually disconnected from RUSH's actual identity
(near-black ink background, amber `#F5A623` signal colour, JetBrains Mono,
and the glowing blinking caret that is already the app's signature visual).
The header also has no icon at all, just the plain-text "RUSH" wordmark.

Three concepts were sketched and compared at real favicon sizes (32px/16px)
and mocked into the actual header pill (see the design-comparison artifact
from the brainstorming session). **Concept A — "Rushing Caret" — was chosen.**

## Decision

**Rushing Caret**: the app's own blinking caret (a vertical amber bar), with
a trailing streak of three shrinking, fading horizontal marks to its left —
literally the caret mid-sprint. This reuses the one visual RUSH already made
distinctive (the amber glow caret) instead of inventing an unrelated symbol.

Rejected alternatives:
- **Forward chevron** (a bold `>`) — reads too close to a generic
  play/next-track glyph; not specific enough to RUSH.
- **Ascending bars** (WPM meter) — a fine "speed/stats" mark, but has less to
  do with the actual act of typing than the caret does.

## Mark specification

Two renderings of the same geometry, scaled to their context:

**1. Favicon / app-icon tile** — `public/favicon.svg`, 40×40 viewBox:
- Background: rounded square, `rx="9"`, fill `#0B0F14` (ink), 1px stroke
  `#232C3A` (line) — the same panel treatment as every card in the app.
- Mark: amber `#F5A623`, with a soft `drop-shadow(0 0 5px rgba(245,166,35,.55))`
  glow (mirrors `.text-glow` in `src/index.css`).
  - Caret bar: `x=22 y=8 w=4 h=24 rx=2`.
  - Trail rects (left of the bar, decreasing length + opacity 0.9 → 0.55 → 0.3):
    `x=14 y=18.2 w=5 h=3.6 rx=1.8`, `x=8 w=4`, `x=4 w=2.4` (same `y`/`h`/`rx`).

**2. Header mark** — bare mark only (no tile/background), same proportions
re-expressed on a 24×24 viewBox to match the existing icon components in
`src/components/icons/` (`IconCaret`, `IconConfig`, etc. all use a 24×24
viewBox). Rendered with `fill="currentColor"` so it inherits the `text-signal`
colour already applied to the wordmark — no hardcoded hex in the component.

## Deliverables

| File | Change |
|---|---|
| `public/favicon.svg` | Replaced with the ink-tile + caret mark (deletes the leftover Vite default). |
| `src/components/icons/RushMark.tsx` | New — the bare mark, `fill="currentColor"`, default `18×18`, following the sibling icon components' conventions. |
| `src/components/icons/index.ts` | Add the `RushMark` export. |
| `src/components/Header/index.tsx` | Render `<RushMark />` before the "RUSH" text span, both wrapped so they read as one lockup; icon inherits the same `text-signal` colour the text already uses. |
| `index.html` | Add `<meta name="theme-color" content="#0B0F14">` (mobile browser chrome tint) — small, on-brand, no other changes needed since the favicon link already points at `/favicon.svg`. |

## Out of scope

- No README/social-preview logo — scope was explicitly favicon + header only
  (per the earlier scoping question).
- No PNG/ICO/apple-touch-icon raster fallback. This machine has no SVG
  rasterizer available (`rsvg-convert`/`imagemagick`/etc. not installed), and
  all evergreen browsers support SVG favicons directly (the project already
  ships one this way). If raster fallbacks are wanted later (e.g. for iOS
  home-screen bookmarks), that's a small follow-up once a rasterizer is
  available.
- No rename of `public/icons.svg` (the unrelated leftover social-icon sprite
  sheet) — untouched, unused, out of scope for this change.

## Verification

- Visual: run the dev server, confirm the browser tab shows the new favicon
  and the header shows the mark + "RUSH" as one lockup, colour matching.
- `pnpm validate` (lint/type-check/prettier) and `pnpm build` both pass.
- No new hardcoded hex introduced in `Header/index.tsx` — the mark's colour
  comes from `currentColor` + the existing `text-signal` utility.
