"use client";

import { useActionState } from "react";
import type { ServiceRecord } from "@/lib/types";
import { saveServiceAction } from "@/server/actions/services";
import { initialActionState } from "./actionState";
import {
  CheckboxField,
  FormError,
  SavedNotice,
  TextField,
  TextareaField,
  primaryButtonClass,
} from "./fields";

export function ServiceForm({ service }: { service: ServiceRecord }) {
  const [state, formAction, pending] = useActionState(saveServiceAction, initialActionState);

  const v = (name: string, fallback?: string | null): string | undefined =>
    state.values?.[name] ?? fallback ?? undefined;

  return (
    <div className="max-w-xl">
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="id" value={service.id} />
        <FormError errors={state.errors} />
        <SavedNotice show={state.ok} />

        <TextField
          label="Title"
          name="title"
          defaultValue={v("title", service.title)}
          errors={state.errors?.title}
        />

        <TextareaField
          label="Short description"
          name="shortDescription"
          rows={3}
          help="Shown in overviews, one or two sentences."
          defaultValue={v("shortDescription", service.shortDescription)}
          errors={state.errors?.shortDescription}
        />

        <TextareaField
          label="Main text"
          name="body"
          rows={12}
          help="Separate paragraphs with a blank line."
          defaultValue={v("body", service.body)}
          errors={state.errors?.body}
        />

        <TextField
          label="Image (link)"
          name="imageUrl"
          type="url"
          optional
          help="Leave empty to use a neutral placeholder."
          defaultValue={v("imageUrl", service.imageUrl)}
          errors={state.errors?.imageUrl}
        />

        <CheckboxField
          label="Shown on the site"
          name="published"
          help="Untick to hide this page temporarily."
          defaultChecked={
            state.values ? state.values.published === "true" : service.status === "PUBLISHED"
          }
        />

        <div className="border-t border-line pt-6">
          <button type="submit" disabled={pending} className={primaryButtonClass}>
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
