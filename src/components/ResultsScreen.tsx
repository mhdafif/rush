import type { TestResult } from "../hooks/useTypingEngine";
import type { BestScore, HistoryEntry } from "../store/settings/ISettingsStore";
import { KeyboardHeatmap } from "./KeyboardHeatmap";
import { WpmLineChart } from "./WpmLineChart";
import { useResultsScreen } from "./useResultsScreen";

interface StatCardProps {
  label: string;
  value: string | number;
  valueClass?: string;
}

function StatCard({
  label,
  value,
  valueClass = "text-zinc-200",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-1 font-mono text-xs tracking-widest text-zinc-600 uppercase">
        {label}
      </div>
      <div className={`font-mono text-2xl font-bold ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ResultsScreenProps {
  result?: TestResult;
  history?: HistoryEntry[];
  best?: BestScore | null;
  onRetry?: () => void;
  onNew?: () => void;
}

export function ResultsScreen(_props: ResultsScreenProps = {}) {
  /*=== Store ===*/

  const { testResult, history, best, onRetry, onNew } = useResultsScreen();
  const result = _props.result ?? testResult;
  const _history = _props.history ?? history;
  const _best = _props.best !== undefined ? _props.best : best;
  const _onRetry = _props.onRetry ?? onRetry ?? (() => {});
  const _onNew = _props.onNew ?? onNew ?? (() => {});

  if (!result) return null;

  const {
    wpm,
    rawWpm,
    accuracy,
    consistency,
    errors,
    duration,
    wpmHistory,
    mode,
    terminated,
    keyErrors,
  } = result;
  const isNewBest =
    _best?.wpm === wpm && (_best?.timestamp ?? 0) >= Date.now() - 3000;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* Terminated banner */}
      {terminated && (
        <div className="mb-6 rounded-lg border border-red-800 bg-red-950/30 px-4 py-3 font-mono text-sm tracking-widest text-red-400 uppercase">
          ☠ terminated — sudden death
        </div>
      )}

      {/* Primary WPM */}
      <div className="mb-8 flex items-end gap-4">
        <div>
          <div className="mb-1 font-mono text-xs tracking-widest text-orange-600 uppercase">
            wpm
          </div>
          <div className="text-glow font-mono text-7xl leading-none font-bold text-orange-500">
            {wpm}
          </div>
        </div>
        {isNewBest && (
          <div className="mb-2 animate-pulse font-mono text-xs tracking-widest text-orange-400 uppercase">
            new best!
          </div>
        )}
      </div>

      {/* Secondary stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="accuracy" value={`${accuracy}%`} />
        <StatCard
          label="consistency"
          value={`${consistency}%`}
          valueClass="text-blue-400"
        />
        <StatCard label="errors" value={errors} valueClass="text-red-400" />
        <StatCard label="raw wpm" value={rawWpm} />
        <StatCard
          label={mode === "time" ? "duration" : "time"}
          value={`${duration}s`}
        />
      </div>

      {/* WPM Chart */}
      {wpmHistory.length > 1 && (
        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 font-mono text-xs tracking-widest text-zinc-600 uppercase">
            wpm over time
          </div>
          <WpmLineChart data={wpmHistory} history={_history} />
        </div>
      )}

      {/* Keyboard Heatmap */}
      {Object.keys(keyErrors).length > 0 && (
        <div className="mb-8 flex flex-col items-center rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-4 self-start font-mono text-xs tracking-widest text-zinc-600 uppercase">
            key errors
          </div>
          <KeyboardHeatmap keyErrors={keyErrors} />
        </div>
      )}

      {/* Best + History */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Best score */}
        {_best && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-3 font-mono text-xs tracking-widest text-orange-600 uppercase">
              personal best
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-orange-500">
                {_best.wpm}
              </span>
              <span className="font-mono text-xs text-zinc-600">wpm</span>
              <span className="ml-auto font-mono text-xs text-zinc-700">
                {_best.accuracy}% acc
              </span>
            </div>
            <div className="mt-1 font-mono text-xs text-zinc-700">
              {_best.mode} · {_best.lang.toUpperCase()} ·{" "}
              {formatDate(_best.timestamp)}
            </div>
          </div>
        )}

        {/* History */}
        {_history.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-3 font-mono text-xs tracking-widest text-zinc-600 uppercase">
              recent
            </div>
            <div className="flex flex-col gap-1.5">
              {_history.map((h) => (
                <div key={h.id} className="flex items-center font-mono text-xs">
                  <span className="w-10 text-zinc-300 tabular-nums">
                    {h.wpm}
                  </span>
                  <span className="mr-3 text-zinc-600">wpm</span>
                  <span className="w-10 text-zinc-700 tabular-nums">
                    {h.accuracy}%
                  </span>
                  <span className="ml-auto text-zinc-800">
                    {formatDate(h.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={_onRetry}
          className="rounded-lg bg-orange-600 px-6 py-2.5 font-mono text-sm text-white transition-colors hover:bg-orange-500"
        >
          retry same
        </button>
        <button
          onClick={_onNew}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-6 py-2.5 font-mono text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
        >
          new test
        </button>
      </div>
    </div>
  );
}
