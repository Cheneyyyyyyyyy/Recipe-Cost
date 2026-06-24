import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  // Absolute title so the homepage skips the "· Luma" template suffix.
  title: { absolute: "Luma — Recipe costing & menu margins for restaurants" },
  description:
    "Luma turns ingredient prices and recipes into instant per-plate cost, food-cost %, and margin — and suggests a price for any target food-cost %. A full-stack portfolio project by Ethan.",
};

/** Features rendered in the responsive grid. Each carries a small inline SVG. */
const FEATURES: { title: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Ingredient library",
    description:
      "Track purchase price, pack size, and unit for every ingredient — Luma derives a live unit cost per gram, millilitre, or each.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <ellipse cx="12" cy="5" rx="7" ry="3" />
        <path d="M5 5v6c0 1.66 3.13 3 7 3s7-1.34 7-3V5" />
        <path d="M5 11v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
      </svg>
    ),
  },
  {
    title: "Recipe builder",
    description:
      "Compose dishes from your library and watch cost-per-serving update line by line as you type quantities and yields.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 13 9 5 9-5" />
        <path d="m3 17 9 5 9-5" />
      </svg>
    ),
  },
  {
    title: "Margin & pricing",
    description:
      "Enter a sale price to see food-cost % and margin instantly, or set a target food-cost % and let Luma suggest the price.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path d="M19 5 5 19" />
        <circle cx="7.5" cy="7.5" r="2.5" />
        <circle cx="16.5" cy="16.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Margin dashboard",
    description:
      "Every recipe ranked by margin, with low-margin dishes flagged automatically and a Recharts visual of the whole menu.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path d="M3 3v18h18" />
        <rect x="7" y="11" width="3" height="6" rx="0.5" />
        <rect x="12.5" y="7" width="3" height="10" rx="0.5" />
        <rect x="18" y="13" width="3" height="4" rx="0.5" />
      </svg>
    ),
  },
];

/** Problem statements shown as a small numbered list. */
const PROBLEMS: { title: string; description: string }[] = [
  {
    title: "True plate cost is invisible",
    description:
      "Restaurants and ghost kitchens price from gut feel. Without a per-plate number, a “popular” dish can quietly lose money on every order.",
  },
  {
    title: "Spreadsheets go stale",
    description:
      "Manual cost sheets break the moment a supplier price moves — and nobody reworks every formula, so margins drift out of date.",
  },
  {
    title: "Pricing is guesswork",
    description:
      "Hitting a target food-cost % by hand means re-deriving the math for every recipe. Most teams simply don’t, and leave margin on the table.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative isolate overflow-hidden">
        {/* Soft teal gradient + dotted grid backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white"
        />
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-60" />
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand-100/50 blur-3xl"
        />

        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                Portfolio project — full-stack build
              </span>

              <h1 className="text-balance mt-6 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Stop guessing your margins.
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                Luma turns your ingredient prices and recipes into instant per-plate cost,
                food-cost %, and margin — then suggests a sale price for any target
                food-cost % you set.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/demo" className="sm:w-auto">
                  <Button size="md" className="w-full sm:w-auto">
                    Try the live demo
                  </Button>
                </Link>
                <Link href="/case-study" className="sm:w-auto">
                  <Button variant="secondary" size="md" className="w-full sm:w-auto">
                    Read the case study
                  </Button>
                </Link>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                No sign-up. Seeded with real ingredients and recipes so you can click around
                immediately.
              </p>
            </div>

            {/* Faux app-preview panel (built from divs, no images) */}
            <div className="relative">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Recipe
                    </p>
                    <p className="mt-1 text-base font-semibold text-ink">Truffle Mac &amp; Cheese</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Healthy margin
                  </span>
                </div>

                {/* Stat tiles */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "Cost / serving", value: "$3.20" },
                    { label: "Food cost", value: "26.7%" },
                    { label: "Margin", value: "$8.80" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-lg font-semibold tabular-nums text-ink">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Cost breakdown bars */}
                <div className="mt-5 space-y-3">
                  {[
                    { name: "Aged cheddar", cost: "$1.40", width: "w-3/4" },
                    { name: "Macaroni", cost: "$0.85", width: "w-1/2" },
                    { name: "Cream", cost: "$0.60", width: "w-1/3" },
                    { name: "Truffle oil", cost: "$0.35", width: "w-1/5" },
                  ].map((row) => (
                    <div key={row.name} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 truncate text-sm text-slate-600">{row.name}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <span className={`block h-full rounded-full bg-brand-500 ${row.width}`} />
                      </span>
                      <span className="w-14 shrink-0 text-right text-sm font-medium tabular-nums text-ink">
                        {row.cost}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating suggested-price chip */}
              <div className="absolute -bottom-5 -left-4 hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:block">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Suggested @ 30%
                </p>
                <p className="text-base font-semibold tabular-nums text-brand-700">$10.67</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Problem ───────────────────────── */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">The problem</p>
            <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Most kitchens can’t see what a plate actually costs.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Food cost is the largest controllable expense in a restaurant — yet it’s usually
              tracked in a spreadsheet that no one updates when supplier prices change.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {PROBLEMS.map((problem, i) => (
              <div key={problem.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-sm font-semibold tabular-nums text-brand-700">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{problem.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Features ───────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">What Luma does</p>
            <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Everything you need to cost a menu — and price it.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <span className="h-5 w-5">{feature.icon}</span>
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── How it works / math teaser ───────────────────────── */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">How it works</p>
              <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                A pure, unit-tested costing engine.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Every quantity is normalised to a base unit per dimension — grams, millilitres, or
                each — before any arithmetic. Cross-dimension mixing is rejected, so a price per
                kilogram is never silently used “per each”.
              </p>
              <Link
                href="/case-study"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-600"
              >
                See the full costing math
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Styled mono formula block */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <div className="flex items-center gap-1.5 border-b border-slate-700/60 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                <span className="ml-2 text-xs font-medium text-slate-400">costing.ts</span>
              </div>
              <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-slate-300">
                <code>
                  <span className="text-brand-500">ingredientUnitCost</span> = purchasePrice / toBase(qty, unit)
                  {"\n"}
                  <span className="text-brand-500">recipeItemCost</span>     = toBase(qty, unit) × unitCost
                  {"\n"}
                  <span className="text-brand-500">totalRecipeCost</span>    = Σ recipeItemCost
                  {"\n"}
                  <span className="text-brand-500">costPerServing</span>     = totalRecipeCost / yield
                  {"\n"}
                  <span className="text-brand-500">foodCostPercent</span>    = costPerServing / salePrice × 100
                  {"\n"}
                  <span className="text-brand-500">suggestedPrice</span>     = costPerServing / (target% / 100)
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── About this project ───────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
              <div className="lg:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  About this project
                </p>
                <h2 className="text-balance mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  A portfolio build by Ethan.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Luma is a self-contained product demo: a recipe-costing and menu-margin tool built
                  to show end-to-end product thinking — from a correctness-critical domain core to a
                  polished, responsive UI. The costing engine is a set of pure, unit-tested functions
                  with no UI dependencies; the rest of the app is built around it.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="https://github.com/Cheneyyyyyyyyy/Recipe-Cost"
                    target="_blank"
                    rel="noreferrer"
                    className="sm:w-auto"
                  >
                    <Button variant="secondary" size="md" className="w-full sm:w-auto">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
                      </svg>
                      View source on GitHub
                    </Button>
                  </a>
                  <Link href="/case-study" className="sm:w-auto">
                    <Button variant="ghost" size="md" className="w-full sm:w-auto">
                      Read the case study
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:border-l lg:border-slate-200 lg:pl-12">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Built with</p>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                  {[
                    "Next.js (App Router)",
                    "TypeScript (strict)",
                    "Tailwind CSS",
                    "Pure, unit-tested costing engine",
                    "Recharts dashboard",
                  ].map((tech) => (
                    <li key={tech} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Final CTA band ───────────────────────── */}
      <section className="bg-brand-600">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Try Luma now.
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-brand-50">
                Jump into the live demo — pre-loaded with ingredients and recipes — and see
                per-plate cost, food-cost %, and suggested pricing in action.
              </p>
            </div>
            <Link href="/demo" className="shrink-0">
              <Button
                variant="secondary"
                size="md"
                className="border-transparent bg-white text-brand-700 hover:bg-brand-50"
              >
                Try the live demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
