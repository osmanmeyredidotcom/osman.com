import type { Metadata } from "next";
import Image from "next/image";
import { getPageCopy } from "@/server/copy";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CopyText, splitCopy } from "@/components/public/CopyText";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ReservedSlot } from "@/components/public/ReservedSlot";
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
 * November feedback 2 (item 1): the banner now opens the page, right under
 * the title band — title → banner → intro and booking pill → copy blocks.
 */
export default async function PianoForEventsPage() {
  const [c, sv] = await Promise.all([
    getPageCopy("service-live-piano"),
    getPageCopy("services"),
  ]);
  // Paragraph groups from the single Studio "body" field (§38) — the layout
  // adapts to however many paragraphs an editor keeps in it. 12-10 feedback
  // (AV-14): the vocalist note reads as a casual sentence in the copy
  // column, never as display type.
  const bodyParas = splitCopy(c("body"));
  const lead = bodyParas[0] ?? "";
  const restParas = bodyParas.slice(1);

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

      {/* Opening — November feedback 2 (item 1): the piano photograph is
          the page's top banner, as on Bio and All Services: a quiet title
          band (eyebrow, H1, categories), then the banner, then the
          description and the booking pill. Same approved wording, same
          link and tracking. */}
      <section className="pt-20 pb-10 sm:pt-28 sm:pb-12">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              {sv("piano.title")}
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              {c("strip")}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* The banner — edge to edge with no surrounding padding (12-10,
          P11-X254 "Banner images to be use full screen. no padding.").
          From tablet up it takes the 2880 × 1350 banner proportion used on
          Bio and All Services; phones get a taller 3:2 crop so Osman stays
          prominent. The crop is anchored at the top of the photograph so
          his whole head stays in frame at every width. */}
      <Reveal variant="media">
        <div className="relative w-full overflow-hidden bg-stage">
          <div className="relative aspect-[3/2] sm:aspect-[2880/1350]">
            <Image
              src={c("image")}
              alt={c("imageAlt")}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </Reveal>

      <section className="pt-14 sm:pt-16">
        <Container wide>
          <Reveal variant="text">
            <CopyText
              value={c("intro")}
              className="max-w-2xl text-xl leading-relaxed text-ink-soft"
            />
            <p className="mt-9">
              <TrackedLink
                href="/contact?type=LIVE_PIANO"
                event="service_inquiry_click"
                eventProps={{ service: "piano-for-events", position: "hero" }}
                className="btn-pill"
                data-cursor="BOOK"
              >
                {c("ctaLabel")}
              </TrackedLink>
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Copy — two aligned columns on desktop, one column on mobile
          (AV-13: text stacks to a single column on small screens). The
          vocalist note flows here as an ordinary sentence. */}
      <section className="py-16 sm:py-20">
        <Container wide>
          <div className="grid gap-10 md:grid-cols-2 md:gap-x-12">
            <Reveal variant="text">
              <CopyText value={lead} className="max-w-xl text-lg leading-relaxed text-ink" />
            </Reveal>
            {restParas.length > 0 && (
              <Reveal variant="text" delay={90}>
                {restParas.map((para, i) => (
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

      {/* Closing listen area — 12-10 feedback (AV-14/P12-X257): the reserved
          slot for the pending piano video (Jolene) carries the exact
          "Coming soon" label, and one booking pill closes the page — the
          duplicate CTAs are gone. */}
      <section className="border-t border-line bg-stage py-20">
        <Container>
          <Reveal variant="text">
            <p className="font-display text-2xl leading-snug sm:text-3xl">{c("listenHeading")}</p>
            <div className="mt-8 max-w-2xl">
              <ReservedSlot />
            </div>
            <p className="mt-9">
              <TrackedLink
                href="/contact?type=LIVE_PIANO"
                event="service_inquiry_click"
                eventProps={{ service: "piano-for-events", position: "closing" }}
                className="btn-pill"
                data-cursor="BOOK"
              >
                {/* 22-10 round 2 (R2-2): the closing pill carries the shared
                    bottom-CTA wording; the hero pill keeps its own label. */}
                {c("ctaLabelClosing")}
              </TrackedLink>
            </p>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
