/**
 * RUSH / CYBERTYPE — design tokens.
 * Two-tier architecture (primitives -> semantic), adapted from the STRATA
 * design kit (strata-kit/tokens.ts) with the amber accent renamed `signal`
 * to avoid colliding with Tailwind's `accent-*` / shadcn's `--color-accent`,
 * plus typing-specific slots (char states, heatmap ramp).
 *
 * Mirrors src/design/tokens.css. Use these hex constants where a component
 * needs a raw value in JS (Recharts `stroke`/`fill`, canvas, inline style) —
 * everything else should use the Tailwind utilities / CSS variables instead.
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
    slate600: "#4A5568",
    slate700: "#2E3947",
    slate400: "#76869C",
    slate200: "#CFD8E3",
    amber500: "#F5A623",
    amber950: "#3A2B12",
    amber800: "#7A4E12",
    teal400: "#2DD4BF",
    emerald400: "#34D399",
    rose500: "#F43F5E",
  },
  font: {
    data: "'JetBrains Mono', ui-monospace, 'SF Mono', monospace",
    body: "'Geist Variable', Inter, system-ui, -apple-system, sans-serif",
  },
  radius: { sm: 6, md: 10, lg: 14, full: 9999 },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 },
  duration: { fast: 200, stamp: 260 },
} as const;

// ---------------------------------------------------------------------------
// Tier 2 — Semantic. Named by intent; components never touch a raw hex.
// ---------------------------------------------------------------------------
export const tokens = {
  color: {
    background: {
      ink: primitives.color.slate950,
      panel: primitives.color.slate900,
      panelRaised: primitives.color.slate850,
    },
    border: {
      line: primitives.color.slate800,
      signal: primitives.color.amber500,
    },
    text: {
      primary: primitives.color.slate200,
      muted: primitives.color.slate400,
      onSignal: primitives.color.slate950,
    },
    signal: {
      active: primitives.color.amber500, // the ONE "active" colour
      soft: primitives.color.amber950,
    },
    status: {
      danger: primitives.color.rose500, // errors, sudden death
      success: primitives.color.emerald400, // new-best / healthy only
      info: primitives.color.teal400, // charts, consistency
    },
    char: {
      correct: primitives.color.amber500,
      wrong: primitives.color.rose500,
      untyped: primitives.color.slate600,
      upcoming: primitives.color.slate700,
      active: primitives.color.slate200,
    },
    // Error-density ramp for the keyboard heatmap, idle -> worst.
    heat: [
      primitives.color.slate800,
      primitives.color.amber950,
      primitives.color.amber800,
      primitives.color.amber500,
    ] as readonly [string, string, string, string],
  },
  font: {
    data: primitives.font.data, // WPM, accuracy, timers, counts, codes
    body: primitives.font.body,
  },
  space: primitives.space,
  radius: primitives.radius,
  motion: {
    fast: `${primitives.duration.fast}ms cubic-bezier(0.2, 0, 0, 1)`,
    stamp: `${primitives.duration.stamp}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
  },
} as const;

/** Pick a heat-ramp color for an error count, capping at the top tier. */
export function heatColor(count: number, max = 9): string {
  const ramp = tokens.color.heat;
  if (count <= 0) return ramp[0];
  const idx = Math.min(ramp.length - 1, Math.ceil((count / max) * (ramp.length - 1)));
  return ramp[idx];
}

/** Translucent variant of a token hex, for glows/overlays that need alpha. */
export function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type Tokens = typeof tokens;
export type Primitives = typeof primitives;
