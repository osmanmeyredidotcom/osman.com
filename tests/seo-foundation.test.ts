/**
 * SEO foundation invariants: one canonical host everywhere, a stable
 * Person @id, preview de-indexing, honest structured data (billing
 * preserved, no fabricated video dates), and a sitemap/robots pair that
 * never exposes the Studio.
 */
import { afterEach, describe, expect, it } from "vitest";

import { absoluteUrl, isPreviewDeployment, PERSON_ID, siteUrl } from "@/lib/site";
import {
  musicAlbumJsonLd,
  musicEventJsonLd,
  personJsonLd,
  videoJsonLd,
} from "@/lib/seo";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { demoReleases, demoVideos, realEvents } from "@/data/demo/content";

const ENV_KEYS = ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_ENV"] as const;
const saved: Record<string, string | undefined> = {};
for (const k of ENV_KEYS) saved[k] = process.env[k];

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("canonical host strategy (§16/§21)", () => {
  it("prefers the explicit site URL, then the Vercel production domain", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.osmanmeyredi.com/";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "osman-com.vercel.app";
    expect(siteUrl()).toBe("https://www.osmanmeyredi.com");

    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(siteUrl()).toBe("https://osman-com.vercel.app");
  });

  it("builds absolute URLs without double slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.osmanmeyredi.com";
    expect(absoluteUrl("/about")).toBe("https://www.osmanmeyredi.com/about");
    expect(absoluteUrl("/")).toBe("https://www.osmanmeyredi.com");
    expect(absoluteUrl("https://example.com/x")).toBe("https://example.com/x");
  });

  it("treats only non-production VERCEL_ENV as preview", () => {
    process.env.VERCEL_ENV = "preview";
    expect(isPreviewDeployment()).toBe(true);
    process.env.VERCEL_ENV = "production";
    expect(isPreviewDeployment()).toBe(false);
    delete process.env.VERCEL_ENV;
    expect(isPreviewDeployment()).toBe(false);
  });
});

describe("robots.txt (§12/§21)", () => {
  it("allows Googlebot, Bingbot and OAI-SearchBot while blocking the Studio", () => {
    delete process.env.VERCEL_ENV;
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const agents = rules.map((r) => r.userAgent);
    expect(agents).toContain("Googlebot");
    expect(agents).toContain("Bingbot");
    expect(agents).toContain("OAI-SearchBot");
    for (const rule of rules) {
      expect(rule.allow).toBe("/");
      expect(rule.disallow).toContain("/studio");
    }
    expect(String(result.sitemap)).toMatch(/\/sitemap\.xml$/);
  });

  it("disallows everything on preview deployments", () => {
    process.env.VERCEL_ENV = "preview";
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules).toHaveLength(1);
    expect(rules[0].disallow).toBe("/");
  });
});

describe("sitemap (§18)", () => {
  it("lists only canonical public routes on the preferred host", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.osmanmeyredi.com";
    const entries = await sitemap();
    expect(entries.length).toBeGreaterThan(10);
    for (const entry of entries) {
      expect(entry.url.startsWith("https://www.osmanmeyredi.com")).toBe(true);
      expect(entry.url.includes("/studio")).toBe(false);
    }
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://www.osmanmeyredi.com/music");
    expect(urls).toContain("https://www.osmanmeyredi.com/services/piano-for-events");
  });

  it("derives lastmod from real content updates where content feeds a page", async () => {
    const entries = await sitemap();
    const music = entries.find((e) => e.url.endsWith("/music"))!;
    expect(music.lastModified).toBeInstanceOf(Date);
    // Code-authored approved copy carries no fake lastmod.
    const about = entries.find((e) => e.url.endsWith("/about"))!;
    expect(about.lastModified).toBeUndefined();
  });
});

describe("structured data (§32–§36)", () => {
  it("uses one stable Person @id", () => {
    const person = personJsonLd(["https://www.instagram.com/osman.meyredi/"]);
    expect(person["@id"]).toBe(PERSON_ID);
    expect(PERSON_ID).toBe("https://www.osmanmeyredi.com/#osman-meyredi");
  });

  it("never bills a non-own release to Osman", () => {
    const appearsOn = demoReleases.find(
      (r) => r.relationshipType === "CONTRIBUTING_ARTIST" && r.status === "PUBLISHED"
    )!;
    const data = musicAlbumJsonLd(appearsOn);
    const byArtist = data.byArtist as { name: string };
    expect(byArtist.name).toBe(appearsOn.primaryArtistName);
    const contributor = data.contributor as { "@id": string };
    expect(contributor["@id"]).toBe(PERSON_ID);
  });

  it("emits real UTC instants for venue-local event times", () => {
    const event = realEvents.find((e) => e.status === "PUBLISHED") ?? realEvents[0];
    const data = musicEventJsonLd(event);
    expect(String(data.startDate)).toMatch(/Z$/);
    const performer = data.performer as { "@id": string };
    expect(performer["@id"]).toBe(PERSON_ID);
  });

  it("never fabricates video upload dates or durations (§36)", () => {
    for (const video of demoVideos) {
      const data = videoJsonLd(video);
      expect(data.uploadDate).toBeUndefined();
      expect(data.duration).toBeUndefined();
      expect(data.name).toBe(video.title);
    }
  });

  it("derives a real thumbnail for YouTube videos and uses the stored poster for files", () => {
    // The Cinetol draft has no URL yet (Round 3) — structured data is only
    // ever emitted for published videos, so test against one of those.
    const yt = demoVideos.find((v) => v.platform === "youtube" && v.status === "PUBLISHED" && v.videoUrl)!;
    expect(String(videoJsonLd(yt).thumbnailUrl)).toContain("i.ytimg.com");
    const file = demoVideos.find((v) => v.platform === "file")!;
    expect(String(videoJsonLd(file).thumbnailUrl)).toContain(
      "/images/videos/website-landscape-poster.jpg"
    );
    expect(String(videoJsonLd(file).contentUrl)).toContain("/videos/website-landscape.mp4");
  });
});
