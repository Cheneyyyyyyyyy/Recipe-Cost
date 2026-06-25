"use client";

import { formatCurrency } from "@/lib/format";

/**
 * A low→high price band with an average tick and an optional marker for a
 * specific price (e.g. a restaurant's). The marker is colour-coded by where it
 * falls relative to the corridor average.
 */
export function PriceBandBar({
  low,
  avg,
  high,
  value,
}: {
  low: number;
  avg: number;
  high: number;
  value?: number;
}) {
  const span = Math.max(high - low, 0.01);
  const pct = (v: number) => Math.min(100, Math.max(0, ((v - low) / span) * 100));
  const avgPct = pct(avg);

  let markerPct = value != null ? pct(value) : null;
  let markerColor = "bg-slate-700";
  if (value != null) {
    if (value < avg * 0.95) markerColor = "bg-amber-500"; // below corridor → headroom
    else if (value > avg * 1.05) markerColor = "bg-red-500"; // above corridor
    else markerColor = "bg-emerald-500"; // near average
  }

  return (
    <div className="w-full">
      <div className="relative h-2.5 rounded-full bg-gradient-to-r from-emerald-100 via-amber-100 to-red-100">
        {/* average tick */}
        <span
          className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 bg-slate-400"
          style={{ left: `${avgPct}%` }}
          aria-hidden="true"
        />
        {/* restaurant marker */}
        {markerPct != null && (
          <span
            className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ${markerColor}`}
            style={{ left: `${markerPct}%` }}
            aria-hidden="true"
          />
        )}
      </div>
      <div className="mt-1 flex justify-between text-[11px] tabular-nums text-slate-400">
        <span>{formatCurrency(low)}</span>
        <span className="text-slate-500">avg {formatCurrency(avg)}</span>
        <span>{formatCurrency(high)}</span>
      </div>
    </div>
  );
}
