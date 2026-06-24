"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { costRecipe } from "@/lib/costing";
import { marginStatus } from "@/lib/margin";
import { formatCurrency } from "@/lib/format";
import type { Recipe } from "@/lib/types";

/** Responsive grid of recipe cards, each linking into the builder. */
export function RecipeList({ recipes }: { recipes: Recipe[] }) {
  const s = useStore();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => {
        const result = costRecipe(recipe, s.ingredientsById);
        const status = marginStatus(result.foodCostPercent);
        const count = recipe.items.length;

        return (
          <Link key={recipe.id} href={`/app/recipes/${recipe.id}`} className="group block">
            <Card className="flex h-full flex-col transition-shadow group-hover:shadow-md">
              <div className="flex items-start justify-between gap-3 px-5 pt-5">
                <h3 className="font-semibold text-ink">{recipe.name}</h3>
                <Badge tone={status.tone}>{status.label}</Badge>
              </div>
              <p className="mt-1 px-5 text-xs text-slate-500">
                {recipe.yield} serving{recipe.yield === 1 ? "" : "s"} · {count} ingredient
                {count === 1 ? "" : "s"}
              </p>

              <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 px-5 py-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Cost / serving
                  </div>
                  <div className="mt-0.5 text-lg font-semibold tabular-nums text-ink">
                    {formatCurrency(result.costPerServing)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Sale price
                  </div>
                  <div className="mt-0.5 text-lg font-semibold tabular-nums text-ink">
                    {recipe.salePrice == null ? (
                      <span className="text-slate-400">No price</span>
                    ) : (
                      formatCurrency(recipe.salePrice)
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 px-5 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={(e) => {
                    // Keep the click from following the card's link.
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.confirm(`Delete "${recipe.name}"? This cannot be undone.`)) {
                      s.deleteRecipe(recipe.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
