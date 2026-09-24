import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import type { LiveVideoRecord } from "@/lib/types";
import { Container } from "@/components/shared/Container";
import { VideoEmbed } from "@/components/public/VideoEmbed";
import { ShowsSubnav } from "@/components/public/ShowsSubnav";
import { Reveal } from "@/components/motion/Reveal";
import { breadcrumbJsonLd, JsonLd, pageOpenGraph, videoJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

// §23 title direction for the live-videos gallery.
const PAGE_TITLE = "Osman Meyredi Live | Performance Videos";
const PAGE_DESCRIPTION =
  "Watch Osman Meyredi live: from U.K. tours with Ike Willis & Zappatika to trio nights in Amsterdam, plus piano performances for event bookers.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/shows/live-videos" },
  openGraph: pageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/shows/live-videos",
    image: "/images/videos/website-landscape-poster.jpg",
    imageAlt: "Osman Meyredi performing live, video still",
  }),
};

function VideoCard({ video, delay }: { video: LiveVideoRecord; delay: number }) {
  return (
    <Reveal variant="card" delay={delay}>
      <VideoEmbed
        title={video.title}
        platform={video.platform}
        videoUrl={video.videoUrl}
        thumbnailUrl={video.thumbnailUrl}
      />
      <h3 className="font-display mt-4 text-xl leading-snug">{video.title}</h3>
      {(video.venue || video.year) && (
        <p className="tabular mt-1 text-sm text-ink-faint">
          {[video.venue, video.year ? String(video.year) : null].filter(Boolean).join(" · ")}
        </p>
      )}
      {video.description && (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{video.description}</p>
      )}
    </Reveal>
  );
}

/**
 * Live videos — Round 2 Keynote slides 26–30. The approved per-video
 * descriptions live in the data (see demo/seed content); the grid ends with
 * one clearly reserved position for the next video (client-approved visible
 * label), and the page closes on the conversion section the client asked
 * for — "You just watched it, now book it." — instead of the old piano
 * block that felt random after the performance sequence.
 */
export default async function LiveVideosPage() {
  const videos = (await getRepos().videos.list())
    .filter((v) => v.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      {/* VideoObject per published video (§36/§40) — names, approved
          descriptions and real thumbnails only; upload dates and durations
          are unknown and therefore never emitted. */}
      {videos.map((video) => (
        <JsonLd key={video.id} data={videoJsonLd(video)} />
      ))}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shows", path: "/shows" },
          { name: "Live videos", path: "/shows/live-videos" },
        ])}
      />
      <ShowsSubnav current="/shows/live-videos" />
      <section className="py-20 sm:py-28">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Shows</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Live videos</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              For the nights you couldn&rsquo;t make it, or the ones you don&rsquo;t want to
              forget. Nothing plays until you press play.
            </p>
          </Reveal>

          {videos.length > 0 ? (
            <>
              {/* Restructure round (23-09, §19 "video should dominate"): the
                  lead video (the published B&W "Live Piano – Cinetol,
                  Amsterdam") renders as a full-width feature; the rest keep
                  the two-column editorial grid. Anchor ids per video so other
                  pages can deep-link (e.g. About → #live-showreel). */}
              <div id={videos[0].slug} className="mt-14 border-b border-line pb-14">
                <Reveal variant="media">
                  <VideoEmbed
                    title={videos[0].title}
                    platform={videos[0].platform}
                    videoUrl={videos[0].videoUrl}
                    thumbnailUrl={videos[0].thumbnailUrl}
                  />
                </Reveal>
                <Reveal variant="text" delay={80}>
                  <div className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-2">
                    <h3 className="font-display text-2xl leading-snug sm:text-3xl">
                      {videos[0].title}
                    </h3>
                    {(videos[0].venue || videos[0].year) && (
                      <p className="tabular text-sm text-ink-faint">
                        {[videos[0].venue, videos[0].year ? String(videos[0].year) : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  {videos[0].description && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
                      {videos[0].description}
                    </p>
                  )}
                </Reveal>
              </div>
              <ul className="grid gap-x-10 gap-y-14 pt-14 md:grid-cols-2">
                {videos.slice(1).map((video, i) => (
                  <li key={video.id} id={video.slug}>
                    <VideoCard video={video} delay={i * 80} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Reveal variant="text" delay={100}>
              <p className="mt-14 border-t border-line pt-8 text-ink-soft">
                Live videos are on their way. Check back soon.
              </p>
            </Reveal>
          )}
        </Container>
      </section>

      {/* Closing conversion — Round 2 slide 30 copy, verbatim. */}
      <section className="border-t border-line bg-stage py-24">
        <Container>
          <Reveal variant="text">
            <h2 className="font-display max-w-2xl text-4xl leading-tight sm:text-5xl">
              You just watched it, now book it.
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">
              This is just a selection of what he brings to a stage, whichever instrument,
              whichever room. If you&rsquo;ve seen enough, let&rsquo;s talk about your event.
            </p>
            <p className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/contact?type=CONCERTS_LIVE" className="btn-pill" data-cursor="BOOK">
                Book Osman Meyredi <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
              {/* Contextual internal link (§31): Live Videos → the concerts
                  & live performances service page. */}
              <Link href="/services/concerts" className="u-link text-sm text-ink-soft hover:text-accent-strong">
                How a live booking works
              </Link>
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
