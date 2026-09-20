import type { Metadata } from "next";
import localFont from "next/font/local";
import { isPreviewDeployment, siteUrl } from "@/lib/site";
import "./globals.css";

/**
 * Self-hosted variable fonts (no Google Fonts request at runtime — faster and
 * GDPR-friendlier for an EU audience). Files vendored from Fontsource (OFL).
 *
 * Archivo variable carries both wght (100–900) and wdth (62–125) axes — the
 * display voice of the site: strong, slightly condensed grotesk uppercase.
 */
const archivo = localFont({
  src: [
    {
      path: "../fonts/archivo-latin-standard-normal.woff2",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-archivo",
  display: "swap",
});

const inter = localFont({
  src: [
    {
      path: "../fonts/inter-latin-wght-normal.woff2",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

// Gilroy lives on only inside the logotype artwork (a traced SVG) and the
// favicon; it is not registered as a webfont. Its woff2 remains in src/fonts
// for an easy re-enable if the brand direction changes again.

/**
 * Global metadata (SEO foundation brief, part D).
 * - metadataBase resolves every relative canonical/OG url against the one
 *   preferred host (§16) — see src/lib/site.ts for the resolution order.
 * - Preview deployments are noindex,nofollow at the page level too (§21),
 *   on top of the preview robots.txt and X-Robots-Tag header.
 * - Search Console / Bing verification tags appear as soon as the env vars
 *   are set (§20) — no code change needed at verification time.
 * Titles, descriptions and OG objects are unique per page (§22); these are
 * only the fallbacks and shared defaults.
 */
const preview = isPreviewDeployment();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Osman Meyredi | Artist, multi-instrumentalist & producer",
    template: "%s | Osman Meyredi",
  },
  description:
    "Osman Meyredi: artist, multi-instrumentalist, producer, music director, composer, songwriter and singer. Live shows, piano for events, music production and a licensing library across the Netherlands, Italy and Europe.",
  robots: preview
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
  openGraph: {
    type: "website",
    siteName: "Osman Meyredi",
    url: siteUrl(),
    images: [
      {
        url: "/images/home-hero-landscape.jpg",
        width: 1920,
        height: 1080,
        alt: "Osman Meyredi singing at the keys under stage light",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      {/* No pre-hydration scripts needed: reveals arm themselves client-side
          after hydration (content is visible by default for no-JS visitors),
          and cursor/header states are only ever set by client components. */}
      <body>{children}</body>
    </html>
  );
}
