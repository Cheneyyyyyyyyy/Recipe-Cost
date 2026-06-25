import type { MenuItemInput } from "@/lib/audit";
import type { DishCategory, MenuAnalysisItem } from "@/lib/types";

/** A single editable menu row in the audit builder (price kept as a string). */
export interface DraftRow {
  key: string;
  name: string;
  category: DishCategory;
  price: string;
}

let counter = 0;
function nextKey(): string {
  counter += 1;
  return `row-${counter}`;
}

export function emptyRow(): DraftRow {
  return { key: nextKey(), name: "", category: "burrito/wrap", price: "" };
}

/** Convert draft rows to costing inputs, keeping only complete, valid rows. */
export function rowsToInputs(rows: DraftRow[]): MenuItemInput[] {
  return rows
    .map((r) => ({ name: r.name.trim(), category: r.category, currentPrice: Number(r.price) }))
    .filter((r) => r.name !== "" && Number.isFinite(r.currentPrice) && r.currentPrice > 0);
}

/** Seed editable rows from a saved analysis's items. */
export function itemsToRows(items: MenuAnalysisItem[]): DraftRow[] {
  if (items.length === 0) return [emptyRow()];
  return items.map((it) => ({
    key: nextKey(),
    name: it.name,
    category: it.category,
    price: String(it.currentPrice),
  }));
}
