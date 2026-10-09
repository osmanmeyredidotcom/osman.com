/**
 * Homepage gallery (09-10-2026): the curated Edited-folder set and the
 * /althome-style size rhythm. The images exist at their declared sizes, the
 * copy keeps the client's rules, the rhythm keeps every photo visible, and
 * /althome keeps the exact set it had before this change.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  galleryWidestRatio,
  HOME_GALLERY,
  HOME_GALLERY_RHYTHM,
  homeRhythmFor,
} from "@/data/home-gallery";
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
  it("fills all eight slots with distinct photos from /images/gallery", () => {
    expect(HOME_GALLERY).toHaveLength(8);
    const srcs = HOME_GALLERY.map((g) => g.src);
    expect(new Set(srcs).size).toBe(srcs.length);
    for (const src of srcs) expect(src).toMatch(/^\/images\/gallery\//);
  });

  it("declares every image at its real size (the layout trusts width/height)", () => {
    for (const g of HOME_GALLERY) {
      const file = path.join(PUBLIC_DIR, g.src);
      expect(existsSync(file), g.src).toBe(true);
      const dim = jpegSize(file);
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

  it("mixes sizes and orientations like the althome gallery", () => {
    const scales = HOME_GALLERY.map((_, i) => homeRhythmFor(i).scale);
    expect(new Set(scales).size).toBeGreaterThanOrEqual(4);
    expect(Math.min(...scales)).toBeLessThanOrEqual(0.56);
    expect(Math.max(...scales)).toBe(1);
    const portraits = HOME_GALLERY.filter((g) => g.width < g.height).length;
    expect(portraits).toBeGreaterThanOrEqual(2);
    expect(portraits).toBeLessThanOrEqual(6);
  });

  it("keeps every photo visible: sane rhythm values and a bounded row cap", () => {
    for (const step of HOME_GALLERY_RHYTHM) {
      expect(step.scale).toBeGreaterThanOrEqual(0.5);
      expect(step.scale).toBeLessThanOrEqual(1);
      expect(step.scaleMobile).toBeGreaterThanOrEqual(0.7);
      expect(step.scaleMobile).toBeLessThanOrEqual(1);
      expect(step.scaleMobile).toBeGreaterThanOrEqual(step.scale - 1e-9);
      expect(step.gapAfter).toBeGreaterThan(0);
      expect(step.gapAfter).toBeLessThanOrEqual(6);
      expect(["start", "center", "end"]).toContain(step.align);
    }
    // The dominant photo (scale 1) never exceeds 88vw thanks to the --H cap.
    expect(galleryWidestRatio(HOME_GALLERY)).toBeGreaterThan(0);
    expect(galleryWidestRatio(HOME_GALLERY)).toBeLessThan(2.2);
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
