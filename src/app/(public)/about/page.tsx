import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { getPageCopy } from "@/server/copy";
import { JsonLd, pageOpenGraph, personJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { CopyText, splitCopy } from "@/components/public/CopyText";
import { ReadMore } from "@/components/public/ReadMore";
import { ReservedSlot } from "@/components/public/ReservedSlot";
import { Reveal } from "@/components/motion/Reveal";

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
      image: c("banner.image"),
      imageAlt: c("banner.imageAlt"),
    }),
  };
}

/** The nine chapter slots; 1–3 open the page, 4–9 sit under Read more. */
const VISIBLE_CHAPTERS = ["ch1", "ch2", "ch3"] as const;
const DISCLOSED_CHAPTERS = ["ch4", "ch5", "ch6", "ch7", "ch8", "ch9"] as const;

function Chapter({
  heading,
  body,
  headingId,
}: {
  heading: string;
  body: string;
  headingId: string;
}) {
  const paras = splitCopy(body);
  if (!heading && paras.length === 0) return null;
  return (
    <section aria-labelledby={headingId} className="mt-14 first:mt-0 sm:mt-16">
      <h2 id={headingId} className="font-display text-3xl sm:text-4xl">
        {heading}
      </h2>
      <div className="mt-6 space-y-6">
        {paras.map((para, i) => (
          <CopyText key={i} value={para} className="leading-relaxed text-ink-soft" />
        ))}
      </div>
    </section>
  );
}

/**
 * Bio — 12-10 feedback round, option A as selected by the client (P55-X329)
 * and confirmed by VP: full-width banner, the agency introduction, then one
 * continuously flowing single-column story with Jolene's own headings (her
 * 9 Oct copy, verbatim — final approval and the D-07 release-date question
 * stay with her). The first three chapters are open; the remaining chapters
 * sit under a restrained "Read more" with the +/− indicator (P36-X326, the
 * label per the latest reply), fully present in the DOM. The booking CTA
 * closes the page under the shared pill rules. Approved imagery holds the
 * banner until the photoshoot replacements arrive — the layout won't change.
 * Options B and C (PDF pp. 43–54) are unselected evidence, deliberately not
 * blended in.
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

      {/* Opening — quiet title band, then the full-width banner. */}
      <section>
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow pt-14 sm:pt-16">Bio</p>
            <h1 className="font-display mt-4 pb-10 text-4xl leading-tight sm:pb-12 sm:text-5xl">
              Bio
            </h1>
          </Reveal>
        </Container>
        {/* 22-10 correction (item 5): the reviewed banner photo is too soft
            at this size, so the full-width slot carries the requested
            placeholder — exact wording "high res photo required" — until the
            client supplies the high-resolution photograph. The stored
            banner.image/banner.imageAlt copy fields stay untouched for that
            moment; no upscale, no generated or substituted photo. */}
        <Reveal variant="media">
          <Container wide>
            <ReservedSlot label="high res photo required" ratio="2880 / 1350" />
          </Container>
        </Reveal>
      </section>

      {/* Agency introduction — the bold opening statement in the story
          column. */}
      <section className="py-16 sm:py-20">
        <Container wide>
          <div className="mx-auto max-w-2xl">
            <Reveal variant="text">
              <CopyText
                value={c("intro")}
                className="font-display text-2xl leading-snug text-ink sm:text-3xl"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* The story — one continuous single column with Jolene's headings.
          Chapters 1–3 are open; 4–9 are one tap away and fully in the DOM. */}
      <section className="border-t border-line py-16 sm:py-20">
        <Container wide>
          <div className="mx-auto max-w-2xl">
            {VISIBLE_CHAPTERS.map((ch) => (
              <Chapter
                key={ch}
                headingId={`bio-${ch}`}
                heading={c(`${ch}.heading`)}
                body={c(`${ch}.body`)}
              />
            ))}

            <ReadMore className="mt-12">
              <div>
                {DISCLOSED_CHAPTERS.map((ch) => (
                  <Chapter
                    key={ch}
                    headingId={`bio-${ch}`}
                    heading={c(`${ch}.heading`)}
                    body={c(`${ch}.body`)}
                  />
                ))}
              </div>
            </ReadMore>

            {/* Booking CTA, integrated at the end of the story (BIO-03).
                22-10 round 2 (R2-2): directly below the chapters on the same
                left edge — no isolating divider, and the shared bottom-CTA
                wording "Get In Touch". */}
            <Reveal variant="text">
              <p className="mt-12">
                <Link href="/contact" className="btn-pill" data-cursor="BOOK">
                  {c("ctaLabel")}
                </Link>
              </p>
            </Reveal>
          </div>
        </Container>
      </section>
    </article>
  );
}
