import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { getPageCopy } from "@/server/copy";
import { CopyInline, CopyText } from "@/components/public/CopyText";
import { READING_COLUMN } from "@/components/public/BioTemplate";
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
          consistent with rest of the pages"). N04-25: instead of the longer red line, the
          Get In Touch pill follows it ("we can just have the button get in
          touch"), so the page has one enquiry button.
          19-11 (N19-08, Varsha: "having all of these text up right here and
          then we have a get in touch button"; Jolene: "then at least they
          already have all the information"): the ready-made library
          paragraph moved up from under the samples into this group, before
          the one Get In Touch button. The text column is the Bio template's
          reading column (N19-05).
          22-11 (VP, "from here as well", after Concerts: "remove read more
          less from here just let the text be here normally"): the main
          text's second paragraph no longer sits under Read more; the main
          text and the library paragraph read as one text, a paragraph
          apart.
          22-11 (VP: "this is the opening of this page and it feels like
          there is nothing below all this, ramp up the text below so it
          looks like there is something below as well, make this responsive
          for all screen sizes"): the opening starts as high as on the other
          service pages (the Bio template's 56 / 64px under the section
          bar, was 80 / 112px) and ends 40px under the pill (was 80 /
          112px), so the five-tracks text below follows the pill by 80px
          (40px either side of the section line) instead of about 210px.
          Without tracks there is nothing below, so the opening keeps its
          old closing space above the footer. */}
      <section className={`pt-14 sm:pt-16 ${playable.length > 0 ? "pb-10" : "pb-20 sm:pb-28"}`}>
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
              className={`font-display mt-10 ${READING_COLUMN} text-2xl leading-snug text-ink sm:text-3xl`}
            />
          </Reveal>
          <Reveal variant="text" delay={120}>
            <div className={`mt-10 space-y-6 ${READING_COLUMN}`}>
              <CopyText value={c("body")} className="leading-relaxed text-ink" />
              {/* Ready-made library paragraph (catch-up item 18, verbatim),
                  here since 19-11 (N19-08); shown once tracks exist, as
                  before. */}
              {playable.length > 0 && (
                <CopyText value={c("readyBlock")} className="leading-relaxed text-ink" />
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
          listen"), the note set as a note. 19-11 (N19-07, Jolene: "These 5
          tracks below are just a taste of what's possible"; N19-08): the
          section ends with the players. The ready-made library paragraph
          moved up, and its closing "get in touch" link ("where you hover
          over where it gets red is not needed anymore") is gone; the one
          Get In Touch button above covers it. Renders once tracks exist in
          the Studio catalogue, so the page never claims tracks it cannot
          play. 22-11 (VP): 40px above the text at every size (was 80 /
          96px), so it shows under the opening on the first screen; the
          players keep their spacing. */}
      {playable.length > 0 && (
        <section className="border-t border-line pt-10 pb-20 sm:pb-24">
          <Container wide>
            <Reveal variant="text">
              <p className={`${READING_COLUMN} leading-relaxed text-ink-soft`}>
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
        </section>
      )}
    </article>
  );
}
