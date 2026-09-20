import type { NextConfig } from "next";

/** Vercel preview/development deployments — see SEO brief §21. */
const isPreview = Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== "production";

const nextConfig: NextConfig = {
  // "standalone" packages a self-contained server for the Docker image.
  // Vercel does its own output tracing and breaks if standalone is forced
  // (ENOENT .next/next-server.js.nft.json), so skip it there.
  output: process.env.VERCEL ? undefined : "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      // Keynote 02-09 services rename: coaching → piano for events,
      // workshops → music production. Old URLs stay alive for SEO/links.
      {
        source: "/services/coaching",
        destination: "/services/piano-for-events",
        permanent: true,
      },
      {
        source: "/services/workshops",
        destination: "/services/music-production",
        permanent: true,
      },
      // Wix → new-site redirect map (SEO brief §17): the old site's indexed
      // routes, mapped page-by-page to their closest new equivalent so
      // existing search signals and backlinks carry over at domain cutover.
      // `permanent: true` issues a 308 — the same permanent signal to
      // search engines as a 301. Routes verified on the live Wix site;
      // extend this list if further old URLs surface in Search Console.
      // Round 3 (20-09-2026): the separate Tickets page is removed — ticket
      // links live on the concert entries; the old route lands on Concerts.
      { source: "/shows/tickets", destination: "/shows/concerts", permanent: true },
      { source: "/about-eng", destination: "/about", permanent: true },
      { source: "/about-3", destination: "/about", permanent: true },
      { source: "/music-eng", destination: "/music", permanent: true },
      { source: "/contact-eng", destination: "/contact", permanent: true },
    ];
  },
  async headers() {
    // Belt-and-braces preview de-indexing (§21): the header applies to every
    // response — pages, images, files — alongside the per-page noindex
    // metadata and the preview robots.txt disallow. VERCEL_ENV is fixed at
    // build time per deployment, so this can never leak into production.
    if (!isPreview) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
