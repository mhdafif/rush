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

import { tokens } from "../design/tokens";
import { DrawerOverlay } from "./ui/drawer";
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
        <DrawerOverlay />
        <Drawer.Content
          className="border-line bg-ink fixed top-0 right-0 z-61 flex h-full flex-col border-l outline-none"
          style={{ width: 300 }}
          aria-label="Stats drawer"
        >
          {/* Header */}
          <div className="border-line flex shrink-0 items-center justify-between border-b px-5 py-4">
            <span className="text-signal font-mono text-xs font-bold tracking-widest uppercase">
              Stats
            </span>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary cursor-pointer font-mono text-lg leading-none transition-colors"
              aria-label="Close stats"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
            {/* Personal Best */}
            <div>
              <div className="text-text-muted mb-3 font-mono text-[10px] tracking-widest uppercase">
                Personal Best
              </div>
              {best ? (
                <div className="border-line bg-panel rounded-lg border px-4 py-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-glow text-signal font-mono text-2xl font-bold">
                      {best.wpm}
                    </span>
                    <span className="text-text-muted font-mono text-xs">
                      wpm
                    </span>
                    <span className="text-text-muted ml-1 font-mono text-sm">
                      {best.accuracy}%
                    </span>
                  </div>
                  <div className="text-text-muted mt-1 font-mono text-[10px] tracking-wider uppercase">
                    {best.mode} · {best.lang}
                  </div>
                </div>
              ) : (
                <div className="text-text-muted font-mono text-xs italic">
                  No tests completed yet.
                </div>
              )}
            </div>

            {/* Trend Chart */}
            {chartData.length >= 2 && (
              <div>
                <div className="text-text-muted mb-3 font-mono text-[10px] tracking-widest uppercase">
                  Trend
                </div>
                <div className="border-line bg-panel rounded-lg border px-3 py-3">
                  <ResponsiveContainer width="100%" height={90}>
                    <LineChart
                      data={chartData}
                      margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 9,
                          fill: tokens.color.text.muted,
                          fontFamily: "monospace",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{
                          fontSize: 9,
                          fill: tokens.color.text.muted,
                          fontFamily: "monospace",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: tokens.color.background.panel,
                          border: `1px solid ${tokens.color.border.line}`,
                          borderRadius: 6,
                          fontSize: 11,
                          fontFamily: "monospace",
                          color: tokens.color.text.primary,
                        }}
                        itemStyle={{ color: tokens.color.text.primary }}
                        labelStyle={{ color: tokens.color.text.muted }}
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
                        stroke={tokens.color.signal.active}
                        strokeWidth={2}
                        dot={{
                          r: 3,
                          fill: tokens.color.signal.active,
                          strokeWidth: 0,
                        }}
                        activeDot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="acc"
                        stroke={tokens.color.text.muted}
                        strokeWidth={1.5}
                        strokeDasharray="4 2"
                        dot={{
                          r: 2,
                          fill: tokens.color.text.muted,
                          strokeWidth: 0,
                        }}
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
                <div className="text-text-muted group-hover:text-text-primary font-mono text-[10px] tracking-widest uppercase transition-colors">
                  Recent Tests
                </div>
                <span className="text-text-muted group-hover:text-text-primary font-mono text-[10px] transition-colors">
                  {showHistory ? "▲ hide" : "▼ show"}
                </span>
              </button>

              {showHistory && (
                <>
                  {history.length === 0 ? (
                    <div className="text-text-muted font-mono text-xs italic">
                      No history yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {history.map((entry, i) => (
                        <div
                          key={entry.id}
                          className="border-line/60 bg-panel flex items-center gap-3 rounded-lg border px-3 py-2.5"
                        >
                          <span className="text-text-muted w-4 shrink-0 font-mono text-[10px]">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-text-primary font-mono text-sm font-bold">
                                {entry.wpm}
                              </span>
                              <span className="text-text-muted font-mono text-[10px]">
                                wpm
                              </span>
                              <span className="text-text-muted font-mono text-xs">
                                {entry.accuracy}%
                              </span>
                            </div>
                            <div className="text-text-muted mt-0.5 font-mono text-[10px] tracking-wider uppercase">
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
