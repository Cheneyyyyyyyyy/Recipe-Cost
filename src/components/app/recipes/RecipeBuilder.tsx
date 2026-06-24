"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { costRecipe } from "@/lib/costing";
import type { Recipe } from "@/lib/types";
import { RecipeItemRow } from "./RecipeItemRow";
import { CostBreakdown } from "./CostBreakdown";
import { MarginPanel } from "./MarginPanel";

/** The live recipe editor: name + yield, line items, and a sticky cost/margin column. */
export function RecipeBuilder({ recipe }: { recipe: Recipe }) {
  const s = useStore();
  const result = costRecipe(recipe, s.ingredientsById);

  // Yield held as a raw string so an empty field reads as 0 rather than NaN.
  const [yieldDraft, setYieldDraft] = useState(() => String(recipe.yield));
  useEffect(() => {
    const parsed = yieldDraft === "" ? 0 : Number(yieldDraft);
    if (parsed !== recipe.yield) setYieldDraft(String(recipe.yield));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe.yield]);

  const hasIngredients = s.ingredients.length > 0;

  const addItem = () => {
    const first = s.ingredients[0];
    if (!first) return;
    s.addRecipeItem(recipe.id, { ingredientId: first.id, quantity: 1, unit: first.purchaseUnit });
  };

  return (
    <div className="space-y-6">
      {/* Name + yield */}
      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Field label="Recipe name" htmlFor="recipe-name" className="flex-1">
            <Input
              id="recipe-name"
              value={recipe.name}
              placeholder="Untitled recipe"
              className="text-lg font-semibold"
              onChange={(e) => s.updateRecipe(recipe.id, { name: e.target.value })}
            />
          </Field>
          <Field
            label="Yield (servings)"
            htmlFor="recipe-yield"
            className="sm:w-44"
            error={recipe.yield <= 0 ? "Must be greater than 0" : null}
          >
            <Input
              id="recipe-yield"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              className="tabular-nums"
              invalid={recipe.yield <= 0}
              value={yieldDraft}
              onChange={(e) => {
                const v = e.target.value;
                setYieldDraft(v);
                const n = v === "" ? 0 : Number(v);
                s.updateRecipe(recipe.id, { yield: Number.isNaN(n) ? 0 : n });
              }}
            />
          </Field>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Line items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Ingredients"
              action={
                hasIngredients ? (
                  <Button size="sm" onClick={addItem}>
                    Add ingredient
                  </Button>
                ) : null
              }
            />
            <CardBody>
              {recipe.items.length > 0 ? (
                <div>
                  {/* Column headers (desktop only) */}
                  <div className="hidden grid-cols-12 gap-3 border-b border-slate-100 pb-2 text-xs font-medium uppercase tracking-wide text-slate-500 sm:grid">
                    <div className="col-span-5">Ingredient</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-2">Unit</div>
                    <div className="col-span-2 text-right">Cost</div>
                    <div className="col-span-1" />
                  </div>
                  <div className="space-y-3 sm:space-y-0">
                    {recipe.items.map((item, i) => (
                      <RecipeItemRow
                        key={i}
                        recipeId={recipe.id}
                        index={i}
                        item={item}
                        result={result.items[i]}
                      />
                    ))}
                  </div>
                  {!hasIngredients ? (
                    <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                      Your ingredient library is empty.{" "}
                      <Link href="/demo/ingredients" className="font-medium underline">
                        Add ingredients
                      </Link>{" "}
                      to fix the rows above or add more.
                    </p>
                  ) : null}
                </div>
              ) : !hasIngredients ? (
                <p className="text-sm text-slate-500">
                  No ingredients yet.{" "}
                  <Link
                    href="/demo/ingredients"
                    className="font-medium text-brand-700 hover:text-brand-600"
                  >
                    Add ingredients
                  </Link>{" "}
                  first, then build your recipe.
                </p>
              ) : (
                <EmptyState
                  title="No ingredients added"
                  description="Add your first line item to start costing this recipe."
                  action={
                    <Button size="sm" onClick={addItem}>
                      Add ingredient
                    </Button>
                  }
                />
              )}
            </CardBody>
          </Card>
        </div>

        {/* Cost + margin summary */}
        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <CostBreakdown result={result} recipe={recipe} />
          <MarginPanel recipe={recipe} result={result} />
        </div>
      </div>
    </div>
  );
}
