"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { COMPETITOR_PRICING, NEIGHBORHOODS } from "@/lib/data/competitorPricing";
import { DISH_CATEGORIES } from "@/lib/data/dishTemplates";
import { typeLabel } from "@/lib/restaurantMeta";
import { formatCurrency } from "@/lib/format";
import type { DishCategory, Neighborhood } from "@/lib/types";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { PriceBandBar } from "./PriceBandBar";

const CATEGORY_LABEL: Record<DishCategory, string> = Object.fromEntries(
  DISH_CATEGORIES.map((c) => [c.value, c.label])
) as Record<DishCategory, string>;

export function CompetitorBrowser() {
  const { restaurants, getLatestAnalysis } = useStore();
  const [restaurantId, setRestaurantId] = useState<string>("");
  const selected = restaurants.find((r) => r.id === restaurantId);

  // Selecting a restaurant pins the corridor to theirs.
  const [neighborhoodOverride, setNeighborhoodOverride] = useState<Neighborhood | null>(null);
  const neighborhood: Neighborhood = selected
    ? selected.neighborhood
    : neighborhoodOverride ?? "Telegraph Ave";

  const rows = useMemo(
    () =>
      COMPETITOR_PRICING.filter((c) => c.neighborhood === neighborhood).sort((a, b) =>
        CATEGORY_LABEL[a.category].localeCompare(CATEGORY_LABEL[b.category])
      ),
    [neighborhood]
  );

  // The selected restaurant's average price per category (if audited).
  const ownPriceByCategory = useMemo(() => {
    const map = new Map<DishCategory, number>();
    if (!selected) return map;
    const items = getLatestAnalysis(selected.id)?.items ?? [];
    const groups = new Map<DishCategory, number[]>();
    for (const it of items) {
      const arr = groups.get(it.category) ?? [];
      arr.push(it.currentPrice);
      groups.set(it.category, arr);
    }
    for (const [cat, prices] of groups) {
      map.set(cat, prices.reduce((s, p) => s + p, 0) / prices.length);
    }
    return map;
  }, [selected, getLatestAnalysis]);

  return (
    <div>
      <PageHeader
        title="Market intelligence"
        subtitle="What Berkeley restaurants charge by corridor and dish category."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Field label="Corridor" htmlFor="m-hood" hint={selected ? "Pinned to the selected restaurant." : undefined}>
          <Select
            id="m-hood"
            value={neighborhood}
            disabled={!!selected}
            onChange={(e) => setNeighborhoodOverride(e.target.value as Neighborhood)}
          >
            {NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Compare a restaurant (optional)" htmlFor="m-rest">
          <Select id="m-rest" value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)}>
            <option value="">None — browse corridor only</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} · {r.neighborhood}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {selected && (
        <div className="mb-6 rounded-lg border border-brand-100 bg-brand-50/50 px-4 py-3 text-sm text-slate-700">
          Showing <span className="font-medium text-ink">{selected.name}</span> (
          {selected.neighborhood} · {typeLabel(selected.type)}) against its corridor. The dot marks
          your price within each band.
        </div>
      )}

      <Card>
        <CardHeader title={`${neighborhood} pricing`} description="Observed low / average / high per category." />
        <CardBody className="space-y-5">
          {rows.map((row) => {
            const own = ownPriceByCategory.get(row.category);
            return (
              <div key={row.category} className="grid gap-3 sm:grid-cols-[180px_1fr] sm:items-center">
                <div>
                  <div className="text-sm font-medium text-ink">{CATEGORY_LABEL[row.category]}</div>
                  <div className="text-xs text-slate-400">
                    {row.sampleSize} sampled
                    {own != null && (
                      <>
                        {" · "}
                        <span className="font-medium text-slate-600">you: {formatCurrency(own)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <PriceBandBar low={row.priceLow} avg={row.priceAvg} high={row.priceHigh} value={own} />
                  </div>
                  {own != null && (
                    <Badge
                      tone={own < row.priceAvg * 0.95 ? "warn" : own > row.priceAvg * 1.05 ? "bad" : "good"}
                    >
                      {own < row.priceAvg * 0.95
                        ? "Below avg"
                        : own > row.priceAvg * 1.05
                          ? "Above avg"
                          : "At avg"}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </div>
  );
}
