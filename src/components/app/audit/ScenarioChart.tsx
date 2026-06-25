"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import type { DishImpact } from "@/lib/scenario";

function truncate(value: string, max = 12): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

interface Datum {
  name: string;
  before: number;
  after: number;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <div className="font-medium text-ink">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="mt-0.5 tabular-nums" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}/mo
        </div>
      ))}
    </div>
  );
}

/** Grouped before/after monthly-margin bars per dish. */
export function ScenarioChart({ perDish }: { perDish: DishImpact[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data: Datum[] = perDish.map((d) => ({
    name: d.name,
    before: Math.round(d.originalMonthly),
    after: Math.round(d.newMonthly),
  }));

  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-500">No dishes to model yet.</p>;
  }
  if (!mounted) {
    return <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />;
  }

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-25}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickFormatter={(v: string) => truncate(v)}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickFormatter={(v: number) => `$${v}`}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip cursor={{ fill: "#f8fafc" }} content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar name="Now" dataKey="before" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar name="Scenario" dataKey="after" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
