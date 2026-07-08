/**
 * STRATA — Tailwind preset (v3).
 * Maps utilities onto the CSS variables in tokens.css, so `bg-panel`,
 * `text-muted`, `border-line`, `font-data`, `rounded-md`, etc. all resolve
 * to `var(--strata-*)`. Re-theming stays a one-file edit in tokens.css —
 * Tailwind classes never freeze a hex.
 *
 * Usage (tailwind.config.js):
 *   import strata from "./strata-kit/tailwind.preset.js";
 *   export default { presets: [strata], content: [...] };
 *
 * Then import tokens.css once (e.g. in your root stylesheet) so the variables
 * exist at runtime.
 *
 * Tailwind v4 users: skip this file — see README.md for the `@theme` block.
 */
const v = (name) => `var(--strata-${name})`;

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        // grounds
        ink: v("bg"),
        panel: v("panel"),
        "panel-hover": v("panel-hover"),
        line: v("line"),
        // text
        "text-primary": v("text"),
        "text-muted": v("text-muted"),
        "text-on-accent": v("text-on-accent"),
        // the one accent
        accent: v("accent"),
        "accent-soft": v("accent-soft"),
        // semantic status (kept distinct from the accent hue)
        "status-idle": v("status-idle"),
        "status-progress": v("status-progress"),
        "status-complete": v("status-complete"),
        "status-streak": v("status-streak"),
        "status-info": v("status-info"),
        paper: v("paper"),
      },
      fontFamily: {
        display: [v("font-display")],
        body: [v("font-body")],
        data: [v("font-data")], // numbers, code, status — never prose
      },
      letterSpacing: {
        data: v("tracking-data"),
      },
      spacing: {
        xs: v("space-xs"),
        sm: v("space-sm"),
        md: v("space-md"),
        lg: v("space-lg"),
        xl: v("space-xl"),
      },
      borderRadius: {
        sm: v("radius-sm"),
        md: v("radius-md"),
        lg: v("radius-lg"),
        full: v("radius-full"),
      },
      transitionTimingFunction: {
        strata: "cubic-bezier(0.2, 0, 0, 1)",
        stamp: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        fast: "200ms",
        stamp: "260ms",
      },
      keyframes: {
        "strata-stamp": {
          "0%": { transform: "scale(0.85)", opacity: "0.4" },
          "60%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        // the one signature motion — a checked objective landing like a stamp
        stamp: "strata-stamp 260ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
};
