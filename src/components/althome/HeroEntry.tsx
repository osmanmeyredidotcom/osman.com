"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ensureGsap, prefersReducedMotion } from "./motion";
import { PixelatedTransition } from "./PixelatedTransition";

export type HeroPromo = {
  slug: string;
  eyebrow: string;
  title: string;
  artist: string | null;
  artworkUrl: string | null;
  links: { label: string; href: string }[];
};

/**
 * /althome — hero entry (brief §2, measured from vanmorrison.com).
 *
 * Full-viewport muted looping video behind two stage-colour curtains; the
 * name "OSMAN MEYREDI" rises as an outline, the curtains part from the
 * centre while the solid name wipes open, then the header, the hero
 * content and the promo card arrive.
 *
 *   rise 0.75s power3.out → hold 0.35s → "reveal" (0.9s power3.inOut:
 *   curtains ±100%, fill clip opens) → +0.5 header/content/promo →
 *   +0.7 outline fades (0.3s power2.in)
 *
 * No-flash model: the server renders the hero in its PRE-entry state via
 * the `ah-pending` class (CSS, motion-OK browsers only), with a CSS
 * failsafe that shows the final state after 4s if scripts never run. On
 * mount, GSAP takes the same state inline and removes the class, so the
 * hand-over is invisible. Reduced motion: final state, no curtains.
 */
export function HeroEntry({
  name,
  videoSrc,
  poster,
  fallbackImage,
  fallbackAlt,
  roles,
  seeDatesLabel,
  bookingLabel,
  promo,
}: {
  name: string;
  videoSrc: string;
  poster: string;
  fallbackImage: string;
  fallbackAlt: string;
  roles: string;
  seeDatesLabel: string;
  bookingLabel: string;
  promo: HeroPromo | null;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root) return;

    // Muted autoplay, made explicit: React does not always serialise the
    // `muted` attribute, and browsers only autoplay muted video.
    if (video) {
      video.muted = true;
      video.play().catch(() => {
        /* autoplay refused: the poster stays, nothing else changes */
      });
    }

    if (prefersReducedMotion()) {
      root.classList.remove("ah-pending");
      return;
    }

    const gsap = ensureGsap();
    const q = (sel: string) => root.querySelector<HTMLElement>(sel);
    const header = document.querySelector<HTMLElement>(".site-header");
    const drift = q(".ah-name-drift");
    const wrap = q(".ah-name-wrap");
    const fill = q(".ah-name-fill");
    const outline = q(".ah-name-outline");
    const curtainL = q(".ah-curtain--l");
    const curtainR = q(".ah-curtain--r");
    const metaItems = Array.from(root.querySelectorAll<HTMLElement>(".ah-hero-meta > *"));
    const promoCard = q(".ah-promo");

    // Scripts arrived after the CSS failsafe already showed the final
    // state (very slow load): keep it, never rewind to the pre-entry.
    if (wrap && getComputedStyle(wrap).opacity === "1") {
      root.classList.remove("ah-pending");
      curtainL?.style.setProperty("display", "none");
      curtainR?.style.setProperty("display", "none");
      return;
    }

    // The fill wipe is driven through a proxy: browsers serialise
    // inset(0% 50% 0% 50%) as inset(0% 50%), and GSAP would then pair the
    // numbers wrongly and wipe from the left instead of from the centre.
    const wipe = { inset: 50 };
    const paintWipe = () => {
      if (fill) fill.style.clipPath = `inset(0% ${wipe.inset}% 0% ${wipe.inset}%)`;
    };

    let cancelled = false;
    const ctx = gsap.context(() => {
      // Take over the pre-entry state inline, then drop the CSS class in
      // the same task: nothing repaints in between.
      gsap.set(wrap, { y: 200, autoAlpha: 0 });
      paintWipe();
      gsap.set(outline, { opacity: 1 });
      gsap.set([curtainL, curtainR], { x: 0 });
      gsap.set(metaItems, { yPercent: 100, autoAlpha: 0 });
      if (promoCard) gsap.set(promoCard, { autoAlpha: 0, x: 40 });
      if (header) gsap.set(header, { autoAlpha: 0 });
      root.classList.remove("ah-pending");

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
      tl.to(wrap, { y: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out" })
        .addLabel("reveal", "+=0.35")
        .to(curtainL, { x: "-100%", duration: 0.9, ease: "power3.inOut" }, "reveal")
        .to(curtainR, { x: "100%", duration: 0.9, ease: "power3.inOut" }, "reveal")
        .to(wipe, { inset: 0, duration: 0.9, ease: "power3.inOut", onUpdate: paintWipe }, "reveal")
        .to(outline, { opacity: 0, duration: 0.3, ease: "power2.in" }, "reveal+=0.7");
      if (header) tl.to(header, { autoAlpha: 1, duration: 0.5 }, "reveal+=0.5");
      // Roles + CTAs: the page's reveal-group rise (osmo, 50ms stagger),
      // timed with the header as the reference does.
      tl.to(
        metaItems,
        { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "osmo", stagger: 0.05 },
        "reveal+=0.5"
      );
      if (promoCard) tl.to(promoCard, { autoAlpha: 1, x: 0, duration: 0.55 }, "reveal+=0.5");

      // Scroll away: the name drifts down and dims as the hero leaves. It
      // lives on the outer wrapper so it never fights the entry tween.
      gsap.to(drift, {
        y: 120,
        autoAlpha: 0.4,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      // Wait for the first video frame, never longer than 1.8s.
      const start = () => {
        if (!cancelled && tl.progress() === 0 && !tl.isActive()) tl.play();
      };
      if (!video || video.readyState >= 2) {
        start();
      } else {
        video.addEventListener("loadeddata", start, { once: true });
        video.addEventListener("canplay", start, { once: true });
        gsap.delayedCall(1.8, start);
      }
    }, root);

    return () => {
      cancelled = true;
      ctx.revert(); // restores the header and every GSAP inline style
      if (fill) fill.style.clipPath = "";
      // Leave the shared header exactly as it was (no empty style attribute).
      if (header && !header.getAttribute("style")) header.removeAttribute("style");
    };
  }, []);

  return (
    <section ref={rootRef} className="ah-hero ah-pending" aria-label={name}>
      {videoFailed ? (
        <Image src={fallbackImage} alt={fallbackAlt} fill priority sizes="100vw" className="object-cover" />
      ) : (
        <video
          ref={videoRef}
          className="ah-hero-video"
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

      <div className="ah-curtain ah-curtain--l" aria-hidden="true" />
      <div className="ah-curtain ah-curtain--r" aria-hidden="true" />

      <div className="ah-name-drift">
        <div className="ah-name-wrap">
          <h1 className="ah-name ah-name-fill">{name}</h1>
          <span className="ah-name ah-name-outline" aria-hidden="true">
            {name}
          </span>
        </div>
      </div>

      <div className="ah-hero-foot">
        <div className="ah-hero-meta">
          <p className="eyebrow leading-relaxed">{roles}</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/shows" data-cursor="DATES" className="btn-pill">
              {seeDatesLabel} <span className="arrow-nudge" aria-hidden="true">→</span>
            </Link>
            <Link href="/contact" data-cursor="BOOK" className="u-link text-sm">
              {bookingLabel}
            </Link>
          </div>
        </div>

        {promo && (
          <aside className="ah-promo" aria-label={`${promo.eyebrow}: ${promo.title}`}>
            {promo.artworkUrl && (
              <div className="ah-promo-cover">
                <Image src={promo.artworkUrl} alt="" fill sizes="7rem" className="object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <p className="eyebrow">{promo.eyebrow}</p>
              {promo.artist && (
                <p className="tabular mt-2 text-[11px] tracking-[0.16em] text-ink-soft uppercase">{promo.artist}</p>
              )}
              <p className="font-display mt-1 text-xl leading-tight">{promo.title}</p>
              {promo.links.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {promo.links.map((l) => (
                    <li key={l.label}>
                      <TrackedLink
                        href={l.href}
                        external
                        event="listen_click"
                        eventProps={{ platform: l.label, release: promo.slug }}
                        data-cursor="LISTEN"
                        data-cursor-style="disc"
                        className="u-link text-xs font-medium tracking-wide uppercase hover:text-accent-strong"
                      >
                        {l.label}
                      </TrackedLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Hero video → marquee strip (page canvas). */}
      <PixelatedTransition color="canvas" />
    </section>
  );
}
