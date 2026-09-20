import type { Metadata } from "next";
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
 * Concerts — Round 3 Keynote: all copy follows "Final Sep_concerts"
 * verbatim, and the content-governance pass makes every block Studio-
 * editable (Pages → Concerts page) with that wording as the default.
 * The tickets note is the kept element; its link goes to /shows.
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
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
              {sv("concerts.title")}
            </h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              {sv("concerts.subtitle")}
            </p>
            <h2 className="font-display mt-10 text-2xl">{c("showHeading")}</h2>
            <CopyText
              value={c("body")}
              firstClassName="mt-4 text-lg leading-relaxed text-ink-soft"
              className="mt-6 leading-relaxed text-ink-soft"
            />
            {/* Kept element (slide: "Keep") — the tickets note. */}
            <p className="mt-6 border-l-2 border-accent pl-4 text-sm text-ink-soft">
              <CopyInline value={c("ticketsNote")} />
            </p>
            <p className="mt-9">
              <TrackedLink
                href="/contact?type=CONCERTS_LIVE"
                event="service_inquiry_click"
                eventProps={{ service: "concerts", position: "hero" }}
                className="btn-pill"
                data-cursor="BOOK"
              >
                {c("ctaLabel")} <span className="arrow-nudge" aria-hidden="true">→</span>
              </TrackedLink>
            </p>
          </Reveal>
        </Container>

        {/* The supplied landscape image (colour version still with Varsha —
            visible pending note by client request). */}
        <Container wide className="mt-14">
          <Reveal variant="mask">
            <div className="relative overflow-hidden border border-line" style={{ aspectRatio: "2400/1350" }}>
              <Image
                src={c("image")}
                alt={c("imageAlt")}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <p className="mt-3">
            <span className="pending-note">Waiting for Varsha: colour version to follow</span>
          </p>
        </Container>

        {/* Three ways to book a show — Final Sep_concerts option copy. */}
        <Container className="mt-20">
          <Reveal variant="text">
            <h2 className="eyebrow">{c("optionsHeading")}</h2>
          </Reveal>
          <div className="mt-8">
            {options.map((option, i) => (
              <Reveal
                key={option.title}
                variant="card"
                delay={i * 90}
                className="grid gap-3 border-t border-line py-8 last:border-b sm:grid-cols-[4rem_1fr] sm:gap-8"
              >
                <span className="service-index text-4xl sm:text-5xl" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl tracking-wide uppercase">{option.title}</h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">{option.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>

        {/* Statement break — final line carries the emphasis (in the doc). */}
        <Container className="mt-20">
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
