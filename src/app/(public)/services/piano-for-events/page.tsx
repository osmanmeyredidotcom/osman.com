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
 * Live Piano — restructure round (23-09-2026): same approved copy
 * ("FINAL_Sep26_Live Piano" wording, Studio-editable), re-paced: split hero
 * with the grand-piano portrait beside the intro, the three-paragraph body
 * broken across a narrow lead, an image-beside-text moment (Rome 2025,
 * approved earlier rounds) and — when the final paragraph is short — a
 * display pull-line, then the listen band. No words changed.
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
  const middle = bodyParas.slice(1, last ? -1 : undefined);
  // A long final paragraph reads as copy, not a statement — only pull it
  // out as display type when it is genuinely a short line.
  const pullLine = last && last.length <= 160 ? last : null;
  const middleParas = pullLine ? middle : bodyParas.slice(1);

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

      {/* Split hero — portrait beside the approved intro. */}
      <section className="py-20 sm:py-28">
        <Container wide>
          <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-x-12">
            <Reveal variant="text" className="md:col-span-6">
              <p className="eyebrow">Services</p>
              <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
                {sv("piano.title")}
              </h1>
              <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
                {c("strip")}
              </p>
              <CopyText
                value={c("intro")}
                className="mt-8 max-w-xl text-xl leading-relaxed text-ink-soft"
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
            <div className="md:col-span-5 md:col-start-8">
              <Parallax speed={0.1}>
                <Reveal variant="mask">
                  <div className="media-zoom border border-line">
                    <Image
                      src={c("image")}
                      alt={c("imageAlt")}
                      width={1195}
                      height={1600}
                      sizes="(min-width: 768px) 30rem, 88vw"
                      className="h-auto w-full"
                      priority
                    />
                  </div>
                </Reveal>
              </Parallax>
            </div>
          </div>
        </Container>
      </section>

      {/* How he plays a room — lead paragraph as a narrow reading column. */}
      <section className="border-t border-line py-20 sm:py-24">
        <Container wide>
          <div className="grid gap-10 md:grid-cols-12 md:gap-x-12">
            <Reveal variant="text" className="md:col-span-7 md:col-start-6">
              <CopyText value={lead} className="max-w-xl text-lg leading-relaxed text-ink" />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Image-beside-text — the Rome 2025 performance photo interrupts the
          reading sequence before the set-up detail (§8/§29). */}
      <section className="pb-20 sm:pb-24">
        <Container wide>
          <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-x-12">
            <Reveal variant="media" className="md:col-span-7">
              <div className="media-zoom border border-line">
                <Image
                  src={c("image2")}
                  alt={c("image2Alt")}
                  width={1920}
                  height={1081}
                  sizes="(min-width: 768px) 44rem, 96vw"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
            <Reveal variant="text" delay={90} className="md:col-span-4 md:col-start-9">
              {middleParas.map((para, i) => (
                <CopyText
                  key={i}
                  value={para}
                  className={i === 0 ? "leading-relaxed text-ink-soft" : "mt-6 leading-relaxed text-ink-soft"}
                />
              ))}
            </Reveal>
          </div>
          {pullLine && (
            <Reveal variant="text" delay={120}>
              <p className="font-display mt-16 max-w-2xl text-2xl leading-snug text-ink sm:text-3xl">
                {pullLine}
              </p>
            </Reveal>
          )}
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
