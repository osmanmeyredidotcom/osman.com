"use client";

import { useEffect } from "react";

/**
 * 19-11 (N19-13, Varsha on the Contact page: "This link is not taking me to
 * get in touch page"; N19-17, the footer's Contact): a link to the Contact
 * page clicked while already on it (the FAQ's "Contact & booking", the
 * footer's Contact and Booking & Inquiries) used to do nothing, because the
 * browser was already there. On the Contact page such a click now brings
 * the visitor back up to Get in touch, smoothly unless reduced motion is
 * set, and moves keyboard focus there. Links from every other page navigate
 * as before, and a link that would change the selected topic (?type=…) is
 * left to the normal navigation.
 */
export function ContactSelfLinks({ targetId }: { targetId: string }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname) return;
      if (url.search && url.search !== window.location.search) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      target.focus({ preventScroll: true });
    };
    // Capture phase: runs before the link's own client-side navigation,
    // which then sees the click as handled.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [targetId]);
  return null;
}
