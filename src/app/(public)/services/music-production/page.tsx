import type { Metadata } from "next";
import { getPageCopy } from "@/server/copy";
import { copyDefaults } from "@/data/page-copy";
import { CopyText } from "@/components/public/CopyText";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { PageBanner } from "@/components/public/PageBanner";
import {
  BioSection,
  BodyCopy,
  LeadCopy,
  TemplateCta,
  TitleBand,
} from "@/components/public/BioTemplate";
import { breadcrumbJsonLd, JsonLd, pageOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** The supplied banner (Studio: Pages → Music Production → Banner image). */
const PRODUCTION_BANNER = copyDefaults("service-music-production")["image"];

export async function generateMetadata(): Promise<Metadata> {
  // §23 title direction; Studio-editable via Pages → Music Production.
  const c = await getPageCopy("service-music-production");
  return {
    title: { absolute: c("seo.title") },
    description: c("seo.description"),
    alternates: { canonical: "/services/music-production" },
    openGraph: pageOpenGraph({
      title: c("seo.title"),
      description: c("seo.description"),
      path: "/services/music-production",
      image: c("image"),
      imageAlt: c("imageAlt"),
      imageWidth: 1920,
      imageHeight: 1282,
    }),
  };
}

/** Only a real web address may become the label button. */
function labelHref(value: string): string | null {
  const v = value.trim();
  return /^https:\/\/[^\s]+$/.test(v) ? v : null;
}

/**
 * Music Production — 4-11 feedback (N04-19: "Same as bio", "This has to
 * also be redesigned", the 12-10 call): the Bio template. Title band, the
 * rehearsal photograph as the full-width banner, then Bio's reading column:
 * the approved lead sentence, the four approved paragraphs and the Get In
 * Touch pill. The copy is FINAL_Sep26_Music Production (November N4), word
 * for word; the second, portrait photo is no longer shown (one strong hero
 * photograph, as Bio).
 *
 * Meyredi Records (N04-22, slide "This section could be like the
 * screenshot below", the closing band of Live Videos): the label is its own
 * highlighted band, the name in the site's red display type over the
 * approved note, on the same column. The button to the label's website is
 * Studio-controlled and stays off until the site works: on 16-11
 * meyredirecords.com failed with a certificate error (the certificate is for
 * a different address), so the note's link is off too.
 */
export default async function MusicProductionPage() {
  const [c, sv] = await Promise.all([
    getPageCopy("service-music-production"),
    getPageCopy("services"),
  ]);
  const labelUrl = labelHref(c("labelUrl"));

  const banner = c("image");

  return (
    <article>
      {/* BreadcrumbList (§37) — mirrors the visible Services sub-nav hierarchy. */}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: sv("production.title"), path: "/services/music-production" },
        ])}
      />

      <section>
        <TitleBand
          eyebrow="Services"
          title={sv("production.title")}
          tags={sv("production.subtitle")}
        />
        {/* The supplied rehearsal photo is wider than tall with Osman's
            hands on the keys at the bottom: at the banner proportion the
            crop sits a little below the top so both his head and the keys
            stay in frame. Any other image keeps the banner's top anchor. */}
        <PageBanner
          src={banner}
          alt={c("imageAlt")}
          imageClassName={banner === PRODUCTION_BANNER ? "object-[50%_62%]" : undefined}
        />
      </section>

      <BioSection>
        <LeadCopy value={c("intro")} />
      </BioSection>

      <BioSection divider>
        <Reveal variant="text">
          <BodyCopy value={c("body1")} />
          <BodyCopy value={c("body2")} className="mt-6" />
        </Reveal>
        <TemplateCta>
          <TrackedLink
            href="/contact?type=MUSIC_PRODUCTION"
            event="service_inquiry_click"
            eventProps={{ service: "music-production", position: "closing" }}
            className="btn-pill"
            data-cursor="BOOK"
          >
            {c("ctaLabel")}
          </TrackedLink>
        </TemplateCta>
      </BioSection>

      {/* Meyredi Records — the label, highlighted (N04-22). */}
      <section
        aria-labelledby="meyredi-records"
        className="border-t border-line bg-stage py-20 sm:py-24"
      >
        <Container wide>
          <div className="mx-auto max-w-2xl">
            <Reveal variant="text">
              <h2
                id="meyredi-records"
                className="font-display text-4xl leading-tight text-accent-strong sm:text-5xl"
              >
                {c("labelHeading")}
              </h2>
              <CopyText
                value={c("labelNote")}
                className="mt-6 leading-relaxed text-ink-soft"
              />
              {labelUrl && (
                <p className="mt-9">
                  <TrackedLink
                    href={labelUrl}
                    external
                    event="label_site_click"
                    eventProps={{ position: "music-production" }}
                    className="btn-pill"
                    data-cursor="VIEW"
                  >
                    {c("labelCtaLabel")}
                  </TrackedLink>
                </p>
              )}
            </Reveal>
          </div>
        </Container>
      </section>
    </article>
  );
}
