"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { seasonForMonth } from "@/lib/data/seasonality";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/** Traffic delta vs. baseline as a signed percentage label + tone. */
function trafficLabel(multiplier: number): { text: string; tone: "good" | "warn" | "bad" | "neutral" } {
  const delta = Math.round((multiplier - 1) * 100);
  if (delta > 0) return { text: `+${delta}% traffic`, tone: "good" };
  if (delta < -25) return { text: `${delta}% traffic`, tone: "bad" };
  if (delta < 0) return { text: `${delta}% traffic`, tone: "warn" };
  return { text: "Baseline traffic", tone: "neutral" };
}

/** Dashboard overlay: current Berkeley academic-calendar period + advice. */
export function SeasonalityCard() {
  // Compute the current month on the client to avoid any SSR/timezone drift.
  const [month, setMonth] = useState<number | null>(null);
  useEffect(() => setMonth(new Date().getMonth() + 1), []);

  if (month == null) {
    return <div className="h-[140px] animate-pulse rounded-2xl bg-slate-100" />;
  }

  const season = seasonForMonth(month);
  const traffic = trafficLabel(season.trafficMultiplier);

  return (
    <Card>
      <CardHeader
        title="Berkeley season"
        description="Campus traffic shapes demand — adjust your menu and staffing."
        action={
          <Link
            href="/demo/market/seasonality"
            className="text-sm font-medium text-brand-700 hover:text-brand-600"
          >
            Full calendar →
          </Link>
        }
      />
      <CardBody>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-lg font-semibold text-ink">{season.label}</span>
          <Badge tone={traffic.tone}>{traffic.text}</Badge>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{season.recommendation}</p>
      </CardBody>
    </Card>
  );
}
