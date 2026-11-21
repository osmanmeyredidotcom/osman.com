import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { Chip, StatusChip } from "@/components/studio/StatusChip";
import { EmptyState, PageHeader } from "@/components/studio/PageHeader";
import { RowAction } from "@/components/studio/rowActions";
import {
  archiveVideoAction,
  duplicateVideoAction,
  moveVideoAction,
  unpublishVideoAction,
} from "@/server/actions/videos";

export const dynamic = "force-dynamic";

export const metadata = { title: "Live videos" };

export default async function VideosPage() {
  const videos = await getRepos().videos.list();
  const sorted = [...videos].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live videos"
        intro="Performance videos from YouTube or Vimeo. The Videos page shows them in this order; Move up and Move down change it."
        actionHref="/studio/videos/new"
        actionLabel="Add live video"
      />

      {sorted.length === 0 ? (
        <EmptyState
          message="No live videos yet."
          actionHref="/studio/videos/new"
          actionLabel="Add live video"
        />
      ) : (
        <ul className="divide-y divide-line rounded-md border border-line">
          {sorted.map((video, i) => (
            <li key={video.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
              <span className="min-w-0 flex-1">
                <Link
                  href={`/studio/videos/${video.id}`}
                  className="block truncate text-sm font-medium text-ink hover:text-accent-strong"
                >
                  {video.title}
                </Link>
                <span className="block truncate text-xs text-ink-faint">
                  {[video.year, video.venue].filter(Boolean).join(" · ") || "No year or venue yet"}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <StatusChip status={video.status} />
                {video.featured ? <Chip tone="faint">Featured</Chip> : null}
              </span>
              <span className="flex items-center gap-3">
                <Link
                  href={`/studio/videos/${video.id}`}
                  className="text-xs font-medium text-accent underline-offset-2 hover:underline"
                >
                  Edit
                </Link>
                <RowAction action={duplicateVideoAction} id={video.id} label="Duplicate" />
                {video.status === "PUBLISHED" ? (
                  <RowAction action={unpublishVideoAction} id={video.id} label="Unpublish" />
                ) : null}
                {video.status !== "ARCHIVED" ? (
                  <RowAction action={archiveVideoAction} id={video.id} label="Archive" />
                ) : null}
                {/* 19-11 (N19-12): the order of this list is the order on
                    the public Videos page. */}
                {i > 0 ? (
                  <RowAction
                    action={moveVideoAction}
                    id={video.id}
                    label="Move up"
                    fields={{ direction: "up" }}
                  />
                ) : null}
                {i < sorted.length - 1 ? (
                  <RowAction
                    action={moveVideoAction}
                    id={video.id}
                    label="Move down"
                    fields={{ direction: "down" }}
                  />
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
