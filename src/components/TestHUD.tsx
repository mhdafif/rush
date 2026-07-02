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
        <span className="mr-2 text-xs tracking-widest text-zinc-600 uppercase">
          wpm
        </span>
        <span className="inline-block w-10 text-right font-bold text-orange-500 tabular-nums">
          {wpm}
        </span>
      </div>
      <div className="flex items-center">
        <span className="mr-2 text-xs tracking-widest text-zinc-600 uppercase">
          acc
        </span>
        <span className="inline-block w-10 text-right text-zinc-300 tabular-nums">
          {accuracy}%
        </span>
      </div>
      <div className="flex items-center">
        <span className="mr-2 text-xs tracking-widest text-zinc-600 uppercase">
          {mode === "time" ? "time" : "elapsed"}
        </span>
        <span className="inline-block w-10 text-right text-zinc-400 tabular-nums">
          {timeDisplay}
        </span>
      </div>
    </div>
  );
}
