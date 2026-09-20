/**
 * The four ways to work with Osman — Round 3 Keynote (20-09-2026): the
 * services are named "Concerts", "Live Piano", "Music Production" and
 * "Original Scores & Custom Music" (old labels like "& Live Performances",
 * "for Events", "Special Events" and "Original Tracks & Music Library" are
 * removed). Copy follows the FINAL_Sep26 pages documents. Keep wording in
 * sync with the fullscreen menu, the services sub-nav and the footer.
 * URLs are unchanged (existing links and redirects keep working).
 */
export type ServiceCard = {
  slug: string;
  href: string;
  title: string;
  subtitle: string;
  intro: string;
  cta: string;
};

export const SERVICES: ServiceCard[] = [
  {
    slug: "concerts",
    href: "/services/concerts",
    title: "Concerts",
    subtitle: "Festivals · Venues · Events",
    intro:
      "BOOK OSMAN LIVE. One artist. Many instruments. A show built around the moment.",
    cta: "Read more",
  },
  {
    slug: "piano-for-events",
    href: "/services/piano-for-events",
    title: "Live Piano",
    subtitle: "Corporate · Receptions · Conferences",
    intro:
      "Osman Meyredi performs live solo piano for company celebrations, brand launches, conferences, receptions and other private and corporate occasions.",
    cta: "Read more",
  },
  {
    slug: "music-production",
    href: "/services/music-production",
    title: "Music Production",
    subtitle: "Production · Arrangement · Instrumentation · Recording · Mixing · Mastering",
    intro:
      "Whether you have a rough idea, a demo that isn't quite there yet, or a nearly finished song that needs the final production, mixing or mastering, he can step in at the point where you need him.",
    cta: "Read more",
  },
  {
    slug: "music-library",
    href: "/services/music-library",
    title: "Original Scores & Custom Music",
    subtitle: "Film · TV · Documentary · Events · Online · Series · Adverts · Radio",
    intro:
      "Every track is composed, performed and produced by Osman personally, from the melody to the backing tracks, with no AI involved and nothing outsourced.",
    cta: "Read more",
  },
];
