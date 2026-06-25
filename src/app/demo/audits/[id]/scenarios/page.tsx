import { ScenarioModeler } from "@/components/app/audit/ScenarioModeler";

export default function ScenariosPage({ params }: { params: { id: string } }) {
  return <ScenarioModeler restaurantId={params.id} />;
}
