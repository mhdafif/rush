import type { VisualMode } from "../../store/settings/ISettingsStore";
import { ConfigDrawer } from "../ConfigDrawer";
import {
  IconCaret,
  IconConfig,
  IconSoundOff,
  IconSoundOn,
  RushMark,
} from "../icons";
import { NavBtn } from "./NavBtn";
import { useHeader } from "./useHeader";

// ─── Mode summary (inline in nav) ─────────────────────────────────────────────

function ModeSummary({
  visualMode,
  duration,
  onClick,
}: {
  visualMode: VisualMode;
  duration: number;
  onClick: () => void;
}) {
  const unit = visualMode === "words" ? "w" : "s";
  const label =
    visualMode === "quotes" ? "quotes" : `${visualMode} · ${duration}${unit}`;
  return (
    <button
      onClick={onClick}
      className="border-line text-text-muted hover:text-text-primary min-w-0 cursor-pointer truncate border-x px-2 py-1 font-mono text-[11px] transition-colors sm:px-4 sm:text-xs"
    >
      {label}
    </button>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────────

export function Header() {
  /*======================== Store ======================== */

  const {
    visualMode,
    duration,
    caretStyle,
    muted,
    hideChrome,
    configOpen,
    setConfigOpen,
    handleCaretStyleChange,
    toggleMute,
    handleToggleStatsDrawer,
  } = useHeader();

  /*======================== Others ======================== */

  const navButtons = [
    {
      key: "caret",
      icon: <IconCaret />,
      onClick: () =>
        handleCaretStyleChange(caretStyle === "line" ? "underline" : "line"),
      title: `Caret: ${caretStyle}`,
    },
    {
      key: "sound",
      icon: muted ? <IconSoundOff /> : <IconSoundOn />,
      onClick: toggleMute,
      active: !muted,
      title: muted ? "Sound off" : "Sound on",
    },
    {
      key: "stats",
      icon: <IconConfig />,
      onClick: handleToggleStatsDrawer,
      title: "Stats",
    },
  ];

  /*======================== Return ======================== */

  return (
    <>
      <header
        className="pointer-events-none fixed top-3 left-1/2 z-50 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center transition-opacity duration-500 sm:top-4"
        style={{
          opacity: hideChrome ? 0 : 1,
          pointerEvents: hideChrome ? "none" : "auto",
        }}
      >
        <div className="border-line bg-panel flex min-w-0 items-center gap-0.5 rounded-xl border px-2 py-1.5 sm:gap-1 sm:px-3 sm:py-2">
          <span className="text-signal mr-1 flex shrink-0 items-center gap-1 px-1 font-mono text-xs font-bold tracking-tight sm:mr-2 sm:text-sm">
            <RushMark />
            RUSH
          </span>

          <ModeSummary
            visualMode={visualMode}
            duration={duration}
            onClick={() => setConfigOpen((o) => !o)}
          />

          <div className="ml-1 flex shrink-0 items-center gap-0.5 sm:ml-2 sm:gap-1">
            {navButtons.map((btn) => (
              <NavBtn
                key={btn.key}
                onClick={btn.onClick}
                active={btn.active}
                title={btn.title}
              >
                {btn.icon}
              </NavBtn>
            ))}
          </div>
        </div>
      </header>

      <ConfigDrawer isOpen={configOpen} onClose={() => setConfigOpen(false)} />
    </>
  );
}
