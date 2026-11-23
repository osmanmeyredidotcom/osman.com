import type { Metadata } from "next";
import Link from "next/link";
import { getPageCopy } from "@/server/copy";
import { Reveal } from "@/components/motion/Reveal";
import { CopyInline, CopyText } from "@/components/public/CopyText";
import { Callout } from "@/components/public/Callout";
import { TrackedLink } from "@/components/public/TrackedLink";
import { BookingOptions } from "@/components/public/BookingOptions";
import { PageBanner } from "@/components/public/PageBanner";
import {
  BioSection,
  BodyCopy,
  ChapterHeading,
  LeadCopy,
  TemplateCta,
  TitleBand,
} from "@/components/public/BioTemplate";
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
 * Concerts — 4-11 feedback (N04-17: "this needs to be redesigned
 * completely", "Redesign as discussed", the 12-10 call): the Bio template.
 * Title band, the live photograph as the full-width banner, then one reading
 * column with Bio's measurements: the booking statement, The Show (both
 * paragraphs in full since 22-11; the second used to sit under Read more),
 * the tickets note (the June’s Night pointer left on 19-11), the three ways to book a show stacked in the column, and
 * the closing statement with the one booking pill. Every word is the same
 * Studio copy. The three options are set as the rows of the Services
 * overview (VP, 16-11), see BookingOptions.
 * The closing emphasis is no longer set in capitals (sentence case,
 * N04-04), and nothing hangs off the column (N04-21, "Don't leave the text
 * hanging").
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

      <section>
        <TitleBand
          eyebrow="Services"
          title={sv("concerts.title")}
          tags={sv("concerts.subtitle")}
        />
        <PageBanner src={c("image")} alt={c("imageAlt")} />
      </section>

      {/* The approved booking statement (the services overview's teaser)
          as the lead, and the way to the videos. */}
      <BioSection>
        <LeadCopy value={sv("concerts.intro")} />
        <Reveal variant="text">
          <p className="mt-8">
            <Link
              href="/shows/live-videos"
              data-cursor="WATCH"
              className="u-link text-sm text-ink-soft hover:text-accent-strong"
            >
              Watch the live videos
            </Link>
          </p>
        </Reveal>
      </BioSection>

      {/* The Show: every paragraph of the Studio field in full, a paragraph
          apart. Until 22-11 the second one sat under Read more; VP, 22-11:
          "remove read more less from here just let the text be here
          normally". */}
      <BioSection divider labelledBy="concerts-show">
        <Reveal variant="text">
          <ChapterHeading id="concerts-show">{c("showHeading")}</ChapterHeading>
          <BodyCopy value={c("body")} className="mt-6" />
        </Reveal>
        {/* The tickets note. Until 19-11 the June’s Night strip sat right
            under it (2-11, VP); VP, 19-11: "remove this only from the
            services/concerts page". June’s Night stays on the homepage,
            Shows, Solo shows and its own page. */}
        <Reveal variant="text">
          <Callout className="mt-10 text-sm">
            <CopyInline value={c("ticketsNote")} />
          </Callout>
        </Reveal>
      </BioSection>

      {/* Three ways to book a show — VP, 16-11: the options as the rows
          of the Services overview (outlined number, name, text, hairline
          rows, the same arrival and hover). */}
      <BioSection divider labelledBy="concerts-options">
        <Reveal variant="text">
          <ChapterHeading id="concerts-options">{c("optionsHeading")}</ChapterHeading>
        </Reveal>
        <div className="mt-10">
          <BookingOptions options={options} />
        </div>
      </BioSection>

      {/* The closing statement and the one booking pill (Bio's CTA). */}
      <BioSection divider>
        <Reveal variant="text">
          <CopyText value={c("statementLead")} className="tpl-lead text-ink-soft" />
          <p className="font-display mt-6 text-3xl leading-tight text-accent-strong sm:text-4xl">
            {c("statementEmphasis")}
          </p>
        </Reveal>
        <TemplateCta>
          <TrackedLink
            href="/contact?type=CONCERTS_LIVE"
            event="service_inquiry_click"
            eventProps={{ service: "concerts", position: "closing" }}
            className="btn-pill"
            data-cursor="BOOK"
          >
            {c("ctaLabelClosing")}
          </TrackedLink>
        </TemplateCta>
      </BioSection>
    </article>
  );
}
