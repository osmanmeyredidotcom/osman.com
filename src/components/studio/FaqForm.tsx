"use client";

import { useActionState } from "react";
import type { FaqRecord } from "@/lib/types";
import { deleteFaqAction, saveFaqAction } from "@/server/actions/faqs";
import { initialActionState } from "./actionState";
import { DangerZone } from "./DangerZone";
import {
  CheckboxField,
  FormError,
  PublishButtons,
  TextField,
  TextareaField,
} from "./fields";

/**
 * Practical Q&A form (SEO/AI foundation §30). The help texts carry the two
 * rules that matter: answers come only from approved content, and the AI
 * checkbox is a separate, revocable permission for the future assistant.
 */
export function FaqForm({ item }: { item?: FaqRecord }) {
  const [state, formAction, pending] = useActionState(saveFaqAction, initialActionState);

  const v = (name: string, fallback?: string | null): string | undefined =>
    state.values?.[name] ?? fallback ?? undefined;
  const checked = (name: string, fallback: boolean): boolean =>
    state.values ? state.values[name] === "true" : fallback;

  return (
    <div className="max-w-xl">
      <form action={formAction} className="space-y-6">
        {item ? <input type="hidden" name="id" value={item.id} /> : null}
        <FormError errors={state.errors} />

        <TextField
          label="Question"
          name="question"
          help="Word it the way visitors actually ask, e.g. “Can a singer be added?”"
          defaultValue={v("question", item?.question)}
          errors={state.errors?.question}
        />

        <TextareaField
          label="Answer"
          name="answer"
          rows={5}
          help="A sentence or two, using only approved wording — no guesses about prices, availability or equipment."
          defaultValue={v("answer", item?.answer)}
          errors={state.errors?.answer}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Related page (link)"
            name="linkUrl"
            type="text"
            optional
            help="Site path like /services/piano-for-events, or a full link."
            defaultValue={v("linkUrl", item?.linkUrl)}
            errors={state.errors?.linkUrl}
          />
          <TextField
            label="Link label"
            name="linkLabel"
            optional
            help="Text for the link, e.g. “Live Piano”."
            defaultValue={v("linkLabel", item?.linkLabel)}
            errors={state.errors?.linkLabel}
          />
        </div>

        <CheckboxField
          label="Future assistant may use this answer"
          name="aiApproved"
          defaultChecked={checked("aiApproved", item?.aiApproved ?? true)}
        />

        <PublishButtons isPublished={item?.status === "PUBLISHED"} />
        {pending ? <p className="text-xs text-ink-faint">Saving…</p> : null}
      </form>

      {item ? <DangerZone action={deleteFaqAction} id={item.id} noun="Q&A" /> : null}
    </div>
  );
}
