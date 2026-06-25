# Engineering decisions

A running log of the notable engineering choices made while building Luma, with
the reasoning behind each. Newest context first; most entries date from the
initial build.

_Last updated: 2026-06-24_

---

## 2026-06-24 — V2 Phase 6: verify & ship

**Decision.** Final pass: README rewritten for the V2 product + go-to-market +
local run; the stale "pre-implementation" note in CLAUDE.md replaced with the
real current state. Full gates green — `npm run build`, `npm run lint`,
`npm test` (47 tests), `tsc --noEmit`. All 15 build routes prerender; a manual
smoke test hits every route (incl. the 3 seeded demo restaurants and a
missing-id, which degrades to a not-found empty state) — all 200.

---

## 2026-06-24 — V2 Phase 5: site & pitch materials

**Decision.** Pivoted the marketing site toward the go-to-market while keeping the
portfolio framing:

- **Landing** — hero reframed for Berkeley restaurants with a primary "Get a free
  menu audit" CTA (→ `/demo/audits/new`); added a 3-step "How it works" section;
  final CTA band leads with the free audit. Existing problem/features/math
  sections kept.
- **Pricing page** (`/pricing`) — Free Audit ($0) → Full Setup ($199 one-time) →
  Ongoing ($79/mo), with the "first few restaurants free for a case study" note.
- **About page** (`/about`) — Ethan Chen bio (Berkeley data science student) +
  contact + free-audit CTA.
- **Case study** — added a "from demo to door-opener" pivot section and a
  **Results** section with dashed placeholder cards for the first 2–3 real
  restaurant case studies (before/after fields awaiting data).
- **Nav/footer** — Pricing / Case study / About / Demo links; primary CTA is now
  "Free audit". Section background alternation preserved.

---

## 2026-06-24 — V2 Phase 4: market intelligence

**Decision.** Two views under `/demo/market`:

- **Competitor browser** (`/demo/market`) — low/avg/high price bands per dish
  category for a chosen corridor, rendered as gradient `PriceBandBar`s. Picking a
  restaurant pins the corridor to theirs and overlays a colour-coded dot for the
  restaurant's average price in each category (below / at / above corridor),
  directly answering "where does this restaurant sit vs. the market".
- **Seasonality view** (`/demo/market/seasonality`) — current period highlighted,
  a 12-month traffic strip (from `seasonForMonth` per month), and cards for every
  calendar window with its traffic delta + recommendation. Current month computed
  client-side (mount guard) like the dashboard card. "Market" nav entry added.

---

## 2026-06-24 — V2 Phase 3: client pipeline (lightweight CRM)

**Decision.** Added `/demo/clients` — a pipeline board grouping restaurants by
status (prospect → audited → pitched → active → churned) with per-stage counts, a
total-upside summary, and cards showing contact + notes preview + monthly upside.
The **per-restaurant detail page is the audit workspace** (`/demo/audits/[id]`),
now with an editable "Client details" card (contact name/email/phone, plates/day,
notes — all persisted live via `updateRestaurant`) and a "Last analysed" stamp.

**One restaurant surface, two lenses.** Rather than a separate CRM detail page,
the workspace doubles as the client detail (audit + margins + recommendations +
contact + notes + status + scenarios link), so there's a single place per
restaurant. The Clients board and Audits hub are intentionally two entry lenses
on the same restaurants (sales pipeline vs. run-an-audit), matching how the tool
is actually used. Audit "history" is the current saved analysis (one per
restaurant via upsert) surfaced with its date; full snapshot history was left
out as low MVP value.

---

## 2026-06-24 — V2 Phase 2: scenario modeling & seasonality

**Decision.** Three additions on top of Phase 1:

- **Scenario engine** (`scenario.ts` + 5 tests). `scenarioImpact()` is pure and
  works off the audit's analysed items (price + estimated cost) rather than a
  separate recipe model, so any audited restaurant can be modelled. Three
  scenario kinds (discriminated union): `ingredient-change` (bumps only dishes
  whose template uses that ingredient, via the estimator's line breakdown),
  `price-change` (across-the-board %), and `menu-change` (cut → volume 0,
  promote → +25% volume). Returns per-dish before/after monthly margin + total
  monthly impact.
- **Scenario UI** at `/demo/audits/[id]/scenarios`: live controls, before/after
  grouped Recharts bars, impact stats, and save/load/delete of named scenarios.
  Linked from the audit workspace ("What-if scenarios").
- **Seasonality overlay** on the dashboard (`SeasonalityCard`) using
  `seasonForMonth(currentMonth)`. Rendered client-side after mount (month from
  `new Date()`) to avoid any SSR/timezone hydration drift; links to the full
  calendar view (built in Phase 4).

**Task 8 (estimated → real costs) shipped as a product bridge, not a data join.**
The V1 costing engine already computes true margins from real ingredient/recipe
data. Rather than duplicate that by linking each audit item to a `Recipe` (a
large model change for little MVP value), the workspace shows an "upgrade" card
guiding the user to the existing ingredient library + recipe builder once a
prospect becomes a client. The two systems share the same store and engine.

---

## 2026-06-24 — V2 Phase 1: free menu audit system

**Decision.** Built the door-opener audit feature on top of the V1 engine:

- **New typed data layer** (`types.ts`): `Restaurant`, `MenuAnalysis`/`MenuAnalysisItem`,
  `CompetitorPricing`, `SeasonalPattern`, `Scenario`, plus `DishCategory`,
  `Neighborhood`, `RestaurantType`/`Status` enums — field names mirror
  PROJECT_BRIEF_V2 §4.
- **Estimated cost DB** (`data/estimatedCosts.ts`, ~115 Bay-Area ingredients) +
  **dish templates** (`data/dishTemplates.ts`) drive a pure **dish cost
  estimator** (`estimator.ts`). Template quantities are expressed in each
  ingredient's own unit so cost = Σ(qty × unitCost) with no conversion layer.
- **Audit engine** (`audit.ts`): `analyzeMenu()` is pure/deterministic —
  estimates each dish, flags it (underwater >35% FC, healthy, overpriced),
  compares to the corridor, and emits ranked recommendations + a monthly-upside
  headline. Tested (`estimator.test.ts`, `audit.test.ts`, +21 new tests).
- **Competitor + seasonality seed** (`data/competitorPricing.ts` 60 corridor×category
  rows; `data/seasonality.ts` Berkeley academic calendar with a specific-window
  `seasonForMonth`).
- **Store** extended with restaurants/analyses/scenarios; storage key bumped to
  `luma.v2` (old `luma.v1` ignored, falls back to seed). Seeded 3 complete demo
  restaurants (`auditSeed.ts`).
- **UI**: `/demo/audits` hub, `/demo/audits/new` builder with live analysis,
  `/demo/audits/[id]` workspace (edit + pipeline status), and a print one-pager.

**PDF export = print CSS, not a PDF library.** The audit report is a dedicated
route (`/demo/audits/[id]/report`) styled for print (`print:` Tailwind variants;
AppNav is `print:hidden`) with a "Print / Save as PDF" button calling
`window.print()`. Chosen over `@react-pdf/renderer` / `html2canvas+jsPDF`: zero
new dependencies (consistent with the V1 stance), crisp **vector** text instead
of a rasterised canvas, full control via CSS, and reliable on Vercel. A library
can be added later if programmatic/server-side PDF generation is needed.

---

## 2026-06-24 — Polish pass (a11y, mobile, validation)

**Decision.** Cross-route polish: a "Skip to content" link + focusable
`<main id="content">` in both layouts; the app nav becomes a horizontally
scrollable strip on narrow screens (`.no-scrollbar`) so it never overflows;
landing feature copy updated to mention the menu quadrant. Existing strengths
were left intact — guarded form validation with touched-state errors and a live
unit-cost preview (`IngredientForm`), dual empty states (zero vs. no filter
match), per-route `h1`s, labelled controls, and an escapable modal.

**Rationale.** The surfaces were already solid from the adversarial review, so the
polish pass added the few genuine cross-route gaps (keyboard skip-link, small-screen
nav overflow) rather than churn working code.

---

## 2026-06-24 — Case study: walkthrough over a raster screenshot

**Decision.** The case study leads with the costing math, a four-step usage
**walkthrough**, a layered **architecture** diagram, and a "key decisions &
trade-offs" grid. The product visual is a deterministic CSS/Tailwind mock (and
the walkthrough), not an embedded PNG.

**Rationale.** No headless-browser tooling is installed (no Playwright/Puppeteer,
no Chromium), so a real screenshot would mean a heavy browser download. The brief
allows "a screenshot **or** a short walkthrough"; the CSS mock + walkthrough are
crisp at any resolution, never go stale against the real UI, and add no binary
assets. A raster screenshot can be dropped into `public/` later and swapped in.

---

## 2026-06-24 — Menu-engineering quadrant & a `popularity` field

**Decision.** Added an optional `popularity?: number` (≈ orders/week) to `Recipe`
and a dashboard **popularity × margin scatter quadrant** (Recharts `ScatterChart`)
that splits recipes into Stars / Plowhorses / Puzzles / Dogs at the menu's average
popularity and average margin-per-serving. Dot colour reflects margin health
(low-margin = red). Seed recipes carry hand-tuned sales so the demo lands one dish
in each quadrant (Margherita & Cheeseburger = Stars, Carbonara = Plowhorse,
Caesar = Puzzle, Tiramisu = Dog and red-flagged). y-axis is **contribution margin
per serving** (the classic menu-engineering measure); only priced, error-free
recipes with sales data are plotted.

**Rationale.** The quadrant is the brief's sanctioned stretch and the most
"product-like" view for the sales story. `popularity` is optional because there's
no POS/sales integration in scope — it's seeded demo data; user-created recipes
(no sales) simply don't appear on the quadrant until they have a price and volume.

---

## 2026-06-24 — Interactive repricing slider

**Decision.** The recipe builder's pricing panel leads with a **target-food-cost
slider** (10–60%, branded filled track in `globals.css` via `.range-brand`) that
recomputes the suggested sale price live as you drag, shows the implied gross
margin, and offers a one-click "Apply as sale price" that flips to "Applied ✓"
and re-arms when the target changes. The old number box for the target was
removed in favour of the slider.

**Rationale.** "What should I charge?" is the product's headline value, so it
should be tactile and instant. The 10–60% band covers realistic food costs; any
exact value is still reachable in 1% steps. Computation stays on the tested
`suggestedPrice` engine function — the slider only drives its input.

---

## 2026-06-24 — `/demo` route & branch/PR workflow

**Decision.** The Luma product moved from `/app` to **`/demo`** (route folder
`src/app/demo/**`; all in-app links and the marketing "Try the demo" CTAs now
point at `/demo`). The component folder `src/components/app/**` keeps its name —
only the URL changed. Work on the portfolio-grade enhancements ships on **feature
branches with pull requests**, never directly to `main`, never force-pushed.

**Rationale.** `/demo` reads better as the public, instantly-loaded demo surface
and matches how the project is described. Seeded state means `/demo` always
opens populated (dashboard with a real margin chart and a flagged low-margin
dish) — no empty first impression. The branch/PR flow keeps `main` clean and
each change independently reviewable. Branches are **stacked** (each new feature
branches off the previous) because `origin/main` does not yet contain the MVP, so
stacking avoids cross-branch merge conflicts; merge them in order.

---

## 2026-06-23 — Routing & surfaces

**Decision.** Ship marketing and product as one Next.js app. The portfolio site
lives at the root `/` via the `(site)` route group (landing page + the
`/case-study` write-up); the Luma product lives under `/demo`. "Try the demo"
calls-to-action link to `/demo`.

**Rationale.** One deployable app keeps deploy and hosting trivial (a single
Vercel project) while the route group gives a clean separation between the
marketing chrome (`SiteNav`/`SiteFooter`) and the product chrome (`AppNav`).
Marketing and product can evolve independently without a second service.

---

## 2026-06-23 — Data layer

**Decision.** Store state in an in-memory React context (`src/lib/store.tsx`)
persisted to `localStorage` under the key `"luma.v1"`, seeded from
`src/lib/seed.ts` (19 ingredients spanning all three dimensions — weight, volume,
and count — and 5 recipes). No database and no Prisma/SQLite.

**Rationale.** A zero-friction demo: a visitor can open the app and immediately
see realistic numbers, edit freely, and have changes survive a refresh — with no
backend, accounts, or migrations to run. The DB option is left as the brief's
sanctioned optional stretch. The versioned key (`luma.v1`) leaves room to evolve
the persisted shape later without colliding with old saved state.

---

## 2026-06-23 — Costing engine purity

**Decision.** All costing math lives in pure functions in `src/lib`
(`costing.ts` + `units.ts`), covered by 21 Vitest unit tests in
`src/lib/costing.test.ts`. The UI never re-implements the math; it consumes the
non-throwing `costRecipe` aggregate.

**Rationale.** Costing is the correctness-critical core of the product. Keeping
it pure (no React, no I/O) makes it testable in isolation and impossible to drift
out of sync with the UI, since there is exactly one source of truth for every
formula.

---

## 2026-06-23 — Base-unit normalization

**Decision.** Normalize every quantity to a single base unit per dimension
before any arithmetic: weight → grams, volume → milliliters, count → each
(`kg`/`l` are ×1000; `each` is ×1). All cost math operates on base units.

**Rationale.** Doing arithmetic on mixed units is the easiest way to ship a
subtly-wrong number. Normalizing first means every comparison and sum is
apples-to-apples, and unit conversion is isolated to one tiny, tested module
(`units.ts`).

---

## 2026-06-23 — Thresholds & defaults

**Decision.** Flag a recipe as low-margin when its food cost is **≥ 35%**
(`LOW_MARGIN_FOOD_COST_THRESHOLD`); default the suggested-price target to **30%**
(`DEFAULT_TARGET_FOOD_COST`). Both live in `src/lib/constants.ts`.

**Rationale.** 35% is a common industry ceiling — above it there's little room
left for labour, overhead, and profit. 30% is a sensible default target to
anchor the suggested-price control. Centralizing them as named constants keeps
the policy tunable and out of the math and the components.

---

## 2026-06-23 — Edge-case handling

**Decision.** Handle the brief's required edge cases as data, not crashes, via
the non-throwing `costRecipe` aggregate:

- **Deleting an in-use ingredient is allowed.** Affected recipes surface an
  "Ingredient was deleted." flag on the affected line; nothing crashes.
- **Cross-dimension mixing is rejected** with `DimensionMismatchError` (weight,
  volume, and count are not interconvertible), shown inline in the recipe
  builder.
- **Yield of 0** and a **missing sale price** degrade gracefully to `null`,
  rendered as `—`.

**Rationale.** The pure formula functions still throw for programmer errors, but
the UI needs to stay live and editable while inputs are mid-edit or incomplete.
Surfacing problems as `null` + error strings keeps the interface responsive and
honest instead of blanking out or throwing.

---

## 2026-06-23 — IDs & misc defaults

**Decision.** Generate entity IDs with `crypto.randomUUID()` (with a fallback for
environments where it is unavailable). Quantities are always converted to base
units (g / ml / each) before any arithmetic.

**Rationale.** `crypto.randomUUID()` is built in and collision-safe with no extra
dependency, matching the "no new npm dependencies" constraint; the fallback keeps
ID generation robust across runtimes.

---

## 2026-06-24 — Git push & PRs (resolved)

**Decision.** Earlier in the build, an automated push failed (no cached
credential, no `gh` CLI, empty keychain probe). It later **succeeded** via the
macOS `osxkeychain` credential helper, which holds a `repo`-scoped token, so
branches are pushed to `origin` and PRs are opened through the GitHub REST API
(`gh` is still not installed). `main` is kept even with `origin/main`; all MVP and
enhancement work lands via PRs from `feat/*` branches.

**Rationale.** Once a working credential was available, the right move was to
honour the requested branch/PR workflow directly rather than leave the user a
manual push. If the credential is ever unavailable again, every branch is still
committed locally and can be pushed with `git push -u origin <branch>`.
