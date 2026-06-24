import type { Ingredient, Recipe, RecipeItem } from "./types";
import { sameDimension, toBaseUnit } from "./units";

/** Thrown when a recipe item uses a unit from a different dimension than how the ingredient was purchased. */
export class DimensionMismatchError extends Error {
  constructor(itemUnit: string, purchaseUnit: string, ingredientName?: string) {
    super(
      `Unit mismatch${ingredientName ? ` for "${ingredientName}"` : ""}: ` +
        `recipe uses "${itemUnit}" but the ingredient is priced per "${purchaseUnit}". ` +
        `Weight, volume, and count are not interconvertible.`
    );
    this.name = "DimensionMismatchError";
  }
}

// ---------------------------------------------------------------------------
// Pure formula functions — these implement PROJECT_BRIEF.md §5 exactly.
// ---------------------------------------------------------------------------

/** Cost per base unit (per gram / per ml / per each) of an ingredient. */
export function ingredientUnitCost(ingredient: Ingredient): number {
  const base = toBaseUnit(ingredient.purchaseQty, ingredient.purchaseUnit);
  if (!(base > 0)) {
    throw new RangeError(
      `Ingredient "${ingredient.name}" has a non-positive purchase quantity.`
    );
  }
  return ingredient.purchasePrice / base;
}

/** Cost contributed by a single recipe line item. Only valid within one dimension. */
export function recipeItemCost(item: RecipeItem, ingredient: Ingredient): number {
  if (!sameDimension(item.unit, ingredient.purchaseUnit)) {
    throw new DimensionMismatchError(item.unit, ingredient.purchaseUnit, ingredient.name);
  }
  return toBaseUnit(item.quantity, item.unit) * ingredientUnitCost(ingredient);
}

/** Sum of every line item's cost. */
export function totalRecipeCost(
  items: RecipeItem[],
  ingredientsById: Map<string, Ingredient>
): number {
  return items.reduce((sum, item) => {
    const ingredient = ingredientsById.get(item.ingredientId);
    if (!ingredient) {
      throw new Error(`Recipe references unknown ingredient "${item.ingredientId}".`);
    }
    return sum + recipeItemCost(item, ingredient);
  }, 0);
}

/** Total cost divided across the recipe yield. */
export function costPerServing(totalCost: number, yieldCount: number): number {
  if (!(yieldCount > 0)) {
    throw new RangeError("Yield must be greater than zero.");
  }
  return totalCost / yieldCount;
}

/** Cost per serving as a percentage of sale price. */
export function foodCostPercent(costPerServingValue: number, salePrice: number): number {
  if (!(salePrice > 0)) {
    throw new RangeError("Sale price must be greater than zero.");
  }
  return (costPerServingValue / salePrice) * 100;
}

/** Price that hits a target food-cost percentage. */
export function suggestedPrice(
  costPerServingValue: number,
  targetFoodCostPercent: number
): number {
  if (!(targetFoodCostPercent > 0)) {
    throw new RangeError("Target food-cost % must be greater than zero.");
  }
  return costPerServingValue / (targetFoodCostPercent / 100);
}

// ---------------------------------------------------------------------------
// Aggregate, non-throwing breakdown for the UI. Surfaces edge cases as data
// (null values + error strings) rather than exceptions so inputs can update live.
// ---------------------------------------------------------------------------

export interface ItemCostResult {
  item: RecipeItem;
  ingredient: Ingredient | null;
  cost: number | null;
  error: string | null;
}

export interface RecipeCostResult {
  items: ItemCostResult[];
  totalCost: number;
  costPerServing: number | null;
  foodCostPercent: number | null;
  /** Profit per serving = salePrice - costPerServing. */
  marginPerServing: number | null;
  /** Profit as a percentage of sale price = 100 - foodCostPercent. */
  marginPercent: number | null;
  hasErrors: boolean;
}

/**
 * Compute the full cost breakdown for a recipe without throwing.
 * Missing ingredients, dimension mismatches, zero yield, and missing sale
 * prices all degrade gracefully to null + an error message where relevant.
 */
export function costRecipe(
  recipe: Recipe,
  ingredientsById: Map<string, Ingredient>
): RecipeCostResult {
  let totalCost = 0;
  let hasErrors = false;

  const items: ItemCostResult[] = recipe.items.map((item) => {
    const ingredient = ingredientsById.get(item.ingredientId) ?? null;
    if (!ingredient) {
      hasErrors = true;
      return { item, ingredient: null, cost: null, error: "Ingredient was deleted." };
    }
    try {
      const cost = recipeItemCost(item, ingredient);
      totalCost += cost;
      return { item, ingredient, cost, error: null };
    } catch (err) {
      hasErrors = true;
      return {
        item,
        ingredient,
        cost: null,
        error: err instanceof Error ? err.message : "Could not compute cost.",
      };
    }
  });

  const perServing = recipe.yield > 0 ? totalCost / recipe.yield : null;
  const hasSale = recipe.salePrice != null && recipe.salePrice > 0;

  const fcPercent =
    perServing != null && hasSale ? (perServing / (recipe.salePrice as number)) * 100 : null;
  const marginPerServing =
    perServing != null && hasSale ? (recipe.salePrice as number) - perServing : null;
  const marginPercent = fcPercent != null ? 100 - fcPercent : null;

  return {
    items,
    totalCost,
    costPerServing: perServing,
    foodCostPercent: fcPercent,
    marginPerServing,
    marginPercent,
    hasErrors,
  };
}

/** Build a quick lookup map from an ingredient list. */
export function indexIngredients(ingredients: Ingredient[]): Map<string, Ingredient> {
  return new Map(ingredients.map((i) => [i.id, i]));
}
