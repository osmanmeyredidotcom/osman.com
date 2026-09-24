import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { formatEventDate } from "@/lib/events";
import { JsonLd, articleJsonLd, pageOpenGraph } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Media | As Seen & Heard";
const PAGE_DESCRIPTION =
  "Press coverage, reviews and interviews featuring Osman Meyredi, and how to reach him for press inquiries.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/media" },
  openGraph: pageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/media",
    image: "/images/about/about-multi-instrumentalist.jpg",
    imageAlt: "Osman Meyredi on stage surrounded by his instruments, black and white",
    imageWidth: 1920,
    imageHeight: 1071,
  }),
};

export default async function MediaPage() {
  const repos = getRepos();
  const [items, settings] = await Promise.all([repos.media.list(), repos.settings.get()]);
  const published = items
    .filter((m) => m.status === "PUBLISHED")
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  const featured = published.find((m) => m.featured) ?? published[0] ?? null;
  const rest = published.filter((m) => m !== featured);

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <Reveal variant="text">
          <p className="eyebrow">Media</p>
          {/* Round 2 slide 25: the client's new heading for this page. */}
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
            As Seen &amp; Heard
          </h1>
        </Reveal>

        {/* Image-first cohesion pass (24-09, §30–33): press imagery leads.
            The featured story is an image-led split, list items use a
            deliberate image/text grid — no floated thumbnails, no text
            wrapping around media. All wording unchanged. */}
        {featured ? (
          <article className="mt-16 border-t border-line pt-12">
            <JsonLd data={articleJsonLd(featured)} />
            <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-x-12">
              {featured.imageUrl && (
                <Reveal variant="mask" className="md:col-span-5">
                  <a
                    href={featured.articleUrl}
                    target="_blank"
                    rel="noopener"
                    aria-label={`View: ${featured.headline}`}
                    className="block border border-line"
                  >
                    <Image
                      src={featured.imageUrl}
                      alt={`${featured.publication}, article scan`}
                      width={400}
                      height={560}
                      sizes="(min-width: 768px) 30rem, 92vw"
                      className="h-auto w-full"
                    />
                  </a>
                </Reveal>
              )}
              <Reveal
                variant="text"
                delay={90}
                className={featured.imageUrl ? "md:col-span-6 md:col-start-7" : "md:col-span-8"}
              >
                <p className="eyebrow">{featured.publication}</p>
                <h2 className="font-display mt-4 max-w-3xl text-3xl leading-tight sm:text-4xl">
                  {featured.headline}
                </h2>
                {featured.date && (
                  <p className="tabular mt-3 text-sm text-ink-faint">
                    {formatEventDate(featured.date).full}
                  </p>
                )}
                {featured.summary && (
                  <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">{featured.summary}</p>
                )}
                <p className="mt-7">
                  <a
                    href={featured.articleUrl}
                    target="_blank"
                    rel="noopener"
                    className="u-link text-sm hover:text-accent-strong"
                  >
                    {featured.articleUrl.startsWith("/") ? "View the article scan" : "Read the article"}{" "}
                    <span className="arrow-nudge" aria-hidden="true">→</span>
                  </a>
                </p>
              </Reveal>
            </div>
          </article>
        ) : (
          <p className="mt-16 border-t border-line pt-8 text-ink-soft">
            Press coverage will be collected here.
          </p>
        )}

        {rest.length > 0 && (
          <ul className="mt-20">
            {rest.map((item, i) => (
              <li key={item.id} className="border-t border-line py-10">
                <Reveal variant="card" delay={Math.min(i * 80, 160)}>
                  <JsonLd data={articleJsonLd(item)} />
                  <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-x-12">
                    {item.imageUrl && (
                      <a
                        href={item.articleUrl}
                        target="_blank"
                        rel="noopener"
                        className="block border border-line md:col-span-4"
                        aria-label={`View: ${item.headline}`}
                      >
                        <Image
                          src={item.imageUrl}
                          alt={`${item.publication}, article scan`}
                          width={400}
                          height={560}
                          sizes="(min-width: 768px) 24rem, 92vw"
                          className="h-auto w-full"
                        />
                      </a>
                    )}
                    <div className={item.imageUrl ? "md:col-span-7 md:col-start-6" : "md:col-span-8"}>
                      <p className="eyebrow">{item.publication}</p>
                      <h2 className="font-display mt-2 text-2xl leading-snug sm:text-3xl">
                        {item.headline}
                      </h2>
                      {item.date && (
                        <p className="tabular mt-2 text-sm text-ink-faint">
                          {formatEventDate(item.date).full}
                        </p>
                      )}
                      {item.summary && (
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                          {item.summary}
                        </p>
                      )}
                      <p className="mt-4">
                        <a
                          href={item.articleUrl}
                          target="_blank"
                          rel="noopener"
                          className="u-link text-sm hover:text-accent-strong"
                        >
                          {item.articleUrl.startsWith("/") ? "View the article scan" : "Read the article"}{" "}
                          <span className="arrow-nudge" aria-hidden="true">→</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        {/* On screen — Round 2 slide 32 / brief §45: film appearances live on
            the Media page, kept separate from music. Exact client-supplied
            titles, years, directors and casts; no timestamps or scene claims
            (unknown), and no film stills until approved imagery exists. */}
        <section className="mt-20 border-t border-line pt-10" aria-labelledby="on-screen">
          <Reveal variant="text">
            <h2 id="on-screen" className="eyebrow">
              On screen
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
              Osman Meyredi appeared as an extra in three films.
            </p>
          </Reveal>
          {/* 12-09-2026 (Aditya): cover images beside each film — cropped
              from the client's own photograph of the three DVDs (rights-
              clean; swap 1:1 for sharper scans when Jolene supplies them). */}
          {/* Cohesion pass (§30–31): the three covers carry the band —
              full-column posters instead of thumbnail strips. */}
          <ul className="mt-10 grid gap-x-12 gap-y-12 sm:grid-cols-3">
            {[
              {
                title: "La Foresta di Ghiaccio",
                year: "2014",
                detail:
                  "Directed by Claudio Noce, with Emir Kusturica, Ksenia Rappoport, Domenico Diele, Adriano Giannini",
                poster: "/images/media/movies-la-foresta-di-ghiaccio-poster.jpg",
                posterAlt: "La Foresta di Ghiaccio (2014) DVD cover",
                width: 426,
                height: 618,
              },
              {
                title: "Lezione Ventuno",
                year: "2008",
                detail:
                  "Directed by Alessandro Baricco, with Noah Taylor, Leonor Watling, Clive Russell, John Hurt",
                poster: "/images/media/movies-lezione-ventuno-cover.jpg",
                posterAlt: "Lezione Ventuno (2008) DVD cover",
                width: 416,
                height: 582,
              },
              {
                title: "Vincere",
                year: "2009",
                detail: "Directed by Marco Bellocchio, with Giovanna Mezzogiorno, Filippo Timi",
                poster: "/images/media/movies-vincere-poster.jpg",
                posterAlt: "Vincere (2009) DVD cover",
                width: 370,
                height: 570,
              },
            ].map((film, i) => (
              <li key={film.title} className="border-t border-line pt-8">
                <Reveal variant="card" delay={Math.min(i * 80, 160)}>
                  <div className="mx-auto max-w-[320px] border border-line sm:mx-0 sm:max-w-none">
                    <Image
                      src={film.poster}
                      alt={film.posterAlt}
                      width={film.width}
                      height={film.height}
                      sizes="(min-width: 640px) 24rem, 80vw"
                      className="h-auto w-full"
                    />
                  </div>
                  <p className="font-display mt-5 text-xl leading-snug">
                    {film.title} <span className="text-ink-faint">({film.year})</span>
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{film.detail}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-20 border-t border-line pt-8 text-sm text-ink-soft">
          Press inquiries:{" "}
          <a href={`mailto:${settings.contactEmail}`} className="u-link">
            {settings.contactEmail}
          </a>
          {/* Contextual internal links (§31): Media → About/Contact. */}
          {" · "}Writing about him?{" "}
          <Link href="/about" className="u-link">
            The full story is on the About page
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
