import { tokens, withAlpha } from "../design/tokens";

// 4 rows matching MacBook keyboard layout
// Each entry: [primary (typed key), shift-label shown small on top]
const ROWS: [string, string][][] = [
  // Number row
  [
    ["1", "!"],
    ["2", "@"],
    ["3", "#"],
    ["4", "$"],
    ["5", "%"],
    ["6", "^"],
    ["7", "&"],
    ["8", "*"],
    ["9", "("],
    ["0", ")"],
  ],
  // QWERTY row
  [
    ["q", ""],
    ["w", ""],
    ["e", ""],
    ["r", ""],
    ["t", ""],
    ["y", ""],
    ["u", ""],
    ["i", ""],
    ["o", ""],
    ["p", ""],
  ],
  // ASDF row
  [
    ["a", ""],
    ["s", ""],
    ["d", ""],
    ["f", ""],
    ["g", ""],
    ["h", ""],
    ["j", ""],
    ["k", ""],
    ["l", ""],
    [";", ":"],
  ],
  // ZXCV row
  [
    ["z", ""],
    ["x", ""],
    ["c", ""],
    ["v", ""],
    ["b", ""],
    ["n", ""],
    ["m", ""],
    [",", "<"],
    [".", ">"],
    ["/", "?"],
  ],
];

// MacBook-style stagger offsets per row (px)
const ROW_OFFSETS = [0, 14, 21, 28];

function getHeatStyle(count: number): {
  bg: string;
  text: string;
  glow: string;
} {
  const { heat } = tokens.color;
  if (count === 0)
    return { bg: heat[0], text: tokens.color.text.muted, glow: "none" };
  if (count <= 2)
    return { bg: heat[1], text: tokens.color.signal.active, glow: "none" };
  if (count <= 5)
    return {
      bg: heat[2],
      text: tokens.color.signal.active,
      glow: `0 0 6px ${withAlpha(tokens.color.signal.active, 0.4)}`,
    };
  return {
    bg: heat[3],
    text: tokens.color.text.onSignal,
    glow: `0 0 10px ${withAlpha(tokens.color.signal.active, 0.7)}`,
  };
}

function getLiveStyle(tone: "idle" | "active" | "wrong"): {
  bg: string;
  text: string;
  glow: string;
} {
  if (tone === "wrong") {
    return {
      bg: tokens.color.status.danger,
      text: "#ffffff",
      glow: `0 0 10px ${withAlpha(tokens.color.status.danger, 0.45)}`,
    };
  }
  if (tone === "active") {
    return {
      bg: tokens.color.signal.active,
      text: tokens.color.text.onSignal,
      glow: `0 0 10px ${withAlpha(tokens.color.signal.active, 0.55)}`,
    };
  }
  return {
    bg: tokens.color.border.line,
    text: tokens.color.text.muted,
    glow: "none",
  };
}

interface KeyTileProps {
  primary: string;
  shift: string;
  count: number;
  active?: boolean;
  wrong?: boolean;
  compact?: boolean;
  showBadge?: boolean;
}

function KeyTile({
  primary,
  shift,
  count,
  active = false,
  wrong = false,
  compact = false,
  showBadge = true,
}: KeyTileProps) {
  const tone = wrong ? "wrong" : active ? "active" : "idle";
  const { bg, text, glow } = compact ? getLiveStyle(tone) : getHeatStyle(count);
  const label = primary === ";" ? ";" : primary.toUpperCase();
  const keySize = compact ? 28 : 36;
  const shiftSize = compact ? 6 : 7;
  const labelSize = compact ? (shift ? 9 : 10) : shift ? 11 : 12;
  const badgeSize = compact ? 12 : 14;
  const badgeFont = compact ? 7 : 8;

  return (
    <div
      data-active={active ? "true" : "false"}
      data-key={primary}
      data-tone={compact ? tone : "heat"}
      title={
        compact
          ? primary
          : count > 0
            ? `"${primary}" — ${count} error${count !== 1 ? "s" : ""}`
            : primary
      }
      style={{
        width: keySize,
        height: keySize,
        background: bg,
        color: text,
        boxShadow: `inset 0 -2px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04), ${glow}`,
        transition: "background 0.2s, box-shadow 0.2s",
      }}
      className="relative flex flex-shrink-0 cursor-default flex-col items-center justify-center rounded-lg select-none"
    >
      {/* Shift symbol — shown only if non-empty */}
      {shift && (
        <span
          className="font-mono leading-none"
          style={{
            fontSize: shiftSize,
            color: compact
              ? tone !== "idle"
                ? "rgba(255,255,255,0.65)"
                : tokens.color.text.muted
              : count > 0
                ? "rgba(255,255,255,0.5)"
                : tokens.color.border.line,
            marginBottom: 1,
          }}
        >
          {shift}
        </span>
      )}
      {/* Primary key label */}
      <span
        className="font-mono leading-none font-bold"
        style={{ fontSize: labelSize }}
      >
        {label}
      </span>
      {/* Error badge */}
      {showBadge && count > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center rounded-full font-mono leading-none"
          style={{
            width: badgeSize,
            height: badgeSize,
            fontSize: badgeFont,
            background: tokens.color.background.ink,
            color: count >= 6 ? "#fff" : tokens.color.signal.active,
            border: `1px solid ${tokens.color.border.line}`,
          }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  );
}

interface KeyboardHeatmapProps {
  keyErrors?: Record<string, number>;
  activeKeys?: string[];
  wrongKeys?: string[];
  variant?: "results" | "live";
  label?: string;
  classProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function KeyboardHeatmap({
  keyErrors = {},
  activeKeys = [],
  wrongKeys = [],
  variant = "results",
  label,
  classProps,
}: KeyboardHeatmapProps) {
  const compact = variant === "live";
  const rowGap = compact ? "gap-1" : "gap-1.5";
  const wrapperGap = compact ? "gap-1" : "gap-1.5";
  const padding = compact ? "px-4 py-3" : "p-3";
  const offsets = compact ? [0, 10, 16, 22] : ROW_OFFSETS;
  const background = compact
    ? withAlpha(tokens.color.border.line, 0.45)
    : tokens.color.background.panel;
  const activeKeySet = new Set(activeKeys.map((key) => key.toLowerCase()));
  const wrongKeySet = new Set(wrongKeys.map((key) => key.toLowerCase()));

  return (
    <div
      aria-label={label}
      className={`mx-auto inline-flex flex-col ${wrapperGap} border-line/80 rounded-2xl border ${padding} backdrop-blur-sm ${classProps?.className ?? ""}`}
      style={{ background }}
    >
      {ROWS.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={`flex ${rowGap}`}
          style={{ marginLeft: offsets[rowIdx] }}
        >
          {row.map(([primary, shift]) => (
            <KeyTile
              key={primary}
              primary={primary}
              shift={shift}
              count={keyErrors[primary] ?? 0}
              active={activeKeySet.has(primary)}
              wrong={wrongKeySet.has(primary)}
              compact={compact}
              showBadge={variant === "results"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
