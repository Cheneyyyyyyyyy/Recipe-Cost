"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Ingredient,
  MenuAnalysis,
  MenuAnalysisItem,
  Recipe,
  RecipeItem,
  Restaurant,
  Scenario,
} from "./types";
import { indexIngredients } from "./costing";
import { freshSeedIngredients, freshSeedRecipes } from "./seed";
import { freshSeedAnalyses, freshSeedRestaurants } from "./auditSeed";

const STORAGE_KEY = "luma.v2";

interface PersistShape {
  ingredients: Ingredient[];
  recipes: Recipe[];
  restaurants: Restaurant[];
  menuAnalyses: MenuAnalysis[];
  scenarios: Scenario[];
}

function nowIso(): string {
  return new Date().toISOString();
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

  // ---- V2: restaurants, audits & scenarios ----
  restaurants: Restaurant[];
  menuAnalyses: MenuAnalysis[];
  scenarios: Scenario[];

  getRestaurant(id: string): Restaurant | undefined;
  addRestaurant(data: Omit<Restaurant, "id" | "createdAt">): Restaurant;
  updateRestaurant(id: string, data: Partial<Omit<Restaurant, "id" | "createdAt">>): void;
  /** Deletes the restaurant and any of its analyses + scenarios. */
  deleteRestaurant(id: string): void;

  /** Most recent analysis for a restaurant, if any. */
  getLatestAnalysis(restaurantId: string): MenuAnalysis | undefined;
  getAnalysesForRestaurant(restaurantId: string): MenuAnalysis[];
  /**
   * Replace the latest analysis for a restaurant (or create one). Also advances
   * the restaurant's status to at least "audited".
   */
  saveAnalysis(restaurantId: string, items: MenuAnalysisItem[]): MenuAnalysis;

  getScenariosForRestaurant(restaurantId: string): Scenario[];
  addScenario(data: Omit<Scenario, "id" | "createdAt">): Scenario;
  deleteScenario(id: string): void;

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
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => freshSeedRestaurants());
  const [menuAnalyses, setMenuAnalyses] = useState<MenuAnalysis[]>(() => freshSeedAnalyses());
  const [scenarios, setScenarios] = useState<Scenario[]>(() => []);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistShape>;
        if (Array.isArray(parsed.ingredients) && Array.isArray(parsed.recipes)) {
          setIngredients(parsed.ingredients);
          setRecipes(parsed.recipes);
        }
        if (Array.isArray(parsed.restaurants)) setRestaurants(parsed.restaurants);
        if (Array.isArray(parsed.menuAnalyses)) setMenuAnalyses(parsed.menuAnalyses);
        if (Array.isArray(parsed.scenarios)) setScenarios(parsed.scenarios);
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
      const payload: PersistShape = { ingredients, recipes, restaurants, menuAnalyses, scenarios };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage full / unavailable — non-fatal for an in-memory MVP.
    }
  }, [ingredients, recipes, restaurants, menuAnalyses, scenarios, hydrated]);

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

  // ---- V2: restaurants ----
  const getRestaurant = useCallback(
    (id: string) => restaurants.find((r) => r.id === id),
    [restaurants]
  );

  const addRestaurant = useCallback((data: Omit<Restaurant, "id" | "createdAt">) => {
    const created: Restaurant = { ...data, id: newId("rest"), createdAt: nowIso() };
    setRestaurants((prev) => [...prev, created]);
    return created;
  }, []);

  const updateRestaurant = useCallback(
    (id: string, data: Partial<Omit<Restaurant, "id" | "createdAt">>) => {
      setRestaurants((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    },
    []
  );

  const deleteRestaurant = useCallback((id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    setMenuAnalyses((prev) => prev.filter((a) => a.restaurantId !== id));
    setScenarios((prev) => prev.filter((s) => s.restaurantId !== id));
  }, []);

  // ---- V2: analyses ----
  const getAnalysesForRestaurant = useCallback(
    (restaurantId: string) =>
      menuAnalyses
        .filter((a) => a.restaurantId === restaurantId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [menuAnalyses]
  );

  const getLatestAnalysis = useCallback(
    (restaurantId: string) => getAnalysesForRestaurant(restaurantId)[0],
    [getAnalysesForRestaurant]
  );

  const saveAnalysis = useCallback(
    (restaurantId: string, items: MenuAnalysisItem[]) => {
      const existing = menuAnalyses
        .filter((a) => a.restaurantId === restaurantId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

      let saved: MenuAnalysis;
      if (existing) {
        saved = { ...existing, items, createdAt: nowIso() };
        setMenuAnalyses((prev) => prev.map((a) => (a.id === existing.id ? saved : a)));
      } else {
        saved = {
          id: newId("analysis"),
          restaurantId,
          items,
          createdAt: nowIso(),
        };
        setMenuAnalyses((prev) => [...prev, saved]);
      }

      // Advance status: a prospect becomes "audited" once analysed.
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === restaurantId && r.status === "prospect"
            ? { ...r, status: "audited" }
            : r
        )
      );
      return saved;
    },
    [menuAnalyses]
  );

  // ---- V2: scenarios ----
  const getScenariosForRestaurant = useCallback(
    (restaurantId: string) =>
      scenarios
        .filter((s) => s.restaurantId === restaurantId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [scenarios]
  );

  const addScenario = useCallback((data: Omit<Scenario, "id" | "createdAt">) => {
    const created: Scenario = { ...data, id: newId("scn"), createdAt: nowIso() };
    setScenarios((prev) => [...prev, created]);
    return created;
  }, []);

  const deleteScenario = useCallback((id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const resetToSeed = useCallback(() => {
    setIngredients(freshSeedIngredients());
    setRecipes(freshSeedRecipes());
    setRestaurants(freshSeedRestaurants());
    setMenuAnalyses(freshSeedAnalyses());
    setScenarios([]);
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
      restaurants,
      menuAnalyses,
      scenarios,
      getRestaurant,
      addRestaurant,
      updateRestaurant,
      deleteRestaurant,
      getLatestAnalysis,
      getAnalysesForRestaurant,
      saveAnalysis,
      getScenariosForRestaurant,
      addScenario,
      deleteScenario,
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
      restaurants,
      menuAnalyses,
      scenarios,
      getRestaurant,
      addRestaurant,
      updateRestaurant,
      deleteRestaurant,
      getLatestAnalysis,
      getAnalysesForRestaurant,
      saveAnalysis,
      getScenariosForRestaurant,
      addScenario,
      deleteScenario,
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
