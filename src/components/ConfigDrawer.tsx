import { useCallback, useState } from "react";

import { cn } from "../lib/utils";
import type { CaretStyle, VisualMode } from "../store/settings/ISettingsStore";
import useSettingsStore from "../store/settings/settingsStore";
import useTypingStore from "../store/typing/typingStore";
import type { Language } from "../utils/generateWords";
import { CustomDurationDialog } from "./CustomDurationDialog";
import { IconInfo } from "./icons/IconInfo";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
} from "./ui/drawer";

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
        <DrawerPortal>
          <DrawerOverlay
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.4)" }}
          />
          <DrawerContent
            className="fixed top-0 right-0 left-0 z-50 flex justify-center rounded-none border-none bg-transparent outline-none"
            aria-label="Config drawer"
          >
            <div className="w-full max-w-2xl rounded-b-2xl border-x border-b border-zinc-800 bg-zinc-950 px-6 pt-4 pb-6 font-mono shadow-2xl">
              {/* Mode tabs */}
              <div className="mb-5">
                <div className="mb-2 text-[10px] tracking-widest text-zinc-600 uppercase">
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
                          ? "border-orange-600 bg-orange-600 text-white"
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
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
                  <div className="mb-2 text-[10px] tracking-widest text-zinc-600 uppercase">
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
                            ? "border-orange-800 bg-orange-950/40 text-orange-500"
                            : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
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
                          ? "border-orange-800 bg-orange-950/40 text-orange-500"
                          : "border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
                      )}
                    >
                      {isCustom ? `${duration} ✎` : "…"}
                    </button>
                  </div>
                </div>
              )}

              {/* Language */}
              <div className="mb-5">
                <div className="mb-2 text-[10px] tracking-widest text-zinc-600 uppercase">
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
                          ? "border-orange-800 bg-orange-950/40 text-orange-500"
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                      )}
                    >
                      {LANG_NAMES[l]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caret style */}
              <div className="mb-5">
                <div className="mb-2 text-[10px] tracking-widest text-zinc-600 uppercase">
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
                          ? "border-orange-800 bg-orange-950/40 text-orange-500"
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sudden death */}
              <div className="flex items-center gap-3">
                <div className="text-[10px] tracking-widest text-zinc-600 uppercase">
                  Sudden Death
                </div>
                <button
                  onClick={toggleSuddenDeath}
                  disabled={disabled}
                  className={cn(
                    "cursor-pointer rounded-lg border px-3 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                    suddenDeath
                      ? "border-red-800 bg-red-950/40 text-red-400"
                      : "border-zinc-800 text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  {suddenDeath ? "on" : "off"}
                </button>
                {/* Info tooltip */}
                <div className="relative">
                  <button
                    onClick={() => setSdInfoOpen((o) => !o)}
                    className="cursor-pointer text-zinc-700 transition-colors hover:text-zinc-400"
                  >
                    <IconInfo />
                  </button>
                  {sdInfoOpen && (
                    <div
                      className="absolute bottom-full left-0 z-10 mb-2 w-56 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-[11px] text-zinc-400 shadow-xl"
                      onMouseLeave={() => setSdInfoOpen(false)}
                    >
                      One mistake ends the test immediately. ☠
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DrawerContent>
        </DrawerPortal>
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
