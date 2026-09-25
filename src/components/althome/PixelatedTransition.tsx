"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, prefersReducedMotion } from "./motion";

/**
 * /althome — pixelated scroll transition (brief §4, measured from
 * paulkalkbrenner.net). A grid of square "pixels" in the NEXT section's
 * background colour sits on the bottom edge of a large media section and
 * fills in, bottom row first with a ragged organic edge, scrubbed to the
 * scrollbar: the photo looks eaten by the section that follows, and it all
 * reverses on scroll up.
 *
 * Place it as the last child of a `position: relative` section; that
 * section is the ScrollTrigger. Under reduced motion no pixel is ever
 * created (the empty container is inert, aria-hidden, pointer-events none).
 */

type ColorToken = "canvas" | "canvas-soft" | "stage";

/** 25 → ~19 (≤991) → ~15 (≤767) → 6 (≤478), as on the reference. */
function columnsFor(viewportWidth: number, desktop: number): number {
  if (viewportWidth <= 478) return 6;
  if (viewportWidth <= 767) return Math.round(desktop * 0.6);
  if (viewportWidth <= 991) return Math.round(desktop * 0.75);
  return desktop;
}

export function PixelatedTransition({
  columns = 25,
  rows = 4,
  mode = "cover",
  color,
}: {
  columns?: number;
  rows?: number;
  /** cover: pixels 0→1 as the section leaves; reveal: 1→0 as it arrives. */
  mode?: "cover" | "reveal";
  /** Background token of the section the pixels blend into. */
  color: ColorToken;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section || prefersReducedMotion()) return;
    const gsap = ensureGsap();

    let ctx: ReturnType<typeof gsap.context> | null = null;
    let cols = 0;

    const build = () => {
      const next = columnsFor(window.innerWidth, columns);
      if (next === cols) return;
      cols = next;
      ctx?.revert();
      el.replaceChildren();
      el.style.setProperty("--cols", String(cols));

      // priority = (rows − 1 − row) × 50 + random(0..300) + sin(col × 0.3) × 30,
      // ascending: the bottom row leads, with a ragged edge.
      const cells: { node: HTMLDivElement; priority: number }[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const node = document.createElement("div");
          node.className = "ah-pixel";
          el.appendChild(node);
          cells.push({
            node,
            priority: (rows - 1 - r) * 50 + Math.random() * 300 + Math.sin(c * 0.3) * 30,
          });
        }
      }
      const ordered = cells.sort((a, b) => a.priority - b.priority).map((c) => c.node);

      ctx = gsap.context(() => {
        const cover = mode === "cover";
        gsap.set(ordered, { autoAlpha: cover ? 0 : 1 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              // "bottom bottom" as measured, for sections at least a screen
              // tall. A shorter section (phones) would already be bitten
              // while fully in view, so there the take-down starts when it
              // begins to leave ("top top").
              start: cover
                ? () => (section.offsetHeight >= window.innerHeight ? "bottom bottom" : "top top")
                : "top bottom",
              end: cover ? "bottom top" : "top center",
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          })
          .to(ordered, {
            autoAlpha: cover ? 1 : 0,
            duration: 0.01,
            stagger: { amount: 1.5, from: "start" },
            ease: "none",
          });
      });
    };

    build();
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(build, 160);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
      ctx?.revert();
      el.replaceChildren();
    };
  }, [columns, rows, mode]);

  return (
    <div
      ref={ref}
      className={`ah-pixels ah-pixels--${mode}`}
      aria-hidden="true"
      style={
        {
          "--pixel-color": `var(--color-${color})`,
          "--cols": columns,
        } as React.CSSProperties
      }
    />
  );
}
