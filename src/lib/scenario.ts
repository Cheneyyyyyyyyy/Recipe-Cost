import { DAYS_PER_MONTH, DEFAULT_DISH_DAILY_VOLUME } from "./constants";
import { estimateDishCost } from "./estimator";
import type { MenuAnalysisItem, ScenarioParameters } from "./types";

/** Per-dish before/after impact of a scenario. */
export interface DishImpact {
  name: string;
  /** Plate margin before the change (price − cost). */
  originalMargin: number;
  newMargin: number;
  /** Estimated monthly margin before / after, using assumed volume. */
  originalMonthly: number;
  newMonthly: number;
  /** newMonthly − originalMonthly. */
  monthlyDelta: number;
  /** True if this dish was directly affected by the scenario. */
  affected: boolean;
}

export interface ScenarioResult {
  perDish: DishImpact[];
  /** Sum of monthly deltas across the menu. */
  totalMonthlyImpact: number;
  /** Sum of original monthly margin across the menu. */
  totalOriginalMonthly: number;
  totalNewMonthly: number;
}

/** Monthly plate volume for a single dish given the restaurant's covers. */
function monthlyVolume(estimatedDailyCovers: number | undefined, itemCount: number): number {
  const daily =
    estimatedDailyCovers && estimatedDailyCovers > 0 && itemCount > 0
      ? estimatedDailyCovers / itemCount
      : DEFAULT_DISH_DAILY_VOLUME;
  return daily * DAYS_PER_MONTH;
}

/** Cost contribution of a single ingredient within a dish, from its template. */
function ingredientContribution(item: MenuAnalysisItem, ingredientName: string): number {
  const est = estimateDishCost(item.name, item.category);
  const line = est.lines.find(
    (l) => l.ingredient.toLowerCase() === ingredientName.toLowerCase()
  );
  return line ? line.cost : 0;
}

/**
 * Project the margin impact of a what-if scenario across a restaurant's menu.
 * Pure and deterministic. Works off the audit's analysed items (price +
 * estimated cost), so it needs no separate recipe data.
 */
export function scenarioImpact(
  items: MenuAnalysisItem[],
  params: ScenarioParameters,
  options: { estimatedDailyCovers?: number } = {}
): ScenarioResult {
  const volume = monthlyVolume(options.estimatedDailyCovers, items.length);

  const perDish: DishImpact[] = items.map((item) => {
    const originalMargin = item.currentPrice - item.estimatedCost;
    let newPrice = item.currentPrice;
    let newCost = item.estimatedCost;
    let affected = false;
    let dishVolume = volume;
    let originalVolume = volume;

    switch (params.kind) {
      case "ingredient-change": {
        const contribution = ingredientContribution(item, params.ingredientName);
        if (contribution > 0) {
          newCost = item.estimatedCost + contribution * (params.percentChange / 100);
          affected = true;
        }
        break;
      }
      case "price-change": {
        newPrice = item.currentPrice * (1 + params.priceChangePercent / 100);
        affected = params.priceChangePercent !== 0;
        break;
      }
      case "menu-change": {
        const cut = params.cutItemNames.includes(item.name);
        const promote = params.promoteItemNames.includes(item.name);
        if (cut) {
          // Dropping the dish: its margin contribution goes to zero.
          dishVolume = 0;
          affected = true;
        } else if (promote) {
          // Promotion lifts volume ~25% toward the higher-margin item.
          dishVolume = volume * 1.25;
          affected = true;
        }
        break;
      }
    }

    const newMargin = newPrice - newCost;
    const originalMonthly = originalMargin * originalVolume;
    const newMonthly = newMargin * dishVolume;
    return {
      name: item.name,
      originalMargin,
      newMargin,
      originalMonthly,
      newMonthly,
      monthlyDelta: newMonthly - originalMonthly,
      affected,
    };
  });

  const totalOriginalMonthly = perDish.reduce((s, d) => s + d.originalMonthly, 0);
  const totalNewMonthly = perDish.reduce((s, d) => s + d.newMonthly, 0);

  return {
    perDish,
    totalOriginalMonthly,
    totalNewMonthly,
    totalMonthlyImpact: totalNewMonthly - totalOriginalMonthly,
  };
}
