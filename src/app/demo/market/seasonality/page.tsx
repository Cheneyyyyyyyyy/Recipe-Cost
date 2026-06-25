import type { Metadata } from "next";
import { SeasonalityView } from "@/components/app/market/SeasonalityView";

export const metadata: Metadata = { title: "Seasonality" };

export default function SeasonalityPage() {
  return <SeasonalityView />;
}
