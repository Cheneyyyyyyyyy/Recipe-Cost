# Luma — Menu profitability for independent restaurants

Luma reads a restaurant's menu and shows which dishes are likely losing money,
where there's room to raise prices, and how the prices compare to the rest of the
neighborhood — then hands over a clean one-page report. It's built for
independent restaurants, ghost kitchens, food trucks, and pop-ups in **Berkeley,
CA**.

> **Portfolio project + real tool.** Luma is a single deployable Next.js app: a
> marketing site, an interactive case study, and a fully working product — a free
> menu-audit flow, the full costing system, scenario modeling, a lightweight
> client pipeline, and Berkeley market intelligence — all backed by a pure,
> unit-tested costing engine. No backend, no sign-up.

## The pitch (how it's used)

1. Pick a Berkeley restaurant you eat at and grab its public menu.
2. Run the **free audit** in Luma — it estimates costs from a built-in Bay-Area
   ingredient database and flags the problems.
3. Walk in with the **printed one-page report**: "I found 3 dishes that are
   probably costing you money. Can I show you? It's free."
4. If they're interested, plug in their **real supplier costs** for exact
   margins — as a setup engagement or a monthly subscription.

See [`COLD_PITCH_PLAYBOOK.md`](./COLD_PITCH_PLAYBOOK.md) for the full walk-in and
email scripts, and [`PROJECT_BRIEF_V2.md`](./PROJECT_BRIEF_V2.md) for the
complete spec.

## What it does

- **Free menu audit** — enter a restaurant + its menu and get instant per-dish
  food-cost %, underwater/headroom flags, a Berkeley corridor price comparison,
  ranked recommendations, and a **print-ready PDF one-pager**.
- **Full costing system** — the V1 engine: ingredient library with derived unit
  cost, recipe builder with live cost-per-serving, a target-margin repricing
  slider, and a menu-engineering quadrant.
- **Scenario modeling** — what-if an ingredient's price spikes, you raise prices
  across the board, or you cut/promote dishes — with before/after margin charts.
- **Client pipeline** — a lightweight CRM tracking each restaurant from prospect
  → audited → pitched → active, with contact info and notes.
- **Market intelligence** — competitor pricing by Berkeley corridor × dish
  category, plus an academic-calendar seasonality overlay.

## App structure

A single deployable app serves both the marketing surface and the product:

| Route                            | What it is                                              |
| -------------------------------- | ------------------------------------------------------ |
| `/`                              | Landing page (free-audit CTA, how it works)            |
| `/pricing`                       | Pricing: free audit → setup → subscription             |
| `/about`                         | About Ethan + contact                                  |
| `/case-study`                    | Engineering case study + results placeholders          |
| `/demo`                          | Dashboard (recipes by margin, seasonality overlay)     |
| `/demo/audits`                   | Audit hub — all restaurants                             |
| `/demo/audits/new`               | New audit (restaurant + menu → live analysis)          |
| `/demo/audits/[id]`              | Audit workspace + client details                       |
| `/demo/audits/[id]/report`       | Print-ready one-page PDF report                        |
| `/demo/audits/[id]/scenarios`    | What-if scenario modeling                              |
| `/demo/clients`                  | Client pipeline board (by status)                      |
| `/demo/market`                   | Competitor pricing browser                             |
| `/demo/market/seasonality`       | Berkeley seasonality view                              |
| `/demo/ingredients`              | Ingredient library                                     |
| `/demo/recipes` · `/demo/recipes/[id]` | Recipe list & builder                            |

The app is **seeded with 3 complete demo restaurants** (a Telegraph taqueria, a
Southside bowls shop, a Downtown pizzeria) so it feels real on first load.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** for styling
- **Recharts** for dashboard and scenario charts
- **Vitest** for unit tests (**47 tests**)

Data is **in-memory** (a React context store) persisted to **localStorage**
(`luma.v2`) — no database, no auth. PDF export uses **print CSS + `window.print()`**
(no extra dependencies, vector-quality output).

## Getting started

**Prerequisites:** Node 18+.

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:3000
npm run build      # production build
npm start          # run the production build
npm run lint       # eslint
npm test           # unit tests (Vitest)
```

## How the costing works

All money math is normalized to one **base unit per dimension** before any
arithmetic:

- **weight → grams** (`kg → g`, ×1000)
- **volume → milliliters** (`l → ml`, ×1000)
- **count → each** (`each → each`, ×1)

```text
ingredientUnitCost = purchasePrice / toBaseUnit(purchaseQty, purchaseUnit)
recipeItemCost     = toBaseUnit(quantity, unit) * ingredientUnitCost   // same dimension only
totalRecipeCost    = sum(recipeItemCost for each item)
costPerServing     = totalRecipeCost / yield
foodCostPercent    = salePrice ? (costPerServing / salePrice) * 100 : null
suggestedPrice(t)  = costPerServing / (t / 100)     // t = target food-cost %, e.g. 30
```

The **audit** layers on top: a dish cost estimator (built-in Bay-Area ingredient
DB + standard recipe templates) feeds `analyzeMenu`, which flags each dish
(underwater > 35% food cost, headroom < 25%), compares to the corridor, and
ranks recommendations by estimated monthly margin impact.

### Rules & edge cases

- **Cross-dimension mixing is rejected** (`DimensionMismatchError`).
- **Yield of 0 / missing sale price** → derived figures degrade to `null` (`—`).
- **Deleted ingredient still referenced** → the line is flagged, never crashes.

The UI consumes the non-throwing `costRecipe` aggregate so live inputs never blow
up.

## Project structure

```text
src/
├── app/
│   ├── (site)/               # landing, pricing, about, case study
│   └── demo/                 # the product (dashboard, audits, clients, market, …)
├── components/
│   ├── ui/                   # design-system primitives
│   ├── app/                  # product chrome + feature components
│   │   ├── audit/  clients/  market/  dashboard/  …
│   └── site/                 # marketing chrome
└── lib/
    ├── costing.ts · units.ts        # the pure costing engine (V1)
    ├── estimator.ts                 # dish cost estimator
    ├── audit.ts                     # analyzeMenu — the audit engine
    ├── scenario.ts                  # what-if scenario calculator
    ├── data/                        # estimatedCosts, dishTemplates,
    │                                #   competitorPricing, seasonality
    ├── store.tsx                    # React-context store + localStorage
    ├── seed.ts · auditSeed.ts       # demo data
    └── *.test.ts                    # 47 Vitest unit tests
```

The costing/estimator/audit/scenario logic is pure (no React, no I/O) and
unit-tested in isolation. The UI never duplicates the math.

## Deploy to Vercel

1. Push to GitHub, then **import the repo** in Vercel.
2. Framework auto-detects as **Next.js** — keep the defaults.
3. **No environment variables** needed (no DB, no auth).
4. **Deploy.**

## Quality gates

`npm run build`, `npm run lint`, and `npm test` all pass clean.
