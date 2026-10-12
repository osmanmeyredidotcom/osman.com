/**
 * Homepage scrolling-gallery images.
 *
 * 11-10-2026 (gallery correction): the original scrolling gallery of the
 * Adele-reference brief (20-09-2026) is back, one uniform row height with
 * widths from each photo's native aspect ratio, now showing the seven
 * approved photographs in the reference order. A photo may carry a zoom
 * (`zoom`) around a focal point (`focus`), applied inside its own frame, so
 * frame sizes and scroll travel never change. Sources, derivatives and
 * settings: docs/gallery-asset-manifest-2026-10-11.md.
 *
 * The Studio's "Homepage gallery" slots still override these defaults one
 * slot at a time; a replaced photo shows unzoomed at its own aspect ratio.
 */
export type GalleryImage = {
  src: string;
  alt: string;
  aspect: "landscape-wide" | "landscape" | "portrait";
  width: number;
  height: number;
  /** Only relevant if a future layout crops; boxes currently match native aspect. */
  objectPosition?: string;
  /** Slight extra zoom inside the frame (1 = none); the frame keeps its size. */
  zoom?: number;
  /** Zoom focal point, as a CSS transform-origin ("x% y%"). */
  focus?: string;
  temporary: boolean;
};

export const HOME_GALLERY: GalleryImage[] = [
  {
    // Drummer scan with its white scanner margin trimmed (18 px a side).
    src: "/images/gallery/home-carousel-01-drummer-bw.jpg",
    alt: "Osman Meyredi at the drum kit, black and white",
    aspect: "portrait",
    width: 1083,
    height: 1600,
    zoom: 1.1,
    focus: "55% 54%",
    temporary: false,
  },
  {
    // High-resolution file supplied on 11-10-2026 (2048 px, same framing as
    // the earlier 199 px file); provenance note in the manifest.
    src: "/images/gallery/home-carousel-02-keys-teal-hr.jpg",
    alt: "Osman Meyredi at the keyboards in teal stage smoke",
    aspect: "portrait",
    width: 1600,
    height: 1600,
    zoom: 1.1,
    focus: "54% 46%",
    temporary: false,
  },
  {
    src: "/images/gallery/home-carousel-03-hat-singer.jpg",
    alt: "Osman Meyredi in a straw hat singing at the microphone",
    aspect: "portrait",
    width: 1200,
    height: 1600,
    zoom: 1.06,
    focus: "50% 8%",
    temporary: false,
  },
  {
    src: "/images/gallery/home-carousel-04-green-bass.jpg",
    alt: "Osman Meyredi playing bass guitar under green stage light",
    aspect: "landscape",
    width: 2396,
    height: 1600,
    zoom: 1.12,
    focus: "44% 45%",
    temporary: false,
  },
  {
    src: "/images/gallery/home-carousel-05-studio-headphones.jpg",
    alt: "Osman Meyredi singing into a studio microphone, headphones on",
    aspect: "landscape",
    width: 1634,
    height: 1600,
    zoom: 1.08,
    focus: "45% 40%",
    temporary: false,
  },
  {
    // Zoomed further (12-10-2026, VP's request) so the guitar headstocks on
    // the right edge (his own and the white bass on its stand) stay out of
    // frame.
    src: "/images/gallery/home-carousel-06-electric-guitar.jpg",
    alt: "Osman Meyredi playing a blue electric guitar against a brick wall",
    aspect: "portrait",
    width: 1195,
    height: 1600,
    zoom: 1.28,
    focus: "0% 25%",
    temporary: false,
  },
  {
    // Black-and-white photo supplied on 12-10-2026 (1932 x 2576), the frame
    // the reference used.
    src: "/images/gallery/home-carousel-07-bassist-bw.jpg",
    alt: "Osman Meyredi with his bass at an outdoor show in Italy, black and white",
    aspect: "portrait",
    width: 1200,
    height: 1600,
    zoom: 1.08,
    focus: "45% 25%",
    temporary: false,
  },
];
