import type { MetadataRoute } from "next";
import { getRepos } from "@/server/repositories";
import { siteUrl } from "@/lib/site";

/**
 * XML sitemap (brief §18): canonical production URLs only, with `lastmod`
 * derived from real content updates — the newest `updatedAt` among the
 * PUBLISHED records that actually feed each page. Routes whose content is
 * code-authored approved copy (About, the service pages) deliberately omit
 * lastmod rather than faking a change on every deploy.
 *
 * force-dynamic: the sitemap is rendered per-request from the live
 * repositories, so events/releases/videos published in the Studio appear
 * without a redeploy.
 */

export const dynamic = "force-dynamic";

type Stamped = { status: string; updatedAt: string };

function newest(...groups: Stamped[][]): Date | undefined {
  let max: string | undefined;
  for (const rows of groups) {
    for (const row of rows) {
      // "PUBLISHED" is live content; "AVAILABLE" is the shop's live state.
      if (row.status !== "PUBLISHED" && row.status !== "AVAILABLE") continue;
      if (!max || row.updatedAt > max) max = row.updatedAt;
    }
  }
  return max ? new Date(max) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repos = getRepos();
  const [events, videos, releases, collaborations, media, products, faqs] =
    await Promise.all([
      repos.events.list(),
      repos.videos.list(),
      repos.releases.list(),
      repos.collaborations.list(),
      repos.media.list(),
      repos.products.list(),
      // Tolerate a database that predates the Faq migration.
      repos.faqs.list().catch(() => []),
    ]);

  const homeLastmod = newest(events, videos, releases, collaborations, media);
  const showsLastmod = newest(events);

  const routes: Array<{
    path: string;
    lastModified?: Date;
    changeFrequency: "weekly" | "monthly";
    priority: number;
  }> = [
    { path: "", lastModified: homeLastmod, changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/services", changeFrequency: "monthly", priority: 0.8 },
    { path: "/services/concerts", changeFrequency: "monthly", priority: 0.8 },
    { path: "/services/piano-for-events", changeFrequency: "monthly", priority: 0.8 },
    { path: "/services/music-production", changeFrequency: "monthly", priority: 0.8 },
    { path: "/services/music-library", changeFrequency: "weekly", priority: 0.8 },
    { path: "/shows", lastModified: showsLastmod, changeFrequency: "weekly", priority: 0.9 },
    { path: "/shows/concerts", lastModified: showsLastmod, changeFrequency: "weekly", priority: 0.9 },
    { path: "/shows/gigs", lastModified: showsLastmod, changeFrequency: "weekly", priority: 0.9 },
    {
      path: "/shows/live-videos",
      lastModified: newest(videos),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/music",
      lastModified: newest(releases, collaborations),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { path: "/media", lastModified: newest(media), changeFrequency: "monthly", priority: 0.6 },
    { path: "/shop", lastModified: newest(products), changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", lastModified: newest(faqs), changeFrequency: "monthly", priority: 0.8 },
  ];

  return routes.map((route) => ({
    url: `${siteUrl()}${route.path}`,
    ...(route.lastModified ? { lastModified: route.lastModified } : {}),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
