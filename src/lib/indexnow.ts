import "server-only";
import { after } from "next/server";
import { absoluteUrl, isIndexableProduction, siteUrl } from "./site";

/**
 * IndexNow (SEO foundation brief §19): when the Studio publishes, updates
 * or archives public content, the affected canonical URLs are submitted to
 * the IndexNow endpoint (Bing + participating engines).
 *
 * Guard rails:
 * - fires only on real production deployments with INDEXNOW_KEY set —
 *   previews, local dev and demo mode never ping (§21);
 * - submits only the handful of pages a change actually affects — never
 *   bulk resubmission of unchanged URLs (§19);
 * - runs after the response via `after()` and swallows every failure: a
 *   search-engine ping must never break or slow a Studio save.
 *
 * Setup (one-time, post-launch): generate any 32+ char hex key, set it as
 * INDEXNOW_KEY on Vercel. The key file is served at /indexnow-key.txt by
 * src/app/indexnow-key.txt/route.ts and referenced via keyLocation, as the
 * IndexNow protocol allows.
 */

export type ChangedContent =
  | "events"
  | "videos"
  | "releases"
  | "collaborations"
  | "media"
  | "libraryTracks"
  | "products"
  | "services"
  | "settings"
  | "faqs";

const AFFECTED_PATHS: Record<ChangedContent, string[]> = {
  events: ["/", "/shows", "/shows/concerts", "/shows/gigs"],
  videos: ["/", "/shows/live-videos"],
  releases: ["/", "/music"],
  collaborations: ["/", "/music"],
  media: ["/", "/media"],
  libraryTracks: ["/services/music-library"],
  products: ["/shop"],
  services: [
    "/",
    "/services",
    "/services/concerts",
    "/services/piano-for-events",
    "/services/music-production",
    "/services/music-library",
  ],
  settings: ["/", "/contact"],
  faqs: ["/contact"],
};

export function notifyIndexNow(kind: ChangedContent): void {
  const key = process.env.INDEXNOW_KEY;
  if (!key || !isIndexableProduction()) return;

  const urlList = AFFECTED_PATHS[kind].map(absoluteUrl);
  const payload = {
    host: new URL(siteUrl()).host,
    key,
    keyLocation: absoluteUrl("/indexnow-key.txt"),
    urlList,
  };

  after(async () => {
    try {
      await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      // Best-effort by design — crawlers also find changes via the sitemap.
    }
  });
}
