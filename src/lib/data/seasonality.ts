import type { SeasonalPattern } from "../types";

/**
 * Berkeley academic-calendar demand patterns. Campus traffic dominates demand
 * for student-facing restaurants, so these multipliers (1.0 = baseline) drive
 * the seasonality overlay and recommendations. Short, sharp events (move-in,
 * finals, dead week, spring break) are listed before the broad semesters so the
 * "current period" lookup prefers the more specific window.
 */
export const SEASONAL_PATTERNS: SeasonalPattern[] = [
  {
    period: "move-in",
    label: "Move-in Weekend",
    startMonth: 8,
    endMonth: 8,
    trafficMultiplier: 1.4,
    recommendation:
      "Massive traffic spike — staff up, pre-prep high-volume items, and don't run out of your bestsellers.",
  },
  {
    period: "finals",
    label: "Finals Week",
    startMonth: 5,
    endMonth: 5,
    trafficMultiplier: 1.15,
    recommendation:
      "Late-night traffic spike — extend hours if possible and promote quick-service, caffeine, and comfort items.",
  },
  {
    period: "dead-week",
    label: "Dead Week (RRR Week)",
    startMonth: 4,
    endMonth: 5,
    trafficMultiplier: 1.1,
    recommendation:
      "Students glued to campus studying — promote comfort food, caffeine, and easy grab-and-go.",
  },
  {
    period: "spring-break",
    label: "Spring Break",
    startMonth: 3,
    endMonth: 3,
    trafficMultiplier: 0.7,
    recommendation:
      "Temporary dip as students leave town — reduce prep quantities; a good week to test new menu items.",
  },
  {
    period: "fall-semester",
    label: "Fall Semester",
    startMonth: 8,
    endMonth: 12,
    trafficMultiplier: 1.0,
    recommendation:
      "Peak season — run the full menu and actively promote your highest-margin dishes.",
  },
  {
    period: "spring-semester",
    label: "Spring Semester",
    startMonth: 1,
    endMonth: 5,
    trafficMultiplier: 1.0,
    recommendation:
      "Peak season — run the full menu and actively promote your highest-margin dishes.",
  },
  {
    period: "summer",
    label: "Summer Break",
    startMonth: 6,
    endMonth: 7,
    trafficMultiplier: 0.65,
    recommendation:
      "30–50% drop for student-dependent spots — consider a streamlined menu to cut waste and lean on higher-margin items.",
  },
  {
    period: "winter-break",
    label: "Winter Break",
    startMonth: 12,
    endMonth: 1,
    trafficMultiplier: 0.5,
    recommendation:
      "Lowest-traffic period — minimise perishable inventory and consider reduced hours.",
  },
];

/**
 * The seasonal pattern in effect for a given month (1–12). Prefers the most
 * specific (shortest) matching window so a sub-month event (e.g. finals in May)
 * wins over the broad semester it sits inside. Defaults to the first match.
 */
export function seasonForMonth(month: number): SeasonalPattern {
  const matches = SEASONAL_PATTERNS.filter((p) => monthInRange(month, p.startMonth, p.endMonth));
  if (matches.length === 0) return SEASONAL_PATTERNS[0];
  // Shortest window = most specific.
  return matches.reduce((best, p) =>
    windowLength(p) < windowLength(best) ? p : best
  );
}

function windowLength(p: SeasonalPattern): number {
  return monthInRange(p.startMonth, p.startMonth, p.endMonth) // always true; compute span
    ? spanMonths(p.startMonth, p.endMonth)
    : 12;
}

function spanMonths(start: number, end: number): number {
  return end >= start ? end - start + 1 : 12 - start + end + 1;
}

/** True if `month` falls within [start, end], handling year wrap (e.g. Dec→Jan). */
export function monthInRange(month: number, start: number, end: number): boolean {
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end; // wraps over the year boundary
}
