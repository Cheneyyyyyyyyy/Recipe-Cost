"use client";

import Link from "next/link";
import { useMemo } from "react";
import { analyzeMenu, type MenuItemInput } from "@/lib/audit";
import { useStore } from "@/lib/store";
import { RESTAURANT_STATUSES, statusTone, typeLabel } from "@/lib/restaurantMeta";
import { formatCurrency } from "@/lib/format";
import type { Restaurant, RestaurantStatus } from "@/lib/types";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface ClientRow {
  restaurant: Restaurant;
  itemCount: number;
  underwater: number;
  monthlyOpportunity: number;
}

export function ClientPipeline() {
  const { restaurants, getLatestAnalysis } = useStore();

  const rows = useMemo<ClientRow[]>(
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
        return {
          restaurant,
          itemCount: inputs.length,
          underwater: result.summary.underwaterCount,
          monthlyOpportunity: result.summary.monthlyOpportunity,
        };
      }),
    [restaurants, getLatestAnalysis]
  );

  const byStatus = (status: RestaurantStatus) => rows.filter((r) => r.restaurant.status === status);
  const totalPipeline = rows.reduce((s, r) => s + r.monthlyOpportunity, 0);

  return (
    <div>
      <PageHeader
        title="Client pipeline"
        subtitle="Every restaurant you're prospecting or working with, by stage."
        action={
          <Link href="/demo/audits/new">
            <Button>+ New audit</Button>
          </Link>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No restaurants yet"
          description="Run your first menu audit — it adds the restaurant to your pipeline as a prospect."
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
        <div className="space-y-6">
          {/* Pipeline summary */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {RESTAURANT_STATUSES.map((st) => (
              <div key={st.value} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{st.label}</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums text-ink">
                  {byStatus(st.value).length}
                </div>
              </div>
            ))}
            <div className="col-span-2 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 sm:col-span-1">
              <div className="text-xs font-medium uppercase tracking-wide text-brand-700">Total upside</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums text-brand-700">
                {totalPipeline > 0 ? formatCurrency(totalPipeline) : "—"}
              </div>
            </div>
          </div>

          {/* Grouped columns */}
          {RESTAURANT_STATUSES.map((st) => {
            const group = byStatus(st.value);
            if (group.length === 0) return null;
            return (
              <section key={st.value}>
                <div className="mb-3 flex items-center gap-2">
                  <Badge tone={statusTone(st.value)}>{st.label}</Badge>
                  <span className="text-sm text-slate-400">{group.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((row) => (
                    <ClientCard key={row.restaurant.id} row={row} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ClientCard({ row }: { row: ClientRow }) {
  const { restaurant, itemCount, underwater, monthlyOpportunity } = row;
  return (
    <Link href={`/demo/audits/${restaurant.id}`} className="group block">
      <Card className="flex h-full flex-col p-5 transition-shadow group-hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-ink">{restaurant.name}</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {restaurant.neighborhood} · {typeLabel(restaurant.type)}
            </p>
          </div>
        </div>

        {restaurant.contactName && (
          <p className="mt-2 text-xs text-slate-500">Contact: {restaurant.contactName}</p>
        )}
        {restaurant.notes && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{restaurant.notes}</p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>
            {itemCount} item{itemCount === 1 ? "" : "s"}
            {underwater > 0 && <span className="text-red-600"> · {underwater} flagged</span>}
          </span>
          {monthlyOpportunity > 0 && (
            <span className="font-medium text-emerald-700">{formatCurrency(monthlyOpportunity)}/mo</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
