"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RecipeList } from "@/components/app/recipes/RecipeList";

export default function RecipesPage() {
  const s = useStore();
  const router = useRouter();

  const createRecipe = () => {
    const r = s.addRecipe({ name: "Untitled recipe", yield: 1, salePrice: null, items: [] });
    router.push(`/app/recipes/${r.id}`);
  };

  return (
    <div>
      <PageHeader
        title="Recipes"
        subtitle="Build a recipe and watch the cost per serving update live."
        action={<Button onClick={createRecipe}>New recipe</Button>}
      />
      {s.recipes.length === 0 ? (
        <EmptyState
          title="No recipes yet"
          description="Create your first recipe to start costing plates and tracking margins."
          action={<Button onClick={createRecipe}>New recipe</Button>}
          icon={<RecipeIcon />}
        />
      ) : (
        <RecipeList recipes={s.recipes} />
      )}
    </div>
  );
}

function RecipeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 4h11l3 3v13H5z" strokeLinejoin="round" />
      <path d="M8 9h8M8 13h8M8 17h5" strokeLinecap="round" />
    </svg>
  );
}
