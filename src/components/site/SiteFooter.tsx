import Link from "next/link";
import { Logo } from "../Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Logo />
          <p className="text-sm text-slate-500">
            Menu profitability for independent Berkeley restaurants.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <Link href="/pricing" className="hover:text-ink">
            Pricing
          </Link>
          <Link href="/case-study" className="hover:text-ink">
            Case study
          </Link>
          <Link href="/about" className="hover:text-ink">
            About
          </Link>
          <Link href="/demo" className="hover:text-ink">
            Demo
          </Link>
          <a
            href="https://github.com/Cheneyyyyyyyyy/Recipe-Cost"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
