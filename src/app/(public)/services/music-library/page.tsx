import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { getPageCopy } from "@/server/copy";
import { CopyInline, CopyText, splitCopy } from "@/components/public/CopyText";
import { Callout } from "@/components/public/Callout";
import { ReadMore } from "@/components/public/ReadMore";
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
          {/* 12-10 feedback (CUSTOM_MUSIC.md / AV-15): the duplicated
              examples block and the stray five-tracks claim are gone — the
              page moves straight from the opening to the sample players. */}
          <Container wide>
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

      {/* How custom music works — 12-10 feedback (P17-X260 "Same as about us
          page. No image. No 2 column text. One column like about with read
          more button."): the closing narrative reads as one column, image
          free, with the opening paragraph visible and the rest under Read
          more (cut point and exact casing still open as Q4 — first paragraph
          chosen as the conservative default). The closing CTA follows its
          explanatory paragraph directly (AV-17); the button-only full-width
          section is gone. */}
      <section className="border-t border-line py-20 sm:py-24">
        <Container wide>
          <div className="mx-auto max-w-2xl">
            <Reveal variant="text">
              {bodyParas.length > 0 && (
                <CopyText value={bodyParas[0]} className="leading-relaxed text-ink" />
              )}
              {bodyParas.length > 1 && (
                <ReadMore className="mt-7">
                  <div className="space-y-6">
                    {bodyParas.slice(1).map((para, i) => (
                      <CopyText key={i} value={para} className="leading-relaxed text-ink" />
                    ))}
                  </div>
                </ReadMore>
              )}
              <p className="mt-10">
                <TrackedLink
                  href="/contact?type=ORIGINAL_TRACKS"
                  event="service_inquiry_click"
                  eventProps={{ service: "music-library", position: "closing" }}
                  className="btn-pill"
                  data-cursor="WORK"
                >
                  {c("ctaLabel")}
                </TrackedLink>
              </p>
            </Reveal>
          </div>
        </Container>
      </section>
    </article>
  );
}
