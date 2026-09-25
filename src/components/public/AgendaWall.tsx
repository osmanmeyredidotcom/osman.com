"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/**
 * Upcoming Gigs agenda wall — precision pack 01.
 *
 * Composition follows the live Black Star agenda (inspected 07-09-2026):
 * oversized DD/MM/YYYY dates, venue line in grey beneath, city smaller,
 * right-aligned blocks on a dark wall, future events bright, past events
 * muted and ticked off (25-09-2026: a checked box instead of the
 * strike-through; cancelled nights keep the strike), no cards, no buttons —
 * the event itself is the interactive object. The live reference currently
 * ships no links or images in its agenda entries, so the mandatory
 * photo+link interaction is built to the brief's specification: hovering or
 * focusing an event reveals its photo
 * in a fixed image-led preview that drifts gently toward the cursor; the
 * whole event block is one link when a destination exists.
 *
 * Performance rules honoured (01 §14): one shared pointermove listener with
 * rAF-coalesced writes, transform/opacity only, one preview element for the
 * whole wall, no per-event animation loops, nearby images pre-warmed once.
 */
export type AgendaRow = {
  id: string;
  dateLabel: string;
  title: string;
  venue: string;
  city: string;
  collaborators: string | null;
  isPast: boolean;
  state: "SCHEDULED" | "SOLD_OUT" | "CANCELLED";
  link: { href: string; external: boolean; cursor: string; label: string } | null;
  imageUrl: string | null;
  imageAlt: string | null;
  imageCredit: string | null;
};

/** A played night, ticked off: the check draws in as the row arrives. */
function PlayedCheck() {
  return (
    <span className="agenda-check" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <rect x="2" y="2" width="20" height="20" rx="3.5" />
        <path d="M6.8 12.6l3.4 3.4 7-7.4" />
      </svg>
    </span>
  );
}

function RowInner({ row }: { row: AgendaRow }) {
  const cancelled = row.state === "CANCELLED";
  const played = row.isPast && !cancelled;
  return (
    <>
      {/* Inline image for touch/small screens — no hidden hover dependency
          (01 §6). Hidden wherever the hover preview layer is active. */}
      {row.imageUrl && (
        <span className="agenda-inline-img" aria-hidden="true">
          <Image
            src={row.imageUrl}
            alt=""
            width={320}
            height={240}
            sizes="112px"
            className="h-full w-full object-cover"
          />
        </span>
      )}
      <span className="block min-w-0">
        <span
          className={`agenda-date font-display block ${
            cancelled ? "agenda-struck text-ink/60" : row.isPast ? "text-ink/60" : "text-ink"
          }`}
        >
          {played && <PlayedCheck />}
          {row.dateLabel}
        </span>
        <span
          className={`agenda-venue font-display block ${
            row.isPast ? "text-ink-faint/70" : "text-ink-faint"
          }`}
        >
          {row.title}
        </span>
        <span
          className={`agenda-city block ${row.isPast ? "text-ink-soft/60" : "text-ink-soft"}`}
        >
          {[row.venue !== row.title ? row.venue : null, row.city]
            .filter(Boolean)
            .join(" · ")}
          {row.collaborators ? ` · ${row.collaborators}` : ""}
        </span>
        {row.state === "SOLD_OUT" && (
          <span className="tabular mt-1 block text-xs tracking-[0.16em] text-ink-faint uppercase">
            Sold out
          </span>
        )}
        {row.state === "CANCELLED" && (
          <span className="tabular mt-1 block text-xs tracking-[0.16em] text-danger uppercase">
            Cancelled
          </span>
        )}
        {row.isPast && <span className="sr-only">{played ? " (played)" : " (past event)"}</span>}
      </span>
    </>
  );
}

export function AgendaWall({ rows }: { rows: AgendaRow[] }) {
  const [active, setActive] = useState<AgendaRow | null>(null);
  const [visible, setVisible] = useState(false);
  // The preview is position:fixed; a transformed ancestor (e.g. a reveal
  // wrapper) would re-anchor it, so it portals to <body> — client-only,
  // detected hydration-safely without an effect.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const previewRef = useRef<HTMLDivElement | null>(null);
  const raf = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const reduced = useRef(false);

  // Pre-warm the first few upcoming images once, when idle (01 §6/§14).
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const warm = () => {
      rows
        .filter((r) => !r.isPast && r.imageUrl)
        .slice(0, 4)
        .forEach((r) => {
          const img = new window.Image();
          img.src = r.imageUrl as string;
        });
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    const handle = idle ? idle(warm) : window.setTimeout(warm, 1200);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (!idle) window.clearTimeout(handle as number);
    };
  }, [rows]);

  // Played nights: each check draws in as its row scrolls into view. Armed
  // only with motion allowed and only for checks still below the fold, so
  // nothing on screen at load ever changes.
  const scopeRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const checks = Array.from(scope.querySelectorAll<HTMLElement>(".agenda-check")).filter(
      (el) => el.getBoundingClientRect().top >= window.innerHeight
    );
    if (!checks.length) return;
    checks.forEach((el) => el.classList.add("is-armed"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-drawn");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    checks.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rows]);

  // One shared pointer listener; writes coalesced into a single rAF that
  // sets a transform on the one preview element. No React state per pixel.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (reduced.current) return;
      target.current = { x: e.clientX, y: e.clientY };
      if (raf.current == null) {
        raf.current = requestAnimationFrame(() => {
          raf.current = null;
          const el = previewRef.current;
          if (!el) return;
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          const dx = (target.current.x - cx) * 0.045;
          const dy = (target.current.y - cy) * 0.045;
          el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const show = (row: AgendaRow) => {
    if (row.imageUrl) {
      setActive(row);
      setVisible(true);
    } else {
      setVisible(false);
    }
  };
  const hide = () => setVisible(false);

  const preview = (
    <div className="agenda-preview" aria-hidden="true">
      <div
        ref={previewRef}
        className={`agenda-preview-inner ${visible ? "is-visible" : ""}`}
      >
        {active?.imageUrl && (
          <figure className="m-0">
            <Image
              key={active.id}
              src={active.imageUrl}
              alt=""
              width={1200}
              height={900}
              sizes="(min-width: 768px) 30vw, 0px"
              className="agenda-preview-img"
              priority={false}
            />
            {active.imageCredit && (
              <figcaption className="agenda-preview-credit">
                {active.imageCredit}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </div>
  );

  return (
    <div ref={scopeRef} className="agenda-scope" onMouseLeave={hide}>
      {/* Fixed image-led preview, portalled so no ancestor transform can
          re-anchor it away from the viewport. */}
      {mounted ? createPortal(preview, document.body) : null}

      <ul className="agenda-grid" role="list">
        {rows.map((row) => {
          const interactive = row.link && !row.isPast && row.state === "SCHEDULED";
          return (
            <li key={row.id} className="agenda-item">
              {interactive && row.link ? (
                <a
                  href={row.link.href}
                  target={row.link.external ? "_blank" : undefined}
                  rel={row.link.external ? "noopener noreferrer" : undefined}
                  data-cursor={row.link.cursor}
                  aria-label={`${row.title}, ${row.dateLabel}, ${row.city}: ${row.link.label}`}
                  className="agenda-row group"
                  onMouseEnter={() => show(row)}
                  onFocus={() => show(row)}
                  onBlur={hide}
                >
                  <RowInner row={row} />
                </a>
              ) : (
                <div
                  className="agenda-row"
                  onMouseEnter={() => show(row)}
                  tabIndex={row.imageUrl ? 0 : -1}
                  onFocus={row.imageUrl ? () => show(row) : undefined}
                  onBlur={row.imageUrl ? hide : undefined}
                >
                  <RowInner row={row} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
