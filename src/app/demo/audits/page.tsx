import type { Metadata } from "next";
import { AuditHub } from "@/components/app/audit/AuditHub";

export const metadata: Metadata = { title: "Menu audits" };

export default function AuditsPage() {
  return <AuditHub />;
}
