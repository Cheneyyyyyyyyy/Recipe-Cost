# Luma — Recipe costing & menu margins

Know what every plate costs, and what to charge for it. Luma turns ingredient
prices into live cost-per-serving, food-cost %, and suggested menu prices for
restaurants and ghost kitchens.

> **Portfolio project.** Luma is a self-contained portfolio piece: a polished,
> single-deployable Next.js app with a marketing site, an interactive case
> study, and a fully working product surface backed by a unit-tested costing
> engine. No backend, no sign-up — open it and start costing.

## What it is

Luma answers two everyday questions for a kitchen: *what does this dish cost to
make?* and *am I charging enough?* You build an ingredient library, compose
recipes from it, and Luma keeps the margin math correct and live as you type.

### Key features

- **Ingredient library** — CRUD for ingredients with a derived per-base-unit
  cost (e.g. `$0.008 / ml`) computed from purchase price and pack size.
- **Recipe builder** — add line items and watch cost-per-serving, food-cost %,
  and margin recalculate live, with per-line breakdowns and inline validation.
- **Margin & suggested pricing** — enter a sale price to see food-cost % and
  margin, or set a target food-cost % to get a suggested price.
- **Dashboard** — every recipe sorted by margin, low-margin dishes flagged, and
  a Recharts visual of food cost vs. sale price.

## App structure

A single deployable app serves both the marketing surface and the product:

| Route                 | What it is                                             |
| --------------------- | ----------------------------------------------------- |
| `/`                   | Portfolio landing page                                 |
| `/case-study`         | Luma case study (the project framed as portfolio work) |
| `/app`                | Luma dashboard (recipes by margin, low-margin flags)   |
| `/app/ingredients`    | Ingredient library                                     |
| `/app/recipes`        | Recipe list                                            |
| `/app/recipes/[id]`   | Recipe builder                                         |

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** for styling
- **Recharts** for the dashboard visual
- **Vitest** for unit tests

Data is **in-memory** (a React context store) persisted to **localStorage** —
there is no database and no auth, in line with the MVP scope. The store seeds
the same demo data on the server and on first client render, so rendering is
SSR-safe; saved state is loaded from localStorage afterward.

## Getting started

**Prerequisites:** Node 18+.

```bash
# install dependencies
npm install

# start the dev server (http://localhost:3000)
npm run dev

# production build + run
npm run build
npm start

# lint
npm run lint

# unit tests (Vitest)
npm test
```

## How the costing works

All money math is normalized to one **base unit per dimension** before any
arithmetic, so quantities are always comparable:

- **weight → grams** (`kg → g`, ×1000)
- **volume → milliliters** (`l → ml`, ×1000)
- **count → each** (`each → each`, ×1)

### Formulas

```text
ingredientUnitCost = purchasePrice / toBaseUnit(purchaseQty, purchaseUnit)
recipeItemCost     = toBaseUnit(quantity, unit) * ingredientUnitCost   // same dimension only
totalRecipeCost    = sum(recipeItemCost for each item)
costPerServing     = totalRecipeCost / yield
foodCostPercent    = salePrice ? (costPerServing / salePrice) * 100 : null
suggestedPrice(t)  = costPerServing / (t / 100)     // t = target food-cost %, e.g. 30
```

### Rules & edge cases

- **Cross-dimension mixing is rejected.** Pricing an ingredient per `kg` but
  using it as `each` raises a `DimensionMismatchError`; weight, volume, and
  count are not interconvertible. The error is surfaced inline in the builder.
- **Yield of 0** → cost-per-serving (and everything derived from it) degrades to
  `null`, shown as `—`.
- **Missing sale price** → food-cost % and margin are `null` / `—`.
- **Deleted ingredient still referenced by a recipe** → the line is flagged
  ("Ingredient was deleted.") instead of crashing.

The UI consumes the non-throwing `costRecipe` aggregate, which returns these
edge cases as data (`null` values + error strings) rather than throwing, so live
inputs never blow up.

## Project structure

```text
src/
├── app/                      # Next.js App Router
│   ├── (site)/               # marketing surface: landing + case study
│   ├── app/                  # the Luma product (dashboard, ingredients, recipes)
│   ├── globals.css           # Tailwind layers + base styles
│   └── layout.tsx            # root layout
├── components/
│   ├── ui/                   # design-system primitives (Button, Card, Field, …)
│   ├── app/                  # product chrome (AppNav, PageHeader)
│   ├── site/                 # marketing chrome (SiteNav, SiteFooter)
│   └── Logo.tsx
└── lib/
    ├── costing.ts            # the costing engine — pure formula functions
    ├── units.ts              # unit ↔ base-unit normalization + dimensions
    ├── costing.test.ts       # 20 Vitest unit tests for the engine
    ├── store.tsx             # React-context store + localStorage persistence
    ├── seed.ts               # demo data (19 ingredients, 5 recipes)
    ├── types.ts              # Ingredient / Recipe / RecipeItem + unit enums
    ├── margin.ts             # margin status + tone helpers
    ├── format.ts             # currency / percent / unit-cost formatting
    └── constants.ts          # tunable thresholds + defaults
```

The **costing engine** (`src/lib/costing.ts` + `src/lib/units.ts`) is pure — no
React, no I/O — and is unit-tested in isolation by `src/lib/costing.test.ts`
(**20 tests**). The UI never duplicates this math; it always goes through the
engine.

## Deploy to Vercel

1. Push the repo to GitHub: <https://github.com/Cheneyyyyyyyyy/Recipe-Cost>
2. In Vercel, **import the GitHub repo**.
3. The framework is **auto-detected as Next.js** — keep the defaults.
4. **No environment variables** are needed (no DB, no auth).
5. **Deploy.**

## Quality gates

- Run the tests with `npm test` (Vitest).
- The production build must pass with `npm run build`.
