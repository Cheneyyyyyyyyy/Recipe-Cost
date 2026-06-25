import type { CompetitorPricing, DishCategory, Neighborhood } from "../types";

/**
 * Berkeley competitor pricing, organised by corridor × dish category. These are
 * research-quality estimates compiled from public Yelp / Google / DoorDash
 * menus (the kind of one-time research Ethan does once and reuses). Low / avg /
 * high are the observed price band for that category in that corridor.
 *
 * Corridor character (drives the spread):
 *  - Telegraph Ave   — student-heavy, price-sensitive (lower)
 *  - Southside       — student-heavy, high volume (lowest, near Telegraph)
 *  - Downtown        — mixed office + students, moderate
 *  - North Berkeley  — Gourmet Ghetto, higher-end, more headroom (highest)
 *  - Food Truck      — lower overhead, ~10–15% below brick-and-mortar
 */
export const COMPETITOR_PRICING: CompetitorPricing[] = [
  // ----------------------------------------------------------- Telegraph Ave
  { neighborhood: "Telegraph Ave", category: "burrito/wrap", priceLow: 10.5, priceAvg: 12.5, priceHigh: 15.0, sampleSize: 8 },
  { neighborhood: "Telegraph Ave", category: "poke/grain bowl", priceLow: 12.0, priceAvg: 14.5, priceHigh: 17.0, sampleSize: 5 },
  { neighborhood: "Telegraph Ave", category: "burger", priceLow: 9.0, priceAvg: 13.0, priceHigh: 16.5, sampleSize: 6 },
  { neighborhood: "Telegraph Ave", category: "sandwich", priceLow: 8.5, priceAvg: 11.0, priceHigh: 14.0, sampleSize: 6 },
  { neighborhood: "Telegraph Ave", category: "pizza-slice", priceLow: 3.5, priceAvg: 4.5, priceHigh: 6.0, sampleSize: 5 },
  { neighborhood: "Telegraph Ave", category: "pizza-whole", priceLow: 18.0, priceAvg: 22.0, priceHigh: 28.0, sampleSize: 4 },
  { neighborhood: "Telegraph Ave", category: "salad", priceLow: 9.0, priceAvg: 11.5, priceHigh: 14.5, sampleSize: 5 },
  { neighborhood: "Telegraph Ave", category: "noodle/ramen", priceLow: 13.0, priceAvg: 15.5, priceHigh: 18.0, sampleSize: 5 },
  { neighborhood: "Telegraph Ave", category: "rice plate", priceLow: 10.0, priceAvg: 12.5, priceHigh: 15.0, sampleSize: 5 },
  { neighborhood: "Telegraph Ave", category: "coffee", priceLow: 4.0, priceAvg: 5.5, priceHigh: 7.0, sampleSize: 6 },
  { neighborhood: "Telegraph Ave", category: "smoothie/juice", priceLow: 6.5, priceAvg: 8.0, priceHigh: 10.0, sampleSize: 5 },
  { neighborhood: "Telegraph Ave", category: "boba", priceLow: 5.5, priceAvg: 7.0, priceHigh: 8.5, sampleSize: 6 },
  { neighborhood: "Telegraph Ave", category: "pastry/bakery", priceLow: 3.0, priceAvg: 4.25, priceHigh: 6.0, sampleSize: 5 },

  // --------------------------------------------------------------- Downtown
  { neighborhood: "Downtown", category: "burrito/wrap", priceLow: 11.0, priceAvg: 13.5, priceHigh: 16.0, sampleSize: 6 },
  { neighborhood: "Downtown", category: "poke/grain bowl", priceLow: 13.0, priceAvg: 15.5, priceHigh: 18.5, sampleSize: 5 },
  { neighborhood: "Downtown", category: "burger", priceLow: 11.0, priceAvg: 14.5, priceHigh: 18.0, sampleSize: 6 },
  { neighborhood: "Downtown", category: "sandwich", priceLow: 9.5, priceAvg: 12.5, priceHigh: 15.5, sampleSize: 6 },
  { neighborhood: "Downtown", category: "pizza-slice", priceLow: 3.75, priceAvg: 5.0, priceHigh: 6.5, sampleSize: 4 },
  { neighborhood: "Downtown", category: "pizza-whole", priceLow: 19.0, priceAvg: 24.0, priceHigh: 30.0, sampleSize: 5 },
  { neighborhood: "Downtown", category: "salad", priceLow: 10.5, priceAvg: 13.0, priceHigh: 16.5, sampleSize: 5 },
  { neighborhood: "Downtown", category: "noodle/ramen", priceLow: 14.0, priceAvg: 16.5, priceHigh: 19.5, sampleSize: 5 },
  { neighborhood: "Downtown", category: "rice plate", priceLow: 11.0, priceAvg: 13.5, priceHigh: 16.5, sampleSize: 5 },
  { neighborhood: "Downtown", category: "coffee", priceLow: 4.25, priceAvg: 5.75, priceHigh: 7.5, sampleSize: 6 },
  { neighborhood: "Downtown", category: "smoothie/juice", priceLow: 7.0, priceAvg: 8.75, priceHigh: 11.0, sampleSize: 4 },
  { neighborhood: "Downtown", category: "boba", priceLow: 5.75, priceAvg: 7.25, priceHigh: 9.0, sampleSize: 5 },
  { neighborhood: "Downtown", category: "pastry/bakery", priceLow: 3.5, priceAvg: 4.75, priceHigh: 6.5, sampleSize: 5 },

  // ---------------------------------------------------------- North Berkeley
  { neighborhood: "North Berkeley", category: "burrito/wrap", priceLow: 12.0, priceAvg: 14.5, priceHigh: 17.5, sampleSize: 4 },
  { neighborhood: "North Berkeley", category: "poke/grain bowl", priceLow: 14.0, priceAvg: 16.5, priceHigh: 20.0, sampleSize: 4 },
  { neighborhood: "North Berkeley", category: "burger", priceLow: 13.0, priceAvg: 16.5, priceHigh: 21.0, sampleSize: 5 },
  { neighborhood: "North Berkeley", category: "sandwich", priceLow: 11.0, priceAvg: 14.0, priceHigh: 18.0, sampleSize: 5 },
  { neighborhood: "North Berkeley", category: "pizza-slice", priceLow: 4.0, priceAvg: 5.5, priceHigh: 7.0, sampleSize: 3 },
  { neighborhood: "North Berkeley", category: "pizza-whole", priceLow: 22.0, priceAvg: 27.0, priceHigh: 34.0, sampleSize: 5 },
  { neighborhood: "North Berkeley", category: "salad", priceLow: 12.0, priceAvg: 15.0, priceHigh: 19.0, sampleSize: 5 },
  { neighborhood: "North Berkeley", category: "noodle/ramen", priceLow: 15.0, priceAvg: 18.0, priceHigh: 22.0, sampleSize: 4 },
  { neighborhood: "North Berkeley", category: "rice plate", priceLow: 12.5, priceAvg: 15.5, priceHigh: 19.0, sampleSize: 4 },
  { neighborhood: "North Berkeley", category: "coffee", priceLow: 4.5, priceAvg: 6.0, priceHigh: 8.0, sampleSize: 5 },
  { neighborhood: "North Berkeley", category: "smoothie/juice", priceLow: 7.5, priceAvg: 9.5, priceHigh: 12.0, sampleSize: 4 },
  { neighborhood: "North Berkeley", category: "boba", priceLow: 6.0, priceAvg: 7.75, priceHigh: 9.5, sampleSize: 4 },
  { neighborhood: "North Berkeley", category: "pastry/bakery", priceLow: 4.0, priceAvg: 5.5, priceHigh: 7.5, sampleSize: 6 },

  // --------------------------------------------------------------- Southside
  { neighborhood: "Southside", category: "burrito/wrap", priceLow: 10.0, priceAvg: 12.0, priceHigh: 14.5, sampleSize: 7 },
  { neighborhood: "Southside", category: "poke/grain bowl", priceLow: 11.5, priceAvg: 14.0, priceHigh: 16.5, sampleSize: 5 },
  { neighborhood: "Southside", category: "burger", priceLow: 9.0, priceAvg: 12.5, priceHigh: 15.5, sampleSize: 5 },
  { neighborhood: "Southside", category: "sandwich", priceLow: 8.0, priceAvg: 10.5, priceHigh: 13.5, sampleSize: 6 },
  { neighborhood: "Southside", category: "pizza-slice", priceLow: 3.25, priceAvg: 4.25, priceHigh: 5.5, sampleSize: 5 },
  { neighborhood: "Southside", category: "pizza-whole", priceLow: 17.0, priceAvg: 21.0, priceHigh: 26.0, sampleSize: 4 },
  { neighborhood: "Southside", category: "salad", priceLow: 8.5, priceAvg: 11.0, priceHigh: 14.0, sampleSize: 4 },
  { neighborhood: "Southside", category: "noodle/ramen", priceLow: 12.5, priceAvg: 15.0, priceHigh: 17.5, sampleSize: 6 },
  { neighborhood: "Southside", category: "rice plate", priceLow: 9.5, priceAvg: 12.0, priceHigh: 14.5, sampleSize: 6 },
  { neighborhood: "Southside", category: "coffee", priceLow: 3.75, priceAvg: 5.25, priceHigh: 6.75, sampleSize: 5 },
  { neighborhood: "Southside", category: "smoothie/juice", priceLow: 6.0, priceAvg: 7.75, priceHigh: 9.5, sampleSize: 4 },
  { neighborhood: "Southside", category: "boba", priceLow: 5.25, priceAvg: 6.75, priceHigh: 8.25, sampleSize: 6 },
  { neighborhood: "Southside", category: "pastry/bakery", priceLow: 2.75, priceAvg: 4.0, priceHigh: 5.5, sampleSize: 4 },

  // ----------------------------------------------------- Food Truck / Pop-up
  { neighborhood: "Food Truck / Pop-up", category: "burrito/wrap", priceLow: 9.0, priceAvg: 11.0, priceHigh: 13.0, sampleSize: 5 },
  { neighborhood: "Food Truck / Pop-up", category: "poke/grain bowl", priceLow: 10.5, priceAvg: 12.5, priceHigh: 15.0, sampleSize: 3 },
  { neighborhood: "Food Truck / Pop-up", category: "burger", priceLow: 8.0, priceAvg: 11.0, priceHigh: 14.0, sampleSize: 4 },
  { neighborhood: "Food Truck / Pop-up", category: "sandwich", priceLow: 7.5, priceAvg: 9.5, priceHigh: 12.0, sampleSize: 5 },
  { neighborhood: "Food Truck / Pop-up", category: "noodle/ramen", priceLow: 11.0, priceAvg: 13.5, priceHigh: 16.0, sampleSize: 4 },
  { neighborhood: "Food Truck / Pop-up", category: "rice plate", priceLow: 9.0, priceAvg: 11.0, priceHigh: 13.5, sampleSize: 5 },
  { neighborhood: "Food Truck / Pop-up", category: "coffee", priceLow: 3.5, priceAvg: 4.75, priceHigh: 6.0, sampleSize: 4 },
  { neighborhood: "Food Truck / Pop-up", category: "smoothie/juice", priceLow: 5.5, priceAvg: 7.0, priceHigh: 8.5, sampleSize: 3 },
  { neighborhood: "Food Truck / Pop-up", category: "boba", priceLow: 5.0, priceAvg: 6.25, priceHigh: 7.5, sampleSize: 3 },
  { neighborhood: "Food Truck / Pop-up", category: "pastry/bakery", priceLow: 2.5, priceAvg: 3.75, priceHigh: 5.0, sampleSize: 3 },
];

/** All corridors, in the order shown in the market-intelligence browser. */
export const NEIGHBORHOODS: Neighborhood[] = [
  "Telegraph Ave",
  "Southside",
  "Downtown",
  "North Berkeley",
  "Food Truck / Pop-up",
];

/** Look up the competitor price band for a corridor × category, if sampled. */
export function competitorPrice(
  neighborhood: Neighborhood,
  category: DishCategory
): CompetitorPricing | null {
  return (
    COMPETITOR_PRICING.find(
      (c) => c.neighborhood === neighborhood && c.category === category
    ) ?? null
  );
}
