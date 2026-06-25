# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

The app is **built** (V1 + V2). `PROJECT_BRIEF.md` is the original V1 spec;
`PROJECT_BRIEF_V2.md` is the current spec (free menu audit, scenario modeling,
client pipeline, Berkeley market intelligence) and `COLD_PITCH_PLAYBOOK.md` is
the go-to-market context. `DECISIONS.md` logs the engineering choices per phase.

Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm test` (Vitest, 47
tests). Data is an in-memory React-context store persisted to `localStorage`
(`luma.v2`); no DB, no auth. PDF export is print CSS + `window.print()`.

Key code: the pure engine is `src/lib/costing.ts`/`units.ts`; the audit layer is
`src/lib/estimator.ts` + `audit.ts` + `scenario.ts` with seed data under
`src/lib/data/`. Product routes live under `src/app/demo/**`, marketing under
`src/app/(site)/**`. Read the relevant brief before changing the costing math.

## Intended tech stack (from the spec)

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Data: seeded local JSON / in-memory state for the MVP (no auth, no DB). Prisma + SQLite only as an optional stretch.
- Recharts for the dashboard margin chart
- Single deployable app — no backend beyond Next.js API routes. Deploy target is Vercel.

Once scaffolded, the standard commands will be `npm run dev`, `npm run build`, `npm run lint`, and whatever test runner is wired up (the spec requires unit tests for the costing engine — see below). Update this section with the exact commands after scaffolding.

## Costing engine — the correctness-critical core

This is the heart of the product and the one part the spec says to "get exactly right." It must be a standalone, unit-tested module (pure functions, no React). Normalize every quantity to a base unit per dimension before doing arithmetic:

- weight → **grams** (kg → g ×1000)
- volume → **milliliters** (l → ml ×1000)
- count → **each** (each → each ×1)

Formulas:

```
ingredientUnitCost = purchasePrice / toBaseUnit(purchaseQty, purchaseUnit)
recipeItemCost     = toBaseUnit(quantity, unit) * ingredientUnitCost   // only valid within same dimension
totalRecipeCost    = sum(recipeItemCost for each item)
costPerServing     = totalRecipeCost / yield
foodCostPercent    = salePrice ? (costPerServing / salePrice) * 100 : null
suggestedPrice(t)  = costPerServing / (t / 100)     // t = target food-cost %, e.g. 30
```

Rules that must be enforced, not assumed:
- **Reject cross-dimension mixing** with a clear validation error (e.g. an ingredient priced per `kg` but used as `each`). Weight/volume/count are not interconvertible.
- Handle edge cases explicitly: `yield` of 0, missing/null prices, and deleting an ingredient that is still referenced by a recipe.

The data model (`Ingredient`, `RecipeItem`, `Recipe`) is defined in `PROJECT_BRIEF.md` §4 — mirror those field names and unit enums exactly in the TypeScript types.

## Product surface (what to build)

Two distinct surfaces live in the same Next.js app:
1. **The Luma app** — ingredient library (CRUD with derived unit cost), recipe builder (live cost-per-serving breakdown as you type), margin inputs (sale price → food-cost % / margin, or target food-cost % → suggested price), and a dashboard (recipes sorted by margin, low-margin items flagged, one Recharts visual). Seed 10–15 ingredients and 4–5 recipes so the live demo looks real.
2. **The portfolio site** — landing page (`/`) and a Luma case-study page framing the project as a portfolio piece. The spec treats design polish as a portfolio signal.

## Scope discipline

`PROJECT_BRIEF.md` §3 lists explicit out-of-scope items for the MVP: user accounts/auth, supplier API integrations, inventory/ordering/POS, and a mobile app. Don't build these unless the in-scope work and §10 "Definition of done" are fully met; §11 lists the sanctioned stretch goals (price history, what-if repricing, CSV import/export, menu-engineering quadrant).
