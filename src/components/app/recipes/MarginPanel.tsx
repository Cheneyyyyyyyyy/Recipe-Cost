"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { suggestedPrice, type RecipeCostResult } from "@/lib/costing";
import { recipeStatus } from "@/lib/margin";
import { DEFAULT_TARGET_FOOD_COST } from "@/lib/constants";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Recipe } from "@/lib/types";

/** Realistic food-cost band for the repricing slider (percent). */
const TARGET_MIN = 10;
const TARGET_MAX = 60;

/** Sale-price input plus derived food-cost %, margin, and a suggested price. */
export function MarginPanel({
  recipe,
  result,
}: {
  recipe: Recipe;
  result: RecipeCostResult;
}) {
  const s = useStore();

  // Sale price held as a raw string; "" maps to null (no price set) in the store.
  const [price, setPrice] = useState(() =>
    recipe.salePrice == null ? "" : String(recipe.salePrice)
  );
  useEffect(() => {
    // Re-sync when the stored price changes from elsewhere (e.g. "Apply as sale price").
    const parsed = price === "" ? null : Number(price);
    if (parsed !== recipe.salePrice) {
      setPrice(recipe.salePrice == null ? "" : String(recipe.salePrice));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe.salePrice]);

  // Target food-cost % for the suggested-price tool (local only — never persisted).
  const [target, setTarget] = useState(String(DEFAULT_TARGET_FOOD_COST));
  const targetNum = target === "" ? 0 : Number(target);

  const status = recipeStatus(result, recipe);
  const statTone = status.tone === "neutral" ? "default" : status.tone;

  // suggestedPrice throws on a non-positive target, so only compute when guarded.
  const canSuggest = result.costPerServing != null && targetNum > 0;
  let suggested: number | null = null;
  if (canSuggest) {
    try {
      suggested = suggestedPrice(result.costPerServing as number, targetNum);
    } catch {
      suggested = null;
    }
  }

  // Slider lives in a realistic food-cost band; clamp the thumb but keep any
  // exact typed value for the actual computation. fillPct paints the track.
  const sliderValue = Math.min(TARGET_MAX, Math.max(TARGET_MIN, targetNum || DEFAULT_TARGET_FOOD_COST));
  const fillPct = ((sliderValue - TARGET_MIN) / (TARGET_MAX - TARGET_MIN)) * 100;
  const repriceable = result.costPerServing != null;
  const applied =
    suggested != null && recipe.salePrice === Math.round(suggested * 100) / 100;

  return (
    <Card>
      <CardHeader title="Pricing & margin" />
      <CardBody className="space-y-4">
        <Field
          label="Sale price"
          htmlFor={`sale-${recipe.id}`}
          hint="Per serving. Leave blank if not priced yet."
        >
          <Input
            id={`sale-${recipe.id}`}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            placeholder="0.00"
            className="tabular-nums"
            value={price}
            onChange={(e) => {
              const v = e.target.value;
              setPrice(v);
              if (v === "") {
                s.updateRecipe(recipe.id, { salePrice: null });
              } else {
                const n = Number(v);
                if (!Number.isNaN(n)) s.updateRecipe(recipe.id, { salePrice: n });
              }
            }}
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat
            label="Food cost %"
            value={formatPercent(result.foodCostPercent)}
            tone={statTone}
            hint={<Badge tone={status.tone}>{status.label}</Badge>}
          />
          <Stat label="Margin / serving" value={formatCurrency(result.marginPerServing)} />
          <Stat label="Margin %" value={formatPercent(result.marginPercent)} />
        </div>

        {result.hasErrors ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Some line items can&apos;t be costed — fix the rows above to price this recipe.
          </p>
        ) : recipe.salePrice == null ? (
          <p className="text-xs text-slate-500">
            Enter a sale price to see food-cost % and margin.
          </p>
        ) : null}

        {/* Interactive repricing — drag a target food cost, see the price live. */}
        <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-brand-700">
                Repricing
              </div>
              <p className="text-sm text-slate-600">Drag to a target food cost.</p>
            </div>
            <label htmlFor={`target-${recipe.id}`} className="text-right">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Target food cost
              </span>
              <span className="text-2xl font-bold tabular-nums text-brand-700">{sliderValue}%</span>
            </label>
          </div>

          <input
            id={`target-${recipe.id}`}
            type="range"
            min={TARGET_MIN}
            max={TARGET_MAX}
            step={1}
            value={sliderValue}
            disabled={!repriceable}
            aria-label="Target food cost percent"
            aria-valuetext={`${sliderValue}%`}
            onChange={(e) => setTarget(e.target.value)}
            className="range-brand mt-4"
            style={{
              background: `linear-gradient(to right, #0d9488 ${fillPct}%, #ccfbf1 ${fillPct}%)`,
            }}
          />
          <div className="mt-1 flex justify-between text-[11px] tabular-nums text-slate-400">
            <span>{TARGET_MIN}%</span>
            <span>{TARGET_MAX}%</span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3 border-t border-brand-100 pt-4">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Suggested price
              </div>
              <div className="text-3xl font-bold tabular-nums text-ink">
                {formatCurrency(suggested)}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                {suggested != null
                  ? `≈ ${formatPercent(100 - sliderValue, 0)} gross margin / serving`
                  : "Add a cost per serving to reprice"}
              </div>
            </div>
            <Button
              variant={applied ? "secondary" : "primary"}
              size="sm"
              disabled={suggested == null || applied}
              onClick={() => {
                if (suggested == null) return;
                s.updateRecipe(recipe.id, { salePrice: Math.round(suggested * 100) / 100 });
              }}
            >
              {applied ? "Applied ✓" : "Apply as sale price"}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
