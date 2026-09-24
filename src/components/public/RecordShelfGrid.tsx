import type { ReleaseRecord } from "@/lib/types";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { RecordSleeve } from "@/components/public/RecordSleeve";
import { TrackedLink } from "@/components/public/TrackedLink";

/**
 * Homepage records shelf — Round 3 Keynote (20-09-2026): "Previous design
 * was better where the vinyl came out of it's cover. Can we go back to
 * that? No turning, it makes me dizzy ;)".
 *
 * Each record is a square sleeve with the disc sliding out on hover (the
 * treatment already used on the Featured release and the Music page) — no
 * continuous rotation anywhere in this section. Artwork sits on the square
 * sleeve; records whose art is a round label read as a label on a dark
 * sleeve via RecordSleeve's built-in dark backing.
 */

const TONES = ["#a34b46", "#46586b", "#4d5c48", "#3a3d41"];

function listenHref(r: ReleaseRecord): { href: string; platform: string } | null {
  if (r.spotifyUrl) return { href: r.spotifyUrl, platform: "Spotify" };
  if (r.appleMusicUrl) return { href: r.appleMusicUrl, platform: "Apple Music" };
  if (r.bandcampUrl) return { href: r.bandcampUrl, platform: "Bandcamp" };
  if (r.youtubeUrl) return { href: r.youtubeUrl, platform: "YouTube" };
  return null;
}

export function RecordShelfGrid({ releases }: { releases: ReleaseRecord[] }) {
  if (releases.length === 0) return null;
  return (
    <Container wide className="pb-24">
      {/* Image-first cohesion pass (24-09, §11–14): two records per row on
          desktop so the artwork and the vinyl slide-out actually read at
          scale ("the records must feel large"); one large record per row on
          phones. Metadata stays compact. */}
      <div className="mt-14 grid gap-x-14 gap-y-20 md:grid-cols-2">
        {releases.map((release, i) => {
          const listen = listenHref(release);
          return (
            <Reveal key={release.id} variant="card" delay={Math.min(i * 70, 210)}>
              <article className="group/shelf">
                <div className="pr-[15%]">
                  <RecordSleeve
                    title={release.title}
                    year={release.year}
                    tone={TONES[i % TONES.length]}
                    artworkUrl={release.artworkUrl}
                    withVinyl
                    spinVinyl={false}
                    vinylClassName="transition-transform duration-500 ease-(--ease-out-cubic) group-hover/shelf:translate-x-[17%]"
                  />
                </div>
                <div className="mt-6">
                  <p className="eyebrow">{release.year ?? ""}</p>
                  <h3 className="font-display mt-1 text-2xl text-balance sm:text-3xl">{release.title}</h3>
                  {release.credits && (
                    <p className="mt-2 text-xs leading-relaxed text-ink-faint">{release.credits}</p>
                  )}
                  {listen && (
                    <p className="mt-3">
                      <TrackedLink
                        href={listen.href}
                        external
                        event="listen_click"
                        eventProps={{ platform: listen.platform, release: release.slug }}
                        className="u-link text-sm font-medium tracking-wide uppercase"
                        data-cursor="LISTEN"
                        data-cursor-style="disc"
                      >
                        Listen · {listen.platform}
                      </TrackedLink>
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Container>
  );
}
