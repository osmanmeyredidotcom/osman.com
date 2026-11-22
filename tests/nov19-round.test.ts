/**
 * 19 November feedback round (Jolene, Varsha and Aditya, recording of
 * 19-11; VP's answers of 21-11). These pin the decisions that must not
 * drift back. Layout and visual checks live in the QA screenshots.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { copyDefaults } from "@/data/page-copy";
import { demoMedia, demoReleases, demoVideos } from "@/data/demo/content";
import {
  HOME_SHELF_MAX,
  MUSIC_LIST_VISIBLE,
  byReleaseDateDesc,
  homepageReleases,
} from "@/lib/releaseOrder";
import { READING_COLUMN } from "@/components/public/BioTemplate";
import type { ReleaseRecord } from "@/lib/types";

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

const published = demoReleases.filter(
  (r) => r.status === "PUBLISHED" && r.rightsStatus !== "DO_NOT_PUBLISH"
);

describe("homepage records (N19-03)", () => {
  it("features the newest release once and opens the shelf with the one before it", () => {
    const { featured, shelf } = homepageReleases(published);
    expect(featured?.title).toBe("Dance With This Mess");
    expect(shelf.map((r) => r.id)).not.toContain(featured?.id);
    expect(shelf).toHaveLength(HOME_SHELF_MAX);
    expect(HOME_SHELF_MAX).toBe(5);
    expect(shelf.map((r) => r.title)).toEqual([
      "Falling for You",
      "Keep Your Eye on the Sparrow (Special 45 Version)",
      "L’omino",
      "Be Yourself",
      "Begin Again",
    ]);
  });

  it("runs a new upload through the whole sequence", () => {
    const before = homepageReleases(published);
    const upload: ReleaseRecord = {
      ...published[0],
      id: "rel-new-single",
      slug: "new-single",
      title: "New single",
      releaseDate: "2027-02-01",
      year: 2027,
      featured: false,
    };
    const after = homepageReleases([...published, upload]);
    // The upload takes over the feature by itself …
    expect(after.featured?.id).toBe("rel-new-single");
    // … the old feature becomes the shelf's first record …
    expect(after.shelf[0].id).toBe(before.featured?.id);
    // … and the oldest record on the shelf leaves the homepage.
    expect(after.shelf).toHaveLength(HOME_SHELF_MAX);
    expect(after.shelf.map((r) => r.id)).not.toContain(before.shelf[HOME_SHELF_MAX - 1].id);
  });

  it("ignores the old Studio highlight flag", () => {
    const flaggedOld = published.map((r) => ({ ...r, featured: r.title === "Il Senso" }));
    expect(homepageReleases(flaggedOld).featured?.title).toBe("Dance With This Mess");
  });
});

describe("Music page list (N19-14)", () => {
  it("shows the newest five and puts the rest behind the plus", () => {
    expect(MUSIC_LIST_VISIBLE).toBe(5);
    const page = read("src/app/(public)/music/page.tsx");
    expect(page).toContain("published.slice(0, MUSIC_LIST_VISIBLE)");
    expect(page).toContain("published.slice(MUSIC_LIST_VISIBLE)");
    expect(page).toContain('<ReadMore label="More releases"');
    // More than five releases today, so the plus is in use.
    expect([...published].sort(byReleaseDateDesc).length).toBeGreaterThan(MUSIC_LIST_VISIBLE);
  });

  it("numbers releases with two digits from 01, also past nine", () => {
    expect(read("src/components/public/Discography.tsx")).toContain(
      'String(i + 1).padStart(2, "0")'
    );
  });
});

describe("homepage strip (N19-01)", () => {
  it("has no instruments strip under On stage soon; the footer keeps its marquee", () => {
    expect(read("src/app/(public)/page.tsx")).not.toContain("<Marquee");
    expect(read("src/components/public/SiteFooter.tsx")).toContain("<Marquee");
  });
});

describe("reading column (N19-04/05)", () => {
  it("runs the container's full width on Bio, the Bio-template pages and Custom Music (VP, 22-11)", () => {
    expect(READING_COLUMN).toBe("max-w-none");
    expect(read("src/components/public/BioTemplate.tsx")).toContain(
      "<div className={READING_COLUMN}>{children}</div>"
    );
    expect(read("src/app/(public)/services/music-library/page.tsx")).toContain("READING_COLUMN");
  });
});

describe("Live Piano photo (N19-06)", () => {
  it("ships the supplied photo at 3840 × 2560 with a description", () => {
    const live = copyDefaults("service-live-piano");
    expect(live.image).toBe("/images/services/live-piano-keys-152a0561.jpg");
    const file = path.join(process.cwd(), "public", live.image);
    expect(existsSync(file)).toBe(true);
    expect(jpegSize(file)).toEqual({ width: 3840, height: 2560 });
    expect(live.imageAlt).toContain("Osman Meyredi");
    expect(live.imageAlt).not.toContain("—");
  });
});

describe("Custom Music (N19-07/08)", () => {
  const copy = copyDefaults("service-original-scores");
  const page = read("src/app/(public)/services/music-library/page.tsx");

  it("says the five tracks are below", () => {
    expect(copy.examplesBody.startsWith("These five tracks below are just a taste of what’s possible")).toBe(true);
  });

  it("puts the library text above the one Get In Touch button and drops the bottom link", () => {
    expect(page.indexOf('c("readyBlock")')).toBeLessThan(page.indexOf('c("ctaLabel")'));
    expect(page).not.toContain('c("readyClosing")');
    expect(page.indexOf('c("previewNote")')).toBeLessThan(page.indexOf("<MusicPreviewVinyls"));
  });
});

describe("Concerts and Custom Music text without Read more (VP, 22-11)", () => {
  it("shows every paragraph of the main text, a paragraph apart", () => {
    for (const file of [
      "src/app/(public)/services/concerts/page.tsx",
      "src/app/(public)/services/music-library/page.tsx",
    ]) {
      const page = read(file);
      expect(page, file).not.toContain("<ReadMore");
      expect(page, file).toContain('value={c("body")}');
    }
    // Both fields hold two paragraphs today, so neither is cut short.
    expect(copyDefaults("service-concerts").body.split("\n\n")).toHaveLength(2);
    expect(copyDefaults("service-original-scores").body.split("\n\n")).toHaveLength(2);
  });

  it("keeps Read more on Bio and the plus on Music", () => {
    expect(read("src/app/(public)/about/page.tsx")).toContain("<ReadMore");
    expect(read("src/app/(public)/music/page.tsx")).toContain('<ReadMore label="More releases"');
  });
});

describe("Shows (N19-09/10/11)", () => {
  it("Solo shows keeps only the new-dates sentence", () => {
    const page = read("src/app/(public)/shows/concerts/page.tsx");
    expect(page).toContain("New dates appear here as soon as they are confirmed.");
    expect(page).not.toContain("Links are in");
  });

  it("puts the gigs wall back on the right, right-aligned, from 768px", () => {
    const css = read("src/app/globals.css");
    expect(css).toMatch(/\.agenda-row \{\s*display: block;\s*text-align: right;/);
    expect(css).toMatch(/width: min\(58%, 44rem\);\s*margin-left: auto;/);
    expect(read("src/app/(public)/shows/gigs/page.tsx")).toContain("readmore readmore-wall");
  });

  it("ends the gigs photo before the footer", () => {
    expect(read("src/app/globals.css")).toMatch(/\.gigs-backdrop \{[^}]*bottom: 5rem;/);
  });

  it("keeps the photo inside its section on a short wall, so the footer stays black (VP, 22-11)", () => {
    expect(read("src/app/globals.css")).toMatch(
      /\.gigs-backdrop-frame \{[^}]*height: 100svh;[^}]*max-height: 100%;/
    );
  });
});

describe("Videos order (N19-12)", () => {
  it("leads with the newest, then the red thumbnail, then the black-and-white Cinetol video", () => {
    const order = demoVideos
      .filter((v) => v.status === "PUBLISHED")
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((v) => v.id);
    expect(order.slice(0, 3)).toEqual([
      "vid-website-landscape",
      "vid-cinetol-june-2026",
      "vid-cinetol-piano",
    ]);
  });
});

describe("Contact links (N19-13/17)", () => {
  it("brings same-page links back to Get in touch and links the footer's Contact heading", () => {
    const contact = read("src/app/(public)/contact/page.tsx");
    expect(contact).toContain('<ContactSelfLinks targetId="get-in-touch" />');
    expect(contact).toContain('id="get-in-touch"');
    expect(read("src/components/public/SiteFooter.tsx")).toMatch(
      /<h2 className="eyebrow">\s*<Link href="\/contact"/
    );
  });
});

describe("one line under the header and section bar (N19-15)", () => {
  it("drops the header's own line where a section bar follows", () => {
    expect(read("src/app/globals.css")).toContain(
      'html:has(.subnav):not([data-menu-open="true"]) .site-header'
    );
  });
});

describe("Media (N19-16)", () => {
  it("lists Radio Castor's article as published, with its canonical link", () => {
    const item = demoMedia.find((m) => m.publication === "Radio Castor");
    expect(item?.status).toBe("PUBLISHED");
    expect(item?.date).toBe("2026-11-18");
    expect(item?.articleUrl).toBe(
      "https://www.radiocastor.com/index.php/osman-meyredi-insuffle-une-energie-pop-rock-vibrante-avec-le-single-dance-with-this-mess/"
    );
  });

  it("plays the homepage's radio interview on the Media page", () => {
    const page = read("src/app/(public)/media/page.tsx");
    expect(page).toContain('home("interview.video")');
    expect(page).toContain("<VideoEmbed");
  });
});
