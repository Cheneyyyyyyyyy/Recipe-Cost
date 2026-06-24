"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/components/ui/cn";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { MarginRow } from "./DashboardView";

/**
 * Best-margin-first ordering: ascending food cost %. Recipes without a sale
 * price (null food cost) have no measurable margin, so they sort to the bottom.
 */
function compareRows(a: MarginRow, b: MarginRow): number {
  const af = a.foodCostPercent;
  const bf = b.foodCostPercent;
  if (af == null && bf == null) return 0;
  if (af == null) return 1;
  if (bf == null) return -1;
  return af - bf;
}

const TH = "px-5 py-2.5 font-medium";
const TD = "px-5 py-2.5 tabular-nums text-slate-600";

export function RecipeMarginTable({ rows }: { rows: MarginRow[] }) {
  const sorted = [...rows].sort(compareRows);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className={TH}>Recipe</th>
            <th className={TH}>Yield</th>
            <th className={TH}>Cost/serving</th>
            <th className={TH}>Sale price</th>
            <th className={TH}>Food cost %</th>
            <th className={TH}>Margin %</th>
            <th className={TH}>Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const low = row.status.level === "low";
            return (
              <tr
                key={row.recipe.id}
                className={cn(
                  "border-b border-slate-100 last:border-0",
                  low ? "bg-red-50/40" : "hover:bg-slate-50"
                )}
              >
                <td className="px-5 py-2.5">
                  <Link
                    href={`/app/recipes/${row.recipe.id}`}
                    className="font-medium text-ink hover:text-brand-700"
                  >
                    {row.recipe.name}
                  </Link>
                </td>
                <td className={TD}>{row.recipe.yield}</td>
                <td className={TD}>{formatCurrency(row.costPerServing)}</td>
                <td className={TD}>{formatCurrency(row.recipe.salePrice)}</td>
                <td className={TD}>{formatPercent(row.foodCostPercent)}</td>
                <td className={TD}>{formatPercent(row.marginPercent)}</td>
                <td className="px-5 py-2.5">
                  <Badge tone={row.status.tone}>{row.status.label}</Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
