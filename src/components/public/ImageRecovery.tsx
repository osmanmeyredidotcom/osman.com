"use client";

import { useEffect } from "react";

const MAX_RETRIES = 2;

/**
 * Self-healing images (24-09-2026). Diagnosed on the live site and the dev
 * server: when the image optimizer is cold (the first minutes after a
 * Vercel deploy, or `next dev` still compiling), an <img> request can fail
 * once — and the browser then caches that ERROR STATE forever. The slot
 * stays black until a manual reload, which is exactly the "images are not
 * visible" report from the client.
 *
 * This mounts one capture-phase error listener (img error events don't
 * bubble, but they do capture) plus a mount-time sweep for images that
 * broke before hydration. A failed same-origin image is re-requested with
 * a cache-busting param after a short backoff, at most twice. Successful
 * images are never touched.
 */
export function ImageRecovery() {
  useEffect(() => {
    const tries = new WeakMap<HTMLImageElement, number>();

    const retry = (img: HTMLImageElement) => {
      const n = tries.get(img) ?? 0;
      if (n >= MAX_RETRIES) return;
      const src = img.currentSrc || img.src;
      if (!src) return;
      let u: URL;
      try {
        u = new URL(src, window.location.origin);
      } catch {
        return;
      }
      // Only our own assets: the Next optimizer and the static /images tree.
      if (u.origin !== window.location.origin) return;
      if (!u.pathname.startsWith("/_next/image") && !u.pathname.startsWith("/images/")) return;
      tries.set(img, n + 1);
      window.setTimeout(() => {
        u.searchParams.set("retry", String(n + 1));
        // Pin the retried candidate: srcset would otherwise re-select the
        // original (still error-cached) URL.
        img.srcset = "";
        img.src = u.pathname + "?" + u.searchParams.toString();
      }, 1200 * (n + 1));
    };

    const onError = (e: Event) => {
      const t = e.target;
      if (t instanceof HTMLImageElement) retry(t);
    };
    document.addEventListener("error", onError, true);

    // Images that failed before this effect ran (complete but 0-size).
    for (const img of Array.from(document.images)) {
      if (img.complete && img.naturalWidth === 0 && (img.currentSrc || img.src)) retry(img);
    }

    return () => document.removeEventListener("error", onError, true);
  }, []);

  return null;
}
