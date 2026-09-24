import type { Metadata } from "next";
import Image from "next/image";
import { getPageCopy } from "@/server/copy";
import { CopyInline, CopyText } from "@/components/public/CopyText";
import { Callout } from "@/components/public/Callout";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";
import { breadcrumbJsonLd, JsonLd, pageOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // §23 title direction; Studio-editable via Pages → Music Production.
  const c = await getPageCopy("service-music-production");
  return {
    title: { absolute: c("seo.title") },
    description: c("seo.description"),
    alternates: { canonical: "/services/music-production" },
    openGraph: pageOpenGraph({
      title: c("seo.title"),
      description: c("seo.description"),
      path: "/services/music-production",
      image: "/images/services/production-zappatika-rehearsals-1.jpg",
      imageAlt: "Osman Meyredi at the keys in rehearsal with a guitarist, black and white",
      imageWidth: 1920,
      imageHeight: 1282,
    }),
  };
}

/**
 * Music Production — Round 3 Keynote (20-09-2026): "Replace entire text
 * with Pages Doc: FINAL_Sep26_Music Production". All copy below follows
 * that document verbatim; the images and bottom-only CTA structure stay.
 */
export default async function MusicProductionPage() {
  const [c, sv] = await Promise.all([
    getPageCopy("service-music-production"),
    getPageCopy("services"),
  ]);
  return (
    <article>
      {/* BreadcrumbList (§37) — mirrors the visible Services sub-nav hierarchy. */}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: sv("production.title"), path: "/services/music-production" },
        ])}
      />
      <ServicesSubnav current="/services/music-production" />
      <section className="py-24 sm:py-32">
        {/* Cohesion pass (24-09, §2–3): the hero shares the same wide
            container/left edge as every other page hero. */}
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              {sv("production.title")}
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              {sv("production.subtitle")}
            </p>
            {/* Restructure round (23-09): the approved intro carries the
                page as display type — statement first, detail later. */}
            <CopyText
              value={c("intro")}
              className="font-display mt-8 max-w-3xl text-2xl leading-snug text-ink sm:text-3xl"
            />
            {/* The red line — the document's marked statement, in the
                shared component (cohesion §23). */}
            <Callout className="mt-8">
              <CopyInline value={c("redline")} />
            </Callout>
          </Reveal>
        </Container>

        {/* First image — "1. ZAPPATIKA'S REHEARSALS 2018 (3).jpg", the file
            numbered 1 in the master Music Production folder (Aditya
            12-09-2026: "take the first image from there"). */}
        <Container wide className="mt-14">
          <Reveal variant="mask">
            <div className="relative overflow-hidden border border-line" style={{ aspectRatio: "1920/1282" }}>
              <Image
                src="/images/services/production-zappatika-rehearsals-1.jpg"
                alt="Osman Meyredi at the keys in rehearsal with a guitarist, black and white"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>

        {/* Why he is the right producer — image-first cohesion pass (24-09,
            §19–21): both paragraphs live in ONE left column with a shared
            edge, the portrait spans beside them at proper scale. No offset
            drift, no floating paragraph. Same approved words. */}
        <Container wide className="mt-20">
          <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-x-12">
            <div className="md:col-span-6">
              <Reveal variant="text">
                <CopyText value={c("body1")} className="max-w-xl leading-relaxed text-ink" />
              </Reveal>
              <Reveal variant="text" delay={90}>
                <CopyText value={c("body2")} className="mt-8 max-w-xl leading-relaxed text-ink" />
              </Reveal>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <Reveal variant="mask">
                <div className="media-zoom border border-line">
                  <Image
                    src="/images/services/production-rehearsals.jpg"
                    alt="Osman Meyredi singing at the keyboard during rehearsals"
                    width={1200}
                    height={1797}
                    sizes="(min-width: 768px) 30rem, 92vw"
                    className="h-auto w-full"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Conversion — bottom of the page only (Keynote slide 16). */}
      <section className="border-t border-line py-16">
        <Container>
          <Reveal variant="text">
            <TrackedLink
              href="/contact?type=MUSIC_PRODUCTION"
              event="service_inquiry_click"
              eventProps={{ service: "music-production", position: "footer" }}
              className="btn-pill"
              data-cursor="WORK"
            >
              {c("ctaLabel")} <span className="arrow-nudge" aria-hidden="true">→</span>
            </TrackedLink>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
