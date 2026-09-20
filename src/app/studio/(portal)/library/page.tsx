import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { Chip, StatusChip } from "@/components/studio/StatusChip";
import { EmptyState, PageHeader } from "@/components/studio/PageHeader";
import { RowAction } from "@/components/studio/rowActions";
import {
  archiveLibraryTrackAction,
  duplicateLibraryTrackAction,
  unpublishLibraryTrackAction,
} from "@/server/actions/libraryTracks";

export const dynamic = "force-dynamic";

export const metadata = { title: "Music library" };

function formatDuration(sec: number | null): string | null {
  if (!sec) return null;
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

export default async function LibraryTracksPage() {
  const tracks = await getRepos().libraryTracks.list();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Music library"
        intro="Original tracks ready to license. Add, change and reorder them any time; published tracks appear on the public library page immediately."
        actionHref="/studio/library/new"
        actionLabel="Add track"
      />

      {tracks.length === 0 ? (
        <EmptyState
          message="No tracks yet. Add the first jingle and publish it when the audio is ready."
          actionHref="/studio/library/new"
          actionLabel="Add track"
        />
      ) : (
        <ul className="divide-y divide-line rounded-md border border-line">
          {tracks.map((track) => (
            <li key={track.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
              <span className="min-w-0 flex-1">
                <Link
                  href={`/studio/library/${track.id}`}
                  className="block truncate text-sm font-medium text-ink hover:text-accent-strong"
                >
                  {track.title}
                </Link>
                <span className="block truncate text-xs text-ink-faint">
                  {[track.genre, formatDuration(track.durationSec), track.moods.join(", ")]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <StatusChip status={track.status} />
                {track.featured ? <Chip tone="faint">Featured</Chip> : null}
                {!track.audioUrl ? <Chip tone="faint">No audio yet</Chip> : null}
              </span>
              <span className="flex items-center gap-3">
                <Link
                  href={`/studio/library/${track.id}`}
                  className="text-xs font-medium text-accent underline-offset-2 hover:underline"
                >
                  Edit
                </Link>
                <RowAction action={duplicateLibraryTrackAction} id={track.id} label="Duplicate" />
                {track.status === "PUBLISHED" ? (
                  <RowAction action={unpublishLibraryTrackAction} id={track.id} label="Unpublish" />
                ) : null}
                {track.status !== "ARCHIVED" ? (
                  <RowAction action={archiveLibraryTrackAction} id={track.id} label="Archive" />
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
