"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Ingredient, Recipe, RecipeItem } from "./types";
import { indexIngredients } from "./costing";
import { freshSeedIngredients, freshSeedRecipes } from "./seed";

const STORAGE_KEY = "luma.v1";

interface PersistShape {
  ingredients: Ingredient[];
  recipes: Recipe[];
}

export interface StoreValue {
  ingredients: Ingredient[];
  recipes: Recipe[];
  /** Live map for the costing engine; rebuilt whenever ingredients change. */
  ingredientsById: Map<string, Ingredient>;

  // Lookups
  getIngredient(id: string): Ingredient | undefined;
  getRecipe(id: string): Recipe | undefined;
  /** True if any recipe still references this ingredient. */
  isIngredientUsed(id: string): boolean;

  // Ingredient CRUD
  addIngredient(data: Omit<Ingredient, "id">): Ingredient;
  updateIngredient(id: string, data: Partial<Omit<Ingredient, "id">>): void;
  deleteIngredient(id: string): void;

  // Recipe CRUD
  addRecipe(data: Omit<Recipe, "id">): Recipe;
  updateRecipe(id: string, data: Partial<Omit<Recipe, "id">>): void;
  deleteRecipe(id: string): void;

  // Recipe line items
  addRecipeItem(recipeId: string, item: RecipeItem): void;
  updateRecipeItem(recipeId: string, index: number, patch: Partial<RecipeItem>): void;
  removeRecipeItem(recipeId: string, index: number): void;

  /** Restore the original seeded demo data. */
  resetToSeed(): void;
  /** False until localStorage has been read on the client (avoids hydration flashes). */
  hydrated: boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

function newId(prefix: string): string {
  // crypto.randomUUID is available in all modern browsers + Node 18+.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.abs(Math.floor(Math.random() * 1e9)).toString(36)}`;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => freshSeedIngredients());
  const [recipes, setRecipes] = useState<Recipe[]>(() => freshSeedRecipes());
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistShape;
        if (Array.isArray(parsed.ingredients) && Array.isArray(parsed.recipes)) {
          setIngredients(parsed.ingredients);
          setRecipes(parsed.recipes);
        }
      }
    } catch {
      // Corrupt storage — fall back to the in-memory seed already in state.
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after initial hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistShape = { ingredients, recipes };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage full / unavailable — non-fatal for an in-memory MVP.
    }
  }, [ingredients, recipes, hydrated]);

  const ingredientsById = useMemo(() => indexIngredients(ingredients), [ingredients]);

  const getIngredient = useCallback(
    (id: string) => ingredientsById.get(id),
    [ingredientsById]
  );
  const getRecipe = useCallback(
    (id: string) => recipes.find((r) => r.id === id),
    [recipes]
  );
  const isIngredientUsed = useCallback(
    (id: string) => recipes.some((r) => r.items.some((it) => it.ingredientId === id)),
    [recipes]
  );

  const addIngredient = useCallback((data: Omit<Ingredient, "id">) => {
    const created: Ingredient = { ...data, id: newId("ing") };
    setIngredients((prev) => [...prev, created]);
    return created;
  }, []);

  const updateIngredient = useCallback(
    (id: string, data: Partial<Omit<Ingredient, "id">>) => {
      setIngredients((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...data } : i))
      );
    },
    []
  );

  const deleteIngredient = useCallback((id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    // Intentionally leave dangling references in recipes; the costing engine
    // surfaces them as "ingredient was deleted" rather than silently dropping
    // line items, which matches the spec's edge-case requirement.
  }, []);

  const addRecipe = useCallback((data: Omit<Recipe, "id">) => {
    const created: Recipe = { ...data, id: newId("rec") };
    setRecipes((prev) => [...prev, created]);
    return created;
  }, []);

  const updateRecipe = useCallback(
    (id: string, data: Partial<Omit<Recipe, "id">>) => {
      setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    },
    []
  );

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addRecipeItem = useCallback((recipeId: string, item: RecipeItem) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === recipeId ? { ...r, items: [...r.items, item] } : r))
    );
  }, []);

  const updateRecipeItem = useCallback(
    (recipeId: string, index: number, patch: Partial<RecipeItem>) => {
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId
            ? {
                ...r,
                items: r.items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
              }
            : r
        )
      );
    },
    []
  );

  const removeRecipeItem = useCallback((recipeId: string, index: number) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipeId ? { ...r, items: r.items.filter((_, i) => i !== index) } : r
      )
    );
  }, []);

  const resetToSeed = useCallback(() => {
    setIngredients(freshSeedIngredients());
    setRecipes(freshSeedRecipes());
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ingredients,
      recipes,
      ingredientsById,
      getIngredient,
      getRecipe,
      isIngredientUsed,
      addIngredient,
      updateIngredient,
      deleteIngredient,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      addRecipeItem,
      updateRecipeItem,
      removeRecipeItem,
      resetToSeed,
      hydrated,
    }),
    [
      ingredients,
      recipes,
      ingredientsById,
      getIngredient,
      getRecipe,
      isIngredientUsed,
      addIngredient,
      updateIngredient,
      deleteIngredient,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      addRecipeItem,
      updateRecipeItem,
      removeRecipeItem,
      resetToSeed,
      hydrated,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a <StoreProvider>.");
  }
  return ctx;
}
