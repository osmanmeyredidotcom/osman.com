import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { verificationStatusLabels } from "@/components/studio/labels";
import { Chip, StatusChip } from "@/components/studio/StatusChip";
import { EmptyState, PageHeader } from "@/components/studio/PageHeader";
import { RowAction } from "@/components/studio/rowActions";
import {
  archiveCollaborationAction,
  duplicateCollaborationAction,
  unpublishCollaborationAction,
} from "@/server/actions/collaborations";

export const dynamic = "force-dynamic";

export const metadata = { title: "Collaborations" };

export default async function CollaborationsPage() {
  const collaborations = await getRepos().collaborations.list();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Collaborations"
        intro="Band projects and recurring collaborations, with their photos, credits and verification states."
        actionHref="/studio/collaborations/new"
        actionLabel="Add collaboration"
      />

      {collaborations.length === 0 ? (
        <EmptyState
          message="No collaborations yet."
          actionHref="/studio/collaborations/new"
          actionLabel="Add collaboration"
        />
      ) : (
        <ul className="divide-y divide-line rounded-md border border-line">
          {collaborations.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
              <span className="min-w-0 flex-1">
                <Link
                  href={`/studio/collaborations/${c.id}`}
                  className="block truncate text-sm font-medium text-ink hover:text-accent-strong"
                >
                  {c.name}
                </Link>
                <span className="block truncate text-xs text-ink-faint">
                  {[
                    c.role,
                    c.startYear ? `${c.startYear}–${c.ongoing ? "present" : (c.endYear ?? "")}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <StatusChip status={c.status} />
                {c.heroImageUrl && c.heroImageRights !== "VERIFIED" ? (
                  <Chip tone="warn">Photo rights pending</Chip>
                ) : null}
                {c.publicCulturalNote && c.culturalNoteStatus !== "VERIFIED" ? (
                  <Chip tone="warn">{verificationStatusLabels[c.culturalNoteStatus]}</Chip>
                ) : null}
                {c.showMemorial ? <Chip tone="faint">Dedication</Chip> : null}
              </span>
              <span className="flex items-center gap-3">
                <Link
                  href={`/studio/collaborations/${c.id}`}
                  className="text-xs font-medium text-accent underline-offset-2 hover:underline"
                >
                  Edit
                </Link>
                <RowAction action={duplicateCollaborationAction} id={c.id} label="Duplicate" />
                {c.status === "PUBLISHED" ? (
                  <RowAction action={unpublishCollaborationAction} id={c.id} label="Unpublish" />
                ) : null}
                {c.status !== "ARCHIVED" ? (
                  <RowAction action={archiveCollaborationAction} id={c.id} label="Archive" />
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
