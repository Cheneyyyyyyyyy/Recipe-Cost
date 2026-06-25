/** Product-level configuration (not part of the pure costing math). */

/** Default target food-cost % used to seed the "suggested price" control. */
export const DEFAULT_TARGET_FOOD_COST = 30;

/**
 * A recipe whose food-cost % is at or above this threshold is flagged as
 * low-margin on the dashboard. 35% is a common industry ceiling — above it
 * there's little room left for labour, overhead, and profit.
 */
export const LOW_MARGIN_FOOD_COST_THRESHOLD = 35;

// --------------------------------------------------------------------------
// V2 — Menu audit thresholds.
// --------------------------------------------------------------------------

/**
 * A dish whose estimated food cost is ABOVE this % is flagged "underwater" —
 * likely losing money once labour and overhead are added.
 */
export const AUDIT_UNDERWATER_THRESHOLD = 35;

/**
 * A dish whose estimated food cost is BELOW this % has pricing headroom — it's
 * cheap to make relative to its price (the "could charge more / promote me"
 * bucket). Flagged "overpriced" only when its price also sits above corridor.
 */
export const AUDIT_HEADROOM_THRESHOLD = 25;

/**
 * Target food-cost % the audit prices dishes toward when recommending a raise.
 * Mirrors DEFAULT_TARGET_FOOD_COST but named for the audit's intent.
 */
export const AUDIT_TARGET_FOOD_COST = 30;

/**
 * Default assumed plates/day per dish when a restaurant has no covers estimate,
 * used only for the "~$X/month left on the table" headline figure.
 */
export const DEFAULT_DISH_DAILY_VOLUME = 8;

/** Days/month used for monthly-impact projections. */
export const DAYS_PER_MONTH = 30;
