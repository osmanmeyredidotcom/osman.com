import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";
import { LibraryPlayer, type PlayableTrack } from "@/components/public/LibraryPlayer";
import { breadcrumbJsonLd, JsonLd, pageOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Title kept service-accurate rather than keyword-led (§25).
const PAGE_TITLE = "Original Scores & Custom Music | Osman Meyredi";
const PAGE_DESCRIPTION =
  "Every track is composed, performed and produced by Osman Meyredi personally, from the melody to the backing tracks, with no AI involved and nothing outsourced — for film, TV, documentary, events, online, series, adverts and radio.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/services/music-library" },
  openGraph: pageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/services/music-library",
    image: "/images/services/production-studio.jpg",
    imageAlt: "Osman Meyredi at the keys in his studio",
    imageWidth: 1600,
    imageHeight: 893,
  }),
};

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Original Scores & Custom Music", path: "/services/music-library" },
];

/**
 * Original Scores & Custom Music — Round 3 Keynote (20-09-2026): the
 * service's new name everywhere, with the entire text replaced from
 * "Original Scores_Final_Sep26.pages" verbatim. The document's "Save for
 * later" block (the Epidemic Sound library copy) is deliberately NOT
 * published yet, exactly as the document instructs. The "Examples · 5
 * tracks" section renders once tracks exist in the Studio, so the page
 * never claims tracks it cannot play. The route keeps its existing URL so
 * nothing breaks; only the public naming changes.
 */
export default async function MusicLibraryPage() {
  const tracks = (await getRepos().libraryTracks.list())
    .filter((t) => t.status === "PUBLISHED")
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder)
    .slice(0, 5);

  const playable: PlayableTrack[] = tracks.map((t) => ({
    slug: t.slug,
    title: t.title,
    genre: t.genre,
    moods: t.moods,
    useCases: t.useCases,
    durationSec: t.durationSec,
    audioUrl: t.audioUrl,
    featured: t.featured,
  }));

  return (
    <article>
      {/* BreadcrumbList (§37) — mirrors the visible Services sub-nav hierarchy. */}
      <JsonLd data={breadcrumbJsonLd(BREADCRUMBS)} />
      <ServicesSubnav current="/services/music-library" />
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              Original Scores &amp; Custom Music
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              Film · TV · Documentary · Events · Online · Series · Adverts · Radio
            </p>
            <p className="mt-6 text-xl leading-relaxed text-ink-soft">
              Every track is composed, performed and produced by Osman personally, from the
              melody to the backing tracks, with no AI involved and nothing outsourced.
            </p>
            {/* The red line — the document's marked text; "Get in touch"
                links to the contact form. */}
            <p className="mt-6 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
              Know exactly what you need?{" "}
              <TrackedLink
                href="/contact?type=ORIGINAL_TRACKS"
                event="service_inquiry_click"
                eventProps={{ service: "music-library", position: "hero" }}
                className="u-link"
              >
                Get in touch
              </TrackedLink>{" "}
              and there&rsquo;s a good chance it can be made.
            </p>
          </Reveal>
        </Container>

        <Container className="mt-16">
          <Reveal variant="text" delay={100}>
            <p className="leading-relaxed text-ink">
              What makes Osman Meyredi&rsquo;s work distinctive is that he can take different
              styles, instruments and influences and make them sound as though they belong
              together. That&rsquo;s exactly why writing something new is where the real work
              happens, especially for film, series and TV, where music isn&rsquo;t decoration,
              it&rsquo;s part of how a story is told. It needs to carry a feeling the pictures
              alone can&rsquo;t, land in exactly the right moment, and come from a proper
              briefing rather than a search filter.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              More classical, more jazzy, cinematic, stripped back to just piano, whatever the
              scene calls for. That&rsquo;s where a first conversation about the vision starts,
              and from there, the track takes shape around it.
            </p>
          </Reveal>
        </Container>

        {/* Examples · 5 tracks — the document's examples section, rendered
            once tracks exist in the Studio catalogue. */}
        {playable.length > 0 && (
          <>
            <Container className="mt-20">
              <Reveal variant="text">
                <h2 className="eyebrow">Examples · 5 tracks</h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
                  These five tracks are just a taste of what&rsquo;s possible, not the limit of
                  it. For a fuller sense of his range, from solo piano to full live sets, see
                  his{" "}
                  <Link href="/shows/live-videos" className="u-link">
                    live videos
                  </Link>
                  . And whatever direction you need, every style, mood or arrangement can be
                  shaped entirely around your project.
                </p>
              </Reveal>
            </Container>
            <Container wide className="mt-10">
              <Reveal variant="card" delay={80}>
                <LibraryPlayer tracks={playable} />
              </Reveal>
            </Container>
          </>
        )}
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <Reveal variant="text">
            <TrackedLink
              href="/contact?type=ORIGINAL_TRACKS"
              event="service_inquiry_click"
              eventProps={{ service: "music-library", position: "footer" }}
              className="btn-pill"
              data-cursor="WORK"
            >
              Work with Osman <span className="arrow-nudge" aria-hidden="true">→</span>
            </TrackedLink>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
