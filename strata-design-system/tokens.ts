/**
 * STRATA — Field Research Console
 * Two-tier token architecture: primitives (raw values) -> semantic (intent-based aliases).
 * Mirrors the structure used in the HUD/tactical design system tokens.ts.
 */

// ---------------------------------------------------------------------------
// Tier 1 — Primitives. No intent, no usage context, just raw values.
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
    body: "'Inter', system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 },
  radius: { sm: 6, md: 10, lg: 14, full: 9999 },
  duration: { fast: 200, stamp: 260 },
} as const;

// ---------------------------------------------------------------------------
// Tier 2 — Semantic. Named by intent so component code never references a
// hex value or raw px number directly. Re-theming = edit this file only.
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
    status: {
      notStarted: primitives.color.slate800,
      inProgress: primitives.color.amber500,
      complete: primitives.color.emerald400,
      streak: primitives.color.rose500,
      info: primitives.color.teal400,
    },
    reward: {
      lockedBg: primitives.color.slate850,
      lockedBorder: primitives.color.slate800,
      unlockedBg: primitives.color.amber950,
      unlockedBorder: primitives.color.amber500,
    },
  },
  font: {
    display: primitives.font.display,
    body: primitives.font.body,
    data: primitives.font.mono,
  },
  space: primitives.space,
  radius: primitives.radius,
  motion: {
    fast: `${primitives.duration.fast}ms ease-out`,
    stamp: `${primitives.duration.stamp}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
  },
} as const;

// ---------------------------------------------------------------------------
// Domain types — kept alongside tokens since status/rank vocabulary is part
// of the design system's contract, not just app-level business logic.
// ---------------------------------------------------------------------------
export type StatusKind = "not-started" | "in-progress" | "complete";

export interface Subtopic {
  id: string;
  title: string;
  xp: number;
}

export interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
}

export interface Rank {
  name: string;
  min: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  check: (statusMap: Record<string, StatusKind>, streak: number) => boolean;
}

export type Tokens = typeof tokens;
export type Primitives = typeof primitives;
