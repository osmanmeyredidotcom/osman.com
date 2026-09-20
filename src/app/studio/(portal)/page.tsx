import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getRepos } from "@/server/repositories";
import { formatEventDate, upcomingPublished } from "@/lib/events";
import { EventStateChip, StatusChip } from "@/components/studio/StatusChip";

export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  { href: "/studio/events/new?type=TICKETED_CONCERT", label: "Add ticketed concert" },
  { href: "/studio/events/new?type=FREE_GIG", label: "Add free gig" },
  { href: "/studio/videos/new", label: "Add live video" },
  { href: "/studio/releases/new", label: "Add release" },
  { href: "/studio/media/new", label: "Add media article" },
  { href: "/studio/library/new", label: "Add library track" },
  { href: "/studio/shop", label: "Manage shop" },
] as const;

interface DashboardItem {
  key: string;
  typeLabel: string;
  title: string;
  href: string;
  updatedAt: string;
  /** Draft/published/archived where the collection has it; null for shop items. */
  status: import("@/lib/types").ContentStatus | null;
}

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/studio/login");

  const repos = getRepos();
  const [events, videos, releases, media, libraryTracks, products] = await Promise.all([
    repos.events.list(),
    repos.videos.list(),
    repos.releases.list(),
    repos.media.list(),
    repos.libraryTracks.list(),
    repos.products.list(),
  ]);

  const upcoming = upcomingPublished(events).slice(0, 5);

  const everything: DashboardItem[] = [
    ...events.map((e) => ({
      key: `event-${e.id}`,
      typeLabel: "Show",
      title: e.title,
      href: `/studio/events/${e.id}`,
      updatedAt: e.updatedAt,
      status: e.status,
    })),
    ...videos.map((v) => ({
      key: `video-${v.id}`,
      typeLabel: "Live video",
      title: v.title,
      href: `/studio/videos/${v.id}`,
      updatedAt: v.updatedAt,
      status: v.status,
    })),
    ...releases.map((r) => ({
      key: `release-${r.id}`,
      typeLabel: "Release",
      title: r.title,
      href: `/studio/releases/${r.id}`,
      updatedAt: r.updatedAt,
      status: r.status,
    })),
    ...media.map((m) => ({
      key: `media-${m.id}`,
      typeLabel: "Media",
      title: m.headline,
      href: `/studio/media/${m.id}`,
      updatedAt: m.updatedAt,
      status: m.status,
    })),
    ...libraryTracks.map((t) => ({
      key: `track-${t.id}`,
      typeLabel: "Library track",
      title: t.title,
      href: `/studio/library/${t.id}`,
      updatedAt: t.updatedAt,
      status: t.status,
    })),
    ...products.map((p) => ({
      key: `product-${p.id}`,
      typeLabel: "Shop item",
      title: p.title,
      href: `/studio/shop/${p.id}`,
      updatedAt: p.updatedAt,
      status: null,
    })),
  ];

  const drafts = everything
    .filter((item) => item.status === "DRAFT")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const recentlyEdited = [...everything]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl text-ink">Welcome back, {user.name}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Everything on the site is managed from here.
        </p>
      </header>

      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="eyebrow">
          Quick actions
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-md border border-line px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent-strong"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="next-events">
        <h2 id="next-events" className="eyebrow">
          Next upcoming events
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">
            No upcoming published events.{" "}
            <Link href="/studio/events/new" className="text-accent underline underline-offset-2">
              Add a show
            </Link>{" "}
            to get one on the calendar.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-md border border-line">
            {upcoming.map((event) => (
              <li key={event.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                <span className="tabular w-32 shrink-0 text-sm text-ink-soft">
                  {formatEventDate(event.date).full}
                </span>
                <Link
                  href={`/studio/events/${event.id}`}
                  className="min-w-0 flex-1 truncate text-sm font-medium text-ink hover:text-accent-strong"
                >
                  {event.title}
                </Link>
                <span className="flex items-center gap-2">
                  <StatusChip status={event.status} />
                  <EventStateChip state={event.eventState} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="drafts">
        <h2 id="drafts" className="eyebrow">
          Drafts awaiting publication
        </h2>
        {drafts.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">Nothing in draft. All caught up.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-md border border-line">
            {drafts.map((item) => (
              <li key={item.key} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                <span className="w-24 shrink-0 text-xs font-medium text-ink-faint uppercase tracking-wide">
                  {item.typeLabel}
                </span>
                <Link
                  href={item.href}
                  className="min-w-0 flex-1 truncate text-sm font-medium text-ink hover:text-accent-strong"
                >
                  {item.title}
                </Link>
                <StatusChip status="DRAFT" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="recent">
        <h2 id="recent" className="eyebrow">
          Recently edited
        </h2>
        <ul className="mt-3 divide-y divide-line rounded-md border border-line">
          {recentlyEdited.map((item) => (
            <li key={item.key} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span className="w-24 shrink-0 text-xs font-medium text-ink-faint uppercase tracking-wide">
                {item.typeLabel}
              </span>
              <Link
                href={item.href}
                className="min-w-0 flex-1 truncate text-sm font-medium text-ink hover:text-accent-strong"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-line pt-4">
        <p className="text-xs text-ink-faint">
          {repos.backend === "demo"
            ? "Demo content mode. Connect a database to go live (see README)."
            : "Connected to database."}
        </p>
      </footer>
    </div>
  );
}
