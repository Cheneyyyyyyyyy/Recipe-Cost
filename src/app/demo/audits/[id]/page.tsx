import { AuditWorkspace } from "@/components/app/audit/AuditWorkspace";

export default function AuditDetailPage({ params }: { params: { id: string } }) {
  return <AuditWorkspace restaurantId={params.id} />;
}
