import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";
import { breadcrumbJsonLd, JsonLd, pageOpenGraph } from "@/lib/seo";

// §23 title direction — the production search intent page (§25).
const PAGE_TITLE = "Music Producer & Multi-Instrumentalist in the Netherlands | Osman Meyredi";
const PAGE_DESCRIPTION =
  "Osman Meyredi is an artist-producer who works with artists to develop, shape and finish their music, stepping in at the point where you need him.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/services/music-production" },
  openGraph: pageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/services/music-production",
    image: "/images/services/production-zappatika-rehearsals-1.jpg",
    imageAlt: "Osman Meyredi at the keys in rehearsal with a guitarist, black and white",
    imageWidth: 1920,
    imageHeight: 1282,
  }),
};

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Music Production", path: "/services/music-production" },
];

/**
 * Music Production — Round 3 Keynote (20-09-2026): "Replace entire text
 * with Pages Doc: FINAL_Sep26_Music Production". All copy below follows
 * that document verbatim; the images and bottom-only CTA structure stay.
 */
export default function MusicProductionPage() {
  return (
    <article>
      {/* BreadcrumbList (§37) — mirrors the visible Services sub-nav hierarchy. */}
      <JsonLd data={breadcrumbJsonLd(BREADCRUMBS)} />
      <ServicesSubnav current="/services/music-production" />
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              Music Production
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              Production · Arrangement · Instrumentation · Recording · Mixing · Mastering
            </p>
            <p className="mt-6 text-xl leading-relaxed text-ink-soft">
              Osman Meyredi is an artist-producer who works with artists to develop, shape and
              finish their music.
            </p>
            {/* The red line — the document's marked statement. */}
            <p className="mt-6 border-l-2 border-accent pl-4 leading-relaxed text-ink-soft">
              Whether you have a rough idea, a demo that isn&rsquo;t quite there yet, or a
              nearly finished song that needs the final production, mixing or mastering, he can
              step in at the point where you need him.
            </p>
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

        {/* Why he is the right producer — final content, before any CTA. */}
        <Container className="mt-14">
          <Reveal variant="text" delay={100}>
            <p className="leading-relaxed text-ink">
              Playing bass taught Osman what the drummer needs. Playing drums taught him what
              the bass should leave out. Enough time at the piano and you start hearing exactly
              how much space a singer actually has, which matters, because he sings too. That
              instinct is backed by formal training too, a degree in Music Production from
              Master The Mix Academy, covering everything from arrangement to studio
              engineering.
            </p>
          </Reveal>
        </Container>

        {/* Second image — engagement break between the two paragraphs. */}
        <Container className="mt-12">
          <Reveal variant="mask">
            <div className="mx-auto max-w-md">
              <div className="media-zoom border border-line">
                <Image
                  src="/images/services/production-rehearsals.jpg"
                  alt="Osman Meyredi singing at the keyboard during rehearsals"
                  width={1200}
                  height={1797}
                  sizes="(min-width: 640px) 28rem, 88vw"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
        </Container>

        <Container className="mt-12">
          <Reveal variant="text" delay={100}>
            <p className="leading-relaxed text-ink">
              He&rsquo;s just as at home on both sides of production: programming and arranging
              on a laptop, and riding the console when it&rsquo;s time to capture a live take.
              That&rsquo;s what lets him hear what a track is missing, shape the musical
              direction, and, when needed, play and record the instruments himself. It&rsquo;s
              also why artists like working with him. He&rsquo;s not just telling a singer or a
              guitarist what to do, he&rsquo;s usually sat in that chair himself, and he writes
              and produces parts musicians actually want to play.
            </p>
          </Reveal>
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
              Work with Osman <span className="arrow-nudge" aria-hidden="true">→</span>
            </TrackedLink>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
