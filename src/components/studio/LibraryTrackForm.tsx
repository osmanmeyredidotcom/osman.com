"use client";

import { useActionState } from "react";
import type { LibraryTrackRecord } from "@/lib/types";
import {
  deleteLibraryTrackAction,
  saveLibraryTrackAction,
} from "@/server/actions/libraryTracks";
import { initialActionState } from "./actionState";
import { DangerZone } from "./DangerZone";
import { CheckboxField, FormError, PublishButtons, TextField, TextareaField } from "./fields";

export function LibraryTrackForm({ track }: { track?: LibraryTrackRecord }) {
  const [state, formAction, pending] = useActionState(
    saveLibraryTrackAction,
    initialActionState
  );

  const v = (name: string, fallback?: string | null): string | undefined =>
    state.values?.[name] ?? fallback ?? undefined;
  const checked = (name: string, fallback: boolean): boolean =>
    state.values ? state.values[name] === "true" : fallback;

  return (
    <div className="max-w-xl">
      <form action={formAction} className="space-y-6">
        {track ? <input type="hidden" name="id" value={track.id} /> : null}
        <FormError errors={state.errors} />

        <TextField
          label="Title"
          name="title"
          defaultValue={v("title", track?.title)}
          errors={state.errors?.title}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Genre"
            name="genre"
            optional
            placeholder="e.g. Cinematic, Jazz, Funk"
            defaultValue={v("genre", track?.genre)}
            errors={state.errors?.genre}
          />
          <TextField
            label="Duration (seconds)"
            name="durationSec"
            type="number"
            optional
            placeholder="e.g. 128"
            defaultValue={v(
              "durationSec",
              track?.durationSec != null ? String(track.durationSec) : undefined
            )}
            errors={state.errors?.durationSec}
          />
        </div>

        <TextField
          label="Moods"
          name="moods"
          optional
          help="Comma-separated, e.g. Driving, Nocturnal, Tense."
          defaultValue={v("moods", track?.moods.join(", "))}
          errors={state.errors?.moods}
        />

        <TextField
          label="Good for"
          name="useCases"
          optional
          help="Comma-separated, e.g. Film, Advert, Event opening."
          defaultValue={v("useCases", track?.useCases.join(", "))}
          errors={state.errors?.useCases}
        />

        <TextField
          label="Audio preview (link)"
          name="audioUrl"
          type="text"
          optional
          help="Direct link to an MP3 (host the file anywhere and paste its URL). Without it the row shows “preview to come”. Upload only the public preview version here, not the full master track."
          defaultValue={v("audioUrl", track?.audioUrl)}
          errors={state.errors?.audioUrl}
        />

        <TextareaField
          label="Notes"
          name="description"
          optional
          rows={3}
          defaultValue={v("description", track?.description)}
          errors={state.errors?.description}
        />

        <CheckboxField
          label="Feature this track"
          name="featured"
          help="Featured tracks lead the library page."
          defaultChecked={checked("featured", track?.featured ?? false)}
        />

        <PublishButtons isPublished={track?.status === "PUBLISHED"} />
        {pending ? <p className="text-xs text-ink-faint">Saving…</p> : null}
      </form>

      {track ? (
        <DangerZone action={deleteLibraryTrackAction} id={track.id} noun="track" />
      ) : null}
    </div>
  );
}
