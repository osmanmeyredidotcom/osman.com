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
 * Services landing — Round 3 Keynote (20-09-2026): heading hierarchy is
 * "All Services" / "Work with Osman Meyredi" (the old "Four ways…" title is
 * removed), with the renamed offerings from src/data/services.ts.
 */
export default async function ServicesPage() {
  const c = await getPageCopy("services");
  // The four fixed routes with Studio-editable naming and teasers (§13).
  const services = (
    [
      ["concerts", "/services/concerts"],
      ["piano", "/services/piano-for-events"],
      ["production", "/services/music-production"],
      ["scores", "/services/music-library"],
    ] as const
  ).map(([slug, href]) => ({
    slug,
    href,
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

        <div className="mt-16">
          {services.map((service, i) => (
            <Reveal
              key={service.slug}
              variant="card"
              delay={i * 90}
              className="group grid gap-4 border-t border-line py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] md:items-baseline md:gap-10"
            >
              <div>
                <h2 className="font-display text-2xl">
                  <Link
                    href={service.href}
                    className="inline-block transition-transform duration-300 ease-(--ease-out-cubic) group-hover:translate-x-1 hover:text-accent-strong"
                  >
                    {service.title}
                  </Link>
                </h2>
                <p className="tabular mt-2 text-xs tracking-[0.14em] text-ink-faint uppercase">
                  {service.subtitle}
                </p>
              </div>
              <p className="leading-relaxed text-ink-soft">{service.intro}</p>
              <Link
                href={service.href}
                className="u-link text-sm hover:text-accent-strong"
                aria-label={`${service.cta}: ${service.title}`}
              >
                {service.cta} <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
