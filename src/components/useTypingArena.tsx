import { useEffect, useRef, useState } from "react";

import type { Phase, WordState } from "../hooks/useTypingEngine";
import type { CaretStyle } from "../store/settings/ISettingsStore";
import useSettingsStore from "../store/settings/settingsStore";
import useTypingStore from "../store/typing/typingStore";

/*=== Props ===*/

export interface TypingArenaProps {
  words: string[];
  wordStates: WordState[];
  currentInput: string;
  currentIndex: number;
  lockedInputs: Record<number, string>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  phase: Phase;
}

export function useTypingArena({
  words,
  wordStates: _wordStates,
  currentInput,
  currentIndex,
  lockedInputs: _lockedInputs,
  handleKeyDown,
  phase: _phase,
}: TypingArenaProps) {
  /*=== Store ===*/

  const isPaused = useTypingStore((s) => s.isPaused);
  const wpm = useTypingStore((s) => s.wpm);
  const accuracy = useTypingStore((s) => s.accuracy);
  const timeDisplay = useTypingStore((s) => s.timeDisplay);
  const quoteAuthor = useTypingStore((s) => s.quoteAuthor);
  const caretStyle = useSettingsStore((s) => s.caretStyle) as CaretStyle;

  const onTabReset = useTypingStore((s) => s._onRetry);
  const onNew = useTypingStore((s) => s._onNew);

  /*=== UseState ===*/

  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  /*=== UseEffect ===*/

  useEffect(() => {
    inputRef.current?.focus();
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  /*=== Handler ===*/

  const setIsPaused = (v: boolean) =>
    useTypingStore.getState().setState("isPaused", v);

  const handleResume = () => {
    setIsPaused(false);
    inputRef.current?.focus();
  };

  const handleArenaClick = () => {
    if (isPaused) {
      handleResume();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleKeyDownWrapper = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (isPaused) onTabReset?.();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onNew?.();
      return;
    }
    if (isPaused) {
      setIsPaused(false);
      return;
    }
    handleKeyDown(e);
  };

  const expectedWord = words[currentIndex] ?? "";
  const activeKeys = Array.from(
    new Set(
      currentInput
        .toLowerCase()
        .split("")
        .filter((char) => char !== " ")
    )
  );
  const wrongKeys = Array.from(
    new Set(
      currentInput
        .toLowerCase()
        .split("")
        .flatMap((char, index) =>
          char !== " " && char !== (expectedWord[index] ?? "") ? [char] : []
        )
    )
  );

  /*=== Return ===*/

  return {
    inputRef,
    mounted,
    isPaused,
    wpm,
    accuracy,
    timeDisplay,
    quoteAuthor,
    caretStyle,
    activeKeys,
    wrongKeys,
    onTabReset,
    onNew,
    handleResume,
    handleArenaClick,
    handleKeyDownWrapper,
    setIsPaused,
  };
}
