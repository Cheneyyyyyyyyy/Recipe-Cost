# Luma V2 — Project Brief

> Menu profitability engine for independent restaurants in Berkeley, CA.
> This document is the complete build spec + go-to-market plan.
> An autonomous coding agent should be able to implement the full product from this file alone.

---

## 1. Vision (what changed from V1)

V1 was a portfolio demo. V2 is a **real tool you walk into real restaurants with.**

The pitch: you show up at a Berkeley restaurant with a free one-page margin analysis of their public menu. You show them which dishes are likely losing money, where they have easy pricing wins, and what their competitors charge for similar items. Then you offer to set up the full system with their real costs — either as a consulting engagement or a monthly tool subscription.

The product is the same costing engine, but wrapped in a workflow designed for **cold outreach → free audit → ongoing relationship.**

## 2. Target users & go-to-market

### Primary user
Owner/operator or head chef at an independent restaurant, ghost kitchen, food truck, or pop-up in Berkeley, CA. Typically 1–3 locations, no dedicated finance person, pricing decisions made by gut feel.

### Go-to-market (how Ethan actually gets customers)
1. **Pick 10 restaurants you eat at** on Telegraph, Center St, Southside, downtown Berkeley, and North Berkeley.
2. **Scrape/photograph their menus** — most are on Yelp, Google, or their own site.
3. **Run the free audit tool** in Luma to generate a one-page margin analysis using estimated ingredient costs.
4. **Walk in with the report.** The pitch: "I'm a Berkeley student building a tool for restaurant pricing. I analyzed your menu and found 3 dishes that are probably costing you money. Can I show you? It's free."
5. **If they're interested,** offer to plug in their real supplier costs and set up the full system. Charge $200–500 for the initial setup, or $50–100/mo for ongoing access + quarterly reviews.
6. **Use the first 2–3 restaurants as case studies** for your portfolio site — real results, real businesses, real numbers (with permission).

### Why Berkeley specifically
- Dense cluster of independent restaurants within walking/biking distance.
- Many are run by owner-operators who make pricing decisions themselves.
- Campus traffic creates extreme seasonality (school year vs. summer vs. dead week vs. finals) that generic tools don't account for.
- You're a regular customer at many of these places — warm intros, not cold calls.
- Food trucks and pop-ups have different cost structures that bigger tools ignore.

## 3. Product scope — what to build

### 3A. Free Menu Audit (the door-opener)

This is the most important feature. It's what gets you in the door.

**Flow:**
1. Enter a restaurant's name and paste/type their menu items with prices.
2. Luma estimates ingredient costs per dish using a built-in cost database (realistic defaults for common ingredients in the Bay Area).
3. Generate a **one-page audit report** showing:
   - Estimated food-cost % for every dish
   - Dishes flagged as "likely underwater" (food-cost > 35%)
   - Dishes with easy pricing headroom (food-cost < 25% — they could charge more)
   - A simple comparison to average Berkeley pricing for similar dish types
   - 3 concrete recommendations (e.g. "Your chicken burrito is priced $2 below the Telegraph Ave average and likely runs a 40%+ food cost — raising it to $13.50 brings it in line with competitors and saves ~$800/month at your volume")
4. Export as a clean **PDF one-pager** branded with Luma's logo, ready to print or email.

**This is the cold-pitch deliverable.** It has to look professional, be easy to understand for someone who isn't technical, and deliver a clear "you're leaving money on the table" message.

### 3B. Full Costing System (the ongoing tool — what V1 already built)

Carry forward everything from V1, enhanced:
- Ingredient library with real supplier prices (not estimates)
- Recipe builder with per-plate cost, food-cost %, margin
- Interactive repricing slider (target food-cost % → suggested price)
- Menu engineering quadrant (popularity × margin)
- Dashboard with margin overview and alerts

### 3C. Berkeley Market Intelligence (the competitive edge)

**Competitor pricing database:**
- Pre-loaded average prices for common dish categories in Berkeley, organized by neighborhood/corridor:
  - Telegraph Ave (student-heavy, price-sensitive)
  - Center St / Downtown (mixed, moderate pricing)
  - North Berkeley / Gourmet Ghetto (higher-end, more pricing headroom)
  - Southside / Durant (student-heavy, high volume)
  - Food trucks / pop-ups (lower overhead, different math)
- Dish categories: burrito/wrap, poke/grain bowl, burger, sandwich, pizza (slice & whole), salad, noodle/ramen bowl, rice plate, coffee drink, smoothie/juice, boba, pastry/bakery item
- For each: low / average / high price point observed in that corridor
- Source: manually researched from Yelp, Google, DoorDash menus (Ethan does this research once; it becomes the dataset)

**Seasonality overlay:**
- Berkeley academic calendar mapped to demand patterns:
  - Fall semester (Aug–Dec): high traffic
  - Spring semester (Jan–May): high traffic
  - Summer (Jun–Aug): 30–50% drop for student-dependent locations
  - Dead week / finals: spike in late-night and quick-service
  - Move-in weekend: massive spike
  - Spring break: dip
- Recommendations tied to season: "Promote high-margin items during peak weeks" / "Consider a smaller summer menu to reduce waste"

### 3D. Scenario Modeling (the "what-if" engine)

- "If avocado goes up 20%, here's the margin impact across your whole menu"
- "If you raise prices 5% across the board, here's the revenue and margin impact"
- "If you cut these 3 low-performing dishes and promote these 2 stars, here's the projected monthly improvement"
- Simple inputs, visual outputs — bar charts showing before/after

### 3E. Client Management (lightweight CRM)

Since Ethan is pitching multiple restaurants:
- List of restaurants he's working with or prospecting
- Status tracking: prospect → audited → pitched → active client
- Store each restaurant's menu, ingredient data, and audit history
- Notes field for each (last conversation, next step, contact name)

### 3F. Pitch & Portfolio Site (the public face)

- Landing page: "Stop guessing your margins" (keep the V1 hero, it's strong)
- **"Free Menu Audit" CTA** — a form where a restaurant owner can enter their restaurant name and email to request an audit (or Ethan can fill it in himself before a pitch)
- Case study section: placeholder for real restaurant results (fill in after first 2–3 clients)
- About page: brief bio positioning Ethan as a Berkeley data science student who built this tool
- Pricing page: "Free audit → $199 setup → $79/mo" (or whatever pricing Ethan wants to test)

## 4. Data model (V2 additions)

```
// V1 models (Ingredient, RecipeItem, Recipe) remain unchanged

Restaurant
  id              string
  name            string              // "Abe's Pizza"
  neighborhood    string              // "Telegraph Ave"
  type            "dine-in"|"fast-casual"|"food-truck"|"pop-up"|"ghost-kitchen"
  contactName     string | null
  contactEmail    string | null
  contactPhone    string | null
  notes           string | null
  status          "prospect"|"audited"|"pitched"|"active"|"churned"
  createdAt       Date

MenuAnalysis
  id              string
  restaurantId    string
  menuItems       MenuAnalysisItem[]
  createdAt       Date

MenuAnalysisItem
  name            string              // "Chicken Burrito"
  category        string              // "burrito/wrap"
  currentPrice    number              // 11.50
  estimatedCost   number              // derived from cost database
  foodCostPercent number              // derived
  flag            "underwater"|"healthy"|"overpriced"|null
  competitorAvg   number | null       // avg price for this category in this neighborhood
  recommendation  string | null       // "Raise to $13.50 (+$2) to match corridor avg"

CompetitorPricing
  neighborhood    string
  category        string              // "burrito/wrap"
  priceLow        number
  priceAvg        number
  priceHigh       number
  sampleSize      number              // how many restaurants sampled
  lastUpdated     Date

SeasonalPattern
  period          string              // "fall-semester", "summer", "finals-week", etc.
  startMonth      number
  endMonth        number
  trafficMultiplier  number           // 1.0 = baseline, 0.6 = 40% drop, 1.3 = 30% spike
  recommendation  string              // "Promote high-margin items"

Scenario
  id              string
  restaurantId    string
  name            string              // "Avocado price spike +20%"
  type            "ingredient-change"|"price-change"|"menu-change"
  parameters      object              // flexible: { ingredientId, percentChange } or { priceChangePercent } etc.
  results         object              // computed: before/after margins per dish
```

## 5. Costing engine (V2 additions)

V1 engine is unchanged. Add:

### Estimated cost database
A built-in database of common restaurant ingredient costs for the Bay Area. These are realistic estimates, not exact — the point is to power the free audit with reasonable numbers before a restaurant shares their real costs.

```
// Example entries — agent should populate 80–100 common ingredients
{ name: "chicken breast", costPerUnit: 3.50, unit: "lb", category: "protein" }
{ name: "ground beef 80/20", costPerUnit: 4.50, unit: "lb", category: "protein" }
{ name: "avocado", costPerUnit: 1.25, unit: "each", category: "produce" }
{ name: "flour tortilla 12in", costPerUnit: 0.25, unit: "each", category: "dry goods" }
{ name: "rice", costPerUnit: 0.80, unit: "lb", category: "dry goods" }
{ name: "mixed greens", costPerUnit: 4.00, unit: "lb", category: "produce" }
// ... 80+ more
```

### Dish cost estimator
Given a dish name and category, estimate its likely ingredient cost using the database + standard recipe templates. E.g.:
- "Chicken Burrito" → tortilla + chicken + rice + beans + cheese + salsa + sour cream → estimated cost $3.80
- "Margherita Pizza (whole)" → dough + sauce + mozzarella + basil → estimated cost $3.20

This doesn't need to be perfect — it needs to be close enough to make the audit credible and the conversation starter useful.

### Scenario calculator
```
scenarioImpact(restaurant, scenario):
  for each recipe in restaurant:
    compute originalCost, originalMargin
    apply scenario parameters (ingredient price change, menu price change, etc.)
    compute newCost, newMargin
    compute delta
  return { perDish: [...], totalMonthlyImpact: estimatedMonthlySavings }
```

## 6. Key user flows (V2)

### Flow 1: Free Menu Audit (the pitch tool)
1. Click "New Audit" → enter restaurant name, neighborhood, type
2. Add menu items: dish name, category (dropdown), current price
3. Luma auto-estimates ingredient cost per dish from the cost database
4. See instant audit: food-cost % per dish, flags, competitor comparison, recommendations
5. Click "Export PDF" → get a branded one-page report to print or email

### Flow 2: Full Setup (after the pitch lands)
1. Convert a restaurant from "prospect" to "active"
2. Replace estimated costs with real supplier prices
3. Build out actual recipes with real ingredient quantities
4. See true margins, not estimates — this is the "aha" moment

### Flow 3: Scenario Modeling
1. Pick a restaurant → "What if..." button
2. Choose scenario type: ingredient price change / menu price change / menu optimization
3. Set parameters (e.g. "avocado +20%")
4. See before/after margin impact per dish + total monthly impact
5. Save scenario for reference

### Flow 4: Client Pipeline
1. Dashboard showing all restaurants by status
2. Click into any restaurant → see their audit history, current margins, notes
3. Update status as you move through the sales process

### Flow 5: Market Intelligence
1. Browse competitor pricing by neighborhood and dish category
2. See where a specific restaurant's prices sit vs. the corridor average
3. Seasonality view: current period, what to expect, what to do

## 7. Tech stack

Same as V1:
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Data:** localStorage for MVP (per the V1 decision), structured as typed JSON stores
- **Charts:** Recharts
- **PDF export:** @react-pdf/renderer or html2canvas + jsPDF for the audit one-pager
- **Deploy:** Vercel

## 8. Audit report design (critical — this is the sales tool)

The PDF one-pager must look professional and non-technical. Layout:

```
┌─────────────────────────────────────────────────────┐
│  LUMA logo                          Menu Audit Report│
│                                     [Date]           │
│  [Restaurant Name]                                   │
│  [Neighborhood] · [Type]                             │
├─────────────────────────────────────────────────────┤
│                                                       │
│  SUMMARY                                              │
│  "We analyzed [N] menu items. [X] are likely          │
│   running above a healthy 30% food-cost threshold,    │
│   representing an estimated $[Y] in monthly margin    │
│   left on the table."                                 │
│                                                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│  DISH-BY-DISH BREAKDOWN                               │
│  ┌──────────────┬───────┬──────────┬───────┬────────┐ │
│  │ Dish         │ Price │ Est Cost │ FC %  │ Flag   │ │
│  ├──────────────┼───────┼──────────┼───────┼────────┤ │
│  │ Chicken Burr │$11.50 │ $3.80    │ 33%   │ ⚠ High │ │
│  │ Caesar Salad │$14.00 │ $2.90    │ 21%   │ ✓ Good │ │
│  │ ...          │       │          │       │        │ │
│  └──────────────┴───────┴──────────┴───────┴────────┘ │
│                                                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│  TOP 3 RECOMMENDATIONS                                │
│  1. "Raise [Dish] from $X to $Y — brings it in line  │
│      with the [corridor] average and saves ~$Z/mo"    │
│  2. "Promote [Dish] — it's your highest-margin item   │
│      at [X]% food cost but likely under-ordered"      │
│  3. "Consider simplifying [Dish] — at [X]% food cost  │
│      it's your biggest margin leak"                   │
│                                                       │
├─────────────────────────────────────────────────────┤
│  COMPETITOR CONTEXT                                   │
│  "Average [category] in [corridor]: $X.XX.            │
│   Your price: $Y.YY ([above/below] average)"          │
│                                                       │
├─────────────────────────────────────────────────────┤
│  Prepared by Ethan Chen · ethan@luma.tools            │
│  Powered by Luma — menu profitability for             │
│  independent restaurants                              │
└─────────────────────────────────────────────────────┘
```

## 9. Competitor pricing seed data

The agent should populate this with realistic Berkeley data. Research-quality estimates:

```
// Telegraph Ave (student-heavy corridor)
{ neighborhood: "Telegraph Ave", category: "burrito/wrap", priceLow: 10.50, priceAvg: 12.50, priceHigh: 15.00, sampleSize: 8 }
{ neighborhood: "Telegraph Ave", category: "poke/grain bowl", priceLow: 12.00, priceAvg: 14.50, priceHigh: 17.00, sampleSize: 5 }
{ neighborhood: "Telegraph Ave", category: "burger", priceLow: 9.00, priceAvg: 13.00, priceHigh: 16.50, sampleSize: 6 }
{ neighborhood: "Telegraph Ave", category: "pizza-slice", priceLow: 3.50, priceAvg: 4.50, priceHigh: 6.00, sampleSize: 4 }
{ neighborhood: "Telegraph Ave", category: "pizza-whole", priceLow: 18.00, priceAvg: 22.00, priceHigh: 28.00, sampleSize: 4 }
{ neighborhood: "Telegraph Ave", category: "noodle/ramen", priceLow: 13.00, priceAvg: 15.50, priceHigh: 18.00, sampleSize: 5 }
{ neighborhood: "Telegraph Ave", category: "coffee", priceLow: 4.00, priceAvg: 5.50, priceHigh: 7.00, sampleSize: 6 }
{ neighborhood: "Telegraph Ave", category: "boba", priceLow: 5.50, priceAvg: 7.00, priceHigh: 8.50, sampleSize: 5 }

// Center St / Downtown
{ neighborhood: "Downtown", category: "burrito/wrap", priceLow: 11.00, priceAvg: 13.50, priceHigh: 16.00, sampleSize: 6 }
// ... agent should fill out 8–10 categories × 4–5 neighborhoods = ~40–50 entries

// North Berkeley / Gourmet Ghetto
// Southside / Durant
// Food trucks & pop-ups (typically 10–15% below brick-and-mortar)
```

## 10. Berkeley academic calendar seed data

```
[
  { period: "fall-semester", label: "Fall Semester", startMonth: 8, endMonth: 12, trafficMultiplier: 1.0, recommendation: "Peak season — full menu, promote high-margin items" },
  { period: "spring-semester", label: "Spring Semester", startMonth: 1, endMonth: 5, trafficMultiplier: 1.0, recommendation: "Peak season — full menu, promote high-margin items" },
  { period: "summer", label: "Summer Break", startMonth: 6, endMonth: 7, trafficMultiplier: 0.65, recommendation: "Consider a streamlined menu to reduce waste; focus on higher-margin items" },
  { period: "winter-break", label: "Winter Break", startMonth: 12, endMonth: 1, trafficMultiplier: 0.5, recommendation: "Lowest traffic period — minimize perishable inventory, consider reduced hours" },
  { period: "move-in", label: "Move-in Weekend", startMonth: 8, endMonth: 8, trafficMultiplier: 1.4, recommendation: "Massive traffic spike — staff up, pre-prep high-volume items" },
  { period: "finals", label: "Finals Week", startMonth: 5, endMonth: 5, trafficMultiplier: 1.15, recommendation: "Late-night traffic spike — extend hours if possible, promote quick-service items" },
  { period: "dead-week", label: "Dead Week", startMonth: 4, endMonth: 5, trafficMultiplier: 1.1, recommendation: "Moderate spike — students on campus studying, promote comfort food and caffeine" },
  { period: "spring-break", label: "Spring Break", startMonth: 3, endMonth: 3, trafficMultiplier: 0.7, recommendation: "Temporary dip — reduce prep quantities, good time for menu experiments" }
]
```

## 11. Task breakdown (ordered, for the agent)

### Phase 1: Audit system (the door-opener — build this first)
1. Build the restaurant data model and client management store (localStorage)
2. Create the estimated ingredient cost database (80–100 common items with Bay Area pricing)
3. Build the dish cost estimator — given a dish name + category, estimate ingredient cost from templates
4. Build the Menu Audit UI: enter restaurant → add menu items → see instant analysis
5. Implement the audit report with flags, recommendations, and competitor comparison
6. Build PDF export of the one-page audit report (must look professional and clean)
7. Seed the competitor pricing database with realistic Berkeley data (all neighborhoods × categories)

### Phase 2: Enhanced costing (the ongoing tool)
8. Integrate the V1 costing engine — allow upgrading from estimated to real costs
9. Build the scenario modeling engine and UI (ingredient change, price change, menu optimization)
10. Add Berkeley seasonality overlay to the dashboard

### Phase 3: Client pipeline
11. Build the client management dashboard (list, status tracking, notes)
12. Per-restaurant detail page: audit history, current margins, recommendations, notes

### Phase 4: Market intelligence
13. Competitor pricing browser: by neighborhood × category, with the restaurant's position highlighted
14. Seasonality view: current period, traffic forecast, recommendations

### Phase 5: Site & pitch materials
15. Update the landing page: add "Free Menu Audit" CTA and "How it works" section
16. Build a pricing page: Free audit → Setup fee → Monthly subscription
17. Update the case study page with placeholders for real restaurant results
18. Polish: responsive, accessible, fast, professional

### Phase 6: Verify & ship
19. Run full build, lint, tests — fix everything until green
20. Seed a complete demo: 2–3 fake Berkeley restaurants with full audits, so the demo feels real
21. Update README with setup instructions and the go-to-market plan

## 12. Definition of done

- `npm run build` succeeds with no errors
- All tests pass (unit tests on costing engine + estimator + scenario calculator)
- The Menu Audit flow works end to end: enter restaurant → add items → see analysis → export PDF
- The demo is seeded with 2–3 realistic Berkeley restaurants with complete audits
- The PDF one-pager looks clean and professional
- The site is responsive and deploys cleanly to Vercel
- README explains the product, the go-to-market, and how to run locally

## 13. Stretch goals (only if everything above is done)

- Email integration: "Send this audit to [restaurant email]" directly from the app
- DoorDash/Yelp menu scraper: paste a restaurant URL → auto-import menu items and prices
- Multi-user auth (Supabase or similar) so restaurant owners can log in and see their own data
- Ingredient price tracking over time (chart showing cost trends)
- AI-powered dish cost estimation: use Claude API to estimate ingredients from a dish name + description
