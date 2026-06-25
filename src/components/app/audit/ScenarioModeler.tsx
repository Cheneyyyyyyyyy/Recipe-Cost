"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { scenarioImpact } from "@/lib/scenario";
import { estimateDishCost } from "@/lib/estimator";
import { formatCurrency } from "@/lib/format";
import { typeLabel } from "@/lib/restaurantMeta";
import type { MenuAnalysisItem, Scenario, ScenarioParameters } from "@/lib/types";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScenarioChart } from "./ScenarioChart";

type ScenarioType = ScenarioParameters["kind"];

const TYPE_OPTIONS: { value: ScenarioType; label: string }[] = [
  { value: "ingredient-change", label: "Ingredient price change" },
  { value: "price-change", label: "Menu price change" },
  { value: "menu-change", label: "Menu optimization" },
];

/** Unique ingredient names across the menu's dish templates. */
function menuIngredients(items: MenuAnalysisItem[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    for (const line of estimateDishCost(item.name, item.category).lines) {
      set.add(line.ingredient);
    }
  }
  return Array.from(set).sort();
}

export function ScenarioModeler({ restaurantId }: { restaurantId: string }) {
  const s = useStore();
  const restaurant = s.getRestaurant(restaurantId);
  const latest = s.getLatestAnalysis(restaurantId);
  const items = useMemo(() => latest?.items ?? [], [latest]);

  const ingredients = useMemo(() => menuIngredients(items), [items]);

  const [type, setType] = useState<ScenarioType>("ingredient-change");
  const [ingredientName, setIngredientName] = useState<string>(ingredients[0] ?? "");
  const [percentChange, setPercentChange] = useState(20);
  const [priceChangePercent, setPriceChangePercent] = useState(5);
  const [cutItems, setCutItems] = useState<string[]>([]);
  const [promoteItems, setPromoteItems] = useState<string[]>([]);
  const [scenarioName, setScenarioName] = useState("");

  const params: ScenarioParameters = useMemo(() => {
    switch (type) {
      case "ingredient-change":
        return { kind: "ingredient-change", ingredientName: ingredientName || ingredients[0] || "", percentChange };
      case "price-change":
        return { kind: "price-change", priceChangePercent };
      case "menu-change":
        return { kind: "menu-change", cutItemNames: cutItems, promoteItemNames: promoteItems };
    }
  }, [type, ingredientName, ingredients, percentChange, priceChangePercent, cutItems, promoteItems]);

  const result = useMemo(
    () => scenarioImpact(items, params, { estimatedDailyCovers: restaurant?.estimatedDailyCovers }),
    [items, params, restaurant]
  );

  const saved = s.getScenariosForRestaurant(restaurantId);

  if (!restaurant) {
    return (
      <div>
        <PageHeader title="Restaurant not found" />
        <EmptyState title="This restaurant doesn't exist" description="It may have been deleted." />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <PageHeader title={`What-if · ${restaurant.name}`} subtitle="Model menu changes before you make them." />
        <EmptyState
          title="No menu to model yet"
          description="Add and save a menu audit for this restaurant first."
          action={
            <Link
              href={`/demo/audits/${restaurantId}`}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
            >
              Go to audit
            </Link>
          }
        />
      </div>
    );
  }

  const autoName = describeScenario(params);

  function toggle(list: string[], setList: (v: string[]) => void, name: string) {
    setList(list.includes(name) ? list.filter((n) => n !== name) : [...list, name]);
  }

  function handleSave() {
    s.addScenario({
      restaurantId,
      name: scenarioName.trim() || autoName,
      type,
      parameters: params,
    });
    setScenarioName("");
  }

  function loadScenario(sc: Scenario) {
    setType(sc.parameters.kind);
    if (sc.parameters.kind === "ingredient-change") {
      setIngredientName(sc.parameters.ingredientName);
      setPercentChange(sc.parameters.percentChange);
    } else if (sc.parameters.kind === "price-change") {
      setPriceChangePercent(sc.parameters.priceChangePercent);
    } else {
      setCutItems(sc.parameters.cutItemNames);
      setPromoteItems(sc.parameters.promoteItemNames);
    }
  }

  const impact = result.totalMonthlyImpact;

  return (
    <div>
      <PageHeader
        title={`What-if · ${restaurant.name}`}
        subtitle={`${restaurant.neighborhood} · ${typeLabel(restaurant.type)}`}
        action={
          <Link href={`/demo/audits/${restaurantId}`} className="text-sm font-medium text-slate-500 hover:text-ink">
            ← Back to audit
          </Link>
        }
      />

      <div className="space-y-6">
        {/* Controls */}
        <Card>
          <CardHeader title="Scenario" description="Pick a what-if and watch the margin impact update live." />
          <CardBody className="space-y-4">
            <Field label="Type" htmlFor="scn-type">
              <Select id="scn-type" value={type} onChange={(e) => setType(e.target.value as ScenarioType)}>
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            {type === "ingredient-change" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Ingredient" htmlFor="scn-ing">
                  <Select id="scn-ing" value={ingredientName} onChange={(e) => setIngredientName(e.target.value)}>
                    {ingredients.map((ing) => (
                      <option key={ing} value={ing}>
                        {ing}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label={`Price change: ${percentChange > 0 ? "+" : ""}${percentChange}%`} htmlFor="scn-pct">
                  <input
                    id="scn-pct"
                    type="range"
                    min={-50}
                    max={100}
                    step={5}
                    value={percentChange}
                    onChange={(e) => setPercentChange(Number(e.target.value))}
                    className="range-brand mt-3"
                  />
                </Field>
              </div>
            )}

            {type === "price-change" && (
              <Field
                label={`Across-the-board price change: ${priceChangePercent > 0 ? "+" : ""}${priceChangePercent}%`}
                htmlFor="scn-price"
              >
                <input
                  id="scn-price"
                  type="range"
                  min={-25}
                  max={25}
                  step={1}
                  value={priceChangePercent}
                  onChange={(e) => setPriceChangePercent(Number(e.target.value))}
                  className="range-brand mt-3"
                />
              </Field>
            )}

            {type === "menu-change" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Cut these dishes</p>
                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <Checkbox
                        key={`cut-${item.name}`}
                        label={item.name}
                        checked={cutItems.includes(item.name)}
                        disabled={promoteItems.includes(item.name)}
                        onChange={() => toggle(cutItems, setCutItems, item.name)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Promote these dishes</p>
                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <Checkbox
                        key={`promo-${item.name}`}
                        label={item.name}
                        checked={promoteItems.includes(item.name)}
                        disabled={cutItems.includes(item.name)}
                        onChange={() => toggle(promoteItems, setPromoteItems, item.name)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Impact summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat label="Monthly margin now" value={formatCurrency(result.totalOriginalMonthly)} />
          <Stat label="Monthly margin after" value={formatCurrency(result.totalNewMonthly)} />
          <Stat
            label="Monthly impact"
            value={`${impact >= 0 ? "+" : "−"}${formatCurrency(Math.abs(impact))}`}
            tone={impact > 0.5 ? "good" : impact < -0.5 ? "bad" : "default"}
          />
        </div>

        {/* Chart */}
        <Card>
          <CardHeader title="Before vs. after" description="Estimated monthly margin per dish." />
          <CardBody>
            <ScenarioChart perDish={result.perDish} />
          </CardBody>
        </Card>

        {/* Save */}
        <Card>
          <CardHeader title="Save this scenario" description="Keep it on file to revisit during the pitch." />
          <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label="Name" htmlFor="scn-name" className="flex-1">
              <Input
                id="scn-name"
                placeholder={autoName}
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
              />
            </Field>
            <Button onClick={handleSave}>Save scenario</Button>
          </CardBody>
        </Card>

        {/* Saved scenarios */}
        {saved.length > 0 && (
          <Card>
            <CardHeader title="Saved scenarios" />
            <CardBody className="space-y-2">
              {saved.map((sc) => (
                <div
                  key={sc.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink">{sc.name}</div>
                    <Badge tone="neutral">{TYPE_OPTIONS.find((t) => t.value === sc.type)?.label}</Badge>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => loadScenario(sc)}>
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => s.deleteScenario(sc.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex items-center gap-2 text-sm ${disabled ? "text-slate-400" : "text-slate-700"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}

function describeScenario(params: ScenarioParameters): string {
  switch (params.kind) {
    case "ingredient-change":
      return `${params.ingredientName} ${params.percentChange >= 0 ? "+" : ""}${params.percentChange}%`;
    case "price-change":
      return `Prices ${params.priceChangePercent >= 0 ? "+" : ""}${params.priceChangePercent}% across the board`;
    case "menu-change":
      return `Cut ${params.cutItemNames.length} · promote ${params.promoteItemNames.length}`;
  }
}
