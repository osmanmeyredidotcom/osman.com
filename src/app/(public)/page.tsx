import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getRepos } from "@/server/repositories";
import { getPageCopy, getStoredCopy } from "@/server/copy";
import { CopyText } from "@/components/public/CopyText";
import { GALLERY_PAGE_ID, GALLERY_SLOTS } from "@/data/page-copy";
import { HOME_GALLERY, type GalleryImage } from "@/data/home-gallery";
import { upcomingPublished } from "@/lib/events";
import { JsonLd, pageOpenGraph, personJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { EventList } from "@/components/public/EventList";
import { VideoEmbed } from "@/components/public/VideoEmbed";
import { TrackedLink } from "@/components/public/TrackedLink";
import { RecordSleeve } from "@/components/public/RecordSleeve";
import { HomeScrollGallery } from "@/components/public/HomeScrollGallery";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { RecordShelfGrid } from "@/components/public/RecordShelfGrid";

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
    });
  }

  const nextDates = upcomingPublished(allEvents).slice(0, 5);
  const releases = allReleases
    .filter((r) => r.status === "PUBLISHED" && r.rightsStatus !== "DO_NOT_PUBLISH")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const collaborations = allCollaborations
    .filter((c) => c.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 2);
  const featuredRelease = releases.find((r) => r.featured) ?? releases[0] ?? null;
  const videos = allVideos
    .filter((v) => v.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const featuredVideo = videos.find((v) => v.featured) ?? videos[0] ?? null;
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

  // Round 3 Keynote exact copy (and the global no-em-dash rule): "A small
  // shop is taking shape. A mix of music and things Osman loves. Coming
  // soon. Visit the shop —>" — the arrow renders as the site's link arrow.
  const shopTeaser =
    settings.shopMode === "concept"
      ? c("shop.teaser")
      : settings.shopMode === "external"
        ? "The shop is open. Records and objects from Osman's world."
        : "The shop is open.";

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
          header logotype carries the identity); the approved role list sits
          top-left under the logo, wrapping over at most two rows; the
          supplied landscape live shot leads. h1 stays for accessibility/SEO
          but is visually hidden. */}
      <section className="border-b border-line">
        <Container wide className="relative">
          <h1 className="sr-only">Osman Meyredi</h1>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pt-10 pb-8 sm:pt-12">
            {/* Keynote slide 2 exact role wording, dots between roles. */}
            <p className="hero-meta-in eyebrow max-w-2xl leading-relaxed">
              {c("roles")}
            </p>
            <div className="hero-meta-in flex flex-wrap items-center gap-6">
              <Link href="/shows" data-cursor="DATES" className="btn-pill">
                See dates <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
              {/* Round 3 header slide: capital I — "Booking & Inquiries". */}
              <Link href="/contact" data-cursor="BOOK" className="u-link text-sm">
                Booking &amp; Inquiries
              </Link>
            </div>
          </div>
        </Container>
        {/* Landscape hero — the client-supplied performance photograph
            (Aditya, 11-09-2026: "It is the homepage hero image"), superseding
            the earlier Landing image. Full-bleed width, masked reveal, quiet
            ambient drift retained. */}
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
            <div className="flex items-baseline justify-between gap-6">
              <div>
                <p className="eyebrow">Next dates</p>
                <h2 className="font-display mt-3 text-3xl sm:text-4xl">On stage soon</h2>
              </div>
              <Link href="/shows" className="u-link shrink-0 text-sm hover:text-accent-strong">
                All dates
              </Link>
            </div>
          </Reveal>
          <div className="mt-10">
            {nextDates.length > 0 ? (
              <Reveal variant="card" delay={120}>
                <EventList events={nextDates} />
              </Reveal>
            ) : (
              <p className="border-t border-line pt-6 text-ink-soft">
                No public dates are in the diary right now. In the meantime, there is plenty to{" "}
                <Link href="/shows/live-videos" className="u-link">
                  watch
                </Link>{" "}
                and{" "}
                <Link href="/music" className="u-link">
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
                  <ul className="mt-9 flex flex-wrap gap-3">
                    {listenLinks.map((l) => (
                      <li key={l.label}>
                        <TrackedLink
                          href={l.href}
                          external
                          event="listen_click"
                          eventProps={{ platform: l.label, release: featuredRelease.slug }}
                          data-cursor="LISTEN"
                          data-cursor-style="disc"
                          className="border-draw inline-block px-5 py-2.5 text-sm font-medium tracking-wide uppercase transition-colors hover:text-accent-strong"
                        >
                          {l.label}
                        </TrackedLink>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-8">
                  <Link href="/music" data-cursor="VIEW" className="u-link text-sm hover:text-accent-strong">
                    The full discography <span className="arrow-nudge" aria-hidden="true">→</span>
                  </Link>
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Homepage gallery — Adele-reference scrolling gallery (brief
          20-09-2026), fully replacing the former "Four ways to work with
          Osman Meyredi" services overview in this slot. Services remain
          reachable through the menu and /services pages. The image set is
          the approved temporary selection from the master content folder —
          see docs/home-gallery-manifest-2026-09-20.md for sources and how
          to swap in the final curated photos. */}
      <HomeScrollGallery images={galleryImages} />

      {/* About moment — Round 3 Keynote (20-09-2026): exact new identity
          sentence ("Change to: …based in The Netherlands."), and the
          landscape photo replaced by the returning double-bass portrait
          ("Can we please have this image back? Landscape image doesn't work
          well here, add portrait"). */}
      {/* Image-first cohesion pass (24-09, §9–10): the About preview is
          built around the portrait — the image IS the section, the approved
          copy supports it in a narrow column. Image first in the DOM so
          mobile leads with it too. */}
      <section className="border-t border-line py-24">
        <Container wide>
          <div className="grid items-center gap-x-14 gap-y-10 md:grid-cols-12">
            <Reveal variant="mask" className="md:col-span-6">
              <div className="media-zoom border border-line">
                <Image
                  src={c("about.image")}
                  alt={c("about.imageAlt")}
                  width={1115}
                  height={1600}
                  sizes="(min-width: 768px) 38rem, 92vw"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
            <Reveal variant="text" delay={110} className="md:col-span-5 md:col-start-8">
              <p className="eyebrow">About</p>
              <CopyText
                value={c("about.sentence")}
                className="font-display mt-6 text-2xl leading-snug sm:text-3xl"
              />
              <CopyText
                value={c("about.travel")}
                className="mt-6 max-w-md leading-relaxed text-ink-soft"
              />
              <p className="mt-8">
                <Link href="/about" className="u-link text-sm hover:text-accent-strong">
                  More about Osman Meyredi <span className="arrow-nudge" aria-hidden="true">→</span>
                </Link>
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* RECORDS — ElectraJazz-inspired pinned horizontal section. Vertical
          scroll drives the discs across the viewport; outlined typography
          drifts behind at a slower rate; discs spin continuously and react to
          scroll velocity. Mobile & reduced-motion get a native swipe strip. */}
      {/* RECORDS — Round 3 Keynote: back to the sleeve treatment where the
          vinyl comes out of its cover, and no turning. The Disco Sparks
          "Keep Your Eye on the Sparrow" was removed from the set (its
          Special 45 stays). */}
      {releases.length > 0 && (
        <section className="border-t border-line bg-stage">
          <Container wide className="pt-20 pb-4">
            <p className="eyebrow" style={{ color: "var(--color-ink-faint)" }}>
              The records
            </p>
            <h2 className="display-caps mt-3 text-4xl sm:text-5xl">
              Spin through the shelf
            </h2>
          </Container>
          <RecordShelfGrid releases={releases} />
        </section>
      )}

      {/* Collaborations & projects teaser — pack 02 §2: small, editorial,
          own music keeps the visual priority. */}
      {collaborations.length > 0 && (
        <section className="border-t border-line py-20">
          <Container wide>
            <Reveal variant="text">
              <p className="eyebrow">Collaborations &amp; projects</p>
            </Reveal>
            <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-end">
              {collaborations.map((c) => (
                <Reveal key={c.id} variant="text" delay={80}>
                  <h2 className="font-display text-2xl leading-snug sm:text-3xl">
                    <Link href="/music#collaborations" className="hover:text-accent-strong">
                      {c.name}
                    </Link>
                  </h2>
                  <p className="tabular mt-2 text-xs tracking-[0.14em] text-ink-faint uppercase">
                    Collaboration / band project{c.role ? ` · ${c.role}` : ""}
                  </p>
                  {c.shortDescription && (
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                      {c.shortDescription}
                    </p>
                  )}
                </Reveal>
              ))}
              <Reveal variant="text" delay={140} className="md:justify-self-end">
                <Link href="/music#collaborations" className="u-link text-sm hover:text-accent-strong">
                  All collaborations <span className="arrow-nudge" aria-hidden="true">→</span>
                </Link>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {/* Featured live video — dark band */}
      {featuredVideo && (
        <section className="bg-stage py-24">
          <Container wide>
            <Reveal variant="text">
              <div className="flex items-baseline justify-between gap-6">
                <div>
                  <p className="eyebrow">Live</p>
                  <h2 className="font-display mt-3 text-3xl sm:text-4xl">{featuredVideo.title}</h2>
                </div>
                <Link href="/shows/live-videos" className="u-link shrink-0 text-sm">
                  All live videos
                </Link>
              </div>
            </Reveal>
            <Reveal variant="media" delay={120} className="mt-10">
              <VideoEmbed
                title={featuredVideo.title}
                platform={featuredVideo.platform}
                videoUrl={featuredVideo.videoUrl}
                thumbnailUrl={featuredVideo.thumbnailUrl}
              />
            </Reveal>
          </Container>
        </section>
      )}

      {/* Media signal */}
      {featuredMedia && (
        <section className="border-t border-line py-24">
          <Container>
            <Reveal variant="text">
              <p className="eyebrow">{featuredMedia.publication}</p>
              <h2 className="font-display mt-4 text-2xl leading-snug sm:text-3xl">
                {featuredMedia.headline}
              </h2>
              <p className="mt-6">
                <a
                  href={featuredMedia.articleUrl}
                  target="_blank"
                  rel="noopener"
                  className="u-link text-sm hover:text-accent-strong"
                >
                  Read the article <span className="arrow-nudge" aria-hidden="true">→</span>
                </a>
                <Link href="/media" className="u-link ml-6 text-sm text-ink-soft">
                  All press
                </Link>
              </p>
            </Reveal>
          </Container>
        </section>
      )}

      {/* Shop teaser */}
      <section className="border-t border-line py-16">
        <Container wide>
          <p className="text-ink-soft">
            {shopTeaser}{" "}
            <TrackedLink
              href="/shop"
              event="shop_click"
              eventProps={{ source: "home_teaser" }}
              className="u-link hover:text-accent-strong"
            >
              {c("shop.linkLabel")}
            </TrackedLink>
          </p>
        </Container>
      </section>

      {/* Contact CTA band — Round 3 Keynote: "Can all text be removed? It
          sounds now so desperate. But do keep the button BOOK OSMAN LIVE
          (not Get in Touch)". Just the confident pill, nothing else. */}
      <section className="border-t border-line bg-stage py-24 sm:py-28">
        <Container wide>
          <Reveal variant="text">
            <Link href={c("cta.href")} className="btn-pill" data-cursor="BOOK">
              {c("cta.label")} <span className="arrow-nudge" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
