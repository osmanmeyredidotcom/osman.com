"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type RevealVariant = "text" | "mask" | "card" | "media";

/**
 * Scroll-reveal primitive. Four families (see globals.css):
 *  text  — editorial copy rises from below
 *  mask  — images open through a clip mask with a counter-scale
 *  card  — small rise for list/card sequences (combine with `delay` to stagger)
 *  media — cinematic slow settle for large media
 *
 * Safety model: elements render VISIBLE. Only after hydration, and only when
 * an element is still below the fold, is the `.pre-reveal` hidden state added
 * — so no-JS visitors, slow connections and reduced-motion users always see
 * content, and nothing already on screen ever blinks out.
 */
export function Reveal({
  variant = "text",
  delay = 0,
  className = "",
  children,
}: {
  variant?: RevealVariant;
  /** ms, becomes --reveal-delay (use multiples of 60–90ms for staggers) */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return; // stay visible, no animation
    }
    // Anything already (partly) on screen stays visible — never hide content
    // the visitor may be reading. Only elements ENTIRELY below the fold get
    // armed. (24-09 fix: the previous 0.92×vh guard created a trap band at
    // the fold — an element starting between 92% and 100% of the viewport
    // was armed yet could never reach the reveal threshold without a
    // scroll, so it sat clipped/invisible at page load. This was the last
    // piece of the "images are not visible" report.)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return;

    el.classList.add("pre-reveal");
    // 24-09: native lazy-loading never starts for an image hidden by the
    // reveal clip — Chromium's lazy heuristic skips it and, once the image
    // already intersects the viewport, never re-checks. Anything this
    // component hides, it must therefore load itself.
    for (const img of Array.from(el.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'))) {
      img.loading = "eager";
    }
    const reveal = () => {
      el.classList.add("is-inview");
      io.disconnect();
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal();
        }
      },
      // threshold 0 + a mild bottom margin: any real entry into the lower
      // viewport reveals — tall media can never under-shoot a ratio again.
      { threshold: 0, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    // Belt and braces: if layout shifts pull an armed element into view
    // without an intersection tick (fonts/images settling), a one-off
    // recheck shortly after hydration un-hides it.
    const recheck = window.setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) reveal();
    }, 900);
    return () => {
      window.clearTimeout(recheck);
      io.disconnect();
      el.classList.remove("pre-reveal");
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={variant}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Staggered sequence: wraps each direct child in a `card` reveal with an
 * incrementing delay. Children keep their own layout classes via itemClassName.
 */
export function StaggerReveal({
  children,
  className = "",
  itemClassName = "",
  step = 70,
  variant = "card",
}: {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  /** ms between siblings (40–100ms feels musical; don't make readers wait) */
  step?: number;
  variant?: RevealVariant;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} variant={variant} delay={i * step} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
