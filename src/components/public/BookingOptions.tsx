"use client";

import { useEffect, useRef } from "react";

export type BookingOption = { title: string; body: string };

/**
 * Concerts, "Three ways to book a show" (25-09-2026: "add an animation on the
 * 1 2 3 points and change their look"). The options are one scale, from the
 * solo show to the full band, so they sit on one rail:
 *
 *  - a thin rail runs across the three options and fills with the accent
 *    colour from left to right, lighting each option's node as it passes;
 *  - each number rises into place as its node lights, in solid type
 *    (the old outlined numerals read faint);
 *  - a small level meter under each number shows the size of the show,
 *    one bar per step, and grows in after it;
 *  - title and text follow.
 *
 * Same safety model as <Reveal>: everything renders visible; only after
 * hydration, with motion allowed, and only while below the fold is the
 * start state armed. On phones each option lights as it scrolls into view.
 */
export function BookingOptions({ options }: { options: BookingOption[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (root.getBoundingClientRect().top < window.innerHeight) return; // already on screen: stay put

    const items = Array.from(root.querySelectorAll<HTMLElement>(".bk-item"));
    // Side by side (desktop) the three light up in one sequence along the
    // rail; stacked (phones) each lights as it arrives.
    const sideBySide = window.matchMedia("(min-width: 768px)").matches;
    root.classList.add("bk-armed");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          root.classList.add("bk-in");
          for (const item of sideBySide ? items : [entry.target]) {
            item.classList.add("is-in");
            io.unobserve(item);
          }
        }
      },
      { threshold: 0.3 }
    );
    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="bk" style={{ "--n": options.length } as React.CSSProperties}>
      <div className="bk-rail" aria-hidden="true">
        <span className="bk-rail-fill" />
      </div>
      <ol className="bk-list">
        {options.map((option, i) => (
          <li key={option.title} className="bk-item" style={{ "--i": i } as React.CSSProperties}>
            <span className="bk-node" aria-hidden="true" />
            <div className="bk-head" aria-hidden="true">
              <span className="bk-num">
                <span>{String(i + 1).padStart(2, "0")}</span>
              </span>
              <span className="bk-meter">
                {options.map((_, j) => (
                  <span
                    key={j}
                    className={j <= i ? "is-on" : undefined}
                    style={{ "--j": j } as React.CSSProperties}
                  />
                ))}
              </span>
            </div>
            <h3 className="bk-title">{option.title}</h3>
            <p className="bk-body">{option.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
