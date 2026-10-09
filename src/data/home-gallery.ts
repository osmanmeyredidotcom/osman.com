/**
 * Homepage scrolling-gallery images.
 *
 * 09-10-2026 (OSMAN_HOMEPAGE_GALLERY_ALTHOME_STYLE_ONLY): the set is the
 * team's curated selection from `09. Images Osman/Edited/JPG/Use`, exported
 * to the same web spec as before (1400 px tall, native aspect, no crop).
 * Exact source files: docs/home-gallery-manifest-2026-10-09.md. The
 * previous set lives on unchanged for /althome (src/data/althome-gallery.ts).
 *
 * The Studio's "Homepage gallery" slots still override these defaults one
 * slot at a time; an image placed in a slot takes that slot's size from
 * HOME_GALLERY_RHYTHM below, so replacing photos keeps the composition.
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
    src: "/images/gallery/home-01-singing-bass-neon.jpg",
    alt: "Osman Meyredi singing at the microphone with his bass guitar, warm neon light",
    aspect: "portrait",
    width: 1045,
    height: 1400,
    temporary: false,
  },
  {
    src: "/images/gallery/home-02-bass-guitar-cream.jpg",
    alt: "Osman Meyredi playing a white bass guitar, eyes closed",
    aspect: "landscape",
    width: 1836,
    height: 1400,
    temporary: false,
  },
  {
    src: "/images/gallery/home-03-bass-outdoor-hat.jpg",
    alt: "Osman Meyredi in a straw hat, arms outstretched, with his bass guitar at an outdoor show",
    aspect: "landscape",
    width: 1870,
    height: 1400,
    temporary: false,
  },
  {
    src: "/images/gallery/home-04-drums-singing.jpg",
    alt: "Osman Meyredi singing behind a drum kit",
    aspect: "landscape",
    width: 1842,
    height: 1400,
    temporary: false,
  },
  {
    src: "/images/gallery/home-05-bass-green-light.jpg",
    alt: "Osman Meyredi playing bass guitar under green stage light",
    aspect: "landscape",
    width: 2097,
    height: 1400,
    temporary: false,
  },
  {
    src: "/images/gallery/home-06-stage-piano.jpg",
    alt: "Osman Meyredi playing a stage piano against an orange wall",
    aspect: "landscape",
    width: 2161,
    height: 1400,
    temporary: false,
  },
  {
    src: "/images/gallery/home-07-double-bass-hat.jpg",
    alt: "Osman Meyredi in a hat playing the double bass on stage, blue light",
    aspect: "portrait",
    width: 937,
    height: 1400,
    temporary: false,
  },
  {
    src: "/images/gallery/home-08-electric-guitar.jpg",
    alt: "Osman Meyredi playing a blue electric guitar, eyes closed",
    aspect: "landscape",
    width: 1712,
    height: 1400,
    temporary: false,
  },
];

/**
 * Size rhythm (09-10-2026): the /althome gallery's composition, so the
 * photos are not all one size. Every photo keeps its native aspect ratio
 * (never cropped); only its height against the row, its vertical place and
 * the space after it vary, by position: a dominant frame, a small one up
 * high, a medium one low, another dominant, the smallest centred, a
 * medium-large one, then the pattern repeats.
 *
 *  - `scale` (desktop) and `gapAfter` (vw) are /althome's GALLERY_RHYTHM.
 *  - `scaleMobile` is gentler (0.7 to 1) so no photo gets small on a phone.
 */
export type HomeRhythmStep = {
  scale: number;
  scaleMobile: number;
  align: "start" | "center" | "end";
  gapAfter: number;
};

export const HOME_GALLERY_RHYTHM: HomeRhythmStep[] = [
  { scale: 1, scaleMobile: 1, align: "end", gapAfter: 3.2 },
  { scale: 0.56, scaleMobile: 0.74, align: "start", gapAfter: 1.6 },
  { scale: 0.78, scaleMobile: 0.86, align: "end", gapAfter: 4.4 },
  { scale: 1, scaleMobile: 1, align: "end", gapAfter: 2 },
  { scale: 0.5, scaleMobile: 0.7, align: "center", gapAfter: 4.8 },
  { scale: 0.84, scaleMobile: 0.9, align: "end", gapAfter: 2.6 },
];

export function homeRhythmFor(index: number): HomeRhythmStep {
  return HOME_GALLERY_RHYTHM[index % HOME_GALLERY_RHYTHM.length];
}

/**
 * The widest photo on desktop, in row heights. The row height is capped so
 * this photo is at most 88vw wide, so every photo can always be seen whole.
 */
export function galleryWidestRatio(images: GalleryImage[]): number {
  if (images.length === 0) return 1;
  return Math.max(...images.map((img, i) => (img.width / img.height) * homeRhythmFor(i).scale));
}
