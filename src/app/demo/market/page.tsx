import type { Metadata } from "next";
import { CompetitorBrowser } from "@/components/app/market/CompetitorBrowser";

export const metadata: Metadata = { title: "Market intelligence" };

export default function MarketPage() {
  return <CompetitorBrowser />;
}
