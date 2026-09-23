import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { getPageCopy } from "@/server/copy";
import { JsonLd, pageOpenGraph, personJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { CopyText, splitCopy } from "@/components/public/CopyText";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // Content-governance pass: SEO fields are Studio-editable (§23), with
  // the approved wording as default.
  const c = await getPageCopy("about");
  return {
    title: { absolute: c("seo.title") },
    description: c("seo.description"),
    alternates: { canonical: "/about" },
    openGraph: pageOpenGraph({
      title: c("seo.title"),
      description: c("seo.description"),
      path: "/about",
      image: c("image2"),
      imageAlt: c("image2Alt"),
      imageWidth: 1920,
      imageHeight: 1071,
    }),
  };
}

/**
 * About — restructure round (23-09-2026, "less text heavy"): the approved
 * biography (FINAL SEP_About.pages wording, verbatim, Studio-editable) is
 * unchanged; the page now reads as four visual chapters instead of one
 * narrow document column:
 *
 *   hero statement → 01 image-beside-text → 02 number-led narrow text →
 *   full-width image break → 03 text-beside-image → 04 closing band.
 *
 * Ghost chapter numbers reuse the site's outline-type language
 * (.service-index / .records-bgtype → .chapter-num), images interrupt the
 * reading sequence on mobile too (marker/heading → image → body), and every
 * paragraph keeps its approved words.
 */
export default async function AboutPage() {
  const [settings, c] = await Promise.all([getRepos().settings.get(), getPageCopy("about")]);
  const socialUrls = [
    settings.instagramUrl,
    settings.youtubeUrl,
    settings.tiktokUrl,
    settings.linkedinUrl,
    settings.facebookUrl,
  ].filter((u): u is string => Boolean(u));
  // Paragraph groups from the single Studio field (§38: same source fields,
  // new layout; extra editor paragraphs simply flow into the same column).
  const consParas = splitCopy(c("cons.body"));

  return (
    <article>
      <JsonLd data={personJsonLd(socialUrls)} />

      {/* Hero — wide statement, intro in a narrower offset column so the
          opening reads as a poster, not the start of a document. */}
      <section className="py-24 sm:py-32">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">About</p>
            <h1 className="font-display mt-6 max-w-4xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {c("title")}
            </h1>
          </Reveal>
          <div className="lg:grid lg:grid-cols-12">
            <Reveal variant="text" delay={110} className="lg:col-span-6 lg:col-start-6">
              <CopyText
                value={c("intro")}
                className="mt-10 max-w-xl text-lg leading-relaxed text-ink-soft"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Chapter 01 — On stage with the greats: portrait beside the story.
          Mobile order stays marker/heading → image → body, so the photo
          interrupts the reading sequence at every width. */}
      <section className="py-12 sm:py-16">
        <Container wide>
          <div className="grid gap-10 md:grid-cols-12 md:gap-x-12 md:[grid-template-rows:auto_1fr]">
            <Reveal variant="text" className="md:col-span-6 md:col-start-7">
              <p aria-hidden="true" className="chapter-num text-7xl sm:text-8xl">01</p>
              <h2 className="font-display mt-5 text-3xl sm:text-4xl">{c("greats.heading")}</h2>
            </Reveal>
            <div className="md:col-span-5 md:col-start-1 md:row-span-2 md:row-start-1">
              <Parallax speed={0.1}>
                <Reveal variant="mask">
                  <div className="media-zoom border border-line">
                    <Image
                      src={c("image1")}
                      alt={c("image1Alt")}
                      width={1115}
                      height={1600}
                      sizes="(min-width: 768px) 34rem, 88vw"
                      className="h-auto w-full"
                    />
                  </div>
                </Reveal>
              </Parallax>
            </div>
            <Reveal variant="text" delay={90} className="md:col-span-6 md:col-start-7 md:self-start md:pt-2">
              <CopyText value={c("greats.body")} className="max-w-md leading-relaxed text-ink-soft" />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Chapter 02 — Two conservatories: the oversized number carries the
          left of the composition; the two approved paragraphs sit in a
          narrow reading column with room between them. */}
      <section className="py-20 sm:py-28">
        <Container wide>
          <div className="grid gap-10 md:grid-cols-12 md:gap-x-12">
            <Reveal variant="text" className="md:col-span-4">
              <p aria-hidden="true" className="chapter-num text-8xl sm:text-[10rem]">02</p>
            </Reveal>
            <Reveal variant="text" delay={90} className="md:col-span-7 md:col-start-6">
              <h2 className="font-display text-3xl sm:text-4xl">{c("cons.heading")}</h2>
              <div className="mt-8 max-w-md space-y-8">
                {consParas.map((para, i) => (
                  <CopyText key={i} value={para} className="leading-relaxed text-ink-soft" />
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Full-width image break — chapter transition (§8/§30): all the
          instruments on one stage, between the training years and the
          childhood story. */}
      <Container wide>
        <Parallax speed={0.08}>
          <Reveal variant="media">
            <div className="media-zoom border border-line">
              <Image
                src={c("image2")}
                alt={c("image2Alt")}
                width={1920}
                height={1071}
                sizes="(min-width: 1024px) 72rem, 96vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </Parallax>
      </Container>

      {/* Chapter 03 — Where it started: the childhood upright-piano photo
          (approved, home gallery) beside the origin story, mirrored side. */}
      <section className="py-20 sm:py-28">
        <Container wide>
          <div className="grid gap-10 md:grid-cols-12 md:gap-x-12 md:[grid-template-rows:auto_1fr]">
            <Reveal variant="text" className="md:col-span-6">
              <p aria-hidden="true" className="chapter-num text-7xl sm:text-8xl">03</p>
              <h2 className="font-display mt-5 text-3xl sm:text-4xl">{c("started.heading")}</h2>
            </Reveal>
            <div className="md:col-span-4 md:col-start-9 md:row-span-2 md:row-start-1">
              <Parallax speed={0.12}>
                <Reveal variant="mask">
                  <div className="media-zoom border border-line">
                    <Image
                      src={c("image3")}
                      alt={c("image3Alt")}
                      width={1045}
                      height={1400}
                      sizes="(min-width: 768px) 26rem, 88vw"
                      className="h-auto w-full"
                    />
                  </div>
                </Reveal>
              </Parallax>
            </div>
            <Reveal variant="text" delay={90} className="md:col-span-6 md:self-start md:pt-2">
              <CopyText value={c("started.body")} className="max-w-md leading-relaxed text-ink-soft" />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Chapter 04 — Languages & availability: quiet closing band with the
          two routes onward; the memorial line keeps its restrained place at
          the foot of the page. */}
      <section className="border-t border-line bg-stage py-20 sm:py-24">
        <Container>
          <Reveal variant="text">
            <p aria-hidden="true" className="chapter-num text-7xl">04</p>
            <h2 className="font-display mt-5 text-3xl sm:text-4xl">{c("langs.heading")}</h2>
            <CopyText value={c("langs.body")} className="mt-6 max-w-xl leading-relaxed text-ink-soft" />
            <div className="mt-10 flex flex-wrap gap-6">
              <Link href="/shows/concerts" className="btn-pill">
                Upcoming concerts <span className="arrow-nudge ml-1" aria-hidden="true">→</span>
              </Link>
              <Link href="/contact" className="btn-pill">
                Get in touch
              </Link>
            </div>
          </Reveal>
          {/* Restrained memorial line — catch-up brief item 2: subtle and
              respectful, no CTA, at the bottom of the About content. */}
          <Reveal variant="text" delay={120}>
            <p className="tabular mt-20 border-t border-line pt-6 text-sm tracking-[0.08em] text-ink-faint">
              {c("memorial")}
            </p>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
