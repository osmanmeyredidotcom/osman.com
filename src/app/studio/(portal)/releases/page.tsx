import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { relationshipPublicLabels, releaseTypeLabels } from "@/components/studio/labels";
import { StatusChip } from "@/components/studio/StatusChip";
import { EmptyState, PageHeader } from "@/components/studio/PageHeader";
import { RowAction } from "@/components/studio/rowActions";
import {
  archiveReleaseAction,
  duplicateReleaseAction,
  unpublishReleaseAction,
} from "@/server/actions/releases";

export const dynamic = "force-dynamic";

export const metadata = { title: "Releases" };

export default async function ReleasesPage() {
  const releases = await getRepos().releases.list();
  const sorted = [...releases].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Releases"
        intro="Singles, EPs, albums and collaborations."
        actionHref="/studio/releases/new"
        actionLabel="Add release"
      />

      {sorted.length === 0 ? (
        <EmptyState
          message="No releases yet."
          actionHref="/studio/releases/new"
          actionLabel="Add release"
        />
      ) : (
        <ul className="divide-y divide-line rounded-md border border-line">
          {sorted.map((release) => (
            <li key={release.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
              <span className="min-w-0 flex-1">
                <Link
                  href={`/studio/releases/${release.id}`}
                  className="block truncate text-sm font-medium text-ink hover:text-accent-strong"
                >
                  {release.title}
                </Link>
                <span className="block truncate text-xs text-ink-faint">
                  {[
                    relationshipPublicLabels[release.relationshipType],
                    releaseTypeLabels[release.releaseType],
                    release.year,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <StatusChip status={release.status} />
                {/* 19-11: no Featured chip; the homepage features the newest
                    release by date, whatever the old flag says. */}
              </span>
              <span className="flex items-center gap-3">
                <Link
                  href={`/studio/releases/${release.id}`}
                  className="text-xs font-medium text-accent underline-offset-2 hover:underline"
                >
                  Edit
                </Link>
                <RowAction action={duplicateReleaseAction} id={release.id} label="Duplicate" />
                {release.status === "PUBLISHED" ? (
                  <RowAction action={unpublishReleaseAction} id={release.id} label="Unpublish" />
                ) : null}
                {release.status !== "ARCHIVED" ? (
                  <RowAction action={archiveReleaseAction} id={release.id} label="Archive" />
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
