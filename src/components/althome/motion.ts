"use client";

/**
 * /althome — single GSAP entry point. Plugins are registered lazily, on the
 * client only, the first time an /althome component mounts; nothing here
 * runs on any other route (brief §0.5). The "osmo" ease is the reference
 * site's reveal curve (brief §5).
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
    CustomEase.create("osmo", "0.625, 0.05, 0, 1");
    registered = true;
  }
  return gsap;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Touch-first devices keep native scrolling (brief §5). */
export function isTouchLike(): boolean {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

/** Fine pointer with hover — the only place the fan hover runs (brief §3). */
export function hasFinePointer(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export { gsap, ScrollTrigger, SplitText };
