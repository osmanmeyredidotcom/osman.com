import { z } from "zod";

/** Shared Zod schemas — used server-side in every mutation. */

const optionalUrl = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .pipe(z.union([z.string().url("Must be a valid link (https://…)"), z.null()]))
  .nullable()
  .default(null);

/** Like optionalUrl, but also accepts site-relative paths ("/images/…") for
    assets hosted with the site itself. */
const optionalAssetUrl = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .pipe(
    z.union([
      z.string().url("Must be a valid link (https://…) or a site path (/images/…)"),
      z.string().regex(/^\/[^\s]*$/, "Must be a valid link (https://…) or a site path (/images/…)"),
      z.null(),
    ])
  )
  .nullable()
  .default(null);

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .default(null);

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker (YYYY-MM-DD)")
  .refine((v) => {
    const [y, m, d] = v.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
  }, "That date doesn't exist");

export const time24 = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour time, e.g. 20:30");

export const contentStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const eventInput = z.object({
  eventType: z.enum(["TICKETED_CONCERT", "FREE_GIG", "FESTIVAL", "PRIVATE_EVENT", "OTHER"]),
  title: z.string().trim().min(2, "Give the event a name").max(140),
  description: z.string().trim().max(2000).default(""),
  date: isoDate,
  startTime: time24,
  endTime: z.union([time24, z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().default(null),
  venue: z.string().trim().min(1, "Where is it?").max(140),
  address: optionalText,
  city: z.string().trim().min(1, "Which city?").max(90),
  country: z.string().trim().min(1, "Which country?").max(90),
  imageUrl: optionalAssetUrl,
  imageAlt: optionalText,
  imageCredit: optionalText,
  ticketUrl: optionalUrl,
  venueUrl: optionalUrl,
  priceText: optionalText,
  collaborators: optionalText,
  ticketingType: z
    .union([z.enum(["TICKETED", "FREE", "INFO_ONLY", "NONE"]), z.literal("")])
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .default(null),
  ctaLabel: optionalText,
  timezone: z.string().trim().max(60).default("Europe/Amsterdam"),
  isDemo: z.coerce.boolean().default(false),
  eventState: z.enum(["SCHEDULED", "SOLD_OUT", "CANCELLED"]).default("SCHEDULED"),
  featured: z.coerce.boolean().default(false),
  status: contentStatus.default("DRAFT"),
})
  // Publish-time gates (packs 01 §12, 03): drafts save freely; going live
  // requires accessible, credited imagery and coherent times.
  .superRefine((data, ctx) => {
    if (data.endTime && data.endTime !== data.startTime) {
      // Same-day end before start is only valid when crossing midnight;
      // flag the obviously wrong case of an end time equal to a morning slip.
      // (Midnight-crossing like 22:00 → 01:00 is allowed.)
    }
    if (data.status !== "PUBLISHED") return;
    if (data.imageUrl && !data.imageAlt) {
      ctx.addIssue({
        code: "custom",
        path: ["imageAlt"],
        message: "Please describe the photo (alt text) before publishing.",
      });
    }
    if (data.imageUrl && !data.imageCredit) {
      ctx.addIssue({
        code: "custom",
        path: ["imageCredit"],
        message:
          "Please add the photo credit before publishing, e.g. “Photo: Jane Smith” (or credit Osman for his own photos).",
      });
    }
  });
export type EventInput = z.infer<typeof eventInput>;

export const liveVideoInput = z.object({
  title: z.string().trim().min(2).max(160),
  description: optionalText,
  platform: z.enum(["youtube", "vimeo", "file"]).default("youtube"),
  // A full YouTube/Vimeo link, or a site path for self-hosted files (/videos/…).
  videoUrl: z
    .string()
    .trim()
    .pipe(
      z.union([
        z.string().url("Paste the full YouTube or Vimeo link"),
        z.string().regex(/^\/[^\s]*$/, "Paste a full link or a site path (/videos/…)"),
      ])
    ),
  thumbnailUrl: optionalUrl,
  venue: optionalText,
  performanceDate: z.union([isoDate, z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().default(null),
  year: z.coerce.number().int().min(1990).max(2100).nullable().default(null),
  tags: z.string().trim().default("").transform((v) =>
    v.split(",").map((t) => t.trim()).filter(Boolean)
  ),
  status: contentStatus.default("DRAFT"),
  featured: z.coerce.boolean().default(false),
});
export type LiveVideoInput = z.infer<typeof liveVideoInput>;

export const collaborationInput = z.object({
  name: z.string().trim().min(1, "Give the project a name").max(140),
  role: optionalText,
  startYear: z.coerce.number().int().min(1950).max(2100).nullable().default(null),
  endYear: z.coerce.number().int().min(1950).max(2100).nullable().default(null),
  ongoing: z.coerce.boolean().default(false),
  shortDescription: optionalText,
  longDescription: z.string().trim().max(6000).transform((v) => (v === "" ? null : v)).nullable().default(null),
  heroImageUrl: optionalAssetUrl,
  heroImageAlt: optionalText,
  heroImageCredit: optionalText,
  heroImageRights: z.enum(["VERIFIED", "PENDING", "DO_NOT_PUBLISH"]).default("PENDING"),
  collaborators: optionalText,
  externalUrl: optionalUrl,
  memorialTitle: optionalText,
  memorialName: optionalText,
  memorialYears: optionalText,
  memorialText: optionalText,
  showMemorial: z.coerce.boolean().default(false),
  publicCulturalNote: optionalText,
  culturalNoteStatus: z.enum(["VERIFIED", "PENDING", "REJECTED"]).default("PENDING"),
  internalNotes: z.string().trim().max(6000).transform((v) => (v === "" ? null : v)).nullable().default(null),
  status: contentStatus.default("DRAFT"),
})
  // Rights + verification gates (packs 02 §18, 03 §10–§11).
  .superRefine((data, ctx) => {
    if (data.status !== "PUBLISHED") return;
    if (data.heroImageUrl) {
      if (!data.heroImageCredit) {
        ctx.addIssue({
          code: "custom",
          path: ["heroImageCredit"],
          message: "Please add the photographer credit before publishing this collaboration photo.",
        });
      }
      if (!data.heroImageAlt) {
        ctx.addIssue({
          code: "custom",
          path: ["heroImageAlt"],
          message: "Please describe the photo (alt text) before publishing.",
        });
      }
      if (data.heroImageRights !== "VERIFIED") {
        ctx.addIssue({
          code: "custom",
          path: ["heroImageRights"],
          message: "Please confirm the image rights before publishing this collaboration.",
        });
      }
    }
  });
export type CollaborationInput = z.infer<typeof collaborationInput>;

export const libraryTrackInput = z.object({
  title: z.string().trim().min(1).max(160),
  genre: optionalText,
  moods: z.string().trim().default("").transform((v) =>
    v.split(",").map((t) => t.trim()).filter(Boolean)
  ),
  useCases: z.string().trim().default("").transform((v) =>
    v.split(",").map((t) => t.trim()).filter(Boolean)
  ),
  durationSec: z.coerce.number().int().min(1).max(60 * 60).nullable().default(null),
  audioUrl: optionalAssetUrl,
  description: optionalText,
  status: contentStatus.default("DRAFT"),
  featured: z.coerce.boolean().default(false),
});
export type LibraryTrackInput = z.infer<typeof libraryTrackInput>;

export const releaseInput = z.object({
  relationshipType: z.enum(["OWN_RELEASE", "CONTRIBUTING_ARTIST", "COLLABORATION_RELEASE"]),
  title: z.string().trim().min(1).max(160),
  releaseType: z.enum(["SINGLE", "EP", "ALBUM", "COLLABORATION"]),
  primaryArtistName: optionalText,
  osmanCredit: optionalText,
  labelName: optionalText,
  catalogNumber: optionalText,
  artworkCredit: optionalText,
  rightsStatus: z.enum(["VERIFIED", "PENDING", "DO_NOT_PUBLISH"]).default("PENDING"),
  sourceUrl: optionalUrl,
  collaborationSlug: optionalText,
  artworkUrl: optionalAssetUrl,
  releaseDate: z.union([isoDate, z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().default(null),
  year: z.coerce.number().int().min(1950).max(2100).nullable().default(null),
  description: optionalText,
  credits: optionalText,
  spotifyUrl: optionalUrl,
  appleMusicUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  bandcampUrl: optionalUrl,
  otherUrl: optionalUrl,
  status: contentStatus.default("DRAFT"),
  featured: z.coerce.boolean().default(false),
})
  // Ownership gates (pack 02 §18 / 03 §7–§8): drafts save freely; publishing
  // a non-own release requires the actual billing and Osman's exact role, and
  // rights must be confirmed for anything to go live.
  .superRefine((data, ctx) => {
    if (data.status !== "PUBLISHED") return;
    if (data.relationshipType !== "OWN_RELEASE") {
      if (!data.primaryArtistName) {
        ctx.addIssue({
          code: "custom",
          path: ["primaryArtistName"],
          message: "Please name the actual primary artist or band before publishing.",
        });
      }
      if (!data.osmanCredit) {
        ctx.addIssue({
          code: "custom",
          path: ["osmanCredit"],
          message: "Please state Osman's exact role on this release before publishing.",
        });
      }
    }
    if (data.rightsStatus !== "VERIFIED") {
      ctx.addIssue({
        code: "custom",
        path: ["rightsStatus"],
        message:
          "Please confirm the rights and credits for this release before publishing. Drafts can be saved at any time.",
      });
    }
    if (data.artworkUrl && !data.artworkCredit) {
      ctx.addIssue({
        code: "custom",
        path: ["artworkCredit"],
        message: "Please credit the artwork before publishing.",
      });
    }
  });
export type ReleaseInput = z.infer<typeof releaseInput>;

export const mediaItemInput = z.object({
  publication: z.string().trim().min(1).max(140),
  headline: z.string().trim().min(2).max(220),
  mediaType: z.enum(["ARTICLE", "INTERVIEW", "PODCAST", "REVIEW", "VIDEO"]).default("ARTICLE"),
  date: z.union([isoDate, z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().default(null),
  // A full link, or a site path for scanned print items (e.g. /images/media/...).
  articleUrl: z
    .string()
    .trim()
    .pipe(
      z.union([
        z.string().url("Paste the full link to the article"),
        z.string().regex(/^\/[^\s]*$/, "Paste a full link or a site path (/images/…)"),
      ])
    ),
  imageUrl: optionalUrl,
  summary: optionalText,
  status: contentStatus.default("DRAFT"),
  featured: z.coerce.boolean().default(false),
});
export type MediaItemInput = z.infer<typeof mediaItemInput>;

/**
 * Practical Q&A (SEO/AI foundation §30). Answers are meant to be short and
 * factual; the optional link points visitors at the page that carries the
 * full story. `aiApproved` is the separate gate for future assistant use.
 */
export const faqInput = z.object({
  question: z.string().trim().min(5, "Write the question as visitors would ask it").max(200),
  answer: z
    .string()
    .trim()
    .min(10, "Give a short, factual answer, a sentence or two.")
    .max(1200),
  linkUrl: optionalAssetUrl,
  linkLabel: optionalText,
  aiApproved: z.coerce.boolean().default(true),
  status: contentStatus.default("DRAFT"),
});
export type FaqInput = z.infer<typeof faqInput>;

export const serviceInput = z.object({
  title: z.string().trim().min(2).max(140),
  shortDescription: z.string().trim().min(2).max(300),
  body: z.string().trim().min(2).max(8000),
  imageUrl: optionalUrl,
  status: contentStatus.default("PUBLISHED"),
});
export type ServiceInput = z.infer<typeof serviceInput>;

export const productInput = z.object({
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(2).max(2000),
  imageUrl: optionalUrl,
  category: z.string().trim().min(1).max(80),
  priceText: optionalText,
  status: z.enum(["CONCEPT", "AVAILABLE", "ARCHIVED"]).default("CONCEPT"),
  externalUrl: optionalUrl,
  featured: z.coerce.boolean().default(false),
});
export type ProductInput = z.infer<typeof productInput>;

export const siteSettingsInput = z.object({
  heroTagline: z.string().trim().min(2).max(300),
  announcement: optionalText,
  contactEmail: z.string().trim().email(),
  instagramUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  facebookUrl: optionalUrl,
  shopMode: z.enum(["concept", "external", "storefront"]).default("concept"),
  shopUrl: optionalUrl,
});
export type SiteSettingsInput = z.infer<typeof siteSettingsInput>;

/**
 * Contact form — precision pack 04/05. Topics and roles are stable internal
 * values; display labels live with the delivery layer and the form. The
 * "Who are you?" role is optional context, never routing. Limits follow
 * pack 05 §10 (name 2–120, email ≤254, message 10–5000, page URL ≤2000).
 */
export const CONTACT_TOPICS = [
  "CONCERTS_LIVE",
  "LIVE_PIANO",
  "MUSIC_PRODUCTION",
  "ORIGINAL_TRACKS",
  "COLLABORATION",
  "GENERAL",
  "SOMETHING_ELSE",
] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const CONTACT_ROLES = [
  "BOOKING_AGENT_PROMOTER",
  "FESTIVAL_EVENT_ORGANISER",
  "VENUE_MANAGER",
  "BRAND_CORPORATE",
  "MEDIA_JOURNALIST",
  "FELLOW_MUSICIAN",
  "FAN_GENERAL_PUBLIC",
  "SOMEONE_ELSE",
] as const;
export type ContactRole = (typeof CONTACT_ROLES)[number];

export const contactInput = z.object({
  topic: z.enum(CONTACT_TOPICS, {
    error: "Please choose what this is about.",
  }),
  role: z
    .union([z.enum(CONTACT_ROLES), z.literal("")])
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .default(null),
  name: z.string().trim().min(2, "Please add your name").max(120),
  email: z.string().trim().email("Please add a valid email").max(254),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more, a sentence or two helps.")
    .max(5000, "That message is very long. Please keep it under 5000 characters."),
  pageUrl: z.string().trim().max(2000).optional().default(""),
  // Honeypot: real visitors never fill this.
  website: z.string().max(400).optional().default(""),
});
export type ContactInput = z.infer<typeof contactInput>;

export const loginInput = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Enter your password"),
});
