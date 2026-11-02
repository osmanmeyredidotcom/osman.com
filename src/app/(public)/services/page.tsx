import type { Metadata } from "next";
import Link from "next/link";
import { getPageCopy } from "@/server/copy";
import { pageOpenGraph } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { PageBanner } from "@/components/public/PageBanner";
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
 * 22-10 round 2 (R2-0): the banner-image area marked "Banner image here"
 * (P08-X244) sits between the opening heading and the register. 2-11 (VP):
 * it carries the former homepage photograph (Osman Meyredi at the drums,
 * green shirt), full width like the Bio and Live Piano banners
 * (P11-X254). Studio: Pages → Services overview → banner image.
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
      </Container>

      {/* R2-0 (P08-X244 "Banner image here"): the banner between the heading
          and the register, edge to edge (2-11). */}
      <PageBanner className="mt-12" src={c("banner.image")} alt={c("banner.imageAlt")} />

      <Container wide>
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
                          /* 22-10 item 3 (HOVER_CURSOR-04): approved vocabulary
                             only — the bookable performance services say BOOK
                             (the approved Concerts mapping), the studio
                             services read as VIEW; the old OPEN deviation is
                             gone. */
                          data-cursor={
                            service.slug === "concerts" || service.slug === "piano"
                              ? "BOOK"
                              : "VIEW"
                          }
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
                      data-cursor={
                        service.slug === "concerts" || service.slug === "piano"
                          ? "BOOK"
                          : "VIEW"
                      }
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
