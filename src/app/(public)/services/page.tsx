import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import { pageOpenGraph } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";

const PAGE_TITLE = "Services — Concerts, live piano, production & original scores";
const PAGE_DESCRIPTION =
  "Work with Osman Meyredi: concerts, live solo piano, music production from first idea to finished track, and original scores and custom music composed for your project.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: pageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/services",
    image: "/images/services/concerts-live-landscape.jpg",
    imageAlt: "Osman Meyredi mid-performance at the keys, black and white",
    imageWidth: 2400,
    imageHeight: 1350,
  }),
};

/**
 * Services landing — Round 3 Keynote (20-09-2026): heading hierarchy is
 * "All Services" / "Work with Osman Meyredi" (the old "Four ways…" title is
 * removed), with the renamed offerings from src/data/services.ts.
 */
export default function ServicesPage() {
  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <Reveal variant="text">
          <p className="eyebrow">All Services</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
            Work with Osman Meyredi
          </h1>
        </Reveal>

        <div className="mt-16">
          {SERVICES.map((service, i) => (
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
                aria-label={`${service.cta} — ${service.title}`}
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
