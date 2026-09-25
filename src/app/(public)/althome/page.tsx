import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getRepos } from "@/server/repositories";
import { getPageCopy, getStoredCopy } from "@/server/copy";
import { CopyText } from "@/components/public/CopyText";
import { GALLERY_PAGE_ID, GALLERY_SLOTS } from "@/data/page-copy";
import { HOME_GALLERY, type GalleryImage } from "@/data/home-gallery";
import { upcomingPublished } from "@/lib/events";
import type { ReleaseRecord } from "@/lib/types";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";
import { VideoEmbed } from "@/components/public/VideoEmbed";
import { TrackedLink } from "@/components/public/TrackedLink";
import { Marquee } from "@/components/motion/Marquee";
import { AlthomeRoot } from "@/components/althome/AlthomeRoot";
import { HeroEntry, type HeroPromo } from "@/components/althome/HeroEntry";
import { AltGallery } from "@/components/althome/AltGallery";
import { MusicFan, type FanCard } from "@/components/althome/MusicFan";
import { PixelatedTransition } from "@/components/althome/PixelatedTransition";
import { assignToSlots, FAN_MAX } from "@/components/althome/fanGeometry";
import { HOME_LABELS as L, INSTRUMENTS } from "@/components/althome/labels";
import "@/components/althome/althome.css";

export const dynamic = "force-dynamic";

/** Osman Meyredi's own show video — the homepage video (brief §0). */
const HERO_VIDEO = "/videos/website-landscape.mp4";
const HERO_POSTER = "/images/videos/website-landscape-poster.jpg";

/**
 * /althome — an alternate homepage concept for VP and Varsha to review
 * (ALTHOME_BRIEF, 25-09-2026): the same content as / from the same sources,
 * presented image- and motion-first. Kept out of search (noindex,
 * nofollow), out of the sitemap and out of the navigation. / is untouched.
 */
export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageCopy("home");
  return {
    title: { absolute: c("seo.title") },
    description: c("seo.description"),
    robots: { index: false, follow: false },
  };
}

function listenFor(r: ReleaseRecord): { href: string; platform: string } | null {
  if (r.spotifyUrl) return { href: r.spotifyUrl, platform: "Spotify" };
  if (r.appleMusicUrl) return { href: r.appleMusicUrl, platform: "Apple Music" };
  if (r.bandcampUrl) return { href: r.bandcampUrl, platform: "Bandcamp" };
  if (r.youtubeUrl) return { href: r.youtubeUrl, platform: "YouTube" };
  return null;
}

export default async function AltHomePage() {
  const repos = getRepos();
  const [settings, allEvents, allReleases, allVideos, allMedia, allCollaborations, c, storedCopy] =
    await Promise.all([
      repos.settings.get(),
      repos.events.list(),
      repos.releases.list(),
      repos.videos.list(),
      repos.media.list(),
      repos.collaborations.list(),
      getPageCopy("home"),
      getStoredCopy(),
    ]);

  // Homepage gallery: identical merge to / (Studio slot overrides over the
  // approved set; an emptied src hides that slot).
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
    });
  }

  const nextDates = upcomingPublished(allEvents).slice(0, 5);
  const releases = allReleases
    .filter((r) => r.status === "PUBLISHED" && r.rightsStatus !== "DO_NOT_PUBLISH")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const featuredRelease = releases.find((r) => r.featured) ?? releases[0] ?? null;

  // Hero promo card = the featured release / already shows.
  const promo: HeroPromo | null = featuredRelease
    ? {
        slug: featuredRelease.slug,
        eyebrow: L.featuredRelease,
        title: featuredRelease.title,
        artist:
          featuredRelease.relationshipType !== "OWN_RELEASE"
            ? featuredRelease.primaryArtistName
            : null,
        artworkUrl: featuredRelease.artworkUrl,
        links: [
          { label: "Spotify", href: featuredRelease.spotifyUrl },
          { label: "Apple Music", href: featuredRelease.appleMusicUrl },
          { label: "Bandcamp", href: featuredRelease.bandcampUrl },
          { label: "YouTube", href: featuredRelease.youtubeUrl },
        ].filter((l): l is { label: string; href: string } => Boolean(l.href)),
      }
    : null;

  // The fan: the shelf's releases minus the promo card's (each record once
  // on the page), Osman's own first, then newest to oldest, max 5; the most
  // important takes the top/centre card.
  const fanOrdered = releases
    .filter((r) => r.id !== featuredRelease?.id)
    .sort((a, b) => {
      const own = Number(b.relationshipType === "OWN_RELEASE") - Number(a.relationshipType === "OWN_RELEASE");
      if (own !== 0) return own;
      const year = (b.year ?? 0) - (a.year ?? 0);
      if (year !== 0) return year;
      return a.sortOrder - b.sortOrder;
    })
    .slice(0, FAN_MAX);
  const fanCards: FanCard[] = fanOrdered.length
    ? assignToSlots(
        fanOrdered.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          artworkUrl: r.artworkUrl,
          listen: listenFor(r),
        }))
      )
    : [];

  const collaborations = allCollaborations
    .filter((co) => co.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 2);

  // Live band: the Live Videos running order, skipping the hero's own show
  // video (each video once). The Studio's "featured" flag points at the
  // 2019 ZAPPATiKA tour video, which the client rules keep off the homepage
  // (see docs/althome-report-2026-09-25.md, Deviations).
  const videos = allVideos
    .filter((v) => v.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const bandVideo = videos.find((v) => v.videoUrl !== HERO_VIDEO) ?? null;

  const mediaItems = allMedia.filter((m) => m.status === "PUBLISHED");
  const featuredMedia = mediaItems.find((m) => m.featured) ?? mediaItems[0] ?? null;

  const shopTeaser =
    settings.shopMode === "concept"
      ? c("shop.teaser")
      : settings.shopMode === "external"
        ? L.shopOpenExternal
        : L.shopOpen;

  return (
    <AlthomeRoot>
      {settings.announcement && (
        <div className="border-b border-line bg-canvas-soft">
          <Container wide>
            <p className="py-3 text-center text-sm text-ink-soft">{settings.announcement}</p>
          </Container>
        </div>
      )}

      {/* 1 · Hero entry (Element A) + pixel transition out */}
      <HeroEntry
        name={L.name}
        videoSrc={HERO_VIDEO}
        poster={HERO_POSTER}
        fallbackImage={c("hero.image")}
        fallbackAlt={c("hero.imageAlt")}
        roles={c("roles")}
        seeDatesLabel={L.seeDates}
        bookingLabel={L.booking}
        promo={promo}
      />

      {/* 2 · Instruments marquee, unchanged */}
      <div className="border-b border-line py-5">
        <Marquee duration={56} label={L.instruments}>
          {INSTRUMENTS.map((label) => (
            <span key={label} className="flex items-center text-sm tracking-[0.18em] text-ink-faint uppercase">
              <span className="px-6">{label}</span>
              <span aria-hidden="true" className="text-line-dark">·</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* 3 · Next dates */}
      <section className="py-24 sm:py-28">
        <Container wide>
          <div className="flex items-end justify-between gap-6">
            <div>
              <div data-ah-reveal>
                <p className="eyebrow">{L.nextDatesEyebrow}</p>
              </div>
              <h2 data-ah-split className="font-display mt-3 text-4xl leading-none sm:text-6xl">
                {L.nextDatesHeading}
              </h2>
            </div>
            <div data-ah-reveal>
              <Link href="/shows" className="u-link shrink-0 text-sm hover:text-accent-strong">
                {L.allDates}
              </Link>
            </div>
          </div>
          <div className="mt-12" data-ah-reveal="list" data-ah-items="li">
            {nextDates.length > 0 ? (
              <EventList events={nextDates} />
            ) : (
              <p className="border-t border-line pt-6 text-ink-soft">
                {L.noDates}{" "}
                <Link href="/shows/live-videos" className="u-link">
                  {L.noDatesWatch}
                </Link>{" "}
                {L.noDatesAnd}{" "}
                <Link href="/music" className="u-link">
                  {L.noDatesListen}
                </Link>
                .
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* 4 · The main image moment + pixel transition out */}
      <AltGallery images={galleryImages} label={L.gallery} />

      {/* 5 · About: the portrait dominates, short lines beside it. The
          portrait drifts as a whole (parallax without cropping: the double
          bass touches the top and bottom edges of the photo). */}
      <section className="py-24 sm:py-32">
        <Container wide>
          <div className="grid items-center gap-x-14 gap-y-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="border border-line" data-ah-parallax>
                <Image
                  src={c("about.image")}
                  alt={c("about.imageAlt")}
                  width={1115}
                  height={1600}
                  sizes="(min-width: 768px) 55vw, 92vw"
                  className="h-auto w-full"
                />
              </div>
            </div>
            <div className="md:col-span-4 md:col-start-9" data-ah-reveal>
              <p className="eyebrow">{L.aboutEyebrow}</p>
              <CopyText
                value={c("about.sentence")}
                className="font-display mt-6 text-2xl leading-snug sm:text-3xl"
              />
              <CopyText value={c("about.travel")} className="mt-6 max-w-md leading-relaxed text-ink-soft" />
              <p className="mt-8">
                <Link href="/about" className="u-link text-sm hover:text-accent-strong">
                  {L.moreAbout} <span className="arrow-nudge" aria-hidden="true">→</span>
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 6 · The records fan (Element B), replacing the shelf here */}
      {fanCards.length > 0 && (
        <MusicFan
          cards={fanCards}
          eyebrow={L.recordsHeading}
          title={L.recordsEyebrow}
          listenLabel={L.listen}
          moreHref="/music"
          moreLabel={L.fullDiscography}
        />
      )}

      {/* 7 · Collaborations teaser: small, editorial, newest first. Each
          entry is a plain collaboration (brief §6.7: ZAPPATiKA is not a
          "band project"), so only its Studio role line is shown. */}
      {collaborations.length > 0 && (
        <section className="border-t border-line py-20 sm:py-24">
          <Container wide>
            <div data-ah-reveal>
              <p className="eyebrow">{L.collabEyebrow}</p>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-2" data-ah-reveal>
              {collaborations.map((co) => (
                <div key={co.id}>
                  <h2 className="font-display text-2xl leading-snug sm:text-3xl">
                    <Link href="/music#collaborations" className="hover:text-accent-strong">
                      {co.name}
                    </Link>
                  </h2>
                  {co.role && (
                    <p className="tabular mt-2 text-xs tracking-[0.14em] text-ink-faint uppercase">{co.role}</p>
                  )}
                  {co.shortDescription && (
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{co.shortDescription}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-10" data-ah-reveal>
              <Link href="/music#collaborations" className="u-link text-sm hover:text-accent-strong">
                {L.allCollabs} <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* 8 · Live video band, full width + pixel transition out */}
      {bandVideo && (
        <section className="relative bg-stage pt-24 sm:pt-28">
          <Container wide>
            <div className="flex items-end justify-between gap-6">
              <div>
                <div data-ah-reveal>
                  <p className="eyebrow">{L.liveEyebrow}</p>
                </div>
                <h2 data-ah-split className="font-display mt-3 text-3xl leading-tight sm:text-5xl">
                  {bandVideo.title}
                </h2>
              </div>
              <div data-ah-reveal>
                <Link href="/shows/live-videos" className="u-link shrink-0 text-sm">
                  {L.allLiveVideos}
                </Link>
              </div>
            </div>
          </Container>
          <div className="mt-10">
            <VideoEmbed
              title={bandVideo.title}
              platform={bandVideo.platform}
              videoUrl={bandVideo.videoUrl}
              thumbnailUrl={bandVideo.thumbnailUrl}
            />
          </div>
          {/* Video band → media signal (page canvas). */}
          <PixelatedTransition color="canvas" />
        </section>
      )}

      {/* 9 · Media signal, then a shop that can be seen */}
      {featuredMedia && (
        <section className="py-24 sm:py-28">
          <Container>
            <div data-ah-reveal>
              <p className="eyebrow">{featuredMedia.publication}</p>
              <h2 className="font-display mt-4 text-2xl leading-snug sm:text-4xl">{featuredMedia.headline}</h2>
              <p className="mt-6">
                <a
                  href={featuredMedia.articleUrl}
                  target="_blank"
                  rel="noopener"
                  className="u-link text-sm hover:text-accent-strong"
                >
                  {L.readArticle} <span className="arrow-nudge" aria-hidden="true">→</span>
                </a>
                <Link href="/media" className="u-link ml-6 text-sm text-ink-soft">
                  {L.allPress}
                </Link>
              </p>
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-line bg-canvas-soft py-20 sm:py-24">
        <Container wide>
          <div className="grid gap-8 md:grid-cols-12 md:items-end" data-ah-reveal>
            <p className="ah-shop-line md:col-span-8">{shopTeaser}</p>
            <p className="md:col-span-4 md:justify-self-end">
              <TrackedLink
                href="/shop"
                event="shop_click"
                eventProps={{ source: "althome_teaser" }}
                className="btn-pill"
              >
                {c("shop.linkLabel")} <span className="arrow-nudge" aria-hidden="true">→</span>
              </TrackedLink>
            </p>
          </div>
        </Container>
      </section>

      {/* 10 · CTA band: only the compact BOOK OSMAN LIVE pill */}
      <section className="border-t border-line bg-stage py-24 sm:py-28">
        <Container wide>
          <div data-ah-reveal>
            <Link href={c("cta.href")} className="btn-pill" data-cursor="BOOK">
              {c("cta.label")} <span className="arrow-nudge" aria-hidden="true">→</span>
            </Link>
          </div>
        </Container>
      </section>
    </AlthomeRoot>
  );
}
