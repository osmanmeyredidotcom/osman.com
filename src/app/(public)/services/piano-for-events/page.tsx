import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPageCopy } from "@/server/copy";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CopyInline, CopyText } from "@/components/public/CopyText";
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
 * Live Piano — Round 3 Keynote: copy follows "FINAL_Sep26_Live Piano"
 * verbatim; the content-governance pass makes every block Studio-editable
 * (Pages → Live Piano page) with that wording as the default.
 */
export default async function PianoForEventsPage() {
  const [c, sv] = await Promise.all([
    getPageCopy("service-live-piano"),
    getPageCopy("services"),
  ]);
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
      <section className="py-24 sm:py-32">
        <Container>
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
              className="mt-6 text-xl leading-relaxed text-ink-soft"
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

        {/* The image supplied after the call — portrait, centred column. */}
        <Container className="mt-14">
          <Reveal variant="mask">
            <div className="mx-auto max-w-md">
              <div className="media-zoom border border-line">
                <Image
                  src={c("image")}
                  alt={c("imageAlt")}
                  width={1195}
                  height={1600}
                  sizes="(min-width: 640px) 28rem, 88vw"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
        </Container>

        <Container className="mt-14">
          <Reveal variant="text" delay={100}>
            <CopyText value={c("body")} className="mt-6 leading-relaxed text-ink" firstClassName="leading-relaxed text-ink" />
          </Reveal>
        </Container>

        {/* Closing listen prompt — the document marks the live-videos link here. */}
        <Container className="mt-16">
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
