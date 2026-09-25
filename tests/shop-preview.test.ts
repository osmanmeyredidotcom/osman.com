/**
 * Shop preview (25-09-2026): the example pieces shown while the shop is in
 * concept mode. Each is unique, uses only the site's own images, and its
 * copy keeps the client's rules (no em dashes, the artist named in full).
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { SHOP_EXAMPLES } from "@/data/shop-examples";

const PUBLIC_DIR = path.join(process.cwd(), "public");

describe("shop preview examples", () => {
  it("shows a handful of distinct pieces", () => {
    expect(SHOP_EXAMPLES.length).toBeGreaterThanOrEqual(4);
    const ids = SHOP_EXAMPLES.map((e) => e.id);
    const titles = SHOP_EXAMPLES.map((e) => e.title);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("uses only images that exist in /public", () => {
    for (const { visual } of SHOP_EXAMPLES) {
      const src =
        visual.kind === "record" ? visual.artworkUrl : visual.kind === "print" ? visual.src : null;
      if (src) expect(existsSync(path.join(PUBLIC_DIR, src)), src).toBe(true);
    }
  });

  it("keeps the client's copy rules", () => {
    for (const e of SHOP_EXAMPLES) {
      const alt = e.visual.kind === "print" ? e.visual.alt : "";
      const text = [e.title, e.category, e.detail, alt].join(" ");
      expect(text, e.id).not.toMatch(/—/);
      expect(text.replace(/Osman Meyredi/g, ""), e.id).not.toMatch(/\b(Osman|Meyredi)\b/);
    }
  });
});
