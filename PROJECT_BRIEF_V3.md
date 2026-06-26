# Luma V3 — Project Brief

> Delivery profitability engine for independent restaurants.
> Show restaurant owners which menu items lose money on DoorDash and UberEats — per item, per order, with a dollar amount they can act on today.

---

## 1. The pivot

V1 was a portfolio demo. V2 added a menu audit with estimated costs. Both hit the same wall: without a restaurant's real ingredient costs, the estimates aren't credible enough to pitch with.

V3 flips the model. Instead of trying to estimate what we can't know (their ingredient costs), we focus on what we *can* know and what matters more: **the delivery platform commission is eating their margins, and they've never done the math at the item level.**

Every independent restaurant in Berkeley is on DoorDash, UberEats, or both. They pay 15–30% commission per order. But none of them know which items actually make money on delivery vs. which ones lose money after commission + packaging. That's what Luma shows them — instantly, per item, with a dollar sign.

The pitch: "You lose $1.40 every time someone orders your brisket noodle soup on DoorDash. You sold ~200 last month. That's $280 in pure loss. Want me to show you which items to fix?"

## 2. Why this wins

1. **Data is 100% public.** Every restaurant's DoorDash/UberEats menu and prices are online. Commission structures are standardized and published. No private data needed.
2. **The "aha" is immediate.** Not "your food cost might be 35%" (vague). It's "you lose $X per order on this dish" (specific, visceral, dollar-denominated).
3. **Ingredient estimates matter less.** The commission (15–30%) is the dominant variable, not a $0.50 difference in ingredient estimates. Even rough estimates produce a credible story.
4. **Actionable in 5 minutes.** Remove this item from delivery. Raise the delivery price by $2. Simplify this dish for delivery. These are things they can do today.
5. **Nobody does this for small restaurants.** Big chains have analytics teams. Independent restaurants are flying blind on delivery profitability.
6. **The cold pitch is frictionless.** Pull up their DoorDash listing on your phone, run it through Luma at the counter, show them results. No appointment needed.

## 3. Target user & go-to-market

### Primary user
Owner/operator at an independent restaurant, ghost kitchen, or food truck in Berkeley that's on DoorDash, UberEats, or Grubhub.

### Go-to-market
1. Pick 10 Berkeley restaurants you eat at that are on DoorDash.
2. Pull their delivery menu + prices from DoorDash (publicly listed).
3. Run each through Luma to generate a delivery profitability report.
4. Walk in during a slow period: "I built a tool that shows which of your DoorDash items actually make money. I ran yours — can I show you? Takes 2 minutes."
5. Leave the one-pager. Follow up in 3 days.
6. For interested restaurants: offer to set up the full system with their real costs. First 3 free for case studies; $199 setup + $79/mo after.

## 4. Product scope

### 4A. Delivery Profitability Analyzer (the core — build this first)

**Input flow:**
1. Enter restaurant name
2. Select delivery platform: DoorDash (default 30%), UberEats (default 30%), Grubhub (default 25%), or custom rate
3. Add menu items: dish name, category, delivery price, estimated orders/week (optional)
4. Optionally toggle between "estimated costs" (auto) and "actual costs" (manual entry)

**Analysis engine:**
For each menu item, calculate:
```
commissionCost     = deliveryPrice × commissionRate
packagingCost      = getPackagingCost(category)  // $0.30–$1.50 depending on item type
estimatedFoodCost  = estimateIngredientCost(dishName, category)  // from cost database
totalCostDelivery  = estimatedFoodCost + commissionCost + packagingCost
profitPerOrder     = deliveryPrice - totalCostDelivery
weeklyProfit       = profitPerOrder × estimatedOrdersPerWeek  // if provided
monthlyProfit      = weeklyProfit × 4.33

// Compare to dine-in
totalCostDineIn    = estimatedFoodCost  // no commission, no packaging
profitDineInPerOrder = deliveryPrice - totalCostDineIn  // assume same price unless specified
marginLostToDelivery = profitDineInPerOrder - profitPerOrder
```

**Output — the dashboard:**
- Per-item table: dish, delivery price, est. food cost, commission, packaging, **profit per delivery order**, flag (profitable / marginal / losing money)
- Summary cards: total items analyzed, items losing money, items marginal (<$2 profit), estimated monthly loss from unprofitable items
- Side-by-side comparison: what each dish earns dine-in vs. delivery
- Visual: bar chart showing profit per order by item, red bars for money-losers

**Flags and thresholds:**
- 🔴 **Losing money**: profit per delivery order < $0
- 🟡 **Marginal**: profit per delivery order $0–$2 (not worth the kitchen time)
- 🟢 **Profitable**: profit per delivery order > $2
- ⚡ **Delivery trap**: item is profitable dine-in but loses money on delivery (the most actionable insight)

### 4B. Recommendations engine

Auto-generate ranked recommendations based on the analysis:

**Recommendation types:**
1. **Remove from delivery menu** — item loses money on every order. "Your [dish] loses $[X] per delivery order. Removing it from DoorDash saves you ~$[Y]/month."
2. **Raise delivery price** — item is marginal but fixable with a price increase. "Raising [dish] from $[X] to $[Y] on DoorDash turns it from a $0.50 loss to a $1.80 profit per order. DoorDash allows different pricing from your dine-in menu."
3. **Simplify for delivery** — item has high prep cost that could be reduced for a delivery version. "Consider a simplified delivery version of [dish] — smaller portion or fewer premium toppings."
4. **Promote on delivery** — item has high delivery margin. "Your [dish] makes $[X] per delivery order — promote it as a 'delivery special' to shift volume toward your best margin items."
5. **Consider switching platforms** — if commission rate is the problem, show the math at a lower rate. "At UberEats' 15% tier, your [dish] goes from a $1.40 loss to a $0.80 profit."

Each recommendation includes the specific dollar impact so the owner can prioritize.

### 4C. One-page delivery audit report (PDF export — the sales tool)

```
┌──────────────────────────────────────────────────────────┐
│  LUMA                              Delivery Profit Audit │
│                                    [Date]                │
│  [Restaurant Name]                                       │
│  Platform: DoorDash (30% commission)                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  THE BOTTOM LINE                                         │
│  "We analyzed [N] delivery menu items. [X] are losing    │
│   money on every order after DoorDash's commission.      │
│   Estimated monthly loss: $[Y]."                         │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  YOUR DELIVERY MENU — ITEM BY ITEM                       │
│  ┌────────────┬───────┬──────┬──────┬────────┬─────────┐ │
│  │ Dish       │ Price │ Comm │ Cost │ Profit │ Flag    │ │
│  ├────────────┼───────┼──────┼──────┼────────┼─────────┤ │
│  │ Beef Noodl │$15.99 │$4.80 │$5.50 │ -$1.31 │ 🔴 Loss│ │
│  │ Chicken Sa │$13.99 │$4.20 │$3.20 │ +$3.59 │ 🟢 Good│ │
│  │ ...        │       │      │      │        │         │ │
│  └────────────┴───────┴──────┴──────┴────────┴─────────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  TOP 3 ACTIONS                                           │
│  1. Remove [dish] from DoorDash — saves ~$[X]/month      │
│  2. Raise [dish] delivery price $[X] — adds ~$[Y]/month  │
│  3. Promote [dish] on delivery — it's your best margin   │
│     item at $[X] profit per order                        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  DID YOU KNOW?                                           │
│  DoorDash lets you set different prices for delivery     │
│  vs. dine-in. Most Berkeley restaurants charge 10–20%    │
│  more on delivery to offset the commission. You're       │
│  currently using the same prices for both.               │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  Prepared by Ethan Chen · ethan@luma.tools               │
│  Powered by Luma — delivery profitability for            │
│  independent restaurants                                 │
└──────────────────────────────────────────────────────────┘
```

### 4D. Platform comparison view

Side-by-side showing the same menu at different commission rates:
- DoorDash Basic (15%), DoorDash Plus (25%), DoorDash Premium (30%)
- UberEats tiers
- Grubhub tiers
- Custom rate

Shows which items flip from profitable to unprofitable at each tier, helping owners choose the right plan or negotiate.

### 4E. "What if" delivery optimizer

- "What if you raise all delivery prices 15%?" → show new margins
- "What if DoorDash raises commission to 35%?" → show which items go underwater
- "What if you remove the 3 worst items?" → show monthly savings
- "What if you create a delivery-only simplified menu?" → model a smaller, higher-margin delivery menu

### 4F. Dine-in vs. delivery comparison (the eye-opener)

A visual showing each dish's profit when ordered dine-in vs. on delivery. The gap between the two bars is the "delivery tax" — the money the platform takes. This visual alone is often enough to start the conversation.

### 4G. Berkeley competitive context (carry forward from V2)

Keep the corridor pricing data and add delivery-specific context:
- Average delivery markup in Berkeley (most restaurants charge 10–20% more on delivery)
- Which Berkeley restaurants use different dine-in vs. delivery pricing
- Average delivery order size by cuisine type

### 4H. Client management (carry forward from V2)

Same pipeline: prospect → audited → pitched → active → with notes and audit history per restaurant.

### 4I. Landing page and pitch site

- Hero: "Your DoorDash menu is losing you money. Find out which items."
- Free delivery audit CTA
- How it works (3 steps: enter your delivery menu → see per-item profitability → get recommendations)
- Pricing: free audit → $199 setup → $79/month
- Case studies (placeholder, fill after first 3 restaurants)

## 5. Data model

```
// Carry forward: Ingredient, RecipeItem, Recipe from V1

DeliveryPlatform
  id              string
  name            string              // "DoorDash"
  defaultRate     number              // 0.30 (30%)
  tiers           PlatformTier[]

PlatformTier
  name            string              // "Basic", "Plus", "Premium"
  commissionRate  number              // 0.15, 0.25, 0.30
  description     string

PackagingCost
  category        string              // "noodle/ramen", "burger", "salad", etc.
  containerCost   number              // $0.30 - $1.50
  bagCost         number              // $0.10 - $0.25
  utensilCost     number              // $0.05 - $0.15
  totalCost       number              // sum of above

Restaurant                            // from V2, enhanced
  id              string
  name            string
  neighborhood    string
  type            string
  deliveryPlatforms  string[]         // ["doordash", "ubereats"]
  deliveryPricing    "same"|"markup"  // whether they charge more on delivery
  contactName     string | null
  contactEmail    string | null
  contactPhone    string | null
  notes           string | null
  status          "prospect"|"audited"|"pitched"|"active"|"churned"
  createdAt       Date

DeliveryAudit
  id              string
  restaurantId    string
  platform        string              // "doordash"
  commissionRate  number              // 0.30
  items           DeliveryAuditItem[]
  summary         AuditSummary
  recommendations Recommendation[]
  createdAt       Date

DeliveryAuditItem
  name            string
  category        string
  deliveryPrice   number
  dineInPrice     number | null       // if different
  estimatedFoodCost  number           // from cost DB or manual
  commissionCost  number              // deliveryPrice × commissionRate
  packagingCost   number              // from packaging cost table
  profitPerOrder  number              // deliveryPrice - all costs
  weeklyOrders    number | null       // estimated, optional
  monthlyImpact   number | null       // profitPerOrder × weeklyOrders × 4.33
  flag            "losing"|"marginal"|"profitable"|"delivery-trap"
  isManualCost    boolean             // false = estimated, true = owner provided

AuditSummary
  totalItems      number
  losingMoney     number
  marginal        number
  profitable      number
  estimatedMonthlyLoss  number        // sum of negative monthlyImpact items
  avgDeliveryMargin     number

Recommendation
  type            "remove"|"raise-price"|"simplify"|"promote"|"switch-platform"
  dishName        string
  currentProfit   number
  suggestedAction string
  estimatedImpact number              // monthly $ impact
  priority        number              // 1 = highest impact
```

## 6. Delivery cost engine (core logic)

```
// Commission — straightforward
commissionCost(price, rate) = price × rate

// Packaging — by category
packagingCosts = {
  "noodle/ramen":    { container: 1.00, bag: 0.15, utensils: 0.10, total: 1.25 },
  "burger":          { container: 0.60, bag: 0.15, utensils: 0.05, total: 0.80 },
  "sandwich":        { container: 0.50, bag: 0.15, utensils: 0.05, total: 0.70 },
  "salad":           { container: 0.70, bag: 0.15, utensils: 0.10, total: 0.95 },
  "pizza-whole":     { container: 0.80, bag: 0.00, utensils: 0.00, total: 0.80 },
  "pizza-slice":     { container: 0.40, bag: 0.15, utensils: 0.05, total: 0.60 },
  "rice-plate":      { container: 0.70, bag: 0.15, utensils: 0.10, total: 0.95 },
  "burrito/wrap":    { container: 0.40, bag: 0.15, utensils: 0.05, total: 0.60 },
  "poke/grain-bowl": { container: 0.80, bag: 0.15, utensils: 0.10, total: 1.05 },
  "boba/drink":      { container: 0.50, bag: 0.10, utensils: 0.15, total: 0.75 },
  "coffee":          { container: 0.40, bag: 0.10, utensils: 0.00, total: 0.50 },
  "pastry":          { container: 0.30, bag: 0.15, utensils: 0.05, total: 0.50 },
  "default":         { container: 0.60, bag: 0.15, utensils: 0.10, total: 0.85 },
}

// Food cost — component-based estimation (improved from V2)
// Each category has a template of components with wholesale costs
// Example for noodle/ramen:
//   protein portion (8oz avg): $2.00–$4.50 depending on protein type
//   noodles: $0.40
//   broth base: $0.80 (including energy cost for long-cook)
//   vegetables/garnish: $0.50
//   Total: $3.70–$6.20
//
// The estimator uses the midpoint and adjusts based on:
//   - dish name keywords (beef/lamb/seafood = higher protein cost)
//   - price point (higher-priced items likely use more/better ingredients)

// Per-order delivery profit
profitPerOrder(item, commissionRate) {
  commission = item.deliveryPrice × commissionRate
  packaging = packagingCosts[item.category].total
  foodCost = estimateFoodCost(item.name, item.category, item.deliveryPrice)
  return item.deliveryPrice - commission - packaging - foodCost
}

// Dine-in comparison
profitDineIn(item) {
  price = item.dineInPrice || item.deliveryPrice
  foodCost = estimateFoodCost(item.name, item.category, price)
  return price - foodCost
}

// Delivery tax (the gap)
deliveryTax(item, commissionRate) {
  return profitDineIn(item) - profitPerOrder(item, commissionRate)
}

// Flagging
flag(profitPerOrder) {
  if (profitPerOrder < 0) return "losing"
  if (profitPerOrder < 2) return "marginal"
  return "profitable"
}

// Delivery trap: profitable dine-in, losing on delivery
isDeliveryTrap(item, commissionRate) {
  return profitDineIn(item) > 2 && profitPerOrder(item, commissionRate) < 0
}
```

## 7. Improved food cost estimator (component-based)

The V2 estimator used a flat per-category cost. V3 breaks it into components and adjusts based on dish name keywords and price point.

```
// Component templates by category
categoryTemplates = {
  "noodle/ramen": {
    components: [
      { name: "protein", baseAmount: "8oz", baseCost: 2.50, keywords: {
        "beef": 3.50, "brisket": 4.00, "lamb": 4.50, "pork": 2.50,
        "chicken": 2.00, "shrimp": 3.80, "seafood": 4.50, "tofu": 1.00, "veg": 0.00
      }},
      { name: "noodles", baseCost: 0.40 },
      { name: "broth", baseCost: 0.80, keywords: { "bone": 1.20, "24-hour": 1.50, "8-hour": 1.00 }},
      { name: "vegetables", baseCost: 0.50 },
      { name: "garnish", baseCost: 0.30 },
    ],
    // price-point adjustment: if menu price > $18, likely premium ingredients
    premiumThreshold: 18,
    premiumMultiplier: 1.25,
  },
  "burrito/wrap": {
    components: [
      { name: "tortilla", baseCost: 0.25 },
      { name: "protein", baseAmount: "6oz", baseCost: 2.00, keywords: {
        "steak": 3.50, "carne-asada": 3.50, "carnitas": 2.50, "chicken": 2.00,
        "shrimp": 3.50, "fish": 3.00, "veggie": 0.80, "bean": 0.50
      }},
      { name: "rice", baseCost: 0.30 },
      { name: "beans", baseCost: 0.25 },
      { name: "toppings", baseCost: 0.60 },  // cheese, sour cream, salsa, guac
    ],
    premiumThreshold: 15,
    premiumMultiplier: 1.20,
  },
  "burger": {
    components: [
      { name: "bun", baseCost: 0.35 },
      { name: "patty", baseCost: 2.00, keywords: {
        "wagyu": 5.00, "double": 3.50, "turkey": 1.80, "impossible": 3.00, "beyond": 3.00, "veggie": 1.50
      }},
      { name: "cheese", baseCost: 0.30 },
      { name: "toppings", baseCost: 0.50 },
      { name: "fries/side", baseCost: 0.60 },  // if combo
    ],
    premiumThreshold: 16,
    premiumMultiplier: 1.25,
  },
  "poke/grain-bowl": {
    components: [
      { name: "protein", baseAmount: "6oz", baseCost: 3.00, keywords: {
        "tuna": 4.50, "salmon": 4.00, "shrimp": 3.50, "tofu": 1.00, "chicken": 2.00
      }},
      { name: "base", baseCost: 0.40 },  // rice or greens
      { name: "toppings", baseCost: 1.00 },
      { name: "sauce", baseCost: 0.20 },
    ],
    premiumThreshold: 17,
    premiumMultiplier: 1.20,
  },
  "pizza-whole": {
    components: [
      { name: "dough", baseCost: 0.80 },
      { name: "sauce", baseCost: 0.40 },
      { name: "cheese", baseCost: 1.80 },
      { name: "toppings", baseCost: 1.00, keywords: {
        "pepperoni": 1.20, "sausage": 1.50, "veggie": 0.80, "margherita": 0.60, "meat": 2.00
      }},
    ],
    premiumThreshold: 25,
    premiumMultiplier: 1.30,
  },
  "salad": {
    components: [
      { name: "greens", baseCost: 1.00 },
      { name: "protein", baseCost: 2.00, keywords: {
        "chicken": 2.00, "steak": 3.50, "shrimp": 3.50, "salmon": 4.00, "no protein": 0.00
      }},
      { name: "toppings", baseCost: 0.80 },
      { name: "dressing", baseCost: 0.20 },
    ],
    premiumThreshold: 16,
    premiumMultiplier: 1.20,
  },
  "rice-plate": {
    components: [
      { name: "rice", baseCost: 0.30 },
      { name: "protein", baseCost: 2.50, keywords: {
        "beef": 3.50, "chicken": 2.00, "pork": 2.50, "tofu": 1.00, "shrimp": 3.50
      }},
      { name: "vegetables", baseCost: 0.60 },
      { name: "sauce", baseCost: 0.20 },
    ],
    premiumThreshold: 16,
    premiumMultiplier: 1.20,
  },
  "coffee": {
    components: [
      { name: "espresso/coffee", baseCost: 0.40 },
      { name: "milk", baseCost: 0.30, keywords: { "oat": 0.60, "almond": 0.50, "soy": 0.40 }},
      { name: "cup/lid", baseCost: 0.25 },
    ],
    premiumThreshold: 7,
    premiumMultiplier: 1.15,
  },
  "boba/drink": {
    components: [
      { name: "tea/base", baseCost: 0.30 },
      { name: "milk", baseCost: 0.30 },
      { name: "boba/toppings", baseCost: 0.40 },
      { name: "cup/lid/straw", baseCost: 0.35 },
      { name: "sugar/flavor", baseCost: 0.15 },
    ],
    premiumThreshold: 8,
    premiumMultiplier: 1.15,
  },
}

// Estimator function
estimateFoodCost(dishName, category, menuPrice) {
  template = categoryTemplates[category] || defaultTemplate
  totalCost = 0

  for each component in template.components:
    cost = component.baseCost
    // Check dish name for keyword matches
    for each keyword, adjustedCost in component.keywords:
      if dishName.toLowerCase().includes(keyword):
        cost = adjustedCost
        break
    totalCost += cost

  // Premium adjustment for high-priced items
  if menuPrice > template.premiumThreshold:
    totalCost *= template.premiumMultiplier

  return totalCost
}
```

## 8. Platform commission data (seed this)

```
platforms = [
  {
    id: "doordash",
    name: "DoorDash",
    tiers: [
      { name: "Basic", rate: 0.15, description: "Lower commission, no DashPass benefits, limited visibility" },
      { name: "Plus", rate: 0.25, description: "DashPass eligible, standard visibility, larger delivery radius" },
      { name: "Premium", rate: 0.30, description: "Full DashPass benefits, highest visibility, priority placement" },
    ],
    defaultTier: "Premium",
    notes: "Most small restaurants are on Premium (30%). DoorDash allows different pricing from dine-in."
  },
  {
    id: "ubereats",
    name: "UberEats",
    tiers: [
      { name: "Lite", rate: 0.15, description: "Pickup only, no delivery" },
      { name: "Plus", rate: 0.25, description: "Delivery available, standard visibility" },
      { name: "Premium", rate: 0.30, description: "Full visibility, Uber One benefits, marketing tools" },
    ],
    defaultTier: "Premium",
    notes: "Similar tier structure to DoorDash. Also allows delivery-specific pricing."
  },
  {
    id: "grubhub",
    name: "Grubhub",
    tiers: [
      { name: "Basic", rate: 0.15, description: "Listed on platform, basic visibility" },
      { name: "Standard", rate: 0.25, description: "Promoted listings, loyalty program access" },
      { name: "Premium", rate: 0.30, description: "Top placement, full marketing suite" },
    ],
    defaultTier: "Standard",
    notes: "Less dominant in Berkeley than DoorDash/UberEats but still present."
  },
]
```

## 9. Task breakdown (ordered)

### Phase 1: Delivery profit engine (the core — build first)
1. Build the component-based food cost estimator per section 7, with unit tests.
2. Build the delivery cost engine per section 6 (commission + packaging + food cost → profit per order), with unit tests.
3. Build the recommendation engine — auto-generate ranked recommendations per section 4B.
4. Build the Delivery Audit UI: enter restaurant → select platform/tier → add menu items → see instant per-item profitability with flags.
5. Add the dine-in vs. delivery comparison view (side-by-side bar chart).
6. Build PDF export of the one-page delivery audit report per section 4C.
7. Seed platform commission data per section 8.
8. Seed packaging costs per section 6.

### Phase 2: Optimizer & scenarios
9. Build the platform comparison view — same menu at different commission tiers.
10. Build the "what-if" delivery optimizer per section 4E.
11. Add the "DoorDash lets you price differently" education callout.

### Phase 3: Client pipeline & market context
12. Carry forward client management from V2 with delivery-specific fields.
13. Add Berkeley corridor context — average delivery markups, competitor delivery pricing.
14. Add seasonality overlay from V2.

### Phase 4: Site & pitch
15. Update landing page: "Your DoorDash menu is losing you money" hero.
16. Free delivery audit CTA with simple form.
17. How it works section (3 steps).
18. Pricing page.
19. Case study placeholders.

### Phase 5: Verify & demo
20. Seed 3 realistic demo restaurants with full delivery audits showing a mix of profitable, marginal, and money-losing items.
21. Ensure all flows work end to end.
22. Run build, lint, tests — fix everything until green.
23. Update README and DECISIONS.md.

## 10. Definition of done

- `npm run build` passes with no errors
- All tests pass (unit tests on food cost estimator, delivery engine, recommendation engine)
- The Delivery Audit flow works end to end: enter restaurant → add items → see profitability → export PDF
- The PDF one-pager looks professional and non-technical
- 3 seeded demo restaurants with realistic delivery audits
- The "delivery trap" flag (profitable dine-in, losing on delivery) works and is visually prominent
- Platform comparison view shows the same menu at different commission tiers
- Site is responsive and deploys to Vercel
- README explains the product, the pitch, and how to run locally

## 11. Stretch goals (only if everything above is done)

- DoorDash menu scraper: paste a DoorDash restaurant URL → auto-import their delivery menu and prices
- AI-powered dish cost estimation using Claude API (send dish name + description → get ingredient breakdown)
- Historical audit tracking: show how a restaurant's delivery margins have changed over time
- Delivery-only menu builder: suggest an optimized delivery-specific menu with only profitable items
- Integration with Square/Toast POS to pull actual order volume data
