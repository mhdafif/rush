import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Drawer } from "vaul";

import { useStatsDrawer } from "./useStatsDrawer";

export function StatsDrawer() {
  /*=== Store ===*/

  const {
    isOpen,
    onClose,
    history,
    best,
    showHistory,
    setShowHistory,
    chartData,
  } = useStatsDrawer();

  /*=== Return ===*/

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      direction="right"
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.45)" }}
        />
        <Drawer.Content
          className="fixed top-0 right-0 z-50 flex h-full flex-col border-l border-zinc-800 bg-zinc-950 outline-none"
          style={{ width: 300 }}
          aria-label="Stats drawer"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-5 py-4">
            <span className="font-mono text-xs font-bold tracking-widest text-orange-500 uppercase">
              Stats
            </span>
            <button
              onClick={onClose}
              className="cursor-pointer font-mono text-lg leading-none text-zinc-500 transition-colors hover:text-zinc-200"
              aria-label="Close stats"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
            {/* Personal Best */}
            <div>
              <div className="mb-3 font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
                Personal Best
              </div>
              {best ? (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-glow font-mono text-2xl font-bold text-orange-500">
                      {best.wpm}
                    </span>
                    <span className="font-mono text-xs text-zinc-500">wpm</span>
                    <span className="ml-1 font-mono text-sm text-zinc-400">
                      {best.accuracy}%
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-wider text-zinc-600 uppercase">
                    {best.mode} · {best.lang}
                  </div>
                </div>
              ) : (
                <div className="font-mono text-xs text-zinc-600 italic">
                  No tests completed yet.
                </div>
              )}
            </div>

            {/* Trend Chart */}
            {chartData.length >= 2 && (
              <div>
                <div className="mb-3 font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
                  Trend
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-3">
                  <ResponsiveContainer width="100%" height={90}>
                    <LineChart
                      data={chartData}
                      margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 9,
                          fill: "#52525b",
                          fontFamily: "monospace",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{
                          fontSize: 9,
                          fill: "#52525b",
                          fontFamily: "monospace",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#18181b",
                          border: "1px solid #27272a",
                          borderRadius: 6,
                          fontSize: 11,
                          fontFamily: "monospace",
                          color: "#d4d4d8",
                        }}
                        itemStyle={{ color: "#d4d4d8" }}
                        labelStyle={{ color: "#71717a" }}
                      />
                      <Legend
                        iconType="plainline"
                        wrapperStyle={{
                          fontSize: 9,
                          fontFamily: "monospace",
                          paddingTop: 4,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="wpm"
                        stroke="#ea580c"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#ea580c", strokeWidth: 0 }}
                        activeDot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="acc"
                        stroke="#52525b"
                        strokeWidth={1.5}
                        strokeDasharray="4 2"
                        dot={{ r: 2, fill: "#52525b", strokeWidth: 0 }}
                        activeDot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* History section with toggle */}
            <div>
              <button
                onClick={() => setShowHistory((h) => !h)}
                className="group mb-3 flex w-full cursor-pointer items-center justify-between"
              >
                <div className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase transition-colors group-hover:text-zinc-400">
                  Recent Tests
                </div>
                <span className="font-mono text-[10px] text-zinc-700 transition-colors group-hover:text-zinc-500">
                  {showHistory ? "▲ hide" : "▼ show"}
                </span>
              </button>

              {showHistory && (
                <>
                  {history.length === 0 ? (
                    <div className="font-mono text-xs text-zinc-600 italic">
                      No history yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {history.map((entry, i) => (
                        <div
                          key={entry.id}
                          className="flex items-center gap-3 rounded-lg border border-zinc-800/60 bg-zinc-900 px-3 py-2.5"
                        >
                          <span className="w-4 shrink-0 font-mono text-[10px] text-zinc-600">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-mono text-sm font-bold text-zinc-200">
                                {entry.wpm}
                              </span>
                              <span className="font-mono text-[10px] text-zinc-500">
                                wpm
                              </span>
                              <span className="font-mono text-xs text-zinc-400">
                                {entry.accuracy}%
                              </span>
                            </div>
                            <div className="mt-0.5 font-mono text-[10px] tracking-wider text-zinc-600 uppercase">
                              {entry.mode} · {entry.lang}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
