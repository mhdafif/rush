import { useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  mode: string;
  duration: number;
  isRunning: boolean;
  isPaused: boolean;
  onEnd: () => void;
  resetKey: number;
}

export function useTimer({
  mode,
  duration,
  isRunning,
  isPaused,
  onEnd,
  resetKey,
}: UseTimerOptions) {
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsed(0);
    setRemaining(duration);
  }, [duration, mode, resetKey]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isRunning || isPaused) return;

    intervalRef.current = setInterval(() => {
      if (mode === "time") {
        setRemaining((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            onEndRef.current();
            return 0;
          }
          return next;
        });
      }
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused, mode]);

  return { elapsed, remaining };
}
