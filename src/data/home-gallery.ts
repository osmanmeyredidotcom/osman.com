/**
 * Homepage scrolling-gallery images (Adele-reference brief, 20-09-2026).
 *
 * TEMPORARY SET — §6 of the brief allows selection from the master content
 * folder before the final curated set is approved. Swap entries here (same
 * shape) and the animation keeps working; nothing else needs rebuilding.
 * Exact source paths + selection notes: docs/home-gallery-manifest-2026-09-20.md
 *
 * `ar` is the native aspect ratio (width / height): items render at a
 * uniform row height with width = height × ar, so no photograph is cropped
 * (§24 — Osman and the instrument always stay fully visible).
 */
export type GalleryImage = {
  src: string;
  alt: string;
  aspect: "landscape-wide" | "landscape" | "portrait";
  width: number;
  height: number;
  /** Only relevant if a future layout crops; boxes currently match native aspect. */
  objectPosition?: string;
  temporary: boolean;
};

export const HOME_GALLERY: GalleryImage[] = [
  {
    src: "/images/gallery/gallery-01-keys-live.jpg",
    alt: "Osman Meyredi at the microphone behind a keyboard, black and white",
    aspect: "landscape-wide",
    width: 2508,
    height: 1400,
    temporary: true,
  },
  {
    // New Osman feedback.pages item 1 (23-09-2026): the red-stage arms-raised
    // frame is replaced by the client-supplied Edited.png (exact file from
    // 09. Images Osman), exported to gallery spec.
    src: "/images/gallery/gallery-02-bass-neon.jpg",
    alt: "Osman Meyredi singing at the microphone with his bass guitar, warm neon light",
    aspect: "portrait",
    width: 1045,
    height: 1400,
    temporary: false,
  },
  {
    src: "/images/gallery/gallery-03-keys-eindhoven.jpg",
    alt: "Osman Meyredi playing keyboards on stage in Eindhoven",
    aspect: "landscape",
    width: 2048,
    height: 1367,
    temporary: true,
  },
  {
    // R3 swap: the double-bass portrait moved to the homepage About block +
    // About page per the 20-09 Keynote, so the gallery uses the doorway
    // bass portrait instead (no duplicate photo on one page).
    src: "/images/gallery/gallery-04-bass-doorway.jpg",
    alt: "Osman Meyredi with his bass by an old doorway, tipping his hat",
    aspect: "portrait",
    width: 1050,
    height: 1400,
    temporary: true,
  },
  {
    src: "/images/gallery/gallery-05-bass-italy-crowd.jpg",
    alt: "Osman Meyredi pointing to the crowd, bass guitar in hand, at an outdoor show in Italy",
    aspect: "landscape",
    width: 1867,
    height: 1400,
    temporary: true,
  },
  {
    src: "/images/gallery/gallery-06-bass-wine-festival.jpg",
    alt: "Osman Meyredi playing bass guitar on a festival stage lined with wine barrels",
    aspect: "portrait",
    width: 1050,
    height: 1400,
    temporary: true,
  },
  {
    src: "/images/gallery/gallery-07-studio-2011.jpg",
    alt: "Osman Meyredi recording keyboards in the studio, headphones on",
    aspect: "landscape",
    width: 1867,
    height: 1400,
    temporary: true,
  },
  {
    src: "/images/gallery/gallery-08-piano-childhood.jpg",
    alt: "Osman Meyredi as a child playing an upright piano, black and white",
    aspect: "portrait",
    width: 1045,
    height: 1400,
    temporary: true,
  },
];
