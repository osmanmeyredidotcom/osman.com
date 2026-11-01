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
 * gets the final state at once: the film, no curtains, no overlay. Scripts
 * that arrive after the failsafe began let it finish, then settle there.
 * "Began" is read from the band's own animation clock, so a later
 * client-side visit to the homepage still gets the full reveal.
 *
 * 2-11 (VP): a sound toggle in the film's bottom-right corner. The film
 * still starts muted (autoplay needs it); the button turns its sound on and
 * off on demand. It appears once the curtains have parted (at once with
 * reduced motion), never before scripts run, and the sound switches off by
 * itself when the band leaves the screen, so no audio plays from a film the
 * visitor cannot see.
 */

/** The supplied WHITE logomark is white at 60% opacity (Illustrator group). */
const MARK_OPACITY = 0.6;

/** Fade-out ends at 2.6s + 0.8s; settle just after. */
const SETTLE_MS = 3500;

/**
 * True once this band's no-JS failsafe has begun (scripts arrived very
 * late). Read from the band's own CSS animations, so the clock starts when
 * the band was rendered — a client-side visit to the homepage later in the
 * session still gets the full reveal.
 */
function failsafeStarted(root: HTMLElement): boolean {
  const wrap = root.querySelector<HTMLElement>(".imr-mark-wrap");
  if (!wrap || typeof wrap.getAnimations !== "function") return false;
  return wrap.getAnimations().some((a) => {
    const delay = Number(a.effect?.getTiming().delay ?? 0);
    const t = typeof a.currentTime === "number" ? a.currentTime : 0;
    return t >= delay;
  });
}

/** Time left until this band's running failsafe has played out (ms). */
function failsafeRemainingMs(root: HTMLElement): number {
  const wrap = root.querySelector<HTMLElement>(".imr-mark-wrap");
  if (!wrap || typeof wrap.getAnimations !== "function") return 0;
  let left = 0;
  for (const a of wrap.getAnimations()) {
    const end = Number(a.effect?.getComputedTiming().endTime ?? 0);
    const t = typeof a.currentTime === "number" ? a.currentTime : 0;
    left = Math.max(left, end - t);
  }
  return Math.max(0, left);
}

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

/** Speaker glyph for the sound toggle: waves when on, a cross when off. */
function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      {on ? (
        <>
          <path d="M15.5 9a4.2 4.2 0 0 1 0 6" />
          <path d="M18 6.5a7.8 7.8 0 0 1 0 11" />
        </>
      ) : (
        <>
          <path d="M16 9.5l5 5" />
          <path d="M21 9.5l-5 5" />
        </>
      )}
    </svg>
  );
}

export function IntroMovieReveal({ videoSrc, poster }: { videoSrc: string; poster: string }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const soundRef = useRef<HTMLButtonElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  // Sound on demand: unmuting is a direct response to the click, which is
  // what browsers require before a film may play audio.
  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const on = video.muted;
    video.muted = !on;
    if (on && video.paused) {
      video.play().catch(() => {
        /* playback refused: the film stays as it was */
      });
    }
    setSoundOn(on);
  };

  // The custom cursor reads data-cursor on pointerover; when the label flips
  // UNMUTE↔MUTE under a resting pointer, nudge it to re-read (as the menu).
  useEffect(() => {
    if (soundRef.current?.matches(":hover")) {
      soundRef.current.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    }
  }, [soundOn]);

  // Sound off as soon as the band is entirely off screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const video = videoRef.current;
        if (entries.some((e) => !e.isIntersecting) && video && !video.muted) {
          video.muted = true;
          setSoundOn(false);
        }
      },
      { threshold: 0 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

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

    // Scripts arrived after the CSS failsafe began (very slow load): let it
    // play out, then settle on the final state — never rewind to the
    // pre-entry, never cut the running sequence short.
    if (failsafeStarted(root)) {
      const done = window.setTimeout(() => {
        root.classList.remove("imr-pending");
        root.classList.add("imr-done");
      }, failsafeRemainingMs(root) + 50);
      return () => window.clearTimeout(done);
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

      {!videoFailed && (
        <button
          ref={soundRef}
          type="button"
          className="imr-sound"
          aria-label="Film sound"
          aria-pressed={soundOn}
          data-cursor={soundOn ? "MUTE" : "UNMUTE"}
          onClick={toggleSound}
        >
          <SoundIcon on={soundOn} />
        </button>
      )}
    </section>
  );
}
