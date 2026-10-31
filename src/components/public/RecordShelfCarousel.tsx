"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReleaseRecord } from "@/lib/types";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { RecordSleeve } from "@/components/public/RecordSleeve";
import { TrackedLink } from "@/components/public/TrackedLink";

/**
 * Homepage records shelf — HOMEPAGE_RECORDS_CAROUSEL_RESTORE (31-10-2026).
 *
 * One horizontal shelf of records, newest on the left, oldest at the right
 * end (the page sorts them by release date). It browses like the homepage
 * photo carousel does on phones — a native scroll strip with the same thin
 * progress line — at every width, so touch swipes and trackpad scrolling
 * move it directly and vertical page scrolling is never captured. Previous
 * releases / Next releases step one record at a time and stop at both ends;
 * keyboard focus on a record's links brings the whole record into view.
 *
 * Each record is the site's sleeve-and-vinyl treatment with the disc
 * already half out of its sleeve at rest, so the full square artwork and
 * the vinyl read without any hover. Nothing in this section rotates (Round
 * 3: "No turning, it makes me dizzy"), regardless of motion settings.
 *
 * Historical reference: RecordsScroller.tsx (24-08 → 20-09, removed in
 * 0334b58) — its phone swipe strip is the pattern reused here; its pinned
 * scroll-driven desktop, circular cover crops and spinning discs are what
 * this brief excludes.
 */

const TONES = ["#a34b46", "#46586b", "#4d5c48", "#3a3d41"];

/* 12-10 feedback (P03-X227 "… - spotify and apple music"): each card offers
   Spotify and Apple Music when the release has them, falling back to the
   other platforms only when neither exists. */
function listenLinks(r: ReleaseRecord): { href: string; platform: string }[] {
  const primary = [
    r.spotifyUrl ? { href: r.spotifyUrl, platform: "Spotify" } : null,
    r.appleMusicUrl ? { href: r.appleMusicUrl, platform: "Apple Music" } : null,
  ].filter((l): l is { href: string; platform: string } => l !== null);
  if (primary.length > 0) return primary;
  if (r.bandcampUrl) return [{ href: r.bandcampUrl, platform: "Bandcamp" }];
  if (r.youtubeUrl) return [{ href: r.youtubeUrl, platform: "YouTube" }];
  return [];
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d={direction === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function RecordShelfCarousel({ releases }: { releases: ReleaseRecord[] }) {
  const stripId = useId();
  const stripRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Progress line + the two ends, following the strip's own scroll position.
  useEffect(() => {
    const strip = stripRef.current;
    const fill = fillRef.current;
    if (!strip || !fill) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = strip.scrollWidth - strip.clientWidth;
      const x = strip.scrollLeft;
      fill.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, x / max)) : 1})`;
      setAtStart(x <= 1);
      setAtEnd(x >= max - 1);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    strip.addEventListener("scroll", schedule, { passive: true });
    const ro = new ResizeObserver(schedule);
    ro.observe(strip);
    update();
    return () => {
      strip.removeEventListener("scroll", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /** Scroll positions that put each record on the shelf's left content edge. */
  const recordStarts = useCallback((): number[] => {
    const strip = stripRef.current;
    if (!strip) return [];
    const items = Array.from(strip.querySelectorAll<HTMLElement>("[data-rshelf-item]"));
    const edge = items[0]?.offsetLeft ?? 0;
    return items.map((el) => el.offsetLeft - edge);
  }, []);

  const scrollToX = useCallback((left: number) => {
    stripRef.current?.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      const strip = stripRef.current;
      if (!strip) return;
      const x = strip.scrollLeft;
      const starts = recordStarts();
      const target =
        dir === 1
          ? starts.find((s) => s > x + 4)
          : [...starts].reverse().find((s) => s < x - 4) ?? 0;
      if (target !== undefined) scrollToX(target);
    },
    [recordStarts, scrollToX]
  );

  // Keyboard focus on a record's links brings the whole record into view,
  // horizontally only (vertical page scrolling stays the browser's own).
  const onFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      const strip = stripRef.current;
      const item = (e.target as HTMLElement).closest<HTMLElement>("[data-rshelf-item]");
      if (!strip || !item) return;
      const first = strip.querySelector<HTMLElement>("[data-rshelf-item]");
      const edge = first?.offsetLeft ?? 0;
      const start = item.offsetLeft;
      const end = start + item.offsetWidth;
      const visible = start >= strip.scrollLeft && end <= strip.scrollLeft + strip.clientWidth;
      if (!visible) scrollToX(start - edge);
    },
    [scrollToX]
  );

  if (releases.length === 0) return null;

  return (
    <div className="rshelf pb-24">
      <Reveal variant="card">
        <div id={stripId} ref={stripRef} className="rshelf-strip mt-10" onFocus={onFocus}>
          <ul className="rshelf-track">
            {releases.map((release, i) => {
              const listen = listenLinks(release);
              return (
                <li key={release.id} className="rshelf-item" data-rshelf-item>
                  <article>
                    <RecordSleeve
                      title={release.title}
                      year={release.year}
                      tone={TONES[i % TONES.length]}
                      artworkUrl={release.artworkUrl}
                      artworkAlt={`${release.title} cover art`}
                      withVinyl
                      spinVinyl={false}
                      vinylClassName="translate-x-1/2"
                      className="rshelf-sleeve"
                    />
                    <div className="mt-6">
                      <p className="eyebrow">{release.year ?? ""}</p>
                      <h3 className="font-display mt-1 text-2xl text-balance sm:text-3xl">
                        {release.title}
                      </h3>
                      {release.credits && (
                        <p className="mt-2 text-xs leading-relaxed text-ink-faint">{release.credits}</p>
                      )}
                      {listen.length > 0 && (
                        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                          {listen.map((l, j) => (
                            <TrackedLink
                              key={l.platform}
                              href={l.href}
                              external
                              event="listen_click"
                              eventProps={{ platform: l.platform, release: release.slug }}
                              className="platform-link text-sm font-medium tracking-wide uppercase"
                              data-cursor="LISTEN"
                              data-cursor-style="disc"
                            >
                              {j === 0 ? `Listen · ${l.platform}` : l.platform}
                            </TrackedLink>
                          ))}
                        </p>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </Reveal>

      {/* The shelf continues: the photo carousel's thin progress line, and
          the two steps for mouse and keyboard, in the site's pill style. */}
      <Container wide className="mt-8">
        <div className="flex items-center gap-6">
          <div className="rshelf-progress" aria-hidden="true">
            <div ref={fillRef} className="rshelf-progress-fill" />
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              className="btn-pill rshelf-nav"
              aria-label="Previous releases"
              aria-controls={stripId}
              aria-disabled={atStart}
              onClick={() => {
                if (!atStart) step(-1);
              }}
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className="btn-pill rshelf-nav"
              aria-label="Next releases"
              aria-controls={stripId}
              aria-disabled={atEnd}
              onClick={() => {
                if (!atEnd) step(1);
              }}
            >
              <Chevron direction="right" />
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
