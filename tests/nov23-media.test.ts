/**
 * Media page, 23-11 (Jolene via VP): Radio Castor's location in its label,
 * and press images that keep their real shape, so a landscape screenshot of
 * an article's page gets the wider layout.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { demoMedia } from "@/data/demo/content";
import { MEDIA_IMAGE_SIZES, mediaImageSize } from "@/data/media-images";
import { mediaItemInput } from "@/lib/validation/schemas";

const read = (file: string) => readFileSync(path.join(process.cwd(), file), "utf8");

/** Width and height from a baseline or progressive JPEG's SOF segment. */
function jpegSize(file: string): { width: number; height: number } {
  const b = readFileSync(file);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) throw new Error(`bad marker at ${i}`);
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  throw new Error("no SOF segment");
}

const radioCastor = demoMedia.find((m) => m.id === "med-radio-castor-dwtm");

describe("Radio Castor's label (Jolene, 23-11)", () => {
  it("reads “Radio Castor, Paris, France”", () => {
    expect(radioCastor?.publication).toBe("Radio Castor, Paris, France");
    expect(radioCastor?.status).toBe("PUBLISHED");
  });
});

describe("Radio Castor's image (Jolene, 23-11)", () => {
  it("is the landscape screenshot of the article's page, hosted with the site", () => {
    expect(radioCastor?.imageUrl).toBe("/images/media/radio-castor-dance-with-this-mess-2026.jpg");
    const size = mediaImageSize(radioCastor!.imageUrl!);
    expect(size).toEqual({ width: 1600, height: 790 });
    expect(size!.width).toBeGreaterThan(size!.height);
  });
});

describe("press image sizes", () => {
  it("match the files they describe", () => {
    for (const [src, size] of Object.entries(MEDIA_IMAGE_SIZES)) {
      expect(jpegSize(path.join(process.cwd(), "public", src)), src).toEqual(size);
    }
  });

  it("are found for site paths and full links to the live site, not for other sites", () => {
    const corriere = "/images/media/corriere-del-trentino-2017.jpg";
    expect(mediaImageSize(corriere)).toEqual({ width: 2000, height: 2763 });
    expect(mediaImageSize(`https://www.osmanmeyredi.com${corriere}`)).toEqual({ width: 2000, height: 2763 });
    expect(mediaImageSize(`https://osmanmeyredi.com${corriere}`)).toEqual({ width: 2000, height: 2763 });
    expect(mediaImageSize(`https://example.com${corriere}`)).toBeNull();
  });

  it("give a landscape image the wider column on the Media page", () => {
    const page = read("src/app/(public)/media/page.tsx");
    expect(page).toContain("wide: !!size && size.width > size.height");
    expect(page).toContain('featuredImage.wide ? "md:col-span-7" : "md:col-span-5"');
    expect(page).toContain('"md:col-span-5 md:col-start-8"');
    expect(page).toContain('img.wide ? "md:col-span-5" : "md:col-span-4"');
    expect(page).toContain('scan ? "article scan" : "article page"');
  });
});

describe("Studio media image field", () => {
  const base = {
    publication: "Radio Castor, Paris, France",
    headline: "A headline",
    articleUrl: "https://www.radiocastor.com/index.php/x/",
    status: "PUBLISHED",
  };

  it("takes a site path as well as a full link", () => {
    expect(mediaItemInput.safeParse({ ...base, imageUrl: "/images/media/x.jpg" }).success).toBe(true);
    expect(mediaItemInput.safeParse({ ...base, imageUrl: "https://example.com/x.jpg" }).success).toBe(true);
    expect(mediaItemInput.safeParse({ ...base, imageUrl: "" }).success).toBe(true);
    expect(mediaItemInput.safeParse({ ...base, imageUrl: "not a link" }).success).toBe(false);
  });

  it("is a text field, so the browser lets a site path through", () => {
    expect(read("src/components/studio/MediaForm.tsx")).toMatch(/name="imageUrl"\s*type="text"/);
  });
});
