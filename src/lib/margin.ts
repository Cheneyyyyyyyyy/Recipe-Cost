import { LOW_MARGIN_FOOD_COST_THRESHOLD } from "./constants";

export type MarginLevel = "healthy" | "watch" | "low" | "unknown";

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
