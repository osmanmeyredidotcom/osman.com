import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { effectiveTicketing, upcomingPublished } from "@/lib/events";
import { breadcrumbJsonLd, JsonLd, musicEventJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";
import { JunesNightHighlight } from "@/components/public/JunesNight";
import { junesNightIsUpcoming } from "@/data/junes-night";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

// 12-10 feedback round (SOLO_SHOWS.md): the destination is Solo Shows.
export const metadata: Metadata = {
  title: "Solo Shows | Upcoming ticketed shows",
  description:
    "Upcoming ticketed solo shows with Osman Meyredi: dates, venues and tickets for shows in the Netherlands, Italy and across Europe.",
  alternates: { canonical: "/shows/concerts" },
};

export default async function ShowsConcertsPage() {
  const allEvents = await getRepos().events.list();
  const upcoming = upcomingPublished(allEvents).filter(
    (e) => effectiveTicketing(e) === "TICKETED"
  );

  return (
    <>
      <section className="py-20 sm:py-28">
        <Container wide>
        {upcoming.map((event) => (
          <JsonLd key={event.id} data={musicEventJsonLd(event)} />
        ))}
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shows", path: "/shows" },
            { name: "Solo shows", path: "/shows/concerts" },
          ])}
        />

        <Reveal variant="text">
          <p className="eyebrow">Shows</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Solo shows</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Ticketed shows. Get your seat in advance.
          </p>
        </Reveal>

        {/* 2-11 (VP): June’s Night, the most important solo concert, above
            the regular solo dates. */}
        {junesNightIsUpcoming() && (
          <Reveal variant="card" delay={100}>
            <JunesNightHighlight position="solo-shows" headingLevel={2} className="mt-14" />
          </Reveal>
        )}

        <div className="mt-14">
          {upcoming.length > 0 ? (
            <Reveal variant="card" delay={120}>
              <EventList events={upcoming} />
            </Reveal>
          ) : (
            <Reveal variant="text" delay={120}>
              <div className="border-t border-line pt-8">
                {/* Keynote slide 16: lead with the positive — first sentence
                    removed. 19-11 (N19-09, Varsha: "this particular text says,
                    go back to collaboration gigs, videos and releases, which
                    we already have it here, tab"; Jolene: "new dates appear
                    here … fine, but the rest can go"): only the first
                    sentence stays; the Shows bar above carries the links. */}
                <p className="max-w-xl leading-relaxed text-ink-soft">
                  New dates appear here as soon as they are confirmed.
                </p>
              </div>
            </Reveal>
          )}
        </div>

        {/* 12-10 feedback (P20-X277 "Hide this section"): the past-shows
            archive is hidden here. The event records themselves stay in the
            Studio untouched. */}
      </Container>
      </section>
    </>
  );
}
