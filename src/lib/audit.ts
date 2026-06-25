import {
  AUDIT_HEADROOM_THRESHOLD,
  AUDIT_TARGET_FOOD_COST,
  AUDIT_UNDERWATER_THRESHOLD,
  DAYS_PER_MONTH,
  DEFAULT_DISH_DAILY_VOLUME,
} from "./constants";
import { competitorPrice } from "./data/competitorPricing";
import { estimateDishCost } from "./estimator";
import { formatCurrency } from "./format";
import type {
  AuditFlag,
  DishCategory,
  MenuAnalysisItem,
  Neighborhood,
} from "./types";

/** Raw menu line a user enters for an audit. */
export interface MenuItemInput {
  name: string;
  category: DishCategory;
  currentPrice: number;
}

/** A concrete, ranked recommendation surfaced in the report. */
export interface AuditRecommendation {
  /** Which dish it concerns (for linking back to the table). */
  dish: string;
  /** "raise" | "promote" | "rework" — drives the icon/tone. */
  kind: "raise" | "promote" | "rework";
  text: string;
  /** Estimated monthly margin impact, if quantifiable. */
  monthlyImpact: number | null;
}

export interface AuditSummary {
  itemCount: number;
  /** Items flagged "underwater" (food cost above the healthy ceiling). */
  underwaterCount: number;
  /** Items with pricing headroom (low food cost or priced below corridor). */
  headroomCount: number;
  avgFoodCostPercent: number | null;
  /** Sum of the quantifiable monthly impact across all recommendations. */
  monthlyOpportunity: number;
  /** One-paragraph plain-English summary for the report header. */
  headline: string;
}

export interface AuditResult {
  items: MenuAnalysisItem[];
  summary: AuditSummary;
  recommendations: AuditRecommendation[];
}

/** Classify a dish by estimated food cost % and its price vs. the corridor. */
export function flagFor(
  foodCostPercent: number,
  currentPrice: number,
  competitorAvg: number | null
): AuditFlag {
  if (foodCostPercent > AUDIT_UNDERWATER_THRESHOLD) return "underwater";
  if (foodCostPercent < AUDIT_HEADROOM_THRESHOLD) {
    // Very high margin. Call it "overpriced" only when its price is also clearly
    // above the corridor (risk to volume); otherwise it's simply healthy/strong.
    if (competitorAvg != null && currentPrice > competitorAvg * 1.1) return "overpriced";
    return "healthy";
  }
  return "healthy";
}

/** Assumed plates/day for a single dish given the restaurant's covers estimate. */
function dailyVolumeFor(estimatedDailyCovers: number | undefined, itemCount: number): number {
  if (estimatedDailyCovers && estimatedDailyCovers > 0 && itemCount > 0) {
    // Spread covers across the menu, weighting nothing in particular.
    return estimatedDailyCovers / itemCount;
  }
  return DEFAULT_DISH_DAILY_VOLUME;
}

/**
 * Build a per-dish recommendation. Returns null for dishes that are already
 * well-priced and unremarkable.
 */
function recommendationFor(
  item: MenuAnalysisItem,
  perDishDailyVolume: number
): AuditRecommendation | null {
  const monthlyUnits = perDishDailyVolume * DAYS_PER_MONTH;

  if (item.flag === "underwater") {
    // Price to hit a healthy target food cost; nudge toward corridor avg if higher.
    const targetPrice = item.estimatedCost / (AUDIT_TARGET_FOOD_COST / 100);
    let suggested = Math.max(targetPrice, item.currentPrice);
    if (item.competitorAvg != null) suggested = Math.max(suggested, item.competitorAvg);
    suggested = roundTo(suggested, 0.25);
    const delta = suggested - item.currentPrice;
    const monthlyImpact = delta > 0 ? delta * monthlyUnits : null;
    return {
      dish: item.name,
      kind: "raise",
      monthlyImpact,
      text:
        `${item.name} is running an estimated ${Math.round(item.foodCostPercent)}% food cost at ` +
        `${formatCurrency(item.currentPrice)}. Raising it to ${formatCurrency(suggested)} ` +
        `brings it to a healthier ~${AUDIT_TARGET_FOOD_COST}% margin` +
        (item.competitorAvg != null
          ? ` and in line with the ${formatCurrency(item.competitorAvg)} corridor average`
          : "") +
        (monthlyImpact ? `, recovering ~${formatCurrency(monthlyImpact)}/month at typical volume.` : "."),
    };
  }

  // Priced below corridor average — clear headroom to raise toward the market.
  if (item.competitorAvg != null && item.currentPrice < item.competitorAvg * 0.92) {
    const suggested = roundTo((item.currentPrice + item.competitorAvg) / 2, 0.25);
    const delta = suggested - item.currentPrice;
    const monthlyImpact = delta > 0 ? delta * monthlyUnits : null;
    return {
      dish: item.name,
      kind: "raise",
      monthlyImpact,
      text:
        `${item.name} is priced ${formatCurrency(item.competitorAvg - item.currentPrice)} below the ` +
        `${formatCurrency(item.competitorAvg)} corridor average. Nudging it to ${formatCurrency(suggested)} ` +
        `captures market pricing` +
        (monthlyImpact ? ` — about ${formatCurrency(monthlyImpact)}/month.` : "."),
    };
  }

  // Strong margin and well-priced — a candidate to promote.
  if (item.flag === "healthy" && item.foodCostPercent < AUDIT_HEADROOM_THRESHOLD + 3) {
    return {
      dish: item.name,
      kind: "promote",
      monthlyImpact: null,
      text:
        `${item.name} is one of your strongest-margin items (~${Math.round(item.foodCostPercent)}% food cost). ` +
        `Feature it — menu placement, specials, or staff upsell — to shift volume toward profit.`,
    };
  }

  return null;
}

/**
 * Analyse a restaurant's menu: estimate each dish's cost, flag it, compare to
 * the corridor, and produce a ranked set of recommendations + a summary. Pure
 * and deterministic — the same inputs always produce the same report.
 */
export function analyzeMenu(
  neighborhood: Neighborhood,
  items: MenuItemInput[],
  options: { estimatedDailyCovers?: number } = {}
): AuditResult {
  const perDishVolume = dailyVolumeFor(options.estimatedDailyCovers, items.length);

  const analyzed: MenuAnalysisItem[] = items.map((input) => {
    const estimate = estimateDishCost(input.name, input.category);
    const price = input.currentPrice;
    const foodCostPercent = price > 0 ? (estimate.cost / price) * 100 : 0;
    const comp = competitorPrice(neighborhood, input.category);
    const competitorAvg = comp ? comp.priceAvg : null;
    return {
      name: input.name,
      category: input.category,
      currentPrice: price,
      estimatedCost: estimate.cost,
      foodCostPercent,
      flag: flagFor(foodCostPercent, price, competitorAvg),
      competitorAvg,
      recommendation: null, // filled below from the ranked recommendations
    };
  });

  // Build per-dish recommendations, rank, and attach the headline rec back to the item.
  const recs = analyzed
    .map((item) => recommendationFor(item, perDishVolume))
    .filter((r): r is AuditRecommendation => r !== null);

  // Rank: quantifiable impact first (largest), then promotes.
  recs.sort((a, b) => (b.monthlyImpact ?? -1) - (a.monthlyImpact ?? -1));

  // Attach each dish's own recommendation text for the table column.
  for (const item of analyzed) {
    const own = recs.find((r) => r.dish === item.name);
    item.recommendation = own ? own.text : null;
  }

  const priced = analyzed.filter((i) => i.currentPrice > 0);
  const avgFoodCostPercent =
    priced.length > 0
      ? priced.reduce((s, i) => s + i.foodCostPercent, 0) / priced.length
      : null;
  const underwaterCount = analyzed.filter((i) => i.flag === "underwater").length;
  const headroomCount = analyzed.filter(
    (i) => i.foodCostPercent < AUDIT_HEADROOM_THRESHOLD || i.flag === "overpriced"
  ).length;
  const monthlyOpportunity = recs.reduce((s, r) => s + (r.monthlyImpact ?? 0), 0);

  const summary: AuditSummary = {
    itemCount: analyzed.length,
    underwaterCount,
    headroomCount,
    avgFoodCostPercent,
    monthlyOpportunity,
    headline: buildHeadline(analyzed.length, underwaterCount, monthlyOpportunity),
  };

  return { items: analyzed, summary, recommendations: recs.slice(0, 5) };
}

function buildHeadline(itemCount: number, underwaterCount: number, monthlyOpportunity: number): string {
  if (itemCount === 0) return "Add menu items to generate an analysis.";
  const moneyPart =
    monthlyOpportunity > 0
      ? ` That's an estimated ${formatCurrency(monthlyOpportunity)} in monthly margin left on the table.`
      : "";
  if (underwaterCount === 0) {
    return (
      `We analysed ${itemCount} menu item${itemCount === 1 ? "" : "s"}. ` +
      `None are running above a healthy ${AUDIT_UNDERWATER_THRESHOLD}% food-cost threshold — ` +
      `a solid menu, with a few opportunities to capture more value.${moneyPart}`
    );
  }
  return (
    `We analysed ${itemCount} menu item${itemCount === 1 ? "" : "s"}. ` +
    `${underwaterCount} ${underwaterCount === 1 ? "is" : "are"} likely running above a healthy ` +
    `${AUDIT_UNDERWATER_THRESHOLD}% food-cost threshold.${moneyPart}`
  );
}

/** Round to the nearest `step` (e.g. 0.25 for quarter-dollar pricing). */
function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}
