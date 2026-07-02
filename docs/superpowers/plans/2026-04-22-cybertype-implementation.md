# CYBERTYPE Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional cyberpunk typing test app (React 18 + Vite + Tailwind + Recharts) with Time and Words modes, word-locking, pause/resume, and a results screen.

**Architecture:** App.jsx holds top-level view/mode/pause state and passes callbacks down. useTypingEngine owns word state. useTimer owns the clock. useMousePause wires global mousemove + blur → pause. No router — just a `view` state variable toggling 'typing' / 'results'.

**Tech Stack:** React 18, Vite, Tailwind CSS v3, Recharts, JetBrains Mono (Google Fonts)

---

## Chunk 1: Project Scaffold + Static Shell

### Task 1: Scaffold Vite + React + Tailwind

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `index.html`
- Create: `src/main.jsx`, `src/App.jsx`, `src/index.css`

- [ ] **Step 1: Create project via Vite**

```bash
npm create vite@latest . -- --template react
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npm install recharts
npx tailwindcss init -p
```

- [ ] **Step 3: Configure tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        orange: {
          500: '#f97316',
          600: '#ea580c',
          900: '#7c2d12',
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Set up src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;500&display=swap');

.hud-grid {
  background-image: radial-gradient(circle, rgba(234,88,12,0.05) 1px, transparent 1px);
  background-size: 30px 30px;
}
.text-glow {
  text-shadow: 0 0 10px rgba(234, 88, 12, 0.5);
}
.caret {
  width: 2px;
  background-color: #f97316;
  box-shadow: 0 0 8px #f97316;
  animation: blink 1s infinite steps(2);
}
@keyframes blink {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}
```

- [ ] **Step 5: Run dev server to verify scaffold works**

```bash
npm run dev
```
Expected: Vite dev server starts at http://localhost:5173 with no errors.

- [ ] **Step 6: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Vite + React + Tailwind + Recharts"
```

---

## Chunk 2: Utils — Words + Stats

### Task 2: wordList.js — 1000 common English words

**Files:**
- Create: `src/utils/wordList.js`

- [ ] **Step 1: Write wordList.js**

```js
// ~200 common words (expand to 1000 for production)
export const wordList = [
  'the','be','to','of','and','a','in','that','have','it',
  'for','not','on','with','he','as','you','do','at','this',
  'but','his','by','from','they','we','say','her','she','or',
  'an','will','my','one','all','would','there','their','what','so',
  'up','out','if','about','who','get','which','go','me','when',
  'make','can','like','time','no','just','him','know','take','people',
  'into','year','your','good','some','could','them','see','other','than',
  'then','now','look','only','come','its','over','think','also','back',
  'after','use','two','how','our','work','first','well','way','even',
  'new','want','because','any','these','give','day','most','us','great',
  // ... expand as needed
];
```

> **Note:** Expand wordList to at least 1000 words for real usage. The array above is a seed — copy a comprehensive English frequency list.

- [ ] **Step 2: Expand wordList to at least 500 unique words**

Copy a standard English frequency word list (e.g., from [MIT 10k common words](https://www.mit.edu/~ecprice/wordlist.10000) or similar). Paste as a plain JS array export. Aim for 500–1000 entries so time-mode tests never repeat words.

- [ ] **Step 3: Commit**

```bash
git add src/utils/wordList.js
git commit -m "feat: add wordList utility"
```

### Task 3: generateWords.js

**Files:**
- Create: `src/utils/generateWords.js`

- [ ] **Step 1: Write generateWords.js**

```js
import { wordList } from './wordList'

/**
 * Returns an array of `count` randomly picked words from the word list.
 * For time mode, pick a large buffer (e.g., 200 words).
 */
export function generateWords(count) {
  const shuffled = [...wordList].sort(() => Math.random() - 0.5)
  // If count > list length, allow repeats
  if (count <= shuffled.length) return shuffled.slice(0, count)
  const result = []
  while (result.length < count) result.push(...shuffled)
  return result.slice(0, count)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/generateWords.js
git commit -m "feat: add generateWords utility"
```

### Task 4: calcStats.js

**Files:**
- Create: `src/utils/calcStats.js`

- [ ] **Step 1: Write calcStats.js**

```js
/**
 * @param {number} correctChars  — chars typed correctly across all locked-correct words
 * @param {number} totalTypedChars — all chars typed (including errors)
 * @param {number} elapsedSeconds — time mode: duration - remaining; words mode: count-up
 * @returns {{ wpm, rawWpm, accuracy }}
 */
export function calcStats(correctChars, totalTypedChars, elapsedSeconds) {
  if (elapsedSeconds === 0) return { wpm: 0, rawWpm: 0, accuracy: 100 }
  const minutes = elapsedSeconds / 60
  const wpm = Math.round((correctChars / 5) / minutes)
  const rawWpm = Math.round((totalTypedChars / 5) / minutes)
  const accuracy = totalTypedChars === 0
    ? 100
    : Math.round((correctChars / totalTypedChars) * 100)
  return { wpm, rawWpm, accuracy }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/calcStats.js
git commit -m "feat: add calcStats utility"
```

---

## Chunk 3: Hooks

### Task 5: useTimer.js

**Files:**
- Create: `src/hooks/useTimer.js`

- [ ] **Step 1: Write useTimer.js**

```js
import { useState, useEffect, useRef } from 'react'

/**
 * mode: 'time' | 'words'
 * duration: number (seconds for time mode, ignored for words mode)
 * isRunning: boolean
 * isPaused: boolean
 * onEnd: () => void — called when countdown hits 0 (time mode only)
 */
export function useTimer({ mode, duration, isRunning, isPaused, onEnd }) {
  // time mode: counts down; words mode: counts up
  const [elapsed, setElapsed] = useState(0)
  const [remaining, setRemaining] = useState(duration)
  const intervalRef = useRef(null)

  // Reset when duration or mode changes (new test)
  useEffect(() => {
    setElapsed(0)
    setRemaining(duration)
  }, [duration, mode])

  useEffect(() => {
    if (!isRunning || isPaused) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      if (mode === 'time') {
        setRemaining(prev => {
          const next = prev - 1
          if (next <= 0) {
            clearInterval(intervalRef.current)
            onEnd()
            return 0
          }
          return next
        })
        setElapsed(prev => prev + 1)
      } else {
        setElapsed(prev => prev + 1)
      }
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning, isPaused, mode, onEnd])

  return { elapsed, remaining }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useTimer.js
git commit -m "feat: add useTimer hook"
```

### Task 6: useMousePause.js

**Files:**
- Create: `src/hooks/useMousePause.js`

- [ ] **Step 1: Write useMousePause.js**

```js
import { useEffect } from 'react'

/**
 * phase: 'idle' | 'running' | 'finished'
 * setIsPaused: (boolean) => void
 *
 * Triggers pause on mousemove or window blur, only during 'running' phase.
 */
export function useMousePause({ phase, setIsPaused }) {
  useEffect(() => {
    const handleMouseMove = () => {
      if (phase === 'running') setIsPaused(true)
    }
    const handleBlur = () => {
      if (phase === 'running') setIsPaused(true)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('blur', handleBlur)
    }
  }, [phase, setIsPaused])
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useMousePause.js
git commit -m "feat: add useMousePause hook"
```

### Task 7: useTypingEngine.js

**Files:**
- Create: `src/hooks/useTypingEngine.js`

- [ ] **Step 1: Write useTypingEngine.js**

```js
import { useState, useCallback } from 'react'
import { calcStats } from '../utils/calcStats'

/**
 * words: string[] — the word list for this test
 * mode: 'time' | 'words'
 * isPaused: boolean
 * getElapsed: () => number — returns current elapsed seconds (via ref to avoid stale closure)
 * duration: number — test duration setting
 * onTestEnd: (result) => void
 */
export function useTypingEngine({ words, mode, isPaused, getElapsed, duration, onTestEnd }) {
  // wordStates: 'pending' | 'active' | 'locked-correct' | 'locked-error'
  const [wordStates, setWordStates] = useState(() => words.map((_, i) => i === 0 ? 'active' : 'pending'))
  const [currentInput, setCurrentInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState('idle') // 'idle' | 'running' | 'finished'
  const [wpmHistory, setWpmHistory] = useState([])
  // Char counters (incremented on word lock)
  const [correctChars, setCorrectChars] = useState(0)
  const [totalTypedChars, setTotalTypedChars] = useState(0)

  const reset = useCallback((newWords) => {
    setWordStates(newWords.map((_, i) => i === 0 ? 'active' : 'pending'))
    setCurrentInput('')
    setCurrentIndex(0)
    setPhase('idle')
    setWpmHistory([])
    setCorrectChars(0)
    setTotalTypedChars(0)
  }, [])

  const endTest = useCallback(() => {
    setPhase('finished')
    const currentElapsed = getElapsed()
    const { wpm, rawWpm, accuracy } = calcStats(correctChars, totalTypedChars, currentElapsed || 1)
    onTestEnd({
      wpm,
      rawWpm,
      accuracy,
      errors: wordStates.filter(s => s === 'locked-error').length,
      duration: currentElapsed,
      wpmHistory,
      mode,
    })
  }, [getElapsed, correctChars, totalTypedChars, wpmHistory, wordStates, onTestEnd, mode])

  // Called every second by timer via useEffect in consumer
  const recordWpmSnapshot = useCallback(() => {
    if (phase !== 'running') return
    const currentElapsed = getElapsed()
    const { wpm } = calcStats(correctChars, totalTypedChars, currentElapsed || 1)
    setWpmHistory(prev => [...prev, { second: currentElapsed, wpm }])
  }, [phase, correctChars, totalTypedChars, getElapsed])

  const handleKeyDown = useCallback((e) => {
    const key = e.key
    if (isPaused || phase === 'finished') return

    // Start test on first key
    if (phase === 'idle' && key !== 'Tab' && key !== 'Escape') {
      setPhase('running')
    }

    if (key === 'Tab') {
      e.preventDefault()
      // Reset handled by parent via reset()
      return
    }
    if (key === 'Escape') {
      reset(words)
      return
    }

    if (phase === 'idle') return // don't process Tab/Esc again

    if (key === ' ') {
      e.preventDefault()
      const expected = words[currentIndex]
      const isCorrect = currentInput === expected
      const newStates = [...wordStates]
      newStates[currentIndex] = isCorrect ? 'locked-correct' : 'locked-error'

      // Count chars
      const typed = currentInput.length
      const correct = isCorrect ? typed : 0
      setTotalTypedChars(prev => prev + typed)
      setCorrectChars(prev => prev + correct)

      const isLast = currentIndex === words.length - 1
      if (isLast && mode === 'words') {
        setWordStates(newStates)
        setCurrentInput('')
        endTest()
        return
      }

      newStates[currentIndex + 1] = 'active'
      setWordStates(newStates)
      setCurrentInput('')
      setCurrentIndex(prev => prev + 1)
      return
    }

    if (key === 'Backspace') {
      if (currentInput.length === 0) return // blocked at word boundary
      setCurrentInput(prev => prev.slice(0, -1))
      return
    }

    // Regular char — only single printable chars
    if (key.length === 1) {
      setCurrentInput(prev => prev + key)
    }
  }, [isPaused, phase, words, currentIndex, currentInput, wordStates, mode, endTest, reset])

  return {
    wordStates,
    currentInput,
    currentIndex,
    phase,
    wpmHistory,
    correctChars,
    totalTypedChars,
    handleKeyDown,
    recordWpmSnapshot,
    endTest,   // exposed so App.jsx can call it from useTimer's onEnd
    reset,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useTypingEngine.js
git commit -m "feat: add useTypingEngine hook"
```

---

## Chunk 4: Components — Typing Screen

### Task 8: Header.jsx + ModeSelector.jsx

**Files:**
- Create: `src/components/Header.jsx`
- Create: `src/components/ModeSelector.jsx`

- [ ] **Step 1: Write ModeSelector.jsx**

```jsx
// src/components/ModeSelector.jsx
// Props: mode, duration, onModeChange, onDurationChange, disabled (during active test)

const TIME_OPTIONS = [15, 30, 60]
const WORD_OPTIONS = [10, 25, 50, 100]

export function ModeSelector({ mode, duration, onModeChange, onDurationChange, disabled }) {
  const options = mode === 'time' ? TIME_OPTIONS : WORD_OPTIONS
  return (
    <div className="flex items-center gap-3 font-mono text-sm">
      {/* Mode toggle */}
      <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        {['time', 'words'].map(m => (
          <button
            key={m}
            onClick={() => !disabled && onModeChange(m)}
            className={`px-4 py-1.5 transition-colors ${
              mode === m
                ? 'bg-orange-600 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {m}
          </button>
        ))}
      </div>
      {/* Duration picker */}
      <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => !disabled && onDurationChange(opt)}
            className={`px-3 py-1.5 transition-colors ${
              duration === opt
                ? 'text-orange-500'
                : 'text-zinc-500 hover:text-zinc-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write Header.jsx**

```jsx
// src/components/Header.jsx
import { ModeSelector } from './ModeSelector'

export function Header({ mode, duration, onModeChange, onDurationChange, disabled }) {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-800/50">
      <div className="font-mono font-bold text-orange-600 text-xl tracking-tight text-glow">
        CYBERTYPE
      </div>
      <ModeSelector
        mode={mode}
        duration={duration}
        onModeChange={onModeChange}
        onDurationChange={onDurationChange}
        disabled={disabled}
      />
    </header>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.jsx src/components/ModeSelector.jsx
git commit -m "feat: add Header and ModeSelector components"
```

### Task 9: LiveStats.jsx

**Files:**
- Create: `src/components/LiveStats.jsx`

- [ ] **Step 1: Write LiveStats.jsx**

```jsx
// src/components/LiveStats.jsx
// Props: wpm, accuracy, timeDisplay, mode, isPaused

export function LiveStats({ wpm, accuracy, timeDisplay, mode, isPaused }) {
  return (
    <div className={`flex items-center gap-8 px-2 pb-3 font-mono text-sm transition-opacity ${
      isPaused ? 'opacity-20' : 'opacity-100'
    }`}>
      <div>
        <span className="text-zinc-600 text-xs uppercase tracking-widest mr-2">wpm</span>
        <span className="text-orange-500 font-bold">{wpm}</span>
      </div>
      <div>
        <span className="text-zinc-600 text-xs uppercase tracking-widest mr-2">acc</span>
        <span className="text-zinc-300">{accuracy}%</span>
      </div>
      <div>
        <span className="text-zinc-600 text-xs uppercase tracking-widest mr-2">
          {mode === 'time' ? 'time' : 'elapsed'}
        </span>
        <span className="text-zinc-400">{timeDisplay}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LiveStats.jsx
git commit -m "feat: add LiveStats component"
```

### Task 10: WordDisplay.jsx + Caret.jsx

**Files:**
- Create: `src/components/WordDisplay.jsx`
- Create: `src/components/Caret.jsx`

- [ ] **Step 1: Write Caret.jsx**

```jsx
// src/components/Caret.jsx
export function Caret() {
  return <span className="caret inline-block h-[1.2em] align-middle mx-px" />
}
```

- [ ] **Step 2: Write WordDisplay.jsx**

Each word is rendered as a `<span>` of chars. The active word shows a caret after the last typed char. Locked words are immutable (visual only).

```jsx
// src/components/WordDisplay.jsx
import { Caret } from './Caret'

const STATE_CLASS = {
  'pending':        'text-zinc-700',
  'active':         'text-zinc-200',
  'locked-correct': 'text-orange-500 text-glow',
  'locked-error':   'text-red-500 underline decoration-red-800 underline-offset-4',
}

function WordChar({ expected, typed, isActive, charIndex, inputLength }) {
  // typed char exists → show it colored; else show expected char dimmed
  if (!isActive) {
    return <span>{expected}</span>
  }
  if (charIndex < inputLength) {
    const isCorrect = typed === expected
    return (
      <span className={isCorrect ? 'text-orange-400' : 'text-red-400'}>
        {expected}
      </span>
    )
  }
  // Not yet typed
  return <span className="text-zinc-600">{expected}</span>
}

export function WordDisplay({ words, wordStates, currentInput, currentIndex }) {
  return (
    <div
      className="font-mono text-xl leading-relaxed select-none pointer-events-none flex flex-wrap gap-x-3 gap-y-2"
    >
      {words.map((word, wi) => {
        const state = wordStates[wi]
        const isActive = state === 'active'
        return (
          <span key={wi} className={`relative ${STATE_CLASS[state]}`}>
            {word.split('').map((char, ci) => (
              <WordChar
                key={ci}
                expected={char}
                typed={isActive ? currentInput[ci] : undefined}
                isActive={isActive}
                charIndex={ci}
                inputLength={isActive ? currentInput.length : 0}
              />
            ))}
            {/* Caret: renders after last typed char in active word */}
            {isActive && (
              <span className="relative inline-block">
                {currentInput.length < word.length
                  ? null
                  : <Caret />}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
```

> **Note:** This renders a caret at the end of the word when all chars typed. A more precise caret position (between chars) can be added later by inserting `<Caret />` between char spans at `currentInput.length`.

- [ ] **Step 3: Commit**

```bash
git add src/components/WordDisplay.jsx src/components/Caret.jsx
git commit -m "feat: add WordDisplay and Caret components"
```

### Task 11: PauseOverlay.jsx

**Files:**
- Create: `src/components/PauseOverlay.jsx`

- [ ] **Step 1: Write PauseOverlay.jsx**

```jsx
// src/components/PauseOverlay.jsx
export function PauseOverlay({ onResume }) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer"
      onClick={onResume}
    >
      <div className="font-mono text-orange-500 text-lg font-bold tracking-widest uppercase text-glow">
        paused
      </div>
      <div className="font-mono text-zinc-600 text-xs mt-2">
        click or press any key to resume
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PauseOverlay.jsx
git commit -m "feat: add PauseOverlay component"
```

### Task 12: TypingArena.jsx

**Files:**
- Create: `src/components/TypingArena.jsx`

- [ ] **Step 1: Write TypingArena.jsx**

This is the main container: hidden input, WordDisplay, PauseOverlay, and focus management.

```jsx
// src/components/TypingArena.jsx
import { useRef, useEffect } from 'react'
import { WordDisplay } from './WordDisplay'
import { PauseOverlay } from './PauseOverlay'
import { LiveStats } from './LiveStats'

export function TypingArena({
  words, wordStates, currentInput, currentIndex,
  isPaused, setIsPaused,
  handleKeyDown,
  wpm, accuracy, timeDisplay, mode,
}) {
  const inputRef = useRef(null)

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleResume = () => {
    setIsPaused(false)
    inputRef.current?.focus()
  }

  const handleArenaClick = () => {
    if (isPaused) {
      handleResume()
    } else {
      inputRef.current?.focus()
    }
  }

  const handleKeyDownWrapper = (e) => {
    if (isPaused) {
      // Any key resumes
      setIsPaused(false)
      return
    }
    handleKeyDown(e)
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <LiveStats wpm={wpm} accuracy={accuracy} timeDisplay={timeDisplay} mode={mode} isPaused={isPaused} />
      <div
        className="relative cursor-text"
        onClick={handleArenaClick}
      >
        {/* Hidden input captures all keyboard events */}
        <input
          ref={inputRef}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
          onKeyDown={handleKeyDownWrapper}
          onChange={() => {}} // controlled
          value={currentInput}
          readOnly={isPaused}
          aria-label="typing input"
        />
        {/* Word display area */}
        <div
          className={`transition-all duration-200 ${isPaused ? 'blur-sm' : ''}`}
          style={{ filter: isPaused ? 'blur(5px)' : 'none' }}
        >
          <WordDisplay
            words={words}
            wordStates={wordStates}
            currentInput={currentInput}
            currentIndex={currentIndex}
          />
        </div>
        {/* Pause overlay */}
        {isPaused && <PauseOverlay onResume={handleResume} />}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TypingArena.jsx
git commit -m "feat: add TypingArena component"
```

---

## Chunk 5: Results Screen

### Task 13: WpmLineChart.jsx

**Files:**
- Create: `src/components/WpmLineChart.jsx`

- [ ] **Step 1: Write WpmLineChart.jsx**

```jsx
// src/components/WpmLineChart.jsx
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-orange-600/40 rounded-lg px-3 py-2 font-mono text-xs">
      <div className="text-zinc-500">second {label}</div>
      <div className="text-orange-500 font-bold text-sm">{payload[0].value} wpm</div>
    </div>
  )
}

export function WpmLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <defs>
          <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="second"
          tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ea580c', strokeOpacity: 0.3, strokeDasharray: '4 4' }} />
        <Area
          type="monotone"
          dataKey="wpm"
          stroke="#f97316"
          strokeWidth={2}
          fill="url(#wpmGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#f97316', filter: 'drop-shadow(0 0 6px #f97316)' }}
          strokeLinecap="round"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WpmLineChart.jsx
git commit -m "feat: add WpmLineChart with Recharts"
```

### Task 14: ResultsScreen.jsx

**Files:**
- Create: `src/components/ResultsScreen.jsx`

- [ ] **Step 1: Write ResultsScreen.jsx**

```jsx
// src/components/ResultsScreen.jsx
import { WpmLineChart } from './WpmLineChart'

function StatCard({ label, value, valueClass = 'text-zinc-200' }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-1">{label}</div>
      <div className={`font-mono text-2xl font-bold ${valueClass}`}>{value}</div>
    </div>
  )
}

export function ResultsScreen({ result, onRetry, onNew }) {
  const { wpm, rawWpm, accuracy, errors, duration, wpmHistory, mode } = result

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      {/* Primary WPM */}
      <div className="mb-8">
        <div className="font-mono text-xs text-orange-600 uppercase tracking-widest mb-1">wpm</div>
        <div className="font-mono text-7xl font-bold text-orange-500 text-glow leading-none">{wpm}</div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="accuracy" value={`${accuracy}%`} />
        <StatCard label="errors" value={errors} valueClass="text-red-400" />
        <StatCard label="raw wpm" value={rawWpm} />
        <StatCard label={mode === 'time' ? 'duration' : 'time'} value={`${duration}s`} />
      </div>

      {/* WPM Chart */}
      {wpmHistory.length > 1 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8">
          <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-3">wpm over time</div>
          <WpmLineChart data={wpmHistory} />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="font-mono text-sm px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
        >
          retry same
        </button>
        <button
          onClick={onNew}
          className="font-mono text-sm px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700"
        >
          new test
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ResultsScreen.jsx
git commit -m "feat: add ResultsScreen component"
```

---

## Chunk 6: App.jsx Wiring + Footer

### Task 15: Footer.jsx

**Files:**
- Create: `src/components/Footer.jsx`

- [ ] **Step 1: Write Footer.jsx**

```jsx
// src/components/Footer.jsx
export function Footer() {
  return (
    <footer className="text-center font-mono text-xs text-zinc-700 py-6">
      cybertype · tab to restart · esc to reset
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.jsx
git commit -m "feat: add Footer component"
```

### Task 16: App.jsx — Full Wiring

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Write App.jsx**

```jsx
// src/App.jsx
import { useState, useCallback, useEffect, useRef } from 'react'
import { Header } from './components/Header'
import { TypingArena } from './components/TypingArena'
import { ResultsScreen } from './components/ResultsScreen'
import { Footer } from './components/Footer'
import { useTypingEngine } from './hooks/useTypingEngine'
import { useTimer } from './hooks/useTimer'
import { useMousePause } from './hooks/useMousePause'
import { generateWords } from './utils/generateWords'
import { calcStats } from './utils/calcStats'

const TIME_WORD_BUFFER = 200

function getInitialWords(mode, duration) {
  return mode === 'time'
    ? generateWords(TIME_WORD_BUFFER)
    : generateWords(duration)
}

export default function App() {
  const [view, setView] = useState('typing') // 'typing' | 'results'
  const [mode, setMode] = useState('time')
  const [duration, setDuration] = useState(30)
  const [isPaused, setIsPaused] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [words, setWords] = useState(() => getInitialWords('time', 30))

  const handleTestEnd = useCallback((result) => {
    setTestResult(result)
    setView('results')
  }, [])

  const elapsedRef = useRef(0)
  const getElapsed = useCallback(() => elapsedRef.current, [])

  const engine = useTypingEngine({
    words,
    mode,
    isPaused,
    getElapsed,
    duration,
    onTestEnd: handleTestEnd,
  })

  const { elapsed, remaining } = useTimer({
    mode,
    duration,
    isRunning: engine.phase === 'running',
    isPaused,
    onEnd: () => engine.endTest ? engine.endTest() : handleTestEnd({
      wpm: 0, rawWpm: 0, accuracy: 100, errors: 0,
      duration, wpmHistory: engine.wpmHistory, mode,
    }),
  })

  // Sync elapsed to engine
  useEffect(() => {
    elapsedRef.current = elapsed
  }, [elapsed])

  // Record WPM snapshot each second
  useEffect(() => {
    if (engine.phase === 'running' && !isPaused) {
      engine.recordWpmSnapshot()
    }
  }, [elapsed])

  useMousePause({ phase: engine.phase, setIsPaused })

  // Compute live stats
  const { wpm, accuracy } = calcStats(engine.correctChars, engine.totalTypedChars, elapsed || 1)
  const timeDisplay = mode === 'time' ? `${remaining}s` : `${elapsed}s`

  const handleReset = useCallback((newWords) => {
    setIsPaused(false)
    engine.reset(newWords || words)
  }, [engine, words])

  const handleRetry = useCallback(() => {
    setView('typing')
    handleReset(words)
  }, [words, handleReset])

  const handleNew = useCallback(() => {
    const newWords = getInitialWords(mode, duration)
    setWords(newWords)
    setView('typing')
    handleReset(newWords)
  }, [mode, duration, handleReset])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    const newDur = newMode === 'time' ? 30 : 25
    setDuration(newDur)
    const newWords = getInitialWords(newMode, newDur)
    setWords(newWords)
    handleReset(newWords)
  }

  const handleDurationChange = (newDur) => {
    setDuration(newDur)
    const newWords = getInitialWords(mode, newDur)
    setWords(newWords)
    handleReset(newWords)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 hud-grid flex flex-col">
      <Header
        mode={mode}
        duration={duration}
        onModeChange={handleModeChange}
        onDurationChange={handleDurationChange}
        disabled={engine.phase === 'running'}
      />
      <main className="flex-1 flex flex-col justify-center py-8">
        {view === 'typing' ? (
          <TypingArena
            words={words}
            wordStates={engine.wordStates}
            currentInput={engine.currentInput}
            currentIndex={engine.currentIndex}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            handleKeyDown={engine.handleKeyDown}
            wpm={wpm}
            accuracy={accuracy}
            timeDisplay={timeDisplay}
            mode={mode}
          />
        ) : (
          <ResultsScreen
            result={testResult}
            onRetry={handleRetry}
            onNew={handleNew}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
```

> **Note:** `useTypingEngine` needs to expose `endTest` directly so App.jsx can call it from the timer's `onEnd`. Refactor `useTypingEngine` to return `endTest` in its return object, and wire `elapsed` as a ref to avoid stale closure issues. See the note below.

- [ ] **Step 2: Add Tab global listener for reset in TypingArena**

`useTypingEngine` traps Tab and calls `reset(words)` internally via Escape. For Tab, the engine returns early and expects the parent to call `reset`. Wire this in `TypingArena.jsx` by detecting Tab in `handleKeyDownWrapper`:

```jsx
// In TypingArena.jsx — handleKeyDownWrapper
const handleKeyDownWrapper = (e) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    onTabReset()  // new prop — called from App.jsx
    return
  }
  if (isPaused) {
    setIsPaused(false)
    return
  }
  handleKeyDown(e)
}
```

Add `onTabReset` prop to `TypingArena`. In `App.jsx`, pass `onTabReset={handleRetry}`.

This ensures Tab always resets cleanly regardless of whether the hidden input is focused.

- [ ] **Step 3: Run dev server and smoke-test the full flow**

```bash
npm run dev
```
Expected:
1. Header shows mode selector and duration picker
2. Clicking arena and typing starts the test
3. Mouse movement pauses, click/key resumes
4. Time mode: counts down to 0, shows results
5. Words mode: space on last word shows results
6. Results screen shows WPM, chart, retry/new buttons

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/hooks/useTypingEngine.js
git commit -m "feat: wire App.jsx with all hooks and components"
```

---

## Chunk 7: Build + Polish

### Task 17: Production build check

- [ ] **Step 1: Run build**

```bash
npm run build
```
Expected: `dist/` created with no errors.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```
Expected: App loads at localhost:4173, all features work.

- [ ] **Step 3: Fix any build errors**

Common issues:
- Missing imports (check all component imports)
- Tailwind purge may remove dynamic classes — use `safelist` if needed

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete CYBERTYPE typing test app"
```

---

## Implementation Notes

### getElapsed pattern (already applied in Task 7 + Task 16)

`useTypingEngine` accepts `getElapsed: () => number` (a ref callback) to avoid stale closures when reading elapsed time inside `endTest` and `recordWpmSnapshot`. This is already wired correctly in the plan — no additional refactor needed.

### Recharts AreaChart (already applied in Task 13)

Use `AreaChart` + `Area` from `recharts`. The gradient `<defs>` / `<linearGradient>` / `<stop>` are native SVG/JSX elements — no import needed. This is already correct in Task 13.
