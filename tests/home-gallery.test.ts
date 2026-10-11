/**
 * Homepage gallery (11-10-2026 correction): the original scrolling gallery
 * with the seven approved photos in order. Every slot is a real image file
 * (no placeholder); frames take their width from the declared size, so the
 * declared sizes must match the files exactly; any zoom stays slight.
 * /althome keeps its own set.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { HOME_GALLERY } from "@/data/home-gallery";
import { ALTHOME_GALLERY } from "@/data/althome-gallery";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Width and height from a baseline/progressive JPEG's SOF marker. */
function jpegSize(file: string): { w: number; h: number } {
  const b = readFileSync(file);
  expect(b.readUInt16BE(0), file).toBe(0xffd8); // SOI
  let i = 2;
  while (i < b.length - 9) {
    expect(b[i], `${file}: marker at ${i}`).toBe(0xff);
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    // SOF0–SOF15, except DHT/JPG/DAC (C4, C8, CC)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  throw new Error(`no SOF marker in ${file}`);
}

describe("homepage gallery set", () => {
  it("has seven real photos, each used once", () => {
    expect(HOME_GALLERY).toHaveLength(7);
    const srcs = HOME_GALLERY.map((g) => g.src);
    expect(new Set(srcs).size).toBe(srcs.length);
    for (const g of HOME_GALLERY) {
      expect(g.src, g.src).toMatch(/^\/images\/.+\.jpg$/);
      expect(existsSync(path.join(PUBLIC_DIR, g.src)), g.src).toBe(true);
    }
  });

  it("keeps the approved order", () => {
    expect(HOME_GALLERY.map((g) => g.src)).toEqual([
      "/images/gallery/home-carousel-01-drummer-bw.jpg",
      "/images/gallery/home-carousel-02-keys-teal.jpg",
      "/images/gallery/home-carousel-03-hat-singer.jpg",
      "/images/gallery/home-carousel-04-green-bass.jpg",
      "/images/gallery/home-carousel-05-studio-headphones.jpg",
      "/images/gallery/home-carousel-06-electric-guitar.jpg",
      "/images/about/about-performance-italy.jpg",
    ]);
  });

  it("declares every image at its real size (the layout trusts width/height)", () => {
    for (const g of HOME_GALLERY) {
      const dim = jpegSize(path.join(PUBLIC_DIR, g.src));
      expect({ src: g.src, w: dim.w, h: dim.h }).toEqual({
        src: g.src,
        w: g.width,
        h: g.height,
      });
    }
  });

  it("keeps the client's copy rules in the alt texts", () => {
    for (const g of HOME_GALLERY) {
      expect(g.alt, g.src).toContain("Osman Meyredi");
      expect(g.alt, g.src).not.toMatch(/—/);
    }
  });

  it("keeps any zoom slight, around a valid focal point", () => {
    for (const g of HOME_GALLERY) {
      if (g.zoom === undefined) continue;
      expect(g.zoom, g.src).toBeGreaterThanOrEqual(1);
      expect(g.zoom, g.src).toBeLessThanOrEqual(1.12);
      expect(g.focus ?? "50% 50%", g.src).toMatch(/^(100|\d{1,2})% (100|\d{1,2})%$/);
    }
  });
});

describe("althome gallery is unchanged by the homepage update", () => {
  it("keeps the exact pre-update set, in order, and its images exist", () => {
    expect(ALTHOME_GALLERY.map((g) => g.src)).toEqual([
      "/images/gallery/gallery-01-keys-live.jpg",
      "/images/gallery/gallery-02-bass-neon.jpg",
      "/images/gallery/gallery-03-keys-eindhoven.jpg",
      "/images/gallery/gallery-04-bass-doorway.jpg",
      "/images/gallery/gallery-05-bass-italy-crowd.jpg",
      "/images/gallery/gallery-06-bass-wine-festival.jpg",
      "/images/gallery/gallery-07-studio-2011.jpg",
      "/images/gallery/gallery-08-piano-childhood.jpg",
    ]);
    for (const g of ALTHOME_GALLERY) {
      expect(existsSync(path.join(PUBLIC_DIR, g.src)), g.src).toBe(true);
    }
  });
});
