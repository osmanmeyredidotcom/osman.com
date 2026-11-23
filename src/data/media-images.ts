/**
 * Pixel sizes of the press images hosted with the site (public/images/media),
 * so the Media page reserves the right space before an image loads and gives
 * a landscape image, such as a screenshot of an article's page, the wider
 * layout (Jolene, 23-11: "something that is a candy for the eye, that
 * visitors can see what site they are going to"). An image from anywhere
 * else keeps the portrait layout of the scans. tests/nov23-media.test.ts
 * checks every entry against its file.
 */
export const MEDIA_IMAGE_SIZES: Readonly<Record<string, { width: number; height: number }>> = {
  "/images/media/corriere-del-trentino-2017.jpg": { width: 2000, height: 2763 },
  // 23-11: VP's screenshot of Radio Castor's article page, cropped to the
  // article panel (photo, tags, headline, byline; the breadcrumb left out
  // at VP's request), sRGB, 1600px.
  "/images/media/radio-castor-dance-with-this-mess-2026.jpg": { width: 1600, height: 694 },
};

/** The site path of an image hosted with the site, also when the Studio
 *  holds it as a full link to the live site. */
function sitePath(src: string): string {
  const own = /^https?:\/\/(?:www\.)?osmanmeyredi\.com(\/[^?#]*)/i.exec(src);
  return own ? own[1] : src;
}

/** The image's size when the site hosts it, else null. */
export function mediaImageSize(src: string): { width: number; height: number } | null {
  return MEDIA_IMAGE_SIZES[sitePath(src)] ?? null;
}
