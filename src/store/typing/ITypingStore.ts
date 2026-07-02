import type { TestResult } from "../../hooks/useTypingEngine";
import type { Language } from "../../utils/generateWords";
import type { VisualMode } from "../settings/ISettingsStore";

export type View = "typing" | "results";

export type Phase = "idle" | "running" | "finished";

export interface ITypingState {
  view: View;
  phase: Phase;
  words: string[];
  quoteAuthor: string | undefined;
  isPaused: boolean;
  testResult: TestResult | null;
  wpm: number;
  accuracy: number;
  timeDisplay: string;
  resetKey: number;
  isDrawerOpen: boolean;
  // Registered handlers (set by useApp on mount)
  _onVisualModeChange: ((vm: VisualMode) => void) | null;
  _onDurationChange: ((d: number) => void) | null;
  _onLangChange: ((l: Language) => void) | null;
  _onRetry: (() => void) | null;
  _onNew: (() => void) | null;
}

export interface ITypingStore extends ITypingState {
  setState: <K extends keyof ITypingState>(
    key: K,
    value: ITypingState[K]
  ) => void;
  resetSession: () => void;
}
