---
version: 1.0.0
name: STRATA — Field Research Console
description: A visual framework for self-directed learning trackers. Blends analog lab-notebook rigor with mission-control telemetry.
colors:
  ink: "#0B0F14"
  panel: "#121822"
  panel-soft: "#1A2230"
  line: "#232C3A"
  text-primary: "#CFD8E3"
  text-muted: "#76869C"
  amber: "#F5A623"
  amber-soft: "#3A2B12"
  teal: "#2DD4BF"
  emerald: "#34D399"
  rose: "#F43F5E"
  paper: "#ECE4D3"
typography:
  display:
    family: "Fraunces, serif"
    weight: "600"
    usage: "Section titles, rank/level callouts only — used with restraint"
  body:
    family: "Inter, sans-serif"
    weight: "400-600"
  data:
    family: "IBM Plex Mono, monospace"
    weight: "400-600"
    letterSpacing: "0.02em"
    usage: "Stats, XP values, timestamps, sequence numbers, status codes"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  full: "999px"
components:
  card:
    bg: "panel"
    border: "1px solid line"
  row:
    hoverBg: "panel-soft"
  statusDot:
    notStarted: "line"
    inProgress: "amber"
    complete: "emerald"
  badgePatch:
    locked: { bg: "panel-soft", border: "line", opacity: 0.5 }
    unlocked: { bg: "amber-soft", border: "amber", opacity: 1 }
  progressBar:
    track: "line"
    fill: "amber"
  searchInput:
    bg: "panel"
    caret: "amber"
motion:
  duration-fast: "200ms"
  duration-stamp: "260ms"
  ease: "ease-out"
---

## Overview

STRATA treats a learning plan like a field expedition: topics are missions, subtopics are logged objectives, and progress is read off instruments, not a progress bar borrowed from a SaaS dashboard. The visual language sits at the intersection of two real artifacts — a researcher's field notebook (sequence, annotation, handwritten rigor) and a control-room console (status lights, telemetry, terminal input). Nothing here is decorative; every mark answers "what state is this in, and what do I do next."

## Colors

A near-black instrument panel, not a marketing dark-mode. `ink` (#0B0F14) is the base; `panel` and `panel-soft` are two steps up for cards and hover states — close enough together that hierarchy reads from elevation, not contrast jumps.

- **Amber** (#F5A623) — the single warm signal: in-progress states, XP, the active rank. Borrowed from analog instrument needles and CRT amber-phosphor displays, not the brand-blue-on-white default.
- **Teal** (#2DD4BF) — secondary signal for "cleared" counts and informational telemetry.
- **Emerald** (#34D399) — reserved exclusively for "complete." It should mean one thing only.
- **Rose** (#F43F5E) — streak/urgency signal.
- **Paper** (#ECE4D3) — used sparingly, only where a "field note" annotation needs to feel like a physical card pinned to the console.

## Typography

- **Fraunces** carries the only personality in the system — section titles and rank callouts. It appears rarely enough to stay a signature, not wallpaper.
- **Inter** is the neutral workhorse for every sentence a person reads.
- **IBM Plex Mono** is the instrument face: anything that is a _number, code, or status_ is mono. This is a hard rule, not a style preference — it's how the eye tells "data" apart from "prose" at a glance.

## Spacing

4/8/16/24/40px scale. Tighter than a marketing site on purpose — this is a working console someone scans daily, not a page someone reads once.

## Layout

Single-column instrument stack on mobile; the same stack stays single-column on desktop too; rather than gaining a multi-column dashboard, the system is correct because the content is genuinely sequential (search → telemetry → mission list → patches), not because of viewport constraints.

## Elevation & Depth

No shadows, no glassmorphism. Depth comes from one flat step in background luminance (`ink → panel → panel-soft`) plus 1px hairlines (`line`). A console doesn't float its panels — they're flush-mounted.

## Shapes

10px radius as the default — soft enough to be touchable, not soft enough to feel like a consumer app. Status dots and badge patches are the only circular/rounded-full elements; everything else is rectangular, like a panel cut to spec.

## Components

- **Telemetry stat block** — label in muted mono caps, value in colored mono digits. Four per row: progress, topics cleared, streak, XP.
- **Mission row** (topic) — status dot + title + `done/total` count + chevron. Collapsible.
- **Objective row** (subtopic) — two-digit sequence number, status icon, title, XP value. Sequence numbers are used here deliberately: within a topic, objectives _do_ have a real learning order. Topics themselves are not numbered, because studying them in a fixed global order is not actually true.
- **Achievement patch** (reward) — locked at 50% opacity with a neutral border; unlocking swaps the border to amber and fills the card — the same visual move used for "in progress → complete," so the reward language stays consistent with the checklist language instead of introducing a new metaphor.
- **Rank strip** — current rank name + XP, mono, top-right of the header. Rank names should track a real progression (e.g. Recruit → Operator → Specialist → Senior → Principal → Architect) so leveling up means something outside the app.

## Motion

- **Stamp-in** (260ms) — when an objective is checked, the complete icon scales in from 0.85 with a slight overshoot, like a rubber stamp landing. This is the one signature motion in the system; everything else (hover, expand/collapse, progress fill) is a plain 200ms ease-out.
- **Reduced motion** — all of the above collapses to instant state changes. A status console must stay legible with motion off; it is not allowed to depend on animation to communicate state.

## Do's and Don'ts

- **Do** treat amber as the only "active" color — never use it for two different meanings on the same screen.
- **Do** keep mono reserved for data. The instant body text starts using mono, the hierarchy collapses.
- **Don't** add a global numbering scheme to topics — only number what is genuinely sequential.
- **Don't** reach for glassmorphism, gradients, or drop shadows to add depth — use the luminance scale instead.

## Accessibility

- Status must never be color-only: pair every status dot/icon with text (`done/total`, a label, or both).
- All interactive rows are real `<button>` elements, not `div onClick` — keyboard and screen-reader navigation come for free.
- Focus rings stay visible at all times; this is a console, not a brochure — operators need to see where they are.
- Respect `prefers-reduced-motion` exactly as described above.
