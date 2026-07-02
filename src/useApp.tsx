import { useCallback, useEffect, useRef } from "react";

import { usePunctuation } from "./hooks/usePunctuation";
import { useSound } from "./hooks/useSound";
import { useTimer } from "./hooks/useTimer";
import { type TestResult, useTypingEngine } from "./hooks/useTypingEngine";
import type { VisualMode } from "./store/settings/ISettingsStore";
import useSettingsStore from "./store/settings/settingsStore";
import useTypingStore from "./store/typing/typingStore";
import { calcStats } from "./utils/calcStats";
import type { Language } from "./utils/generateWords";
import { getRandomQuote, quoteToWords } from "./utils/quotes";

/*======================== Helpers ========================*/

const TIME_WORD_BUFFER = 200;

type Mode = "time" | "words";

function visualModeToMode(vm: VisualMode): Mode {
  return vm === "words" || vm === "quotes" ? "words" : "time";
}

function generateWordsForMode(
  vm: VisualMode,
  duration: number,
  lang: Language,
  generateWithOptions: (
    count: number,
    lang: Language,
    opts?: { punct?: boolean; nums?: boolean }
  ) => string[]
): { words: string[]; quoteAuthor?: string } {
  if (vm === "quotes") {
    const quote = getRandomQuote(lang);
    return { words: quoteToWords(quote), quoteAuthor: `— ${quote.author}` };
  }
  const count = vm === "words" ? duration : TIME_WORD_BUFFER;
  const opts = { punct: vm === "punct", nums: vm === "nums" };
  return { words: generateWithOptions(count, lang, opts) };
}

const useApp = () => {
  /*======================== Store ========================*/

  const visualMode = useSettingsStore((s) => s.visualMode);
  const duration = useSettingsStore((s) => s.duration);
  const lang = useSettingsStore((s) => s.lang);
  const suddenDeath = useSettingsStore((s) => s.suddenDeath);
  const saveResult = useSettingsStore((s) => s.saveResult);
  const toggleMute = useSettingsStore((s) => s.toggleMute);
  const muted = useSettingsStore((s) => s.muted);

  const setTyping = useTypingStore((s) => s.setState);
  const words = useTypingStore((s) => s.words);
  const isPaused = useTypingStore((s) => s.isPaused);
  const resetKey = useTypingStore((s) => s.resetKey);

  /*======================== Others ========================*/

  const mode: Mode = visualModeToMode(visualMode);
  const elapsedRef = useRef(0);
  const getElapsed = useCallback(() => elapsedRef.current, []);

  const { generateWithOptions } = usePunctuation();
  const { playClick, playError, playComplete } = useSound(muted);

  /*======================== Queries ========================*/

  const engine = useTypingEngine({
    words,
    mode,
    isPaused,
    getElapsed,
    duration,
    suddenDeath,
    onTestEnd: useCallback(
      (result: TestResult) => {
        setTyping("testResult", result);
        setTyping("view", "results");
        playComplete();
        saveResult(result, lang);
      },
      [playComplete, saveResult, lang, setTyping]
    ),
    onCorrectChar: playClick,
    onWordError: playError,
  });

  const { elapsed, remaining } = useTimer({
    mode,
    duration,
    isRunning: engine.phase === "running",
    isPaused,
    onEnd: engine.endTest,
    resetKey,
  });

  /*======================== UseEffect ========================*/

  // Sync elapsed to ref
  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  // Sync live stats to store
  useEffect(() => {
    const { wpm, accuracy } = calcStats(
      engine.correctChars,
      engine.totalTypedChars,
      elapsed || 1
    );
    const timeDisplay = mode === "time" ? `${remaining}s` : `${elapsed}s`;
    setTyping("wpm", wpm);
    setTyping("accuracy", accuracy);
    setTyping("timeDisplay", timeDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, engine.correctChars, engine.totalTypedChars]);

  // Record WPM snapshot each second
  useEffect(() => {
    if (engine.phase === "running" && !isPaused) {
      engine.recordWpmSnapshot();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed]);

  // Sync engine.phase → store
  useEffect(() => {
    setTyping("phase", engine.phase);
  }, [engine.phase, setTyping]);

  // Close stats drawer when test starts
  useEffect(() => {
    if (engine.phase === "running") setTyping("isDrawerOpen", false);
  }, [engine.phase, setTyping]);

  // Pause on window blur
  useEffect(() => {
    const handleBlur = () => {
      if (engine.phase === "running") setTyping("isPaused", true);
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [engine.phase, setTyping]);

  // Pause on mouse movement while running
  useEffect(() => {
    const handleMouseMove = () => {
      if (engine.phase === "running" && !isPaused) setTyping("isPaused", true);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [engine.phase, isPaused, setTyping]);

  /*======================== Handler ========================*/

  const handleReset = useCallback(
    (newWords?: string[]) => {
      setTyping("isPaused", false);
      setTyping("resetKey", resetKey + 1);
      engine.reset(newWords ?? words);
    },
    [engine, words, resetKey, setTyping]
  );

  const handleRetry = useCallback(() => {
    setTyping("view", "typing");
    handleReset(words);
  }, [words, handleReset, setTyping]);

  const handleNew = useCallback(() => {
    const { words: newWords, quoteAuthor: qa } = generateWordsForMode(
      visualMode,
      duration,
      lang,
      generateWithOptions
    );
    setTyping("words", newWords);
    setTyping("quoteAuthor", qa);
    setTyping("view", "typing");
    handleReset(newWords);
  }, [visualMode, duration, lang, generateWithOptions, handleReset, setTyping]);

  const handleVisualModeChange = useCallback(
    (vm: VisualMode) => {
      const newDur = vm === "words" ? 25 : 30;
      useSettingsStore.getState().setVisualMode(vm);
      if (vm !== "quotes") useSettingsStore.getState().setDuration(newDur);
      const { words: newWords, quoteAuthor: qa } = generateWordsForMode(
        vm,
        vm === "words" ? newDur : duration,
        lang,
        generateWithOptions
      );
      setTyping("words", newWords);
      setTyping("quoteAuthor", qa);
      setTyping("view", "typing");
      setTyping("isPaused", false);
      engine.reset(newWords);
    },
    [engine, lang, duration, generateWithOptions, setTyping]
  );

  const handleDurationChange = useCallback(
    (newDur: number) => {
      useSettingsStore.getState().setDuration(newDur);
      const { words: newWords, quoteAuthor: qa } = generateWordsForMode(
        visualMode,
        newDur,
        lang,
        generateWithOptions
      );
      setTyping("words", newWords);
      setTyping("quoteAuthor", qa);
      setTyping("view", "typing");
      setTyping("isPaused", false);
      engine.reset(newWords);
    },
    [visualMode, lang, engine, generateWithOptions, setTyping]
  );

  const handleLangChange = useCallback(
    (newLang: Language) => {
      useSettingsStore.getState().setLang(newLang);
      const { words: newWords, quoteAuthor: qa } = generateWordsForMode(
        visualMode,
        duration,
        newLang,
        generateWithOptions
      );
      setTyping("words", newWords);
      setTyping("quoteAuthor", qa);
      setTyping("view", "typing");
      setTyping("isPaused", false);
      engine.reset(newWords);
    },
    [visualMode, duration, engine, generateWithOptions, setTyping]
  );

  // Register handlers in store so child components can call them without prop drilling
  useEffect(() => {
    setTyping("_onVisualModeChange", handleVisualModeChange);
    setTyping("_onDurationChange", handleDurationChange);
    setTyping("_onLangChange", handleLangChange);
    setTyping("_onRetry", handleRetry);
    setTyping("_onNew", handleNew);
  }, [
    handleVisualModeChange,
    handleDurationChange,
    handleLangChange,
    handleRetry,
    handleNew,
    setTyping,
  ]);

  /*======================== Return ========================*/

  return {
    engine,
    handleRetry,
    handleNew,
    handleVisualModeChange,
    handleDurationChange,
    handleLangChange,
    toggleMute,
  };
};

export default useApp;
