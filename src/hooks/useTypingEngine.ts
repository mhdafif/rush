import { useCallback, useState } from "react";

import { calcConsistency, calcStats } from "../utils/calcStats";

export type WordState =
  | "pending"
  | "active"
  | "locked-correct"
  | "locked-error";
export type Phase = "idle" | "running" | "finished";

export interface WpmSnapshot {
  second: number;
  wpm: number;
}

export interface TestResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  errors: number;
  duration: number;
  wpmHistory: WpmSnapshot[];
  mode: string;
  terminated?: boolean;
  keyErrors: Record<string, number>;
}

interface UseTypingEngineOptions {
  words: string[];
  mode: string;
  isPaused: boolean;
  getElapsed: () => number;
  duration: number;
  suddenDeath: boolean;
  onTestEnd: (result: TestResult) => void;
  onCorrectChar?: () => void;
  onWordError?: () => void;
}

export function useTypingEngine({
  words,
  mode,
  isPaused,
  getElapsed,
  duration: _duration,
  suddenDeath,
  onTestEnd,
  onCorrectChar,
  onWordError,
}: UseTypingEngineOptions) {
  const [wordStates, setWordStates] = useState<WordState[]>(() =>
    words.map((_, i) => (i === 0 ? "active" : "pending"))
  );
  const [currentInput, setCurrentInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [wpmHistory, setWpmHistory] = useState<WpmSnapshot[]>([]);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [lockedInputs, setLockedInputs] = useState<Record<number, string>>({});
  const [keyErrors, setKeyErrors] = useState<Record<string, number>>({});
  const reset = useCallback((newWords: string[]) => {
    setWordStates(newWords.map((_, i) => (i === 0 ? "active" : "pending")));
    setCurrentInput("");
    setCurrentIndex(0);
    setPhase("idle");
    setWpmHistory([]);
    setCorrectChars(0);
    setTotalTypedChars(0);
    setLockedInputs({});
    setKeyErrors({});
  }, []);

  const endTest = useCallback(
    (terminated = false) => {
      setPhase("finished");
      const currentElapsed = getElapsed();
      const { wpm, rawWpm, accuracy } = calcStats(
        correctChars,
        totalTypedChars,
        currentElapsed || 1
      );
      const consistency = calcConsistency(wpmHistory.map((s) => s.wpm));
      onTestEnd({
        wpm,
        rawWpm,
        accuracy,
        consistency,
        errors: wordStates.filter((s) => s === "locked-error").length,
        duration: currentElapsed,
        wpmHistory,
        mode,
        terminated,
        keyErrors,
      });
    },
    [
      getElapsed,
      correctChars,
      totalTypedChars,
      wpmHistory,
      wordStates,
      onTestEnd,
      mode,
      keyErrors,
    ]
  );

  const recordWpmSnapshot = useCallback(() => {
    if (phase !== "running") return;
    const currentElapsed = getElapsed();
    const { wpm } = calcStats(
      correctChars,
      totalTypedChars,
      currentElapsed || 1
    );
    setWpmHistory((prev) => [...prev, { second: currentElapsed, wpm }]);
  }, [phase, correctChars, totalTypedChars, getElapsed]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const key = e.key;
      if (isPaused || phase === "finished") return;

      if (key === "Tab") {
        e.preventDefault();
        return;
      }
      if (key === "Escape") {
        reset(words);
        return;
      }

      if (phase === "idle") {
        if (key.length === 1 && key !== " ") {
          setPhase("running");
          setCurrentInput(key);
        }
        return;
      }

      if (key === " ") {
        e.preventDefault();
        if (currentInput.length === 0) return;

        const expected = words[currentIndex];
        const isCorrect = currentInput === expected;
        const newStates = [...wordStates] as WordState[];
        newStates[currentIndex] = isCorrect ? "locked-correct" : "locked-error";

        if (!isCorrect) onWordError?.();

        const typed = currentInput.length;
        const correct = isCorrect ? expected.length : 0;
        setTotalTypedChars((prev) => prev + typed);
        setCorrectChars((prev) => prev + correct);
        setLockedInputs((prev) => ({ ...prev, [currentIndex]: currentInput }));

        // Sudden death: end test immediately on any error
        if (!isCorrect && suddenDeath) {
          setWordStates(newStates);
          setCurrentInput("");
          endTest(true);
          return;
        }

        const isLast = currentIndex === words.length - 1;
        if (isLast && mode === "words") {
          setWordStates(newStates);
          setCurrentInput("");
          endTest(false);
          return;
        }

        newStates[currentIndex + 1] = "active";
        setWordStates(newStates);
        setCurrentInput("");
        setCurrentIndex((prev) => prev + 1);
        return;
      }

      if (key === "Backspace") {
        if (currentInput.length === 0) return;
        setCurrentInput((prev) => prev.slice(0, -1));
        return;
      }

      if (key.length === 1) {
        // Fire correct-char sound if the typed char matches the expected char
        const expected = words[currentIndex];
        const nextPos = currentInput.length;
        if (nextPos < expected.length && key === expected[nextPos]) {
          onCorrectChar?.();
        } else {
          // Track wrong key for heatmap
          setKeyErrors((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
        }
        setCurrentInput((prev) => prev + key);
      }
    },
    [
      isPaused,
      phase,
      words,
      currentIndex,
      currentInput,
      wordStates,
      mode,
      suddenDeath,
      endTest,
      reset,
      onCorrectChar,
      onWordError,
    ]
  );

  return {
    wordStates,
    currentInput,
    currentIndex,
    lockedInputs,
    phase,
    wpmHistory,
    correctChars,
    totalTypedChars,
    keyErrors,
    handleKeyDown,
    recordWpmSnapshot,
    endTest,
    reset,
  };
}
