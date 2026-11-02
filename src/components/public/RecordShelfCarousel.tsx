"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { ReleaseRecord } from "@/lib/types";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { RecordSleeve } from "@/components/public/RecordSleeve";
import { TrackedLink } from "@/components/public/TrackedLink";

/**
 * Homepage records shelf — HOMEPAGE_RECORDS_CAROUSEL_RESTORE (31-10-2026),
 * scrolling revised 1-11-2026 to browse like the homepage photo gallery.
 *
 * One horizontal shelf of records, newest on the left, oldest at the right
 * end (the page sorts them by release date). Each record is the site's
 * sleeve-and-vinyl treatment with the disc already half out of its sleeve
 * at rest, so the full square artwork and the vinyl read without any hover.
 * Nothing in this section rotates (Round 3: "No turning, it makes me
 * dizzy"), regardless of motion settings.
 *
 * Two modes, picked at run time (`data-mode` on the section):
 *  - pinned — desktop (768px+) with motion allowed, the gallery's model
 *    (HomeScrollGallery): the section pins under the site header and page
 *    scrolling drives the row 1:1 (one scrolled pixel = one pixel of travel,
 *    light smoothing), from the newest record to the oldest, then releases
 *    into the next section. The runway is the measured travel (row width
 *    minus visible width); nothing to travel means no runway. The whole
 *    section must fit one screen under the header, so the sleeves shrink
 *    to fit short screens; below MIN_SLEEVE the screen is too short and
 *    the native strip is used instead.
 *  - native — phones (as the gallery), reduced motion and too-short
 *    screens: a native horizontal scroll strip (touch, trackpad, shift +
 *    wheel) that never captures vertical scrolling.
 * In both modes the Previous releases / Next releases steps follow the one
 * real position: in pinned mode the steps scroll the page to the matching
 * point of the journey, in native mode the strip. 2-11 (VP): the progress
 * line is gone and the two steps are round outline buttons, centred.
 * Keyboard focus on a record's links brings the whole record into view the
 * same way. Mouse presses never move the shelf, so clicks always land.
 *
 * Historical reference: RecordsScroller.tsx (24-08 → 20-09, removed in
 * 0334b58) — its phone swipe strip lives on in native mode; its circular
 * cover crops and spinning discs stay out.
 */

const TONES = ["#a34b46", "#46586b", "#4d5c48", "#3a3d41"];

/** Smallest sleeve (px) the pinned mode may shrink to before falling back. */
const MIN_SLEEVE = 200;

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
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Journey = { pinned: boolean; overflow: number; top: number; border: number };

export function RecordShelfCarousel({
  releases,
  heading,
}: {
  releases: ReleaseRecord[];
  /** The section's label and heading, kept in view while the shelf pins. */
  heading: ReactNode;
}) {
  const stripId = useId();
  const outerRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const journey = useRef<Journey>({ pinned: false, overflow: 0, top: 0, border: 0 });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const outer = outerRef.current;
    const viewport = viewportRef.current;
    const content = contentRef.current;
    const strip = stripRef.current;
    const track = trackRef.current;
    if (!outer || !viewport || !content || !strip || !track) return;

    const desktopMq = window.matchMedia("(min-width: 768px)");
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = journey.current;
    const cleanups: Array<() => void> = [];
    let disposed = false;

    const showPosition = (x: number, max: number) => {
      setAtStart(x <= 1);
      setAtEnd(x >= max - 1);
    };

    const headerHeight = () => {
      const header = document.querySelector<HTMLElement>(".site-header");
      return header ? Math.round(header.getBoundingClientRect().height) : 0;
    };

    /* ---- native strip ------------------------------------------------- */
    const setupNative = () => {
      outer.dataset.mode = "native";
      outer.style.removeProperty("height");
      outer.style.removeProperty("--rs-sleeve");
      outer.style.removeProperty("--rs-top");
      track.style.transform = "";
      state.pinned = false;
      let tick = 0;
      const update = () => {
        tick = 0;
        showPosition(strip.scrollLeft, strip.scrollWidth - strip.clientWidth);
      };
      const onScroll = () => {
        if (!tick) tick = requestAnimationFrame(update);
      };
      strip.addEventListener("scroll", onScroll, { passive: true });
      update();
      cleanups.push(() => {
        strip.removeEventListener("scroll", onScroll);
        if (tick) cancelAnimationFrame(tick);
      });
    };

    /* ---- pinned journey ----------------------------------------------- */
    // Fit the whole section (label, heading, records with their details and
    // links, progress and steps) into one screen under the header, shrinking
    // the sleeves if needed. False when even MIN_SLEEVE does not fit.
    const fitPinned = (top: number): boolean => {
      outer.dataset.mode = "pinned";
      outer.style.setProperty("--rs-top", `${top}px`);
      outer.style.removeProperty("--rs-sleeve");
      const cs = getComputedStyle(viewport);
      const avail = window.innerHeight - top - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const sleeveEl = track.querySelector<HTMLElement>(".rshelf-sleeve");
      let sleeve = sleeveEl ? sleeveEl.offsetWidth : 0;
      for (let i = 0; i < 5; i++) {
        const excess = content.offsetHeight - avail;
        if (excess <= 0) return true;
        sleeve = Math.floor(sleeve - excess - 2);
        if (sleeve < MIN_SLEEVE) return false;
        outer.style.setProperty("--rs-sleeve", `${sleeve}px`);
      }
      return content.offsetHeight <= avail;
    };

    const setupPinned = (): boolean => {
      const top = headerHeight();
      if (!fitPinned(top)) return false;
      const overflow = Math.max(0, track.scrollWidth - strip.clientWidth);
      if (overflow <= 0) return false; // nothing to travel: no empty journey
      // The section's top border sits above the viewport; count it so the
      // journey starts exactly as the viewport pins and ends as it releases.
      const border = parseFloat(getComputedStyle(outer).borderTopWidth) || 0;
      state.pinned = true;
      state.overflow = overflow;
      state.top = top;
      state.border = border;
      outer.style.height = `${window.innerHeight - top + overflow + border}px`;

      let raf = 0;
      let current = -1;
      const frame = () => {
        raf = 0;
        const target = clamp((top - outer.getBoundingClientRect().top - border) / overflow, 0, 1);
        // Same light smoothing as the gallery; the first frame lands exactly.
        const next =
          current < 0 || Math.abs(target - current) < 0.0005
            ? target
            : current + (target - current) * 0.18;
        current = next;
        track.style.transform = `translate3d(${-next * overflow}px, 0, 0)`;
        showPosition(next * overflow, overflow);
        if (next !== target) raf = requestAnimationFrame(frame);
      };
      const wake = () => {
        if (!raf) raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) wake();
      });
      io.observe(outer);
      window.addEventListener("scroll", wake, { passive: true });
      wake();
      cleanups.push(() => {
        io.disconnect();
        window.removeEventListener("scroll", wake);
        if (raf) cancelAnimationFrame(raf);
        track.style.transform = "";
        state.pinned = false;
      });
      return true;
    };

    const init = () => {
      if (disposed) return;
      while (cleanups.length) cleanups.pop()!();
      if (desktopMq.matches && !reduceMq.matches && setupPinned()) return;
      setupNative();
    };

    let resizeRaf = 0;
    const onResize = () => {
      if (!resizeRaf)
        resizeRaf = requestAnimationFrame(() => {
          resizeRaf = 0;
          init();
        });
    };

    // The header slims once the page leaves the top (HeaderScroll toggles
    // data-scrolled, 0.32s height transition); refit to its settled height,
    // which happens far above this section.
    const header = document.querySelector<HTMLElement>(".site-header");
    let headerTimer = 0;
    // HeaderScroll rewrites the attribute on every scroll event; react to
    // real changes only, so the refit lands 0.36s after the toggle even
    // while the visitor keeps scrolling.
    let headerState = header?.dataset.scrolled;
    const headerMo = header
      ? new MutationObserver(() => {
          if (header.dataset.scrolled === headerState) return;
          headerState = header.dataset.scrolled;
          window.clearTimeout(headerTimer);
          headerTimer = window.setTimeout(init, 360);
        })
      : null;
    if (header) headerMo?.observe(header, { attributes: true, attributeFilter: ["data-scrolled"] });

    init();
    window.addEventListener("resize", onResize);
    desktopMq.addEventListener("change", init);
    reduceMq.addEventListener("change", init);
    // Web fonts change the text heights the fit depends on.
    document.fonts?.ready.then(() => init()).catch(() => {});
    return () => {
      disposed = true;
      headerMo?.disconnect();
      window.clearTimeout(headerTimer);
      window.removeEventListener("resize", onResize);
      desktopMq.removeEventListener("change", init);
      reduceMq.removeEventListener("change", init);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      while (cleanups.length) cleanups.pop()!();
    };
  }, []);

  /** Positions that put each record on the shelf's left content edge. */
  const recordStarts = useCallback((): number[] => {
    const track = trackRef.current;
    if (!track) return [];
    const items = Array.from(track.querySelectorAll<HTMLElement>("[data-rshelf-item]"));
    const edge = items[0]?.offsetLeft ?? 0;
    return items.map((el) => el.offsetLeft - edge);
  }, []);

  /** Current position on the journey (px of travel) and its maximum. */
  const position = useCallback((): { x: number; max: number } => {
    const strip = stripRef.current;
    const outer = outerRef.current;
    const j = journey.current;
    if (j.pinned && outer) {
      const x = j.top - outer.getBoundingClientRect().top - j.border;
      return { x: clamp(x, 0, j.overflow), max: j.overflow };
    }
    return strip ? { x: strip.scrollLeft, max: strip.scrollWidth - strip.clientWidth } : { x: 0, max: 0 };
  }, []);

  /** Move to a position: in pinned mode by scrolling the page, else the strip. */
  const goTo = useCallback((x: number) => {
    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    const j = journey.current;
    const outer = outerRef.current;
    if (j.pinned && outer) {
      const target = clamp(x, 0, j.overflow);
      const y = window.scrollY + outer.getBoundingClientRect().top + j.border - j.top + target;
      window.scrollTo({ top: Math.round(y), behavior });
      return;
    }
    stripRef.current?.scrollTo({ left: x, behavior });
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      const { x } = position();
      const starts = recordStarts();
      const target =
        dir === 1
          ? starts.find((s) => s > x + 4)
          : [...starts].reverse().find((s) => s < x - 4) ?? 0;
      if (target !== undefined) goTo(target);
    },
    [goTo, position, recordStarts]
  );

  // Keyboard focus on a record's links brings the whole record into view.
  // Keyboard only: a mouse press focuses a link too, and moving the shelf
  // under the pointer would swallow that click.
  const onFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      let keyboard = false;
      try {
        keyboard = target.matches(":focus-visible");
      } catch {
        keyboard = false;
      }
      if (!keyboard) return;
      const strip = stripRef.current;
      const viewport = viewportRef.current;
      const item = target.closest<HTMLElement>("[data-rshelf-item]");
      if (!strip || !item) return;
      // A clipped (pinned) viewport must never be scrolled by the browser.
      if (viewport && viewport.scrollLeft) viewport.scrollLeft = 0;
      const first = strip.querySelector<HTMLElement>("[data-rshelf-item]");
      const start = item.offsetLeft - (first?.offsetLeft ?? 0);
      const { x } = position();
      const left = item.offsetLeft - x; // in the strip's visible box
      const visible = left >= 0 && left + item.offsetWidth <= strip.clientWidth;
      // Pinned: arriving by Tab from above or below also brings the page to
      // the pinned shelf, so the whole record (and the heading) is in view.
      const j = journey.current;
      const outer = outerRef.current;
      let outside = false;
      if (j.pinned && outer) {
        const raw = j.top - outer.getBoundingClientRect().top - j.border;
        outside = raw < 0 || raw > j.overflow;
      }
      if (!visible || outside) goTo(visible ? x : start);
    },
    [goTo, position]
  );

  if (releases.length === 0) return null;

  return (
    <section ref={outerRef} className="rshelf border-t border-line bg-stage">
      <div ref={viewportRef} className="rshelf-viewport">
        <div ref={contentRef} className="rshelf-content">
          <Container wide className="rshelf-head">
            {heading}
          </Container>
          <Reveal variant="card">
            <div id={stripId} ref={stripRef} className="rshelf-strip" onFocus={onFocus}>
              <ul ref={trackRef} className="rshelf-track">
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
                        <div className="rshelf-text">
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

          {/* The two steps for mouse and keyboard, centred under the shelf
              as round outline buttons (2-11, VP: no progress line, circles
              instead of pills). They follow the same position as the
              scrolling. */}
          <Container wide className="rshelf-controls">
            <div className="flex items-center justify-center">
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
      </div>
    </section>
  );
}
