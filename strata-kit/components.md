# STRATA — Component recipes

Copy-paste HTML + Tailwind (via `tailwind.preset.js`). Every class resolves to a
CSS variable from `tokens.css`, so these track the theme. Where a project isn't
on Tailwind, the plain-CSS equivalents are noted — they use the same variables.

> Assumes `tokens.css` is imported once, the fonts are loaded (see README), and
> the root carries `bg-ink text-text-primary font-body`.

---

## 0. Root shell

```html
<div class="bg-ink text-text-primary font-body min-h-full antialiased">
  <div class="px-md py-lg mx-auto max-w-[720px]">
    <!-- header · telemetry · search · missions · patches · footer -->
  </div>
</div>
```

Global focus ring (put in `tokens.css` or a base layer — do NOT rely on
per-component focus styles):

```css
*:focus-visible {
  outline: 2px solid var(--strata-accent);
  outline-offset: 2px;
}
```

---

## 1. Header + rank strip

The one place Fraunces appears. Eyebrow is mono caps in amber; rank is mono,
right-aligned.

```html
<header class="mb-lg flex flex-wrap items-end justify-between gap-3">
  <div>
    <div class="font-data tracking-data text-accent text-[11px] uppercase">
      Field Research Console
    </div>
    <div class="font-display text-[28px] font-semibold">STRATA</div>
  </div>
  <div class="text-right">
    <div class="font-data tracking-data text-text-muted text-[11px] uppercase">
      Current rank
    </div>
    <div class="font-data tracking-data text-accent text-[16px] font-semibold">
      Specialist
      <span class="text-text-muted font-normal">· 240/350 XP</span>
    </div>
  </div>
</header>
```

---

## 2. Telemetry stat block

Mono caps label; large mono value in the value's semantic colour. Four across,
wrapping. Use `tabular-nums` so digits don't jitter.

```html
<div
  class="mb-md gap-md border-line bg-panel p-md flex flex-wrap rounded-md border"
>
  <!-- one stat -->
  <div class="min-w-[110px] flex-1">
    <div class="font-data tracking-data text-text-muted text-[11px] uppercase">
      Progress
    </div>
    <div
      class="font-data text-accent mt-1 text-[24px] font-semibold tabular-nums"
    >
      62%
    </div>
  </div>
  <div class="min-w-[110px] flex-1">
    <div class="font-data tracking-data text-text-muted text-[11px] uppercase">
      Topics cleared
    </div>
    <div
      class="font-data text-status-info mt-1 text-[24px] font-semibold tabular-nums"
    >
      3/6
    </div>
  </div>
  <div class="min-w-[110px] flex-1">
    <div class="font-data tracking-data text-text-muted text-[11px] uppercase">
      Streak
    </div>
    <div class="text-status-streak mt-1 text-[24px] font-semibold">🔥 4d</div>
  </div>
  <div class="min-w-[110px] flex-1">
    <div class="font-data tracking-data text-text-muted text-[11px] uppercase">
      Total XP
    </div>
    <div
      class="font-data text-status-complete mt-1 text-[24px] font-semibold tabular-nums"
    >
      240
    </div>
  </div>
</div>
```

Colour map: progress → `accent`, cleared → `status-info`, streak →
`status-streak`, XP → `status-complete`.

---

## 3. Status glyph

The shared "state" mark. Three states, always paired with text elsewhere in the
row — never colour-only.

| State       | Glyph            | Colour            |
| ----------- | ---------------- | ----------------- |
| not-started | hollow ring      | `line`            |
| in-progress | ring, 25%-filled | `accent`          |
| complete    | check            | `status-complete` |

```html
<!-- not-started -->
<span
  class="border-line inline-block h-[18px] w-[18px] rounded-full border-2"
></span>
<!-- in-progress -->
<span
  class="border-accent bg-accent/25 inline-block h-[18px] w-[18px] rounded-full border-2"
></span>
<!-- complete (with lucide/heroicon check inside) -->
<span
  class="text-status-complete inline-flex h-[18px] w-[18px] items-center justify-center rounded-full"
  >✓</span
>
```

---

## 4. Search / terminal input

```html
<div class="mb-md relative">
  <span
    class="text-text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
    >⌕</span
  >
  <input
    type="text"
    placeholder="Search topics or objectives…"
    class="border-line bg-panel text-text-primary placeholder:text-text-muted caret-accent focus-visible:border-accent w-full rounded-md border py-2.5 pr-3 pl-9 text-[14px]"
  />
</div>
```

The amber caret (`caret-accent`) is a small but on-brand detail — the terminal
cursor of the console.

---

## 5. Mission row (collapsible parent)

Status dot + title + `done/total` mono count + chevron. The whole row is a
`<button>`.

```html
<div class="border-line bg-panel overflow-hidden rounded-md border">
  <button
    type="button"
    aria-expanded="true"
    class="duration-fast ease-strata hover:bg-panel-hover flex w-full items-center gap-2.5 px-3.5 py-3 text-left transition-colors"
  >
    <!-- status glyph (in-progress) -->
    <span
      class="border-accent bg-accent/25 h-[18px] w-[18px] shrink-0 rounded-full border-2"
    ></span>
    <span class="flex-1 text-[14px] font-medium">React Architecture</span>
    <span
      class="font-data tracking-data text-text-muted text-[12px] tabular-nums"
      >2/4</span
    >
    <span class="text-text-muted">▾</span>
  </button>

  <!-- objective list, revealed when expanded -->
  <div class="border-line border-t">
    <!-- objective rows (§6) -->
  </div>
</div>
```

---

## 6. Objective row (child)

Two-digit **mono sequence number** (order is real here), status glyph, title, XP.
Complete items go muted + strikethrough. Wrap the glyph in `.stamp` on the tick
that just completed.

```html
<button
  type="button"
  class="duration-fast ease-strata hover:bg-panel-hover flex w-full items-center gap-2.5 py-2.5 pr-3.5 pl-[30px] text-left transition-colors"
>
  <span
    class="font-data tracking-data text-text-muted w-[18px] text-[11px] tabular-nums"
    >01</span
  >
  <span class="strata-stamp flex">
    <!-- status glyph -->
    <span
      class="border-accent bg-accent/25 h-[18px] w-[18px] rounded-full border-2"
    ></span>
  </span>
  <span class="flex-1 text-[13.5px]">Reconciliation &amp; fiber internals</span>
  <span class="font-data tracking-data text-text-muted text-[11px] tabular-nums"
    >+35 XP</span
  >
</button>
```

Completed variant — swap the middle glyph to the check, and:

```html
<span class="text-text-muted flex-1 text-[13.5px] line-through">…title…</span>
<span class="text-status-complete …">+35 XP</span>
```

**The stamp** (add to `tokens.css` if not using the Tailwind `animate-stamp`):

```css
.strata-stamp {
  animation: strata-stamp 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes strata-stamp {
  0% {
    transform: scale(0.85);
    opacity: 0.4;
  }
  60% {
    transform: scale(1.12);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .strata-stamp {
    animation: none;
  }
}
```

Apply `strata-stamp` for one tick (~280ms) only on the item that just became
complete, then remove the class.

---

## 7. Achievement patch

Locked = 50% opacity + neutral border. Unlocked = amber border + amber-soft
fill. Grid of auto-fit cards.

```html
<div
  class="grid [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] gap-2.5"
>
  <!-- locked -->
  <div
    class="border-line bg-panel-hover duration-fast ease-strata flex gap-2.5 rounded-md border p-3 opacity-50 transition-all"
  >
    <span class="text-text-muted">🔒</span>
    <div>
      <div class="text-text-muted text-[13px] font-semibold">
        Mission Complete
      </div>
      <div class="text-text-muted mt-0.5 text-[11.5px]">
        Clear every objective in one topic.
      </div>
    </div>
  </div>

  <!-- unlocked -->
  <div
    class="border-accent bg-accent-soft duration-fast ease-strata flex gap-2.5 rounded-md border p-3 transition-all"
  >
    <span class="text-accent">🏆</span>
    <div>
      <div class="text-accent text-[13px] font-semibold">First Entry</div>
      <div class="text-text-muted mt-0.5 text-[11.5px]">
        Log your first completed objective.
      </div>
    </div>
  </div>
</div>
```

---

## 8. Footer / sync line + reset

Mono status text on the left; ghost button on the right (transparent, hairline
border).

```html
<div class="mt-lg border-line pt-md flex items-center justify-between border-t">
  <span class="font-data tracking-data text-text-muted text-[11px]"
    >Synced</span
  >
  <button
    type="button"
    class="border-line font-data tracking-data text-text-muted duration-fast ease-strata hover:bg-panel-hover flex items-center gap-1.5 rounded-sm border bg-transparent px-2.5 py-1.5 text-[11px] transition-colors"
  >
    ↺ Reset progress
  </button>
</div>
```

Sync states: `Synced` (idle) · `Syncing…` (in flight) · `Sync failed — progress
kept locally this session` (error, still reassuring, no apology).

---

## Buttons — the general grammar

STRATA has no filled "primary" button by default; the accent is a _signal_, not
a CTA colour. Three tiers:

- **Ghost** (default action): `border border-line bg-transparent hover:bg-panel-hover`.
- **Accent** (rare, the single most important action on a screen):
  `bg-accent text-text-on-accent hover:brightness-95` — use at most once per view.
- **Danger** (destructive): `border border-status-streak/40 text-status-streak
hover:bg-status-streak/10`.

All buttons: `rounded-sm`, `font-data tracking-data`, real `<button>`, visible
focus ring inherited from the global `*:focus-visible`.
