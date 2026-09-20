import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import type { EventRecord } from "@/lib/types";
import { effectiveTicketing, formatAgendaDate, pastPublished, upcomingPublished } from "@/lib/events";
import { pageOpenGraph } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";
import { ShowsSubnav } from "@/components/public/ShowsSubnav";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

// §23 title direction for the Shows section.
const PAGE_TITLE = "Osman Meyredi | Concerts & Upcoming Gigs";
const PAGE_DESCRIPTION =
  "Where to hear Osman Meyredi live: concerts, upcoming shows with free entry and a gallery of live videos.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/shows" },
  openGraph: pageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/shows",
    image: "/images/home-hero-landscape.jpg",
    imageAlt: "Osman Meyredi singing at the keys under stage light",
  }),
};

/**
 * Shows overview — Keynote slides 15–17: Concerts · Upcoming Shows · Tickets ·
 * Live Videos, with the local Shows sub-nav so nobody has to route back
 * through the fullscreen menu.
 */
/**
 * Past nights on the overview too (Round 2 slide 20, applied 12-09-2026):
 * the same treatment as the gigs agenda — struck through, lighter, never
 * linking out — so a passed date like the Amsterdam Wine Festival stays
 * visible and clearly reads as played.
 */
function PastRows({ events }: { events: EventRecord[] }) {
  if (events.length === 0) return null;
  return (
    <ul className="mt-6">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-line py-3 text-sm text-ink-faint"
        >
          <span className="tabular shrink-0 line-through">{formatAgendaDate(event.date)}</span>
          <span className="line-through">
            {event.title} · {event.venue}, {event.city}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function ShowsPage() {
  const allEvents = await getRepos().events.list();
  const events = upcomingPublished(allEvents);
  const concerts = events.filter((e) => effectiveTicketing(e) === "TICKETED").slice(0, 3);
  const gigs = events.filter((e) => effectiveTicketing(e) !== "TICKETED").slice(0, 3);
  const past = pastPublished(allEvents).sort((a, b) => b.date.localeCompare(a.date));
  const pastConcerts = past.filter((e) => effectiveTicketing(e) === "TICKETED").slice(0, 4);
  const pastGigs = past.filter((e) => effectiveTicketing(e) !== "TICKETED").slice(0, 4);

  return (
    <>
      <ShowsSubnav current="/shows" />
      <section className="py-20 sm:py-28">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Shows</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              Hear it live
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Concerts, upcoming shows with free entry, and live videos for the nights you
              can&rsquo;t make it.
            </p>
          </Reveal>

          {/* Concerts */}
          <div className="mt-20">
            <Reveal variant="text">
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="font-display text-3xl">Concerts</h2>
                <Link
                  href="/shows/concerts"
                  className="u-link text-sm hover:text-accent-strong"
                >
                  All concerts
                </Link>
              </div>
            </Reveal>
            <div className="mt-8">
              {concerts.length > 0 ? (
                <Reveal variant="card" delay={120}>
                  <EventList events={concerts} />
                </Reveal>
              ) : (
                <Reveal variant="text" delay={120}>
                  <p className="border-t border-line pt-6 text-ink-soft">
                    New dates appear here as soon as they are confirmed.
                  </p>
                </Reveal>
              )}
              <Reveal variant="text" delay={140}>
                <PastRows events={pastConcerts} />
              </Reveal>
            </div>
          </div>

          {/* Upcoming shows (free entry) */}
          <div className="mt-20">
            <Reveal variant="text">
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="font-display text-3xl">Upcoming gigs</h2>
                <Link
                  href="/shows/gigs"
                  className="u-link text-sm hover:text-accent-strong"
                >
                  All gigs
                </Link>
              </div>
              {/* Keynote slide 17 wording */}
              <p className="mt-3 text-sm text-ink-soft">
                No concert ticket required · Venue conditions may apply
              </p>
            </Reveal>
            <div className="mt-8">
              {gigs.length > 0 ? (
                <Reveal variant="card" delay={120}>
                  <EventList events={gigs} />
                </Reveal>
              ) : (
                <Reveal variant="text" delay={120}>
                  <p className="border-t border-line pt-6 text-ink-soft">
                    No shows are announced at the moment. New dates land here first.
                  </p>
                </Reveal>
              )}
              <Reveal variant="text" delay={140}>
                <PastRows events={pastGigs} />
              </Reveal>
            </div>
          </div>

          {/* Tickets section removed — Round 3 Keynote: "Can we not remove
              the page tickets? This is already covered at 'concerts' in the
              same 'Show menu'". Ticket links stay on the concert entries
              themselves. */}

          {/* Live videos */}
          <div className="mt-20 border-t border-line pt-10">
            <Reveal variant="text">
              <h2 className="font-display text-3xl">Live videos</h2>
              {/* Keynote slide 17: "Remove — bass…and more", "sessions" → "more" */}
              <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
                Recordings from tours, theatres and more.
              </p>
              <p className="mt-5">
                <Link href="/shows/live-videos" className="btn-pill">
                  Watch live videos
                </Link>
              </p>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
