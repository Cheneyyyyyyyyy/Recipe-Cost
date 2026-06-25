import { describe, expect, it } from "vitest";
import { estimateDishCost, pickTemplate } from "./estimator";
import { DISH_TEMPLATES, DISH_CATEGORIES } from "./data/dishTemplates";
import { ESTIMATED_BY_NAME, ESTIMATED_INGREDIENTS } from "./data/estimatedCosts";

describe("estimated cost database", () => {
  it("has 80+ ingredients with positive prices", () => {
    expect(ESTIMATED_INGREDIENTS.length).toBeGreaterThanOrEqual(80);
    for (const ing of ESTIMATED_INGREDIENTS) {
      expect(ing.costPerUnit).toBeGreaterThan(0);
      expect(ing.name.trim()).not.toBe("");
    }
  });

  it("has unique ingredient names", () => {
    const names = ESTIMATED_INGREDIENTS.map((i) => i.name.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("dish templates", () => {
  it("only reference ingredients that exist in the cost database", () => {
    for (const template of DISH_TEMPLATES) {
      for (const item of template.items) {
        expect(
          ESTIMATED_BY_NAME.has(item.ingredient.toLowerCase()),
          `template ingredient "${item.ingredient}" missing from cost DB`
        ).toBe(true);
      }
    }
  });

  it("provide a default (match-less) template for every category", () => {
    for (const { value } of DISH_CATEGORIES) {
      const hasDefault = DISH_TEMPLATES.some((t) => t.category === value && !t.match);
      expect(hasDefault, `no default template for "${value}"`).toBe(true);
    }
  });
});

describe("pickTemplate", () => {
  it("prefers a specific name match over the category default", () => {
    const t = pickTemplate("Margherita Pizza", "pizza-whole");
    expect(t?.match).toContain("margherita");
  });

  it("falls back to the category default when no keyword matches", () => {
    const t = pickTemplate("Mystery House Special", "burger");
    expect(t).not.toBeNull();
    expect(t?.match).toBeUndefined();
  });

  it("picks the longest matching keyword when several match", () => {
    // "bacon cheeseburger" matches the bacon template (more specific).
    const t = pickTemplate("Bacon Cheeseburger", "burger");
    expect(t?.match).toContain("bacon");
  });
});

describe("estimateDishCost", () => {
  it("returns a plausible, positive cost for a known dish", () => {
    const est = estimateDishCost("Chicken Burrito", "burrito/wrap");
    expect(est.matched).toBe(true);
    expect(est.cost).toBeGreaterThan(1.5);
    expect(est.cost).toBeLessThan(8);
  });

  it("sums line costs to the total", () => {
    const est = estimateDishCost("Cheeseburger", "burger");
    const lineSum = est.lines.reduce((s, l) => s + l.cost, 0);
    expect(est.cost).toBeCloseTo(lineSum, 6);
  });

  it("is deterministic", () => {
    const a = estimateDishCost("Ahi Poke Bowl", "poke/grain bowl");
    const b = estimateDishCost("Ahi Poke Bowl", "poke/grain bowl");
    expect(a.cost).toBe(b.cost);
  });

  it("ahi poke costs more than a cheese pizza slice", () => {
    const poke = estimateDishCost("Ahi Poke Bowl", "poke/grain bowl");
    const slice = estimateDishCost("Cheese Slice", "pizza-slice");
    expect(poke.cost).toBeGreaterThan(slice.cost);
  });
});
