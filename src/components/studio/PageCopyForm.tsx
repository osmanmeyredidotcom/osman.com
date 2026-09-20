"use client";

import { useActionState } from "react";
import { savePageCopyAction } from "@/server/actions/pageCopy";
import { initialActionState } from "./actionState";
import { FormError, SavedNotice, TextField, TextareaField, primaryButtonClass } from "./fields";
import type { CopyField } from "@/data/page-copy";

/**
 * One "Pages" editor (content-governance pass): every field shows the text
 * the public page currently renders. Saving text identical to the approved
 * default simply clears the override, so nothing is duplicated and the
 * default can be restored by re-typing it (or emptying the field).
 */
export function PageCopyForm({
  pageId,
  fields,
  stored,
}: {
  pageId: string;
  fields: CopyField[];
  stored: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(savePageCopyAction, initialActionState);

  const current = (f: CopyField): string =>
    state.values?.[f.key] ?? (stored[`${pageId}.${f.key}`] || f.default);

  return (
    <form action={formAction} className="max-w-2xl space-y-7">
      <input type="hidden" name="__page" value={pageId} />
      <FormError errors={state.errors} />
      <SavedNotice show={state.ok} message="Saved. The public page shows this text now." />
      {fields.map((f) =>
        f.kind === "long" ? (
          <TextareaField
            key={f.key}
            name={f.key}
            label={f.label}
            defaultValue={current(f)}
            rows={Math.min(10, Math.max(3, Math.ceil(current(f).length / 90) + 1))}
            help={f.help ?? "Leave a blank line between paragraphs. Links: [text](/page)."}
            errors={state.errors?.[f.key]}
          />
        ) : (
          <TextField
            key={f.key}
            name={f.key}
            label={f.label}
            defaultValue={current(f)}
            help={
              f.help ??
              (f.kind === "image" || f.kind === "url"
                ? "A site path starting with / or a full https:// address."
                : undefined)
            }
            errors={state.errors?.[f.key]}
          />
        )
      )}
      <div className="pt-2">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
