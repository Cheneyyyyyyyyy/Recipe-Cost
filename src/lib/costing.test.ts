import { describe, expect, it } from "vitest";
import {
  DimensionMismatchError,
  costPerServing,
  costRecipe,
  foodCostPercent,
  indexIngredients,
  ingredientUnitCost,
  recipeItemCost,
  suggestedPrice,
  totalRecipeCost,
} from "./costing";
import { toBaseUnit } from "./units";
import type { Ingredient, Recipe } from "./types";

const oliveOil: Ingredient = {
  id: "olive-oil",
  name: "Olive oil",
  category: "Pantry",
  purchasePrice: 24, // $24 for 3 L
  purchaseQty: 3,
  purchaseUnit: "l",
};

const flour: Ingredient = {
  id: "flour",
  name: "Flour",
  category: "Pantry",
  purchasePrice: 10, // $10 for 5 kg
  purchaseQty: 5,
  purchaseUnit: "kg",
};

const egg: Ingredient = {
  id: "egg",
  name: "Egg",
  category: "Dairy",
  purchasePrice: 6, // $6 for 12 eggs
  purchaseQty: 12,
  purchaseUnit: "each",
};

describe("toBaseUnit", () => {
  it("normalizes weight to grams", () => {
    expect(toBaseUnit(2, "kg")).toBe(2000);
    expect(toBaseUnit(250, "g")).toBe(250);
  });
  it("normalizes volume to milliliters", () => {
    expect(toBaseUnit(1.5, "l")).toBe(1500);
    expect(toBaseUnit(30, "ml")).toBe(30);
  });
  it("leaves count alone", () => {
    expect(toBaseUnit(3, "each")).toBe(3);
  });
});

describe("ingredientUnitCost", () => {
  it("computes cost per base unit", () => {
    // $24 / (3 L -> 3000 ml) = $0.008 per ml
    expect(ingredientUnitCost(oliveOil)).toBeCloseTo(0.008, 6);
    // $10 / (5 kg -> 5000 g) = $0.002 per g
    expect(ingredientUnitCost(flour)).toBeCloseTo(0.002, 6);
    // $6 / 12 = $0.50 per egg
    expect(ingredientUnitCost(egg)).toBeCloseTo(0.5, 6);
  });

  it("throws on non-positive purchase quantity", () => {
    expect(() => ingredientUnitCost({ ...flour, purchaseQty: 0 })).toThrow(RangeError);
  });
});

describe("recipeItemCost", () => {
  it("costs a line item within the same dimension", () => {
    // 30 ml of olive oil at $0.008/ml = $0.24
    expect(recipeItemCost({ ingredientId: "olive-oil", quantity: 30, unit: "ml" }, oliveOil)).toBeCloseTo(
      0.24,
      6
    );
    // 0.5 kg flour -> 500 g at $0.002/g = $1.00
    expect(recipeItemCost({ ingredientId: "flour", quantity: 0.5, unit: "kg" }, flour)).toBeCloseTo(
      1,
      6
    );
  });

  it("rejects mixing dimensions", () => {
    expect(() =>
      recipeItemCost({ ingredientId: "flour", quantity: 2, unit: "each" }, flour)
    ).toThrow(DimensionMismatchError);
  });
});

describe("totalRecipeCost", () => {
  it("sums every line item", () => {
    const map = indexIngredients([oliveOil, flour, egg]);
    const total = totalRecipeCost(
      [
        { ingredientId: "olive-oil", quantity: 30, unit: "ml" }, // 0.24
        { ingredientId: "flour", quantity: 500, unit: "g" }, // 1.00
        { ingredientId: "egg", quantity: 2, unit: "each" }, // 1.00
      ],
      map
    );
    expect(total).toBeCloseTo(2.24, 6);
  });

  it("throws on an unknown ingredient reference", () => {
    const map = indexIngredients([flour]);
    expect(() =>
      totalRecipeCost([{ ingredientId: "ghost", quantity: 1, unit: "g" }], map)
    ).toThrow();
  });
});

describe("costPerServing", () => {
  it("divides total cost by yield", () => {
    expect(costPerServing(2.24, 4)).toBeCloseTo(0.56, 6);
  });
  it("throws on a yield of zero", () => {
    expect(() => costPerServing(2.24, 0)).toThrow(RangeError);
  });
});

describe("foodCostPercent", () => {
  it("expresses cost per serving as a percentage of sale price", () => {
    // $3 cost / $10 price = 30%
    expect(foodCostPercent(3, 10)).toBeCloseTo(30, 6);
  });
  it("throws when sale price is not positive", () => {
    expect(() => foodCostPercent(3, 0)).toThrow(RangeError);
  });
});

describe("suggestedPrice", () => {
  it("solves for the price that hits a target food-cost %", () => {
    // $3 cost at a 30% target -> $10
    expect(suggestedPrice(3, 30)).toBeCloseTo(10, 6);
  });
  it("throws on a non-positive target", () => {
    expect(() => suggestedPrice(3, 0)).toThrow(RangeError);
  });
});

describe("costRecipe (aggregate breakdown)", () => {
  const map = indexIngredients([oliveOil, flour, egg]);

  const pasta: Recipe = {
    id: "pasta",
    name: "Fresh pasta",
    yield: 4,
    salePrice: 8,
    items: [
      { ingredientId: "olive-oil", quantity: 30, unit: "ml" }, // 0.24
      { ingredientId: "flour", quantity: 500, unit: "g" }, // 1.00
      { ingredientId: "egg", quantity: 4, unit: "each" }, // 2.00
    ],
  };

  it("computes totals, per-serving, food-cost %, and margins", () => {
    const r = costRecipe(pasta, map);
    expect(r.totalCost).toBeCloseTo(3.24, 6);
    expect(r.costPerServing).toBeCloseTo(0.81, 6);
    expect(r.foodCostPercent).toBeCloseTo(10.125, 4);
    expect(r.marginPerServing).toBeCloseTo(7.19, 6);
    expect(r.marginPercent).toBeCloseTo(89.875, 4);
    expect(r.hasErrors).toBe(false);
  });

  it("returns null food-cost % when there is no sale price", () => {
    const r = costRecipe({ ...pasta, salePrice: null }, map);
    expect(r.foodCostPercent).toBeNull();
    expect(r.marginPerServing).toBeNull();
    expect(r.costPerServing).toBeCloseTo(0.81, 6);
  });

  it("returns null cost per serving when yield is zero", () => {
    const r = costRecipe({ ...pasta, yield: 0 }, map);
    expect(r.costPerServing).toBeNull();
    expect(r.foodCostPercent).toBeNull();
  });

  it("flags a deleted ingredient without throwing", () => {
    const r = costRecipe(
      { ...pasta, items: [{ ingredientId: "deleted", quantity: 1, unit: "g" }] },
      map
    );
    expect(r.hasErrors).toBe(true);
    expect(r.items[0].cost).toBeNull();
    expect(r.items[0].error).toMatch(/deleted/i);
  });

  it("flags a dimension mismatch without throwing", () => {
    const r = costRecipe(
      { ...pasta, items: [{ ingredientId: "flour", quantity: 2, unit: "each" }] },
      map
    );
    expect(r.hasErrors).toBe(true);
    expect(r.items[0].cost).toBeNull();
    expect(r.items[0].error).toMatch(/mismatch/i);
  });
});
