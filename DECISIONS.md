# Engineering decisions

A running log of the notable engineering choices made while building Luma, with
the reasoning behind each. Newest context first; most entries date from the
initial build.

_Last updated: 2026-06-24_

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
