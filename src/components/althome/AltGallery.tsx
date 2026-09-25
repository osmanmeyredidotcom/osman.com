"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/data/home-gallery";
import { ensureGsap, prefersReducedMotion, ScrollTrigger } from "./motion";
import { PixelatedTransition } from "./PixelatedTransition";

/**
 * /althome — the page's main image moment: a variant of the homepage's
 * Adele-reference gallery (HomeScrollGallery, untouched), rebuilt on GSAP
 * so it shares the page's single scroll system (Lenis + ScrollTrigger)
 * instead of running its own smoothing loop.
 *
 *  - Landscape screens from 768px, motion OK: a sticky full-screen stage;
 *    vertical scroll scrubs the row horizontally. Photos are as large as
 *    the screen allows (the widest capped at 88vw so each can be seen
 *    whole) and sit low in the stage, so the pixel exit eats into them.
 *    Each drifts vertically at its own rate while the row travels:
 *    parallax that never crops a photograph (the gallery's standing rule:
 *    Osman and the instrument always fully visible).
 *  - Phones and portrait screens: a native swipe strip. Reduced motion: a
 *    vertical stack, as on /.
 *  - Leaves through a pixel transition into the About section's canvas.
 */
const STAGE_QUERY = "(min-width: 768px) and (orientation: landscape)";

export function AltGallery({ images, label }: { images: GalleryImage[]; label: string }) {
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
        const drift = () => window.innerHeight * 0.025;
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
          const dir = i % 2 === 0 ? 1 : -1;
          tl.fromTo(item, { y: () => drift() * dir }, { y: () => -drift() * dir, ease: "none" }, 0);
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
  const arMax = Math.max(...images.map((img) => img.width / img.height));

  return (
    <section
      ref={outerRef}
      className="ah-gallery"
      aria-label={label}
      style={{ "--ar-max": arMax.toFixed(4) } as React.CSSProperties}
    >
      <div ref={stageRef} className="ah-g-stage">
        <h2 className="sr-only">{label}</h2>
        <div className="ah-g-progress" aria-hidden="true">
          <div ref={fillRef} className="ah-g-progress-fill" />
        </div>
        <div className="ah-g-strip">
          <div ref={trackRef} className="ah-g-track">
            {images.map((img) => (
              <div
                key={img.src}
                className="ah-g-item"
                style={{ "--ar": img.width / img.height } as React.CSSProperties}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={`(min-width: 768px) ${Math.round(50 * (img.width / img.height))}vw, ${Math.round(60 * (img.width / img.height))}vw`}
                  className="object-cover"
                  style={img.objectPosition ? { objectPosition: img.objectPosition } : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Gallery → About (page canvas). */}
      <PixelatedTransition color="canvas" />
    </section>
  );
}
