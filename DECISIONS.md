# Engineering decisions

A running log of the notable engineering choices made while building Luma, with
the reasoning behind each. Newest context first; most entries date from the
initial build.

_Last updated: 2026-06-23_

---

## 2026-06-23 — Routing & surfaces

**Decision.** Ship marketing and product as one Next.js app. The portfolio site
lives at the root `/` via the `(site)` route group (landing page + the
`/case-study` write-up); the Luma product lives under `/app`. "Try the demo"
calls-to-action link to `/app`.

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
(`costing.ts` + `units.ts`), covered by 20 Vitest unit tests in
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

## 2026-06-23 — GIT PUSH BLOCKER

**Decision.** Automated `git push origin main` **FAILED** in this environment
because no GitHub credentials are available (no `gh` CLI installed, empty macOS
keychain for github.com, no `GH_TOKEN`/`GITHUB_TOKEN` env var). All work has been
committed locally on the `main` branch. To publish, the user must authenticate
and run:

```bash
git push origin main
```

(e.g. after `gh auth login`, or by configuring a Personal Access Token / SSH
remote).

**Rationale.** Cannot push without credentials; nothing is lost — commits are
local and ready.
