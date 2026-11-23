import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import type { EventRecord } from "@/lib/types";
import { effectiveTicketing, formatAgendaDate, pastPublished, upcomingPublished } from "@/lib/events";
import { pageOpenGraph } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";
import { JunesNightHighlight } from "@/components/public/JunesNight";
import { junesNightIsUpcoming } from "@/data/junes-night";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

// §23 title direction for the Shows section; 12-10 feedback round naming
// (Solo Shows · Collaboration gigs · Videos).
const PAGE_TITLE = "Osman Meyredi | Solo Shows & Collaboration Gigs";
const PAGE_DESCRIPTION =
  "Where to hear Osman Meyredi live: solo shows, collaboration gigs with free entry and a gallery of videos.";

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
/* 19-11 (N19-15, the double line): right under the upcoming dates, whose
   list already ends on a line, the first past row draws no line of its own. */
function PastRows({ events, afterList = false }: { events: EventRecord[]; afterList?: boolean }) {
  if (events.length === 0) return null;
  return (
    <ul className="mt-6">
      {events.map((event, i) => (
        <li
          key={event.id}
          className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 border-line py-3 text-sm text-ink-faint ${
            afterList && i === 0 ? "" : "border-t"
          }`}
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
      <section className="py-20 sm:py-28">
        <Container wide>
          {/* 12-10 feedback (A-SHOWS-01): the redundant Hear-it-live
              introduction is removed — the page opens on its destinations.
              The silhouette banner (P18-X263, blue background edited to the
              palette red) takes this opening once Varsha's approved asset
              arrives (Q3); until then nothing is invented in its place. */}
          <Reveal variant="text">
            <p className="eyebrow">Shows</p>
            <h1 className="sr-only">Shows</h1>
          </Reveal>

          {/* Solo shows */}
          <div className="mt-12">
            <Reveal variant="text">
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="font-display text-3xl">Solo shows</h2>
                <Link
                  href="/shows/concerts"
                  data-cursor="DATES"
                  className="u-link text-sm hover:text-accent-strong"
                >
                  All solo shows
                </Link>
              </div>
            </Reveal>
            {/* 2-11 (VP): June’s Night leads the solo shows. */}
            {junesNightIsUpcoming() && (
              <Reveal variant="card" delay={100}>
                <JunesNightHighlight position="shows" className="mt-8" />
              </Reveal>
            )}
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
                <PastRows events={pastConcerts} afterList={concerts.length > 0} />
              </Reveal>
            </div>
          </div>

          {/* Collaboration gigs */}
          <div className="mt-20">
            <Reveal variant="text">
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="font-display text-3xl">Collaboration gigs</h2>
                <Link
                  href="/shows/gigs"
                  data-cursor="DATES"
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
                  {/* P19-X272 (confirmed): gig rows with a real ticket link
                      also offer Tickets on this page. */}
                  <EventList events={gigs} gigTickets />
                </Reveal>
              ) : (
                <Reveal variant="text" delay={120}>
                  <p className="border-t border-line pt-6 text-ink-soft">
                    No shows are announced at the moment. New dates land here first.
                  </p>
                </Reveal>
              )}
              <Reveal variant="text" delay={140}>
                <PastRows events={pastGigs} afterList={gigs.length > 0} />
              </Reveal>
            </div>
          </div>

          {/* Tickets section removed — Round 3 Keynote: "Can we not remove
              the page tickets? This is already covered at 'concerts' in the
              same 'Show menu'". Ticket links stay on the concert entries
              themselves. */}

          {/* Videos section removed — 4-11 feedback (N04-26, "I don't really
              think we should have this section here because we do have
              videos" / "You can remove videos from this concert live gig
              page"). The Videos page stays one tap away in the Shows sub-nav
              above (sticky, N04-27) and in the footer. */}
        </Container>
      </section>
    </>
  );
}
