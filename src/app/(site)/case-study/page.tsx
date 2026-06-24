import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Case study",
  description:
    "How Luma turns recipes and ingredient prices into per-plate cost, food-cost %, and margin — a single Next.js app built around a pure, unit-tested costing engine.",
};

const GITHUB_URL = "https://github.com/Cheneyyyyyyyyy/Recipe-Cost";

/** The core formulas, presented verbatim so the math is auditable. */
const FORMULAS: { name: string; expr: string; note: string }[] = [
  {
    name: "ingredientUnitCost",
    expr: "purchasePrice / toBaseUnit(purchaseQty, purchaseUnit)",
    note: "Cost of a single base unit — one gram, one millilitre, or one each.",
  },
  {
    name: "recipeItemCost",
    expr: "toBaseUnit(quantity, unit) * ingredientUnitCost",
    note: "Only valid when item and ingredient share a dimension.",
  },
  {
    name: "totalRecipeCost",
    expr: "sum(recipeItemCost for each item)",
    note: "The fully-loaded cost to make one batch.",
  },
  {
    name: "costPerServing",
    expr: "totalRecipeCost / yield",
    note: "The number that actually drives a menu price.",
  },
  {
    name: "foodCostPercent",
    expr: "costPerServing / salePrice * 100",
    note: "Null when there is no sale price to compare against.",
  },
  {
    name: "suggestedPrice(t)",
    expr: "costPerServing / (t / 100)",
    note: "Reverses the math for a target food-cost % t (e.g. 30).",
  },
];

/** Faux dashboard data — illustrative only, never fetched. */
const PREVIEW_ROWS: {
  name: string;
  foodCost: number;
  tone: "good" | "warn" | "bad";
  flagged?: boolean;
}[] = [
  { name: "Lemon tart", foodCost: 22, tone: "good" },
  { name: "Margherita", foodCost: 24, tone: "good" },
  { name: "Caesar salad", foodCost: 28, tone: "good" },
  { name: "Truffle pasta", foodCost: 33, tone: "warn" },
  { name: "Wagyu burger", foodCost: 41, tone: "bad", flagged: true },
];

const BAR_TONE: Record<"good" | "warn" | "bad", string> = {
  good: "bg-emerald-500",
  warn: "bg-amber-500",
  bad: "bg-red-500",
};

export default function CaseStudyPage() {
  return (
    <div>
      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 to-white" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 py-16 sm:py-24">
          <Eyebrow>Case study</Eyebrow>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Luma — Recipe costing &amp; menu margins
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Luma turns ingredient prices and recipes into an instant per-plate cost, food-cost
            percentage, and margin — then suggests a price for any target food-cost %. It is a
            single Next.js app built around a pure, framework-free costing engine that is unit
            tested so the numbers can be trusted.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/demo">
              <Button size="md">Try the demo</Button>
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="md">
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <div className="space-y-16 sm:space-y-20">
          {/* THE PROBLEM */}
          <Section eyebrow="The problem" title="Most kitchens are pricing blind">
            <div className="space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                Restaurants and ghost kitchens rarely know the true cost of a single plate.
                Recipes are built from ingredients bought in mismatched units — olive oil by the
                litre, flour by the kilo, eggs by the each — and turning that into a per-serving
                number is fiddly, error-prone arithmetic.
              </p>
              <p>
                Worse, prices move constantly. The spreadsheet that was right last month is quietly
                stale today, so menus drift away from their target margins without anyone noticing.
                The result is dishes that look popular but lose money on every order.
              </p>
            </div>
          </Section>

          {/* THE APPROACH */}
          <Section eyebrow="The approach" title="One app, one trustworthy engine">
            <div className="grid gap-4 sm:grid-cols-3">
              <FeatureCard
                title="Single Next.js app"
                body="No backend services to run. Everything ships as one App Router deployment on Vercel — UI and logic in the same codebase."
              />
              <FeatureCard
                title="Pure costing core"
                body="The math lives in a framework-free, side-effect-free module separate from React, so it can be reasoned about and unit tested in isolation."
              />
              <FeatureCard
                title="Instant, no signup"
                body="Seeded in-memory data plus localStorage means the demo works the moment it loads — real-looking recipes, no account, no empty state."
              />
            </div>
          </Section>

          {/* THE COSTING MATH */}
          <Section
            eyebrow="The costing math"
            title="Get the numbers exactly right"
          >
            <p className="mb-6 text-base leading-relaxed text-slate-600">
              Every quantity is normalized to a base unit per dimension before any arithmetic
              happens — weight to <Mono>grams</Mono>, volume to <Mono>millilitres</Mono>, count to{" "}
              <Mono>each</Mono>. That makes the formulas below safe to apply directly.
            </p>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <dl className="divide-y divide-slate-100">
                {FORMULAS.map((f) => (
                  <div key={f.name} className="px-5 py-4">
                    <dt className="font-mono text-sm">
                      <span className="font-semibold text-brand-700">{f.name}</span>
                      <span className="text-slate-400"> = </span>
                      <span className="text-ink">{f.expr}</span>
                    </dt>
                    <dd className="mt-1.5 text-sm text-slate-500">{f.note}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <NoteCard title="Dimensions never mix">
                An ingredient priced per <Mono>kg</Mono> can&apos;t be used as <Mono>each</Mono>.
                Weight, volume, and count aren&apos;t interconvertible, so a cross-dimension item is
                rejected with a clear validation error instead of a silently wrong cost.
              </NoteCard>
              <NoteCard title="Edge cases are handled, not assumed">
                A <Mono>yield</Mono> of 0, missing or null prices, and deleting an ingredient that a
                recipe still references are all surfaced as flags in the UI — the engine returns a
                result with errors attached and never crashes.
              </NoteCard>
            </div>
          </Section>

          {/* WALKTHROUGH */}
          <Section eyebrow="Walkthrough" title="From ingredient to price in four steps">
            <ol className="space-y-4">
              <Step n={1} title="Stock the ingredient library">
                Enter what you pay and how much you buy — &ldquo;$32 for 5&nbsp;kg of
                mozzarella.&rdquo; Luma derives the per-gram cost instantly, so every recipe that
                uses it inherits live pricing.
              </Step>
              <Step n={2} title="Build a recipe">
                Add line items with quantities in whatever unit makes sense. Cost per serving,
                total cost, and a per-line breakdown update as you type. Mixing dimensions (priced
                per <Mono>kg</Mono>, used as <Mono>each</Mono>) is caught with a clear error rather
                than a wrong number.
              </Step>
              <Step n={3} title="Reprice with the target-margin slider">
                Drag a target food-cost&nbsp;% and watch the suggested sale price move in real time,
                then apply it in one click. This is the &ldquo;what should I charge?&rdquo; answer
                the whole product exists to give.
              </Step>
              <Step n={4} title="Read the dashboard">
                Recipes are ranked by margin and low-margin dishes are flagged red, while a
                popularity&nbsp;×&nbsp;margin quadrant sorts the menu into Stars, Plowhorses,
                Puzzles, and Dogs — the classic menu-engineering view for deciding what to promote,
                reprice, or cut.
              </Step>
            </ol>
          </Section>

          {/* ARCHITECTURE */}
          <Section eyebrow="Architecture" title="A thin UI over a pure core">
            <p className="mb-6 text-base leading-relaxed text-slate-600">
              Luma is deliberately layered so the correctness-critical math has no idea React
              exists. Data flows down; the engine is a leaf with zero dependencies on the UI or the
              store.
            </p>

            <div className="space-y-2">
              <Layer label="Presentation" sub="Next.js App Router · React · Tailwind">
                Marketing site (<Mono>/</Mono>) and product (<Mono>/demo</Mono>): ingredient
                library, recipe builder, repricing slider, dashboard &amp; quadrant.
              </Layer>
              <LayerArrow />
              <Layer label="State" sub="React context · localStorage">
                In-memory store with full CRUD; seeds demo data and persists edits across reloads.
                No server, no API round-trips.
              </Layer>
              <LayerArrow />
              <Layer label="Costing engine — pure" sub="src/lib/costing.ts · units.ts" highlight>
                Framework-free functions: unit normalization, per-item and per-serving cost,
                food-cost&nbsp;%, suggested price. Covered by 21 unit tests.
              </Layer>
            </div>

            <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Key decisions &amp; trade-offs
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <DecisionCard title="Pure engine, not hooks" tradeoff="Results are passed as props">
                Keeping the math out of React makes it unit-testable in isolation and impossible to
                drift out of sync with the UI — one source of truth per formula.
              </DecisionCard>
              <DecisionCard title="localStorage, not a database" tradeoff="No multi-device sync">
                A zero-friction demo with nothing to deploy but the app itself. A real DB is a
                documented, deliberate stretch rather than MVP scope.
              </DecisionCard>
              <DecisionCard title="Errors as data, not exceptions" tradeoff="Callers check flags">
                <Mono>costRecipe</Mono> returns nulls plus error flags for deleted ingredients and
                cross-dimension units, so the interface stays live and honest while you edit.
              </DecisionCard>
              <DecisionCard title="Base-unit normalization" tradeoff="One conversion layer to own">
                Every quantity becomes <Mono>g</Mono>/<Mono>ml</Mono>/<Mono>each</Mono> before any
                arithmetic, so every sum and comparison is apples-to-apples.
              </DecisionCard>
            </div>
          </Section>

          {/* ENGINEERING NOTES */}
          <Section eyebrow="Engineering notes" title="How it's built">
            <ul className="space-y-3">
              <CheckItem>
                TypeScript types mirror the data model exactly — <Mono>Ingredient</Mono>,{" "}
                <Mono>RecipeItem</Mono>, and <Mono>Recipe</Mono> with the unit enum shared across UI
                and engine.
              </CheckItem>
              <CheckItem>
                21 unit tests cover the costing math — base-unit conversion, per-serving cost,
                food-cost %, suggested price, and every rejected/edge case (including the
                partial-total guard for uncostable line items).
              </CheckItem>
              <CheckItem>
                Recharts powers two dashboard visuals — a food-cost bar chart and the
                popularity&nbsp;×&nbsp;margin menu-engineering quadrant — with low-margin dishes
                flagged automatically.
              </CheckItem>
              <CheckItem>
                A live target-margin slider reverses the costing math to suggest a sale price for
                any food-cost % and applies it in one click.
              </CheckItem>
              <CheckItem>
                State is plain React context backed by localStorage — no database, no auth, no API
                round-trips for the MVP.
              </CheckItem>
            </ul>
          </Section>

          {/* PRODUCT PREVIEW */}
          <Section eyebrow="Product preview" title="A look at the dashboard">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Mock window chrome */}
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="ml-2 font-mono text-xs text-slate-400">luma / dashboard</span>
              </div>

              <div className="p-5">
                {/* Mock stat row */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <PreviewStat label="Recipes" value="5" hint="all costed" />
                  <PreviewStat
                    label="Avg food cost"
                    value="29.6%"
                    hint="target 30%"
                    tone="good"
                  />
                  <PreviewStat label="Low-margin" value="1" hint="needs a reprice" tone="bad" />
                </div>

                {/* Mock bar chart */}
                <div className="mt-6">
                  <div className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Recipes by food cost %
                  </div>
                  <div className="space-y-2.5">
                    {PREVIEW_ROWS.map((row) => (
                      <div key={row.name} className="flex items-center gap-3">
                        <div className="w-28 shrink-0 truncate text-sm text-slate-600">
                          {row.name}
                        </div>
                        <div className="h-6 flex-1 overflow-hidden rounded-md bg-slate-100">
                          <div
                            className={`h-full rounded-md ${BAR_TONE[row.tone]}`}
                            style={{ width: `${(row.foodCost / 45) * 100}%` }}
                          />
                        </div>
                        <div className="flex w-24 shrink-0 items-center justify-end gap-2">
                          {row.flagged ? (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700 ring-1 ring-inset ring-red-100">
                              flag
                            </span>
                          ) : null}
                          <span className="text-sm tabular-nums text-ink">{row.foodCost}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <LegendDot className="bg-emerald-500" label="Healthy" />
                    <LegendDot className="bg-amber-500" label="Watch" />
                    <LegendDot className="bg-red-500" label="Low margin" />
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Illustrative mock-up — the live demo renders this from seeded data.
            </p>
          </Section>
        </div>
      </div>

      {/* CTA FOOTER */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-ink">
            See the costing engine in action
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
            Open the demo to build a recipe and watch cost-per-serving, food-cost %, and a suggested
            price update as you type — or read the source.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/demo">
              <Button size="md">Try the demo</Button>
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="md">
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Local presentational helpers (server components, no interactivity) */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-medium uppercase tracking-wide text-brand-600">{children}</div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Inline monospace token for inline code references. */
function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-700">
      {children}
    </code>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

function NoteCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
        aria-hidden
      >
        <circle cx="10" cy="10" r="9" className="fill-brand-50" />
        <path
          d="M6 10.5l2.5 2.5L14 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-base leading-relaxed text-slate-600">{children}</span>
    </li>
  );
}

function PreviewStat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "default" | "good" | "bad";
}) {
  const valueTone =
    tone === "good" ? "text-emerald-600" : tone === "bad" ? "text-red-600" : "text-ink";
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${valueTone}`}>{value}</div>
      <div className="mt-0.5 text-xs text-slate-500">{hint}</div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
        {n}
      </span>
      <div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{children}</p>
      </div>
    </li>
  );
}

function Layer({
  label,
  sub,
  highlight = false,
  children,
}: {
  label: string;
  sub: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        highlight ? "border-brand-200 bg-brand-50/60" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 className={`text-sm font-semibold ${highlight ? "text-brand-700" : "text-ink"}`}>
          {label}
        </h3>
        <span className="font-mono text-xs text-slate-400">{sub}</span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}

function LayerArrow() {
  return (
    <div className="flex justify-center text-slate-300" aria-hidden>
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M10 4v12M5 11l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function DecisionCard({
  title,
  tradeoff,
  children,
}: {
  title: string;
  tradeoff: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{children}</p>
      <p className="mt-3 text-xs text-slate-500">
        <span className="font-medium text-slate-600">Trade-off:</span> {tradeoff}
      </p>
    </div>
  );
}
