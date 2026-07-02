import { useCallback, useState } from "react";

export function useSuddenDeath() {
  const [suddenDeath, setSuddenDeath] = useState(false);

  const toggleSuddenDeath = useCallback(() => setSuddenDeath((s) => !s), []);

  return { suddenDeath, toggleSuddenDeath };
}
