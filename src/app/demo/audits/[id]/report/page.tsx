import { AuditReport } from "@/components/app/audit/AuditReport";

export default function AuditReportPage({ params }: { params: { id: string } }) {
  return <AuditReport restaurantId={params.id} />;
}
