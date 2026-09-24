import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPageCopy } from "@/server/copy";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CopyInline, CopyText, splitCopy } from "@/components/public/CopyText";
import { ReadMore } from "@/components/public/ReadMore";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";
import { breadcrumbJsonLd, JsonLd, pageOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageCopy("service-concerts");
  return {
    title: { absolute: c("seo.title") },
    description: c("seo.description"),
    alternates: { canonical: "/services/concerts" },
    openGraph: pageOpenGraph({
      title: c("seo.title"),
      description: c("seo.description"),
      path: "/services/concerts",
      image: c("image"),
      imageAlt: c("imageAlt"),
      imageWidth: 2400,
      imageHeight: 1350,
    }),
  };
}

/**
 * Concerts — restructure round (23-09-2026): same approved copy ("Final
 * Sep_concerts" wording, Studio-editable), rebuilt so proof arrives first:
 * split hero with the live photo beside the approved booking statement,
 * then "The Show" as a narrow reading chapter, the three booking options
 * with more air, and the audience question as the closing statement. No
 * words changed; the pending colour-photo note stays visible.
 */
export default async function ConcertsServicePage() {
  const [c, sv] = await Promise.all([
    getPageCopy("service-concerts"),
    getPageCopy("services"),
  ]);
  const options = [1, 2, 3].map((n) => ({
    title: c(`opt${n}.title`),
    body: c(`opt${n}.body`),
  }));
  // "The Show" paragraphs from the single Studio field (§38).
  const bodyParas = splitCopy(c("body"));

  return (
    <article>
      {/* BreadcrumbList (§37) — mirrors the visible Services sub-nav hierarchy. */}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: sv("concerts.title"), path: "/services/concerts" },
        ])}
      />
      <ServicesSubnav current="/services/concerts" />

      {/* Split hero — the approved live shot is on screen immediately, with
          the approved one-line booking statement (same Studio field the
          services overview uses) instead of a paragraph wall. */}
      <section className="py-20 sm:py-28">
        <Container wide>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-12">
            <Reveal variant="text" className="lg:col-span-5">
              <p className="eyebrow">Services</p>
              <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
                {sv("concerts.title")}
              </h1>
              <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
                {sv("concerts.subtitle")}
              </p>
              <p className="font-display mt-10 max-w-md text-2xl leading-snug text-ink">
                {sv("concerts.intro")}
              </p>
              <p className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <TrackedLink
                  href="/contact?type=CONCERTS_LIVE"
                  event="service_inquiry_click"
                  eventProps={{ service: "concerts", position: "hero" }}
                  className="btn-pill"
                  data-cursor="BOOK"
                >
                  {c("ctaLabel")} <span className="arrow-nudge" aria-hidden="true">→</span>
                </TrackedLink>
                <Link
                  href="/shows/live-videos"
                  className="u-link text-sm text-ink-soft hover:text-accent-strong"
                >
                  Watch the live videos
                </Link>
              </p>
            </Reveal>
            <div className="lg:col-span-7">
              {/* The supplied landscape image. The "Waiting for Varsha"
                  pending note is removed (24-09 brief) — no replacement
                  label. */}
              <Reveal variant="mask">
                <div
                  className="relative overflow-hidden border border-line"
                  style={{ aspectRatio: "2400/1350" }}
                >
                  <Image
                    src={c("image")}
                    alt={c("imageAlt")}
                    fill
                    sizes="(min-width: 1024px) 56rem, 96vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* The Show — the approved narrative in a narrow reading column,
          heading carried wide, tickets note kept as the accent callout. */}
      <section className="border-t border-line py-20 sm:py-24">
        <Container wide>
          <div className="grid gap-10 md:grid-cols-12 md:gap-x-12">
            <Reveal variant="text" className="md:col-span-4">
              <h2 className="font-display text-3xl sm:text-4xl">{c("showHeading")}</h2>
            </Reveal>
            <Reveal variant="text" delay={90} className="md:col-span-7 md:col-start-6">
              <CopyText
                value={bodyParas[0] ?? ""}
                className="max-w-xl text-lg leading-relaxed text-ink-soft"
              />
              {/* Source feedback item 5: Read More where the text runs long
                  — the arc of the show reads first, the genre detail sits
                  one tap away (still in the DOM). */}
              {bodyParas.length > 1 && (
                <ReadMore className="mt-7">
                  <div className="max-w-xl space-y-6">
                    {bodyParas.slice(1).map((para, i) => (
                      <CopyText key={i} value={para} className="leading-relaxed text-ink-soft" />
                    ))}
                  </div>
                </ReadMore>
              )}
              {/* Kept element (slide: "Keep") — the tickets note. */}
              <p className="mt-8 max-w-xl border-l-2 border-accent pl-4 text-sm text-ink-soft">
                <CopyInline value={c("ticketsNote")} />
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Three ways to book a show — Final Sep_concerts option copy, given
          more air and a tighter reading measure. */}
      <section className="border-t border-line py-20">
        <Container>
          <Reveal variant="text">
            <h2 className="eyebrow">{c("optionsHeading")}</h2>
          </Reveal>
          {/* Horizontal moment (§4): the three options sit side by side on
              desktop — three short columns instead of one long text run. */}
          <div className="mt-10 grid gap-y-10 border-t border-line pt-10 md:grid-cols-3 md:gap-x-10">
            {options.map((option, i) => (
              <Reveal key={option.title} variant="card" delay={i * 90}>
                <span className="service-index text-4xl sm:text-5xl" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="font-display mt-4 text-xl tracking-wide uppercase">{option.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-ink-soft">{option.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Statement break — final line carries the emphasis (in the doc). */}
      <section className="py-20 sm:py-24">
        <Container>
          <Reveal variant="text">
            <CopyText
              value={c("statementLead")}
              className="font-display text-2xl leading-snug text-ink-soft sm:text-3xl"
            />
            <p className="display-caps mt-6 max-w-3xl text-3xl leading-tight text-accent-strong sm:text-5xl">
              {c("statementEmphasis")}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <Reveal variant="text">
            <TrackedLink
              href="/contact?type=CONCERTS_LIVE"
              event="service_inquiry_click"
              eventProps={{ service: "concerts", position: "footer" }}
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
