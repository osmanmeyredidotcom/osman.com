/**
 * /althome (ALTHOME_BRIEF, 25-09-2026): kept out of the sitemap, the
 * "records" fan laid out exactly as the brief measured it, and every label
 * taken verbatim from the current homepage (no new copy, no em dashes).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import {
  assignToSlots,
  evalLin,
  FAN_MAX,
  FAN_TIERS,
  fanPlan,
  spreadFactor,
  tierFor,
} from "@/components/althome/fanGeometry";
import { HOME_LABELS, INSTRUMENTS } from "@/components/althome/labels";

describe("/althome stays out of search", () => {
  it("is never listed in the sitemap", async () => {
    const entries = await sitemap();
    expect(entries.length).toBeGreaterThan(10);
    expect(entries.some((e) => e.url.includes("/althome"))).toBe(false);
  });
});

describe("records fan geometry (brief §3)", () => {
  it("uses the measured size, rotation and stacking tables", () => {
    const table: Record<number, { rot: number[]; z?: number[] }> = {
      1: { rot: [0] },
      2: { rot: [-18, 18] },
      3: { rot: [-22, 0, 22], z: [1, 3, 2] },
      4: { rot: [-24, -8, 8, 24], z: [1, 3, 4, 2] },
      5: { rot: [-24, -8, 0, 8, 24], z: [1, 3, 5, 4, 2] },
    };
    const sizes: Record<number, number[]> = {
      1: [24.2],
      2: [22.6, 22.6],
      3: [22.6, 27.2, 22.6],
      4: [17.6, 22.6, 22.6, 17.6],
      5: [17.6, 22.6, 27.2, 22.6, 17.6],
    };
    for (let n = 1; n <= FAN_MAX; n++) {
      const plan = fanPlan(n);
      expect(plan.slots.map((s) => s.rot)).toEqual(table[n].rot);
      if (table[n].z) expect(plan.slots.map((s) => s.z)).toEqual(table[n].z);
      expect(plan.slots.map((s) => +(s.size.a * 100).toFixed(2))).toEqual(sizes[n]);
    }
  });

  it("places four covers exactly as measured in the browser at 1440px", () => {
    const plan = fanPlan(4);
    const xs = plan.slots.map((s) => +(evalLin(s.x, 1440) * spreadFactor(1440)).toFixed(1));
    // Gap = mean neighbour width − (15 + 0.029·VW + 42), from the centre,
    // then × 0.62: 113.34 × 0.62 and (113.34 + 190.68) × 0.62.
    expect(xs).toEqual([-188.5, -70.3, 70.3, 188.5]);
  });

  it("caps the viewport at 1920px and narrows the spread at 640px", () => {
    const x = fanPlan(3).slots[2].x;
    expect(evalLin(x, 2560)).toBe(evalLin(x, 1920));
    expect(spreadFactor(640)).toBe(0.48);
    expect(spreadFactor(641)).toBe(0.62);
  });

  it("gives the most important record the top card", () => {
    expect(assignToSlots(["own", "b", "c", "d", "e"])).toEqual(["e", "c", "own", "b", "d"]);
    expect(assignToSlots(["own", "b", "c", "d"])).toEqual(["d", "b", "own", "c"]);
    expect(assignToSlots(["own", "b", "c"])).toEqual(["c", "own", "b"]);
  });

  it("keeps every fan at least 12px inside the screen, from phones to wide desktops", () => {
    for (const w of [320, 360, 390, 430, 480, 560, 600, 640, 641, 700, 768, 769, 1024, 1280, 1440, 1920]) {
      for (let n = 1; n <= FAN_MAX; n++) {
        const plan = fanPlan(n, FAN_TIERS[tierFor(w)]);
        for (const slot of plan.slots) {
          const size = evalLin(slot.size, w);
          const t = (Math.abs(slot.rot) * Math.PI) / 180;
          const halfSpan = (size * Math.cos(t) + size * Math.sin(t)) / 2;
          const reach = Math.abs(evalLin(slot.x, w) * spreadFactor(w)) + halfSpan;
          expect(reach, `${n} covers at ${w}px`).toBeLessThanOrEqual(w / 2 - 12);
        }
      }
    }
  });
});

describe("labels are the current homepage's own words (brief §0.4)", () => {
  const root = path.resolve(__dirname, "..");
  const homepageSource = [
    "src/app/(public)/page.tsx",
    "src/components/public/HomeScrollGallery.tsx",
    "src/components/public/RecordShelfGrid.tsx",
  ]
    .map((f) => readFileSync(path.join(root, f), "utf8").replace(/&amp;/g, "&"))
    .join("\n");

  it.each(Object.entries(HOME_LABELS))("%s appears verbatim on /", (_key, value) => {
    expect(homepageSource).toContain(value);
  });

  it.each(INSTRUMENTS)("instrument %s matches /", (value) => {
    expect(homepageSource).toContain(`"${value}"`);
  });

  it("adds no em dash", () => {
    for (const value of [...Object.values(HOME_LABELS), ...INSTRUMENTS]) {
      expect(value).not.toContain("—");
    }
  });
});
