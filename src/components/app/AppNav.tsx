"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../Logo";
import { cn } from "../ui/cn";
import { useStore } from "@/lib/store";

const LINKS = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/ingredients", label: "Ingredients" },
  { href: "/app/recipes", label: "Recipes" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const pathname = usePathname();
  const { resetToSeed } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo href="/app" />
          <nav className="flex items-center gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(pathname, link.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm("Reset all ingredients and recipes back to the demo data?")) {
                resetToSeed();
              }
            }}
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:text-ink sm:block"
          >
            Reset demo
          </button>
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:text-ink"
          >
            ← Site
          </Link>
        </div>
      </div>
    </header>
  );
}
