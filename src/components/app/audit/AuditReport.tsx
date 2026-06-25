"use client";

import Link from "next/link";
import { useMemo } from "react";
import { analyzeMenu } from "@/lib/audit";
import { useStore } from "@/lib/store";
import { typeLabel } from "@/lib/restaurantMeta";
import { flagDisplay } from "@/lib/auditDisplay";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { MenuItemInput } from "@/lib/audit";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

function formatDate(iso: string | undefined): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function AuditReport({ restaurantId }: { restaurantId: string }) {
  const s = useStore();
  const restaurant = s.getRestaurant(restaurantId);
  const latest = s.getLatestAnalysis(restaurantId);

  const result = useMemo(() => {
    if (!restaurant) return null;
    const inputs: MenuItemInput[] = (latest?.items ?? []).map((i) => ({
      name: i.name,
      category: i.category,
      currentPrice: i.currentPrice,
    }));
    return analyzeMenu(restaurant.neighborhood, inputs, {
      estimatedDailyCovers: restaurant.estimatedDailyCovers,
    });
  }, [restaurant, latest]);

  if (!restaurant || !result || result.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <EmptyState
          title="No report to show"
          description="This restaurant has no saved menu analysis yet."
          action={
            <Link
              href="/demo/audits"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
            >
              Back to audits
            </Link>
          }
        />
      </div>
    );
  }

  const { items, summary, recommendations } = result;
  const topRecs = recommendations.slice(0, 3);

  // Competitor context: dishes that diverge most from the corridor average.
  const competitorContext = items
    .filter((i) => i.competitorAvg != null)
    .map((i) => ({ ...i, gap: i.currentPrice - (i.competitorAvg as number) }))
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, 3);

  return (
    <div className="bg-slate-100 print:bg-white">
      {/* Screen-only toolbar */}
      <div className="mx-auto flex max-w-[820px] items-center justify-between px-4 py-4 print:hidden">
        <Link href={`/demo/audits/${restaurant.id}`} className="text-sm font-medium text-slate-600 hover:text-ink">
          ← Back to audit
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-slate-500 sm:block">
            Tip: choose “Save as PDF” in the print dialog.
          </span>
          <Button onClick={() => window.print()}>Print / Save as PDF</Button>
        </div>
      </div>

      {/* The report sheet */}
      <div className="mx-auto mb-10 max-w-[820px] bg-white px-10 py-10 shadow-lg print:mb-0 print:max-w-none print:px-8 print:py-6 print:shadow-none">
        {/* Header */}
        <header className="flex items-start justify-between border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <span className="h-3 w-3 rounded-full bg-white" />
            </span>
            <span className="text-xl font-semibold tracking-tight text-ink">Luma</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              Menu Audit Report
            </div>
            <div className="text-xs text-slate-500">{formatDate(latest?.createdAt)}</div>
          </div>
        </header>

        <div className="mt-5">
          <h1 className="text-2xl font-bold text-ink">{restaurant.name}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {restaurant.neighborhood} · {typeLabel(restaurant.type)}
          </p>
        </div>

        {/* Summary */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 print:bg-slate-50">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Summary</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-800">{summary.headline}</p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <ReportStat label="Items analysed" value={String(summary.itemCount)} />
            <ReportStat
              label="Likely underwater"
              value={String(summary.underwaterCount)}
              tone={summary.underwaterCount > 0 ? "bad" : "good"}
            />
            <ReportStat
              label="Monthly upside"
              value={summary.monthlyOpportunity > 0 ? formatCurrency(summary.monthlyOpportunity) : "—"}
              tone="good"
            />
          </div>
        </section>

        {/* Dish-by-dish */}
        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Dish-by-dish breakdown
          </h2>
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-2 font-medium">Dish</th>
                <th className="py-2 px-2 text-right font-medium">Price</th>
                <th className="py-2 px-2 text-right font-medium">Est. cost</th>
                <th className="py-2 px-2 text-right font-medium">FC %</th>
                <th className="py-2 pl-2 text-right font-medium">Flag</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const flag = flagDisplay(item.flag);
                return (
                  <tr key={`${item.name}-${i}`} className="border-b border-slate-100">
                    <td className="py-2 pr-2 font-medium text-ink">{item.name}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{formatCurrency(item.currentPrice)}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-slate-600">
                      {formatCurrency(item.estimatedCost)}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums">{formatPercent(item.foodCostPercent, 0)}</td>
                    <td className="py-2 pl-2 text-right">
                      <span
                        className={
                          flag.tone === "bad"
                            ? "font-medium text-red-600"
                            : flag.tone === "warn"
                              ? "font-medium text-amber-600"
                              : flag.tone === "good"
                                ? "font-medium text-emerald-600"
                                : "text-slate-400"
                        }
                      >
                        {flag.symbol} {flag.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Recommendations */}
        {topRecs.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Top {topRecs.length} recommendation{topRecs.length === 1 ? "" : "s"}
            </h2>
            <ol className="mt-2 space-y-2.5">
              {topRecs.map((rec, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed text-slate-800">{rec.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Competitor context */}
        {competitorContext.length > 0 && (
          <section className="mt-6 rounded-xl border border-slate-200 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Competitor context · {restaurant.neighborhood}
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {competitorContext.map((item, i) => (
                <li key={i}>
                  <span className="font-medium text-ink">{item.name}</span>: you charge{" "}
                  {formatCurrency(item.currentPrice)} vs. a corridor average of{" "}
                  {formatCurrency(item.competitorAvg as number)} —{" "}
                  <span className={item.gap < 0 ? "text-amber-700" : "text-slate-600"}>
                    {item.gap < 0
                      ? `${formatCurrency(Math.abs(item.gap))} below average`
                      : item.gap > 0
                        ? `${formatCurrency(item.gap)} above average`
                        : "right on average"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
          <p className="font-medium text-slate-600">Prepared by Ethan Chen · ethan@luma.tools</p>
          <p className="mt-0.5">
            Powered by Luma — menu profitability for independent restaurants. Ingredient costs are
            Bay-Area estimates; plug in real supplier prices for exact margins.
          </p>
        </footer>
      </div>
    </div>
  );
}

function ReportStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "good" | "bad";
}) {
  const valueColor =
    tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-600" : "text-ink";
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-0.5 text-lg font-bold tabular-nums ${valueColor}`}>{value}</div>
    </div>
  );
}
