import type { Metadata } from "next";
import { NewAuditForm } from "@/components/app/audit/NewAuditForm";

export const metadata: Metadata = { title: "New audit" };

export default function NewAuditPage() {
  return <NewAuditForm />;
}
