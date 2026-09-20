"use client";

import { useActionState, useState } from "react";
import type { CollaborationRecord } from "@/lib/types";
import {
  deleteCollaborationAction,
  saveCollaborationAction,
} from "@/server/actions/collaborations";
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
 * Collaboration editor — precision pack 03 §9–§13. Plain language throughout;
 * the photo block previews the public credit line so a missing attribution is
 * impossible to miss, and the cultural-note block keeps unverified claims
 * internal by default (a PENDING note never renders publicly).
 */
export function CollaborationForm({ collaboration }: { collaboration?: CollaborationRecord }) {
  const [state, formAction, pending] = useActionState(
    saveCollaborationAction,
    initialActionState
  );

  const v = (name: string, fallback?: string | null): string | undefined =>
    state.values?.[name] ?? fallback ?? undefined;
  const checked = (name: string, fallback: boolean): boolean =>
    state.values ? state.values[name] === "true" : fallback;

  const [credit, setCredit] = useState(
    v("heroImageCredit", collaboration?.heroImageCredit) ?? ""
  );
  const [imageUrl, setImageUrl] = useState(
    v("heroImageUrl", collaboration?.heroImageUrl) ?? ""
  );

  return (
    <div className="max-w-xl">
      <form action={formAction} className="space-y-6">
        {collaboration ? <input type="hidden" name="id" value={collaboration.id} /> : null}
        <FormError errors={state.errors} />

        <TextField
          label="Project or band name"
          name="name"
          defaultValue={v("name", collaboration?.name)}
          errors={state.errors?.name}
        />

        <TextField
          label="Osman's role"
          name="role"
          optional
          placeholder="e.g. Keyboards & vocals"
          defaultValue={v("role", collaboration?.role)}
          errors={state.errors?.role}
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <TextField
            label="From (year)"
            name="startYear"
            type="number"
            optional
            defaultValue={v(
              "startYear",
              collaboration?.startYear != null ? String(collaboration.startYear) : undefined
            )}
            errors={state.errors?.startYear}
          />
          <TextField
            label="Until (year)"
            name="endYear"
            type="number"
            optional
            help="Leave empty if unknown."
            defaultValue={v(
              "endYear",
              collaboration?.endYear != null ? String(collaboration.endYear) : undefined
            )}
            errors={state.errors?.endYear}
          />
          <div className="pt-7">
            <CheckboxField
              label="Ongoing"
              name="ongoing"
              defaultChecked={checked("ongoing", collaboration?.ongoing ?? false)}
            />
          </div>
        </div>

        <TextField
          label="Musicians involved"
          name="collaborators"
          optional
          help="Only people verified as part of the project, e.g. “Ike Willis · Mark Mcinnes”."
          defaultValue={v("collaborators", collaboration?.collaborators)}
          errors={state.errors?.collaborators}
        />

        <TextareaField
          label="Short public description"
          name="shortDescription"
          optional
          rows={3}
          help="One or two sentences, shown on the homepage teaser."
          defaultValue={v("shortDescription", collaboration?.shortDescription)}
          errors={state.errors?.shortDescription}
        />

        <TextareaField
          label="Full story"
          name="longDescription"
          optional
          rows={6}
          help="Shown on the Music page. Stick to what's verified. Don't overstate claims."
          defaultValue={v("longDescription", collaboration?.longDescription)}
          errors={state.errors?.longDescription}
        />

        <div className="space-y-4 rounded-md border border-line p-4">
          <TextField
            label="Project photo (link)"
            name="heroImageUrl"
            type="text"
            optional
            defaultValue={v("heroImageUrl", collaboration?.heroImageUrl)}
            onChange={(e) => setImageUrl(e.currentTarget.value)}
            errors={state.errors?.heroImageUrl}
          />
          <TextField
            label="What's in the photo?"
            name="heroImageAlt"
            optional
            help="Short description for screen readers."
            defaultValue={v("heroImageAlt", collaboration?.heroImageAlt)}
            errors={state.errors?.heroImageAlt}
          />
          <TextField
            label="Photo credit"
            name="heroImageCredit"
            optional
            placeholder="e.g. Photo courtesy of ZAPPATiKA / Jane Smith"
            defaultValue={v("heroImageCredit", collaboration?.heroImageCredit)}
            onChange={(e) => setCredit(e.currentTarget.value)}
            errors={state.errors?.heroImageCredit}
          />
          <SelectField
            label="Photo rights"
            name="heroImageRights"
            help="The photo only appears on the site once rights are confirmed."
            defaultValue={v("heroImageRights", collaboration?.heroImageRights ?? "PENDING")}
            errors={state.errors?.heroImageRights}
            options={[
              { value: "PENDING", label: "Not confirmed yet" },
              { value: "VERIFIED", label: "Confirmed: we may use this photo" },
              { value: "DO_NOT_PUBLISH", label: "Do not publish" },
            ]}
          />
          {/* Credit visibility preview — pack 03 §13 */}
          {imageUrl ? (
            credit ? (
              <p className="rounded-sm bg-canvas-soft px-3 py-2 text-xs text-ink-soft">
                Public credit: <span className="text-ink">{credit}</span>
              </p>
            ) : (
              <p className="rounded-sm bg-warn/10 px-3 py-2 text-xs font-medium text-warn">
                Credit required before publication
              </p>
            )
          ) : null}
        </div>

        <TextField
          label="Project link"
          name="externalUrl"
          type="url"
          optional
          help="Bandcamp, site or archive page for the project."
          defaultValue={v("externalUrl", collaboration?.externalUrl)}
          errors={state.errors?.externalUrl}
        />

        <details
          className="rounded-md border border-line"
          open={Boolean(collaboration?.showMemorial)}
        >
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink-soft select-none">
            Dedication (optional)
          </summary>
          <div className="space-y-5 border-t border-line px-4 py-5">
            <p className="text-xs leading-relaxed text-ink-faint">
              A restrained, film-style dedication at the end of the project&apos;s section, kept
              minimal, never promotional.
            </p>
            <TextField
              label="Dedication line"
              name="memorialTitle"
              optional
              placeholder="e.g. Dedicated to the memory of"
              defaultValue={v("memorialTitle", collaboration?.memorialTitle)}
              errors={state.errors?.memorialTitle}
            />
            <TextField
              label="Name"
              name="memorialName"
              optional
              defaultValue={v("memorialName", collaboration?.memorialName)}
              errors={state.errors?.memorialName}
            />
            <TextField
              label="Years"
              name="memorialYears"
              optional
              placeholder="e.g. 1955–2026"
              defaultValue={v("memorialYears", collaboration?.memorialYears)}
              errors={state.errors?.memorialYears}
            />
            <TextareaField
              label="A short line (optional)"
              name="memorialText"
              optional
              rows={2}
              defaultValue={v("memorialText", collaboration?.memorialText)}
              errors={state.errors?.memorialText}
            />
            <CheckboxField
              label="Show the dedication on the site"
              name="showMemorial"
              defaultChecked={checked("showMemorial", collaboration?.showMemorial ?? false)}
            />
          </div>
        </details>

        <details className="rounded-md border border-line">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink-soft select-none">
            Cultural note &amp; research (optional)
          </summary>
          <div className="space-y-5 border-t border-line px-4 py-5">
            <TextareaField
              label="Public cultural note"
              name="publicCulturalNote"
              optional
              rows={3}
              help="Only shown on the site when its verification below is set to “Verified”."
              defaultValue={v("publicCulturalNote", collaboration?.publicCulturalNote)}
              errors={state.errors?.publicCulturalNote}
            />
            <SelectField
              label="Verification"
              name="culturalNoteStatus"
              help="“Pending” and “Rejected” notes never appear on the site."
              defaultValue={v(
                "culturalNoteStatus",
                collaboration?.culturalNoteStatus ?? "PENDING"
              )}
              errors={state.errors?.culturalNoteStatus}
              options={[
                { value: "PENDING", label: "Pending: needs direct evidence" },
                { value: "VERIFIED", label: "Verified: safe to show" },
                { value: "REJECTED", label: "Rejected: do not show" },
              ]}
            />
            <TextareaField
              label="Internal research notes"
              name="internalNotes"
              optional
              rows={4}
              help="Never shown publicly. Keep sources, open questions and evidence here."
              defaultValue={v("internalNotes", collaboration?.internalNotes)}
              errors={state.errors?.internalNotes}
            />
          </div>
        </details>

        <PublishButtons isPublished={collaboration?.status === "PUBLISHED"} />
        {pending ? <p className="text-xs text-ink-faint">Saving…</p> : null}
      </form>

      {collaboration ? (
        <DangerZone
          action={deleteCollaborationAction}
          id={collaboration.id}
          noun="collaboration"
        />
      ) : null}
    </div>
  );
}
