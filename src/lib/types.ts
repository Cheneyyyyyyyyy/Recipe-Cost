// Core domain types for Luma. Field names mirror PROJECT_BRIEF.md §4 exactly.

/** Units a user can buy or use an ingredient in. */
export type Unit = "g" | "kg" | "ml" | "l" | "each";

/** Physical dimension a unit belongs to. Units are only interconvertible within a dimension. */
export type Dimension = "weight" | "volume" | "count";

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  purchaseQty: number;
  purchaseUnit: Unit;
}

export interface RecipeItem {
  ingredientId: string;
  quantity: number;
  unit: Unit;
}

export interface Recipe {
  id: string;
  name: string;
  yield: number;
  salePrice: number | null;
  items: RecipeItem[];
  /**
   * Approximate orders per week — demo sales data used only for the
   * menu-engineering quadrant (popularity × margin). Optional; absent/0 for
   * user-created recipes since there's no POS/sales integration in scope.
   */
  popularity?: number;
}
