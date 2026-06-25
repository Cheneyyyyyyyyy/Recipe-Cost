import type { DishCategory, DishTemplate } from "./types";
import { ESTIMATED_BY_NAME } from "./data/estimatedCosts";
import { DISH_TEMPLATES } from "./data/dishTemplates";

export interface EstimatedLine {
  ingredient: string;
  quantity: number;
  unit: string;
  /** Cost contributed by this line (quantity × unit cost). */
  cost: number;
}

export interface DishEstimate {
  /** Total estimated ingredient cost for one plate. */
  cost: number;
  /** Per-ingredient breakdown, for transparency in the UI. */
  lines: EstimatedLine[];
  /** True if a matching template + costed ingredients were found. */
  matched: boolean;
}

/**
 * Pick the best template for a dish: the most specific name match within the
 * category wins; otherwise the category's match-less default; otherwise null.
 */
export function pickTemplate(name: string, category: DishCategory): DishTemplate | null {
  const lower = name.toLowerCase();
  const inCategory = DISH_TEMPLATES.filter((t) => t.category === category);

  // Specific matches first — longest matching keyword wins for the best fit.
  let best: DishTemplate | null = null;
  let bestScore = 0;
  for (const t of inCategory) {
    if (!t.match) continue;
    for (const kw of t.match) {
      if (lower.includes(kw.toLowerCase()) && kw.length > bestScore) {
        best = t;
        bestScore = kw.length;
      }
    }
  }
  if (best) return best;

  // Fall back to the category default (match-less template).
  return inCategory.find((t) => !t.match) ?? inCategory[0] ?? null;
}

/**
 * Estimate the ingredient cost of a dish from its name + category, using the
 * built-in cost database and standard templates. Unknown ingredients are
 * skipped (they contribute $0) rather than throwing, so a partial template
 * still yields a usable number.
 */
export function estimateDishCost(name: string, category: DishCategory): DishEstimate {
  const template = pickTemplate(name, category);
  if (!template) {
    return { cost: 0, lines: [], matched: false };
  }

  const lines: EstimatedLine[] = [];
  let cost = 0;
  for (const item of template.items) {
    const ing = ESTIMATED_BY_NAME.get(item.ingredient.toLowerCase());
    if (!ing) continue;
    const lineCost = item.quantity * ing.costPerUnit;
    cost += lineCost;
    lines.push({
      ingredient: item.ingredient,
      quantity: item.quantity,
      unit: ing.unit,
      cost: lineCost,
    });
  }

  return { cost, lines, matched: lines.length > 0 };
}
