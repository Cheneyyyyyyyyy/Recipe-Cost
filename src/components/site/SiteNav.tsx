import Link from "next/link";
import { Logo } from "../Logo";
import { Button } from "../ui/Button";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/pricing"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-ink sm:block"
          >
            Pricing
          </Link>
          <Link
            href="/case-study"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-ink sm:block"
          >
            Case study
          </Link>
          <Link
            href="/about"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-ink sm:block"
          >
            About
          </Link>
          <Link
            href="/demo"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-ink"
          >
            Demo
          </Link>
          <Link href="/demo/audits/new">
            <Button size="sm">Free audit</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
