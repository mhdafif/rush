# CYBERTYPE — Design Spec

**Date:** 2026-04-22  
**Stack:** React 18 + Vite + Tailwind CSS  
**Theme:** Cyberpunk dark — zinc-950 background, orange-600 accents, JetBrains Mono font, glow effects, radial-dot HUD grid

---

## 1. Screens

Two views toggled by a React state variable in `App.jsx`. No router.

| State value | Description |
|---|---|
| `'typing'` | Main typing test arena |
| `'results'` | Results screen shown after test ends |

---

## 2. Test Modes

Both modes available. User selects before starting via `ModeSelector` in the header.

| Mode | Options | End condition |
|---|---|---|
| Time | 15s / 30s / 60s | Countdown reaches zero |
| Words | 10 / 25 / 50 / 100 words | Last word is typed and confirmed |

---

## 3. File Structure

```
src/
  components/
    Header.jsx          — logo + ModeSelector
    ModeSelector.jsx    — time/word toggle + duration picker
    TypingArena.jsx     — typing box, hidden input, pause overlay
    WordDisplay.jsx     — renders word list with per-word states
    Caret.jsx           — blinking orange cursor
    LiveStats.jsx       — live WPM + accuracy strip above arena
    PauseOverlay.jsx    — blurred overlay shown when paused
    ResultsScreen.jsx   — results view
    WpmLineChart.jsx    — Recharts LineChart + custom hover tooltip
    Footer.jsx
  hooks/
    useTypingEngine.js  — all typing logic + word-lock on space
    useTimer.js         — countdown/count-up with pause/resume
    useMousePause.js    — global mousemove listener → triggers pause
  utils/
    wordList.js         — ~1000 common English words array
    generateWords.js    — shuffles and picks N words for a test
    calcStats.js        — WPM and accuracy calculation functions
  App.jsx               — view state + isPaused state
  main.jsx
  index.css             — Tailwind base + custom glow/caret/grid styles
tailwind.config.js
vite.config.js
index.html
```

---

## 4. App State (App.jsx)

```js
view        // 'typing' | 'results'
mode        // 'time' | 'words'
duration    // 15 | 30 | 60  OR  10 | 25 | 50 | 100
isPaused    // boolean — controlled by useMousePause
testResult  // object | null — passed to ResultsScreen on completion
```

### testResult object shape

```js
{
  wpm:        number,
  rawWpm:     number,
  accuracy:   number,        // percentage 0–100
  errors:     number,
  duration:   number,        // seconds elapsed
  wpmHistory: Array<{ second: number, wpm: number }>,
  mode:       'time' | 'words',
}
```

Flow:
- Test ends → `setTestResult(result)` + `setView('results')`
- Retry / New test → `setView('typing')` + reset engine state

---

## 5. Word States

Each word in the word list has one of four states, rendered by `WordDisplay.jsx`:

| State | Visual | Editable |
|---|---|---|
| `pending` | zinc-700, dim | No — not yet reached |
| `active` | zinc-200, normal | Yes — currently typing |
| `locked-correct` | orange-500 + glow | No — immutable |
| `locked-error` | red-500 + underline | No — immutable |

---

## 6. Word Lock Behavior

When the user presses **Space**:
1. The current word is evaluated (typed input vs expected word)
2. Word state is set to `locked-correct` or `locked-error`
3. Cursor advances to the next word
4. The locked word **cannot be edited** — backspace cannot reach it

### Backspace Rules

| Situation | Result |
|---|---|
| Cursor inside word (typed chars exist) | Delete last typed char |
| Cursor at word start (nothing typed yet) | Blocked — no-op |
| Previous word is locked | Blocked — no-op |

```js
// useTypingEngine — handleKeyDown
if (isPaused || phase !== 'running') return

if (key === ' ') {
  lockCurrentWord()   // sets state to locked-correct or locked-error
  if (isLastWord && mode === 'words') {
    endTest()         // Space on final word immediately ends the test
  } else {
    advanceToNextWord()
  }
}

if (key === 'Backspace') {
  if (currentInput.length === 0) return  // blocked at boundary
  deleteLastChar()
}
```

---

## 7. Pause / Resume Behavior

Pause is only active during an active test (phase = `running`). Has no effect during idle or results view.

### Pause state machine

```
idle → (first keypress) → running → (mouse moves) → paused → (click arena OR any key) → running
```

### When paused

- Timer is frozen (no tick)
- Keydown events are ignored by the engine
- Typing arena content blurs: `filter: blur(5px)`
- `PauseOverlay` renders over the arena: dark background + "⏸ PAUSED" label + resume hint
- Live stats strip dims to reduced opacity

### To resume

- Click anywhere on the typing arena
- Press any typeable key
- Both re-focus the hidden input and set `isPaused = false`
- Timer resumes from the frozen value
- Blur transitions out smoothly via CSS `transition`

### useMousePause hook

```js
useEffect(() => {
  const handleMouseMove = () => {
    if (phase === 'running') setIsPaused(true)
  }
  const handleBlur = () => {
    if (phase === 'running') setIsPaused(true)  // browser tab/window loses focus
  }
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('blur', handleBlur)
  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('blur', handleBlur)
  }
}, [phase])
```

`isPaused` is passed to both `useTimer` and `useTypingEngine` — both halt when true.

---

## 8. Timer Hook (useTimer.js)

- **Time mode:** counts down from `duration`. Fires `onEnd` when it reaches 0. Pauses when `isPaused = true`.
- **Words mode:** counts up from 0. Stops when engine signals test complete. Pauses when `isPaused = true`.
- Uses `setInterval` cleared on pause and on unmount.
- Every second tick: engine records a `wpmHistory` snapshot.

---

## 9. WPM Calculation

```js
// Correct chars = sum of chars in all locked-correct words
// elapsedSeconds:
//   time mode  → duration - remainingSeconds  (e.g. 60 - 38 = 22s elapsed)
//   words mode → count-up timer value
wpm      = (correctChars / 5) / (elapsedSeconds / 60)
rawWpm   = (totalTypedChars / 5) / (elapsedSeconds / 60)
accuracy = (correctChars / totalTypedChars) * 100
```

On Retry Same: `testResult`, `wpmHistory`, and all engine state are fully reset before the new test begins. The same word list array is reused.

---

## 10. Results Screen

Displays after test ends:

| Element | Detail |
|---|---|
| WPM (large) | Orange, glowing, prominent |
| Accuracy | Secondary stat |
| Errors | Red value |
| Raw WPM | Secondary stat |
| Duration | Seconds elapsed |
| WPM Line Chart | Recharts `LineChart`, orange line + gradient area fill |
| Chart tooltip | Custom component: shows "Second N" + WPM value on hover |
| Retry Same | Restarts same word list + same mode/duration |
| New Test | Generates fresh word list, same mode/duration |

### WpmLineChart.jsx (Recharts)

- `LineChart` with `Line`, `Area`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`
- Custom `Tooltip` component: dark card, orange border, shows `second` and `wpm`
- Line stroke: `#f97316` (orange-500), strokeWidth 2
- Area fill: linear gradient orange → transparent
- Dot on hover: orange with drop-shadow glow
- Vertical reference line on hover: dashed orange at low opacity

---

## 11. Theme & Color Tokens

| Token | Hex | Usage |
|---|---|---|
| zinc-950 | `#09090b` | Page background |
| zinc-900 | `#18181b` | Cards, panels |
| zinc-800 | `#27272a` | Borders |
| zinc-700 | `#3f3f46` | Pending word text |
| orange-600 | `#ea580c` | Primary accent, progress bar |
| orange-500 | `#f97316` | Caret, locked-correct text, chart line |
| red-500 | `#ef4444` | Locked-error text |
| red-400 | `#f87171` | Error count in results |

### Custom CSS (index.css)

```css
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

---

## 12. Keyboard Shortcuts

| Key | Action |
|---|---|
| Any typeable key | Start test (if idle) / Resume (if paused) / Type char |
| Space | Lock current word, advance to next |
| Backspace | Delete last char in current word only |
| Tab | Restart same test (reset engine, same words) |
| Esc | Reset to idle state |

---

## 13. Focus Management

- A hidden `<input>` inside `TypingArena` captures all keyboard events
- Clicking the arena triggers `.focus()` on the hidden input
- On resume (click or keypress while paused), hidden input is re-focused
- The word display area is `user-select: none` and `pointer-events: none`
