import type { Dimension, Unit } from "./types";

/** All selectable units, grouped by dimension, for building dropdowns. */
export const UNITS: Unit[] = ["g", "kg", "ml", "l", "each"];

/** The dimension each unit belongs to. */
export const UNIT_DIMENSION: Record<Unit, Dimension> = {
  g: "weight",
  kg: "weight",
  ml: "volume",
  l: "volume",
  each: "count",
};

/**
 * Multiplier to convert a unit into its dimension's base unit.
 * Base units: grams (weight), milliliters (volume), each (count).
 *   kg -> g  x1000
 *   l  -> ml x1000
 *   each -> each x1
 */
const TO_BASE_FACTOR: Record<Unit, number> = {
  g: 1,
  kg: 1000,
  ml: 1,
  l: 1000,
  each: 1,
};

/** Human-friendly base unit label per dimension. */
export const BASE_UNIT: Record<Dimension, string> = {
  weight: "g",
  volume: "ml",
  count: "each",
};

export function dimensionOf(unit: Unit): Dimension {
  return UNIT_DIMENSION[unit];
}

export function sameDimension(a: Unit, b: Unit): boolean {
  return UNIT_DIMENSION[a] === UNIT_DIMENSION[b];
}

/** Convert a quantity expressed in `unit` to the base unit of its dimension. */
export function toBaseUnit(quantity: number, unit: Unit): number {
  return quantity * TO_BASE_FACTOR[unit];
}
