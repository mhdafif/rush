import { useState } from "react";

import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WpmSnapshot } from "../hooks/useTypingEngine";
import type { HistoryEntry } from "../store/settings/ISettingsStore";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-orange-600/40 bg-zinc-900 px-3 py-2 font-mono text-xs">
      <div className="text-zinc-500">second {label}</div>
      <div className="text-sm font-bold text-orange-500">
        {payload[0].value} wpm
      </div>
    </div>
  );
}

interface WpmLineChartProps {
  data: WpmSnapshot[];
  history?: HistoryEntry[];
}

export function WpmLineChart({ data, history = [] }: WpmLineChartProps) {
  const [compare, setCompare] = useState(false);

  // Reference colors for historical entries (muted palette)
  const refColors = ["#52525b", "#3f3f46", "#27272a", "#71717a", "#a1a1aa"];

  return (
    <div>
      {history.length > 0 && (
        <div className="mb-2 flex justify-end">
          <button
            onClick={() => setCompare((c) => !c)}
            className={`cursor-pointer rounded border px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase transition-colors ${
              compare
                ? "border-orange-800 bg-orange-950/40 text-orange-500"
                : "border-zinc-800 text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {compare ? "⊠ compare" : "⊡ compare"}
          </button>
        </div>
      )}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
        >
          <defs>
            <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="second"
            tick={{
              fill: "#52525b",
              fontSize: 10,
              fontFamily: "JetBrains Mono",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fill: "#52525b",
              fontSize: 10,
              fontFamily: "JetBrains Mono",
            }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#ea580c",
              strokeOpacity: 0.3,
              strokeDasharray: "4 4",
            }}
          />
          {compare &&
            history.map((h, i) => (
              <ReferenceLine
                key={h.id}
                y={h.wpm}
                stroke={refColors[i % refColors.length]}
                strokeDasharray="4 2"
                strokeWidth={1}
                label={{
                  value: `#${i + 1} ${h.wpm}`,
                  position: "right",
                  fontSize: 9,
                  fill: refColors[i % refColors.length],
                  fontFamily: "JetBrains Mono",
                }}
              />
            ))}
          <Area
            type="monotone"
            dataKey="wpm"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#wpmGrad)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "#f97316",
              filter: "drop-shadow(0 0 6px #f97316)",
            }}
            strokeLinecap="round"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
