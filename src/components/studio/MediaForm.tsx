"use client";

import { useActionState } from "react";
import type { MediaItemRecord } from "@/lib/types";
import { deleteMediaItemAction, saveMediaItemAction } from "@/server/actions/mediaItems";
import { initialActionState } from "./actionState";
import { DangerZone } from "./DangerZone";
import {
  CheckboxField,
  FormError,
  PublishButtons,
  SelectField,
  TextField,
  TextareaField,
} from "./fields";

export function MediaForm({ item }: { item?: MediaItemRecord }) {
  const [state, formAction, pending] = useActionState(saveMediaItemAction, initialActionState);

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
          label="Publication"
          name="publication"
          help="The outlet's name, e.g. Here Comes The Flood."
          defaultValue={v("publication", item?.publication)}
          errors={state.errors?.publication}
        />

        <TextField
          label="Headline"
          name="headline"
          defaultValue={v("headline", item?.headline)}
          errors={state.errors?.headline}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            label="Type"
            name="mediaType"
            defaultValue={v("mediaType", item?.mediaType) ?? "ARTICLE"}
            errors={state.errors?.mediaType}
            options={[
              { value: "ARTICLE", label: "Article" },
              { value: "INTERVIEW", label: "Interview" },
              { value: "PODCAST", label: "Podcast" },
              { value: "REVIEW", label: "Review" },
              { value: "VIDEO", label: "Video" },
            ]}
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            optional
            defaultValue={v("date", item?.date)}
            errors={state.errors?.date}
          />
        </div>

        <TextField
          label="Link to the article"
          name="articleUrl"
          type="url"
          help="Where visitors read or listen to the piece."
          defaultValue={v("articleUrl", item?.articleUrl)}
          errors={state.errors?.articleUrl}
        />

        <TextField
          label="Image or logo (link)"
          name="imageUrl"
          type="text"
          optional
          help="A full link, or a site path (/images/media/…) for an image hosted with the site. A landscape image, such as a screenshot of the article's page, gets the wider layout. Leave empty and the entry shows as text only."
          defaultValue={v("imageUrl", item?.imageUrl)}
          errors={state.errors?.imageUrl}
        />

        <TextareaField
          label="Short summary"
          name="summary"
          optional
          rows={3}
          help="One or two sentences shown with the link."
          defaultValue={v("summary", item?.summary)}
          errors={state.errors?.summary}
        />

        <CheckboxField
          label="Highlight on the homepage"
          name="featured"
          defaultChecked={checked("featured", item?.featured ?? false)}
        />

        <PublishButtons isPublished={item?.status === "PUBLISHED"} />
        {pending ? <p className="text-xs text-ink-faint">Saving…</p> : null}
      </form>

      {item ? (
        <DangerZone action={deleteMediaItemAction} id={item.id} noun="media item" />
      ) : null}
    </div>
  );
}
