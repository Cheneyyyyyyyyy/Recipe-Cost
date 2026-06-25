import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Luma pricing for Berkeley restaurants: a free menu audit, a one-time setup with your real costs, and an optional monthly subscription with quarterly margin reviews.",
};

const TIERS = [
  {
    name: "Free Audit",
    price: "$0",
    cadence: "always free",
    tagline: "The door-opener. No strings attached.",
    cta: "Get a free audit",
    href: "/demo/audits/new",
    highlight: false,
    features: [
      "One-page margin analysis of your public menu",
      "Estimated food-cost % for every dish",
      "Dishes flagged as likely underwater",
      "Comparison to Berkeley corridor pricing",
      "3 concrete recommendations",
      "Printable PDF one-pager",
    ],
  },
  {
    name: "Full Setup",
    price: "$199",
    cadence: "one-time",
    tagline: "Estimates become exact. Your real numbers, dialed in.",
    cta: "Book a setup",
    href: "/demo",
    highlight: true,
    features: [
      "Everything in Free Audit",
      "Your real supplier prices entered",
      "Recipes built with real quantities",
      "True per-plate cost & margin",
      "What-if scenario modeling",
      "Menu-engineering quadrant",
    ],
  },
  {
    name: "Ongoing",
    price: "$79",
    cadence: "per month",
    tagline: "Stay ahead of moving costs and the academic calendar.",
    cta: "Start monthly",
    href: "/demo",
    highlight: false,
    features: [
      "Everything in Full Setup",
      "Quarterly margin reviews",
      "Price-update alerts when costs move",
      "Seasonality planning for campus traffic",
      "Ongoing competitor pricing data",
      "Priority support",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Start free. Pay when it pays off.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            The audit is always free — it&apos;s how we start the conversation. If the numbers are
            useful, plug in your real costs and keep them current.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="grid gap-6 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col rounded-2xl border p-6 shadow-sm ${
                  tier.highlight ? "border-brand-300 ring-2 ring-brand-500/20" : "border-slate-200"
                }`}
              >
                {tier.highlight && (
                  <span className="mb-3 inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                    Most popular
                  </span>
                )}
                <h2 className="text-lg font-semibold text-ink">{tier.name}</h2>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-ink">{tier.price}</span>
                  <span className="text-sm text-slate-500">{tier.cadence}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{tier.tagline}</p>

                <ul className="mt-6 flex-1 space-y-2.5 text-sm text-slate-600">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={tier.href} className="mt-6">
                  <Button variant={tier.highlight ? "primary" : "secondary"} className="w-full">
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Building this out with my first few Berkeley restaurants — setup is on the house in
            exchange for a short case study.
          </p>
        </div>
      </section>
    </>
  );
}
