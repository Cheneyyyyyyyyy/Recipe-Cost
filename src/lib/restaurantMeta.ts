import type { RestaurantStatus, RestaurantType } from "./types";

export const RESTAURANT_TYPES: { value: RestaurantType; label: string }[] = [
  { value: "dine-in", label: "Dine-in" },
  { value: "fast-casual", label: "Fast-casual" },
  { value: "food-truck", label: "Food truck" },
  { value: "pop-up", label: "Pop-up" },
  { value: "ghost-kitchen", label: "Ghost kitchen" },
];

export const RESTAURANT_STATUSES: { value: RestaurantStatus; label: string }[] = [
  { value: "prospect", label: "Prospect" },
  { value: "audited", label: "Audited" },
  { value: "pitched", label: "Pitched" },
  { value: "active", label: "Active client" },
  { value: "churned", label: "Churned" },
];

export function typeLabel(type: RestaurantType): string {
  return RESTAURANT_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function statusLabel(status: RestaurantStatus): string {
  return RESTAURANT_STATUSES.find((s) => s.value === status)?.label ?? status;
}

/** Badge tone for a pipeline status. */
export function statusTone(status: RestaurantStatus): "neutral" | "brand" | "good" | "warn" | "bad" {
  switch (status) {
    case "prospect":
      return "neutral";
    case "audited":
      return "brand";
    case "pitched":
      return "warn";
    case "active":
      return "good";
    case "churned":
      return "bad";
  }
}
