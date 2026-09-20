"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HOME_GALLERY } from "@/data/home-gallery";

/**
 * Adele-reference scrolling gallery (brief 20-09-2026), replacing the old
 * "Four ways to work with Osman Meyredi" services overview.
 *
 * Live-reference study (adele.com, 20-09-2026): one full-viewport section, a
 * single row of photographs at a uniform height (~70% of the viewport) with
 * mixed widths following each photo's native aspect, ~20px gaps, a ~7vw
 * lead-in, near-black background, and a thin light progress line under the
 * row. The live site lets the row scroll natively; the brief asks for the
 * scroll-DRIVEN version, so on desktop the section pins and vertical scroll
 * translates the row horizontally, 1:1 (one scrolled pixel = one pixel of
 * horizontal travel), releasing naturally at both ends. Reverse scroll
 * reverses the gallery because position derives purely from scrollY.
 *
 * Three modes, chosen by media queries so markup stays identical (no
 * hydration branching):
 *  - Desktop + motion OK: sticky viewport, transform-driven track (JS writes
 *    translate3d + scaleX to refs on rAF — no React state per frame, §21).
 *  - Below 768px: the row is a native swipe strip (adele.com's own mobile
 *    behaviour) — no scroll lock, progress follows scrollLeft.
 *  - prefers-reduced-motion: a plain vertical stack, everything visible, no
 *    pin, no progress bar (§19; the bar is decorative, aria-hidden).
 */
export function HomeScrollGallery() {
  const outerRef = useRef<HTMLElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  // Runway height is measured once per resize (never per frame).
  const [outerHeight, setOuterHeight] = useState<string | undefined>(undefined);

  useEffect(() => {
    const outer = outerRef.current;
    const strip = stripRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!outer || !strip || !track || !fill) return;

    const desktopMq = window.matchMedia("(min-width: 768px)");
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let running = false;
    let overflow = 0;
    let current = -1; // forces the first frame to paint
    const cleanups: Array<() => void> = [];

    const measure = () => {
      overflow = Math.max(0, track.scrollWidth - strip.clientWidth);
      setOuterHeight(overflow > 0 ? `calc(100vh + ${overflow}px)` : undefined);
    };

    const frame = () => {
      raf = 0;
      if (!running || overflow <= 0) return;
      const target = Math.min(
        1,
        Math.max(0, (window.scrollY - outer.offsetTop) / overflow)
      );
      // Light smoothing keeps the row cinematic without a scroll hijack.
      const next = Math.abs(target - current) < 0.0005 ? target : current + (target - current) * 0.18;
      if (next !== current) {
        current = next;
        track.style.transform = `translate3d(${-current * overflow}px, 0, 0)`;
        fill.style.transform = `scaleX(${current})`;
      }
      raf = requestAnimationFrame(frame);
    };

    const setupDesktop = () => {
      measure();
      const io = new IntersectionObserver(([entry]) => {
        running = entry.isIntersecting;
        if (running && !raf) raf = requestAnimationFrame(frame);
      });
      io.observe(outer);
      const ro = new ResizeObserver(() => {
        measure();
        current = -1; // repaint at the new geometry
        if (running && !raf) raf = requestAnimationFrame(frame);
      });
      ro.observe(strip);
      cleanups.push(() => {
        io.disconnect();
        ro.disconnect();
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        running = false;
        track.style.transform = "";
        fill.style.transform = "";
      });
    };

    const setupMobile = () => {
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const max = strip.scrollWidth - strip.clientWidth;
          fill.style.transform = `scaleX(${max > 0 ? strip.scrollLeft / max : 0})`;
        });
      };
      strip.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      cleanups.push(() => {
        strip.removeEventListener("scroll", onScroll);
        fill.style.transform = "";
      });
    };

    const init = () => {
      while (cleanups.length) cleanups.pop()!();
      setOuterHeight(undefined);
      if (reduceMq.matches) return; // static stack — CSS only
      if (desktopMq.matches) setupDesktop();
      else setupMobile();
    };

    init();
    desktopMq.addEventListener("change", init);
    reduceMq.addEventListener("change", init);
    return () => {
      desktopMq.removeEventListener("change", init);
      reduceMq.removeEventListener("change", init);
      while (cleanups.length) cleanups.pop()!();
    };
  }, []);

  return (
    <section
      ref={outerRef}
      className="hg-outer border-t border-line"
      style={outerHeight ? { height: outerHeight } : undefined}
      aria-label="Osman Meyredi — live and in the studio"
    >
      <div className="hg-viewport">
        <h2 className="sr-only">Osman Meyredi — live and in the studio</h2>
        <div ref={stripRef} className="hg-strip">
          <div ref={trackRef} className="hg-track">
            {HOME_GALLERY.map((img) => (
              <div
                key={img.src}
                className="hg-item"
                style={{ "--ar": img.width / img.height } as React.CSSProperties}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={`(min-width: 768px) ${Math.round(38 * (img.width / img.height))}vw, ${Math.round(34 * (img.width / img.height))}vw`}
                  className="object-cover"
                  style={img.objectPosition ? { objectPosition: img.objectPosition } : undefined}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Thin editorial progress line — the live reference styles the
            strip's scrollbar to the same effect (§16). Decorative only. */}
        <div className="hg-progress" aria-hidden="true">
          <div ref={fillRef} className="hg-progress-fill" />
        </div>
      </div>
    </section>
  );
}
