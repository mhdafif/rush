import { useCallback, useState } from "react";

import { cn } from "../lib/utils";
import type { CaretStyle, VisualMode } from "../store/settings/ISettingsStore";
import useSettingsStore from "../store/settings/settingsStore";
import useTypingStore from "../store/typing/typingStore";
import type { Language } from "../utils/generateWords";
import { CustomDurationDialog } from "./CustomDurationDialog";
import { IconInfo } from "./icons/IconInfo";
import { Drawer, DrawerContent } from "./ui/drawer";

/*======================== Constants ======================== */

const LANG_NAMES: Record<Language, string> = {
  en: "English",
  id: "Indonesian",
};

const VISUAL_MODES: VisualMode[] = ["time", "words", "punct", "nums", "quotes"];

const MODE_DESC: Record<VisualMode, string> = {
  time: "Type as many words as possible within the time limit",
  words: "Type a fixed number of words as fast as possible",
  punct: "Time mode with punctuation mixed in",
  nums: "Time mode with numbers mixed in",
  quotes: "Type a real quote — no timer, ends when complete",
};

const TIME_OPTIONS = [15, 30, 60];
const WORD_OPTIONS = [10, 25, 50, 100];

/*======================== Props ======================== */

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/*======================== Component ======================== */

export function ConfigDrawer({ isOpen, onClose }: ConfigDrawerProps) {
  /*======================== Store ======================== */

  const visualMode = useSettingsStore((s) => s.visualMode);
  const duration = useSettingsStore((s) => s.duration);
  const lang = useSettingsStore((s) => s.lang);
  const caretStyle = useSettingsStore((s) => s.caretStyle);
  const suddenDeath = useSettingsStore((s) => s.suddenDeath);
  const setVisualMode = useSettingsStore((s) => s.setVisualMode);
  const setDuration = useSettingsStore((s) => s.setDuration);
  const setLang = useSettingsStore((s) => s.setLang);
  const setCaretStyle = useSettingsStore((s) => s.setCaretStyle);
  const toggleSuddenDeath = useSettingsStore((s) => s.toggleSuddenDeath);

  const phase = useTypingStore((s) => s.phase);
  const onVisualModeChange = useTypingStore((s) => s._onVisualModeChange);
  const onDurationChange = useTypingStore((s) => s._onDurationChange);
  const onLangChange = useTypingStore((s) => s._onLangChange);

  /*======================== UseState ======================== */

  const [customOpen, setCustomOpen] = useState(false);
  const [sdInfoOpen, setSdInfoOpen] = useState(false);

  /*======================== Others ======================== */

  const isWords = visualMode === "words";
  const isQuotes = visualMode === "quotes";
  const options = isWords ? WORD_OPTIONS : TIME_OPTIONS;
  const isCustom = !options.includes(duration);
  const disabled = phase === "running";

  /*======================== Handler ======================== */

  const handleModeChange = useCallback(
    (vm: VisualMode) => {
      setVisualMode(vm);
      onVisualModeChange?.(vm);
    },
    [setVisualMode, onVisualModeChange]
  );

  const handleDurationChange = useCallback(
    (val: number) => {
      setDuration(val);
      onDurationChange?.(val);
    },
    [setDuration, onDurationChange]
  );

  const handleLangChange = useCallback(
    (l: Language) => {
      setLang(l);
      onLangChange?.(l);
    },
    [setLang, onLangChange]
  );

  const handleCaretStyleChange = useCallback(
    (s: CaretStyle) => {
      setCaretStyle(s);
    },
    [setCaretStyle]
  );

  /*======================== Return ======================== */

  return (
    <>
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        direction="top"
      >
        <DrawerContent
          className="flex items-center rounded-none border-none bg-transparent outline-none"
          aria-label="Config drawer"
        >
          <div className="border-line bg-panel mx-auto w-full max-w-2xl rounded-b-2xl border-x border-b px-6 pt-4 pb-6 font-mono">
            {/* Mode tabs */}
            <div className="mb-5">
              <div className="text-text-muted mb-2 text-[10px] tracking-widest uppercase">
                Mode
              </div>
              <div className="flex flex-wrap gap-2">
                {VISUAL_MODES.map((vm) => (
                  <button
                    key={vm}
                    onClick={() => handleModeChange(vm)}
                    disabled={disabled}
                    title={MODE_DESC[vm]}
                    className={cn(
                      "cursor-pointer rounded-lg border px-4 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                      visualMode === vm
                        ? "border-signal bg-signal text-on-signal"
                        : "border-line text-text-muted hover:text-text-primary"
                    )}
                  >
                    {vm}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration — hidden in quotes mode */}
            {!isQuotes && (
              <div className="mb-5">
                <div className="text-text-muted mb-2 text-[10px] tracking-widest uppercase">
                  {isWords ? "Words" : "Duration"}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleDurationChange(opt)}
                      disabled={disabled}
                      className={cn(
                        "cursor-pointer rounded-lg border px-4 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                        duration === opt
                          ? "border-signal bg-signal-soft text-signal"
                          : "border-line text-text-muted hover:text-text-primary"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                  <button
                    onClick={() => setCustomOpen(true)}
                    disabled={disabled}
                    className={cn(
                      "cursor-pointer rounded-lg border px-4 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                      isCustom
                        ? "border-signal bg-signal-soft text-signal"
                        : "border-line text-text-muted hover:text-text-primary"
                    )}
                  >
                    {isCustom ? `${duration} ✎` : "…"}
                  </button>
                </div>
              </div>
            )}

            {/* Language */}
            <div className="mb-5">
              <div className="text-text-muted mb-2 text-[10px] tracking-widest uppercase">
                Language
              </div>
              <div className="flex flex-wrap gap-2">
                {(["en", "id"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLangChange(l)}
                    disabled={disabled}
                    className={cn(
                      "cursor-pointer rounded-lg border px-4 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                      lang === l
                        ? "border-signal bg-signal-soft text-signal"
                        : "border-line text-text-muted hover:text-text-primary"
                    )}
                  >
                    {LANG_NAMES[l]}
                  </button>
                ))}
              </div>
            </div>

            {/* Caret style */}
            <div className="mb-5">
              <div className="text-text-muted mb-2 text-[10px] tracking-widest uppercase">
                Caret
              </div>
              <div className="flex gap-2">
                {(["line", "underline"] as CaretStyle[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleCaretStyleChange(s)}
                    className={cn(
                      "cursor-pointer rounded-lg border px-4 py-1.5 text-xs transition-colors",
                      caretStyle === s
                        ? "border-signal bg-signal-soft text-signal"
                        : "border-line text-text-muted hover:text-text-primary"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sudden death */}
            <div className="flex items-center gap-3">
              <div className="text-text-muted text-[10px] tracking-widest uppercase">
                Sudden Death
              </div>
              <button
                onClick={toggleSuddenDeath}
                disabled={disabled}
                className={cn(
                  "cursor-pointer rounded-lg border px-3 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  suddenDeath
                    ? "border-danger/40 bg-danger/10 text-danger"
                    : "border-line text-text-muted hover:text-text-primary"
                )}
              >
                {suddenDeath ? "on" : "off"}
              </button>
              {/* Info tooltip */}
              <div className="relative">
                <button
                  onClick={() => setSdInfoOpen((o) => !o)}
                  className="text-text-muted hover:text-text-primary cursor-pointer transition-colors"
                >
                  <IconInfo />
                </button>
                {sdInfoOpen && (
                  <div
                    className="border-line bg-panel text-text-muted absolute bottom-full left-0 z-10 mb-2 w-56 rounded-lg border px-3 py-2 text-[11px]"
                    onMouseLeave={() => setSdInfoOpen(false)}
                  >
                    One mistake ends the test immediately. ☠
                  </div>
                )}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <CustomDurationDialog
        open={customOpen}
        isWords={isWords}
        current={duration}
        onConfirm={(val) => {
          handleDurationChange(val);
          setCustomOpen(false);
        }}
        onClose={() => setCustomOpen(false)}
      />
    </>
  );
}
