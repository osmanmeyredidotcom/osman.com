import type { Metadata } from "next";
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
 * Services landing — 12-10 feedback round (SERVICES.md / AV-12): the earlier
 * register layout, restored. Each of the four offerings is one concise row —
 * ghost index, name, tags as metadata, the approved teaser and the Read more
 * route — with no photography and no introductory prose above the register.
 * All wording is the same Studio-editable copy (Pages → Services overview).
 * The opening banner marked by P08-X244 waits for the approved asset (Q3);
 * nothing is invented in its place.
 */
export default async function ServicesPage() {
  const c = await getPageCopy("services");
  // The four fixed routes with Studio-editable naming and teasers.
  const services = (
    [
      ["concerts", "/services/concerts"],
      ["piano", "/services/piano-for-events"],
      ["production", "/services/music-production"],
      ["scores", "/services/music-library"],
    ] as const
  ).map(([slug, href], i) => ({
    slug,
    href,
    index: `0${i + 1}`,
    title: c(`${slug}.title`),
    subtitle: c(`${slug}.subtitle`),
    intro: c(`${slug}.intro`),
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

        <div className="mt-16 border-b border-line">
          {services.map((service, i) => (
            <article key={service.slug} className="border-t border-line py-12 sm:py-14">
              <Reveal variant="text" delay={Math.min(i * 70, 210)}>
                <div className="grid gap-6 md:grid-cols-12 md:gap-x-12">
                  <div className="flex items-start gap-6 md:col-span-7">
                    <p aria-hidden="true" className="service-index shrink-0 text-4xl sm:text-5xl">
                      {service.index}
                    </p>
                    <div className="min-w-0">
                      <h2 className="font-display text-3xl sm:text-4xl">
                        <Link
                          href={service.href}
                          className="hover:text-accent-strong"
                          data-cursor={service.slug === "concerts" ? "BOOK" : "OPEN"}
                        >
                          {service.title}
                        </Link>
                      </h2>
                      <p className="tabular mt-3 text-xs tracking-[0.14em] text-ink-faint uppercase">
                        {service.subtitle}
                      </p>
                      <p className="mt-5 max-w-xl leading-relaxed text-ink-soft">
                        {service.intro}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-4 md:col-start-9 md:justify-self-end md:self-center">
                    <Link
                      href={service.href}
                      className="u-link text-sm hover:text-accent-strong"
                      aria-label={`${service.cta}: ${service.title}`}
                    >
                      {service.cta}
                    </Link>
                  </div>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
