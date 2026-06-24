"use client";

import { useMemo, useState } from "react";
import type { Ingredient } from "@/lib/types";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { IngredientTable } from "@/components/app/ingredients/IngredientTable";
import { IngredientForm } from "@/components/app/ingredients/IngredientForm";

export function IngredientsView() {
  const s = useStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);

  // Distinct categories drive the filter dropdown.
  const categories = useMemo(
    () =>
      Array.from(new Set(s.ingredients.map((i) => i.category).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [s.ingredients]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return s.ingredients.filter((i) => {
      const matchesName = q === "" || i.name.toLowerCase().includes(q);
      const matchesCategory = category === "all" || i.category === category;
      return matchesName && matchesCategory;
    });
  }, [s.ingredients, search, category]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(ingredient: Ingredient) {
    setEditing(ingredient);
    setFormOpen(true);
  }
  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }
  function handleDelete(ingredient: Ingredient) {
    const message = s.isIngredientUsed(ingredient.id)
      ? `"${ingredient.name}" is used by one or more recipes. Deleting it will leave those recipes showing a "deleted ingredient" flag. Delete it anyway?`
      : `Delete "${ingredient.name}"? This can't be undone.`;
    if (window.confirm(message)) {
      s.deleteIngredient(ingredient.id);
    }
  }

  const hasIngredients = s.ingredients.length > 0;

  return (
    <div>
      <PageHeader
        title="Ingredients"
        subtitle="Your purchasing prices, converted to a live per-unit cost."
        action={<Button onClick={openAdd}>Add ingredient</Button>}
      />

      {!hasIngredients ? (
        <EmptyState
          title="No ingredients yet"
          description="Add your first ingredient to start building costed recipes."
          action={<Button onClick={openAdd}>Add ingredient</Button>}
          icon={<BoxIcon />}
        />
      ) : (
        <Card>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
            <div className="relative sm:max-w-xs sm:flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Search ingredients…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search ingredients"
              />
            </div>
            <div className="sm:w-56">
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div className="text-sm tabular-nums text-slate-500 sm:ml-auto">
              {filtered.length} of {s.ingredients.length}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <h3 className="text-sm font-semibold text-ink">No matching ingredients</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Nothing matches your search or category filter. Try broadening it.
              </p>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          ) : (
            <IngredientTable ingredients={filtered} onEdit={openEdit} onDelete={handleDelete} />
          )}
        </Card>
      )}

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? "Edit ingredient" : "Add ingredient"}
        description={
          editing
            ? "Update purchasing details; the unit cost recalculates instantly."
            : "Enter what you pay and how much you get — Luma derives the unit cost."
        }
      >
        {/* key forces a fresh form state when switching between add and edit. */}
        <IngredientForm
          key={editing?.id ?? "new"}
          ingredient={editing ?? undefined}
          onClose={closeForm}
        />
      </Modal>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6" />
      <path d="m17 17-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path d="M21 8 12 3 3 8l9 5 9-5Z" strokeLinejoin="round" />
      <path d="M3 8v8l9 5 9-5V8" strokeLinejoin="round" />
      <path d="M12 13v8" />
    </svg>
  );
}
