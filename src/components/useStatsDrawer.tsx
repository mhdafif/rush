import { useState } from "react";

import useSettingsStore from "../store/settings/settingsStore";
import useTypingStore from "../store/typing/typingStore";

export function useStatsDrawer() {
  /*=== Store ===*/

  const isOpen = useTypingStore((s) => s.isDrawerOpen);
  const history = useSettingsStore((s) => s.history);
  const best = useSettingsStore((s) => s.best);

  /*=== UseState ===*/

  const [showHistory, setShowHistory] = useState(true);

  /*=== Handler ===*/

  const onClose = () =>
    useTypingStore.getState().setState("isDrawerOpen", false);

  const chartData = [...history].reverse().map((h, i) => ({
    name: `#${i + 1}`,
    wpm: h.wpm,
    acc: h.accuracy,
  }));

  /*=== Return ===*/

  return {
    isOpen,
    onClose,
    history,
    best,
    showHistory,
    setShowHistory,
    chartData,
  };
}
