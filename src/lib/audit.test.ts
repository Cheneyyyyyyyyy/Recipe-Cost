import { describe, expect, it } from "vitest";
import { analyzeMenu, flagFor, type MenuItemInput } from "./audit";
import {
  AUDIT_HEADROOM_THRESHOLD,
  AUDIT_UNDERWATER_THRESHOLD,
} from "./constants";

describe("flagFor", () => {
  it("flags high food cost as underwater", () => {
    expect(flagFor(AUDIT_UNDERWATER_THRESHOLD + 1, 10, 12)).toBe("underwater");
  });

  it("flags a mid-range food cost as healthy", () => {
    expect(flagFor(30, 12, 13)).toBe("healthy");
  });

  it("flags low food cost priced well above corridor as overpriced", () => {
    // FC below headroom threshold AND price >10% above corridor avg.
    expect(flagFor(AUDIT_HEADROOM_THRESHOLD - 5, 20, 12)).toBe("overpriced");
  });

  it("treats low food cost at/below corridor as healthy (strong margin, not overpriced)", () => {
    expect(flagFor(AUDIT_HEADROOM_THRESHOLD - 5, 11, 12)).toBe("healthy");
  });
});

describe("analyzeMenu", () => {
  const items: MenuItemInput[] = [
    { name: "Chicken Burrito", category: "burrito/wrap", currentPrice: 9.0 },
    { name: "Ahi Poke Bowl", category: "poke/grain bowl", currentPrice: 16.0 },
    { name: "Cheeseburger", category: "burger", currentPrice: 13.0 },
  ];

  it("computes food cost % as estimatedCost / price * 100", () => {
    const { items: analyzed } = analyzeMenu("Telegraph Ave", items);
    for (const item of analyzed) {
      const expected = (item.estimatedCost / item.currentPrice) * 100;
      expect(item.foodCostPercent).toBeCloseTo(expected, 6);
    }
  });

  it("attaches the corridor competitor average for each category", () => {
    const { items: analyzed } = analyzeMenu("Telegraph Ave", items);
    const burrito = analyzed.find((i) => i.category === "burrito/wrap");
    expect(burrito?.competitorAvg).toBe(12.5); // Telegraph burrito avg from seed
  });

  it("is deterministic for the same inputs", () => {
    const a = analyzeMenu("Telegraph Ave", items);
    const b = analyzeMenu("Telegraph Ave", items);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("produces a headline and ranks recommendations by monthly impact", () => {
    const { summary, recommendations } = analyzeMenu("Telegraph Ave", items);
    expect(summary.itemCount).toBe(3);
    expect(summary.headline).toContain("3 menu items");
    // Recommendations with quantifiable impact come first, descending.
    const impacts = recommendations
      .map((r) => r.monthlyImpact)
      .filter((m): m is number => m != null);
    const sorted = [...impacts].sort((a, b) => b - a);
    expect(impacts).toEqual(sorted);
  });

  it("flags an underpriced dish underwater and recommends a raise", () => {
    // A burrito priced at $6 is below cost-healthy and below corridor.
    const cheap: MenuItemInput[] = [
      { name: "Carne Asada Burrito", category: "burrito/wrap", currentPrice: 6.0 },
    ];
    const { items: analyzed, recommendations } = analyzeMenu("Telegraph Ave", cheap);
    expect(analyzed[0].flag).toBe("underwater");
    expect(recommendations[0].kind).toBe("raise");
    expect(recommendations[0].monthlyImpact).toBeGreaterThan(0);
  });

  it("handles an empty menu without throwing", () => {
    const { summary } = analyzeMenu("Downtown", []);
    expect(summary.itemCount).toBe(0);
    expect(summary.avgFoodCostPercent).toBeNull();
  });
});
