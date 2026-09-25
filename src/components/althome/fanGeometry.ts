/**
 * /althome — "The Music" fan geometry (brief §3, measured from
 * vanmorrison.com). Pure functions shared by the server (CSS variables for
 * the no-JS / pre-hydration fan, so the height is reserved and nothing
 * shifts) and the client (exact pixel values for GSAP).
 *
 * Every length is linear in VW = min(viewportWidth, 1920): represented as
 * { a, b } meaning a·VW + b px, so the server can emit it as a CSS calc().
 */

export type Lin = { a: number; b: number };

const SIZES: Record<number, number[]> = {
  1: [24.2],
  2: [22.6, 22.6],
  3: [22.6, 27.2, 22.6],
  4: [17.6, 22.6, 22.6, 17.6],
  5: [17.6, 22.6, 27.2, 22.6, 17.6],
};
const Z: Record<number, number[]> = {
  1: [1],
  2: [1, 2],
  3: [1, 3, 2],
  4: [1, 3, 4, 2],
  5: [1, 3, 5, 4, 2],
};
const ROT: Record<number, number[]> = {
  1: [0],
  2: [-18, 18],
  3: [-22, 0, 22],
  4: [-24, -8, 8, 24],
  5: [-24, -8, 0, 8, 24],
};

export const FAN_MAX = 5;
/** Headroom so the hovered card's lift (y −14, scale 1.03) never clips. */
const LIFT_MARGIN_PX = 28;

const add = (p: Lin, q: Lin): Lin => ({ a: p.a + q.a, b: p.b + q.b });
const sub = (p: Lin, q: Lin): Lin => ({ a: p.a - q.a, b: p.b - q.b });
const half = (p: Lin): Lin => ({ a: p.a / 2, b: p.b / 2 });

/** Card side as a fraction of VW. */
function sizeLin(s: number): Lin {
  return { a: s / 100, b: 0 };
}

/**
 * Gap between neighbour centres: average width minus the overlap
 * (15 + 0.029·VW + 42 px).
 */
function gapLin(si: number, sj: number): Lin {
  return { a: (si + sj) / 200 - 0.029, b: -57 };
}

export type FanSlot = {
  /** Card side, a·VW. */
  size: Lin;
  /** Horizontal offset of the card centre from the fan centre, before the spread factor. */
  x: Lin;
  rot: number;
  z: number;
};

export type FanPlan = {
  count: number;
  slots: FanSlot[];
  /** Container height (rotated cards + lift headroom). */
  height: Lin;
  /** Bottom inset so the lowest rotated corner stays inside the container. */
  dip: Lin;
  /** Slot indices ordered by prominence (top of the stack first). */
  prominence: number[];
};

/**
 * Card-size multiplier per screen tier. The measured table (vw of a desktop
 * viewport) applies above 768px; at phone widths it would give 68–88px
 * covers stacked almost exactly on top of each other (the overlap term has
 * a fixed 57px part), so smaller screens deal larger cards. The spread
 * factor (0.62 / 0.48) and the overlap formula are unchanged. Each factor
 * is the largest that keeps a full five-card fan at least 12px inside the
 * screen across its tier (tests/althome.test.ts).
 */
export const FAN_TIERS = {
  /** desktop, above 768px: the measured table */
  d: 1,
  /** tablet, 641–768px */
  t: 1.4,
  /** phone, 640px and below */
  m: 1.75,
} as const;
export type FanTier = keyof typeof FAN_TIERS;

export function tierFor(viewportWidth: number): FanTier {
  if (viewportWidth <= 640) return "m";
  if (viewportWidth <= 768) return "t";
  return "d";
}

export function fanPlan(countIn: number, k = 1): FanPlan {
  const count = Math.max(1, Math.min(FAN_MAX, countIn));
  const s = SIZES[count].map((v) => v * k);
  const x: Lin[] = new Array(count).fill(null).map(() => ({ a: 0, b: 0 }));
  if (count % 2 === 1) {
    const m = (count - 1) / 2;
    for (let i = m + 1; i < count; i++) x[i] = add(x[i - 1], gapLin(s[i - 1], s[i]));
    for (let i = m - 1; i >= 0; i--) x[i] = sub(x[i + 1], gapLin(s[i], s[i + 1]));
  } else {
    const m1 = count / 2 - 1;
    const m2 = count / 2;
    const g = half(gapLin(s[m1], s[m2]));
    x[m2] = g;
    x[m1] = { a: -g.a, b: -g.b };
    for (let i = m2 + 1; i < count; i++) x[i] = add(x[i - 1], gapLin(s[i - 1], s[i]));
    for (let i = m1 - 1; i >= 0; i--) x[i] = sub(x[i + 1], gapLin(s[i], s[i + 1]));
  }

  let top = 0;
  let dip = 0;
  s.forEach((si, i) => {
    const t = (Math.abs(ROT[count][i]) * Math.PI) / 180;
    const w = si / 100;
    top = Math.max(top, w * Math.cos(t) + (w / 2) * Math.sin(t));
    dip = Math.max(dip, (w / 2) * Math.sin(t));
  });

  const slots = s.map((si, i) => ({ size: sizeLin(si), x: x[i], rot: ROT[count][i], z: Z[count][i] }));
  const prominence = slots
    .map((slot, i) => ({ i, z: slot.z }))
    .sort((p, q) => q.z - p.z)
    .map((p) => p.i);

  return {
    count,
    slots,
    height: { a: top + dip, b: LIFT_MARGIN_PX },
    dip: { a: dip, b: 0 },
    prominence,
  };
}

/** Spread factor: 0.62 on desktop, 0.48 at ≤640px (brief §3). */
export function spreadFactor(viewportWidth: number): number {
  return viewportWidth <= 640 ? 0.48 : 0.62;
}

export function evalLin(l: Lin, viewportWidth: number): number {
  const vw = Math.min(viewportWidth, 1920);
  return l.a * vw + l.b;
}

/** CSS length for a Lin, with VW = min(100vw, 1920px). */
export function cssLin(l: Lin): string {
  const a = +l.a.toFixed(5);
  const b = +l.b.toFixed(3);
  return `calc(${a} * min(100vw, 1920px) + ${b}px)`;
}

/**
 * Place items into fan slots by prominence: items[0] (the most important —
 * Osman's own release) takes the top/centre slot, items[1] the next, and so
 * on. Returns the items in left-to-right slot order.
 */
export function assignToSlots<T>(items: T[]): T[] {
  const plan = fanPlan(items.length);
  const out: T[] = new Array(plan.count);
  plan.prominence.forEach((slotIndex, rank) => {
    out[slotIndex] = items[rank];
  });
  return out;
}
