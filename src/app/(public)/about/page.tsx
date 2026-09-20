import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { getPageCopy } from "@/server/copy";
import { JsonLd, pageOpenGraph, personJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { CopyText } from "@/components/public/CopyText";
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
 * About — Round 3 Keynote (20-09-2026): all copy follows FINAL
 * SEP_About.pages verbatim, portrait double bass first, landscape second.
 * Content-governance pass: every heading, paragraph and photo now reads
 * from the Studio "Pages → About" editor, with that approved wording as
 * the built-in default (§52 — fallbacks fill gaps, never overwrite edits).
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

  return (
    <article>
      <JsonLd data={personJsonLd(socialUrls)} />
      <section className="py-24 sm:py-32">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">About</p>
            <h1 className="font-display mt-6 max-w-4xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {c("title")}
            </h1>
            <CopyText
              value={c("intro")}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft"
            />
          </Reveal>
        </Container>
      </section>

      <Container wide>
        <Parallax speed={0.1}>
          <Reveal variant="mask" className="mx-auto max-w-md">
            {/* First image — "[black&white image, portrait, double bass]". */}
            <div className="media-zoom border border-line">
              <Image
                src={c("image1")}
                alt={c("image1Alt")}
                width={1115}
                height={1600}
                sizes="(min-width: 640px) 28rem, 88vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </Parallax>
      </Container>

      {/* On stage with the greats */}
      <section className="py-24">
        <Container>
          <Reveal variant="text">
            <h2 className="font-display text-3xl">{c("greats.heading")}</h2>
            <CopyText value={c("greats.body")} className="mt-6 leading-relaxed" />
          </Reveal>
        </Container>
      </section>

      {/* Two conservatories */}
      <section className="border-t border-line py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">{c("cons.heading")}</h2>
            <CopyText value={c("cons.body")} className="mt-6 leading-relaxed" />
          </Reveal>
        </Container>
      </section>

      <Container wide>
        {/* Second image — "[Landscape black & white image with all
            instruments, see about folder]". */}
        <Reveal variant="mask">
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
      </Container>

      {/* Where it started */}
      <section className="py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">{c("started.heading")}</h2>
            <CopyText value={c("started.body")} className="mt-6 leading-relaxed" />
          </Reveal>
        </Container>
      </section>

      {/* Languages & availability */}
      <section className="border-t border-line py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">{c("langs.heading")}</h2>
            <CopyText value={c("langs.body")} className="mt-6 leading-relaxed" />
            <div className="mt-10 flex flex-wrap gap-6">
              <Link href="/shows/concerts" className="btn-pill">
                Upcoming concerts <span className="arrow-nudge ml-1" aria-hidden="true">→</span>
              </Link>
              <Link href="/contact" className="btn-pill">
                Get in touch
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
