/**
 * Urgent client changes of 9 Nov 2026 (Jolene; READ_FIRST order 01–03):
 *  01 Dance With This Mess shows "℗ 2026 Meyredi Records – MEY001D" in the
 *     framed label (℗ per her Additional Singles overview, VP 12-11);
 *  02 three collaborations from that overview, in her order;
 *  03b the video withdrawn from YouTube is archived.
 * Guards the demo seed (which mirrors production) and the rendering rules.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { demoReleases, demoVideos } from "@/data/demo/content";
import { catalogueLine } from "@/lib/catalogueLine";
import { byReleaseDateDesc } from "@/lib/releaseOrder";

const read = (p: string) => readFileSync(path.join(process.cwd(), p), "utf8");

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

const bySlug = (slug: string) => demoReleases.filter((r) => r.slug === slug);
const published = demoReleases.filter(
  (r) => r.status === "PUBLISHED" && r.rightsStatus !== "DO_NOT_PUBLISH"
);

describe("01 catalogue line", () => {
  it("reads exactly ℗ 2026 Meyredi Records – MEY001D on Dance With This Mess", () => {
    const [dance] = bySlug("dance-with-this-mess");
    expect(bySlug("dance-with-this-mess")).toHaveLength(1);
    expect(catalogueLine(dance)).toBe("℗ 2026 Meyredi Records – MEY001D");
    // the existing record is updated, not duplicated, and keeps its facts
    expect(dance.relationshipType).toBe("OWN_RELEASE");
    expect(dance.artworkUrl).toBe("/images/releases/dance-with-this-mess-v2.jpg");
    expect(dance.year).toBe(2026);
  });

  it("only appears on own releases with both fields set", () => {
    const [falling] = bySlug("falling-for-you");
    expect(falling.labelName).toBeTruthy(); // Peppermint Jam
    expect(catalogueLine(falling)).toBeNull();
    expect(
      catalogueLine({ relationshipType: "OWN_RELEASE", labelName: "Meyredi Records", catalogNumber: null, year: 2027, releaseDate: null })
    ).toBeNull();
    expect(
      catalogueLine({ relationshipType: "OWN_RELEASE", labelName: "Meyredi Records", catalogNumber: "MEY002", year: null, releaseDate: "2027-04-01" })
    ).toBe("℗ 2027 Meyredi Records – MEY002");
  });

  it("renders in the collaboration label's frame, written as supplied", () => {
    const src = read("src/components/public/Discography.tsx");
    const frame = "inline-block border border-line-dark px-2 py-0.5 text-[11px] tracking-[0.14em] text-ink-soft";
    expect(src).toContain(`className="catalogue-line ${frame}"`);
    expect(src).toContain(`className="${frame} uppercase"`);
    expect(src).not.toMatch(/catalogue-line[^"]*uppercase/);
  });
});

describe("02 three collaborations", () => {
  const added = [
    { slug: "be-yourself", title: "Be Yourself", artist: "Andrew Laureth feat. Stacy Locatelli", year: 2020, spotify: "6QooPA0KJmKaUfz6n4C3GV", apple: "1517215871" },
    { slug: "begin-again", title: "Begin Again", artist: "Andrew Laureth", year: 2019, spotify: "7dPGBt4dI22Nxw4nvUAvVJ", apple: "1508418209" },
    { slug: "il-senso", title: "Il Senso", artist: "Matteo Abatti", year: 2012, spotify: "5REAPRj9la7HRLhpsYCfwI", apple: "555106164" },
  ];

  it.each(added)("$title is one published collaboration with its supplied facts", (a) => {
    const rows = bySlug(a.slug);
    expect(rows).toHaveLength(1);
    const r = rows[0];
    expect(r.title).toBe(a.title);
    expect(r.primaryArtistName).toBe(a.artist);
    expect(r.relationshipType).toBe("COLLABORATION_RELEASE");
    expect(r.releaseType).toBe("SINGLE");
    expect(r.osmanCredit).toBe("Osman Meyredi: double bass");
    expect(r.year).toBe(a.year);
    expect(r.status).toBe("PUBLISHED");
    expect(r.rightsStatus).toBe("VERIFIED");
    expect(r.spotifyUrl).toContain(a.spotify);
    expect(r.spotifyUrl).not.toContain("si=");
    expect(r.appleMusicUrl).toContain(`i=${a.apple}`);
    expect(r.youtubeUrl).toBeNull();
    const file = path.join(process.cwd(), "public", r.artworkUrl ?? "");
    expect(existsSync(file)).toBe(true);
    expect(jpegSize(file)).toEqual({ width: 1200, height: 1200 });
  });

  it("no title appears twice", () => {
    const titles = demoReleases.map((r) => r.title.toLowerCase());
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("lists every single in the overview's order on /music and the homepage shelf", () => {
    expect([...published].sort(byReleaseDateDesc).map((r) => r.title)).toEqual([
      "Dance With This Mess",
      "Falling for You",
      "Keep Your Eye on the Sparrow (Special 45 Version)",
      "L’omino",
      "Be Yourself",
      "Begin Again",
      "Highway Maintenance",
      "Il Senso",
    ]);
    expect(read("src/app/(public)/music/page.tsx")).toContain(".sort(byReleaseDateDesc)");
  });
});

describe("03b withdrawn video", () => {
  it("archives only the Riccardo Orsi jam (gone from YouTube)", () => {
    const orsi = demoVideos.filter((v) => v.videoUrl?.includes("sJ7C0bGmibI"));
    expect(orsi).toHaveLength(1);
    expect(orsi[0].status).toBe("ARCHIVED");
    expect(demoVideos.filter((v) => v.status === "PUBLISHED")).toHaveLength(9);
  });
});
