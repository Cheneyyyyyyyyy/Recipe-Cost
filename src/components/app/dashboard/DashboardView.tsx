"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { costRecipe } from "@/lib/costing";
import { recipeStatus, type MarginStatus } from "@/lib/margin";
import { formatPercent } from "@/lib/format";
import { LOW_MARGIN_FOOD_COST_THRESHOLD } from "@/lib/constants";
import type { Recipe } from "@/lib/types";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { EmptyState } from "@/components/ui/EmptyState";
import { MarginChart } from "./MarginChart";
import { RecipeMarginTable } from "./RecipeMarginTable";

/** Per-recipe margin summary shared by the chart and the table. */
export interface MarginRow {
  recipe: Recipe;
  costPerServing: number | null;
  foodCostPercent: number | null;
  marginPercent: number | null;
  status: MarginStatus;
}

export function DashboardView() {
  const s = useStore();

  // One costing pass per recipe; rebuilt whenever recipes or prices change.
  const rows = useMemo<MarginRow[]>(
    () =>
      s.recipes.map((recipe) => {
        const result = costRecipe(recipe, s.ingredientsById);
        return {
          recipe,
          costPerServing: result.costPerServing,
          foodCostPercent: result.foodCostPercent,
          marginPercent: result.marginPercent,
          status: recipeStatus(result, recipe),
        };
      }),
    [s.recipes, s.ingredientsById]
  );

  // Average food cost % only counts recipes that actually have a sale price.
  const priced = rows.filter((r) => r.foodCostPercent != null);
  const avgFoodCost =
    priced.length > 0
      ? priced.reduce((sum, r) => sum + (r.foodCostPercent as number), 0) / priced.length
      : null;
  const lowMarginCount = rows.filter((r) => r.status.level === "low").length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Every recipe ranked by margin, with low-margin dishes flagged."
      />

      {s.recipes.length === 0 ? (
        <EmptyState
          title="No recipes yet"
          description="Build a recipe to see its cost per serving, food-cost %, and margin ranked here."
          action={
            <Link
              href="/demo/recipes"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              Go to recipes
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Recipes" value={s.recipes.length} />
            <Stat label="Ingredients" value={s.ingredients.length} />
            <Stat
              label="Avg food cost %"
              value={formatPercent(avgFoodCost)}
              hint={priced.length > 0 ? `Across ${priced.length} priced` : "No priced recipes"}
            />
            <Stat
              label="Low-margin recipes"
              value={lowMarginCount}
              tone={lowMarginCount > 0 ? "bad" : "good"}
              hint={`At or above ${LOW_MARGIN_FOOD_COST_THRESHOLD}% food cost`}
            />
          </div>

          <Card>
            <CardHeader
              title="Food cost % by recipe"
              description={`Bars at or above the dashed ${LOW_MARGIN_FOOD_COST_THRESHOLD}% line are flagged as low-margin.`}
            />
            <CardBody>
              <MarginChart rows={rows} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recipes by margin" description="Best margin first; unpriced or incomplete recipes last." />
            <CardBody className="p-0">
              <RecipeMarginTable rows={rows} />
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
