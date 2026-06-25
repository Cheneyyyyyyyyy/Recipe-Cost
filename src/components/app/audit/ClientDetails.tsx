"use client";

import { useStore } from "@/lib/store";
import type { Restaurant } from "@/lib/types";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

/** Editable CRM details for a restaurant: contact, volume, and notes. */
export function ClientDetails({ restaurant }: { restaurant: Restaurant }) {
  const { updateRestaurant } = useStore();

  return (
    <Card>
      <CardHeader title="Client details" description="Contact info and notes for your pitch." />
      <CardBody className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Contact name" htmlFor="c-name">
            <Input
              id="c-name"
              placeholder="e.g. Maria Delgado"
              value={restaurant.contactName ?? ""}
              onChange={(e) => updateRestaurant(restaurant.id, { contactName: e.target.value || null })}
            />
          </Field>
          <Field label="Email" htmlFor="c-email">
            <Input
              id="c-email"
              type="email"
              placeholder="owner@restaurant.com"
              value={restaurant.contactEmail ?? ""}
              onChange={(e) => updateRestaurant(restaurant.id, { contactEmail: e.target.value || null })}
            />
          </Field>
          <Field label="Phone" htmlFor="c-phone">
            <Input
              id="c-phone"
              placeholder="(510) 555-0123"
              value={restaurant.contactPhone ?? ""}
              onChange={(e) => updateRestaurant(restaurant.id, { contactPhone: e.target.value || null })}
            />
          </Field>
        </div>
        <Field label="Plates / day" htmlFor="c-covers" hint="Sharpens monthly impact estimates.">
          <Input
            id="c-covers"
            type="number"
            min="0"
            inputMode="numeric"
            className="sm:max-w-[180px]"
            placeholder="e.g. 180"
            value={restaurant.estimatedDailyCovers ?? ""}
            onChange={(e) => {
              const n = Number(e.target.value);
              updateRestaurant(restaurant.id, {
                estimatedDailyCovers: e.target.value === "" || !Number.isFinite(n) ? undefined : n,
              });
            }}
          />
        </Field>
        <Field label="Notes" htmlFor="c-notes" hint="Last conversation, next step, etc.">
          <Textarea
            id="c-notes"
            rows={3}
            placeholder="Met the owner Tuesday — interested, follow up next week…"
            value={restaurant.notes ?? ""}
            onChange={(e) => updateRestaurant(restaurant.id, { notes: e.target.value || null })}
          />
        </Field>
      </CardBody>
    </Card>
  );
}
