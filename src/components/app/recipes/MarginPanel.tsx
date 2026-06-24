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
import { marginStatus } from "@/lib/margin";
import { DEFAULT_TARGET_FOOD_COST } from "@/lib/constants";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Recipe } from "@/lib/types";

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

  const status = marginStatus(result.foodCostPercent);
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

        {recipe.salePrice == null ? (
          <p className="text-xs text-slate-500">
            Enter a sale price to see food-cost % and margin.
          </p>
        ) : null}

        {/* Suggested price tool */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <Field
              label="Target food cost %"
              htmlFor={`target-${recipe.id}`}
              className="sm:max-w-[10rem]"
            >
              <Input
                id={`target-${recipe.id}`}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                className="tabular-nums"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </Field>
            <div className="sm:text-right">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Suggested price
              </div>
              <div className="mt-1 text-2xl font-semibold tabular-nums text-ink">
                {formatCurrency(suggested)}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                {suggested != null
                  ? `to hit a ${targetNum}% food cost`
                  : "Needs a cost per serving and a target above 0"}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Button
              variant="secondary"
              size="sm"
              disabled={suggested == null}
              onClick={() => {
                if (suggested == null) return;
                s.updateRecipe(recipe.id, { salePrice: Math.round(suggested * 100) / 100 });
              }}
            >
              Apply as sale price
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
