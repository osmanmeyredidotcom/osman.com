/**
 * /althome: the client's homepage journey (althome-journey brief, VP,
 * 25-09-2026), as data, so the page renders it in one place and the tests
 * can hold it to the brief.
 *
 *   Who is this? → Wow, he can really perform! → I want to see/hear more →
 *   This feels like a serious artist → Can I see him live / book him?
 */
import type { GalleryImage } from "@/data/home-gallery";
import type { EventRecord, LiveVideoRecord } from "@/lib/types";
import { pastPublished, upcomingPublished } from "@/lib/events";

/** Section order, top to bottom (brief §2). */
export const ALTHOME_ORDER = [
  "hero", //           1 · Who is this?
  "showreel", //       2 · Wow, he can really perform!
  "marquee", //        between 2 and 3: confirms the musicianship just watched
  "gigs", //           3 · I can see him live
  "gallery", //        4 · I want to see more of him
  "records", //        5 · this feels like a serious artist: records,
  "collaborations", // collaborations,
  "media", //          press,
  "shop", //           and the shop
  "about", //          6 · now I want to know who he is (teaser only)
  "book", //           7 · Can I book him?
] as const;
export type AlthomeSection = (typeof ALTHOME_ORDER)[number];

/**
 * The showreel (brief §3.2), taken from the Studio's Live Videos, never
 * hard-coded: the first published video tagged "showreel" (Studio → Live
 * Videos → Tags), otherwise the first published video in the Live Videos
 * order. Never the hero's own video: each video appears once.
 */
export function pickShowreel(videos: LiveVideoRecord[], heroVideoUrl: string): LiveVideoRecord | null {
  const candidates = videos
    .filter((v) => v.status === "PUBLISHED" && v.videoUrl !== heroVideoUrl)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    candidates.find((v) => v.tags.some((t) => t.trim().toLowerCase() === "showreel")) ?? candidates[0] ?? null
  );
}

/**
 * Photos kept off /althome by the brief (§3.4): the childhood photo ("too
 * unprofessional") and the 2011 studio photo in shorts, the dated, casual
 * look the client objected to on 24-09. The gallery slots and / are
 * unchanged; a Studio replacement in either slot shows here as normal.
 */
export const ALTHOME_GALLERY_EXCLUDED = [
  "/images/gallery/gallery-08-piano-childhood.jpg",
  "/images/gallery/gallery-07-studio-2011.jpg",
];

/** The gallery for /althome: the excluded photos out, and nothing shown elsewhere on the page. */
export function althomeGallery(images: GalleryImage[], usedElsewhere: string[]): GalleryImage[] {
  const taken = new Set([...ALTHOME_GALLERY_EXCLUDED, ...usedElsewhere]);
  const seen = new Set<string>();
  return images.filter((img) => {
    if (taken.has(img.src) || seen.has(img.src)) return false;
    seen.add(img.src);
    return true;
  });
}

/**
 * Size rhythm for the gallery (brief §3.4: "not all the same size"). Each
 * photo keeps its native aspect ratio; only its scale against the row, its
 * vertical placement and the space after it vary. It opens on a dominant
 * frame and repeats every six photos.
 */
export type RhythmStep = { scale: number; align: "start" | "center" | "end"; gapAfter: number };
export const GALLERY_RHYTHM: RhythmStep[] = [
  { scale: 1, align: "end", gapAfter: 3.2 },
  { scale: 0.56, align: "start", gapAfter: 1.6 },
  { scale: 0.78, align: "end", gapAfter: 4.4 },
  { scale: 1, align: "end", gapAfter: 2 },
  { scale: 0.5, align: "center", gapAfter: 4.8 },
  { scale: 0.84, align: "end", gapAfter: 2.6 },
];

export function rhythmFor(index: number): RhythmStep {
  return GALLERY_RHYTHM[index % GALLERY_RHYTHM.length];
}

/**
 * Live gigs (brief §3.3): upcoming dates first (up to five, soonest
 * first), then the most recent past dates as a lighter track record (up
 * to three).
 */
export function gigsFor(
  events: EventRecord[],
  now: Date = new Date()
): { upcoming: EventRecord[]; past: EventRecord[] } {
  return {
    upcoming: upcomingPublished(events, now).slice(0, 5),
    past: pastPublished(events, now).slice(0, 3),
  };
}
