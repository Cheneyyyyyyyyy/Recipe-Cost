import type { Metadata } from "next";
import { ClientPipeline } from "@/components/app/clients/ClientPipeline";

export const metadata: Metadata = { title: "Client pipeline" };

export default function ClientsPage() {
  return <ClientPipeline />;
}
