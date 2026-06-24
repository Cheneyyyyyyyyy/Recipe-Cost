"use client";

import { useMemo, useState } from "react";
import type { Ingredient, Unit } from "@/lib/types";
import { BASE_UNIT, UNITS, dimensionOf } from "@/lib/units";
import { ingredientUnitCost } from "@/lib/costing";
import { formatUnitCostPerBase } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface IngredientFormProps {
  /** Present => edit mode; absent => add mode. */
  ingredient?: Ingredient;
  onClose: () => void;
}

export function IngredientForm({ ingredient, onClose }: IngredientFormProps) {
  const s = useStore();
  const isEdit = ingredient != null;

  // Number fields live as raw strings so partial input (e.g. "0.") never turns
  // into NaN mid-typing; we parse only when validating and submitting.
  const [name, setName] = useState(ingredient?.name ?? "");
  const [category, setCategory] = useState(ingredient?.category ?? "");
  const [price, setPrice] = useState(ingredient ? String(ingredient.purchasePrice) : "");
  const [qty, setQty] = useState(ingredient ? String(ingredient.purchaseQty) : "");
  const [unit, setUnit] = useState<Unit>(ingredient?.purchaseUnit ?? "g");

  // A field's error is only surfaced once the user has interacted with it.
  const [touched, setTouched] = useState<Record<"name" | "price" | "qty", boolean>>({
    name: false,
    price: false,
    qty: false,
  });

  // Distinct existing categories power the datalist so labels stay consistent.
  const categories = useMemo(
    () =>
      Array.from(new Set(s.ingredients.map((i) => i.category).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [s.ingredients]
  );

  const priceNum = Number(price);
  const qtyNum = Number(qty);

  const errors = {
    name: name.trim() ? null : "Name is required.",
    price:
      price.trim() === ""
        ? "Enter a purchase price."
        : priceNum > 0
          ? null
          : "Price must be greater than 0.",
    qty:
      qty.trim() === ""
        ? "Enter a purchase quantity."
        : qtyNum > 0
          ? null
          : "Quantity must be greater than 0.",
  };
  const isValid = !errors.name && !errors.price && !errors.qty;

  const dimension = dimensionOf(unit);

  // Live unit-cost preview. Guard zero/NaN quantity so the throw path is unreachable.
  const previewCost = useMemo(() => {
    if (price.trim() === "" || !Number.isFinite(priceNum) || !(qtyNum > 0)) return null;
    try {
      return ingredientUnitCost({
        id: "preview",
        name: "",
        category: "",
        purchasePrice: priceNum,
        purchaseQty: qtyNum,
        purchaseUnit: unit,
      });
    } catch {
      return null;
    }
  }, [price, priceNum, qtyNum, unit]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      setTouched({ name: true, price: true, qty: true });
      return;
    }
    const data = {
      name: name.trim(),
      category: category.trim(),
      purchasePrice: priceNum,
      purchaseQty: qtyNum,
      purchaseUnit: unit,
    };
    if (ingredient) {
      s.updateIngredient(ingredient.id, data);
    } else {
      s.addIngredient(data);
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Name" htmlFor="ing-name" error={touched.name ? errors.name : null}>
        <Input
          id="ing-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          invalid={touched.name && !!errors.name}
          placeholder="e.g. Olive Oil"
          autoFocus
        />
      </Field>

      <Field
        label="Category"
        htmlFor="ing-category"
        hint="Reuse an existing label or type a new one."
      >
        <Input
          id="ing-category"
          list="ingredient-categories"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Pantry"
        />
        <datalist id="ingredient-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field
          label="Purchase price"
          htmlFor="ing-price"
          error={touched.price ? errors.price : null}
        >
          <Input
            id="ing-price"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, price: true }))}
            invalid={touched.price && !!errors.price}
            placeholder="24.00"
          />
        </Field>

        <Field label="Purchase qty" htmlFor="ing-qty" error={touched.qty ? errors.qty : null}>
          <Input
            id="ing-qty"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, qty: true }))}
            invalid={touched.qty && !!errors.qty}
            placeholder="3"
          />
        </Field>

        <Field label="Unit" htmlFor="ing-unit">
          <Select id="ing-unit" value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {/* Live derived unit cost — the number this whole tool revolves around. */}
      <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
        <div className="text-xs font-medium uppercase tracking-wide text-brand-700">
          Derived unit cost
        </div>
        <div className="mt-1 text-2xl font-semibold tabular-nums text-brand-700">
          {formatUnitCostPerBase(previewCost, dimension)}
        </div>
        <div className="mt-0.5 text-xs text-slate-500">
          Price ÷ quantity, normalized to one {BASE_UNIT[dimension]}.
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid}>
          {isEdit ? "Save changes" : "Add ingredient"}
        </Button>
      </div>
    </form>
  );
}
