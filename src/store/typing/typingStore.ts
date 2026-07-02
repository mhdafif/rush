import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { generateWords } from "../../utils/generateWords";
import type { ITypingState, ITypingStore } from "./ITypingStore";

const initialState: ITypingState = {
  view: "typing",
  phase: "idle",
  words: generateWords(200, "en"),
  quoteAuthor: undefined,
  isPaused: false,
  testResult: null,
  wpm: 0,
  accuracy: 100,
  timeDisplay: "30s",
  resetKey: 0,
  isDrawerOpen: false,
  _onVisualModeChange: null,
  _onDurationChange: null,
  _onLangChange: null,
  _onRetry: null,
  _onNew: null,
};

const useTypingStore = create<ITypingStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setState: (key, value) =>
        set(
          { [key]: value } as Partial<ITypingState>,
          false,
          `typing/set-${key}`
        ),

      resetSession: () =>
        set(
          { ...initialState, words: initialState.words },
          false,
          "typing/resetSession"
        ),
    }),
    { name: "typing-store" }
  )
);

export default useTypingStore;
