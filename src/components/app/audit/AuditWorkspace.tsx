"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { analyzeMenu } from "@/lib/audit";
import { useStore } from "@/lib/store";
import { statusLabel, statusTone, typeLabel, RESTAURANT_STATUSES } from "@/lib/restaurantMeta";
import type { RestaurantStatus } from "@/lib/types";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { MenuBuilder } from "./MenuBuilder";
import { AuditAnalysis } from "./AuditAnalysis";
import { itemsToRows, rowsToInputs, type DraftRow } from "./draft";

export function AuditWorkspace({ restaurantId }: { restaurantId: string }) {
  const s = useStore();
  const restaurant = s.getRestaurant(restaurantId);
  const latest = s.getLatestAnalysis(restaurantId);

  // Initialise the editable menu from the saved analysis (once).
  const [rows, setRows] = useState<DraftRow[]>(() =>
    itemsToRows(latest?.items ?? [])
  );
  const [savedSnapshot, setSavedSnapshot] = useState<string>(() =>
    JSON.stringify(latest?.items ?? [])
  );
  const [justSaved, setJustSaved] = useState(false);

  const inputs = useMemo(() => rowsToInputs(rows), [rows]);
  const result = useMemo(
    () =>
      restaurant
        ? analyzeMenu(restaurant.neighborhood, inputs, {
            estimatedDailyCovers: restaurant.estimatedDailyCovers,
          })
        : null,
    [restaurant, inputs]
  );

  if (!restaurant) {
    return (
      <div>
        <PageHeader title="Audit not found" />
        <EmptyState
          title="This restaurant doesn't exist"
          description="It may have been deleted."
          action={
            <Link
              href="/demo/audits"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
            >
              Back to audits
            </Link>
          }
        />
      </div>
    );
  }

  const dirty = result != null && JSON.stringify(result.items) !== savedSnapshot;

  function handleSave() {
    if (!result) return;
    s.saveAnalysis(restaurant!.id, result.items);
    setSavedSnapshot(JSON.stringify(result.items));
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2000);
  }

  return (
    <div>
      <PageHeader
        title={restaurant.name}
        subtitle={`${restaurant.neighborhood} · ${typeLabel(restaurant.type)}`}
        action={
          <div className="flex items-center gap-2">
            <Link href="/demo/audits" className="text-sm font-medium text-slate-500 hover:text-ink">
              ← All audits
            </Link>
            <Link href={`/demo/audits/${restaurant.id}/scenarios`}>
              <Button variant="secondary">What-if scenarios</Button>
            </Link>
            <Link href={`/demo/audits/${restaurant.id}/report`} target="_blank">
              <Button variant="secondary">Export PDF</Button>
            </Link>
            <Button onClick={handleSave} disabled={!dirty && !justSaved}>
              {justSaved ? "Saved ✓" : dirty ? "Save changes" : "Saved"}
            </Button>
          </div>
        }
      />

      {/* Status + pipeline control */}
      <Card className="mb-6">
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Pipeline status</span>
            <Badge tone={statusTone(restaurant.status)}>{statusLabel(restaurant.status)}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="status" className="text-sm text-slate-500">
              Update status
            </label>
            <Select
              id="status"
              className="w-44"
              value={restaurant.status}
              onChange={(e) =>
                s.updateRestaurant(restaurant.id, {
                  status: e.target.value as RestaurantStatus,
                })
              }
            >
              {RESTAURANT_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      {dirty && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You have unsaved changes. Save to update the exported report.
        </div>
      )}

      {/* Bridge to the full costing system (V1 engine) once the pitch lands. */}
      <Card className="mb-6 border-brand-100 bg-brand-50/40">
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">Ready to go beyond estimates?</h2>
            <p className="mt-0.5 max-w-2xl text-sm text-slate-600">
              These costs are Bay-Area estimates. Once {restaurant.name} is a client, plug in their
              real supplier prices and build true recipes to see exact per-plate margins.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href="/demo/ingredients">
              <Button variant="secondary" size="sm">
                Ingredient library
              </Button>
            </Link>
            <Link href="/demo/recipes">
              <Button size="sm">Build real recipes</Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      <div className="space-y-6">
        <MenuBuilder rows={rows} onChange={setRows} />
        {result && inputs.length > 0 ? (
          <AuditAnalysis result={result} restaurant={restaurant} />
        ) : (
          <Card>
            <CardBody>
              <p className="text-center text-sm text-slate-500">
                Add at least one menu item with a price to see the analysis.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
