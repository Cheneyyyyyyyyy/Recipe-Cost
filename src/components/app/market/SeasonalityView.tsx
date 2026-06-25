"use client";

import { useEffect, useState } from "react";
import { SEASONAL_PATTERNS, seasonForMonth } from "@/lib/data/seasonality";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function trafficTone(m: number): "good" | "warn" | "bad" | "neutral" {
  const delta = (m - 1) * 100;
  if (delta > 5) return "good";
  if (delta < -25) return "bad";
  if (delta < -5) return "warn";
  return "neutral";
}

function trafficText(m: number): string {
  const delta = Math.round((m - 1) * 100);
  if (delta === 0) return "Baseline";
  return `${delta > 0 ? "+" : ""}${delta}%`;
}

export function SeasonalityView() {
  const [month, setMonth] = useState<number | null>(null);
  useEffect(() => setMonth(new Date().getMonth() + 1), []);

  const current = month != null ? seasonForMonth(month) : null;

  // Per-month multiplier for the year strip.
  const yearly = MONTHS.map((_, i) => seasonForMonth(i + 1).trafficMultiplier);
  const maxMult = Math.max(...yearly, 1.4);

  return (
    <div>
      <PageHeader
        title="Berkeley seasonality"
        subtitle="Campus traffic drives demand. Plan menu, staffing, and promotions around the calendar."
      />

      <div className="space-y-6">
        {/* Current period */}
        {current && month != null && (
          <Card className="border-brand-100 bg-brand-50/40">
            <CardBody>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium uppercase tracking-wide text-brand-700">
                  Right now · {MONTH_NAMES[month - 1]}
                </span>
                <span className="text-xl font-semibold text-ink">{current.label}</span>
                <Badge tone={trafficTone(current.trafficMultiplier)}>
                  {trafficText(current.trafficMultiplier)} traffic
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{current.recommendation}</p>
            </CardBody>
          </Card>
        )}

        {/* Year-at-a-glance strip */}
        <Card>
          <CardHeader title="Traffic through the year" description="Relative demand by month (baseline = 100%)." />
          <CardBody>
            <div className="flex items-end gap-1.5" style={{ height: 140 }}>
              {yearly.map((mult, i) => {
                const isCurrent = month === i + 1;
                const h = Math.round((mult / maxMult) * 120);
                return (
                  <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                    <div
                      className={`w-full rounded-t ${isCurrent ? "bg-brand-600" : "bg-brand-200"}`}
                      style={{ height: `${h}px` }}
                      title={`${MONTH_NAMES[i]}: ${trafficText(mult)}`}
                    />
                    <span className={`text-[11px] ${isCurrent ? "font-semibold text-brand-700" : "text-slate-400"}`}>
                      {MONTHS[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* All periods */}
        <Card>
          <CardHeader title="Calendar periods" description="Every demand window and what to do about it." />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            {SEASONAL_PATTERNS.map((p) => {
              const isCurrent = current?.period === p.period;
              return (
                <div
                  key={p.period}
                  className={`rounded-xl border p-4 ${
                    isCurrent ? "border-brand-300 bg-brand-50/40" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-ink">{p.label}</span>
                    <Badge tone={trafficTone(p.trafficMultiplier)}>{trafficText(p.trafficMultiplier)}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.recommendation}</p>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
