"use server";

import { redirect } from "next/navigation";
import { liveVideoInput } from "@/lib/validation/schemas";
import { uniqueSlug } from "@/lib/slug";
import { vimeoId, youtubeId } from "@/lib/embed";
import { getRepos } from "@/server/repositories";
import type { ActionState } from "@/components/studio/actionState";
import {
  confirmedDeletion,
  fieldErrors,
  formValues,
  guardEditor,
  nextSortOrder,
  recordId,
  statusFromIntent,
  stripMeta,
  toRawInput,
  publicContentChanged,
} from "./shared";

const LIST_PATH = "/studio/videos";

export async function saveVideoAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await guardEditor();
  const id = recordId(formData);

  const raw = toRawInput(formData, ["year"]);
  raw.status = statusFromIntent(formData);
  const parsed = liveVideoInput.safeParse(raw);
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }

  const data = parsed.data;
  const yt = youtubeId(data.videoUrl);
  const vimeo = vimeoId(data.videoUrl);
  if (!yt && !vimeo) {
    return {
      errors: { videoUrl: ["Paste a full YouTube or Vimeo link."] },
      values: formValues(formData),
    };
  }
  data.platform = yt ? "youtube" : "vimeo";

  const repos = getRepos();
  if (id) {
    const existing = await repos.videos.get(id);
    if (!existing) {
      return { errors: { _form: ["This video no longer exists."] } };
    }
    await repos.videos.update(id, { ...data });
  } else {
    const all = await repos.videos.list();
    const slugs = new Set(all.map((v) => v.slug));
    await repos.videos.create({
      ...data,
      slug: uniqueSlug(data.title, slugs),
      sortOrder: nextSortOrder(all),
    });
  }

  publicContentChanged("videos");
  redirect(LIST_PATH);
}

export async function duplicateVideoAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  const repos = getRepos();
  const existing = id ? await repos.videos.get(id) : null;
  if (!existing) redirect(LIST_PATH);

  const all = await repos.videos.list();
  const title = `${existing.title} (copy)`;
  const slugs = new Set(all.map((v) => v.slug));
  await repos.videos.create({
    ...stripMeta(existing),
    title,
    slug: uniqueSlug(title, slugs),
    status: "DRAFT",
    sortOrder: nextSortOrder(all),
  });

  publicContentChanged("videos");
  redirect(LIST_PATH);
}

export async function archiveVideoAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().videos.update(id, { status: "ARCHIVED" });
    publicContentChanged("videos");
  }
  redirect(LIST_PATH);
}

/**
 * 19-11 (N19-12): the Live videos order, which the public Videos page
 * follows, can be changed from the Studio list. "Move up" / "Move down"
 * swaps a video with its neighbour in the list (archived ones included, as
 * they show there) and then numbers the whole list 1, 2, 3… in its new
 * order, so equal numbers can never leave a move without effect.
 */
export async function moveVideoAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  const step = formData.get("direction") === "down" ? 1 : -1;
  const repos = getRepos();
  const order = [...(await repos.videos.list())].sort((a, b) => a.sortOrder - b.sortOrder);
  const from = order.findIndex((v) => v.id === id);
  const to = from + step;
  if (from >= 0 && to >= 0 && to < order.length) {
    [order[from], order[to]] = [order[to], order[from]];
    for (const [i, video] of order.entries()) {
      if (video.sortOrder !== i + 1) await repos.videos.update(video.id, { sortOrder: i + 1 });
    }
    publicContentChanged("videos");
  }
  redirect(LIST_PATH);
}

export async function unpublishVideoAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id) {
    await getRepos().videos.update(id, { status: "DRAFT" });
    publicContentChanged("videos");
  }
  redirect(LIST_PATH);
}

export async function deleteVideoAction(formData: FormData): Promise<void> {
  await guardEditor();
  const id = recordId(formData);
  if (id && confirmedDeletion(formData)) {
    await getRepos().videos.remove(id);
    publicContentChanged("videos");
  }
  redirect(LIST_PATH);
}
