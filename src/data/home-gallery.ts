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
    src: "/images/gallery/gallery-02-bass-red-stage.jpg",
    alt: "Osman Meyredi with his bass guitar, arms raised on a red-lit stage",
    aspect: "portrait",
    width: 1063,
    height: 1400,
    temporary: true,
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
    src: "/images/gallery/gallery-04-double-bass.jpg",
    alt: "Osman Meyredi bowing the double bass, black and white",
    aspect: "portrait",
    width: 975,
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
