import { describe, expect, it } from "vitest";
import { scenarioImpact } from "./scenario";
import { analyzeMenu, type MenuItemInput } from "./audit";
import type { MenuAnalysisItem } from "./types";

const MENU: MenuItemInput[] = [
  { name: "Carne Asada Burrito", category: "burrito/wrap", currentPrice: 11.0 },
  { name: "Veggie Burrito", category: "burrito/wrap", currentPrice: 9.0 },
  { name: "Cheese Slice", category: "pizza-slice", currentPrice: 4.0 },
];

function analyzedItems(): MenuAnalysisItem[] {
  return analyzeMenu("Telegraph Ave", MENU).items;
}

describe("scenarioImpact", () => {
  it("ingredient-change raises cost only for dishes that use the ingredient", () => {
    const items = analyzedItems();
    const res = scenarioImpact(items, {
      kind: "ingredient-change",
      ingredientName: "carne asada",
      percentChange: 20,
    });
    const asada = res.perDish.find((d) => d.name === "Carne Asada Burrito")!;
    const slice = res.perDish.find((d) => d.name === "Cheese Slice")!;
    expect(asada.affected).toBe(true);
    expect(asada.newMargin).toBeLessThan(asada.originalMargin); // cost up → margin down
    expect(slice.affected).toBe(false);
    expect(slice.newMargin).toBeCloseTo(slice.originalMargin, 6);
    // Total impact is negative (a cost increase).
    expect(res.totalMonthlyImpact).toBeLessThan(0);
  });

  it("price-change lifts margin across the whole menu", () => {
    const items = analyzedItems();
    const res = scenarioImpact(items, { kind: "price-change", priceChangePercent: 5 });
    expect(res.totalMonthlyImpact).toBeGreaterThan(0);
    for (const d of res.perDish) {
      expect(d.newMargin).toBeGreaterThan(d.originalMargin);
    }
  });

  it("price-change of 0% is a no-op", () => {
    const items = analyzedItems();
    const res = scenarioImpact(items, { kind: "price-change", priceChangePercent: 0 });
    expect(res.totalMonthlyImpact).toBeCloseTo(0, 6);
  });

  it("menu-change zeroes a cut dish and lifts a promoted dish", () => {
    const items = analyzedItems();
    const res = scenarioImpact(
      items,
      {
        kind: "menu-change",
        cutItemNames: ["Veggie Burrito"],
        promoteItemNames: ["Carne Asada Burrito"],
      },
      { estimatedDailyCovers: 90 }
    );
    const cut = res.perDish.find((d) => d.name === "Veggie Burrito")!;
    const promoted = res.perDish.find((d) => d.name === "Carne Asada Burrito")!;
    expect(cut.newMonthly).toBe(0);
    expect(promoted.newMonthly).toBeGreaterThan(promoted.originalMonthly);
  });

  it("is deterministic", () => {
    const items = analyzedItems();
    const a = scenarioImpact(items, { kind: "price-change", priceChangePercent: 8 });
    const b = scenarioImpact(items, { kind: "price-change", priceChangePercent: 8 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
