import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getRepos } from "@/server/repositories";
import { getPageCopy, getStoredCopy } from "@/server/copy";
import { GALLERY_PAGE_ID, GALLERY_SLOTS } from "@/data/page-copy";
import { HOME_GALLERY, type GalleryImage } from "@/data/home-gallery";
import { upcomingPublished } from "@/lib/events";
import { JsonLd, pageOpenGraph, personJsonLd, videoJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { CopyText } from "@/components/public/CopyText";
import { VideoEmbed } from "@/components/public/VideoEmbed";
import { EventList } from "@/components/public/EventList";
import { IntroMovieReveal } from "@/components/public/IntroMovieReveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { RecordSleeve } from "@/components/public/RecordSleeve";
import { HomeScrollGallery } from "@/components/public/HomeScrollGallery";
import { JunesNightHighlight } from "@/components/public/JunesNight";
import { junesNightIsUpcoming } from "@/data/junes-night";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { RecordShelfCarousel } from "@/components/public/RecordShelfCarousel";
import { byReleaseDateDesc } from "@/lib/releaseOrder";

/** Keynote slides 2/23: the approved instrument list. */
const INSTRUMENTS = [
  "Double bass",
  "Bass guitar",
  "Piano",
  "Keyboard",
  "Synthesiser",
  "Guitar",
  "Drums",
  "Percussion",
];

export const dynamic = "force-dynamic";

/**
 * Home metadata — SEO foundation §23 title direction, adjusted to the
 * approved wording: the client's Final About Content says "Italian-born",
 * so the title says Italian-Born rather than the brief's "Italian"
 * (§23: "verify every descriptor against the latest approved content").
 */
export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageCopy("home");
  return {
    title: { absolute: c("seo.title") },
    description: c("seo.description"),
    alternates: { canonical: "/" },
    openGraph: pageOpenGraph({
      title: c("seo.title"),
      description: c("seo.description"),
      path: "/",
      image: c("hero.image"),
      imageAlt: c("hero.imageAlt"),
    }),
  };
}

const RELEASE_TYPE_LABELS = {
  SINGLE: "Single",
  EP: "EP",
  ALBUM: "Album",
  COLLABORATION: "Collaboration",
} as const;

export default async function HomePage() {
  const repos = getRepos();
  const [settings, allEvents, allReleases, allMedia, c, storedCopy] =
    await Promise.all([
      repos.settings.get(),
      repos.events.list(),
      repos.releases.list(),
      repos.media.list(),
      getPageCopy("home"),
      getStoredCopy(),
    ]);

  // Homepage gallery: Studio slot overrides merged over the approved set
  // (Pages → Homepage gallery). An emptied src hides that slot.
  const galleryImages: GalleryImage[] = [];
  for (let n = 1; n <= GALLERY_SLOTS; n++) {
    const d = HOME_GALLERY[n - 1];
    const slot = (part: string): string | undefined => {
      const v = storedCopy[`${GALLERY_PAGE_ID}.slot${n}.${part}`];
      return v == null || v === "" ? undefined : v;
    };
    const src = slot("src") ?? d?.src;
    const stored = ["src", "alt", "aspect", "width", "height"].some((p2) =>
      Object.prototype.hasOwnProperty.call(storedCopy, `${GALLERY_PAGE_ID}.slot${n}.${p2}`)
    );
    // A slot the Studio explicitly emptied stays hidden even if a default exists.
    if (stored && slot("src") === undefined) continue;
    if (!src) continue;
    const aspectRaw = slot("aspect") ?? d?.aspect ?? "portrait";
    const aspect: GalleryImage["aspect"] =
      aspectRaw === "landscape-wide" || aspectRaw === "landscape" ? aspectRaw : "portrait";
    galleryImages.push({
      src,
      alt: slot("alt") ?? d?.alt ?? "",
      aspect,
      width: Number(slot("width") ?? d?.width ?? 1400),
      height: Number(slot("height") ?? d?.height ?? 1400),
      temporary: d?.temporary ?? false,
      // The slight zoom belongs to the default photo; a Studio replacement
      // shows unzoomed at its own aspect ratio.
      zoom: src === d?.src ? d?.zoom : undefined,
      focus: src === d?.src ? d?.focus : undefined,
    });
  }

  const nextDates = upcomingPublished(allEvents).slice(0, 5);
  // 2-11 (VP): June’s Night (2 June 2028) leads On stage soon until it's played.
  const showJunesNight = junesNightIsUpcoming();
  const releases = allReleases
    .filter((r) => r.status === "PUBLISHED" && r.rightsStatus !== "DO_NOT_PUBLISH")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const featuredRelease = releases.find((r) => r.featured) ?? releases[0] ?? null;
  const mediaItems = allMedia.filter((m) => m.status === "PUBLISHED");
  const featuredMedia = mediaItems.find((m) => m.featured) ?? mediaItems[0] ?? null;

  const socialUrls = [
    settings.instagramUrl,
    settings.youtubeUrl,
    settings.tiktokUrl,
    settings.linkedinUrl,
    settings.facebookUrl,
  ].filter((u): u is string => Boolean(u));

  const rawListenLinks: { label: string; href: string | null }[] = featuredRelease
    ? [
        { label: "Spotify", href: featuredRelease.spotifyUrl },
        { label: "Apple Music", href: featuredRelease.appleMusicUrl },
        { label: "Bandcamp", href: featuredRelease.bandcampUrl },
        { label: "YouTube", href: featuredRelease.youtubeUrl },
      ]
    : [];
  const listenLinks = rawListenLinks.filter(
    (l): l is { label: string; href: string } => Boolean(l.href)
  );

  return (
    <>
      <JsonLd data={personJsonLd(socialUrls)} />

      {/* Announcement */}
      {settings.announcement && (
        <div className="border-b border-line bg-canvas-soft">
          <Container wide>
            <p className="py-3 text-center text-sm text-ink-soft">{settings.announcement}</p>
          </Container>
        </div>
      )}

      {/* Hero V3 — Round 2 Keynote slide 2: landscape image-led landing in
          the adele.com direction. No giant OSMAN MEYREDI repetition (the
          header logotype carries the identity); the supplied landscape live
          shot leads. h1 stays for accessibility/SEO but is visually hidden.
          12-10 feedback round (P03-X213/215): the hero image itself carries
          no logo or logomark, and the artist line with the existing controls
          sits at the image's bottom left. On small screens the image is too
          shallow for an overlay, so the same block stays in the flow above
          it; nothing is duplicated. */}
      <section className="border-b border-line">
        <Container wide>
          <h1 className="sr-only">Osman Meyredi</h1>
        </Container>
        <div className="relative">
          {/* 22-10 correction (item 1 / X215), restored 2-11 (VP: "place the
              section in the image to the original place, on the bottom
              left"): the artist line and controls sit as one stacked group
              in the image's bottom-LEFT corner, taking althome's
              .ah-hero-foot/.ah-hero-meta as the reference — 42rem max width,
              althome's viewport-edge insets (clamp 20–56px from the left,
              20–44px from the bottom) and its legibility gradient rising
              from the bottom. November's top-left move (N1c) is undone. On
              small screens the image is too shallow for an overlay, so the
              same block stays in the flow above it; nothing is duplicated. */}
          <div className="hero-foot md:absolute md:inset-x-0 md:bottom-0 md:z-10">
            <div className="mx-auto w-full max-w-(--container-site) px-5 sm:px-8 md:max-w-none md:px-[clamp(20px,3.5vw,56px)]">
              <div className="hero-meta-in grid max-w-2xl gap-y-[1.15rem] pt-10 pb-8 sm:pt-12 md:pt-28 md:pb-[clamp(20px,3vw,44px)]">
                {/* Keynote slide 2 exact role wording, dots between roles. */}
                <p className="eyebrow leading-relaxed">{c("roles")}</p>
                <div className="flex flex-wrap items-center gap-6">
                  <Link href="/shows" data-cursor="DATES" className="btn-pill">
                    See dates
                  </Link>
                  {/* Round 3 header slide: capital I — "Booking & Inquiries". */}
                  <Link href="/contact" data-cursor="BOOK" className="u-link text-sm">
                    Booking &amp; Inquiries
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Landscape hero — full-bleed width, masked reveal, quiet ambient
              drift retained. 2-11 (VP): the photograph is now the NDSM kade
              portrait by Joyce van Doorn (JVDPhotography, 29-10-2026),
              cropped to 16:9 from the top-left 4800 × 2700 of the 6000 ×
              4002 frame: Osman Meyredi sits on the right third with
              headroom, so on tablets the top-left artist line stays clear of
              his hair, and the dark wall carries the text.
              It supersedes the client-supplied performance photograph
              (Aditya, 11-09-2026), which stays on the gigs backdrop and as
              the default share image. Studio: Pages → Home → Hero image. */}
          <div className="hero-image-mask">
            <div className="hero-image-inner">
              <div className="hero-ambient">
                <div className="relative" style={{ aspectRatio: "1920 / 1080" }}>
                  <Image
                    src={c("hero.image")}
                    alt={c("hero.imageAlt")}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instruments strip — one quiet marquee, part of the composition */}
      <div className="border-b border-line py-5">
        <Marquee duration={56} label="Instruments and disciplines">
          {INSTRUMENTS.map((label) => (
            <span key={label} className="flex items-center text-sm tracking-[0.18em] text-ink-faint uppercase">
              <span className="px-6">{label}</span>
              <span aria-hidden="true" className="text-line-dark">·</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Next dates */}
      <section className="border-t border-line py-24">
        <Container wide>
          <Reveal variant="text">
            {/* 2-11 (VP): "All dates" is the hero's See dates pill (btn-pill),
                not an underlined link, sitting on the heading's bottom line. */}
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Next dates</p>
                <h2 className="font-display mt-3 text-3xl sm:text-4xl">On stage soon</h2>
              </div>
              <Link href="/shows" data-cursor="DATES" className="btn-pill shrink-0">
                All dates
              </Link>
            </div>
          </Reveal>
          {/* 2-11 (VP): June’s Night, the most important solo concert, as
              its own highlight above the regular dates (not repeated as a
              row). It goes once the night has been played. */}
          {showJunesNight && (
            <Reveal variant="card" delay={80}>
              <JunesNightHighlight position="home" className="mt-10" />
            </Reveal>
          )}
          <div className="mt-10">
            {nextDates.length > 0 ? (
              <Reveal variant="card" delay={120}>
                <EventList events={nextDates} />
              </Reveal>
            ) : (
              <p className="border-t border-line pt-6 text-ink-soft">
                {showJunesNight
                  ? "More dates appear here as soon as they are confirmed. In the meantime, there is plenty to"
                  : "No public dates are in the diary right now. In the meantime, there is plenty to"}{" "}
                <Link href="/shows/live-videos" data-cursor="WATCH" className="u-link">
                  watch
                </Link>{" "}
                and{" "}
                <Link href="/music" data-cursor="LISTEN" data-cursor-style="disc" className="u-link">
                  listen to
                </Link>
                .
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Featured music (Headztones direction): one release dominates —
          sticky oversized sleeve, condensed display title, vinyl slides out
          on hover, listen platforms as drawn-border actions. */}
      {featuredRelease && (
        <section className="feat-hover group/feat border-t border-line bg-canvas-soft py-24">
          <Container wide>
            <Reveal variant="text">
              <p className="eyebrow">Featured release</p>
            </Reveal>
            <div className="mt-12 grid items-start gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="lg:sticky lg:top-24">
                <RecordSleeve
                  title={featuredRelease.title}
                  year={featuredRelease.year}
                  tone="#a34b46"
                  artworkUrl={featuredRelease.artworkUrl}
                  withVinyl
                  vinylClassName="transition-transform duration-500 ease-(--ease-out-cubic) group-hover/feat:translate-x-[16%]"
                  className="pr-[14%]"
                />
              </div>
              <div>
                {featuredRelease.relationshipType !== "OWN_RELEASE" &&
                  featuredRelease.primaryArtistName && (
                    <p className="tabular text-sm tracking-[0.18em] text-ink-soft uppercase">
                      {featuredRelease.primaryArtistName}
                    </p>
                  )}
                <h2 className="display-caps mt-2 text-5xl sm:text-6xl xl:text-7xl">
                  {featuredRelease.title}
                </h2>
                <p className="tabular mt-4 text-sm tracking-wide text-ink-faint uppercase">
                  {featuredRelease.relationshipType === "COLLABORATION_RELEASE"
                    ? "Collaboration / band project"
                    : featuredRelease.relationshipType === "CONTRIBUTING_ARTIST"
                      ? "Appears on"
                      : RELEASE_TYPE_LABELS[featuredRelease.releaseType]}
                  {featuredRelease.year ? ` · ${featuredRelease.year}` : ""}
                </p>
                {featuredRelease.osmanCredit && (
                  <p className="mt-2 text-sm text-ink-soft">{featuredRelease.osmanCredit}</p>
                )}
                {featuredRelease.description && (
                  <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">
                    {featuredRelease.description}
                  </p>
                )}
                {featuredRelease.credits && !featuredRelease.osmanCredit && (
                  <p className="mt-3 text-sm text-ink-faint">{featuredRelease.credits}</p>
                )}
                {listenLinks.length > 0 && (
                  <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
                    {listenLinks.map((l) => (
                      <li key={l.label}>
                        <TrackedLink
                          href={l.href}
                          external
                          event="listen_click"
                          eventProps={{ platform: l.label, release: featuredRelease.slug }}
                          data-cursor="LISTEN"
                          data-cursor-style="disc"
                          className="platform-link text-sm font-medium tracking-wide uppercase"
                        >
                          {l.label}
                        </TrackedLink>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-8">
                  <Link href="/music" data-cursor="VIEW" className="u-link text-sm hover:text-accent-strong">
                    The full discography
                  </Link>
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* November feedback (N1a): the intro movie and the image gallery swap
          places — the reveal band now follows the featured release, the
          gallery moves to the bottom of the page (just above the press band). */}
      {/* 22-10 item 4: the homepage intro movie, revealed in althome's intro
          manner with the OM monogram (the vinyl menu icon's mark) in place of
          the name text. The web rendition is derived from the supplied
          Final_Homepage_IntroMovie.mov; the original stays untouched in the
          client's folder. */}
      <IntroMovieReveal
        videoSrc="/videos/home-intro.mp4"
        poster="/images/videos/home-intro-poster.jpg"
      />

      {/* 12-10 feedback round (P03-X225): the homepage Bio teaser is removed.
          The Bio itself lives on /about, reachable from the menu and footer. */}

      {/* RECORDS — Round 3 Keynote: back to the sleeve treatment where the
          vinyl comes out of its cover, and no turning. The Disco Sparks
          "Keep Your Eye on the Sparrow" was removed from the set (its
          Special 45 stays). 31-10 (HOMEPAGE_RECORDS_CAROUSEL_RESTORE): the
          same set as one horizontal shelf, newest release first by release
          date, each disc already out of its sleeve at rest. */}
      {/* 1-11 (records scrolling brief): the shelf owns its section so the
          label and heading stay in view while it pins and page scrolling
          moves the records, as in the photo gallery below. */}
      {releases.length > 0 && (
        <RecordShelfCarousel
          releases={[...releases].sort(byReleaseDateDesc)}
          heading={
            <>
              <p className="eyebrow" style={{ color: "var(--color-ink-faint)" }}>
                The records
              </p>
              <h2 className="display-caps mt-3 text-4xl sm:text-5xl">
                Spin through the shelf
              </h2>
            </>
          }
        />
      )}

      {/* 12-10 feedback round (P03-X229): the collaborations/projects teaser
          is removed from the homepage; the full story stays on /music. */}

      {/* 22-10 correction (item 4, VP 22-10): the approved OM curtain/intro
          asset has arrived as Final_Homepage_IntroMovie, so the featured-video
          band that held the X217-reserved slot "until it arrives" is gone, and
          the reveal band sat at the bottom of the page, per the clarified
          placement — until November (N1a) moved it up after the featured
          release and gave its old place to the gallery. */}

      {/* 12-10 feedback round: the shop teaser (P03-X239, final reply in its
          thread) and the bottom booking button (P03-X241) are removed. The
          shop route stays reachable directly; booking lives in the header
          and on /contact. */}

      {/* Homepage gallery — Adele-reference scrolling gallery (brief
          20-09-2026), fully replacing the former "Four ways to work with
          Osman Meyredi" services overview in this slot. Services remain
          reachable through the menu and /services pages. The image set is
          the approved temporary selection from the master content folder —
          see docs/home-gallery-manifest-2026-09-20.md for sources and how
          to swap in the final curated photos. */}
      <HomeScrollGallery images={galleryImages} />

      {/* Press — November feedback (N1b): the last section before the
          footer, highlighted with a palette background — charcoal #2A2A2A
          (the approved palette's second tone, site token --color-line).
          1-11 correction: the section heading is the publication name
          (Corriere del Trentino), as a real h2 in the "On stage soon"
          heading style (font-display text-3xl sm:text-4xl) instead of a
          small eyebrow; the article title follows as its h3. 2-11 (VP): the
          title steps down one size from the heading to the site's article-
          title size (text-2xl leading-snug sm:text-3xl), the size of the
          press titles on /media and the record titles above. 2-11 (VP): the
          heading takes the palette red. #C15F58 (accent-strong), not
          #A34B46: on the charcoal it reads 3.45:1, above the 3:1 for large
          text (#A34B46 would be 2.5:1). Approved press text and links
          unchanged. */}
      {featuredMedia && (
        <section className="press-band bg-line py-24">
          <Container>
            <Reveal variant="text">
              <h2 className="font-display text-3xl text-accent-strong sm:text-4xl">
                {featuredMedia.publication}
              </h2>
              <h3 className="font-display mt-4 text-2xl leading-snug sm:text-3xl">
                {featuredMedia.headline}
              </h3>
              <p className="mt-6">
                <a
                  href={featuredMedia.articleUrl}
                  target="_blank"
                  rel="noopener"
                  className="u-link text-sm hover:text-accent-strong"
                  data-cursor="READ"
                >
                  Read the article
                </a>
                <Link href="/media" data-cursor="VIEW" className="u-link ml-6 text-sm text-ink-soft">
                  All press
                </Link>
              </p>
            </Reveal>
          </Container>
        </section>
      )}

      {/* Interview — 2-11 (VP): the Storytime · Evoluzione Radio interview
          (28-10-2026), the last section before the footer, under the press
          band. Same section grammar as "Next dates": eyebrow, h2 in the
          homepage heading size (font-display text-3xl sm:text-4xl), one
          short paragraph in the site's body size, then the video at the
          full content width. The video is the client's WITH SUBTITLES cut
          (Osman Meyredi's own voice in Italian, English subtitles), hosted
          on the site: Storytime's YouTube upload auto-dubs English-language
          visitors into an AI voice, so it is not embedded. Click to play,
          nothing loads before. Heading, text, video and still are
          Studio-editable (Pages → Home). */}
      <section aria-labelledby="home-interview" className="py-24">
        <JsonLd
          data={videoJsonLd({
            id: "home-interview",
            slug: "home-interview",
            title: c("interview.videoTitle"),
            description: c("interview.text"),
            platform: "file",
            videoUrl: c("interview.video"),
            thumbnailUrl: c("interview.poster"),
            venue: null,
            performanceDate: null,
            year: null,
            tags: [],
            status: "PUBLISHED",
            featured: false,
            sortOrder: 0,
            createdAt: "",
            updatedAt: "",
          })}
        />
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Interview</p>
            <h2 id="home-interview" className="font-display mt-3 text-3xl sm:text-4xl">
              {c("interview.heading")}
            </h2>
            <CopyText
              value={c("interview.text")}
              className="mt-6 max-w-xl leading-relaxed text-ink-soft"
            />
          </Reveal>
          <Reveal variant="card" delay={120}>
            <VideoEmbed
              title={c("interview.videoTitle")}
              platform="file"
              videoUrl={c("interview.video")}
              thumbnailUrl={c("interview.poster")}
              className="mt-10"
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
