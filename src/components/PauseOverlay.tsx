interface PauseOverlayProps {
  onResume: () => void;
}

export function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <div
      className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center"
      onClick={onResume}
    >
      <div className="text-glow font-mono text-lg font-bold tracking-widest text-orange-500 uppercase">
        paused
      </div>
      <div className="mt-2 font-mono text-xs text-zinc-600">
        click or press any key to resume
      </div>
    </div>
  );
}
