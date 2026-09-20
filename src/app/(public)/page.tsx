import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getRepos } from "@/server/repositories";
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

/**
 * Roles row — Round 3 Keynote (20-09-2026), exact list from the header
 * slide: "ARTIST - MULTI-INSTRUMENTALIST - PRODUCER - MUSIC DIRECTOR".
 * Rendered uppercase with the site's established dot separators.
 */
const ROLES = ["Artist", "Multi-instrumentalist", "Producer", "Music director"];

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
const HOME_TITLE = "Osman Meyredi | Italian-Born Multi-Instrumentalist, Composer & Producer";
const HOME_DESCRIPTION =
  "Osman Meyredi is an Italian-born multi-instrumentalist, composer and producer based in Amsterdam. Live shows, piano for events, music production and original tracks across the Netherlands, Italy and Europe.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: pageOpenGraph({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: "/",
    image: "/images/home-hero-landscape.jpg",
    imageAlt: "Osman Meyredi singing at the keys under stage light",
  }),
};

const RELEASE_TYPE_LABELS = {
  SINGLE: "Single",
  EP: "EP",
  ALBUM: "Album",
  COLLABORATION: "Collaboration",
} as const;

export default async function HomePage() {
  const repos = getRepos();
  const [settings, allEvents, allReleases, allVideos, allMedia, allCollaborations] =
    await Promise.all([
      repos.settings.get(),
      repos.events.list(),
      repos.releases.list(),
      repos.videos.list(),
      repos.media.list(),
      repos.collaborations.list(),
    ]);

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
      ? "A small shop is taking shape. A mix of music and things Osman loves. Coming soon."
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
              {ROLES.join(" · ")}
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
                  src="/images/home-hero-landscape.jpg"
                  alt="Osman Meyredi singing at the keys under stage light, black headband, dark stage"
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
      <HomeScrollGallery />

      {/* About moment — Round 3 Keynote (20-09-2026): exact new identity
          sentence ("Change to: …based in The Netherlands."), and the
          landscape photo replaced by the returning double-bass portrait
          ("Can we please have this image back? Landscape image doesn't work
          well here, add portrait"). */}
      <section className="border-t border-line py-24">
        <Container wide>
          <div className="grid items-center gap-x-14 gap-y-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <Reveal variant="text">
              <p className="eyebrow">About</p>
              <p className="font-display mt-6 text-2xl leading-snug sm:text-3xl">
                Osman Meyredi is an Italian-born artist, multi-instrumentalist, songwriter,
                composer, singer and producer, based in The Netherlands.
              </p>
              <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">
                He performs regularly in the Netherlands and Italy, and travels for concerts,
                events and productions across Europe and beyond.
              </p>
              <p className="mt-8">
                <Link href="/about" className="u-link text-sm hover:text-accent-strong">
                  More about Osman Meyredi <span className="arrow-nudge" aria-hidden="true">→</span>
                </Link>
              </p>
            </Reveal>
            <Reveal variant="mask" delay={120} className="mx-auto w-full max-w-[360px] md:mx-0 md:justify-self-end">
              <div className="media-zoom border border-line">
                <Image
                  src="/images/about/about-double-bass-portrait.jpg"
                  alt="Osman Meyredi bowing the double bass, black and white"
                  width={1115}
                  height={1600}
                  sizes="(min-width: 768px) 360px, 80vw"
                  className="h-auto w-full"
                />
              </div>
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
              Visit the shop
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
            <Link href="/contact" className="btn-pill" data-cursor="BOOK">
              Book Osman Live <span className="arrow-nudge" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
