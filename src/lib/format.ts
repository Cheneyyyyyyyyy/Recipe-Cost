import type { Dimension } from "./types";
import { BASE_UNIT } from "./units";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** Format a dollar amount, e.g. 3.2 -> "$3.20". Null/NaN -> "—". */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return currency.format(value);
}

/**
 * Format small per-unit prices with extra precision so fractions of a cent
 * are still visible, e.g. unit cost of $0.008/ml.
 */
export function formatUnitCost(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  const digits = Math.abs(value) > 0 && Math.abs(value) < 0.1 ? 4 : 2;
  return `$${value.toFixed(digits)}`;
}

/** "$0.008 / ml". Pairs a unit cost with the base unit of its dimension. */
export function formatUnitCostPerBase(
  value: number | null | undefined,
  dimension: Dimension
): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${formatUnitCost(value)} / ${BASE_UNIT[dimension]}`;
}

/** Format a percentage, e.g. 30.5 -> "30.5%". */
export function formatPercent(
  value: number | null | undefined,
  digits = 1
): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(digits)}%`;
}
