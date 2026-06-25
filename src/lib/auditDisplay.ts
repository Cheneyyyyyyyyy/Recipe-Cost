import type { AuditFlag } from "./types";

/** Badge tone + label for a dish audit flag. Shared by the UI and the report. */
export function flagDisplay(flag: AuditFlag): {
  tone: "good" | "warn" | "bad" | "neutral";
  label: string;
  symbol: string;
} {
  switch (flag) {
    case "underwater":
      return { tone: "bad", label: "High cost", symbol: "⚠" };
    case "overpriced":
      return { tone: "warn", label: "Priced high", symbol: "↑" };
    case "healthy":
      return { tone: "good", label: "Healthy", symbol: "✓" };
    default:
      return { tone: "neutral", label: "—", symbol: "" };
  }
}

/** Stat tone for a food-cost % value (matches the audit thresholds). */
export function foodCostTone(pct: number): "good" | "warn" | "bad" {
  if (pct > 35) return "bad";
  if (pct >= 30) return "warn";
  return "good";
}
