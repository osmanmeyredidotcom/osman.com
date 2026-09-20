import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { effectiveTicketing, upcomingPublished, pastPublished } from "@/lib/events";
import { breadcrumbJsonLd, JsonLd, musicEventJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";
import { ShowsSubnav } from "@/components/public/ShowsSubnav";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Concerts | Upcoming ticketed shows",
  description:
    "Upcoming ticketed concerts with Osman Meyredi: dates, venues and tickets for shows in the Netherlands, Italy and across Europe.",
  alternates: { canonical: "/shows/concerts" },
};

export default async function ShowsConcertsPage() {
  const allEvents = await getRepos().events.list();
  const upcoming = upcomingPublished(allEvents).filter(
    (e) => effectiveTicketing(e) === "TICKETED"
  );
  const past = pastPublished(allEvents)
    .filter((e) => effectiveTicketing(e) === "TICKETED")
    .slice(0, 10);

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
            { name: "Concerts", path: "/shows/concerts" },
          ])}
        />

        <Reveal variant="text">
          <p className="eyebrow">Shows</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Concerts</h1>
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
                  <Link href="/shows/gigs" className="u-link">
                    live gigs
                  </Link>
                  ,{" "}
                  <Link href="/shows/live-videos" className="u-link">
                    live videos
                  </Link>{" "}
                  to watch,{" "}
                  <Link href="/music" className="u-link">
                    releases
                  </Link>{" "}
                  to hear, and announcements on Osman&rsquo;s social channels. Links are in
                  the footer.
                </p>
              </div>
            </Reveal>
          )}
        </div>

        {past.length > 0 && (
          <div className="mt-24">
            <Reveal variant="text">
              <h2 className="eyebrow">Past concerts</h2>
              <div className="mt-6">
                <EventList events={past} variant="archive" />
              </div>
            </Reveal>
          </div>
        )}
      </Container>
      </section>
    </>
  );
}
