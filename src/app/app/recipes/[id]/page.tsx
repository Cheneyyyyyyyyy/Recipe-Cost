"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RecipeBuilder } from "@/components/app/recipes/RecipeBuilder";

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const recipe = s.getRecipe(id);

  if (!recipe) {
    // Avoid flashing "not found" before localStorage hydrates a user-created recipe.
    if (!s.hydrated) {
      return <div className="h-40" aria-hidden="true" />;
    }
    return (
      <EmptyState
        title="Recipe not found"
        description="This recipe may have been deleted, or the link is incorrect."
        action={
          <Link href="/app/recipes">
            <Button>Back to recipes</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/app/recipes"
          className="text-sm font-medium text-slate-500 hover:text-ink"
        >
          ← Back to recipes
        </Link>
      </div>
      <RecipeBuilder recipe={recipe} />
    </div>
  );
}
