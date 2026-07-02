import type { VisualMode } from "../../store/settings/ISettingsStore";
import { ConfigDrawer } from "../ConfigDrawer";
import { IconCaret, IconConfig, IconSoundOff, IconSoundOn } from "../icons";
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
      className="cursor-pointer border-x border-zinc-800 px-4 py-1 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-300"
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
    isTyping,
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
        className="pointer-events-none fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center transition-opacity duration-500"
        style={{
          opacity: isTyping ? 0 : 1,
          pointerEvents: isTyping ? "none" : "auto",
        }}
      >
        <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 shadow-lg">
          <span className="mr-2 px-1 font-mono text-sm font-bold tracking-tight text-orange-600">
            RUSH
          </span>

          <ModeSummary
            visualMode={visualMode}
            duration={duration}
            onClick={() => setConfigOpen((o) => !o)}
          />

          <div className="ml-2 flex items-center gap-1">
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
