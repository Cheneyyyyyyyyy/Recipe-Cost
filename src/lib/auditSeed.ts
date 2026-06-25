import { analyzeMenu, type MenuItemInput } from "./audit";
import type { MenuAnalysis, Restaurant } from "./types";

/**
 * Seeded demo restaurants with complete audits so the app feels real on first
 * load. Three Berkeley spots across different corridors and cost structures:
 *  - a Telegraph taqueria with a couple of underwater burritos,
 *  - a Southside bowls shop where poke runs thin-margin,
 *  - a Downtown pizzeria sitting below corridor pricing (lots of headroom).
 * createdAt values are fixed ISO strings so the seed is deterministic.
 */

interface SeedRestaurant {
  restaurant: Restaurant;
  menu: MenuItemInput[];
}

const SEED: SeedRestaurant[] = [
  {
    restaurant: {
      id: "rest-cholitas",
      name: "Cholita's Taqueria",
      neighborhood: "Telegraph Ave",
      type: "fast-casual",
      contactName: "Maria Delgado",
      contactEmail: "maria@cholitas.example",
      contactPhone: "(510) 555-0142",
      notes:
        "Met owner during a slow Tuesday. Interested in the audit. Burritos priced low for the corridor — clear pitch angle.",
      status: "audited",
      estimatedDailyCovers: 180,
      createdAt: "2026-06-12T18:00:00.000Z",
    },
    menu: [
      { name: "Carne Asada Burrito", category: "burrito/wrap", currentPrice: 11.0 },
      { name: "Chicken Burrito", category: "burrito/wrap", currentPrice: 9.5 },
      { name: "Veggie Burrito", category: "burrito/wrap", currentPrice: 8.5 },
      { name: "Chicken Rice Plate", category: "rice plate", currentPrice: 10.0 },
      { name: "Chips & House Salsa Salad", category: "salad", currentPrice: 6.0 },
    ],
  },
  {
    restaurant: {
      id: "rest-bears",
      name: "Bear's Bowls",
      neighborhood: "Southside",
      type: "fast-casual",
      contactName: "Danny Kim",
      contactEmail: "danny@bearsbowls.example",
      contactPhone: null,
      notes:
        "Walk-in pitch scheduled. Poke is their hero but it's a thin-margin category — lead with the acai/smoothie wins.",
      status: "prospect",
      estimatedDailyCovers: 150,
      createdAt: "2026-06-15T17:30:00.000Z",
    },
    menu: [
      { name: "Ahi Poke Bowl", category: "poke/grain bowl", currentPrice: 15.0 },
      { name: "Salmon Poke Bowl", category: "poke/grain bowl", currentPrice: 13.5 },
      { name: "Acai Bowl", category: "smoothie/juice", currentPrice: 11.0 },
      { name: "Berry Protein Smoothie", category: "smoothie/juice", currentPrice: 8.5 },
    ],
  },
  {
    restaurant: {
      id: "rest-slice",
      name: "Slice House Berkeley",
      neighborhood: "Downtown",
      type: "dine-in",
      contactName: "Tony Russo",
      contactEmail: "tony@slicehouse.example",
      contactPhone: "(510) 555-0199",
      notes:
        "Active client — first setup done free in exchange for a case study. Whole pies priced below corridor; big headroom.",
      status: "active",
      estimatedDailyCovers: 220,
      createdAt: "2026-06-08T19:00:00.000Z",
    },
    menu: [
      { name: "Cheese Slice", category: "pizza-slice", currentPrice: 4.0 },
      { name: "Pepperoni Pizza", category: "pizza-whole", currentPrice: 22.0 },
      { name: "Margherita Pizza", category: "pizza-whole", currentPrice: 21.0 },
      { name: "Caesar Salad", category: "salad", currentPrice: 11.0 },
      { name: "House Garden Salad", category: "salad", currentPrice: 9.0 },
    ],
  },
];

/** Fixed analysis timestamps (one per restaurant), kept deterministic. */
const ANALYSIS_DATES: Record<string, string> = {
  "rest-cholitas": "2026-06-12T18:05:00.000Z",
  "rest-bears": "2026-06-15T17:35:00.000Z",
  "rest-slice": "2026-06-08T19:10:00.000Z",
};

export function freshSeedRestaurants(): Restaurant[] {
  return SEED.map((s) => ({ ...s.restaurant }));
}

export function freshSeedAnalyses(): MenuAnalysis[] {
  return SEED.map((s) => {
    const result = analyzeMenu(s.restaurant.neighborhood, s.menu, {
      estimatedDailyCovers: s.restaurant.estimatedDailyCovers,
    });
    return {
      id: `analysis-${s.restaurant.id}`,
      restaurantId: s.restaurant.id,
      items: result.items,
      createdAt: ANALYSIS_DATES[s.restaurant.id],
    };
  });
}
