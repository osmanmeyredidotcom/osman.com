"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "@/components/public/TrackedLink";
import { cssLin, evalLin, FAN_TIERS, fanPlan, spreadFactor, tierFor, type FanTier } from "./fanGeometry";
import { ensureGsap, hasFinePointer, prefersReducedMotion, ScrollTrigger } from "./motion";

export type FanCard = {
  id: string;
  slug: string;
  title: string;
  artworkUrl: string | null;
  listen: { href: string; platform: string } | null;
};

/**
 * /althome — "The records" fan (brief §3, measured from vanmorrison.com),
 * replacing the vinyl shelf on this page only.
 *
 * Covers are dealt like a hand of cards around the bottom-centre pivot.
 * The final fan is pure CSS (server-computed calc() values from
 * fanGeometry, one set per screen tier), so no-JS and reduced-motion
 * visitors get it complete and the height is reserved before any
 * animation — no layout shift. With
 * motion allowed and the fan below the fold, GSAP stacks the cards low and
 * plays: centre rises (0.65s power3.out), the others follow (40ms from the
 * centre), then everything fans out with the signature back.out(1.3)
 * overshoot (0.85s, 60ms from the centre). Hover (fine pointers only)
 * lifts one card and pushes its neighbours aside. The tilt is static:
 * nothing ever spins.
 *
 * `cards` arrive in left-to-right slot order (see assignToSlots).
 */
export function MusicFan({
  cards,
  eyebrow,
  title,
  listenLabel,
  moreHref,
  moreLabel,
}: {
  cards: FanCard[];
  eyebrow: string;
  title: string;
  listenLabel: string;
  moreHref: string;
  moreLabel: string;
}) {
  const fanRef = useRef<HTMLDivElement | null>(null);
  const tiers = Object.keys(FAN_TIERS) as FanTier[];
  const plans = Object.fromEntries(tiers.map((t) => [t, fanPlan(cards.length, FAN_TIERS[t])])) as Record<
    FanTier,
    ReturnType<typeof fanPlan>
  >;

  useEffect(() => {
    const fan = fanRef.current;
    if (!fan || prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const nodes = Array.from(fan.querySelectorAll<HTMLElement>(".ah-fan-card"));
    if (!nodes.length) return;

    const base = fanPlan(nodes.length);
    const X: number[] = [];
    const R = base.slots.map((s) => s.rot);
    const Z = base.slots.map((s) => s.z);
    // Same numbers as the CSS fan: tier sizes, spread factor, VW ≤ 1920.
    const measure = () => {
      const w = window.innerWidth;
      const layout = fanPlan(nodes.length, FAN_TIERS[tierFor(w)]);
      const k = spreadFactor(w);
      layout.slots.forEach((s, i) => {
        X[i] = evalLin(s.x, w) * k;
      });
    };
    measure();

    let fanned = false;
    let hoverOn = false;
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // GSAP owns the transforms from here on (inline beats the CSS fan).
      const rest = () => gsap.set(nodes, { x: (i: number) => X[i], y: 0, rotation: (i: number) => R[i], scale: 1 });

      const enableHover = () => {
        if (hoverOn || !hasFinePointer()) return;
        hoverOn = true;
        const onEnter = (i: number) => () => {
          nodes.forEach((n, j) => {
            if (j === i) {
              gsap.set(n, { zIndex: 20 });
              gsap.to(n, { x: X[j], y: -14, rotation: R[j], scale: 1.03, duration: 0.32, ease: "power3.out", overwrite: "auto" });
            } else {
              const side = j < i ? -1 : 1;
              gsap.set(n, { zIndex: Z[j] });
              gsap.to(n, { x: X[j] + 8 * side, y: 0, rotation: R[j] + 4 * side, scale: 0.985, duration: 0.42, ease: "power3.out", overwrite: "auto" });
            }
          });
        };
        const onLeave = () => {
          nodes.forEach((n, j) => {
            gsap.set(n, { zIndex: Z[j] });
            gsap.to(n, { x: X[j], y: 0, rotation: R[j], scale: 1, duration: 0.42, ease: "power3.out", overwrite: "auto" });
          });
        };
        nodes.forEach((n, i) => {
          const h = onEnter(i);
          n.addEventListener("mouseenter", h);
          cleanups.push(() => n.removeEventListener("mouseenter", h));
        });
        fan.addEventListener("mouseleave", onLeave);
        cleanups.push(() => fan.removeEventListener("mouseleave", onLeave));
      };

      const inView = fan.getBoundingClientRect().top < window.innerHeight * 0.85;
      if (inView) {
        // Already on screen at mount: never hide what can be seen.
        rest();
        fanned = true;
        enableHover();
        return;
      }

      const top = base.prominence[0];
      const centre = nodes[top];
      const others = nodes.filter((_, i) => i !== top);
      gsap.set(nodes, { x: 0, y: 300, rotation: 0, scale: 0.92, autoAlpha: 0 });

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          fanned = true;
          enableHover();
        },
      });
      tl.to(centre, { y: 0, autoAlpha: 1, scale: 1, duration: 0.65, ease: "power3.out" }, 0);
      if (others.length) {
        tl.to(
          others,
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.65, ease: "power3.out", stagger: { each: 0.04, from: "center" } },
          0
        );
      }
      tl.to(
        nodes,
        {
          x: (i: number) => X[i],
          rotation: (i: number) => R[i],
          duration: 0.85,
          ease: "back.out(1.3)",
          stagger: { each: 0.06, from: "center" },
        },
        ">-0.2"
      );

      ScrollTrigger.create({ trigger: fan, start: "top 85%", once: true, onEnter: () => tl.play() });
    }, fan);

    // Resize: recompute the spread and re-set, never replaying the entry.
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        measure();
        if (fanned) gsap.set(nodes, { x: (i: number) => X[i], rotation: (i: number) => R[i] });
      }, 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [cards.length]);

  return (
    <section
      className="ah-fan-section"
      style={
        Object.fromEntries(
          tiers.flatMap((t) => [
            [`--fan-h-${t}`, cssLin(plans[t].height)],
            [`--fan-dip-${t}`, cssLin(plans[t].dip)],
          ])
        ) as React.CSSProperties
      }
    >
      <p className="eyebrow text-center" style={{ color: "var(--color-ink-faint)" }}>
        {eyebrow}
      </p>
      <h2 className="ah-fan-title" data-ah-split>
        {title}
      </h2>

      <div ref={fanRef} className="ah-fan">
        {cards.map((card, i) => {
          const style = {
            ...Object.fromEntries(
              tiers.flatMap((t) => {
                const slot = plans[t].slots[i];
                return [
                  [`--size-${t}`, cssLin(slot.size)],
                  [`--xa-${t}`, slot.x.a.toFixed(5)],
                  [`--xb-${t}`, slot.x.b.toFixed(3)],
                ];
              })
            ),
            "--rot": `${plans.d.slots[i].rot}deg`,
            zIndex: plans.d.slots[i].z,
          } as React.CSSProperties;
          const art = card.artworkUrl ? (
            <Image src={card.artworkUrl} alt="" fill sizes="(min-width: 768px) 28vw, 45vw" className="object-cover" />
          ) : (
            <span className="ah-fan-card-type font-display">{card.title}</span>
          );
          return card.listen ? (
            <TrackedLink
              key={card.id}
              href={card.listen.href}
              external
              event="listen_click"
              eventProps={{ platform: card.listen.platform, release: card.slug }}
              data-cursor="LISTEN"
              data-cursor-style="disc"
              aria-label={`${card.title}, ${listenLabel} · ${card.listen.platform}`}
              className="ah-fan-card"
              style={style}
            >
              {art}
            </TrackedLink>
          ) : (
            <div key={card.id} className="ah-fan-card" style={style} role="img" aria-label={card.title}>
              {art}
            </div>
          );
        })}
      </div>

      <p className="mt-12 text-center sm:mt-14">
        <Link href={moreHref} data-cursor="VIEW" className="btn-pill">
          {moreLabel} <span className="arrow-nudge" aria-hidden="true">→</span>
        </Link>
      </p>
    </section>
  );
}
