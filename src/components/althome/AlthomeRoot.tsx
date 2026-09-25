"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { ensureGsap, isTouchLike, prefersReducedMotion, ScrollTrigger, SplitText } from "./motion";

/**
 * /althome — the page's one motion controller (brief §5, measured from
 * paulkalkbrenner.net). Everything here exists only while /althome is
 * mounted and is torn down on unmount, so the rest of the site keeps its
 * own behaviour untouched:
 *
 *  - Lenis smooth scroll (lerp 0.165, wheel ×1.25) driven by GSAP's ticker
 *    and feeding ScrollTrigger. Desktop only: off for touch-first devices
 *    and reduced motion. Paused while the fullscreen menu is open.
 *  - Reveal groups [data-ah-reveal]: children rise from y 100% (lists 150%)
 *    with the "osmo" ease, 0.8s, 50ms stagger (lists 35ms), once, at
 *    top 80%, then clearProps. [data-ah-items] picks the items.
 *  - Parallax photos [data-ah-parallax]: the photo drifts yPercent −8 → 8
 *    from top-bottom to bottom-top, whole and uncropped (see report:
 *    Deviations — the reference crops inside a frame).
 *  - Split headlines [data-ah-split]: lines rise inside a mask.
 *
 * Safety model (same as the site's Reveal): content is visible by default
 * and only elements still below the fold at mount are hidden, so nothing a
 * visitor can already see ever disappears. Reduced motion: nothing hides.
 */
export function AlthomeRoot({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const gsap = ensureGsap();
    const reduce = prefersReducedMotion();

    // ---- Lenis -------------------------------------------------------
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    let menuObserver: MutationObserver | null = null;
    if (!reduce && !isTouchLike()) {
      lenis = new Lenis({
        lerp: 0.165,
        wheelMultiplier: 1.25,
        // The fullscreen menu scrolls natively.
        prevent: (node) => Boolean(node.closest?.("#fullscreen-menu")),
      });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      const html = document.documentElement;
      menuObserver = new MutationObserver(() => {
        if (html.dataset.menuOpen === "true") lenis?.stop();
        else lenis?.start();
      });
      menuObserver.observe(html, { attributes: true, attributeFilter: ["data-menu-open"] });
    }

    // ---- Reveals, parallax, headlines -------------------------------
    const ctx = gsap.context(() => {
      if (reduce) return;
      const fold = window.innerHeight;
      const belowFold = (el: Element) => el.getBoundingClientRect().top >= fold;

      root.querySelectorAll<HTMLElement>("[data-ah-reveal]").forEach((group) => {
        if (!belowFold(group)) return;
        const list = group.dataset.ahReveal === "list";
        const items = Array.from(
          group.dataset.ahItems ? group.querySelectorAll(group.dataset.ahItems) : group.children
        );
        if (!items.length) return;
        gsap.set(items, { yPercent: list ? 150 : 100, autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: group,
          start: "top 80%",
          once: true,
          onEnter: () =>
            gsap.to(items, {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.8,
              ease: "osmo",
              stagger: list ? 0.035 : 0.05,
              clearProps: "transform,opacity,visibility",
            }),
        });
      });

      // Whole-photo drift: the photo lags the page (−8% → 8% of its height,
      // top-bottom → bottom-top of its static slot) so it reads as depth
      // without cropping the photograph.
      root.querySelectorAll<HTMLElement>("[data-ah-parallax]").forEach((photo) => {
        gsap.fromTo(
          photo,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: photo.parentElement ?? photo,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      root.querySelectorAll<HTMLElement>("[data-ah-split]").forEach((heading) => {
        if (!belowFold(heading)) return;
        const split = SplitText.create(heading, { type: "lines", mask: "lines" });
        gsap.set(split.lines, { yPercent: 100 });
        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(split.lines, {
              yPercent: 0,
              duration: 0.9,
              ease: "osmo",
              stagger: 0.08,
              // Back to plain text once risen: reflows naturally on resize.
              onComplete: () => split.revert(),
            }),
        });
      });
    }, root);

    // Line splits and trigger positions depend on the webfonts.
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });

    return () => {
      alive = false;
      ctx.revert();
      menuObserver?.disconnect();
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's default, for every other route
      if (lenis) {
        // Lenis 1.3 keeps its 400ms velocity-reset timer alive through
        // destroy(); when it fires it puts the `lenis` class back on <html>
        // on the next route. Cancel it first.
        const pending = (lenis as unknown as { _resetVelocityTimeout: ReturnType<typeof setTimeout> | null })
          ._resetVelocityTimeout;
        if (pending) clearTimeout(pending);
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div ref={ref} data-althome="">
      {children}
    </div>
  );
}
