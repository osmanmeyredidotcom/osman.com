import type { ReleaseRecord } from "@/lib/types";
import { relationshipPublicLabels } from "@/components/studio/labels";
import { TrackedLink } from "./TrackedLink";
import { RecordSleeve } from "./RecordSleeve";

/**
 * Westones-inspired discography: an editorial index, not a card grid.
 *
 * Each release is a full-width row — outlined index numeral, title that rolls
 * to its duplicate on hover, dotted leader running to the year (the Westones
 * signature), platform links always visible. Hovering a row dims its
 * neighbours; the sleeve artwork clips in from the right with a vinyl disc
 * sliding out from behind the cover. On touch/small screens the artwork is
 * simply always visible; reduced motion strips the clip/slide.
 *
 * Streaming links never hide behind hover states (brief rule).
 */

const RELEASE_TYPE_LABELS = {
  SINGLE: "Single",
  EP: "EP",
  ALBUM: "Album",
  COLLABORATION: "Collaboration",
} as const;

const TONES = ["#a34b46", "#46586b", "#4d5c48", "#3a3d41"];

export function Discography({
  releases,
  startIndex = 0,
}: {
  releases: ReleaseRecord[];
  /** New Osman feedback.pages (23-09): the page numbers releases
      continuously across chapters (the doc's own example numbers the 2023
      single "04"), so a later list can continue where the previous ended. */
  startIndex?: number;
}) {
  return (
    <div className="disco-list">
      {releases.map((release, idx) => {
        const i = idx + startIndex;
        const links = [
          { label: "Spotify", href: release.spotifyUrl },
          { label: "Apple Music", href: release.appleMusicUrl },
          { label: "Bandcamp", href: release.bandcampUrl },
          { label: "YouTube", href: release.youtubeUrl },
        ].filter((l): l is { label: string; href: string } => Boolean(l.href));

        return (
          <article
            key={release.id}
            className="disco-row group border-t border-line py-10 last:border-b lg:py-12"
          >
            <div className="grid items-center gap-x-8 gap-y-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
              <div>
                <div className="flex items-baseline">
                  <span
                    className="service-index mr-6 shrink-0 text-4xl sm:text-5xl"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <h2 className="font-display min-w-0 text-3xl leading-tight sm:text-4xl">
                    {release.relationshipType !== "OWN_RELEASE" && release.primaryArtistName && (
                      <span className="tabular mb-1 block text-sm tracking-[0.16em] text-ink-soft uppercase">
                        {release.primaryArtistName}
                      </span>
                    )}
                    <span className="text-roll">
                      <span>{release.title}</span>
                      <span aria-hidden="true" className="text-accent">
                        {release.title}
                      </span>
                    </span>
                  </h2>
                  <span className="dot-leader hidden sm:block" aria-hidden="true" />
                  <span className="tabular hidden shrink-0 text-sm tracking-wide text-ink-faint uppercase sm:block">
                    {release.year ?? "—"}
                  </span>
                </div>
                <p className="tabular mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-faint sm:ml-[5.5rem]">
                  <span
                    className={`inline-block border px-2 py-0.5 text-[11px] tracking-[0.14em] uppercase ${
                      release.relationshipType === "OWN_RELEASE"
                        ? "border-accent-strong text-accent-strong"
                        : "border-line-dark text-ink-soft"
                    }`}
                  >
                    {relationshipPublicLabels[release.relationshipType]}
                  </span>
                  <span>
                    {RELEASE_TYPE_LABELS[release.releaseType]}
                    <span className="sm:hidden">{release.year ? ` · ${release.year}` : ""}</span>
                  </span>
                </p>
                {release.osmanCredit && (
                  <p className="mt-2 text-sm text-ink-soft sm:ml-[5.5rem]">
                    {release.osmanCredit}
                  </p>
                )}
                {release.description && (
                  <p className="mt-4 max-w-xl leading-relaxed text-ink-soft sm:ml-[5.5rem]">
                    {release.description}
                  </p>
                )}
                {release.credits && !release.osmanCredit && (
                  <p className="mt-2 text-sm text-ink-faint sm:ml-[5.5rem]">
                    {release.credits}
                  </p>
                )}
                {links.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-3 sm:ml-[5.5rem]">
                    {links.map((l) => (
                      <li key={l.label}>
                        <TrackedLink
                          href={l.href}
                          external
                          event="listen_click"
                          eventProps={{ platform: l.label, release: release.slug }}
                          data-cursor="LISTEN"
                          data-cursor-style="disc"
                          className="border-draw inline-block px-4 py-2 text-sm font-medium tracking-wide uppercase hover:bg-ink hover:text-canvas"
                        >
                          {l.label}
                        </TrackedLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sleeve + vinyl: clips in on row hover (desktop); always visible
                  on smaller screens where hover doesn't exist. */}
              <div className="relative mx-auto w-full max-w-[300px] lg:mx-0 lg:justify-self-end">
                <div className="hidden lg:block">
                  <div className="disco-art">
                    <RecordSleeve
                      title={release.title}
                      year={release.year}
                      tone={TONES[i % TONES.length]}
                      artworkUrl={release.artworkUrl}
                      withVinyl
                      vinylClassName="disco-vinyl"
                      className="pr-[12%]"
                    />
                  </div>
                </div>
                <div className="lg:hidden">
                  <RecordSleeve
                    title={release.title}
                    year={release.year}
                    tone={TONES[i % TONES.length]}
                    artworkUrl={release.artworkUrl}
                  />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
