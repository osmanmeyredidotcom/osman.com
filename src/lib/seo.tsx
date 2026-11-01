import type { Metadata } from "next";
import type {
  EventRecord,
  FaqRecord,
  LiveVideoRecord,
  MediaItemRecord,
  ReleaseRecord,
} from "./types";
import { absoluteUrl, PERSON_ID, siteUrl } from "./site";
import { eventEndUtc, venueLocalToUtc } from "./events";
import { fallbackThumbnail, vimeoId, youtubeId } from "./embed";
import { plainCopy } from "./copyLinks";

/**
 * Schema.org JSON-LD builders + Open Graph helper (SEO foundation brief,
 * parts D and G). Two hard rules carried through every builder:
 *
 * 1. Only facts that are visible and verified on the page are emitted
 *    (§38: "structured data must match visible page content").
 * 2. Osman is one entity: every Person reference reuses the stable
 *    PERSON_ID (§32) instead of minting disconnected Person objects.
 */

/* ------------------------------ Open Graph ------------------------------ */

export type PageOg = {
  title: string;
  description: string;
  /** Site path of the page, e.g. "/about". */
  path: string;
  /** Site path of the page-specific OG image. */
  image: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
};

/**
 * Complete per-page Open Graph object (§22). Next.js metadata merging
 * replaces the parent `openGraph` wholesale when a page defines one, so
 * this helper always returns the full set — siteName and type included —
 * keeping every page unique without losing the shared fields.
 */
export function pageOpenGraph(og: PageOg): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    siteName: "Osman Meyredi",
    title: og.title,
    description: og.description,
    url: absoluteUrl(og.path),
    images: [
      {
        url: absoluteUrl(og.image),
        width: og.imageWidth ?? 1920,
        height: og.imageHeight ?? 1080,
        alt: og.imageAlt,
      },
    ],
  };
}

/* ------------------------------- Person -------------------------------- */

/**
 * The Osman Meyredi entity (§32/§33), emitted on Home and About. Every
 * property restates approved, visible site content:
 * - description = the About/Home identity sentence, verbatim;
 * - birthPlace Italy = "Italian-born"; homeLocation = "based in Amsterdam";
 * - knowsLanguage = "works in English, Italian and Dutch" (About);
 * - knowsAbout = the approved instrument list (Keynote slides 2/23) and
 *   the disciplines named in the approved role list;
 * - alternateName = "Ozzy Meyredi", the credited billing visible on the
 *   Falling for You collaboration feature;
 * - sameAs = only the official profiles configured in Studio settings —
 *   never guessed (§33).
 * Nationality is NOT emitted: approved copy says Italian-born, which is a
 * birthplace fact, not a nationality claim.
 */
export function personJsonLd(sameAs: string[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Osman Meyredi",
    alternateName: "Ozzy Meyredi",
    description:
      "Osman Meyredi is an Italian-born artist, a multi-instrumentalist, songwriter, composer, singer, music director and producer, based in the Netherlands.",
    jobTitle: "Multi-instrumentalist, songwriter, composer, singer, music director and producer",
    url: siteUrl(),
    image: absoluteUrl("/images/home-hero-landscape.jpg"),
    birthPlace: { "@type": "Place", name: "Italy" },
    homeLocation: { "@type": "Place", name: "Amsterdam, Netherlands" },
    knowsLanguage: ["English", "Italian", "Dutch"],
    knowsAbout: [
      "Double bass",
      "Bass guitar",
      "Piano",
      "Keyboard",
      "Synthesiser",
      "Guitar",
      "Drums",
      "Percussion",
      "Singing",
      "Songwriting",
      "Composition",
      "Music production",
      "Music direction",
      "Live performance",
    ],
    sameAs: sameAs.filter(Boolean),
  };
}

/** Compact Person reference for use inside other entities — same @id. */
function personRef(): Record<string, unknown> {
  return { "@type": "Person", "@id": PERSON_ID, name: "Osman Meyredi" };
}

/* -------------------------------- Events ------------------------------- */

export function musicEventJsonLd(event: EventRecord): Record<string, unknown> {
  // Venue-local date/time → UTC instants via the site's own timezone
  // helpers, so the emitted startDate is exact rather than zone-ambiguous.
  const start = venueLocalToUtc(event.date, event.startTime, event.timezone);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.title,
    startDate: start.toISOString(),
    eventStatus:
      event.eventState === "CANCELLED"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        ...(event.address ? { streetAddress: event.address } : {}),
        addressLocality: event.city,
        addressCountry: event.country,
      },
    },
    performer: personRef(),
  };
  if (event.endTime) {
    data.endDate = eventEndUtc(event).toISOString();
  }
  if (event.description) data.description = event.description;
  if (event.imageUrl) data.image = absoluteUrl(event.imageUrl);
  if (event.eventType === "FREE_GIG") {
    data.isAccessibleForFree = true;
  } else if (event.ticketUrl && event.eventState === "SCHEDULED") {
    data.offers = {
      "@type": "Offer",
      url: event.ticketUrl,
      availability: "https://schema.org/InStock",
    };
  } else if (event.eventState === "SOLD_OUT" && event.ticketUrl) {
    data.offers = {
      "@type": "Offer",
      url: event.ticketUrl,
      availability: "https://schema.org/SoldOut",
    };
  }
  return data;
}

/* -------------------------------- Music -------------------------------- */

export function musicAlbumJsonLd(release: ReleaseRecord): Record<string, unknown> {
  const sameAs = [
    release.spotifyUrl,
    release.appleMusicUrl,
    release.youtubeUrl,
    release.bandcampUrl,
    release.otherUrl,
  ].filter((u): u is string => Boolean(u));
  // Structured data must never imply Osman owns another artist's record
  // (precision pack 02; brief §34): non-own releases are billed to their
  // real primary artist, with Osman attached as a contributor only.
  const ownRelease = release.relationshipType === "OWN_RELEASE";
  const primary = !ownRelease && release.primaryArtistName
    ? { "@type": "MusicGroup", name: release.primaryArtistName }
    : personRef();
  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: release.title,
    ...(release.year ? { datePublished: String(release.year) } : {}),
    byArtist: primary,
    ...(!ownRelease ? { contributor: personRef() } : {}),
    ...(release.artworkUrl ? { image: absoluteUrl(release.artworkUrl) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/* -------------------------------- Videos ------------------------------- */

/**
 * VideoObject for the live-video cards (§36/§40). Only known facts:
 * uploadDate and duration are never emitted because they are not recorded
 * anywhere — fabricating them is explicitly banned. Thumbnails are the
 * stored poster (self-hosted files) or the platform's real still (YouTube).
 */
export function videoJsonLd(video: LiveVideoRecord): Record<string, unknown> {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
  };
  // November (N5a): descriptions may carry a link line ("To see the full
  // video: https://…"); structured data gets the plain-text form.
  if (video.description) data.description = plainCopy(video.description);
  const thumb =
    video.thumbnailUrl ??
    (video.platform === "file" ? null : fallbackThumbnail(video.platform, video.videoUrl));
  if (thumb) data.thumbnailUrl = absoluteUrl(thumb);
  if (video.platform === "file") {
    data.contentUrl = absoluteUrl(video.videoUrl);
  } else if (video.platform === "youtube") {
    const id = youtubeId(video.videoUrl);
    if (id) data.embedUrl = `https://www.youtube-nocookie.com/embed/${id}`;
    data.url = video.videoUrl;
  } else {
    const id = vimeoId(video.videoUrl);
    if (id) data.embedUrl = `https://player.vimeo.com/video/${id}`;
    data.url = video.videoUrl;
  }
  return data;
}

/* ------------------------------ Breadcrumbs ----------------------------- */

/**
 * BreadcrumbList (§37) for subpages whose visible sub-navigation already
 * expresses the hierarchy (ServicesSubnav / ShowsSubnav) — the schema
 * mirrors real, visible structure rather than inventing one.
 */
export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/* --------------------------------- FAQs --------------------------------- */

/** FAQPage schema for the published practical Q&As rendered on the page. */
export function faqPageJsonLd(faqs: FaqRecord[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/* -------------------------------- Articles ------------------------------ */

export function articleJsonLd(item: MediaItemRecord): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.headline,
    url: absoluteUrl(item.articleUrl),
    publisher: { "@type": "Organization", name: item.publication },
    ...(item.date ? { datePublished: item.date } : {}),
    about: personRef(),
  };
}

/* -------------------------------- Render -------------------------------- */

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
