import type { EstimatedIngredient } from "../types";

/**
 * Estimated ingredient costs for the Bay Area, used to power the FREE menu
 * audit before a restaurant shares its real supplier prices. These are
 * realistic 2024–25 wholesale/cash-and-carry figures (Restaurant Depot / Costco
 * Business / Berkeley Bowl wholesale ballpark), not exact quotes — the point is
 * to get the audit "in the ballpark" so the pitch conversation is credible.
 *
 * Prices are per the listed `unit`. The dish estimator (see dishTemplates.ts +
 * estimator.ts) multiplies a template quantity (expressed in this same unit) by
 * `costPerUnit`, so keep template quantities in the unit declared here.
 */
export const ESTIMATED_INGREDIENTS: EstimatedIngredient[] = [
  // ---------------------------------------------------------------- Proteins
  { name: "chicken breast", costPerUnit: 3.5, unit: "lb", category: "protein" },
  { name: "chicken thigh", costPerUnit: 2.6, unit: "lb", category: "protein" },
  { name: "carnitas pork", costPerUnit: 3.8, unit: "lb", category: "protein" },
  { name: "ground beef 80/20", costPerUnit: 4.5, unit: "lb", category: "protein" },
  { name: "steak (flank)", costPerUnit: 9.5, unit: "lb", category: "protein" },
  { name: "carne asada", costPerUnit: 8.5, unit: "lb", category: "protein" },
  { name: "pulled pork", costPerUnit: 3.6, unit: "lb", category: "protein" },
  { name: "bacon", costPerUnit: 5.5, unit: "lb", category: "protein" },
  { name: "pork belly", costPerUnit: 6.0, unit: "lb", category: "protein" },
  { name: "sausage", costPerUnit: 4.8, unit: "lb", category: "protein" },
  { name: "ahi tuna (sashimi)", costPerUnit: 14.0, unit: "lb", category: "protein" },
  { name: "salmon", costPerUnit: 11.0, unit: "lb", category: "protein" },
  { name: "shrimp", costPerUnit: 9.0, unit: "lb", category: "protein" },
  { name: "tofu", costPerUnit: 1.8, unit: "lb", category: "protein" },
  { name: "falafel mix", costPerUnit: 2.2, unit: "lb", category: "protein" },
  { name: "egg", costPerUnit: 0.32, unit: "each", category: "protein" },
  { name: "pepperoni", costPerUnit: 5.2, unit: "lb", category: "protein" },
  { name: "deli turkey", costPerUnit: 5.0, unit: "lb", category: "protein" },
  { name: "deli ham", costPerUnit: 4.4, unit: "lb", category: "protein" },
  { name: "meatballs", costPerUnit: 4.2, unit: "lb", category: "protein" },

  // ----------------------------------------------------------------- Produce
  { name: "avocado", costPerUnit: 1.25, unit: "each", category: "produce" },
  { name: "tomato", costPerUnit: 1.6, unit: "lb", category: "produce" },
  { name: "roma tomato", costPerUnit: 1.4, unit: "lb", category: "produce" },
  { name: "yellow onion", costPerUnit: 0.9, unit: "lb", category: "produce" },
  { name: "red onion", costPerUnit: 1.1, unit: "lb", category: "produce" },
  { name: "bell pepper", costPerUnit: 1.5, unit: "each", category: "produce" },
  { name: "jalapeno", costPerUnit: 1.3, unit: "lb", category: "produce" },
  { name: "cilantro", costPerUnit: 0.5, unit: "each", category: "produce" },
  { name: "lime", costPerUnit: 0.25, unit: "each", category: "produce" },
  { name: "lemon", costPerUnit: 0.4, unit: "each", category: "produce" },
  { name: "romaine lettuce", costPerUnit: 1.5, unit: "each", category: "produce" },
  { name: "mixed greens", costPerUnit: 4.0, unit: "lb", category: "produce" },
  { name: "spinach", costPerUnit: 3.5, unit: "lb", category: "produce" },
  { name: "cabbage", costPerUnit: 0.7, unit: "lb", category: "produce" },
  { name: "carrot", costPerUnit: 0.8, unit: "lb", category: "produce" },
  { name: "cucumber", costPerUnit: 0.9, unit: "each", category: "produce" },
  { name: "edamame", costPerUnit: 2.4, unit: "lb", category: "produce" },
  { name: "seaweed salad", costPerUnit: 4.5, unit: "lb", category: "produce" },
  { name: "mushroom", costPerUnit: 3.2, unit: "lb", category: "produce" },
  { name: "garlic", costPerUnit: 3.0, unit: "lb", category: "produce" },
  { name: "ginger", costPerUnit: 2.8, unit: "lb", category: "produce" },
  { name: "green onion", costPerUnit: 0.4, unit: "each", category: "produce" },
  { name: "basil", costPerUnit: 0.05, unit: "g", category: "produce" },
  { name: "potato", costPerUnit: 0.7, unit: "lb", category: "produce" },
  { name: "sweet potato", costPerUnit: 1.1, unit: "lb", category: "produce" },
  { name: "banana", costPerUnit: 0.3, unit: "each", category: "produce" },
  { name: "strawberry", costPerUnit: 3.0, unit: "lb", category: "produce" },
  { name: "mango", costPerUnit: 1.2, unit: "each", category: "produce" },
  { name: "mixed berries (frozen)", costPerUnit: 3.8, unit: "lb", category: "produce" },

  // ------------------------------------------------------------------- Dairy
  { name: "shredded cheese (blend)", costPerUnit: 3.6, unit: "lb", category: "dairy" },
  { name: "cheddar cheese", costPerUnit: 3.8, unit: "lb", category: "dairy" },
  { name: "mozzarella cheese", costPerUnit: 3.5, unit: "lb", category: "dairy" },
  { name: "fresh mozzarella", costPerUnit: 5.5, unit: "lb", category: "dairy" },
  { name: "parmesan cheese", costPerUnit: 7.5, unit: "lb", category: "dairy" },
  { name: "feta cheese", costPerUnit: 5.0, unit: "lb", category: "dairy" },
  { name: "cotija cheese", costPerUnit: 4.5, unit: "lb", category: "dairy" },
  { name: "american cheese", costPerUnit: 3.2, unit: "lb", category: "dairy" },
  { name: "sour cream", costPerUnit: 2.4, unit: "lb", category: "dairy" },
  { name: "butter", costPerUnit: 3.8, unit: "lb", category: "dairy" },
  { name: "milk", costPerUnit: 0.004, unit: "ml", category: "dairy" }, // ~$3.80/gal
  { name: "oat milk", costPerUnit: 0.006, unit: "ml", category: "dairy" },
  { name: "heavy cream", costPerUnit: 0.009, unit: "ml", category: "dairy" },
  { name: "yogurt", costPerUnit: 2.6, unit: "lb", category: "dairy" },
  { name: "cream cheese", costPerUnit: 3.0, unit: "lb", category: "dairy" },

  // --------------------------------------------------------------- Dry goods
  { name: "rice", costPerUnit: 0.8, unit: "lb", category: "dry goods" },
  { name: "sushi rice", costPerUnit: 1.1, unit: "lb", category: "dry goods" },
  { name: "black beans", costPerUnit: 1.2, unit: "lb", category: "dry goods" },
  { name: "pinto beans", costPerUnit: 1.1, unit: "lb", category: "dry goods" },
  { name: "flour tortilla 12in", costPerUnit: 0.25, unit: "each", category: "dry goods" },
  { name: "flour tortilla 8in", costPerUnit: 0.15, unit: "each", category: "dry goods" },
  { name: "corn tortilla", costPerUnit: 0.08, unit: "each", category: "dry goods" },
  { name: "pasta (dry)", costPerUnit: 1.0, unit: "lb", category: "dry goods" },
  { name: "ramen noodles (fresh)", costPerUnit: 1.4, unit: "lb", category: "dry goods" },
  { name: "rice noodles", costPerUnit: 1.6, unit: "lb", category: "dry goods" },
  { name: "pizza dough", costPerUnit: 0.85, unit: "each", category: "dry goods" }, // per ~12in ball
  { name: "burger bun", costPerUnit: 0.4, unit: "each", category: "bakery" },
  { name: "brioche bun", costPerUnit: 0.55, unit: "each", category: "bakery" },
  { name: "sandwich bread (slice)", costPerUnit: 0.18, unit: "each", category: "bakery" },
  { name: "baguette", costPerUnit: 1.2, unit: "each", category: "bakery" },
  { name: "pita bread", costPerUnit: 0.45, unit: "each", category: "bakery" },
  { name: "tortilla chips", costPerUnit: 2.0, unit: "lb", category: "dry goods" },
  { name: "croutons", costPerUnit: 3.0, unit: "lb", category: "dry goods" },
  { name: "flour", costPerUnit: 0.5, unit: "lb", category: "dry goods" },
  { name: "sugar", costPerUnit: 0.6, unit: "lb", category: "dry goods" },
  { name: "oats", costPerUnit: 1.0, unit: "lb", category: "dry goods" },
  { name: "granola", costPerUnit: 3.5, unit: "lb", category: "dry goods" },

  // ------------------------------------------------------ Sauces & condiments
  { name: "tomato sauce", costPerUnit: 0.003, unit: "ml", category: "sauce" }, // ~$11/gal
  { name: "marinara sauce", costPerUnit: 0.004, unit: "ml", category: "sauce" },
  { name: "salsa", costPerUnit: 0.004, unit: "ml", category: "sauce" },
  { name: "guacamole", costPerUnit: 0.008, unit: "ml", category: "sauce" },
  { name: "mayo", costPerUnit: 0.004, unit: "ml", category: "sauce" },
  { name: "ranch dressing", costPerUnit: 0.005, unit: "ml", category: "sauce" },
  { name: "caesar dressing", costPerUnit: 0.005, unit: "ml", category: "sauce" },
  { name: "soy sauce", costPerUnit: 0.003, unit: "ml", category: "sauce" },
  { name: "spicy mayo", costPerUnit: 0.006, unit: "ml", category: "sauce" },
  { name: "ponzu sauce", costPerUnit: 0.007, unit: "ml", category: "sauce" },
  { name: "hummus", costPerUnit: 3.0, unit: "lb", category: "sauce" },
  { name: "tahini", costPerUnit: 5.0, unit: "lb", category: "sauce" },
  { name: "pesto", costPerUnit: 0.012, unit: "ml", category: "sauce" },
  { name: "olive oil", costPerUnit: 0.008, unit: "ml", category: "sauce" },
  { name: "ketchup", costPerUnit: 0.002, unit: "ml", category: "sauce" },

  // ----------------------------------------------------------------- Beverage
  { name: "espresso beans", costPerUnit: 9.0, unit: "lb", category: "beverage" },
  { name: "drip coffee (ground)", costPerUnit: 7.0, unit: "lb", category: "beverage" },
  { name: "matcha powder", costPerUnit: 0.6, unit: "g", category: "beverage" },
  { name: "black tea", costPerUnit: 0.04, unit: "g", category: "beverage" },
  { name: "tapioca pearls", costPerUnit: 1.6, unit: "lb", category: "beverage" },
  { name: "boba syrup", costPerUnit: 0.004, unit: "ml", category: "beverage" },
  { name: "fruit juice", costPerUnit: 0.005, unit: "ml", category: "beverage" },
  { name: "protein powder (scoop)", costPerUnit: 0.9, unit: "each", category: "beverage" },
  { name: "honey", costPerUnit: 0.01, unit: "ml", category: "beverage" },

  // -------------------------------------------------------- Bakery / pastry
  { name: "croissant (raw)", costPerUnit: 0.85, unit: "each", category: "bakery" },
  { name: "muffin batter portion", costPerUnit: 0.55, unit: "each", category: "bakery" },
  { name: "cookie dough portion", costPerUnit: 0.35, unit: "each", category: "bakery" },
  { name: "bagel", costPerUnit: 0.45, unit: "each", category: "bakery" },
];

/** Case-insensitive name lookup into the estimated-cost database. */
export const ESTIMATED_BY_NAME: Map<string, EstimatedIngredient> = new Map(
  ESTIMATED_INGREDIENTS.map((i) => [i.name.toLowerCase(), i])
);
