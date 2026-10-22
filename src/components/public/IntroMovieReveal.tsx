"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Homepage intro-movie reveal — 22-10 feedback item 4.
 *
 * The client's Final_Homepage_IntroMovie plays at the bottom of the homepage
 * and is revealed in the same manner as althome's intro (HeroEntry): the mark
 * rises (0.75s quart-out), holds 0.35s, then the two stage-colour curtains
 * part from the centre while the solid mark wipes open over its outline
 * (0.9s quart-in-out), and the outline fades (0.3s cubic-in at +0.7).
 * Instead of the "OSMAN MEYREDI" text, the OM monogram — the same official
 * vector the vinyl menu icon uses (/images/logo-om.svg, from OM_BLACK.pdf) —
 * sits on top of the video.
 *
 * Differences from the althome hero, deliberate:
 * - The band sits at the page's bottom, so the sequence starts when the
 *   section scrolls into view (IntersectionObserver, once), not on load,
 *   and the site header is never touched.
 * - The choreography runs as CSS keyframes with the matching cubic-bezier
 *   curves instead of GSAP, so the public homepage ships no animation
 *   runtime for one entry sequence.
 *
 * No-flash model, as on althome: the server renders the pre-entry state via
 * `imr-pending`, whose CSS failsafe reveals the final state after ~6s if
 * scripts never run. On mount, scripts swap the class for the JS-managed
 * `imr-armed` (same pre-entry, no failsafe) and arm the observer. Reduced
 * motion gets the final state with the video playing and no curtains.
 */

const OM_VIEWBOX = "16.8 11.5 511.2 241.9";
const OM_PATH =
  "M 522.824219 55.929688 C 519.105469 45.023438 513.894531 36.347656 507.203125 29.902344 C 500.511719 23.457031 492.703125 18.875 483.785156 16.144531 C 474.855469 13.417969 465.691406 12.054688 456.273438 12.054688 C 450.5625 12.054688 444.617188 12.734375 438.425781 14.101562 C 432.222656 15.464844 426.28125 17.445312 420.578125 20.042969 C 414.878906 22.65625 409.613281 25.808594 404.777344 29.527344 C 399.941406 33.246094 395.796875 37.582031 392.320312 42.535156 C 385.875 31.148438 377.136719 23.210938 366.109375 18.746094 C 355.082031 14.28125 343.492188 12.054688 331.34375 12.054688 C 320.199219 12.054688 309.535156 14.164062 299.378906 18.371094 C 289.664062 22.402344 281.023438 28.050781 273.347656 35.234375 L 273.347656 30.085938 C 273.347656 20.128906 265.273438 12.054688 255.316406 12.054688 C 245.355469 12.054688 237.28125 20.128906 237.28125 30.347656 L 237.28125 132.773438 C 237.28125 146.746094 235.347656 160.695312 231.578125 174.148438 C 228.433594 185.382812 223.910156 195.511719 218.160156 204.664062 C 216.960938 206.570312 215.78125 208.496094 214.46875 210.3125 C 206.863281 220.855469 197.417969 229.382812 186.125 235.898438 C 174.828125 242.417969 161.578125 245.667969 146.375 245.667969 C 131.167969 245.667969 117.863281 242.417969 106.460938 235.898438 C 95.054688 229.382812 85.546875 220.855469 77.949219 210.3125 C 70.34375 199.78125 64.699219 187.726562 61.003906 174.148438 C 57.3125 160.582031 55.464844 146.78125 55.464844 132.773438 C 55.464844 118.757812 57.367188 104.964844 61.167969 91.386719 C 64.96875 77.820312 70.667969 65.765625 78.273438 55.222656 C 85.875 44.691406 95.324219 36.164062 106.625 29.648438 C 117.914062 23.128906 131.167969 19.871094 146.375 19.871094 C 161.578125 19.871094 174.828125 23.128906 186.125 29.648438 C 197.417969 36.164062 206.863281 44.691406 214.46875 55.222656 C 215.78125 57.039062 216.960938 58.96875 218.160156 60.875 C 218.160156 60.875 218.160156 30.347656 218.167969 30.285156 C 213.347656 27.472656 208.335938 24.808594 202.90625 22.476562 C 186.722656 15.527344 167.878906 12.054688 146.375 12.054688 C 124.871094 12.054688 106.023438 15.527344 89.84375 22.476562 C 73.65625 29.429688 60.191406 38.5 49.441406 49.6875 C 38.6875 60.871094 30.589844 73.683594 25.164062 88.128906 C 19.730469 102.582031 17.019531 117.347656 17.019531 132.445312 C 17.019531 147.542969 19.730469 162.316406 25.164062 176.753906 C 30.589844 191.207031 38.6875 204.019531 49.441406 215.207031 C 60.191406 226.394531 73.65625 235.460938 89.84375 242.417969 C 106.023438 249.363281 124.871094 252.835938 146.375 252.835938 C 167.878906 252.835938 186.722656 249.363281 202.90625 242.417969 C 208.332031 240.082031 213.34375 237.421875 218.160156 234.613281 C 225.242188 230.484375 231.488281 225.707031 237.28125 220.578125 C 239.296875 218.792969 241.464844 217.125 243.308594 215.207031 C 254.0625 204.019531 262.09375 191.207031 267.417969 176.753906 C 273.367188 160.617188 273.347656 144.628906 273.347656 127.421875 L 273.347656 48.492188 C 279.292969 41.058594 286.667969 35.292969 295.46875 31.199219 C 304.269531 27.109375 313.378906 25.0625 322.796875 25.0625 C 328.5 25.5625 333.890625 27.109375 338.972656 29.71875 C 344.042969 32.320312 348.574219 36.347656 352.535156 41.800781 C 356.5 47.257812 359.601562 54.320312 361.839844 62.996094 C 364.066406 71.667969 364.929688 82.324219 364.4375 94.960938 L 364.4375 234.25 C 364.4375 244.515625 372.757812 252.835938 383.027344 252.835938 C 393.292969 252.835938 401.613281 244.515625 401.613281 234.25 L 401.613281 96.824219 C 402.605469 77.988281 400.75 62.867188 396.039062 51.464844 C 401.742188 43.039062 409.242188 36.539062 418.53125 31.945312 C 427.824219 27.367188 437.550781 25.0625 447.71875 25.0625 C 453.417969 25.5625 458.808594 27.109375 463.890625 29.71875 C 468.972656 32.320312 473.492188 36.347656 477.464844 41.800781 C 481.429688 47.257812 484.53125 54.320312 486.757812 62.996094 C 488.984375 71.667969 489.855469 82.324219 489.355469 94.960938 L 489.355469 234.058594 C 489.355469 244.429688 497.761719 252.835938 508.136719 252.835938 C 518.507812 252.835938 526.914062 244.429688 526.914062 234.058594 L 526.914062 96.824219 C 527.894531 80.46875 526.542969 66.832031 522.824219 55.929688";

function OmMark({ className, outline = false }: { className?: string; outline?: boolean }) {
  return (
    <svg viewBox={OM_VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <path
        d={OM_PATH}
        fill={outline ? "none" : "currentColor"}
        stroke={outline ? "currentColor" : "none"}
        strokeWidth={outline ? 1.25 : 0}
        vectorEffect={outline ? "non-scaling-stroke" : undefined}
      />
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
      root.classList.remove("imr-pending");
      return;
    }

    // Scripts arrived after the CSS failsafe already revealed (very slow
    // load): keep the final state, never rewind to the pre-entry.
    const wrap = root.querySelector<HTMLElement>(".imr-mark-wrap");
    if (wrap && getComputedStyle(wrap).opacity === "1") {
      root.classList.remove("imr-pending");
      root.classList.add("imr-done");
      return;
    }

    // JS owns the entry now: same pre-entry state, failsafe disarmed.
    root.classList.add("imr-armed");
    root.classList.remove("imr-pending");

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
        }
      },
      { threshold: 0.35 }
    );
    io.observe(root);
    return () => io.disconnect();
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
