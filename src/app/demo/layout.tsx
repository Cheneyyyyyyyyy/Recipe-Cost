import { StoreProvider } from "@/lib/store";
import { AppNav } from "@/components/app/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-slate-50">
        <AppNav />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </StoreProvider>
  );
}
