import type { GalleryImage } from "@/data/home-gallery";

/**
 * /althome's gallery photos: the homepage set as it was before the
 * 09-10-2026 homepage gallery update (src/data/home-gallery.ts now holds
 * the new homepage set). Kept here, unchanged, so /althome looks exactly as
 * before. /althome still merges the Studio's "Homepage gallery" slots over
 * this list, as it always has.
 * Sources: docs/home-gallery-manifest-2026-09-20.md
 */
export const ALTHOME_GALLERY: GalleryImage[] = [
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
