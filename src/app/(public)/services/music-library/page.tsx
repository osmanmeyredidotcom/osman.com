import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { getPageCopy } from "@/server/copy";
import { CopyInline, CopyText, splitCopy } from "@/components/public/CopyText";
import { Callout } from "@/components/public/Callout";
import { ReadMore } from "@/components/public/ReadMore";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
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
 * 4-11 feedback (N04-23/24/25): "What makes Osman Meyredi…" now follows the
 * headline with the one Get In Touch pill; the five-tracks paragraph and the
 * preview and licensing note sit above the players. No words changed.
 *
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

      {/* Opening — name, categories, the approved one-line promise, then
          (4-11 feedback, N04-23) "What makes Osman Meyredi’s work
          distinctive…" right after the headline instead of after the
          tracks, on the page's one left edge (slide: "Made this section
          consistent with rest of the pages"), its second paragraph under
          Read more as before. N04-25: instead of the longer red line, the
          Get In Touch pill follows it ("we can just have the button get in
          touch"), so the page has one enquiry button. */}
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
          <Reveal variant="text" delay={80}>
            <CopyText
              value={c("intro")}
              className="font-display mt-10 max-w-3xl text-2xl leading-snug text-ink sm:text-3xl"
            />
          </Reveal>
          <Reveal variant="text" delay={120}>
            <div className="mt-10 max-w-2xl">
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
            </div>
            <p className="mt-10">
              <TrackedLink
                href="/contact?type=ORIGINAL_TRACKS"
                event="service_inquiry_click"
                eventProps={{ service: "music-library", position: "intro" }}
                className="btn-pill"
                data-cursor="BOOK"
              >
                {c("ctaLabel")}
              </TrackedLink>
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Examples · 5 tracks. 4-11 feedback (N04-24): after the section
          divider, the paragraph about the five tracks and the preview and
          licensing note come BEFORE the players ("before they are going to
          listen"), the note set as a note; the ready-made library copy
          follows the players. Renders once tracks exist in the Studio
          catalogue, so the page never claims tracks it cannot play. */}
      {playable.length > 0 && (
        <section className="border-t border-line py-20 sm:py-24">
          <Container wide>
            <Reveal variant="text">
              <p className="max-w-2xl leading-relaxed text-ink-soft">
                <CopyInline value={c("examplesBody")} />
              </p>
              <p className="mt-6 text-sm leading-relaxed text-ink-soft">{c("previewNote")}</p>
            </Reveal>
            <Reveal variant="card" delay={80}>
              <div className="mt-12">
                <MusicPreviewVinyls tracks={playable} licenseLabel={c("licenseCta")} />
              </div>
            </Reveal>
          </Container>
          <Container wide className="mt-16">
            <div className="border-t border-line pt-12">
              <Reveal variant="text">
                {/* Ready-made library block (catch-up item 18, verbatim). */}
                <CopyText value={c("readyBlock")} className="max-w-2xl leading-relaxed text-ink" />
                <Callout className="mt-6">
                  <CopyInline value={c("readyClosing")} />
                </Callout>
              </Reveal>
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
