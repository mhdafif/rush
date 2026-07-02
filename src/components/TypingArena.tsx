import type { Phase, WordState } from "../hooks/useTypingEngine";
import { cn } from "../utils/utils";
import { KeyboardHeatmap } from "./KeyboardHeatmap";
import { PauseOverlay } from "./PauseOverlay";
import { LiveStats } from "./TestHUD";
import { WordDisplay } from "./WordDisplay";
import { useTypingArena } from "./useTypingArena";

function IconShuffle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
    </svg>
  );
}

function IconRestart() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
  );
}

interface IconBtnProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function IconBtn({ onClick, icon, label }: IconBtnProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-400"
    >
      {icon}
    </button>
  );
}

interface ShortcutHintsProps {
  phase: Phase;
  isPaused: boolean;
  onReshuffle: () => void;
  onRestart: () => void;
  visible: boolean;
}

function ShortcutHints({
  phase,
  isPaused,
  onReshuffle,
  onRestart,
  visible,
}: ShortcutHintsProps) {
  const base =
    "transition-opacity duration-300 absolute -translate-x-1/2 left-1/2";
  const opacity = visible ? "opacity-100" : "opacity-0";

  if (phase === "idle") {
    return (
      <div className={`mt-5 flex justify-center ${base} ${opacity}`}>
        <IconBtn
          onClick={onReshuffle}
          icon={<IconShuffle />}
          label="reshuffle words (esc)"
        />
      </div>
    );
  }

  if (isPaused) {
    return (
      <div
        className={`mt-5 flex items-center justify-center gap-2 ${base} ${opacity}`}
      >
        <IconBtn
          onClick={onRestart}
          icon={<IconRestart />}
          label="restart test (tab)"
        />
        <IconBtn
          onClick={onReshuffle}
          icon={<IconShuffle />}
          label="reshuffle words (esc)"
        />
      </div>
    );
  }

  if (phase === "running") {
    return null;
  }

  return null;
}

interface TypingArenaProps {
  words: string[];
  wordStates: WordState[];
  currentInput: string;
  currentIndex: number;
  lockedInputs: Record<number, string>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  phase: Phase;
}

export function TypingArena(props: TypingArenaProps) {
  /*=== Store ===*/

  const {
    inputRef,
    mounted,
    isPaused,
    wpm,
    accuracy,
    timeDisplay,
    quoteAuthor,
    caretStyle,
    activeKeys,
    wrongKeys,
    onTabReset,
    onNew,
    handleResume,
    handleArenaClick,
    handleKeyDownWrapper,
  } = useTypingArena(props);

  const { words, wordStates, currentInput, currentIndex, lockedInputs, phase } =
    props;

  /*=== Return ===*/

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="relative cursor-text pt-9" onClick={handleArenaClick}>
        <LiveStats
          wpm={wpm}
          accuracy={accuracy}
          timeDisplay={timeDisplay}
          mode={caretStyle}
          isPaused={isPaused}
          visible={phase === "running"}
        />
        <input
          ref={inputRef}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          onKeyDown={handleKeyDownWrapper}
          onChange={() => {}}
          onBlur={() => {
            if (!isPaused && !document.querySelector("[data-modal]"))
              inputRef.current?.focus();
          }}
          value={currentInput}
          aria-label="typing input"
        />
        <div
          className="transition-[filter] duration-300"
          style={{ filter: isPaused ? "blur(5px)" : "none" }}
        >
          <WordDisplay
            words={words}
            wordStates={wordStates}
            currentInput={currentInput}
            currentIndex={currentIndex}
            lockedInputs={lockedInputs}
            caretStyle={caretStyle}
          />
          {quoteAuthor && (
            <div className="mt-3 text-right font-mono text-xs text-zinc-600 italic">
              {quoteAuthor}
            </div>
          )}
        </div>
        {isPaused && <PauseOverlay onResume={handleResume} />}
        <ShortcutHints
          phase={phase}
          isPaused={isPaused}
          onRestart={onTabReset ?? (() => {})}
          onReshuffle={onNew ?? (() => {})}
          visible={mounted}
        />
        <div
          className={cn(
            "absolute mt-16 flex w-full justify-center opacity-0 transition-opacity duration-300",
            phase === "running" && "opacity-100",
            isPaused && "opacity-10"
          )}
          data-testid="live-keyboard-wrap"
        >
          <KeyboardHeatmap
            activeKeys={activeKeys}
            wrongKeys={wrongKeys}
            label="live typing keyboard"
            variant="live"
            classProps={{
              className: "opacity-80",
            }}
          />
        </div>
      </div>
    </div>
  );
}
