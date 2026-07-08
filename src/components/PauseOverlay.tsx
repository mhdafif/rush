interface PauseOverlayProps {
  onResume: () => void;
}

export function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <div
      className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center"
      onClick={onResume}
    >
      <div className="text-glow text-signal font-mono text-lg font-bold tracking-widest uppercase">
        paused
      </div>
      <div className="text-text-muted mt-2 font-mono text-xs">
        click or press any key to resume
      </div>
    </div>
  );
}
