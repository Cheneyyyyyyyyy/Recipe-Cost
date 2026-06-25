"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeMenu } from "@/lib/audit";
import { useStore } from "@/lib/store";
import { NEIGHBORHOODS } from "@/lib/data/competitorPricing";
import { RESTAURANT_TYPES } from "@/lib/restaurantMeta";
import type { Neighborhood, RestaurantType } from "@/lib/types";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { MenuBuilder } from "./MenuBuilder";
import { AuditAnalysis } from "./AuditAnalysis";
import { type DraftRow, emptyRow, rowsToInputs } from "./draft";

export function NewAuditForm() {
  const router = useRouter();
  const { addRestaurant, saveAnalysis } = useStore();

  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState<Neighborhood>("Telegraph Ave");
  const [type, setType] = useState<RestaurantType>("fast-casual");
  const [covers, setCovers] = useState("");
  const [rows, setRows] = useState<DraftRow[]>([emptyRow(), emptyRow(), emptyRow()]);
  const [touched, setTouched] = useState(false);

  const inputs = useMemo(() => rowsToInputs(rows), [rows]);
  const coversNum = Number(covers);
  const result = useMemo(
    () =>
      analyzeMenu(neighborhood, inputs, {
        estimatedDailyCovers: Number.isFinite(coversNum) && coversNum > 0 ? coversNum : undefined,
      }),
    [neighborhood, inputs, coversNum]
  );

  const nameError = touched && name.trim() === "" ? "Enter a restaurant name." : null;
  const canCreate = name.trim() !== "" && inputs.length > 0;

  // Preview restaurant for the live analysis (before it's persisted).
  const previewRestaurant = {
    id: "preview",
    name: name || "New restaurant",
    neighborhood,
    type,
    contactName: null,
    contactEmail: null,
    contactPhone: null,
    notes: null,
    status: "prospect" as const,
    createdAt: "",
  };

  function handleCreate() {
    setTouched(true);
    if (!canCreate) return;
    const restaurant = addRestaurant({
      name: name.trim(),
      neighborhood,
      type,
      contactName: null,
      contactEmail: null,
      contactPhone: null,
      notes: null,
      status: "audited",
      estimatedDailyCovers:
        Number.isFinite(coversNum) && coversNum > 0 ? coversNum : undefined,
    });
    saveAnalysis(restaurant.id, result.items);
    router.push(`/demo/audits/${restaurant.id}`);
  }

  return (
    <div>
      <PageHeader
        title="New menu audit"
        subtitle="Enter a restaurant and its menu to generate an instant margin analysis."
        action={
          <Button onClick={handleCreate} disabled={!canCreate}>
            Create audit
          </Button>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardHeader title="Restaurant" />
          <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Name" htmlFor="r-name" error={nameError} className="sm:col-span-2 lg:col-span-1">
              <Input
                id="r-name"
                placeholder="e.g. Cholita's Taqueria"
                value={name}
                invalid={!!nameError}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched(true)}
              />
            </Field>
            <Field label="Neighborhood" htmlFor="r-hood">
              <Select
                id="r-hood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value as Neighborhood)}
              >
                {NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Type" htmlFor="r-type">
              <Select id="r-type" value={type} onChange={(e) => setType(e.target.value as RestaurantType)}>
                {RESTAURANT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Plates / day"
              htmlFor="r-covers"
              hint="Optional — sharpens the monthly estimate."
            >
              <Input
                id="r-covers"
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="e.g. 180"
                value={covers}
                onChange={(e) => setCovers(e.target.value)}
              />
            </Field>
          </CardBody>
        </Card>

        <MenuBuilder rows={rows} onChange={setRows} />

        {inputs.length > 0 ? (
          <AuditAnalysis result={result} restaurant={previewRestaurant} />
        ) : (
          <Card>
            <CardBody>
              <p className="text-center text-sm text-slate-500">
                Add at least one menu item with a price to see the live analysis.
              </p>
            </CardBody>
          </Card>
        )}

        <div className="flex justify-end">
          <Button onClick={handleCreate} disabled={!canCreate}>
            Create audit
          </Button>
        </div>
      </div>
    </div>
  );
}
