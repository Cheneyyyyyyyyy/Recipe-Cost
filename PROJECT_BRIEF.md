# Luma — Project Brief

> Recipe costing & menu margin tool for restaurants and ghost kitchens.
> This document is the build spec. An autonomous coding agent should be able to implement the MVP from this file alone.

---

## 1. Vision

Restaurants and ghost kitchens rarely know the true cost of a single plate of food, because ingredient prices move constantly and the math is done (badly) in spreadsheets. **Luma** turns recipes plus ingredient prices into instant per-plate cost, food-cost %, and margin — and suggests a price for any target food-cost %.

The pitch to a buyer: *"Stop guessing your margins. Enter your recipes once, update prices in seconds, and see exactly what every dish costs and what to charge."*

## 2. Target user & problem

- **Primary user:** an owner/operator or chef at a small restaurant, ghost kitchen, or catering business.
- **Job to be done:** "Tell me what this dish actually costs me and what I should charge to hit my target margin."
- **Today's workaround:** messy spreadsheets that go stale the moment a supplier price changes.

## 3. MVP scope

**In scope (build this):**
- Ingredient library with purchase price and unit cost
- Recipe builder (ingredients + quantities + yield)
- Costing engine: total cost, cost per serving, food-cost %, suggested price
- Dashboard listing recipes with cost/margin, flagging low-margin items
- A polished personal/portfolio site that frames Luma as a case study

**Out of scope (do NOT build yet):**
- User accounts / auth (use local data for the MVP)
- Supplier API integrations
- Inventory tracking, ordering, POS integration
- Mobile app

## 4. Data model

```
Ingredient
  id            string
  name          string            // "Olive oil"
  category      string            // "Pantry", "Produce", "Protein", etc.
  purchasePrice number            // e.g. 24.00
  purchaseQty   number            // e.g. 3
  purchaseUnit  "g"|"kg"|"ml"|"l"|"each"
  // derived: unitCost = purchasePrice / (purchaseQty normalized to base unit)

RecipeItem
  ingredientId  string
  quantity      number            // amount used in the recipe
  unit          "g"|"kg"|"ml"|"l"|"each"

Recipe
  id            string
  name          string            // "Margherita Pizza"
  yield         number            // number of servings/plates this recipe makes
  salePrice     number | null     // current menu price, optional
  items         RecipeItem[]
```

## 5. Costing engine (core logic — get this exactly right)

Normalize everything to a base unit per dimension: **grams** for weight, **milliliters** for volume, **each** for count.

```
ingredientUnitCost   = purchasePrice / toBaseUnit(purchaseQty, purchaseUnit)
recipeItemCost       = toBaseUnit(quantity, unit) * ingredientUnitCost   // only valid within same dimension
totalRecipeCost      = sum(recipeItemCost for each item)
costPerServing       = totalRecipeCost / yield
foodCostPercent      = salePrice ? (costPerServing / salePrice) * 100 : null
suggestedPrice(t)    = costPerServing / (t / 100)     // t = target food-cost %, e.g. 30
```

Conversions: kg→g ×1000, l→ml ×1000, each→each ×1. Reject mixing dimensions (e.g. an ingredient bought "per kg" used as "each") with a clear validation error.

Edge cases to handle: yield of 0, missing prices, deleting an ingredient still used by a recipe.

## 6. Key user flows

1. **Add ingredient** → enter name, purchase price, purchase qty + unit → see derived unit cost.
2. **Build recipe** → name it, set yield, add ingredient line items with quantities → live cost breakdown updates as you type.
3. **See margin** → enter a sale price → see food-cost % and margin; or enter a target food-cost % → see suggested price.
4. **Dashboard** → table of all recipes sorted by margin, low-margin items flagged (e.g. food-cost % above a threshold).

## 7. Tech stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Data:** start with seeded local JSON / in-memory state; optionally SQLite via Prisma if time allows
- **Charts:** Recharts for the dashboard margin view
- **Deploy:** Vercel (free, one-click from the GitHub repo)

Keep it a single deployable app. No backend services beyond Next.js API routes.

## 8. Personal site requirements

The repo should also serve as the portfolio piece:
- A clean landing page (`/`) introducing you and linking to projects.
- A Luma case-study page: the problem, your approach, the costing math, a screenshot/GIF, and a "Try the demo" link to the live app.
- Simple, fast, responsive, tasteful. Treat the design as a portfolio signal.

## 9. Task breakdown (ordered, for the agent)

1. Scaffold Next.js + TypeScript + Tailwind; set up project structure and a clean base layout.
2. Implement the data model types and a unit-conversion + costing engine module, **with unit tests** for the math in section 5.
3. Build the Ingredient library UI (list, add, edit, delete) with derived unit cost shown.
4. Build the Recipe builder UI with live cost-per-serving and breakdown.
5. Add sale price / target food-cost inputs → show food-cost %, margin, and suggested price.
6. Build the dashboard: recipe table sorted by margin, low-margin flagging, one Recharts visual.
7. Seed realistic demo data (10–15 ingredients, 4–5 recipes) so the live demo looks real.
8. Build the personal landing page and the Luma case-study page.
9. Polish: responsive layout, empty states, input validation, README with setup + deploy steps.
10. Verify build passes and the app runs with no console errors.

## 10. Definition of done

- `npm run build` succeeds with no errors.
- All costing-engine unit tests pass.
- Every flow in section 6 works end to end with the seeded data.
- The site is responsive and deploys cleanly to Vercel.
- README explains how to run locally and how the costing math works.

## 11. Stretch goals (only if everything above is done)

- Ingredient price history (track changes over time).
- "What-if" repricing: slider for target margin across the whole menu.
- CSV import/export of ingredients and recipes.
- Menu engineering quadrant (popularity × margin) — a natural next chapter for the sales story.
