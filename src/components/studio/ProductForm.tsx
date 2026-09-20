"use client";

import { useActionState } from "react";
import type { ProductRecord } from "@/lib/types";
import { deleteProductAction, saveProductAction } from "@/server/actions/products";
import { initialActionState } from "./actionState";
import { DangerZone } from "./DangerZone";
import {
  CheckboxField,
  FormError,
  SelectField,
  TextField,
  TextareaField,
  primaryButtonClass,
} from "./fields";

export function ProductForm({ product }: { product?: ProductRecord }) {
  const [state, formAction, pending] = useActionState(saveProductAction, initialActionState);

  const v = (name: string, fallback?: string | null): string | undefined =>
    state.values?.[name] ?? fallback ?? undefined;
  const checked = (name: string, fallback: boolean): boolean =>
    state.values ? state.values[name] === "true" : fallback;

  return (
    <div className="max-w-xl">
      <form action={formAction} className="space-y-6">
        {product ? <input type="hidden" name="id" value={product.id} /> : null}
        <FormError errors={state.errors} />

        <TextField
          label="Title"
          name="title"
          defaultValue={v("title", product?.title)}
          errors={state.errors?.title}
        />

        <TextareaField
          label="Description"
          name="description"
          rows={4}
          defaultValue={v("description", product?.description)}
          errors={state.errors?.description}
        />

        <TextField
          label="Category"
          name="category"
          help="e.g. Music, Merchandise, Lessons."
          defaultValue={v("category", product?.category)}
          errors={state.errors?.category}
        />

        <TextField
          label="Image (link)"
          name="imageUrl"
          type="url"
          optional
          help="Leave empty to use a neutral placeholder."
          defaultValue={v("imageUrl", product?.imageUrl)}
          errors={state.errors?.imageUrl}
        />

        <SelectField
          label="Status"
          name="status"
          help="Concepts are shown as ideas; Available items appear for sale when the shop is live."
          defaultValue={v("status", product?.status) ?? "CONCEPT"}
          errors={state.errors?.status}
          options={[
            { value: "CONCEPT", label: "Concept" },
            { value: "AVAILABLE", label: "Available" },
            { value: "ARCHIVED", label: "Archived" },
          ]}
        />

        <TextField
          label="Price"
          name="priceText"
          optional
          placeholder="e.g. € 25,00"
          help="Shown only when the shop is live."
          defaultValue={v("priceText", product?.priceText)}
          errors={state.errors?.priceText}
        />

        <TextField
          label="External link"
          name="externalUrl"
          type="url"
          optional
          help="Where to buy, e.g. a Shopify or Bandcamp product page."
          defaultValue={v("externalUrl", product?.externalUrl)}
          errors={state.errors?.externalUrl}
        />

        <CheckboxField
          label="Highlight in the shop"
          name="featured"
          defaultChecked={checked("featured", product?.featured ?? false)}
        />

        <div className="border-t border-line pt-6">
          <button type="submit" disabled={pending} className={primaryButtonClass}>
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>

      {product ? (
        <DangerZone action={deleteProductAction} id={product.id} noun="shop item" />
      ) : null}
    </div>
  );
}
