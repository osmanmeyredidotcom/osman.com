import type { Metadata } from "next";
import Image from "next/image";
import { getRepos } from "@/server/repositories";
import {
  agendaLink,
  formatAgendaDate,
  pastPublished,
  upcomingPublished,
} from "@/lib/events";
import type { EventRecord } from "@/lib/types";
import { breadcrumbJsonLd, JsonLd, musicEventJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { AgendaWall, type AgendaRow } from "@/components/public/AgendaWall";
import { ShowsSubnav } from "@/components/public/ShowsSubnav";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

/** Backdrop photo: Osman on stage, the same live shot as the homepage hero. */
const GIGS_BACKDROP = "/images/home-hero-landscape.jpg";

export const metadata: Metadata = {
  title: "Upcoming Gigs | Agenda",
  description:
    "Osman Meyredi's gig agenda: every upcoming concert, free gig and festival set, plus the nights already played.",
  alternates: { canonical: "/shows/gigs" },
};

function toRow(event: EventRecord, isPast: boolean): AgendaRow {
  return {
    id: event.id,
    dateLabel: formatAgendaDate(event.date),
    title: event.title,
    venue: event.venue,
    city: event.city,
    collaborators: event.collaborators,
    isPast,
    state: event.eventState,
    // Past events keep their place on the wall but never link out (stale
    // ticket pages must not look purchasable).
    link: isPast ? null : agendaLink(event),
    imageUrl: event.imageUrl,
    imageAlt: event.imageAlt,
    imageCredit: event.imageCredit,
  };
}

/**
 * Upcoming Gigs — precision pack 01. A typographic agenda wall in the
 * composition of the Black Star reference: future events bright, past events
 * ticked off and retained as performance history, the event itself the
 * interactive object, photos revealed through the shared preview layer.
 */
export default async function UpcomingGigsPage() {
  const events = await getRepos().events.list();
  const upcoming = upcomingPublished(events);
  const past = pastPublished(events);
  const rows: AgendaRow[] = [
    ...upcoming.map((e) => toRow(e, false)),
    ...past.map((e) => toRow(e, true)),
  ];

  return (
    <>
      <ShowsSubnav current="/shows/gigs" />
      <section className="relative isolate py-20 sm:py-24">
        {/* 25-09-2026: a live photo behind the wall at about 40% visibility,
            held in place while the dates scroll over it. */}
        <div className="gigs-backdrop" aria-hidden="true">
          <div className="gigs-backdrop-frame">
            <Image src={GIGS_BACKDROP} alt="" fill sizes="100vw" className="object-cover" />
          </div>
        </div>
        <Container wide>
          {/* Event JSON-LD for upcoming gigs only — past events stay on the
              wall visually but are never marked up as bookable (§35). */}
          {upcoming.map((event) => (
            <JsonLd key={event.id} data={musicEventJsonLd(event)} />
          ))}
          <JsonLd
            data={breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Shows", path: "/shows" },
              { name: "Upcoming gigs", path: "/shows/gigs" },
            ])}
          />

          <Reveal variant="text">
            <p className="eyebrow">Shows</p>
            <h1 className="display-caps mt-4 text-5xl sm:text-7xl">Upcoming gigs</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Concerts, free gigs and festival sets. Played nights stay on the wall.
            </p>
          </Reveal>

          <div className="mt-16 sm:mt-24">
            {rows.length > 0 ? (
              <Reveal variant="card" delay={100}>
                <AgendaWall rows={rows} />
              </Reveal>
            ) : (
              <Reveal variant="text" delay={100}>
                <p className="border-t border-line pt-8 text-ink-soft">
                  No dates are announced at the moment. New gigs land here first.
                </p>
              </Reveal>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
