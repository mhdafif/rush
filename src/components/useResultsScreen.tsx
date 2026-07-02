import useSettingsStore from "../store/settings/settingsStore";
import useTypingStore from "../store/typing/typingStore";

export function useResultsScreen() {
  /*=== Store ===*/

  const testResult = useTypingStore((s) => s.testResult);
  const history = useSettingsStore((s) => s.history);
  const best = useSettingsStore((s) => s.best);
  const onRetry = useTypingStore((s) => s._onRetry);
  const onNew = useTypingStore((s) => s._onNew);

  /*=== Return ===*/

  return {
    testResult,
    history,
    best,
    onRetry,
    onNew,
  };
}
