"use client";

import { useEffect, useRef } from "react";

/**
 * End-of-content collapse for ReadMore — 22-10 feedback item 7: "The read
 * more button is good but after the expansion there should also be one read
 * less button". A reader who has finished the expanded chapters can close
 * them from where they are; focus and viewport return to the summary control
 * so a keyboard user is never stranded beside a collapsed region.
 *
 * It renders hidden until hydration: only scripts can close the native
 * <details> from inside its content, so without them the summary (which
 * already toggles Read less at the top) stays the single control and this
 * one never appears dead. Styling is the summary's own disclosure treatment
 * (.readmore-summary) — no new control style.
 *
 * VP follow-up (22-10): there is exactly ONE Read less, at the bottom — on
 * mount this marks the details `readmore-js`, whose CSS hides the open
 * summary, and the hover label here reads LESS, not MORE.
 */
export function ReadLess({ label = "Read less" }: { label?: string }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  // Hydration reveal without a re-render: the server (and the hydration
  // pass) render the button hidden; once scripts are live the attribute is
  // dropped straight on the DOM node. No state, nothing re-renders.
  useEffect(() => {
    ref.current?.removeAttribute("hidden");
    // Scripts own the disclosure now: the open summary hides (globals.css,
    // .readmore-js[open]) so this is the one Read less.
    ref.current?.closest("details")?.classList.add("readmore-js");
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      hidden
      className="readmore-summary readmore-end"
      data-cursor="LESS"
      onClick={() => {
        const details = ref.current?.closest("details");
        if (!details) return;
        details.open = false;
        const summary = details.querySelector<HTMLElement>("summary");
        if (summary) {
          summary.focus({ preventScroll: true });
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          summary.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
        }
      }}
    >
      {label}{" "}
      <span className="readmore-glyph" aria-hidden="true">
        −
      </span>
    </button>
  );
}
