import { useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

export type VisualMode = "time" | "words" | "punct" | "nums";

interface ModeSelectorProps {
  visualMode: VisualMode;
  duration: number;
  onVisualModeChange: (vm: VisualMode) => void;
  onDurationChange: (dur: number) => void;
  disabled: boolean;
  suddenDeath: boolean;
  onToggleSuddenDeath: () => void;
}

const TIME_OPTIONS = [15, 30, 60];
const WORD_OPTIONS = [10, 25, 50, 100];

function ToggleChip({
  label,
  active,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled: boolean;
  danger?: boolean;
}) {
  const activeClass = danger
    ? "text-red-400 border-red-800 bg-red-950/40"
    : "text-orange-500 border-orange-800 bg-orange-950/40";
  return (
    <button
      onClick={() => !disabled && onClick()}
      className={`rounded border px-2.5 py-1 font-mono text-xs transition-colors ${
        active
          ? activeClass
          : "border-zinc-800 text-zinc-600 hover:text-zinc-400"
      } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
    >
      {label}
    </button>
  );
}

interface CustomDurationDialogProps {
  isWords: boolean;
  current: number;
  onConfirm: (val: number) => void;
  onClose: () => void;
}

function CustomDurationDialog({
  isWords,
  current,
  onConfirm,
  onClose,
}: CustomDurationDialogProps) {
  const [value, setValue] = useState(String(current));
  const inputRef = useRef<HTMLInputElement>(null);
  const min = 5;
  const max = isWords ? 500 : 300;
  const label = isWords ? "words" : "seconds";

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const commit = () => {
    const val = parseInt(value, 10);
    if (!isNaN(val) && val >= min && val <= max) {
      onConfirm(val);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") commit();
    if (e.key === "Escape") onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-modal="true"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-72 rounded-xl border border-zinc-700 bg-zinc-900 p-6 font-mono shadow-2xl">
        <div className="mb-4 text-xs tracking-widest text-zinc-500 uppercase">
          custom {label}
        </div>
        <div className="mb-1 flex items-center gap-3">
          <input
            ref={inputRef}
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 [appearance:textfield] rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-center font-mono text-lg text-orange-400 transition-colors outline-none focus:border-orange-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-xs text-zinc-600">{label}</span>
        </div>
        <div className="mb-5 text-[10px] text-zinc-700">
          {min}–{max} {label}
        </div>
        <div className="flex gap-2">
          <button
            onClick={commit}
            className="flex-1 cursor-pointer rounded-lg bg-orange-600 py-2 text-xs text-white transition-colors hover:bg-orange-500"
          >
            confirm
          </button>
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-lg bg-zinc-800 py-2 text-xs text-zinc-400 transition-colors hover:bg-zinc-700"
          >
            cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const VISUAL_MODES: VisualMode[] = ["time", "words", "punct", "nums"];

export function ModeSelector({
  visualMode,
  duration,
  onVisualModeChange,
  onDurationChange,
  disabled,
  suddenDeath,
  onToggleSuddenDeath,
}: ModeSelectorProps) {
  const isWords = visualMode === "words";
  const options = isWords ? WORD_OPTIONS : TIME_OPTIONS;
  const isCustom = !options.includes(duration);

  const [dialogOpen, setDialogOpen] = useState(false);

  const openCustom = () => {
    if (disabled) return;
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
      {/* Mode tabs: time / words / punct / nums */}
      <div className="flex overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
        {VISUAL_MODES.map((vm) => (
          <button
            key={vm}
            onClick={() => !disabled && onVisualModeChange(vm)}
            className={`px-4 py-1.5 text-xs transition-colors ${
              visualMode === vm
                ? "bg-orange-600 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            {vm}
          </button>
        ))}
      </div>

      {/* Duration options */}
      <div className="flex items-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => !disabled && onDurationChange(opt)}
            className={`px-3 py-1.5 transition-colors ${
              duration === opt
                ? "text-orange-500"
                : "text-zinc-500 hover:text-zinc-300"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            {opt}
          </button>
        ))}

        {/* Custom duration … button */}
        <div className="border-l border-zinc-800">
          <button
            onClick={openCustom}
            className={`px-3 py-1.5 transition-colors ${
              isCustom ? "text-orange-500" : "text-zinc-600 hover:text-zinc-400"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} text-xs`}
            title="custom duration"
          >
            {isCustom ? duration : "…"}
          </button>
        </div>
      </div>

      {/* Sudden death toggle */}
      <div className="flex items-center gap-1.5">
        <ToggleChip
          label="☠ death"
          active={suddenDeath}
          onClick={onToggleSuddenDeath}
          disabled={disabled}
          danger
        />
      </div>

      {/* Custom duration dialog */}
      {dialogOpen && (
        <CustomDurationDialog
          isWords={isWords}
          current={duration}
          onConfirm={(val) => {
            onDurationChange(val);
            setDialogOpen(false);
          }}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}
