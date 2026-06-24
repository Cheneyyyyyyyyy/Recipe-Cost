import { LOW_MARGIN_FOOD_COST_THRESHOLD } from "./constants";
import type { RecipeCostResult } from "./costing";
import type { Recipe } from "./types";

export type MarginLevel =
  | "healthy"
  | "watch"
  | "low"
  | "unknown"
  | "error"
  | "no-yield";

export interface MarginStatus {
  level: MarginLevel;
  /** Badge tone matching components/ui/Badge tones. */
  tone: "good" | "warn" | "bad" | "neutral";
  label: string;
}

/**
 * Classify a recipe by its food-cost %. Shared by the dashboard and the recipe
 * builder so the flagging is identical everywhere.
 *   - null              -> unknown (no sale price set)
 *   - >= threshold      -> low margin (flagged)
 *   - within 5pts below -> watch
 *   - otherwise         -> healthy
 */
export function marginStatus(foodCostPercent: number | null): MarginStatus {
  if (foodCostPercent == null || Number.isNaN(foodCostPercent)) {
    return { level: "unknown", tone: "neutral", label: "No price" };
  }
  if (foodCostPercent >= LOW_MARGIN_FOOD_COST_THRESHOLD) {
    return { level: "low", tone: "bad", label: "Low margin" };
  }
  if (foodCostPercent >= LOW_MARGIN_FOOD_COST_THRESHOLD - 5) {
    return { level: "watch", tone: "warn", label: "Watch" };
  }
  return { level: "healthy", tone: "good", label: "Healthy" };
}

/**
 * Status for a whole recipe, accounting for problems that make its margin
 * unattributable rather than simply unknown. Use this (not raw marginStatus)
 * wherever a recipe is summarised — dashboard, recipe cards, margin panel — so
 * a recipe with an uncostable line item or a zero yield is flagged for a fix
 * instead of being shown as "Healthy" or "No price".
 */
export function recipeStatus(result: RecipeCostResult, recipe: Recipe): MarginStatus {
  if (result.hasErrors) {
    return { level: "error", tone: "bad", label: "Check recipe" };
  }
  const priced = recipe.salePrice != null && recipe.salePrice > 0;
  if (priced && recipe.yield <= 0) {
    return { level: "no-yield", tone: "warn", label: "Set yield" };
  }
  return marginStatus(result.foodCostPercent);
}
