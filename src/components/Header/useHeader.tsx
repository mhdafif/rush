import { useState } from "react";

import useSettingsStore from "../../store/settings/settingsStore";
import useTypingStore from "../../store/typing/typingStore";

export function useHeader() {
  /*======================== Store ======================== */

  const visualMode = useSettingsStore((s) => s.visualMode);
  const duration = useSettingsStore((s) => s.duration);
  const lang = useSettingsStore((s) => s.lang);
  const caretStyle = useSettingsStore((s) => s.caretStyle);
  const suddenDeath = useSettingsStore((s) => s.suddenDeath);
  const muted = useSettingsStore((s) => s.muted);
  const setCaretStyle = useSettingsStore((s) => s.setCaretStyle);
  const toggleSuddenDeath = useSettingsStore((s) => s.toggleSuddenDeath);
  const toggleMute = useSettingsStore((s) => s.toggleMute);

  const phase = useTypingStore((s) => s.phase);
  const isPaused = useTypingStore((s) => s.isPaused);
  const isDrawerOpen = useTypingStore((s) => s.isDrawerOpen);
  const onVisualModeChange = useTypingStore((s) => s._onVisualModeChange);
  const onDurationChange = useTypingStore((s) => s._onDurationChange);
  const onLangChange = useTypingStore((s) => s._onLangChange);

  /*======================== UseState ======================== */

  const [configOpen, setConfigOpen] = useState(false);

  /*======================== Handler ======================== */

  const isTyping = phase === "running" && !isPaused;
  const disabled = phase === "running";

  const handleToggleStatsDrawer = () => {
    useTypingStore.getState().setState("isDrawerOpen", !isDrawerOpen);
  };

  const handleCaretStyleChange = (s: Parameters<typeof setCaretStyle>[0]) => {
    setCaretStyle(s);
  };

  /*======================== Return ======================== */

  return {
    // state
    visualMode,
    duration,
    lang,
    caretStyle,
    suddenDeath,
    muted,
    phase,
    isTyping,
    disabled,
    configOpen,
    setConfigOpen,
    // handlers
    onVisualModeChange,
    onDurationChange,
    onLangChange,
    handleCaretStyleChange,
    toggleSuddenDeath,
    toggleMute,
    handleToggleStatsDrawer,
  };
}
