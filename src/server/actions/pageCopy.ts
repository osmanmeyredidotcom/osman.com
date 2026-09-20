"use server";

import { getRepos } from "@/server/repositories";
import type { ActionState } from "@/components/studio/actionState";
import { publicContentChanged, formValues, guardEditor } from "./shared";
import { copyPage, GALLERY_PAGE_ID, GALLERY_SLOTS } from "@/data/page-copy";

/**
 * Saves one Studio "Pages" form (content-governance pass). Values are plain
 * text; an EMPTY field is stored as a deletion, which means "fall back to
 * the approved default" — so a mistaken clear can never blank the site.
 * URL/image fields must be a site path (/…) or https:// address (§30/§41).
 */

function urlProblem(value: string): string | null {
  if (value === "") return null;
  if (value.startsWith("/")) return null;
  if (/^https:\/\/[^\s]+\.[^\s]+/.test(value)) return null;
  return "Use a site path starting with / or a full https:// address.";
}

export async function savePageCopyAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();

  const pageId = String(formData.get("__page") ?? "");
  const page = copyPage(pageId);
  const isGallery = pageId === GALLERY_PAGE_ID;
  if (!page && !isGallery) {
    return { errors: { __page: ["Unknown page."] }, values: formValues(formData) };
  }

  const values = formValues(formData);
  const errors: Record<string, string[]> = {};
  const entries: Record<string, string> = {};

  if (page) {
    for (const field of page.fields) {
      const raw = (values[field.key] ?? "").trim();
      if ((field.kind === "url" || field.kind === "image") && raw !== "") {
        const problem = urlProblem(raw);
        if (problem) {
          errors[field.key] = [problem];
          continue;
        }
      }
      // Storing the default text is the same as clearing the override.
      entries[`${pageId}.${field.key}`] = raw === field.default ? "" : raw;
    }
  } else {
    // Gallery slots: src/alt/aspect/width/height per slot.
    for (let n = 1; n <= GALLERY_SLOTS; n++) {
      for (const part of ["src", "alt", "aspect", "width", "height"] as const) {
        const key = `slot${n}.${part}`;
        const raw = (values[key] ?? "").trim();
        if (part === "src" && raw !== "") {
          const problem = urlProblem(raw);
          if (problem) {
            errors[key] = [problem];
            continue;
          }
        }
        if ((part === "width" || part === "height") && raw !== "" && !/^\d{2,5}$/.test(raw)) {
          errors[key] = ["Use the photo's pixel size, numbers only."];
          continue;
        }
        entries[`${GALLERY_PAGE_ID}.${key}`] = raw;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  await getRepos().copy.setMany(entries);
  publicContentChanged("settings");
  return { ok: true };
}
