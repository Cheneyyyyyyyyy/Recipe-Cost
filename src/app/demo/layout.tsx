import { StoreProvider } from "@/lib/store";
import { AppNav } from "@/components/app/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-slate-50">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <AppNav />
        <main id="content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-8 outline-none sm:px-6">
          {children}
        </main>
      </div>
    </StoreProvider>
  );
}
