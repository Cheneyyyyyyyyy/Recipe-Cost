import type { Ingredient, Recipe } from "./types";

/**
 * Seed data for the live demo. Prices are realistic wholesale figures so the
 * costing math lands on believable per-plate numbers. Ingredients span all
 * three dimensions (weight / volume / count). Recipe sale prices are tuned so
 * the dashboard shows a healthy spread of margins, including one item that
 * trips the low-margin flag.
 */

export const SEED_INGREDIENTS: Ingredient[] = [
  // ----- Pantry / dry goods (weight) -----
  { id: "ing-flour", name: "00 Flour", category: "Pantry", purchasePrice: 10, purchaseQty: 5, purchaseUnit: "kg" }, // $0.002/g
  { id: "ing-spaghetti", name: "Spaghetti", category: "Pantry", purchasePrice: 15, purchaseQty: 5, purchaseUnit: "kg" }, // $0.003/g
  { id: "ing-salt", name: "Sea Salt", category: "Pantry", purchasePrice: 2, purchaseQty: 1, purchaseUnit: "kg" }, // $0.002/g
  { id: "ing-croutons", name: "Croutons", category: "Pantry", purchasePrice: 6, purchaseQty: 1, purchaseUnit: "kg" }, // $0.006/g
  { id: "ing-coffee", name: "Espresso Beans", category: "Pantry", purchasePrice: 18, purchaseQty: 1, purchaseUnit: "kg" }, // $0.018/g

  // ----- Liquids (volume) -----
  { id: "ing-olive-oil", name: "Olive Oil", category: "Pantry", purchasePrice: 24, purchaseQty: 3, purchaseUnit: "l" }, // $0.008/ml
  { id: "ing-passata", name: "Tomato Passata", category: "Pantry", purchasePrice: 12, purchaseQty: 4, purchaseUnit: "l" }, // $0.003/ml
  { id: "ing-caesar", name: "Caesar Dressing", category: "Pantry", purchasePrice: 9, purchaseQty: 1.9, purchaseUnit: "l" }, // ~$0.00474/ml

  // ----- Dairy & protein (weight) -----
  { id: "ing-mozzarella", name: "Fresh Mozzarella", category: "Dairy", purchasePrice: 32, purchaseQty: 5, purchaseUnit: "kg" }, // $0.0064/g
  { id: "ing-parmesan", name: "Parmesan", category: "Dairy", purchasePrice: 40, purchaseQty: 2, purchaseUnit: "kg" }, // $0.02/g
  { id: "ing-cheddar", name: "Cheddar", category: "Dairy", purchasePrice: 30, purchaseQty: 2, purchaseUnit: "kg" }, // $0.015/g
  { id: "ing-mascarpone", name: "Mascarpone", category: "Dairy", purchasePrice: 14, purchaseQty: 1, purchaseUnit: "kg" }, // $0.014/g
  { id: "ing-beef", name: "Ground Beef", category: "Protein", purchasePrice: 40, purchaseQty: 5, purchaseUnit: "kg" }, // $0.008/g
  { id: "ing-guanciale", name: "Guanciale", category: "Protein", purchasePrice: 28, purchaseQty: 2, purchaseUnit: "kg" }, // $0.014/g

  // ----- Produce (weight) -----
  { id: "ing-basil", name: "Fresh Basil", category: "Produce", purchasePrice: 2.5, purchaseQty: 50, purchaseUnit: "g" }, // $0.05/g

  // ----- Counted items (each) -----
  { id: "ing-egg", name: "Eggs", category: "Dairy", purchasePrice: 6, purchaseQty: 12, purchaseUnit: "each" }, // $0.50/each
  { id: "ing-bun", name: "Brioche Bun", category: "Bakery", purchasePrice: 4, purchaseQty: 8, purchaseUnit: "each" }, // $0.50/each
  { id: "ing-romaine", name: "Romaine Heart", category: "Produce", purchasePrice: 18, purchaseQty: 12, purchaseUnit: "each" }, // $1.50/each
  { id: "ing-ladyfingers", name: "Ladyfingers", category: "Bakery", purchasePrice: 5, purchaseQty: 400, purchaseUnit: "g" }, // $0.0125/g
];

export const SEED_RECIPES: Recipe[] = [
  {
    id: "rec-margherita",
    name: "Margherita Pizza",
    yield: 1,
    salePrice: 14,
    popularity: 120, // Star: popular + high margin
    items: [
      { ingredientId: "ing-flour", quantity: 250, unit: "g" },
      { ingredientId: "ing-passata", quantity: 100, unit: "ml" },
      { ingredientId: "ing-mozzarella", quantity: 125, unit: "g" },
      { ingredientId: "ing-basil", quantity: 5, unit: "g" },
      { ingredientId: "ing-olive-oil", quantity: 15, unit: "ml" },
      { ingredientId: "ing-salt", quantity: 3, unit: "g" },
    ],
  },
  {
    id: "rec-carbonara",
    name: "Spaghetti Carbonara",
    yield: 2,
    salePrice: 9,
    popularity: 80, // Plowhorse: popular but thinner margin per serving
    items: [
      { ingredientId: "ing-spaghetti", quantity: 200, unit: "g" },
      { ingredientId: "ing-guanciale", quantity: 100, unit: "g" },
      { ingredientId: "ing-egg", quantity: 3, unit: "each" },
      { ingredientId: "ing-parmesan", quantity: 50, unit: "g" },
      { ingredientId: "ing-olive-oil", quantity: 10, unit: "ml" },
      { ingredientId: "ing-salt", quantity: 5, unit: "g" },
    ],
  },
  {
    id: "rec-cheeseburger",
    name: "Classic Cheeseburger",
    yield: 1,
    salePrice: 12,
    popularity: 95, // Star: popular + high margin
    items: [
      { ingredientId: "ing-beef", quantity: 180, unit: "g" },
      { ingredientId: "ing-bun", quantity: 1, unit: "each" },
      { ingredientId: "ing-cheddar", quantity: 30, unit: "g" },
    ],
  },
  {
    id: "rec-caesar",
    name: "Caesar Salad",
    yield: 1,
    salePrice: 11,
    popularity: 55, // Puzzle: high margin but lower volume
    items: [
      { ingredientId: "ing-romaine", quantity: 1, unit: "each" },
      { ingredientId: "ing-caesar", quantity: 60, unit: "ml" },
      { ingredientId: "ing-croutons", quantity: 40, unit: "g" },
      { ingredientId: "ing-parmesan", quantity: 20, unit: "g" },
    ],
  },
  {
    id: "rec-tiramisu",
    name: "Tiramisu (tray of 6)",
    yield: 6,
    salePrice: 6,
    popularity: 35, // Dog: low volume + low margin (food cost ~37%, flagged)
    items: [
      { ingredientId: "ing-mascarpone", quantity: 500, unit: "g" },
      { ingredientId: "ing-ladyfingers", quantity: 300, unit: "g" },
      { ingredientId: "ing-egg", quantity: 4, unit: "each" },
      { ingredientId: "ing-coffee", quantity: 40, unit: "g" },
    ],
  },
];

/** Fresh deep copies so callers can mutate seed-derived state safely. */
export function freshSeedIngredients(): Ingredient[] {
  return SEED_INGREDIENTS.map((i) => ({ ...i }));
}

export function freshSeedRecipes(): Recipe[] {
  return SEED_RECIPES.map((r) => ({ ...r, items: r.items.map((it) => ({ ...it })) }));
}
