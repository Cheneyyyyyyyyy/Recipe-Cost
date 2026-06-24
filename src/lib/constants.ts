/** Product-level configuration (not part of the pure costing math). */

/** Default target food-cost % used to seed the "suggested price" control. */
export const DEFAULT_TARGET_FOOD_COST = 30;

/**
 * A recipe whose food-cost % is at or above this threshold is flagged as
 * low-margin on the dashboard. 35% is a common industry ceiling — above it
 * there's little room left for labour, overhead, and profit.
 */
export const LOW_MARGIN_FOOD_COST_THRESHOLD = 35;
