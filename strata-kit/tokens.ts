/**
 * STRATA — Field Research Console
 * TypeScript mirror of tokens.css. Two-tier: primitives -> semantic.
 *
 * Prefer the CSS custom properties (tokens.css) as the runtime source of
 * truth so re-theming is a one-file edit. Use this object where you need
 * token values in JS/TS — chart libraries, canvas, style objects, tests.
 * The `cssVar` helpers return `var(--strata-*)` strings so JS-styled elements
 * still track the CSS-variable theme instead of freezing a hex at build time.
 */

// ---------------------------------------------------------------------------
// Tier 1 — Primitives. Raw values, no intent.
// ---------------------------------------------------------------------------
export const primitives = {
  color: {
    slate950: "#0B0F14",
    slate900: "#121822",
    slate850: "#1A2230",
    slate800: "#232C3A",
    slate400: "#76869C",
    slate200: "#CFD8E3",
    amber500: "#F5A623",
    amber950: "#3A2B12",
    teal400: "#2DD4BF",
    emerald400: "#34D399",
    rose500: "#F43F5E",
    paper100: "#ECE4D3",
  },
  font: {
    display: "'Fraunces', Georgia, serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, 'SF Mono', monospace",
  },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 },
  radius: { sm: 6, md: 10, lg: 14, full: 9999 },
  duration: { fast: 200, stamp: 260 },
} as const;

// ---------------------------------------------------------------------------
// Tier 2 — Semantic. Named by intent; components never touch a raw hex.
// ---------------------------------------------------------------------------
export const tokens = {
  color: {
    background: {
      base: primitives.color.slate950,
      panel: primitives.color.slate900,
      panelHover: primitives.color.slate850,
    },
    border: {
      default: primitives.color.slate800,
      active: primitives.color.amber500,
    },
    text: {
      primary: primitives.color.slate200,
      muted: primitives.color.slate400,
      onAccent: primitives.color.slate950,
    },
    accent: {
      base: primitives.color.amber500, // the ONE "active" colour
      soft: primitives.color.amber950,
    },
    status: {
      idle: primitives.color.slate800,
      inProgress: primitives.color.amber500,
      complete: primitives.color.emerald400, // reserved: one meaning only
      streak: primitives.color.rose500,
      info: primitives.color.teal400,
    },
    reward: {
      lockedBg: primitives.color.slate850,
      lockedBorder: primitives.color.slate800,
      unlockedBg: primitives.color.amber950,
      unlockedBorder: primitives.color.amber500,
    },
    paper: primitives.color.paper100,
  },
  font: {
    display: primitives.font.display,
    body: primitives.font.body,
    data: primitives.font.mono, // anything that is a number/code/status
  },
  space: primitives.space,
  radius: primitives.radius,
  motion: {
    fast: `${primitives.duration.fast}ms cubic-bezier(0.2, 0, 0, 1)`,
    stamp: `${primitives.duration.stamp}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
  },
} as const;

// ---------------------------------------------------------------------------
// CSS-variable accessors. Use these in JS-styled elements so they follow the
// tokens.css theme instead of baking a value in. e.g. cssVar.status("complete")
// ---------------------------------------------------------------------------
export const cssVar = {
  bg: "var(--strata-bg)",
  panel: "var(--strata-panel)",
  panelHover: "var(--strata-panel-hover)",
  line: "var(--strata-line)",
  text: "var(--strata-text)",
  textMuted: "var(--strata-text-muted)",
  accent: "var(--strata-accent)",
  status: (kind: "idle" | "inProgress" | "complete" | "streak" | "info") =>
    ({
      idle: "var(--strata-status-idle)",
      inProgress: "var(--strata-status-progress)",
      complete: "var(--strata-status-complete)",
      streak: "var(--strata-status-streak)",
      info: "var(--strata-status-info)",
    })[kind],
} as const;

// ---------------------------------------------------------------------------
// Domain vocabulary — part of the design-system contract, not app logic.
// ---------------------------------------------------------------------------
export type StatusKind = "not-started" | "in-progress" | "complete";

export type Tokens = typeof tokens;
export type Primitives = typeof primitives;
