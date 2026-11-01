import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { effectiveTicketing, upcomingPublished } from "@/lib/events";
import { breadcrumbJsonLd, JsonLd, musicEventJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";
import { ShowsSubnav } from "@/components/public/ShowsSubnav";
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
      <ShowsSubnav current="/shows/concerts" />
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

        <div className="mt-14">
          {upcoming.length > 0 ? (
            <Reveal variant="card" delay={120}>
              <EventList events={upcoming} />
            </Reveal>
          ) : (
            <Reveal variant="text" delay={120}>
              <div className="border-t border-line pt-8">
                {/* Keynote slide 16: lead with the positive — first sentence removed. */}
                <p className="max-w-xl leading-relaxed text-ink-soft">
                  New dates appear here as soon as they are confirmed. In the meantime, there
                  are{" "}
                  <Link href="/shows/gigs" data-cursor="DATES" className="u-link">
                    collaboration gigs
                  </Link>
                  ,{" "}
                  <Link href="/shows/live-videos" data-cursor="WATCH" className="u-link">
                    videos
                  </Link>{" "}
                  to watch,{" "}
                  <Link href="/music" data-cursor="LISTEN" data-cursor-style="disc" className="u-link">
                    releases
                  </Link>{" "}
                  to hear, and announcements on Osman&rsquo;s social channels. Links are in
                  the footer.
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
