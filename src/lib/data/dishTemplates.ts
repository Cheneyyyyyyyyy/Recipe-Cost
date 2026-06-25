import type { DishTemplate } from "../types";

/**
 * Standard recipe templates per dish category, used by the estimator to turn a
 * dish name + category into an estimated plate cost. Each item's `quantity` is
 * expressed in the matching EstimatedIngredient's own unit (see
 * estimatedCosts.ts), so cost = quantity × costPerUnit.
 *
 * Templates with a `match` list are tried first (most specific wins); the
 * match-less template for a category is the fallback. These are deliberately
 * "typical plate" recipes — close enough to make the free audit credible, not
 * exact recipes.
 */
export const DISH_TEMPLATES: DishTemplate[] = [
  // ---------------------------------------------------------- burrito/wrap
  {
    category: "burrito/wrap",
    match: ["carne asada", "asada", "steak"],
    items: [
      { ingredient: "flour tortilla 12in", quantity: 1 },
      { ingredient: "carne asada", quantity: 0.4 },
      { ingredient: "rice", quantity: 0.22 },
      { ingredient: "pinto beans", quantity: 0.18 },
      { ingredient: "shredded cheese (blend)", quantity: 0.08 },
      { ingredient: "salsa", quantity: 40 },
      { ingredient: "guacamole", quantity: 35 },
      { ingredient: "sour cream", quantity: 0.06 },
    ],
  },
  {
    category: "burrito/wrap",
    match: ["veggie", "bean", "vegetarian"],
    items: [
      { ingredient: "flour tortilla 12in", quantity: 1 },
      { ingredient: "rice", quantity: 0.25 },
      { ingredient: "black beans", quantity: 0.25 },
      { ingredient: "shredded cheese (blend)", quantity: 0.1 },
      { ingredient: "salsa", quantity: 45 },
      { ingredient: "guacamole", quantity: 45 },
      { ingredient: "sour cream", quantity: 0.07 },
    ],
  },
  {
    category: "burrito/wrap",
    // default: chicken burrito
    items: [
      { ingredient: "flour tortilla 12in", quantity: 1 },
      { ingredient: "chicken thigh", quantity: 0.45 },
      { ingredient: "rice", quantity: 0.22 },
      { ingredient: "black beans", quantity: 0.18 },
      { ingredient: "shredded cheese (blend)", quantity: 0.08 },
      { ingredient: "salsa", quantity: 40 },
      { ingredient: "guacamole", quantity: 30 },
      { ingredient: "sour cream", quantity: 0.06 },
    ],
  },

  // -------------------------------------------------------- poke/grain bowl
  {
    category: "poke/grain bowl",
    match: ["salmon"],
    items: [
      { ingredient: "sushi rice", quantity: 0.4 },
      { ingredient: "salmon", quantity: 0.33 },
      { ingredient: "edamame", quantity: 0.1 },
      { ingredient: "cucumber", quantity: 0.3 },
      { ingredient: "seaweed salad", quantity: 0.08 },
      { ingredient: "spicy mayo", quantity: 20 },
      { ingredient: "green onion", quantity: 0.5 },
    ],
  },
  {
    category: "poke/grain bowl",
    // default: ahi tuna poke bowl
    items: [
      { ingredient: "sushi rice", quantity: 0.4 },
      { ingredient: "ahi tuna (sashimi)", quantity: 0.3 },
      { ingredient: "edamame", quantity: 0.1 },
      { ingredient: "cucumber", quantity: 0.3 },
      { ingredient: "seaweed salad", quantity: 0.08 },
      { ingredient: "ponzu sauce", quantity: 20 },
      { ingredient: "green onion", quantity: 0.5 },
    ],
  },

  // ----------------------------------------------------------------- burger
  {
    category: "burger",
    match: ["bacon"],
    items: [
      { ingredient: "brioche bun", quantity: 1 },
      { ingredient: "ground beef 80/20", quantity: 0.4 },
      { ingredient: "bacon", quantity: 0.1 },
      { ingredient: "cheddar cheese", quantity: 0.06 },
      { ingredient: "tomato", quantity: 0.08 },
      { ingredient: "yellow onion", quantity: 0.05 },
      { ingredient: "mayo", quantity: 15 },
    ],
  },
  {
    category: "burger",
    // default: cheeseburger
    items: [
      { ingredient: "burger bun", quantity: 1 },
      { ingredient: "ground beef 80/20", quantity: 0.38 },
      { ingredient: "american cheese", quantity: 0.05 },
      { ingredient: "tomato", quantity: 0.08 },
      { ingredient: "yellow onion", quantity: 0.05 },
      { ingredient: "ketchup", quantity: 15 },
      { ingredient: "mayo", quantity: 12 },
    ],
  },

  // --------------------------------------------------------------- sandwich
  {
    category: "sandwich",
    items: [
      { ingredient: "baguette", quantity: 0.6 },
      { ingredient: "deli turkey", quantity: 0.25 },
      { ingredient: "cheddar cheese", quantity: 0.05 },
      { ingredient: "tomato", quantity: 0.08 },
      { ingredient: "mixed greens", quantity: 0.04 },
      { ingredient: "mayo", quantity: 15 },
    ],
  },

  // ------------------------------------------------------------- pizza-slice
  {
    category: "pizza-slice",
    items: [
      { ingredient: "pizza dough", quantity: 0.18 },
      { ingredient: "tomato sauce", quantity: 25 },
      { ingredient: "mozzarella cheese", quantity: 0.1 },
    ],
  },

  // ------------------------------------------------------------- pizza-whole
  {
    category: "pizza-whole",
    match: ["margherita"],
    items: [
      { ingredient: "pizza dough", quantity: 1 },
      { ingredient: "tomato sauce", quantity: 120 },
      { ingredient: "fresh mozzarella", quantity: 0.4 },
      { ingredient: "basil", quantity: 5 },
      { ingredient: "olive oil", quantity: 15 },
    ],
  },
  {
    category: "pizza-whole",
    match: ["pepperoni"],
    items: [
      { ingredient: "pizza dough", quantity: 1 },
      { ingredient: "tomato sauce", quantity: 120 },
      { ingredient: "mozzarella cheese", quantity: 0.45 },
      { ingredient: "pepperoni", quantity: 0.2 },
    ],
  },
  {
    category: "pizza-whole",
    // default: cheese pizza
    items: [
      { ingredient: "pizza dough", quantity: 1 },
      { ingredient: "tomato sauce", quantity: 120 },
      { ingredient: "mozzarella cheese", quantity: 0.45 },
    ],
  },

  // ------------------------------------------------------------------ salad
  {
    category: "salad",
    match: ["caesar"],
    items: [
      { ingredient: "romaine lettuce", quantity: 1 },
      { ingredient: "caesar dressing", quantity: 45 },
      { ingredient: "croutons", quantity: 0.08 },
      { ingredient: "parmesan cheese", quantity: 0.04 },
    ],
  },
  {
    category: "salad",
    match: ["greek"],
    items: [
      { ingredient: "mixed greens", quantity: 0.25 },
      { ingredient: "feta cheese", quantity: 0.08 },
      { ingredient: "tomato", quantity: 0.15 },
      { ingredient: "cucumber", quantity: 0.5 },
      { ingredient: "red onion", quantity: 0.05 },
      { ingredient: "olive oil", quantity: 20 },
    ],
  },
  {
    category: "salad",
    match: ["cobb", "chicken"],
    items: [
      { ingredient: "mixed greens", quantity: 0.25 },
      { ingredient: "chicken breast", quantity: 0.25 },
      { ingredient: "bacon", quantity: 0.05 },
      { ingredient: "egg", quantity: 1 },
      { ingredient: "tomato", quantity: 0.1 },
      { ingredient: "ranch dressing", quantity: 40 },
    ],
  },
  {
    category: "salad",
    // default: house garden salad
    items: [
      { ingredient: "mixed greens", quantity: 0.3 },
      { ingredient: "tomato", quantity: 0.12 },
      { ingredient: "cucumber", quantity: 0.4 },
      { ingredient: "carrot", quantity: 0.08 },
      { ingredient: "ranch dressing", quantity: 40 },
    ],
  },

  // ------------------------------------------------------------ noodle/ramen
  {
    category: "noodle/ramen",
    match: ["pho"],
    items: [
      { ingredient: "rice noodles", quantity: 0.3 },
      { ingredient: "steak (flank)", quantity: 0.2 },
      { ingredient: "yellow onion", quantity: 0.08 },
      { ingredient: "cilantro", quantity: 0.3 },
      { ingredient: "green onion", quantity: 0.5 },
    ],
  },
  {
    category: "noodle/ramen",
    // default: pork ramen
    items: [
      { ingredient: "ramen noodles (fresh)", quantity: 0.35 },
      { ingredient: "pork belly", quantity: 0.18 },
      { ingredient: "egg", quantity: 1 },
      { ingredient: "green onion", quantity: 0.5 },
      { ingredient: "mushroom", quantity: 0.06 },
    ],
  },

  // ------------------------------------------------------------- rice plate
  {
    category: "rice plate",
    items: [
      { ingredient: "rice", quantity: 0.35 },
      { ingredient: "chicken thigh", quantity: 0.4 },
      { ingredient: "cabbage", quantity: 0.12 },
      { ingredient: "carrot", quantity: 0.06 },
      { ingredient: "soy sauce", quantity: 20 },
    ],
  },

  // ----------------------------------------------------------------- coffee
  {
    category: "coffee",
    match: ["matcha"],
    items: [
      { ingredient: "matcha powder", quantity: 3 },
      { ingredient: "oat milk", quantity: 300 },
      { ingredient: "honey", quantity: 15 },
    ],
  },
  {
    category: "coffee",
    match: ["drip", "americano", "brew"],
    items: [
      { ingredient: "drip coffee (ground)", quantity: 0.04 },
    ],
  },
  {
    category: "coffee",
    // default: latte / cappuccino
    items: [
      { ingredient: "espresso beans", quantity: 0.05 },
      { ingredient: "milk", quantity: 280 },
    ],
  },

  // --------------------------------------------------------- smoothie/juice
  {
    category: "smoothie/juice",
    match: ["acai", "açaí", "bowl"],
    items: [
      { ingredient: "mixed berries (frozen)", quantity: 0.35 },
      { ingredient: "banana", quantity: 1 },
      { ingredient: "granola", quantity: 0.12 },
      { ingredient: "strawberry", quantity: 0.12 },
      { ingredient: "honey", quantity: 15 },
    ],
  },
  {
    category: "smoothie/juice",
    // default: fruit smoothie
    items: [
      { ingredient: "mixed berries (frozen)", quantity: 0.3 },
      { ingredient: "banana", quantity: 1 },
      { ingredient: "fruit juice", quantity: 200 },
      { ingredient: "protein powder (scoop)", quantity: 1 },
    ],
  },

  // ------------------------------------------------------------------- boba
  {
    category: "boba",
    items: [
      { ingredient: "black tea", quantity: 8 },
      { ingredient: "milk", quantity: 200 },
      { ingredient: "tapioca pearls", quantity: 0.18 },
      { ingredient: "boba syrup", quantity: 30 },
    ],
  },

  // -------------------------------------------------------- pastry/bakery
  {
    category: "pastry/bakery",
    match: ["croissant"],
    items: [{ ingredient: "croissant (raw)", quantity: 1 }],
  },
  {
    category: "pastry/bakery",
    match: ["muffin"],
    items: [{ ingredient: "muffin batter portion", quantity: 1 }],
  },
  {
    category: "pastry/bakery",
    match: ["cookie"],
    items: [{ ingredient: "cookie dough portion", quantity: 1 }],
  },
  {
    category: "pastry/bakery",
    match: ["bagel"],
    items: [
      { ingredient: "bagel", quantity: 1 },
      { ingredient: "cream cheese", quantity: 0.06 },
    ],
  },
  {
    category: "pastry/bakery",
    // default: generic pastry
    items: [{ ingredient: "croissant (raw)", quantity: 1 }],
  },
];

/** Human-readable labels + ordering for the category dropdown. */
export const DISH_CATEGORIES: { value: import("../types").DishCategory; label: string }[] = [
  { value: "burrito/wrap", label: "Burrito / Wrap" },
  { value: "poke/grain bowl", label: "Poke / Grain Bowl" },
  { value: "burger", label: "Burger" },
  { value: "sandwich", label: "Sandwich" },
  { value: "pizza-slice", label: "Pizza (slice)" },
  { value: "pizza-whole", label: "Pizza (whole)" },
  { value: "salad", label: "Salad" },
  { value: "noodle/ramen", label: "Noodle / Ramen" },
  { value: "rice plate", label: "Rice Plate" },
  { value: "coffee", label: "Coffee Drink" },
  { value: "smoothie/juice", label: "Smoothie / Juice" },
  { value: "boba", label: "Boba" },
  { value: "pastry/bakery", label: "Pastry / Bakery" },
];
