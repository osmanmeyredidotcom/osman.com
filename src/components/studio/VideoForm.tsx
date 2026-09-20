"use client";

import { useActionState, useState } from "react";
import type { LiveVideoRecord } from "@/lib/types";
import { deleteVideoAction, saveVideoAction } from "@/server/actions/videos";
import { vimeoId, youtubeId } from "@/lib/embed";
import { initialActionState } from "./actionState";
import { DangerZone } from "./DangerZone";
import {
  CheckboxField,
  FieldError,
  FormError,
  Help,
  Label,
  PublishButtons,
  TextField,
  TextareaField,
  describedBy,
  inputClass,
} from "./fields";

export function VideoForm({ video }: { video?: LiveVideoRecord }) {
  const [state, formAction, pending] = useActionState(saveVideoAction, initialActionState);

  const v = (name: string, fallback?: string | null): string | undefined =>
    state.values?.[name] ?? fallback ?? undefined;
  const checked = (name: string, fallback: boolean): boolean =>
    state.values ? state.values[name] === "true" : fallback;

  const [platform, setPlatform] = useState<"youtube" | "vimeo" | "file">(() => {
    const submitted = state.values?.platform;
    if (submitted === "youtube" || submitted === "vimeo" || submitted === "file") {
      return submitted;
    }
    return video?.platform ?? "youtube";
  });

  function detectPlatform(url: string) {
    if (youtubeId(url)) setPlatform("youtube");
    else if (vimeoId(url)) setPlatform("vimeo");
    else if (url.startsWith("/")) setPlatform("file");
  }

  const urlHelp = "Paste the full YouTube or Vimeo link, or a site path (/videos/…) for a self-hosted file.";
  const urlErrors = state.errors?.videoUrl;

  return (
    <div className="max-w-xl">
      <form action={formAction} className="space-y-6">
        {video ? <input type="hidden" name="id" value={video.id} /> : null}
        <FormError errors={state.errors} />

        <TextField
          label="Title"
          name="title"
          defaultValue={v("title", video?.title)}
          errors={state.errors?.title}
        />

        <div className="space-y-1.5">
          <Label htmlFor="videoUrl">Video link</Label>
          <input
            id="videoUrl"
            name="videoUrl"
            type="text"
            inputMode="url"
            defaultValue={v("videoUrl", video?.videoUrl)}
            onChange={(e) => detectPlatform(e.target.value)}
            aria-invalid={urlErrors && urlErrors.length > 0 ? true : undefined}
            aria-describedby={describedBy("videoUrl", urlHelp, urlErrors)}
            className={inputClass}
          />
          <Help name="videoUrl">{urlHelp}</Help>
          <FieldError name="videoUrl" errors={urlErrors} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="platform">Platform</Label>
          <select
            id="platform"
            name="platform"
            value={platform}
            onChange={(e) =>
              setPlatform(
                e.target.value === "vimeo" ? "vimeo" : e.target.value === "file" ? "file" : "youtube"
              )
            }
            aria-describedby="platform-help"
            className={inputClass}
          >
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="file">Self-hosted file</option>
          </select>
          <Help name="platform">Picked automatically from the link. You rarely need to change this.</Help>
        </div>

        <TextareaField
          label="Description"
          name="description"
          optional
          rows={3}
          defaultValue={v("description", video?.description)}
          errors={state.errors?.description}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Venue"
            name="venue"
            optional
            defaultValue={v("venue", video?.venue)}
            errors={state.errors?.venue}
          />
          <TextField
            label="Year"
            name="year"
            type="number"
            optional
            placeholder="e.g. 2025"
            defaultValue={v("year", video?.year != null ? String(video.year) : undefined)}
            errors={state.errors?.year}
          />
        </div>

        <TextField
          label="Performance date"
          name="performanceDate"
          type="date"
          optional
          defaultValue={v("performanceDate", video?.performanceDate)}
          errors={state.errors?.performanceDate}
        />

        <TextField
          label="Tags"
          name="tags"
          optional
          help="Comma separated, e.g. live, trio, double bass."
          defaultValue={v("tags", video?.tags.join(", "))}
          errors={state.errors?.tags}
        />

        <TextField
          label="Thumbnail (link)"
          name="thumbnailUrl"
          type="url"
          optional
          help="Leave empty to use the video's own preview image."
          defaultValue={v("thumbnailUrl", video?.thumbnailUrl)}
          errors={state.errors?.thumbnailUrl}
        />

        <CheckboxField
          label="Highlight on the homepage"
          name="featured"
          defaultChecked={checked("featured", video?.featured ?? false)}
        />

        <PublishButtons isPublished={video?.status === "PUBLISHED"} />
        {pending ? <p className="text-xs text-ink-faint">Saving…</p> : null}
      </form>

      {video ? <DangerZone action={deleteVideoAction} id={video.id} noun="video" /> : null}
    </div>
  );
}
