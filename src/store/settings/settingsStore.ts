import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { TestResult } from "../../hooks/useTypingEngine";
import type {
  BestScore,
  HistoryEntry,
  ISettingsState,
  ISettingsStore,
} from "./ISettingsStore";

const MAX_HISTORY = 5;

const initialState: ISettingsState = {
  visualMode: "time",
  duration: 30,
  lang: "en",
  caretStyle: "line",
  suddenDeath: false,
  muted: false,
  history: [],
  best: null,
};

const useSettingsStore = create<ISettingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setVisualMode: (vm) =>
          set({ visualMode: vm }, false, "settings/setVisualMode"),

        setDuration: (d) => set({ duration: d }, false, "settings/setDuration"),

        setLang: (l) => set({ lang: l }, false, "settings/setLang"),

        setCaretStyle: (s) =>
          set({ caretStyle: s }, false, "settings/setCaretStyle"),

        toggleSuddenDeath: () =>
          set(
            (s) => ({ suddenDeath: !s.suddenDeath }),
            false,
            "settings/toggleSuddenDeath"
          ),

        toggleMute: () =>
          set((s) => ({ muted: !s.muted }), false, "settings/toggleMute"),

        saveResult: (result: TestResult, lang: string) =>
          set(
            (s) => {
              const entry: HistoryEntry = {
                id: Date.now(),
                wpm: result.wpm,
                accuracy: result.accuracy,
                errors: result.errors,
                duration: result.duration,
                mode: result.mode,
                lang,
                timestamp: Date.now(),
              };

              const nextHistory = [entry, ...s.history].slice(0, MAX_HISTORY);

              const prevBest = s.best;
              const nextBest: BestScore =
                !prevBest || result.wpm > prevBest.wpm
                  ? {
                      wpm: result.wpm,
                      accuracy: result.accuracy,
                      mode: result.mode,
                      lang,
                      timestamp: Date.now(),
                    }
                  : prevBest;

              return { history: nextHistory, best: nextBest };
            },
            false,
            "settings/saveResult"
          ),
      }),
      { name: "rush_settings" }
    ),
    { name: "settings-store" }
  )
);

export default useSettingsStore;
