import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPageCopy } from "@/server/copy";
import { pageOpenGraph } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageCopy("services");
  return {
    title: c("seo.title"),
    description: c("seo.description"),
    alternates: { canonical: "/services" },
    openGraph: pageOpenGraph({
      title: c("seo.title"),
      description: c("seo.description"),
      path: "/services",
      image: "/images/services/concerts-live-landscape.jpg",
      imageAlt: "Osman Meyredi mid-performance at the keys, black and white",
      imageWidth: 2400,
      imageHeight: 1350,
    }),
  };
}

/**
 * Services landing — restructure round (23-09-2026): the overview was a pure
 * text table (zero imagery, a six-paragraph run). Each of the four offerings
 * is now an editorial split — approved photo on an alternating side, ghost
 * index, name, tags as metadata, the approved teaser in a narrow column and
 * the Read more route. All wording is the same Studio-editable copy
 * (Pages → Services overview), photos included.
 */
export default async function ServicesPage() {
  const c = await getPageCopy("services");
  // The four fixed routes with Studio-editable naming, teasers and photos.
  const services = (
    [
      ["concerts", "/services/concerts", [2400, 1350]],
      ["piano", "/services/piano-for-events", [1195, 1600]],
      ["production", "/services/music-production", [1920, 1282]],
      ["scores", "/services/music-library", [1867, 1400]],
    ] as const
  ).map(([slug, href, dims], i) => ({
    slug,
    href,
    index: `0${i + 1}`,
    title: c(`${slug}.title`),
    subtitle: c(`${slug}.subtitle`),
    intro: c(`${slug}.intro`),
    image: c(`${slug}.image`),
    imageAlt: c(`${slug}.imageAlt`),
    width: dims[0],
    height: dims[1],
    cta: c("readMore"),
  }));
  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <Reveal variant="text">
          <p className="eyebrow">{c("eyebrow")}</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
            {c("heading")}
          </h1>
        </Reveal>

        <div className="mt-20 space-y-24 sm:space-y-28">
          {services.map((service, i) => {
            const imageLeft = i % 2 === 0;
            return (
              <article
                key={service.slug}
                className="grid items-center gap-8 md:grid-cols-12 md:gap-x-12"
              >
                <Reveal
                  variant="mask"
                  className={
                    imageLeft ? "md:col-span-6" : "md:col-span-6 md:col-start-7 md:row-start-1"
                  }
                >
                  <Link
                    href={service.href}
                    aria-hidden="true"
                    tabIndex={-1}
                    data-cursor="OPEN"
                    className="block"
                  >
                    <div className="media-zoom border border-line">
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        width={service.width}
                        height={service.height}
                        sizes="(min-width: 768px) 40rem, 92vw"
                        className="h-auto w-full"
                        priority={i < 2}
                      />
                    </div>
                  </Link>
                </Reveal>
                <Reveal
                  variant="text"
                  delay={90}
                  className={
                    imageLeft
                      ? "md:col-span-5 md:col-start-8"
                      : "md:col-span-5 md:col-start-1 md:row-start-1"
                  }
                >
                  <p aria-hidden="true" className="chapter-num text-6xl sm:text-7xl">
                    {service.index}
                  </p>
                  <h2 className="font-display mt-4 text-3xl sm:text-4xl">
                    <Link href={service.href} className="hover:text-accent-strong">
                      {service.title}
                    </Link>
                  </h2>
                  <p className="tabular mt-3 text-xs tracking-[0.14em] text-ink-faint uppercase">
                    {service.subtitle}
                  </p>
                  <p className="mt-6 max-w-md leading-relaxed text-ink-soft">{service.intro}</p>
                  <p className="mt-7">
                    <Link
                      href={service.href}
                      className="u-link text-sm hover:text-accent-strong"
                      aria-label={`${service.cta}: ${service.title}`}
                    >
                      {service.cta} <span className="arrow-nudge" aria-hidden="true">→</span>
                    </Link>
                  </p>
                </Reveal>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
