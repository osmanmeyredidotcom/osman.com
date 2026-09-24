import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPageCopy } from "@/server/copy";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { CopyInline, CopyText, splitCopy } from "@/components/public/CopyText";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";
import { breadcrumbJsonLd, JsonLd, pageOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageCopy("service-live-piano");
  return {
    title: { absolute: c("seo.title") },
    description: c("seo.description"),
    alternates: { canonical: "/services/piano-for-events" },
    openGraph: pageOpenGraph({
      title: c("seo.title"),
      description: c("seo.description"),
      path: "/services/piano-for-events",
      image: c("image"),
      imageAlt: c("imageAlt"),
      imageWidth: 1195,
      imageHeight: 1600,
    }),
  };
}

/**
 * Live Piano — image-first cohesion pass (24-09-2026, §15–18): the
 * performance photography leads. Structure follows the brief's recommended
 * shape: title/intro → LARGE performance image → two aligned copy blocks →
 * larger secondary image beside the short statement → listen band → CTA.
 * No orphan paragraphs, no offset drift; same approved copy
 * ("FINAL_Sep26_Live Piano", Studio-editable) with zero wording changes.
 */
export default async function PianoForEventsPage() {
  const [c, sv] = await Promise.all([
    getPageCopy("service-live-piano"),
    getPageCopy("services"),
  ]);
  // Paragraph groups from the single Studio "body" field (§38) — the layout
  // adapts to however many paragraphs an editor keeps in it.
  const bodyParas = splitCopy(c("body"));
  const lead = bodyParas[0] ?? "";
  const last = bodyParas.length >= 3 ? bodyParas[bodyParas.length - 1] : null;
  // A long final paragraph reads as copy, not a statement — only pull it
  // out as display type when it is genuinely a short line.
  const pullLine = last && last.length <= 160 ? last : null;
  const middleParas = pullLine ? bodyParas.slice(1, -1) : bodyParas.slice(1);

  return (
    <article>
      {/* BreadcrumbList (§37) — mirrors the visible Services sub-nav hierarchy. */}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: sv("piano.title"), path: "/services/piano-for-events" },
        ])}
      />
      <ServicesSubnav current="/services/piano-for-events" />

      {/* Opening — one left-aligned composition: eyebrow, H1, categories,
          intro, CTA all on the page's shared left edge. */}
      <section className="pt-20 pb-14 sm:pt-28 sm:pb-16">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              {sv("piano.title")}
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              {c("strip")}
            </p>
            <CopyText
              value={c("intro")}
              className="mt-8 max-w-2xl text-xl leading-relaxed text-ink-soft"
            />
            <p className="mt-9">
              <TrackedLink
                href="/contact?type=LIVE_PIANO"
                event="service_inquiry_click"
                eventProps={{ service: "piano-for-events", position: "hero" }}
                className="btn-pill"
                data-cursor="BOOK"
              >
                {c("ctaLabel")} <span className="arrow-nudge" aria-hidden="true">→</span>
              </TrackedLink>
            </p>
          </Reveal>
        </Container>
      </section>

      {/* LARGE performance image — the page's visual anchor (§16). */}
      <Container wide>
        <Parallax speed={0.08}>
          <Reveal variant="media">
            <div className="media-zoom border border-line">
              <Image
                src={c("image2")}
                alt={c("image2Alt")}
                width={1920}
                height={1081}
                sizes="(min-width: 1024px) 72rem, 96vw"
                className="h-auto w-full"
                priority
              />
            </div>
          </Reveal>
        </Parallax>
      </Container>

      {/* Two aligned copy blocks — equal columns on one grid (§17/§18):
          the lead paragraph and the set-up detail share the same top
          baseline and reading width. Extra editor paragraphs flow into the
          second column. */}
      <section className="py-16 sm:py-20">
        <Container wide>
          <div className="grid gap-10 md:grid-cols-2 md:gap-x-12">
            <Reveal variant="text">
              <CopyText value={lead} className="max-w-xl text-lg leading-relaxed text-ink" />
            </Reveal>
            {middleParas.length > 0 && (
              <Reveal variant="text" delay={90}>
                {middleParas.map((para, i) => (
                  <CopyText
                    key={i}
                    value={para}
                    className={
                      i === 0
                        ? "max-w-xl leading-relaxed text-ink-soft"
                        : "mt-6 max-w-xl leading-relaxed text-ink-soft"
                    }
                  />
                ))}
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {/* Secondary image — the grand-piano portrait at proper scale beside
          the short approved statement; the pull-line is anchored to the
          image, never floating (§17). */}
      <section className="pb-20 sm:pb-24">
        <Container wide>
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-x-12">
            <div className="md:col-span-6">
              <Parallax speed={0.1}>
                <Reveal variant="mask">
                  <div className="media-zoom border border-line">
                    <Image
                      src={c("image")}
                      alt={c("imageAlt")}
                      width={1195}
                      height={1600}
                      sizes="(min-width: 768px) 38rem, 92vw"
                      className="h-auto w-full"
                    />
                  </div>
                </Reveal>
              </Parallax>
            </div>
            {pullLine && (
              <Reveal variant="text" delay={90} className="md:col-span-5 md:col-start-8">
                <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
                  {pullLine}
                </p>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {/* Closing listen prompt — the document marks the live-videos link here. */}
      <section className="border-t border-line bg-stage py-20">
        <Container>
          <Reveal variant="text">
            <p className="font-display text-2xl leading-snug sm:text-3xl">{c("listenHeading")}</p>
            <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
              <CopyInline value={c("listenBody")} />
            </p>
            <p className="mt-7">
              <Link href="/shows/live-videos" className="btn-pill" data-cursor="WATCH">
                {c("listenCtaLabel")} <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <Reveal variant="text">
            <TrackedLink
              href="/contact?type=LIVE_PIANO"
              event="service_inquiry_click"
              eventProps={{ service: "piano-for-events", position: "footer" }}
              className="btn-pill"
              data-cursor="BOOK"
            >
              {c("ctaLabel")} <span className="arrow-nudge" aria-hidden="true">→</span>
            </TrackedLink>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
