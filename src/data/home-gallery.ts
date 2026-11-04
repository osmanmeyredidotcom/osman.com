/**
 * Homepage scrolling-gallery images.
 *
 * 11-10-2026 (gallery correction): the original scrolling gallery of the
 * Adele-reference brief (20-09-2026) is back, one uniform row height with
 * widths from each photo's native aspect ratio. 2-11-2026 (Jolene's
 * carousel brief, via VP): the NDSM kade photoshoot by Joyce van Doorn
 * (JVDPhotography) leads with the black hat portrait; the older photos and
 * the drums go to the back. A photo may carry a zoom
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
  // 2-11-2026 (Jolene's brief): "Black hat image first. Drums and older
  // images at the back!" The order also minds colour and where Osman Meyredi
  // sits in each frame: dark wall, green trees, dark wall, light sky, then
  // the older teal, warm and black-and-white stage photos. Removed from the
  // set: the studio headphones, green-lit bass, blue electric guitar and
  // NDSM -5 quay photos ("We don't need all the instruments being featured.
  // We need him to be an artist.").
  // 4-11-2026 (VP): "Remove the last 3 photographs" — the older keys (teal
  // smoke), light-hat singer and black-and-white drummer photos are out
  // (their files stay in public/ for Studio); the carousel is the four
  // NDSM kade photographs by Joyce van Doorn.
  {
    // NDSM kade -19 (PSD composite, Adobe RGB converted to sRGB).
    src: "/images/gallery/home-carousel-ndsm-19-black-hat.jpg",
    alt: "Osman Meyredi in a black hat and black jacket against a dark wall at NDSM in Amsterdam",
    aspect: "landscape",
    width: 2399,
    height: 1600,
    temporary: false,
  },
  {
    // NDSM kade -12 (PSD composite, sRGB).
    src: "/images/gallery/home-carousel-ndsm-12-pointing.jpg",
    alt: "Osman Meyredi pointing upwards with his arms spread, black T-shirt, green trees behind him",
    aspect: "landscape",
    width: 2399,
    height: 1600,
    temporary: false,
  },
  {
    // NDSM kade -15 (PSD composite, sRGB). "ADD, but zoom in a bit": zoomed
    // inside its frame, anchored at the top so his head stays whole.
    src: "/images/gallery/home-carousel-ndsm-15-white-tee.jpg",
    alt: "Osman Meyredi smiling in a white T-shirt against a dark wall at NDSM in Amsterdam",
    aspect: "landscape",
    width: 2399,
    height: 1600,
    zoom: 1.22,
    focus: "50% 0%",
    temporary: false,
  },
  {
    // NDSM kade -8, the photographer's original (sRGB). "then crop / zoom
    // in": head and shoulders, 2400 x 1600 at full resolution from x 1760,
    // y 328 of the 6000 x 4002 frame.
    src: "/images/gallery/home-carousel-ndsm-08-straw-hat.jpg",
    alt: "Osman Meyredi smiling in a straw hat and cream shirt under a cloudy sky",
    aspect: "landscape",
    width: 2400,
    height: 1600,
    temporary: false,
  },
];
