"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import { LogoWordmark } from "@/components/LogoWordmark";
import { SocialIconLinks, socialLinks } from "@/components/public/SocialIcons";

/**
 * Vinyl-triggered fullscreen navigation (Private Mansions direction).
 *
 * Trigger: a small vinyl record, fixed in the header's top-right. Its rotation
 * tracks page scroll — forward when scrolling down, backward when scrolling up
 * (scroll delta × 0.22deg, lerped; the reference site uses scrollY × 0.2deg).
 * Rotation accumulates in module scope so route changes never snap it back.
 * While the menu is open the record keeps easing forward slowly.
 *
 * Menu: instant full-viewport frosted takeover (82% stage-black + 20px blur,
 * 400ms veil fade) → primary links rise through line masks with a 55ms
 * stagger → meta column follows. Closing reverses: links drop first, veil
 * fades after. Body scroll locks while open; Escape closes; focus moves into
 * the menu and returns to the vinyl on close; the vinyl stays put as the
 * close control (aria-expanded + label swap, cursor shows MENU/CLOSE).
 */

const PRIMARY: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      // Round 3 Keynote menu slide: CONCERTS · LIVE PIANO · MUSIC
      // PRODUCTION · ORIGINAL SCORES & CUSTOM MUSIC.
      { label: "Concerts", href: "/services/concerts" },
      { label: "Live Piano", href: "/services/piano-for-events" },
      { label: "Music Production", href: "/services/music-production" },
      { label: "Original Scores & Custom Music", href: "/services/music-library" },
    ],
  },
  {
    label: "Shows",
    href: "/shows",
    children: [
      // Keynote slide 15: Concerts · Upcoming Shows · Tickets · Live Videos
      { label: "Concerts", href: "/shows/concerts" },
      { label: "Upcoming Gigs", href: "/shows/gigs" },
      { label: "Live Videos", href: "/shows/live-videos" },
    ],
  },
  {
    label: "Music",
    href: "/music",
    children: [{ label: "All Releases", href: "/music" }],
  },
  { label: "Media", href: "/media" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

// Module scope: the record's accumulated angle survives route changes.
let vinylAngle = 0;

export function FullscreenMenu({ settings }: { settings: SiteSettings }) {
  const [state, setState] = useState<"closed" | "open" | "closing">("closed");
  const open = state === "open";
  const faceRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    openRef.current = open;
    // The custom cursor reads data-cursor on pointerover; when the label
    // flips MENU↔CLOSE under a resting pointer, nudge it to re-read.
    if (buttonRef.current?.matches(":hover")) {
      buttonRef.current.dispatchEvent(
        new PointerEvent("pointerover", { bubbles: true })
      );
    }
  }, [open]);

  /* ---- Scroll-linked rotation (transform-only, zero React re-renders) ----
     The rAF loop IDLE-STOPS: it runs only while there is momentum to settle
     or the menu is open (slow spin). Scroll events restart it. No per-frame
     work while the page is at rest. */
  useEffect(() => {
    const face = faceRef.current;
    if (!face) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let displayed = vinylAngle;
    let last = window.scrollY; // baseline on mount: no jump after route change
    let raf = 0;

    const tick = () => {
      const y = window.scrollY;
      vinylAngle += (y - last) * 0.22; // forward down, backward up
      last = y;
      if (openRef.current) vinylAngle += 0.35; // slow spin while the menu is open
      displayed += (vinylAngle - displayed) * 0.14; // physical smoothing
      face.style.transform = `rotate(${displayed.toFixed(2)}deg)`;
      if (!openRef.current && Math.abs(vinylAngle - displayed) < 0.05) {
        raf = 0; // settled and closed — stop until the next scroll
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const ensureLoop = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const onVisibility = () => {
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!document.hidden) {
        last = window.scrollY; // don't count scroll that happened while hidden
        ensureLoop();
      }
    };

    window.addEventListener("scroll", ensureLoop, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    ensureLoop();
    return () => {
      window.removeEventListener("scroll", ensureLoop);
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Menu open needs the loop for the slow spin; nudge it awake on open.
  useEffect(() => {
    if (open) window.dispatchEvent(new Event("scroll"));
  }, [open]);

  /* ---- Open/close state machine (interruptible) ---- */
  const openMenu = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setState("open");
  }, []);

  const closeMenu = useCallback(() => {
    setState((s) => {
      if (s !== "open") return s;
      if (closeTimer.current) clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => {
        setState("closed");
        closeTimer.current = null;
        buttonRef.current?.focus();
      }, 560);
      return "closing";
    });
  }, []);

  const toggle = () => (open ? closeMenu() : openMenu());

  // Escape + scroll lock + move focus in
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
      // Light focus trap: keep Tab inside the dialog
      if (e.key === "Tab" && menuRef.current) {
        const focusables = menuRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])"
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === buttonRef.current)) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && active === lastEl) {
          e.preventDefault();
          buttonRef.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.menuOpen = "true";
    const firstLink = menuRef.current?.querySelector<HTMLElement>("a[href]");
    firstLink?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      delete document.documentElement.dataset.menuOpen;
    };
  }, [open, closeMenu]);

  // Route change → make sure the menu is closed (covers back/forward too)
  useEffect(() => {
    if (openRef.current) closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const socials = socialLinks(settings);

  let linkIndex = 0;

  return (
    <>
      {/* Vinyl trigger — a real button; the record itself is the control */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="fullscreen-menu"
        aria-label={open ? "Close navigation" : "Open navigation"}
        data-cursor={open ? "CLOSE" : "MENU"}
        className="vinyl-toggle"
      >
        <div ref={faceRef} className="vinyl-face">
          <div
            className="vinyl vinyl-dark h-full w-full"
            style={{ "--vinyl-label": "var(--color-accent)" } as React.CSSProperties}
            aria-hidden="true"
          />
        </div>
        <span className="vinyl-label-mark" aria-hidden="true">
          {/* Official OM monogram (brand files, 11-09-2026). */}
          <span className="vinyl-om" />
        </span>
      </button>

      {/* Fullscreen navigation */}
      <div
        id="fullscreen-menu"
        ref={menuRef}
        data-state={state}
        inert={!open}
        className="fs-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="fs-veil" aria-hidden="true" />
        <div className="relative flex h-full flex-col overflow-y-auto px-6 pt-24 pb-10 sm:px-10 lg:px-16">
          <div className="grid flex-1 content-center gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
            {/* Primary navigation */}
            <nav aria-label="Fullscreen">
              <ul className="fs-nav">
                {PRIMARY.map((item, i) => (
                  <li key={item.href + item.label} className="fs-group py-1 sm:py-1.5">
                    <span
                      className="fs-link-mask"
                      style={{ "--i": linkIndex++ } as React.CSSProperties}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="fs-link display-caps py-1 text-5xl sm:text-6xl lg:text-7xl"
                      >
                        <span className="fs-index" aria-hidden="true">
                          0{i + 1}
                        </span>
                        {item.label}
                      </Link>
                    </span>
                    {item.children && (
                      <span
                        className="fs-link-mask"
                        style={{ "--i": linkIndex++ } as React.CSSProperties}
                      >
                        <span className="fs-sub mt-1 mb-2 ml-10 flex flex-wrap gap-x-6 gap-y-1 sm:ml-14">
                          {item.children.map((child) => (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              onClick={closeMenu}
                              className="u-link text-sm tracking-wide text-ink-soft uppercase hover:text-accent-strong"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Meta column */}
            <div className="fs-meta flex flex-col justify-end gap-8 border-line lg:border-l lg:pl-10">
              <div>
                <LogoWordmark label="Osman Meyredi" className="h-5 sm:h-6 text-ink" />
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Multi-instrumentalist · bassist · composer
                  <br />
                  Amsterdam — Netherlands · Italy · Europe
                </p>
              </div>
              {socials.length > 0 && (
                <div>
                  <p className="eyebrow mb-3">Elsewhere</p>
                  <SocialIconLinks links={socials} />
                </div>
              )}
              <div>
                <p className="eyebrow mb-3">Booking &amp; Inquiries</p>
                <a href={`mailto:${settings.contactEmail}`} className="u-link text-sm">
                  {settings.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
