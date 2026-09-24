import type { Metadata } from "next";
import Image from "next/image";
import { getRepos } from "@/server/repositories";
import { getPageCopy } from "@/server/copy";
import { CopyInline, CopyText, splitCopy } from "@/components/public/CopyText";
import { Callout } from "@/components/public/Callout";
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
 * Original Scores & Custom Music — restructure round (23-09-2026): this was
 * the most text-heavy page on the site (an eight-paragraph run before any
 * media). Same approved copy ("Original Scores_Final_Sep26.pages" +
 * catch-up additions, all Studio-editable), new order per the feedback
 * (§17): concise opening statement, then the vinyl previews immediately —
 * the music carries the page — with the library copy grouped around the
 * player, and the "how custom music works" narrative following as an
 * image-beside-text chapter. The "Save for later" (Epidemic Sound) block
 * stays unpublished, exactly as the source document instructs.
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

  // The approved narrative ("body" field) laid out as an image-beside-text
  // chapter — paragraph groups adapt to whatever an editor keeps in the
  // field (§38).
  const bodyParas = splitCopy(c("body"));

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

      {/* Opening — name, categories, the approved one-line promise as
          display type, and the document's red line. Nothing else before
          the music. */}
      <section className="py-20 sm:py-28">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              {sv("scores.title")}
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              {sv("scores.subtitle")}
            </p>
          </Reveal>
          {/* Cohesion pass (§24): eyebrow, H1, categories, key statement and
              the red-line all share ONE left edge — no drifting offsets. */}
          <Reveal variant="text" delay={80}>
            <CopyText
              value={c("intro")}
              className="font-display mt-10 max-w-3xl text-2xl leading-snug text-ink sm:text-3xl"
            />
          </Reveal>
          <Reveal variant="text" delay={140}>
            {/* The red line — the document's marked text; the [Get in
                touch](…) link is part of the editable copy. */}
            <Callout className="mt-8">
              <CopyInline value={c("redline")} />
            </Callout>
          </Reveal>
        </Container>
      </section>

      {/* Examples · 5 tracks — the vinyl previews lead the page now (§17):
          musicianship statement, the players, then every piece of library
          copy grouped around what it describes. Renders once tracks exist
          in the Studio catalogue, so the page never claims tracks it
          cannot play. */}
      {playable.length > 0 && (
        <section className="border-t border-line py-20 sm:py-24">
          <Container wide>
            <Reveal variant="text">
              <h2 className="eyebrow">{c("examplesHeading")}</h2>
              <p className="font-display mt-6 max-w-3xl text-2xl leading-snug sm:text-3xl">
                {c("musicianship.heading")}
              </p>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
                {c("musicianship.support")}
              </p>
            </Reveal>
          </Container>
          <Container wide className="mt-12">
            <Reveal variant="card" delay={80}>
              <MusicPreviewVinyls tracks={playable} licenseLabel={c("licenseCta")} />
            </Reveal>
          </Container>
          <Container wide className="mt-16">
            {/* Cohesion pass (§29): the two lower blocks share one grid —
                equal columns, same top baseline, same reading width. */}
            <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-2 md:gap-x-12">
              <Reveal variant="text">
                {/* "Just a taste" — the approved note, now after hearing
                    the tracks rather than before them. */}
                <p className="max-w-xl leading-relaxed text-ink-soft">
                  <CopyInline value={c("examplesBody")} />
                </p>
              </Reveal>
              <Reveal variant="text" delay={90}>
                {/* Ready-made library block (catch-up item 18, verbatim) —
                    grouped with the previews it describes. */}
                <CopyText value={c("readyBlock")} className="max-w-xl leading-relaxed text-ink" />
                <Callout className="mt-6">
                  <CopyInline value={c("readyClosing")} />
                </Callout>
              </Reveal>
            </div>
            <p className="mt-10 text-xs leading-relaxed text-ink-faint">{c("previewNote")}</p>
          </Container>
        </section>
      )}

      {/* How custom music works — the approved narrative beside the studio
          image ("everything is composed and produced in his own studio"),
          as a reading chapter after the listening. */}
      <section className="border-t border-line py-20 sm:py-24">
        <Container wide>
          <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-x-12">
            <Reveal variant="media" className="md:col-span-6">
              <div className="media-zoom border border-line">
                <Image
                  src="/images/services/production-studio.jpg"
                  alt="Osman Meyredi at the keys in his studio"
                  width={1600}
                  height={893}
                  sizes="(min-width: 768px) 40rem, 96vw"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
            <Reveal variant="text" delay={90} className="md:col-span-5 md:col-start-8">
              {bodyParas.map((para, i) => (
                <CopyText
                  key={i}
                  value={para}
                  className={i === 0 ? "leading-relaxed text-ink" : "mt-6 leading-relaxed text-ink"}
                />
              ))}
            </Reveal>
          </div>
        </Container>
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
