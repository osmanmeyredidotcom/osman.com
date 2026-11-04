/**
 * Page banners (2-11, VP): the Bio banner returns with a photograph from the
 * client's edited NDSM kade set, the Services overview banner carries the
 * former homepage photograph, and the homepage hero is the retouched NDSM
 * portrait cropped above the jacket's zip pull. Guards that every default
 * ships with the site at the expected size and that the descriptions follow
 * the client copy rules.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { copyDefaults } from "@/data/page-copy";

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

const pub = (p: string) => path.join(process.cwd(), "public", p);

describe("page banners and hero", () => {
  const about = copyDefaults("about");
  const services = copyDefaults("services");
  const home = copyDefaults("home");

  it("ships each default image at its expected size", () => {
    const expected: Array<[string, number, number]> = [
      [about["banner.image"], 2400, 1600],
      [services["banner.image"], 2400, 1600],
      [home["hero.image"], 1920, 1080],
    ];
    for (const [src, width, height] of expected) {
      expect(existsSync(pub(src)), src).toBe(true);
      expect(jpegSize(pub(src)), src).toEqual({ width, height });
    }
  });

  it("describes each banner in the client's words", () => {
    for (const alt of [about["banner.imageAlt"], services["banner.imageAlt"]]) {
      expect(alt).toContain("Osman Meyredi");
      expect(alt).not.toContain("—");
    }
  });
});
