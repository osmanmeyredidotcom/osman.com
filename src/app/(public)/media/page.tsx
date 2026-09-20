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

        {featured ? (
          <article className="mt-16 border-t border-line pt-10">
            <JsonLd data={articleJsonLd(featured)} />
            <Reveal variant="text">
              <p className="eyebrow">{featured.publication}</p>
              <h2 className="font-display mt-4 max-w-3xl text-3xl leading-tight sm:text-4xl">
                {featured.headline}
              </h2>
            </Reveal>
            <Reveal variant="text" delay={120}>
              {featured.date && (
                <p className="tabular mt-3 text-sm text-ink-faint">
                  {formatEventDate(featured.date).full}
                </p>
              )}
              {featured.summary && (
                <p className="mt-6 max-w-2xl leading-relaxed text-ink-soft">{featured.summary}</p>
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
          </article>
        ) : (
          <p className="mt-16 border-t border-line pt-8 text-ink-soft">
            Press coverage will be collected here.
          </p>
        )}

        {rest.length > 0 && (
          <ul className="mt-20">
            {rest.map((item, i) => (
              <li key={item.id} className="border-t border-line py-8">
                <Reveal variant="card" delay={Math.min(i * 80, 160)}>
                  <JsonLd data={articleJsonLd(item)} />
                  {/* Slide 25 shows the newspaper scan itself — surface the
                      stored image (e.g. the Corriere del Trentino page)
                      beside the entry when one exists. */}
                  {item.imageUrl && (
                    <a
                      href={item.articleUrl}
                      target="_blank"
                      rel="noopener"
                      className="float-right mb-4 ml-6 block w-28 border border-line sm:w-36"
                      aria-label={`View: ${item.headline}`}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={`${item.publication}, article scan`}
                        width={400}
                        height={560}
                        sizes="(min-width: 640px) 9rem, 7rem"
                        className="h-auto w-full"
                      />
                    </a>
                  )}
                  <p className="eyebrow">{item.publication}</p>
                  <h2 className="font-display mt-2 text-2xl leading-snug">{item.headline}</h2>
                  {item.date && (
                    <p className="tabular mt-2 text-sm text-ink-faint">
                      {formatEventDate(item.date).full}
                    </p>
                  )}
                  {item.summary && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
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
          <ul className="mt-6">
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
              <li key={film.title} className="border-t border-line py-6">
                <Reveal variant="card" delay={Math.min(i * 80, 160)}>
                  <div className="flex items-start gap-6">
                    <div className="w-24 shrink-0 border border-line sm:w-28">
                      <Image
                        src={film.poster}
                        alt={film.posterAlt}
                        width={film.width}
                        height={film.height}
                        sizes="(min-width: 640px) 7rem, 6rem"
                        className="h-auto w-full"
                      />
                    </div>
                    <div>
                      <p className="font-display text-xl leading-snug">
                        {film.title} <span className="text-ink-faint">({film.year})</span>
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{film.detail}</p>
                    </div>
                  </div>
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
