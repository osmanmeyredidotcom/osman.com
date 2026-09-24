import type {
  CollaborationRecord,
  EventRecord,
  FaqRecord,
  LiveVideoRecord,
  ReleaseRecord,
} from "@/lib/types";
import type { ServiceCard } from "@/data/services";
import type { ApprovedKnowledgeItem } from "./types";

/**
 * Studio records → normalized ApprovedKnowledgeItem (brief §3/§6).
 *
 * Approval rules concentrated here (§4):
 * - only PUBLISHED records can ever be aiApproved;
 * - releases additionally require VERIFIED rights, and their summaries
 *   always carry the real billing so a future assistant can never present
 *   a collaboration or appearance as Osman's own record;
 * - demo/fixture events are never aiApproved, published or not;
 * - FAQs carry their own Studio-managed aiApproved switch.
 *
 * Static identity items (instruments, repertoire, technical setup,
 * availability, performance formats, booking) restate approved site copy
 * verbatim-or-condensed and point at the page that carries the full
 * wording (§7). When that copy changes on a page, it changes here too —
 * sources are annotated per item.
 */

/** Whitespace-normalised plain text (records may carry multi-line copy). */
export function normaliseText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * The date the current approved site copy landed (Feedback Round 2).
 * Used as updatedAt for items derived from code-authored approved copy,
 * which has no per-record timestamp of its own.
 */
export const APPROVED_COPY_UPDATED_AT = "2026-09-10T00:00:00.000Z";

const asStatus = (status: string): ApprovedKnowledgeItem["status"] =>
  status === "PUBLISHED" || status === "ARCHIVED" ? status : "DRAFT";

/* ------------------------------- Services ------------------------------ */

export function serviceToKnowledge(card: ServiceCard): ApprovedKnowledgeItem {
  return {
    id: `service-${card.slug}`,
    type: "SERVICE",
    title: card.title,
    summary: normaliseText(`${card.intro} (${card.subtitle}.)`),
    publicUrl: card.href,
    status: "PUBLISHED",
    aiApproved: true,
    // §5: no public pricing exists for any service — quote via contact.
    priceGuidanceStatus: "CONTACT_FOR_QUOTE",
    availabilityPolicy: "CONTACT_TEAM",
    updatedAt: APPROVED_COPY_UPDATED_AT,
  };
}

/* ------------------------------- Releases ------------------------------ */

export function releaseToKnowledge(release: ReleaseRecord): ApprovedKnowledgeItem {
  const own = release.relationshipType === "OWN_RELEASE";
  // New Osman feedback.pages (23-09-2026): appears-on rows live inside the
  // unified collaborations chapter now, so both non-own kinds share that
  // anchor.
  const anchor = own ? "/music#own-releases" : "/music#collaborations";
  // Billing first, always (§4 / acceptance criteria: collaboration
  // releases must never read as Osman solo work).
  const billing = own
    ? `A release by Osman Meyredi${release.year ? ` (${release.year})` : ""}.`
    : `A release by ${release.primaryArtistName ?? "another artist"}${
        release.year ? ` (${release.year})` : ""
      }.${release.osmanCredit ? ` ${normaliseText(release.osmanCredit)}.` : ""}`;
  return {
    id: `release-${release.slug}`,
    type: "MUSIC",
    title: release.title,
    summary: normaliseText(billing),
    ...(release.description ? { body: normaliseText(release.description) } : {}),
    publicUrl: anchor,
    status: asStatus(release.status),
    aiApproved:
      release.status === "PUBLISHED" && release.rightsStatus === "VERIFIED",
    updatedAt: release.updatedAt,
  };
}

/* ---------------------------- Collaborations --------------------------- */

export function collaborationToKnowledge(
  collaboration: CollaborationRecord
): ApprovedKnowledgeItem {
  const years =
    collaboration.startYear || collaboration.endYear
      ? ` (${collaboration.startYear ?? ""}–${
          collaboration.ongoing ? "ongoing" : (collaboration.endYear ?? "")
        })`
      : "";
  return {
    id: `collaboration-${collaboration.slug}`,
    type: "MUSIC",
    title: `${collaboration.name}: band project${years}`,
    summary: normaliseText(
      [
        collaboration.role ? `Osman Meyredi: ${collaboration.role}.` : "",
        collaboration.shortDescription ?? "",
      ]
        .filter(Boolean)
        .join(" ")
    ),
    ...(collaboration.longDescription
      ? { body: normaliseText(collaboration.longDescription) }
      : {}),
    publicUrl: "/music#collaborations",
    status: asStatus(collaboration.status),
    aiApproved: collaboration.status === "PUBLISHED",
    updatedAt: collaboration.updatedAt,
  };
}

/* -------------------------------- Videos ------------------------------- */

export function videoToKnowledge(video: LiveVideoRecord): ApprovedKnowledgeItem {
  const context = [video.venue, video.year ? String(video.year) : null]
    .filter(Boolean)
    .join(", ");
  return {
    id: `video-${video.slug}`,
    type: "VIDEO",
    title: video.title,
    summary: normaliseText(
      video.description ?? `Live video: ${video.title}${context ? ` (${context})` : ""}.`
    ),
    publicUrl: "/shows/live-videos",
    status: asStatus(video.status),
    aiApproved: video.status === "PUBLISHED",
    updatedAt: video.updatedAt,
  };
}

/* -------------------------------- Events ------------------------------- */

export function eventToKnowledge(event: EventRecord): ApprovedKnowledgeItem {
  return {
    id: `event-${event.slug}`,
    type: "EVENT",
    title: event.title,
    summary: normaliseText(
      `${event.date} ${event.startTime} · ${event.venue}, ${event.city}, ${event.country}.${
        event.description ? ` ${event.description}` : ""
      }`
    ),
    publicUrl: "/shows/gigs",
    status: asStatus(event.status),
    // Demo fixtures must never reach a future assistant, published or not.
    aiApproved: event.status === "PUBLISHED" && !event.isDemo,
    updatedAt: event.updatedAt,
  };
}

/* --------------------------------- FAQs -------------------------------- */

export function faqToKnowledge(faq: FaqRecord): ApprovedKnowledgeItem {
  return {
    id: `faq-${faq.slug}`,
    type: "FAQ",
    title: faq.question,
    summary: normaliseText(faq.answer),
    publicUrl: faq.linkUrl && faq.linkUrl.startsWith("/") ? faq.linkUrl : "/contact",
    status: asStatus(faq.status),
    // The Studio's per-item switch (§4) on top of the publish gate.
    aiApproved: faq.status === "PUBLISHED" && faq.aiApproved,
    updatedAt: faq.updatedAt,
  };
}

/* ------------------------- Static identity items ------------------------ */

/**
 * Facts that live in code-authored approved copy rather than Studio
 * records. Each entry annotates its source page; summaries restate that
 * copy without adding claims.
 */
export function staticKnowledge(): ApprovedKnowledgeItem[] {
  const base = {
    status: "PUBLISHED" as const,
    aiApproved: true,
    updatedAt: APPROVED_COPY_UPDATED_AT,
  };
  return [
    {
      // Source: approved instrument list (home marquee, Keynote slides
      // 2/23) + Concerts final copy ("he moves between instruments").
      id: "identity-instruments",
      type: "INSTRUMENT",
      title: "Instruments Osman Meyredi plays",
      summary:
        "Double bass, bass guitar, piano, keyboard, synthesiser, guitar, drums and percussion, and he sings. On stage he moves between instruments himself, layering them live.",
      publicUrl: "/about",
      ...base,
    },
    {
      // Source: Live Piano final copy (repertoire sentence) + Concerts
      // final copy ("his own studio productions come to life").
      id: "identity-repertoire",
      type: "REPERTOIRE",
      title: "Repertoire",
      summary:
        "At the piano his repertoire blends his own compositions with carefully chosen covers, drifting between light classical, jazz, pop and film music. Full live shows are built around his own studio productions.",
      publicUrl: "/services/piano-for-events",
      ...base,
    },
    {
      // Source: Live Piano final copy (grand piano / grand-piano-style
      // shell). The full-show rider is not documented → route to contact.
      id: "identity-technical-setup",
      type: "TECHNICAL_SETUP",
      title: "Technical setup for live piano",
      summary:
        "If the venue has its own grand piano, that is always Osman's first choice. If not, he brings his own electronic piano, built discreetly into a grand-piano-style shell. For full live shows the setup depends on the format. Details via the contact page.",
      publicUrl: "/services/piano-for-events",
      ...base,
    },
    {
      // Source: About final copy (Languages & availability).
      id: "identity-availability",
      type: "AVAILABILITY_POLICY",
      title: "Where Osman Meyredi performs",
      summary:
        "Based in Amsterdam, he performs regularly in the Netherlands and Italy and travels for concerts, events and productions across Europe and beyond. He works in English, Italian and Dutch. Exact availability is confirmed through the contact page.",
      publicUrl: "/contact",
      availabilityPolicy: "CONTACT_TEAM",
      ...base,
    },
    {
      // Source: Concerts final copy — the three approved booking options,
      // condensed; the page carries the full wording.
      id: "identity-performance-formats",
      type: "PERFORMANCE_FORMAT",
      title: "Three ways to book a show",
      summary:
        "A live multi-instrumental performance (one artist, an entire band's worth of sound); a visual production (the same solo show with lighting, visuals, smoke and fire, scaled for festivals); or an expanded live show with additional musicians, dancers and production.",
      publicUrl: "/services/concerts",
      ...base,
    },
    {
      // Source: contact page (direct addresses + form) and home CTA copy.
      id: "identity-booking",
      type: "BOOKING",
      title: "How to book Osman Meyredi",
      summary:
        "Email bookings@osmanmeyredi.com directly, or use the contact form and the message lands with the right person. Tell him about the occasion, the room and the people in it. He'll come back with a concrete proposal. Write in Italian, English or Dutch.",
      publicUrl: "/contact",
      priceGuidanceStatus: "CONTACT_FOR_QUOTE",
      availabilityPolicy: "CONTACT_TEAM",
      ...base,
    },
  ];
}
