import { useCallback, useRef } from "react";

function createCtx(): AudioContext | null {
  try {
    return new AudioContext();
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  type: OscillatorType,
  frequency: number,
  gainPeak: number,
  durationMs: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(gainPeak, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    ctx.currentTime + durationMs / 1000
  );
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationMs / 1000);
}

export function useSound(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (!ctxRef.current) {
      ctxRef.current = createCtx();
    }
    if (ctxRef.current?.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playClick = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    playTone(ctx, "square", 880, 0.04, 40);
  }, [muted, getCtx]);

  const playError = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    playTone(ctx, "sawtooth", 220, 0.06, 80);
  }, [muted, getCtx]);

  const playComplete = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    // Small ascending arpeggio
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(ctx, "sine", freq, 0.08, 120), i * 80);
    });
  }, [muted, getCtx]);

  const toggleMute = useCallback(() => {}, []);

  return { playClick, playError, playComplete, muted, toggleMute };
}
