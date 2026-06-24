import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Luma — Recipe costing & menu margins",
    template: "%s · Luma",
  },
  description:
    "Luma turns recipes and ingredient prices into instant per-plate cost, food-cost %, and margin — and suggests a price for any target food-cost %.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
