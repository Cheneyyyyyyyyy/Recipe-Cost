"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { MarginLevel } from "@/lib/margin";
import type { MarginRow } from "./DashboardView";

/** Dot fill per margin level; mirrors the margin badge tones. */
const DOT_COLORS: Record<MarginLevel, string> = {
  healthy: "#10b981",
  watch: "#f59e0b",
  low: "#ef4444",
  unknown: "#94a3b8",
  error: "#ef4444",
  "no-yield": "#f59e0b",
};

interface QuadrantDatum {
  id: string;
  name: string;
  popularity: number;
  margin: number;
  level: MarginLevel;
  foodCostPercent: number | null;
}

function roundUp(value: number, step: number): number {
  return Math.ceil(value / step) * step;
}

function QuadrantTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: QuadrantDatum }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <div className="font-medium text-ink">{d.name}</div>
      <div className="mt-1 space-y-0.5 tabular-nums text-slate-600">
        <div>Popularity: {d.popularity}/wk</div>
        <div>Margin/serving: {formatCurrency(d.margin)}</div>
        <div>Food cost: {formatPercent(d.foodCostPercent)}</div>
      </div>
    </div>
  );
}

const QUAD_LABEL = {
  fontSize: 12,
  fontWeight: 600,
  fill: "#94a3b8",
};

export function MenuQuadrant({ rows }: { rows: MarginRow[] }) {
  // ResponsiveContainer measures the DOM; render only after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Need a real margin (priced, no errors) and demo sales data to place a dot.
  const data: QuadrantDatum[] = rows
    .filter((r) => r.marginPerServing != null && r.popularity > 0)
    .map((r) => ({
      id: r.recipe.id,
      name: r.recipe.name,
      popularity: r.popularity,
      margin: r.marginPerServing as number,
      level: r.status.level,
      foodCostPercent: r.foodCostPercent,
    }));

  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Price your recipes (and add sales data) to map them on the popularity ×
        margin quadrant.
      </p>
    );
  }

  if (!mounted) {
    return <div className="h-[360px] animate-pulse rounded-xl bg-slate-100" />;
  }

  const avgPop = data.reduce((s, d) => s + d.popularity, 0) / data.length;
  const avgMargin = data.reduce((s, d) => s + d.margin, 0) / data.length;
  const xMax = roundUp(Math.max(...data.map((d) => d.popularity)) * 1.15, 10);
  const yMax = roundUp(Math.max(...data.map((d) => d.margin)) * 1.15, 1);

  return (
    <div>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height={360}>
          <ScatterChart margin={{ top: 16, right: 24, bottom: 32, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            {/* Quadrant tints + labels, split at the menu averages. */}
            <ReferenceArea x1={avgPop} x2={xMax} y1={avgMargin} y2={yMax} fill="#10b981" fillOpacity={0.05} label={{ value: "★ Stars", position: "insideTopRight", ...QUAD_LABEL, fill: "#059669" }} />
            <ReferenceArea x1={0} x2={avgPop} y1={avgMargin} y2={yMax} fill="#3b82f6" fillOpacity={0.04} label={{ value: "Puzzles", position: "insideTopLeft", ...QUAD_LABEL }} />
            <ReferenceArea x1={avgPop} x2={xMax} y1={0} y2={avgMargin} fill="#f59e0b" fillOpacity={0.05} label={{ value: "Plowhorses", position: "insideBottomRight", ...QUAD_LABEL }} />
            <ReferenceArea x1={0} x2={avgPop} y1={0} y2={avgMargin} fill="#ef4444" fillOpacity={0.05} label={{ value: "Dogs", position: "insideBottomLeft", ...QUAD_LABEL }} />

            <ReferenceLine x={avgPop} stroke="#cbd5e1" strokeDasharray="4 4" />
            <ReferenceLine y={avgMargin} stroke="#cbd5e1" strokeDasharray="4 4" />

            <XAxis
              type="number"
              dataKey="popularity"
              name="Popularity"
              domain={[0, xMax]}
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              label={{ value: "Popularity (orders / week)", position: "insideBottom", offset: -18, fontSize: 12, fill: "#64748b" }}
            />
            <YAxis
              type="number"
              dataKey="margin"
              name="Margin/serving"
              domain={[0, yMax]}
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(v: number) => `$${v}`}
              tickLine={false}
              axisLine={false}
              width={48}
              label={{ value: "Margin / serving", angle: -90, position: "insideLeft", fontSize: 12, fill: "#64748b" }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<QuadrantTooltip />} />

            <Scatter data={data}>
              {data.map((d) => (
                <Cell key={d.id} fill={DOT_COLORS[d.level]} />
              ))}
              <LabelList
                dataKey="name"
                position="top"
                style={{ fontSize: 11, fill: "#475569" }}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">
        Dot color reflects margin health (green healthy · amber watch · red
        low-margin). Quadrants split at the menu&apos;s average popularity and
        margin. Sales volume is demo data.
      </p>
    </div>
  );
}
