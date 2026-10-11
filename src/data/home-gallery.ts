/**
 * Homepage scrolling-gallery images.
 *
 * 11-10-2026 (homepage gallery reference-matching brief, image(9).png):
 * seven tiles in the reference order, one shared height, each tile's width
 * from its deliberate crop. Sources, checksums and exact crop rectangles:
 * docs/gallery-asset-manifest-2026-10-11.md (the 09-10-2026 selection is
 * recorded in docs/home-gallery-manifest-2026-10-09.md). /althome keeps its
 * own set unchanged (src/data/althome-gallery.ts).
 *
 * The Studio's "Homepage gallery" slots still override these defaults one
 * slot at a time; a Studio image in slot 5 replaces the reserved placeholder.
 */
export type GalleryImage = {
  src: string;
  alt: string;
  aspect: "landscape-wide" | "landscape" | "portrait";
  width: number;
  height: number;
  /** Only relevant if a future layout crops; boxes currently match native aspect. */
  objectPosition?: string;
  /** Reserved slot: render a labelled placeholder instead of an image. */
  pending?: string;
  /** The reference shows a hairline light separator after this tile. */
  seamAfter?: boolean;
  temporary: boolean;
};

export const HOME_GALLERY: GalleryImage[] = [
  // 11-10-2026 reference-matching brief (image(9).png): seven tiles, one
  // shared height, widths from each tile's deliberate crop. Derivatives in
  // public/images/gallery-ref (sources + exact crop rectangles:
  // docs/gallery-asset-manifest-2026-10-11.md). Originals untouched.
  {
    src: "/images/gallery-ref/ref-1-drummer-bw.jpg",
    alt: "Osman Meyredi at the drum kit, black and white",
    aspect: "portrait",
    width: 962,
    height: 1000,
    seamAfter: true, // the reference shows a hairline light separator here
    temporary: false,
  },
  {
    // The only source is 199 x 199 px. This file is a 4x super-resolution
    // derivative of the approved crop (EDSR fidelity model, no generated
    // detail, no retouching or regrading; see the manifest). Replace it with
    // the original high-resolution photograph if one turns up.
    src: "/images/gallery-ref/ref-2-keys-teal.jpg",
    alt: "Osman Meyredi at the keyboards in teal stage smoke",
    aspect: "portrait",
    width: 640,
    height: 696,
    temporary: true,
  },
  {
    src: "/images/gallery-ref/ref-3-hat-singer.jpg",
    alt: "Osman Meyredi in a straw hat singing at the microphone",
    aspect: "landscape",
    width: 1074,
    height: 1000,
    temporary: false,
  },
  {
    src: "/images/gallery-ref/ref-4-green-bass.jpg",
    alt: "Osman Meyredi playing bass guitar under green stage light",
    aspect: "portrait",
    width: 839,
    height: 1000,
    temporary: false,
  },
  {
    // Reference photo 5 (studio portrait with headphones) is not in the
    // approved folders yet; the slot reserves its exact geometry.
    src: "pending-5",
    alt: "Studio portrait with headphones - photograph to follow",
    aspect: "landscape",
    width: 1054,
    height: 1000,
    pending: "Photo 5 - studio portrait with headphones (file requested)",
    temporary: true,
  },
  {
    src: "/images/gallery-ref/ref-6-electric-brick.jpg",
    alt: "Osman Meyredi playing a blue electric guitar against a brick wall",
    aspect: "portrait",
    width: 922,
    height: 1000,
    temporary: false,
  },
  {
    src: "/images/gallery-ref/ref-7-bass-bw.jpg",
    alt: "Osman Meyredi with his bass at an outdoor show in Italy, black and white",
    aspect: "portrait",
    width: 870,
    height: 1069,
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
