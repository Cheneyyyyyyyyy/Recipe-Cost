"use client";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { formatCurrency } from "@/lib/format";
import type { RecipeCostResult } from "@/lib/costing";
import type { Recipe } from "@/lib/types";

/** Read-only summary of where a recipe's cost comes from. */
export function CostBreakdown({
  result,
  recipe,
}: {
  result: RecipeCostResult;
  recipe: Recipe;
}) {
  const noYield = recipe.yield <= 0;
  // Cost / serving is unattributable when items error or the yield is 0.
  const perServingHint = result.hasErrors
    ? "Resolve the line-item errors"
    : noYield
      ? "Set a yield greater than 0"
      : `Makes ${recipe.yield} serving${recipe.yield === 1 ? "" : "s"}`;

  return (
    <Card>
      <CardHeader title="Cost breakdown" />
      <CardBody className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Stat
            label={result.hasErrors ? "Cost so far" : "Total recipe cost"}
            value={formatCurrency(result.totalCost)}
          />
          <Stat
            label="Cost / serving"
            value={formatCurrency(result.costPerServing)}
            tone={result.hasErrors || noYield ? "warn" : "default"}
            hint={perServingHint}
          />
        </div>
        {result.hasErrors ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Some line items could not be costed — see the rows above.
          </p>
        ) : null}
      </CardBody>
    </Card>
  );
}
