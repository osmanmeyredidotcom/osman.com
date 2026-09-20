"use client";

import { useActionState, useState } from "react";
import type { CollaborationRecord, RelationshipType, ReleaseRecord } from "@/lib/types";
import { deleteReleaseAction, saveReleaseAction } from "@/server/actions/releases";
import { relationshipPublicLabels } from "./labels";
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

/**
 * Release editor — precision pack 03 §5–§8. The FIRST question is the
 * relationship to Osman, because it decides everything downstream: which
 * fields are required, how the release is billed publicly, and which
 * category label visitors see. Non-own releases show a live billing summary
 * with a required confirmation before publishing (§14) — a final factual
 * check, not a scary modal.
 */
const RELATIONSHIP_TILES: Array<{
  value: RelationshipType;
  title: string;
  help: string;
}> = [
  {
    value: "OWN_RELEASE",
    title: "Osman's own release",
    help: "Osman is the primary artist. Shown at the top of the Music page.",
  },
  {
    value: "CONTRIBUTING_ARTIST",
    title: "Osman appears on this release",
    help: "Another artist's record with Osman in a credited role.",
  },
  {
    value: "COLLABORATION_RELEASE",
    title: "Collaboration / band project",
    help: "A record by a band or project Osman is part of, e.g. ZAPPATiKA.",
  },
];

export function ReleaseForm({
  release,
  collaborations = [],
}: {
  release?: ReleaseRecord;
  collaborations?: CollaborationRecord[];
}) {
  const [state, formAction, pending] = useActionState(saveReleaseAction, initialActionState);

  const v = (name: string, fallback?: string | null): string | undefined =>
    state.values?.[name] ?? fallback ?? undefined;
  const checked = (name: string, fallback: boolean): boolean =>
    state.values ? state.values[name] === "true" : fallback;

  const [relationship, setRelationship] = useState<RelationshipType>(() => {
    const submitted = state.values?.relationshipType as RelationshipType | undefined;
    if (
      submitted === "OWN_RELEASE" ||
      submitted === "CONTRIBUTING_ARTIST" ||
      submitted === "COLLABORATION_RELEASE"
    ) {
      return submitted;
    }
    return release?.relationshipType ?? "OWN_RELEASE";
  });
  const nonOwn = relationship !== "OWN_RELEASE";

  // Live billing preview for the confirmation panel.
  const [primaryArtist, setPrimaryArtist] = useState(
    v("primaryArtistName", release?.primaryArtistName) ?? ""
  );
  const [osmanRole, setOsmanRole] = useState(v("osmanCredit", release?.osmanCredit) ?? "");
  const [title, setTitle] = useState(v("title", release?.title) ?? "");

  return (
    <div className="max-w-xl">
      <form action={formAction} className="space-y-6">
        {release ? <input type="hidden" name="id" value={release.id} /> : null}
        <FormError errors={state.errors} />

        <fieldset>
          <legend className="text-sm font-medium text-ink">Relationship to Osman</legend>
          <p className="mt-1 text-xs leading-relaxed text-ink-faint">
            This decides how the release is billed on the site. It can never appear as an
            Osman Meyredi solo release unless it is one.
          </p>
          <div className="mt-2 grid gap-3">
            {RELATIONSHIP_TILES.map((tile) => (
              <label
                key={tile.value}
                className={`cursor-pointer rounded-md border p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                  relationship === tile.value
                    ? "border-accent bg-accent/5"
                    : "border-line hover:border-ink-faint"
                }`}
              >
                <input
                  type="radio"
                  name="relationshipType"
                  value={tile.value}
                  checked={relationship === tile.value}
                  onChange={() => setRelationship(tile.value)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold text-ink">{tile.title}</span>
                <span className="mt-1 block text-xs text-ink-soft">{tile.help}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {nonOwn && (
          <div className="space-y-4 rounded-md border border-line p-4">
            <TextField
              label={
                relationship === "COLLABORATION_RELEASE"
                  ? "Band / project billing"
                  : "Primary artist or band"
              }
              name="primaryArtistName"
              help="Exactly as billed on the release, e.g. “Ike Willis & Zappatika”."
              defaultValue={v("primaryArtistName", release?.primaryArtistName)}
              onChange={(e) => setPrimaryArtist(e.currentTarget.value)}
              errors={state.errors?.primaryArtistName}
            />
            <TextField
              label="Osman's role on this release"
              name="osmanCredit"
              placeholder="e.g. Osman Meyredi: keyboards"
              defaultValue={v("osmanCredit", release?.osmanCredit)}
              onChange={(e) => setOsmanRole(e.currentTarget.value)}
              errors={state.errors?.osmanCredit}
            />
            {relationship === "COLLABORATION_RELEASE" && collaborations.length > 0 && (
              <SelectField
                label="Belongs to project"
                name="collaborationSlug"
                help="Shows the release inside that project's feature on the Music page."
                defaultValue={v("collaborationSlug", release?.collaborationSlug ?? "")}
                errors={state.errors?.collaborationSlug}
                options={[
                  { value: "", label: "None" },
                  ...collaborations.map((c) => ({ value: c.slug, label: c.name })),
                ]}
              />
            )}
          </div>
        )}

        <TextField
          label="Release title"
          name="title"
          defaultValue={v("title", release?.title)}
          onChange={(e) => setTitle(e.currentTarget.value)}
          errors={state.errors?.title}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            label="Format"
            name="releaseType"
            defaultValue={v("releaseType", release?.releaseType) ?? "ALBUM"}
            errors={state.errors?.releaseType}
            options={[
              { value: "SINGLE", label: "Single" },
              { value: "EP", label: "EP" },
              { value: "ALBUM", label: "Album" },
              { value: "COLLABORATION", label: "Collaboration" },
            ]}
          />
          <TextField
            label="Year"
            name="year"
            type="number"
            optional
            placeholder="e.g. 2024"
            defaultValue={v("year", release?.year != null ? String(release.year) : undefined)}
            errors={state.errors?.year}
          />
        </div>

        <TextField
          label="Release date"
          name="releaseDate"
          type="date"
          optional
          defaultValue={v("releaseDate", release?.releaseDate)}
          errors={state.errors?.releaseDate}
        />

        <div className="space-y-4 rounded-md border border-line p-4">
          <TextField
            label="Artwork (link)"
            name="artworkUrl"
            type="text"
            optional
            help="Leave empty to use a neutral placeholder."
            defaultValue={v("artworkUrl", release?.artworkUrl)}
            errors={state.errors?.artworkUrl}
          />
          <TextField
            label="Artwork credit"
            name="artworkCredit"
            optional
            placeholder="e.g. Artwork: Jane Smith"
            help="Needed before publishing when artwork is set."
            defaultValue={v("artworkCredit", release?.artworkCredit)}
            errors={state.errors?.artworkCredit}
          />
          <SelectField
            label="Rights &amp; credits check"
            name="rightsStatus"
            help="Publishing needs a confirmed check. “Do not publish” keeps a record permanently off the site."
            defaultValue={v("rightsStatus", release?.rightsStatus ?? "PENDING")}
            errors={state.errors?.rightsStatus}
            options={[
              { value: "PENDING", label: "Not confirmed yet" },
              { value: "VERIFIED", label: "Confirmed: billing and credits are correct" },
              { value: "DO_NOT_PUBLISH", label: "Do not publish" },
            ]}
          />
        </div>

        <TextareaField
          label="Description"
          name="description"
          optional
          rows={4}
          defaultValue={v("description", release?.description)}
          errors={state.errors?.description}
        />

        <TextareaField
          label="Full credits"
          name="credits"
          optional
          rows={3}
          help="Who played what, e.g. Osman Meyredi: keyboards."
          defaultValue={v("credits", release?.credits)}
          errors={state.errors?.credits}
        />

        <details className="rounded-md border border-line">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink-soft select-none">
            Label &amp; source (optional)
          </summary>
          <div className="space-y-5 border-t border-line px-4 py-5">
            <TextField
              label="Label"
              name="labelName"
              optional
              defaultValue={v("labelName", release?.labelName)}
              errors={state.errors?.labelName}
            />
            <TextField
              label="Catalogue number"
              name="catalogNumber"
              optional
              defaultValue={v("catalogNumber", release?.catalogNumber)}
              errors={state.errors?.catalogNumber}
            />
            <TextField
              label="Source link"
              name="sourceUrl"
              type="url"
              optional
              help="Where these facts were verified (Bandcamp, press, label page)."
              defaultValue={v("sourceUrl", release?.sourceUrl)}
              errors={state.errors?.sourceUrl}
            />
          </div>
        </details>

        <fieldset className="space-y-5 rounded-md border border-line p-4">
          <legend className="px-1 text-sm font-medium text-ink">Listening links</legend>
          <p className="text-xs leading-relaxed text-ink-faint">
            Add the links that exist. Only filled-in platforms are shown on the site. Link to
            the actual release, not a search result.
          </p>
          <TextField
            label="Spotify"
            name="spotifyUrl"
            type="url"
            optional
            defaultValue={v("spotifyUrl", release?.spotifyUrl)}
            errors={state.errors?.spotifyUrl}
          />
          <TextField
            label="Apple Music"
            name="appleMusicUrl"
            type="url"
            optional
            defaultValue={v("appleMusicUrl", release?.appleMusicUrl)}
            errors={state.errors?.appleMusicUrl}
          />
          <TextField
            label="Bandcamp"
            name="bandcampUrl"
            type="url"
            optional
            defaultValue={v("bandcampUrl", release?.bandcampUrl)}
            errors={state.errors?.bandcampUrl}
          />
          <TextField
            label="YouTube"
            name="youtubeUrl"
            type="url"
            optional
            defaultValue={v("youtubeUrl", release?.youtubeUrl)}
            errors={state.errors?.youtubeUrl}
          />
          <TextField
            label="Other"
            name="otherUrl"
            type="url"
            optional
            defaultValue={v("otherUrl", release?.otherUrl)}
            errors={state.errors?.otherUrl}
          />
        </fieldset>

        <CheckboxField
          label="Highlight on the homepage"
          name="featured"
          defaultChecked={checked("featured", release?.featured ?? false)}
        />

        {nonOwn && (
          <div className="rounded-md border border-line bg-canvas-soft p-4">
            <p className="text-sm font-semibold text-ink">Before publishing, check the billing</p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="w-36 shrink-0 text-ink-faint">Primary artist</dt>
                <dd className="text-ink">{primaryArtist || "—"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-36 shrink-0 text-ink-faint">Release</dt>
                <dd className="text-ink">{title || "—"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-36 shrink-0 text-ink-faint">Osman&apos;s role</dt>
                <dd className="text-ink">{osmanRole || "—"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-36 shrink-0 text-ink-faint">Shown as</dt>
                <dd className="text-ink">{relationshipPublicLabels[relationship]}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              This release will not appear as an Osman Meyredi solo release.
            </p>
            <CheckboxField
              label="The billing above is correct"
              name="billingConfirmed"
              defaultChecked={checked("billingConfirmed", release?.status === "PUBLISHED")}
            />
          </div>
        )}

        <PublishButtons isPublished={release?.status === "PUBLISHED"} />
        {pending ? <p className="text-xs text-ink-faint">Saving…</p> : null}
      </form>

      {release ? (
        <DangerZone action={deleteReleaseAction} id={release.id} noun="release" />
      ) : null}
    </div>
  );
}
