import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { getPageCopy } from "@/server/copy";
import { CopyInline, CopyText } from "@/components/public/CopyText";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";
import { MusicPreviewVinyls, type PlayableTrack } from "@/components/public/MusicPreviewVinyls";
import { breadcrumbJsonLd, JsonLd, pageOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // Title kept service-accurate rather than keyword-led (§25); Studio-
  // editable via Pages → Original Scores & Custom Music.
  const c = await getPageCopy("service-original-scores");
  return {
    title: { absolute: c("seo.title") },
    description: c("seo.description"),
    alternates: { canonical: "/services/music-library" },
    openGraph: pageOpenGraph({
      title: c("seo.title"),
      description: c("seo.description"),
      path: "/services/music-library",
      image: "/images/services/production-studio.jpg",
      imageAlt: "Osman Meyredi at the keys in his studio",
      imageWidth: 1600,
      imageHeight: 893,
    }),
  };
}

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
  const [c, sv] = await Promise.all([
    getPageCopy("service-original-scores"),
    getPageCopy("services"),
  ]);
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
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: sv("scores.title"), path: "/services/music-library" },
        ])}
      />
      <ServicesSubnav current="/services/music-library" />
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              {sv("scores.title")}
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              {sv("scores.subtitle")}
            </p>
            <CopyText value={c("intro")} className="mt-6 text-xl leading-relaxed text-ink-soft" />
            {/* The red line — the document's marked text; the [Get in
                touch](…) link is part of the editable copy. */}
            <p className="mt-6 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
              <CopyInline value={c("redline")} />
            </p>
          </Reveal>
        </Container>

        <Container className="mt-16">
          <Reveal variant="text" delay={100}>
            <CopyText
              value={c("body")}
              firstClassName="leading-relaxed text-ink"
              className="mt-6 leading-relaxed text-ink"
            />
            {/* Catch-up pass (21-09-2026, item 18): the ready-made library
                paragraph, round-2 approved wording verbatim — it claims no
                external platform, and the five playable previews below
                substantiate it. */}
            <CopyText value={c("readyBlock")} className="mt-6 leading-relaxed text-ink" />
          </Reveal>
        </Container>

        {/* Examples · 5 tracks — the document's examples section, rendered
            once tracks exist in the Studio catalogue. Preview-tracks brief
            (20-09): the musicianship statement leads, each row is a vinyl
            micro-player, and the rights note closes the section. */}
        {playable.length > 0 && (
          <>
            <Container className="mt-20">
              <Reveal variant="text">
                <h2 className="eyebrow">{c("examplesHeading")}</h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
                  <CopyInline value={c("examplesBody")} />
                </p>
              </Reveal>
            </Container>
            <Container wide className="mt-12">
              <Reveal variant="text">
                <p className="font-display max-w-3xl text-2xl leading-snug sm:text-3xl">
                  {c("musicianship.heading")}
                </p>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
                  {c("musicianship.support")}
                </p>
              </Reveal>
            </Container>
            <Container wide className="mt-10">
              <Reveal variant="card" delay={80}>
                <MusicPreviewVinyls tracks={playable} licenseLabel={c("licenseCta")} />
              </Reveal>
              {/* Closing red line after browsing the previews (catch-up
                  item 18, second part of the block, verbatim). */}
              <p className="mt-8 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
                <CopyInline value={c("readyClosing")} />
              </p>
              <p className="mt-4 text-xs leading-relaxed text-ink-faint">{c("previewNote")}</p>
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
              {c("ctaLabel")} <span className="arrow-nudge" aria-hidden="true">→</span>
            </TrackedLink>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
