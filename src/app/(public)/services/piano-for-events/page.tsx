import type { Metadata } from "next";
import { getPageCopy } from "@/server/copy";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ReservedSlot } from "@/components/public/ReservedSlot";
import { VideoEmbed } from "@/components/public/VideoEmbed";
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
      // The size of the default banner, Live Piano 7 (2-11).
      imageWidth: 3840,
      imageHeight: 2160,
    }),
  };
}

/**
 * Live Piano — 4-11 feedback (N04-18: "this particular page needs to be
 * designed like bio one", the 12-10 call): the Bio template. Title band,
 * Live Piano 7 as the full-width banner (unchanged file), then Bio's reading
 * column: the intro as the lead, the three approved paragraphs, the listen
 * chapter with the piano video (click to play, privacy-enhanced embed) and
 * the one booking pill. Same Studio copy, word for word; the earlier split
 * columns and the separate listen band are gone, so nothing floats off the
 * column (N04-21). The services sub-navigation stays visible while
 * scrolling (N04-20).
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

      <section>
        <TitleBand eyebrow="Services" title={sv("piano.title")} tags={c("strip")} />
        <PageBanner src={c("image")} alt={c("imageAlt")} />
      </section>

      <BioSection>
        <LeadCopy value={c("intro")} />
      </BioSection>

      {/* The approved copy (one Studio field, three paragraphs), then the
          listen chapter and the booking pill, as Bio's story closes. */}
      <BioSection divider>
        <Reveal variant="text">
          <BodyCopy value={c("body")} />
        </Reveal>

        <section aria-labelledby="piano-listen" className="mt-14 sm:mt-16">
          <Reveal variant="text">
            <ChapterHeading id="piano-listen">{c("listenHeading")}</ChapterHeading>
          </Reveal>
          {/* 4-11: the video is on YouTube, shown as the site's
              click-to-play player (nothing from YouTube loads before the
              click). The "Coming soon" slot stays as the fallback if the
              default link is ever removed. */}
          <Reveal variant="card" delay={90}>
            <div className="mt-8">
              {c("listenVideo") ? (
                <VideoEmbed
                  title={c("listenVideoTitle")}
                  platform={/vimeo\.com/.test(c("listenVideo")) ? "vimeo" : "youtube"}
                  videoUrl={c("listenVideo")}
                  thumbnailUrl={c("listenVideoPoster") || null}
                />
              ) : (
                <ReservedSlot />
              )}
            </div>
          </Reveal>
        </section>

        <TemplateCta>
          <TrackedLink
            href="/contact?type=LIVE_PIANO"
            event="service_inquiry_click"
            eventProps={{ service: "piano-for-events", position: "closing" }}
            className="btn-pill"
            data-cursor="BOOK"
          >
            {/* 22-10 round 2 (R2-2): the page-end pill carries the shared
                bottom-CTA wording. */}
            {c("ctaLabelClosing")}
          </TrackedLink>
        </TemplateCta>
      </BioSection>
    </article>
  );
}
