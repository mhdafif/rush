import { memo, useEffect, useRef, useState } from "react";

import type { WordState } from "../hooks/useTypingEngine";
import type { CaretStyle } from "../store/settings/ISettingsStore";
import { Caret } from "./Caret";

interface ActiveWordProps {
  word: string;
  currentInput: string;
  caretStyle: CaretStyle;
}

function ActiveWord({ word, currentInput, caretStyle }: ActiveWordProps) {
  const chars = word.split("");
  const caretPos = currentInput.length;
  const atEnd = caretPos >= chars.length;
  const nodes: React.ReactNode[] = [];

  for (let ci = 0; ci < chars.length; ci++) {
    const isAtCaret = ci === caretPos;

    if (ci < caretPos) {
      const isCorrect = currentInput[ci] === chars[ci];
      nodes.push(
        <span key={ci} className={isCorrect ? "text-signal" : "text-danger"}>
          {chars[ci]}
        </span>
      );
    } else {
      if (isAtCaret) nodes.push(<Caret key="caret" style={caretStyle} />);
      nodes.push(
        <span key={ci} className="text-char-untyped">
          {chars[ci]}
        </span>
      );
    }
  }

  for (let ci = chars.length; ci < caretPos; ci++) {
    nodes.push(
      <span key={`ov-${ci}`} className="text-danger">
        {currentInput[ci]}
      </span>
    );
  }

  if (atEnd) nodes.push(<Caret key="caret" style={caretStyle} />);

  return <>{nodes}</>;
}

interface LockedErrorWordProps {
  word: string;
  typed: string;
}

function LockedErrorWord({ word, typed }: LockedErrorWordProps) {
  const chars = word.split("");
  const nodes: React.ReactNode[] = [];

  for (let ci = 0; ci < chars.length; ci++) {
    if (ci < typed.length) {
      const isCorrect = typed[ci] === chars[ci];
      nodes.push(
        <span
          key={ci}
          className={`decoration-danger underline underline-offset-4 ${isCorrect ? "text-signal" : "text-danger"}`}
        >
          {chars[ci]}
        </span>
      );
    } else {
      nodes.push(
        <span
          key={ci}
          className="text-char-upcoming decoration-danger underline underline-offset-4"
        >
          {chars[ci]}
        </span>
      );
    }
  }

  for (let ci = chars.length; ci < typed.length; ci++) {
    nodes.push(
      <span
        key={`ov-${ci}`}
        className="text-danger decoration-danger underline underline-offset-4"
      >
        {typed[ci]}
      </span>
    );
  }

  return <>{nodes}</>;
}

const StaticWord = memo(function StaticWord({ word }: { word: string }) {
  return (
    <>
      {word.split("").map((char, ci) => (
        <span key={ci}>{char}</span>
      ))}
    </>
  );
});

interface WordDisplayProps {
  words: string[];
  wordStates: WordState[];
  currentInput: string;
  currentIndex: number;
  lockedInputs: Record<number, string>;
  caretStyle?: CaretStyle;
}

export function WordDisplay({
  words,
  wordStates,
  currentInput,
  currentIndex,
  lockedInputs,
  caretStyle = "line",
}: WordDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineHeightRef = useRef<number | null>(null);
  const [rowOffset, setRowOffset] = useState(0);
  const [clipHeight, setClipHeight] = useState(132);

  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = wordRefs.current[currentIndex];
    if (!activeEl) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    if (!lineHeightRef.current) {
      for (let i = 1; i < wordRefs.current.length; i++) {
        const a = wordRefs.current[0]?.getBoundingClientRect();
        const b = wordRefs.current[i]?.getBoundingClientRect();
        if (a && b && Math.abs(b.top - a.top) > 4) {
          lineHeightRef.current = b.top - a.top;
          break;
        }
      }
      if (!lineHeightRef.current) lineHeightRef.current = 44;
    }

    const lh = lineHeightRef.current;
    setClipHeight(3 * lh);
    const activeTop = activeEl.getBoundingClientRect().top - containerRect.top;
    const activeRow = Math.round(activeTop / lh);
    setRowOffset(Math.max(0, activeRow - 1) * lh);
  }, [currentIndex, words]);

  useEffect(() => {
    lineHeightRef.current = null;
    setRowOffset(0);
  }, [words]);

  return (
    <div style={{ height: clipHeight, overflow: "hidden" }}>
      <div
        ref={containerRef}
        className="pointer-events-none flex flex-wrap gap-x-3 gap-y-2 font-mono text-xl leading-relaxed select-none"
        style={{
          transform: `translateY(-${rowOffset}px)`,
          transition: "transform 0.15s ease",
        }}
      >
        {words.map((word, wi) => {
          const state = wordStates[wi];
          const isActive = state === "active";
          const isLockedError = state === "locked-error";

          let content: React.ReactNode;
          if (isActive) {
            content = (
              <ActiveWord
                word={word}
                currentInput={currentInput}
                caretStyle={caretStyle}
              />
            );
          } else if (isLockedError) {
            content = (
              <LockedErrorWord word={word} typed={lockedInputs[wi] ?? ""} />
            );
          } else {
            content = <StaticWord word={word} />;
          }

          const baseClass = isActive
            ? "text-text-primary"
            : isLockedError
              ? ""
              : state === "locked-correct"
                ? "text-signal text-glow"
                : "text-char-upcoming";

          return (
            <span
              key={wi}
              ref={(el) => {
                wordRefs.current[wi] = el;
              }}
              className={`relative ${baseClass}`}
            >
              {content}
            </span>
          );
        })}
      </div>
    </div>
  );
}
