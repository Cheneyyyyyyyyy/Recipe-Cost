"use client";

import type { AuditResult } from "@/lib/audit";
import type { Restaurant } from "@/lib/types";
import { flagDisplay, foodCostTone } from "@/lib/auditDisplay";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";

const KIND_META: Record<
  AuditResult["recommendations"][number]["kind"],
  { tone: "good" | "warn" | "bad" | "brand"; label: string }
> = {
  raise: { tone: "brand", label: "Raise price" },
  promote: { tone: "good", label: "Promote" },
  rework: { tone: "warn", label: "Rework" },
};

/** The live audit analysis: summary, dish table, and recommendations. */
export function AuditAnalysis({
  result,
  restaurant,
}: {
  result: AuditResult;
  restaurant: Restaurant;
}) {
  const { items, summary, recommendations } = result;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Menu items" value={summary.itemCount} />
        <Stat
          label="Underwater"
          value={summary.underwaterCount}
          tone={summary.underwaterCount > 0 ? "bad" : "good"}
          hint="Above 35% food cost"
        />
        <Stat
          label="Avg food cost"
          value={formatPercent(summary.avgFoodCostPercent)}
          tone={
            summary.avgFoodCostPercent != null
              ? foodCostTone(summary.avgFoodCostPercent)
              : "default"
          }
        />
        <Stat
          label="Monthly opportunity"
          value={formatCurrency(summary.monthlyOpportunity)}
          tone={summary.monthlyOpportunity > 0 ? "good" : "default"}
          hint="Estimated margin upside"
        />
      </div>

      {/* Headline */}
      <Card>
        <CardBody>
          <p className="text-sm leading-relaxed text-slate-700">{summary.headline}</p>
        </CardBody>
      </Card>

      {/* Dish-by-dish breakdown */}
      <Card>
        <CardHeader
          title="Dish-by-dish breakdown"
          description={`Estimated ingredient cost vs. ${restaurant.neighborhood} corridor pricing.`}
        />
        <CardBody className="p-0">
          {items.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              Add menu items to see the analysis.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-2.5 font-medium">Dish</th>
                    <th className="px-3 py-2.5 text-right font-medium">Price</th>
                    <th className="px-3 py-2.5 text-right font-medium">Est. cost</th>
                    <th className="px-3 py-2.5 text-right font-medium">Food cost</th>
                    <th className="px-3 py-2.5 text-right font-medium">Corridor avg</th>
                    <th className="px-5 py-2.5 text-right font-medium">Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    const flag = flagDisplay(item.flag);
                    return (
                      <tr key={`${item.name}-${i}`} className="border-b border-slate-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="font-medium text-ink">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.category}</div>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-ink">
                          {formatCurrency(item.currentPrice)}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-slate-600">
                          {formatCurrency(item.estimatedCost)}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums font-medium">
                          <span
                            className={
                              foodCostTone(item.foodCostPercent) === "bad"
                                ? "text-red-600"
                                : foodCostTone(item.foodCostPercent) === "warn"
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                            }
                          >
                            {formatPercent(item.foodCostPercent, 0)}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-slate-600">
                          {item.competitorAvg != null ? formatCurrency(item.competitorAvg) : "—"}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Badge tone={flag.tone}>
                            {flag.symbol} {flag.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader
            title="Top recommendations"
            description="Ranked by estimated monthly margin impact."
          />
          <CardBody>
            <ol className="space-y-4">
              {recommendations.map((rec, i) => {
                const meta = KIND_META[rec.kind];
                return (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        {rec.monthlyImpact != null && rec.monthlyImpact > 0 && (
                          <span className="text-xs font-medium text-emerald-700">
                            ~{formatCurrency(rec.monthlyImpact)}/mo
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">{rec.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
