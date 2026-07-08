---
name: STRATA — Field Research Console
version: 1.1.0
kind: design-system
stack: CSS custom properties (source of truth) + Tailwind preset
files:
  - tokens.css # single source of truth — the CSS variables
  - tokens.ts # TS mirror + cssVar() helpers for JS-styled elements
  - tailwind.preset.js # v3 preset mapping utilities to the CSS vars
  - components.md # copy-paste HTML + Tailwind recipes
  - README.md # install into a new project
---

# STRATA — Field Research Console

> A visual framework for tools people **scan and operate daily**, not pages they
> read once. Blends analog lab-notebook rigor (sequence, annotation) with
> mission-control telemetry (status lights, instruments, terminal input).
> Nothing is decorative; every mark answers **"what state is this in, and what
> do I do next?"**

This file is the portable, framework-agnostic contract. When applying STRATA to
a new project, read this first, then `components.md` for the concrete recipes.

## The three laws

These are what make it STRATA and not a generic dark theme. Break one and the
system stops reading as itself:

1. **Amber is the only "active" colour.** `--strata-accent` (#F5A623) means
   _in-progress / focused / the one thing that matters right now_ — and it means
   that on every screen. Never spend it on two meanings at once.
2. **Mono is reserved for data.** Any number, code, timestamp, or status uses
   `--strata-font-data`. Prose never does. This is how the eye separates "data"
   from "language" at a glance. The instant body text goes mono, the hierarchy
   collapses.
3. **Depth is luminance, not shadow.** `ink → panel → panel-hover` is one flat
   step up in background lightness, plus a 1px `line` hairline. No shadows, no
   glassmorphism, no gradients. A console flush-mounts its panels.

## Colour

A near-black **instrument panel**, not a marketing dark-mode. The three grounds
sit close together so hierarchy reads from elevation, not contrast jumps.

| Token                      | Hex       | Role                                             |
| -------------------------- | --------- | ------------------------------------------------ |
| `--strata-bg`              | `#0B0F14` | ink — the base surface                           |
| `--strata-panel`           | `#121822` | cards, one step up                               |
| `--strata-panel-hover`     | `#1A2230` | hover / soft fill                                |
| `--strata-line`            | `#232C3A` | 1px hairlines, idle status                       |
| `--strata-text`            | `#CFD8E3` | primary text                                     |
| `--strata-text-muted`      | `#76869C` | labels, secondary                                |
| `--strata-accent`          | `#F5A623` | **amber — the one active signal**                |
| `--strata-accent-soft`     | `#3A2B12` | amber fill behind active/unlocked surfaces       |
| `--strata-status-complete` | `#34D399` | emerald — **"complete" only, one meaning**       |
| `--strata-status-streak`   | `#F43F5E` | rose — streak / urgency                          |
| `--strata-status-info`     | `#2DD4BF` | teal — informational telemetry, "cleared" counts |
| `--strata-paper`           | `#ECE4D3` | a physical "field note", used sparingly          |

- **Amber** — borrowed from analog instrument needles and CRT amber-phosphor,
  not the brand-blue-on-white default.
- **Emerald** — reserved exclusively for _complete_. If it appears, it means one
  thing.
- **Teal / Rose / Paper** — accents with narrow jobs. Paper especially: only
  where something needs to feel like a physical card pinned to the console.
- **Neutrals are chosen, not defaulted** — the slates carry a faint blue bias so
  they read cool-instrument, not dead grey.

## Typography

Three faces, assigned by role, never by taste:

- **Fraunces** (`--strata-font-display`) — the only personality in the system.
  Section titles and rank/level callouts **only**. It appears rarely enough to
  stay a signature, not wallpaper. Weight 600.
- **Inter** (`--strata-font-body`) — the neutral workhorse for every sentence a
  person reads. Weights 400–600.
- **IBM Plex Mono** (`--strata-font-data`) — the instrument face. Every number,
  code, timestamp, XP value, sequence number, and status code. Weights 400/600,
  `letter-spacing: 0.02em`.

Type scale (px): `11` mono caps labels · `13–14` body · `16` rank line · `24`
stat values · `28` display title. Uppercase + tracked for mono labels; headings
get `text-wrap: balance`.

## Spacing

`4 / 8 / 16 / 24 / 40`. Tighter than a marketing site on purpose — this is a
working console someone scans daily.

## Radius & shape

`10px` (`--strata-radius-md`) is the default — soft enough to touch, not so soft
it reads consumer-app. **Status dots and badge patches are the only fully-round
elements**; everything else is rectangular, like a panel cut to spec.

## Layout

Single-column instrument stack, and it **stays** single-column on desktop —
it does not fan out into a multi-column dashboard. The system is correct because
the content is genuinely sequential (search → telemetry → mission list →
patches), not because of a viewport constraint. Cap the working column around
`720px`.

## Motion

- **Stamp-in** (`--strata-dur-stamp`, 260ms, overshoot easing) — the one
  signature motion. When an objective is checked, its complete-glyph scales in
  from 0.85 with a slight overshoot, like a rubber stamp landing. Use it for
  exactly one moment per product; scattering it kills it.
- Everything else — hover, expand/collapse, progress fill — is a plain
  `200ms` ease.
- **`prefers-reduced-motion`** — all of the above collapses to instant state
  changes. A status console must stay legible with motion off; it may never
  depend on animation to communicate state.

## Components (see components.md for code)

- **Telemetry stat block** — mono caps label + large coloured mono value. Rows
  of four: progress, cleared, streak, XP.
- **Mission row** — status dot + title + `done/total` count + chevron.
  Collapsible.
- **Objective row** — two-digit sequence number, status glyph, title, XP value.
  Sequence numbers appear _only_ where order is genuinely real (objectives
  within a topic have a learning order; topics themselves are **not** numbered,
  because studying them in a fixed global order isn't actually true).
- **Achievement patch** — locked at 50% opacity with a neutral border;
  unlocking swaps the border to amber and fills the card. Same visual move as
  _in-progress → complete_, so reward language stays consistent with checklist
  language instead of inventing a new metaphor.
- **Rank strip** — current rank + XP, mono, top-right of the header. Rank names
  track a real progression (Recruit → Operator → Specialist → Senior →
  Principal → Architect) so leveling up means something outside the app.

## Do / Don't

- **Do** treat amber as the only "active" colour — one meaning per screen.
- **Do** keep mono for data only.
- **Do** pair every status colour with text (a `done/total`, a label) — status
  is never colour-only.
- **Don't** number things that aren't genuinely sequential.
- **Don't** reach for glassmorphism, gradients, or drop shadows for depth — use
  the luminance scale.
- **Don't** let Fraunces creep past titles and rank callouts.

## Accessibility

- Status must never be colour-only: pair every dot/glyph with text.
- Interactive rows are real `<button>`s, not `div onClick` — keyboard + screen
  reader come for free.
- Focus rings stay visible always (`2px solid amber, offset 2px`) — this is a
  console, operators need to see where they are.
- Respect `prefers-reduced-motion` exactly as above.

## Applying STRATA to a non-tracker product

The metaphor generalises: _state + next action, read off instruments_. Map your
domain onto the vocabulary rather than copying the tracker:

- "topics / objectives" → any collapsible parent/child list (files, tickets,
  runs, endpoints).
- "XP / rank" → any accumulating score or tier (usage, reputation, plan level).
- "streak" → any urgency/recency signal.
- "achievement patch" → any unlockable/earned state.

Keep the three laws and the component grammar; swap the nouns.
