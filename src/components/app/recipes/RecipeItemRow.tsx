"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ingredientUnitCost, type ItemCostResult } from "@/lib/costing";
import { UNITS, dimensionOf } from "@/lib/units";
import { formatCurrency, formatUnitCostPerBase } from "@/lib/format";
import type { RecipeItem, Unit } from "@/lib/types";

/** A single editable line item: ingredient, quantity, unit, and its live cost. */
export function RecipeItemRow({
  recipeId,
  index,
  item,
  result,
}: {
  recipeId: string;
  index: number;
  item: RecipeItem;
  result: ItemCostResult;
}) {
  const s = useStore();

  // Quantity is held as a raw string so partial entries (e.g. "1.") don't churn
  // to NaN. Re-sync during render (not in a post-paint effect) when the
  // underlying item changes — e.g. a row above is removed and React reuses this
  // instance for a different item — so the input never paints a stale value.
  const [qty, setQty] = useState(() => String(item.quantity));
  const [syncedQty, setSyncedQty] = useState(item.quantity);
  if (item.quantity !== syncedQty) {
    setSyncedQty(item.quantity);
    const parsed = qty === "" ? 0 : Number(qty);
    if (parsed !== item.quantity) setQty(String(item.quantity));
  }

  const ingredient = result.ingredient;
  const missing = ingredient == null;

  // Per-base unit cost hint. ingredientUnitCost throws on a non-positive qty, so guard it.
  let unitCostHint: string | null = null;
  if (ingredient) {
    try {
      unitCostHint = formatUnitCostPerBase(
        ingredientUnitCost(ingredient),
        dimensionOf(ingredient.purchaseUnit)
      );
    } catch {
      unitCostHint = null;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-12 sm:items-start sm:gap-3 sm:rounded-none sm:border-0 sm:border-b sm:border-slate-100 sm:p-0 sm:py-3">
      {/* Ingredient */}
      <div className="sm:col-span-5">
        <label className="mb-1 block text-xs font-medium text-slate-500 sm:hidden">Ingredient</label>
        <Select
          aria-label="Ingredient"
          value={item.ingredientId}
          onChange={(e) => {
            const next = s.getIngredient(e.target.value);
            if (!next) return;
            // Reset the unit to the new ingredient's purchase unit in the same update.
            s.updateRecipeItem(recipeId, index, { ingredientId: next.id, unit: next.purchaseUnit });
          }}
        >
          {missing ? <option value={item.ingredientId}>(deleted ingredient)</option> : null}
          {s.ingredients.map((ing) => (
            <option key={ing.id} value={ing.id}>
              {ing.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Quantity */}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs font-medium text-slate-500 sm:hidden">Qty</label>
        <Input
          aria-label="Quantity"
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          className="tabular-nums"
          value={qty}
          onChange={(e) => {
            const v = e.target.value;
            setQty(v);
            const n = v === "" ? 0 : Number(v);
            if (!Number.isNaN(n)) s.updateRecipeItem(recipeId, index, { quantity: n });
          }}
        />
      </div>

      {/* Unit */}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs font-medium text-slate-500 sm:hidden">Unit</label>
        <Select
          aria-label="Unit"
          value={item.unit}
          onChange={(e) => s.updateRecipeItem(recipeId, index, { unit: e.target.value as Unit })}
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </Select>
        {unitCostHint ? (
          <p className="mt-1 text-xs tabular-nums text-slate-400">{unitCostHint}</p>
        ) : null}
      </div>

      {/* Line cost */}
      <div className="sm:col-span-2 sm:pt-2 sm:text-right">
        <label className="mb-1 block text-xs font-medium text-slate-500 sm:hidden">Cost</label>
        {result.error ? (
          <span className="text-xs font-medium text-red-600">{result.error}</span>
        ) : (
          <span className="text-sm font-medium tabular-nums text-ink">{formatCurrency(result.cost)}</span>
        )}
      </div>

      {/* Remove */}
      <div className="flex justify-end sm:col-span-1 sm:pt-1">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Remove ingredient"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => s.removeRecipeItem(recipeId, index)}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
          </svg>
          <span className="sm:hidden">Remove</span>
        </Button>
      </div>
    </div>
  );
}
