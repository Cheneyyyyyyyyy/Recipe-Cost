"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LOW_MARGIN_FOOD_COST_THRESHOLD } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import type { MarginLevel } from "@/lib/margin";
import type { MarginRow } from "./DashboardView";

/** Bar fill per margin level; mirrors marginStatus tones. */
const BAR_COLORS: Record<MarginLevel, string> = {
  healthy: "#10b981",
  watch: "#f59e0b",
  low: "#ef4444",
  unknown: "#94a3b8",
  error: "#ef4444",
  "no-yield": "#f59e0b",
};

interface ChartDatum {
  id: string;
  name: string;
  foodCostPercent: number;
  level: MarginLevel;
}

/** Keep long recipe names from overflowing the angled axis labels. */
function truncate(value: string, max = 14): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartDatum }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <div className="font-medium text-ink">{d.name}</div>
      <div className="mt-0.5 tabular-nums text-slate-600">
        Food cost {formatPercent(d.foodCostPercent)}
      </div>
    </div>
  );
}

export function MarginChart({ rows }: { rows: MarginRow[] }) {
  // ResponsiveContainer measures the DOM, so only render it after mount to
  // avoid SSR width-of-0 warnings; show a fixed-height skeleton until then.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data: ChartDatum[] = rows
    .filter((r) => r.foodCostPercent != null)
    .map((r) => ({
      id: r.recipe.id,
      name: r.recipe.name,
      foodCostPercent: r.foodCostPercent as number,
      level: r.status.level,
    }));

  // Recipe names aren't unique (e.g. two "Untitled recipe"), so chart by the
  // stable id and map back to the name only for axis labels.
  const nameById = new Map(data.map((d) => [d.id, d.name]));

  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Add a sale price to a recipe to see its food-cost % charted here.
      </p>
    );
  }

  if (!mounted) {
    return <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />;
  }

  // Round the axis up to a clean multiple of 5 that always clears the line.
  const maxValue = Math.max(LOW_MARGIN_FOOD_COST_THRESHOLD, ...data.map((d) => d.foodCostPercent));
  const yMax = Math.ceil((maxValue + 5) / 5) * 5;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="id"
            interval={0}
            angle={-25}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickFormatter={(value: string) => truncate(nameById.get(value) ?? value)}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            domain={[0, yMax]}
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickFormatter={(value: number) => `${value}%`}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip cursor={{ fill: "#f8fafc" }} content={<ChartTooltip />} />
          <ReferenceLine
            y={LOW_MARGIN_FOOD_COST_THRESHOLD}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label={{
              value: "Low-margin line",
              position: "insideTopRight",
              fill: "#ef4444",
              fontSize: 11,
            }}
          />
          <Bar dataKey="foodCostPercent" radius={[4, 4, 0, 0]} maxBarSize={56}>
            {data.map((d) => (
              <Cell key={d.id} fill={BAR_COLORS[d.level]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
