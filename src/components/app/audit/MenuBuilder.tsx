"use client";

import { DISH_CATEGORIES } from "@/lib/data/dishTemplates";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { type DraftRow, emptyRow } from "./draft";

/** Editable table of menu rows: dish name, category, current price. */
export function MenuBuilder({
  rows,
  onChange,
}: {
  rows: DraftRow[];
  onChange: (rows: DraftRow[]) => void;
}) {
  const update = (key: string, patch: Partial<DraftRow>) =>
    onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const remove = (key: string) => onChange(rows.filter((r) => r.key !== key));
  const add = () => onChange([...rows, emptyRow()]);

  return (
    <Card>
      <CardHeader
        title="Menu items"
        description="Type each dish, pick a category, and enter its current menu price."
        action={
          <Button size="sm" variant="secondary" onClick={add}>
            + Add item
          </Button>
        }
      />
      <CardBody className="space-y-3">
        {/* Column labels (sm+) */}
        <div className="hidden gap-3 px-1 text-xs font-medium uppercase tracking-wide text-slate-500 sm:grid sm:grid-cols-[1fr_180px_110px_auto]">
          <span>Dish name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="sr-only">Remove</span>
        </div>

        {rows.map((row, i) => (
          <div
            key={row.key}
            className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_110px_auto] sm:items-center"
          >
            <Input
              aria-label={`Dish name ${i + 1}`}
              placeholder="e.g. Chicken Burrito"
              value={row.name}
              onChange={(e) => update(row.key, { name: e.target.value })}
            />
            <Select
              aria-label={`Category ${i + 1}`}
              value={row.category}
              onChange={(e) => update(row.key, { category: e.target.value as DraftRow["category"] })}
            >
              {DISH_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                $
              </span>
              <Input
                aria-label={`Price ${i + 1}`}
                type="number"
                min="0"
                step="0.25"
                inputMode="decimal"
                placeholder="0.00"
                className="pl-6"
                value={row.price}
                onChange={(e) => update(row.key, { price: e.target.value })}
              />
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="justify-self-start text-slate-500 hover:text-red-600 sm:justify-self-auto"
              onClick={() => remove(row.key)}
              disabled={rows.length === 1}
              aria-label={`Remove item ${i + 1}`}
            >
              Remove
            </Button>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
