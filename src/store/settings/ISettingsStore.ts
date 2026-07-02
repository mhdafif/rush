import type { TestResult } from "../../hooks/useTypingEngine";
import type { Language } from "../../utils/generateWords";

export type VisualMode = "time" | "words" | "punct" | "nums" | "quotes";

export type CaretStyle = "line" | "underline";

export interface HistoryEntry {
  id: number;
  wpm: number;
  accuracy: number;
  errors: number;
  duration: number;
  mode: string;
  lang: string;
  timestamp: number;
}

export interface BestScore {
  wpm: number;
  accuracy: number;
  mode: string;
  lang: string;
  timestamp: number;
}

export interface ISettingsState {
  visualMode: VisualMode;
  duration: number;
  lang: Language;
  caretStyle: CaretStyle;
  suddenDeath: boolean;
  muted: boolean;
  history: HistoryEntry[];
  best: BestScore | null;
}

export interface ISettingsStore extends ISettingsState {
  setVisualMode: (vm: VisualMode) => void;
  setDuration: (d: number) => void;
  setLang: (l: Language) => void;
  setCaretStyle: (s: CaretStyle) => void;
  toggleSuddenDeath: () => void;
  toggleMute: () => void;
  saveResult: (result: TestResult, lang: Language) => void;
}
