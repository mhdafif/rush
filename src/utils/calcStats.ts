export interface Stats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
}

export function calcStats(
  correctChars: number,
  totalTypedChars: number,
  elapsedSeconds: number
): Stats {
  if (elapsedSeconds === 0) return { wpm: 0, rawWpm: 0, accuracy: 100 };
  const minutes = elapsedSeconds / 60;
  const wpm = Math.round(correctChars / 5 / minutes);
  const rawWpm = Math.round(totalTypedChars / 5 / minutes);
  const accuracy =
    totalTypedChars === 0
      ? 100
      : Math.round((correctChars / totalTypedChars) * 100);
  return { wpm, rawWpm, accuracy };
}

/**
 * Consistency score: how steady WPM was throughout the test.
 * Returns 0–100 where 100 = perfectly even pace.
 * Uses coefficient of variation: 100 - (stdDev / mean) * 100, clamped to [0, 100].
 */
export function calcConsistency(wpmSnapshots: number[]): number {
  if (wpmSnapshots.length < 2) return 100;
  const mean = wpmSnapshots.reduce((s, v) => s + v, 0) / wpmSnapshots.length;
  if (mean === 0) return 100;
  const variance =
    wpmSnapshots.reduce((s, v) => s + (v - mean) ** 2, 0) / wpmSnapshots.length;
  const stdDev = Math.sqrt(variance);
  return Math.max(0, Math.round(100 - (stdDev / mean) * 100));
}
