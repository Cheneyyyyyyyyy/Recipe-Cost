"use client";

import Link from "next/link";
import { useMemo } from "react";
import { analyzeMenu } from "@/lib/audit";
import { useStore } from "@/lib/store";
import { statusLabel, statusTone, typeLabel } from "@/lib/restaurantMeta";
import { formatCurrency } from "@/lib/format";
import type { MenuItemInput } from "@/lib/audit";
import type { Restaurant } from "@/lib/types";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function AuditHub() {
  const { restaurants, getLatestAnalysis } = useStore();

  const cards = useMemo(
    () =>
      restaurants.map((restaurant) => {
        const latest = getLatestAnalysis(restaurant.id);
        const inputs: MenuItemInput[] = (latest?.items ?? []).map((i) => ({
          name: i.name,
          category: i.category,
          currentPrice: i.currentPrice,
        }));
        const result = analyzeMenu(restaurant.neighborhood, inputs, {
          estimatedDailyCovers: restaurant.estimatedDailyCovers,
        });
        return { restaurant, result, itemCount: inputs.length };
      }),
    [restaurants, getLatestAnalysis]
  );

  return (
    <div>
      <PageHeader
        title="Menu audits"
        subtitle="Run a free margin analysis for any Berkeley restaurant — your cold-pitch deliverable."
        action={
          <Link href="/demo/audits/new">
            <Button>+ New audit</Button>
          </Link>
        }
      />

      {cards.length === 0 ? (
        <EmptyState
          title="No audits yet"
          description="Create your first menu audit: enter a restaurant and its menu to see flagged dishes, competitor pricing, and recommendations."
          action={
            <Link
              href="/demo/audits/new"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
            >
              New audit
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ restaurant, result, itemCount }) => (
            <AuditCard
              key={restaurant.id}
              restaurant={restaurant}
              itemCount={itemCount}
              underwater={result.summary.underwaterCount}
              monthlyOpportunity={result.summary.monthlyOpportunity}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AuditCard({
  restaurant,
  itemCount,
  underwater,
  monthlyOpportunity,
}: {
  restaurant: Restaurant;
  itemCount: number;
  underwater: number;
  monthlyOpportunity: number;
}) {
  return (
    <Link href={`/demo/audits/${restaurant.id}`} className="group block">
      <Card className="flex h-full flex-col transition-shadow group-hover:shadow-md">
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <h3 className="font-semibold text-ink">{restaurant.name}</h3>
          <Badge tone={statusTone(restaurant.status)}>{statusLabel(restaurant.status)}</Badge>
        </div>
        <p className="mt-1 px-5 text-xs text-slate-500">
          {restaurant.neighborhood} · {typeLabel(restaurant.type)}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 px-5 py-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Items</div>
            <div className="mt-0.5 text-lg font-semibold tabular-nums text-ink">{itemCount}</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Flagged</div>
            <div
              className={`mt-0.5 text-lg font-semibold tabular-nums ${
                underwater > 0 ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {underwater}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Upside</div>
            <div className="mt-0.5 text-lg font-semibold tabular-nums text-emerald-700">
              {monthlyOpportunity > 0 ? formatCurrency(monthlyOpportunity) : "—"}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
