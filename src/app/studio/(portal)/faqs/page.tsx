import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { Chip, StatusChip } from "@/components/studio/StatusChip";
import { EmptyState, PageHeader } from "@/components/studio/PageHeader";
import { RowAction } from "@/components/studio/rowActions";
import {
  archiveFaqAction,
  duplicateFaqAction,
  unpublishFaqAction,
} from "@/server/actions/faqs";

export const dynamic = "force-dynamic";

export const metadata = { title: "Practical Q&A" };

export default async function FaqsPage() {
  const items = await getRepos().faqs.list();
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Practical Q&A"
        intro="Short approved answers to the questions visitors ask, shown on the contact page. Publish only wording that has been approved; the AI flag decides whether a future assistant may use an answer."
        actionHref="/studio/faqs/new"
        actionLabel="Add Q&A"
      />

      {sorted.length === 0 ? (
        <EmptyState
          message="No Q&As yet."
          actionHref="/studio/faqs/new"
          actionLabel="Add Q&A"
        />
      ) : (
        <ul className="divide-y divide-line rounded-md border border-line">
          {sorted.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
              <span className="min-w-0 flex-1">
                <Link
                  href={`/studio/faqs/${item.id}`}
                  className="block truncate text-sm font-medium text-ink hover:text-accent-strong"
                >
                  {item.question}
                </Link>
                <span className="block truncate text-xs text-ink-faint">{item.answer}</span>
              </span>
              <span className="flex items-center gap-2">
                <StatusChip status={item.status} />
                {item.aiApproved ? <Chip tone="faint">AI-approved</Chip> : null}
              </span>
              <span className="flex items-center gap-3">
                <Link
                  href={`/studio/faqs/${item.id}`}
                  className="text-xs font-medium text-accent underline-offset-2 hover:underline"
                >
                  Edit
                </Link>
                <RowAction action={duplicateFaqAction} id={item.id} label="Duplicate" />
                {item.status === "PUBLISHED" ? (
                  <RowAction action={unpublishFaqAction} id={item.id} label="Unpublish" />
                ) : null}
                {item.status !== "ARCHIVED" ? (
                  <RowAction action={archiveFaqAction} id={item.id} label="Archive" />
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
