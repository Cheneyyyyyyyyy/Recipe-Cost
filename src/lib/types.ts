// Core domain types for Luma. Field names mirror PROJECT_BRIEF.md §4 exactly.

/** Units a user can buy or use an ingredient in. */
export type Unit = "g" | "kg" | "ml" | "l" | "each";

/** Physical dimension a unit belongs to. Units are only interconvertible within a dimension. */
export type Dimension = "weight" | "volume" | "count";

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  purchaseQty: number;
  purchaseUnit: Unit;
}

export interface RecipeItem {
  ingredientId: string;
  quantity: number;
  unit: Unit;
}

export interface Recipe {
  id: string;
  name: string;
  yield: number;
  salePrice: number | null;
  items: RecipeItem[];
  /**
   * Approximate orders per week — demo sales data used only for the
   * menu-engineering quadrant (popularity × margin). Optional; absent/0 for
   * user-created recipes since there's no POS/sales integration in scope.
   */
  popularity?: number;
}

// ===========================================================================
// V2 — Menu audit, market intelligence, client pipeline & scenario modeling.
// Field names mirror PROJECT_BRIEF_V2.md §4.
// ===========================================================================

/** Berkeley corridors the competitor-pricing dataset is organised by. */
export type Neighborhood =
  | "Telegraph Ave"
  | "Downtown"
  | "North Berkeley"
  | "Southside"
  | "Food Truck / Pop-up";

/** Restaurant format — drives the cost-structure assumptions in an audit. */
export type RestaurantType =
  | "dine-in"
  | "fast-casual"
  | "food-truck"
  | "pop-up"
  | "ghost-kitchen";

/** Where a restaurant sits in Ethan's sales pipeline. */
export type RestaurantStatus =
  | "prospect"
  | "audited"
  | "pitched"
  | "active"
  | "churned";

/**
 * Dish categories shared by the cost estimator and the competitor dataset.
 * Keep these slugs stable — competitor pricing and dish templates key off them.
 */
export type DishCategory =
  | "burrito/wrap"
  | "poke/grain bowl"
  | "burger"
  | "sandwich"
  | "pizza-slice"
  | "pizza-whole"
  | "salad"
  | "noodle/ramen"
  | "rice plate"
  | "coffee"
  | "smoothie/juice"
  | "boba"
  | "pastry/bakery";

/** How a dish's estimated food cost compares to healthy thresholds. */
export type AuditFlag = "underwater" | "healthy" | "overpriced" | null;

export interface Restaurant {
  id: string;
  name: string;
  neighborhood: Neighborhood;
  type: RestaurantType;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  notes: string | null;
  status: RestaurantStatus;
  /** Rough plates/day across the menu — powers monthly-impact estimates. */
  estimatedDailyCovers?: number;
  createdAt: string;
}

export interface MenuAnalysisItem {
  name: string;
  category: DishCategory;
  currentPrice: number;
  /** Estimated ingredient cost per plate, from the cost database. */
  estimatedCost: number;
  /** Derived: estimatedCost / currentPrice * 100. */
  foodCostPercent: number;
  flag: AuditFlag;
  /** Avg price for this category in this neighborhood, if known. */
  competitorAvg: number | null;
  recommendation: string | null;
}

export interface MenuAnalysis {
  id: string;
  restaurantId: string;
  items: MenuAnalysisItem[];
  createdAt: string;
}

export interface CompetitorPricing {
  neighborhood: Neighborhood;
  category: DishCategory;
  priceLow: number;
  priceAvg: number;
  priceHigh: number;
  /** How many restaurants were sampled for this corridor × category. */
  sampleSize: number;
}

export interface SeasonalPattern {
  period: string;
  label: string;
  startMonth: number;
  endMonth: number;
  /** 1.0 = baseline traffic; 0.6 = 40% drop; 1.4 = 40% spike. */
  trafficMultiplier: number;
  recommendation: string;
}

/** Parameters for each scenario type (a discriminated union by `type`). */
export type ScenarioParameters =
  | { kind: "ingredient-change"; ingredientName: string; percentChange: number }
  | { kind: "price-change"; priceChangePercent: number }
  | { kind: "menu-change"; cutItemNames: string[]; promoteItemNames: string[] };

export interface Scenario {
  id: string;
  restaurantId: string;
  name: string;
  type: "ingredient-change" | "price-change" | "menu-change";
  parameters: ScenarioParameters;
  createdAt: string;
}

/** A single common restaurant ingredient with a Bay-Area estimate. */
export interface EstimatedIngredient {
  name: string;
  /** Price per `unit`, in USD. */
  costPerUnit: number;
  unit: Unit | "lb" | "oz";
  category: string;
}

/** One line of a dish template: an ingredient + how much a standard plate uses. */
export interface DishTemplateItem {
  /** Must match an EstimatedIngredient.name. */
  ingredient: string;
  /** Quantity in the ingredient's own unit (lb, oz, each, ml, g…). */
  quantity: number;
}

/** A standard recipe for a dish category, used to estimate plate cost. */
export interface DishTemplate {
  category: DishCategory;
  /** Optional name match — more specific templates win over the category default. */
  match?: string[];
  items: DishTemplateItem[];
}
