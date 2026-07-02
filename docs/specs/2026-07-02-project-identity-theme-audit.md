# Project Identity and Theme Audit

**Doc type:** Project Analysis  
**Version:** 1.0  
**Date:** 2026-07-02  
**Scope:** Active React typing trainer plus the `strata-design-system` study tracker prototype.

## 1. Executive Summary

This repository is primarily a React + Vite typing test application with a dark HUD/cyber-console visual identity. The app already contains a functional typing engine, test modes, pause behavior, results analytics, local history, sound feedback, and keyboard heatmap diagnostics.

The `strata-design-system` folder is not wired into the active app. It is a separate learning-progress tracker concept called STRATA, documented as a field research console for self-directed learning. STRATA has a stronger design-system vocabulary than the current app: primitives, semantic aliases, domain types, status language, achievements, ranks, and a full component prototype.

The next design opportunity is to decide whether the product should stay a pure typing-speed trainer or evolve into a broader training console that tracks skills, practice missions, and learning progression. If it stays typing-only, the STRATA system can still contribute better token architecture. If it grows into a training platform, STRATA can become the identity layer for missions and progression.

## 2. What This Project Is

This project is a focused typing-performance trainer. It helps users practice speed and accuracy, then gives immediate feedback through metrics and diagnostics.

| Area | Current behavior |
|---|---|
| Main experience | Type generated words or quotes in a central arena. |
| Test modes | `time`, `words`, `punct`, `nums`, `quotes`. |
| Languages | English and Indonesian word generation. |
| Feedback | Live WPM, accuracy, remaining/elapsed time, result screen. |
| Diagnostics | WPM chart, key error heatmap, recent history, personal best. |
| Challenge mode | Sudden death ends a run on first word error. |
| Persistence | Zustand persist stores settings, history, and best score. |

The current package name is still `rush`, while older docs and storage keys use `CYBERTYPE`. The app identity visible in the UI is cyber/HUD oriented rather than generic Monkeytype clone.

## 3. Current Architecture

The app has one top-level view switch instead of routing. `App.tsx` renders either the typing arena or results screen based on `useTypingStore().view`.

```text
src/
  App.tsx                         active shell: header, main view, footer, drawers
  useApp.tsx                      orchestration layer for engine, timer, settings, results
  hooks/
    useTypingEngine.ts            word states, input handling, WPM history, sudden death
    useTimer.ts                   countdown/count-up timer
    usePunctuation.ts             word generation options
    useSound.ts                   click/error/complete sounds
  store/
    settings/                     persisted user settings, best score, recent history
    typing/                       transient typing session and view state
  components/
    TypingArena.tsx               hidden input, word display, live stats, pause overlay
    ResultsScreen.tsx             final metrics, chart, heatmap, history, actions
    ConfigDrawer.tsx              mode, duration, language, caret, sudden death settings
    StatsDrawer.tsx               stats/history access
    KeyboardHeatmap.tsx           live and result keyboard diagnostics
  utils/
    generateWords.ts              language word generation
    quotes.ts                     quote mode data
    calcStats.ts                  WPM, raw WPM, accuracy, consistency
```

## 4. Runtime Flow

```text
idle -> first typeable key -> running -> test end -> results
running -> mouse move or window blur -> paused -> click/key resume -> running
running -> error with sudden death enabled -> finished terminated -> results
```

Key state responsibilities:

| Layer | Owns |
|---|---|
| `useTypingEngine` | Current word index, current input, locked word states, key errors, WPM snapshots. |
| `useTimer` | Time mode countdown, word/quote mode elapsed time. |
| `useApp` | Cross-hook orchestration, reset/new test behavior, result saving. |
| `settingsStore` | User settings, history, best result. |
| `typingStore` | Current screen, pause state, current words, live WPM/accuracy/time display. |

## 5. Existing Visual Identity

The active app is named and styled like `CYBERTYPE`: black/zinc background, orange terminal accents, mono typography, radial HUD grid, glow on important metrics, and panelized result cards.

| Token direction | Current implementation |
|---|---|
| Background | `zinc-950` plus radial orange dot grid. |
| Accent | Tailwind orange `#f97316` / `#ea580c`. |
| Type | JetBrains Mono for data-heavy UI, Inter/Geist for body. |
| Shape | Rounded panels and drawer surfaces. |
| Motion | Blinking caret, hover transitions, blur during pause. |

The current theme is effective for a speed-test HUD, but the token system is split between Tailwind classes, `@theme` variables in `src/index.css`, shadcn OKLCH defaults, and hard-coded utility colors in components.

## 6. STRATA Design-System Read

The STRATA files describe a second product direction: a learning tracker for senior frontend development. It frames learning as field research: topics are missions, subtopics are objectives, XP creates rank progression, achievements become field commendations.

Files reviewed:

| File | Role |
|---|---|
| `strata-design-system/tokens.ts` | Two-tier token architecture with primitives and semantic aliases. |
| `strata-design-system/design-system.md` | Full design rationale, component vocabulary, accessibility rules. |
| `strata-design-system/StudyTracker.jsx` | Functional React prototype for tracking curriculum progress. |

STRATA's strongest idea is not the exact amber palette. Its strongest idea is the semantic token contract. Component code should ask for `color.status.complete`, `color.background.panel`, or `color.reward.unlockedBorder`, not raw hex values or generic orange classes.

## 7. Token Problems To Fix

The current project has usable colors but weak centralization.

| Problem | Impact |
|---|---|
| Theme values live in multiple places | Re-theming requires editing component classes and CSS variables. |
| Tailwind color names leak intent | `orange-500` says hue, not purpose. |
| shadcn OKLCH defaults remain generic | UI component tokens do not fully match the cyber/HUD app identity. |
| STRATA tokens are isolated | The best token architecture is not used by active app components. |
| Product identities conflict | `rush`, `monkeytype`, `CYBERTYPE`, and `STRATA` all exist at once. |

## 8. Recommended Token Relayout

Use STRATA's two-tier pattern, but adapt it to the active typing app. Keep raw colors in primitives, route all UI usage through semantic tokens, then expose CSS variables for Tailwind and shadcn.

```ts
export const primitives = {
  color: {
    void950: "#09090B",
    zinc925: "#101014",
    zinc875: "#18181B",
    zinc800: "#27272A",
    zinc500: "#71717A",
    zinc300: "#D4D4D8",
    signal500: "#F97316",
    signal600: "#EA580C",
    danger500: "#EF4444",
    dataBlue400: "#60A5FA",
    success400: "#4ADE80"
  },
  font: {
    body: "'Geist Variable', Inter, system-ui, sans-serif",
    data: "'JetBrains Mono', ui-monospace, monospace"
  },
  radius: { sm: 6, md: 10, lg: 14, xl: 18 },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 }
} as const;

export const tokens = {
  color: {
    surface: {
      app: primitives.color.void950,
      panel: primitives.color.zinc925,
      panelRaised: primitives.color.zinc875,
      line: primitives.color.zinc800
    },
    text: {
      primary: primitives.color.zinc300,
      muted: primitives.color.zinc500,
      onSignal: "#FFFFFF"
    },
    signal: {
      active: primitives.color.signal500,
      activeStrong: primitives.color.signal600,
      correct: primitives.color.signal500,
      error: primitives.color.danger500,
      chart: primitives.color.dataBlue400,
      success: primitives.color.success400
    },
    mode: {
      time: primitives.color.signal500,
      words: primitives.color.dataBlue400,
      quotes: primitives.color.success400,
      suddenDeath: primitives.color.danger500
    }
  }
} as const;
```

Recommended implementation sequence:

| Step | Change |
|---|---|
| 1 | Add `src/design/tokens.ts` with primitives and semantic tokens. |
| 2 | Add `src/design/theme.css` that maps semantic tokens to CSS variables. |
| 3 | Update `src/index.css` `@theme` values to read from CSS variables. |
| 4 | Replace repeated `text-orange-*`, `border-zinc-*`, and `bg-zinc-*` classes in key components with semantic utilities or CSS variables. |
| 5 | Keep `strata-design-system` as reference or migrate it into `docs/specs` if it remains conceptual. |

## 9. Color Theme Direction

Recommended direction: keep the dark console, but make orange less generic by calling it `signal`, not `brand`. Add a cooler diagnostic layer so analytics are not all orange.

Proposed palette:

| Name | Hex | Usage |
|---|---|---|
| `void` | `#09090B` | App background. |
| `panel` | `#101014` | Main cards and drawer body. |
| `panel-raised` | `#18181B` | Interactive rows and stat cards. |
| `line` | `#27272A` | Borders, dividers, keyboard outlines. |
| `signal` | `#F97316` | Caret, active mode, WPM hero, focus ring. |
| `diagnostic` | `#60A5FA` | Consistency, charts, non-critical analytics. |
| `success` | `#4ADE80` | New best, complete/healthy signals only. |
| `danger` | `#EF4444` | Errors and sudden death. |

This keeps the current CYBERTYPE mood but improves meaning. Orange stays the user-action signal. Blue owns charts/diagnostics. Green is reserved for success. Red is reserved for failure.

## 10. Naming Suggestions

The name should reflect whether this remains a typing trainer or becomes a larger learning/training console.

Recommended name: **Keystation**

Why: It keeps the console/workstation feel, directly references keyboard practice, and is broader than typing speed. It can grow into missions, diagnostics, and skill progression without sounding like a clone.

Other options:

| Name | Fit |
|---|---|
| `Keystation` | Best all-around name for a typing and training console. |
| `Typefield` | Good if STRATA's field-research metaphor becomes central. |
| `Glyphrun` | More game-like; good for streaks, ranks, and challenges. |
| `Signaltype` | Strong fit for HUD/telemetry visual language. |
| `StrataType` | Best if merging STRATA learning progression with typing practice. |
| `CYBERTYPE` | Keep only if the product stays intentionally cyberpunk and typing-only. |

Recommendation: rename package/app identity from `rush` to `keystation` or `cybertype` soon. The longer multiple names coexist, the harder docs, storage keys, and design tokens are to reason about.

## 11. Next Decisions

Before relayout implementation, decide one product direction.

| Direction | Meaning |
|---|---|
| Typing trainer | Keep CYBERTYPE-like UI, apply better semantic tokens, ignore STRATA app logic for now. |
| Training console | Merge typing practice with STRATA-style missions, ranks, XP, and achievements. |
| Study tracker | Treat STRATA as the product and keep typing trainer as a separate experiment. |

My recommendation is `Training console`: keep the fast typing test as the core loop, then use STRATA concepts for progression, achievements, and learning paths. That makes the project more differentiated than a Monkeytype-style clone.
