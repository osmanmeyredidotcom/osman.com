"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LOGOMARK_PATHS, LOGOMARK_VIEWBOX } from "./logomarkPaths";

/**
 * Homepage intro-movie reveal — 22-10 feedback item 4, revised in November.
 *
 * The client's Final_Homepage_IntroMovie is revealed in the same manner as
 * althome's intro (HeroEntry): the mark rises (0.75s quart-out), holds
 * 0.35s, then the two stage-colour curtains part from the centre while the
 * solid mark wipes open over its outline (0.9s quart-in-out), and the
 * outline fades (0.3s cubic-in at +0.7). Instead of the "OSMAN MEYREDI"
 * text, the OM logomark sits on top of the video.
 *
 * November feedback:
 * - N1a: the band sits where the homepage gallery used to be (after the
 *   featured release); the gallery took its old place near the bottom.
 * - N2: after the reveal the mark holds for a beat, then fades out (CSS,
 *   0.8s from +2.6s) so the finished state is the film alone; once the fade
 *   is over the band settles (`imr-done`) and the hidden overlay never takes
 *   pointer events.
 * - N3: the mark is the new OM logomark from the supplied OSMAN MEYREDI
 *   LOGO set, drawn as the supplied WHITE variant (white at 60%).
 *
 * Deliberate differences from the althome hero: the sequence starts when
 * the band scrolls into view (IntersectionObserver, once), not on load, the
 * site header is never touched, and the choreography is CSS keyframes with
 * the matching cubic-bezier curves rather than GSAP.
 *
 * No-flash model, as on althome: the server renders the pre-entry state via
 * `imr-pending`, whose CSS failsafe runs the sequence after ~6s if scripts
 * never arrive. On mount, scripts swap it for the JS-managed `imr-armed`
 * (same pre-entry, failsafe disarmed) and arm the observer. Reduced motion
 * and late scripts get the final state: the film, no curtains, no overlay.
 */

/** The supplied WHITE logomark is white at 60% opacity (Illustrator group). */
const MARK_OPACITY = 0.6;

/** Fade-out ends at 2.6s + 0.8s; settle just after. */
const SETTLE_MS = 3500;

/** Past this point the no-JS failsafe has started; never rewind it. */
const FAILSAFE_STARTS_MS = 5900;

function OmMark({ className, outline = false }: { className?: string; outline?: boolean }) {
  return (
    <svg viewBox={LOGOMARK_VIEWBOX} className={className} aria-hidden="true" focusable="false">
      {LOGOMARK_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fillRule="nonzero"
          fill={outline ? "none" : "currentColor"}
          fillOpacity={outline ? undefined : MARK_OPACITY}
          stroke={outline ? "currentColor" : "none"}
          strokeOpacity={outline ? MARK_OPACITY : undefined}
          strokeWidth={outline ? 1.25 : 0}
          vectorEffect={outline ? "non-scaling-stroke" : undefined}
        />
      ))}
    </svg>
  );
}

export function IntroMovieReveal({ videoSrc, poster }: { videoSrc: string; poster: string }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root) return;

    // Muted autoplay, made explicit (same note as althome's HeroEntry).
    if (video) {
      video.muted = true;
      video.play().catch(() => {
        /* autoplay refused: the poster stays, the reveal still runs */
      });
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Final state: the film, no curtains, no overlay.
      root.classList.remove("imr-pending");
      root.classList.add("imr-done");
      return;
    }

    // Scripts arrived after the CSS failsafe began (very slow load): settle
    // on the final state, never rewind to the pre-entry.
    if (performance.now() > FAILSAFE_STARTS_MS) {
      root.classList.remove("imr-pending");
      root.classList.add("imr-done");
      return;
    }

    // JS owns the entry now: same pre-entry state, failsafe disarmed.
    root.classList.add("imr-armed");
    root.classList.remove("imr-pending");

    let settle = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.disconnect();
          if (video) {
            video.preload = "auto";
            video.play().catch(() => {});
          }
          root.classList.remove("imr-armed");
          root.classList.add("imr-run");
          // N2: once the mark has faded, release the animations; the band
          // stays revealed with no overlay, even when scrolled back through.
          settle = window.setTimeout(() => root.classList.add("imr-done"), SETTLE_MS);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      if (settle) window.clearTimeout(settle);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="imr imr-pending border-t border-line"
      aria-label="Osman Meyredi — homepage film"
    >
      {videoFailed ? (
        <Image src={poster} alt="" fill sizes="100vw" className="object-cover" />
      ) : (
        <video
          ref={videoRef}
          className="imr-video"
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
          onError={() => setVideoFailed(true)}
        />
      )}

      <div className="imr-curtain imr-curtain--l" aria-hidden="true" />
      <div className="imr-curtain imr-curtain--r" aria-hidden="true" />

      <div className="imr-mark-wrap" aria-hidden="true">
        <OmMark className="imr-mark imr-mark-fill" />
        <OmMark outline className="imr-mark imr-mark-outline" />
      </div>
    </section>
  );
}
