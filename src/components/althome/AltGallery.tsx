"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/data/home-gallery";
import { rhythmFor } from "./journey";
import { ensureGsap, prefersReducedMotion, ScrollTrigger } from "./motion";
import { PixelatedTransition, type ColorToken } from "./PixelatedTransition";

/**
 * /althome — the "strong visual carousel" (journey brief §3.4): a variant of
 * the homepage's Adele-reference gallery (HomeScrollGallery, untouched),
 * rebuilt on GSAP so it shares the page's single scroll system.
 *
 *  - Rhythm, not a uniform strip: every photo keeps its native aspect ratio
 *    (never cropped) but takes its scale, vertical place and following space
 *    from GALLERY_RHYTHM: dominant frames, small ones up high, medium ones
 *    low. The row height is capped so the widest scaled photo is at most
 *    88vw: each can always be seen whole.
 *  - Landscape screens from 768px, motion OK: a sticky full-screen stage;
 *    vertical scroll scrubs the row sideways while each photo drifts up or
 *    down, smaller photos more, so the row reads in depth.
 *  - Phones and portrait screens: a native swipe strip with the same
 *    rhythm. Reduced motion: a vertical stack, alternating sides.
 *  - Leaves through a pixel transition into the next section's colour.
 */
const STAGE_QUERY = "(min-width: 768px) and (orientation: landscape)";

export function AltGallery({
  images,
  label,
  exitColor = "canvas",
}: {
  images: GalleryImage[];
  label: string;
  exitColor?: ColorToken;
}) {
  const outerRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!outer || !stage || !track || !fill || prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const desktop = window.matchMedia(STAGE_QUERY);

    let ctx: ReturnType<typeof gsap.context> | null = null;
    const overflow = () => Math.max(0, track.scrollWidth - stage.clientWidth);
    // The runway must be sized before every ScrollTrigger measurement.
    const sizeRunway = () => {
      outer.style.height = desktop.matches ? `${window.innerHeight + overflow()}px` : "";
    };

    const setup = () => {
      ctx?.revert();
      outer.style.height = "";
      if (!desktop.matches) return;
      sizeRunway();
      ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>(".ah-g-item", track);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: outer,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -overflow(), ease: "none" }, 0);
        tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
        items.forEach((item, i) => {
          // Smaller photos float more (up to ~3% of the screen height).
          const scale = Number(item.dataset.scale) || 1;
          const drift = () => window.innerHeight * 0.05 * Math.max(0, 1.12 - scale);
          const align = item.dataset.align;
          // Low photos rise, high photos sink, centred ones swing: nothing
          // leaves the row or touches the progress line.
          const swing = i % 2 ? 1 : -1;
          const from = () => (align === "center" ? swing * drift() * 0.5 : 0);
          const to = () => (align === "end" ? -drift() : align === "start" ? drift() : -swing * drift() * 0.5);
          tl.fromTo(item, { y: from }, { y: to, ease: "none" }, 0);
        });
      }, outer);
      ScrollTrigger.refresh();
    };

    ScrollTrigger.addEventListener("refreshInit", sizeRunway);
    setup();
    desktop.addEventListener("change", setup);
    return () => {
      desktop.removeEventListener("change", setup);
      ScrollTrigger.removeEventListener("refreshInit", sizeRunway);
      ctx?.revert();
      outer.style.height = "";
    };
  }, []);

  if (images.length === 0) return null;
  // Widest scaled photo, in row heights: caps the row so it stays ≤ 88vw.
  const kMax = Math.max(...images.map((img, i) => (img.width / img.height) * rhythmFor(i).scale));

  return (
    <section
      ref={outerRef}
      className="ah-gallery"
      aria-label={label}
      style={{ "--k-max": kMax.toFixed(4) } as React.CSSProperties}
    >
      <div ref={stageRef} className="ah-g-stage">
        <h2 className="sr-only">{label}</h2>
        <div className="ah-g-progress" aria-hidden="true">
          <div ref={fillRef} className="ah-g-progress-fill" />
        </div>
        <div className="ah-g-strip">
          <div ref={trackRef} className="ah-g-track">
            {images.map((img, i) => {
              const r = rhythmFor(i);
              const ar = img.width / img.height;
              return (
                <div
                  key={img.src}
                  className="ah-g-item"
                  data-align={r.align}
                  data-scale={r.scale}
                  style={
                    {
                      "--ar": ar,
                      "--s": r.scale,
                      "--gap": `${r.gapAfter}vw`,
                    } as React.CSSProperties
                  }
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={`(min-width: 768px) ${Math.round(50 * ar * r.scale)}vw, ${Math.round(60 * ar * r.scale)}vw`}
                    className="object-cover"
                    style={img.objectPosition ? { objectPosition: img.objectPosition } : undefined}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Gallery → the next section, in its colour. */}
      <PixelatedTransition color={exitColor} />
    </section>
  );
}
