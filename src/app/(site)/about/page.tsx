import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Luma is built by Ethan Chen, a data science student at UC Berkeley, to help independent local restaurants price their menus with data instead of guesswork.",
};

export default function AboutPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">About</p>
        <h1 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Data for the restaurants I actually eat at.
        </h1>

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-slate-600">
          <p>
            I&apos;m Ethan Chen, a data science student at UC Berkeley. I eat at the same
            independent spots on Telegraph, Southside, and in North Berkeley as everyone else here —
            and most of them price their menus by gut feel, because the tools built for restaurant
            finance are made for chains, not for a single owner-operator.
          </p>
          <p>
            Luma started as a costing engine — turn ingredient prices and recipes into an exact
            per-plate cost and margin. Then I realised the more useful thing was to meet restaurants
            where they are: take a public menu, estimate the costs with realistic Bay-Area numbers,
            and hand the owner a one-page analysis showing where they&apos;re leaving money on the
            table. That free audit is the whole pitch.
          </p>
          <p>
            Everything is built to be precise where it matters: the costing math is a set of pure,
            unit-tested functions, and the Berkeley competitor pricing and academic-calendar
            seasonality come from real research. It&apos;s a portfolio project and a real tool at the
            same time.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-sm font-semibold text-ink">Get in touch</h2>
          <p className="mt-1 text-sm text-slate-600">
            Run a restaurant in Berkeley? I&apos;ll analyse your menu for free.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            <span className="font-medium text-ink">Email:</span> ethan@luma.tools
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo/audits/new">
              <Button className="w-full sm:w-auto">Get a free menu audit</Button>
            </Link>
            <Link href="/case-study">
              <Button variant="secondary" className="w-full sm:w-auto">
                Read the case study
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
