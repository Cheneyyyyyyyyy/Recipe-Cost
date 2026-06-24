"use client";

import { useMemo } from "react";
import type { Ingredient } from "@/lib/types";
import { useStore } from "@/lib/store";
import { ingredientUnitCost } from "@/lib/costing";
import { dimensionOf } from "@/lib/units";
import { formatCurrency, formatUnitCostPerBase } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface IngredientTableProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredient: Ingredient) => void;
}

/** Unit cost can throw on a non-positive quantity; degrade to null, not a crash. */
function safeUnitCost(ingredient: Ingredient): number | null {
  try {
    return ingredientUnitCost(ingredient);
  } catch {
    return null;
  }
}

export function IngredientTable({ ingredients, onEdit, onDelete }: IngredientTableProps) {
  const { recipes } = useStore();

  // How many distinct recipes reference each ingredient.
  const usageCount = useMemo(() => {
    const counts = new Map<string, number>();
    for (const recipe of recipes) {
      const seen = new Set<string>();
      for (const item of recipe.items) {
        if (seen.has(item.ingredientId)) continue;
        seen.add(item.ingredientId);
        counts.set(item.ingredientId, (counts.get(item.ingredientId) ?? 0) + 1);
      }
    }
    return counts;
  }, [recipes]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Purchase</th>
            <th className="px-5 py-3">Unit cost</th>
            <th className="px-5 py-3">Used in</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((i) => {
            const count = usageCount.get(i.id) ?? 0;
            return (
              <tr
                key={i.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-5 py-3 font-medium text-ink">{i.name}</td>
                <td className="px-5 py-3">
                  <Badge tone="neutral">{i.category || "Uncategorized"}</Badge>
                </td>
                <td className="whitespace-nowrap px-5 py-3 tabular-nums text-slate-600">
                  {formatCurrency(i.purchasePrice)} / {i.purchaseQty} {i.purchaseUnit}
                </td>
                <td className="whitespace-nowrap px-5 py-3 tabular-nums text-ink">
                  {formatUnitCostPerBase(safeUnitCost(i), dimensionOf(i.purchaseUnit))}
                </td>
                <td className="px-5 py-3">
                  {count > 0 ? (
                    <Badge tone="brand">
                      {count} {count === 1 ? "recipe" : "recipes"}
                    </Badge>
                  ) : (
                    <Badge tone="neutral">Unused</Badge>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(i)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(i)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
