// src/components/TestHUD.tsx

interface LiveStatsProps {
  wpm: number;
  accuracy: number;
  timeDisplay: string;
  mode: string;
  isPaused: boolean;
  visible: boolean;
}

export function LiveStats({
  wpm,
  accuracy,
  timeDisplay,
  mode,
  isPaused,
  visible,
}: LiveStatsProps) {
  return (
    <div
      // className={`left-0 mb-4 flex items-center gap-8 px-1 font-mono text-sm transition-opacity duration-200 ${
      //   visible
      //     ? isPaused
      //       ? "opacity-20"
      //       : "opacity-100"
      //     : "pointer-events-none opacity-0"
      // }`}
      className={`absolute -top-4 left-0 flex items-center gap-8 px-1 font-mono text-sm transition-opacity duration-200 ${
        visible
          ? isPaused
            ? "opacity-20"
            : "opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex items-center">
        <span className="text-text-muted mr-2 text-xs tracking-widest uppercase">
          wpm
        </span>
        <span className="text-signal inline-block w-10 text-right font-bold tabular-nums">
          {wpm}
        </span>
      </div>
      <div className="flex items-center">
        <span className="text-text-muted mr-2 text-xs tracking-widest uppercase">
          acc
        </span>
        <span className="text-text-primary inline-block w-10 text-right tabular-nums">
          {accuracy}%
        </span>
      </div>
      <div className="flex items-center">
        <span className="text-text-muted mr-2 text-xs tracking-widest uppercase">
          {mode === "time" ? "time" : "elapsed"}
        </span>
        <span className="text-text-muted inline-block w-10 text-right tabular-nums">
          {timeDisplay}
        </span>
      </div>
    </div>
  );
}
