/**
 * 4-11 feedback round (N04 ledger): the data and rules behind this round's
 * changes. Layout and visual checks live in the QA screenshots; these pin
 * the facts that must not drift back.
 */
import { describe, expect, it } from "vitest";
import { copyDefaults, copyPage } from "@/data/page-copy";
import { demoVideos, realEvents } from "@/data/demo/content";
import { eventInput } from "@/lib/validation/schemas";
import { relationshipPublicLabels } from "@/components/studio/labels";

const pastShow = {
  eventType: "OTHER",
  title: "Rooftop event",
  date: "2020-11-06",
  startTime: "",
  venue: "Zoku Amsterdam",
  city: "Amsterdam",
  country: "Netherlands",
  status: "PUBLISHED",
};

describe("event start time (N04-30: correcting time-less archive records)", () => {
  it("lets a past show without a start time be saved and stay published", () => {
    const r = eventInput.safeParse(pastShow);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.startTime).toBe("");
  });

  it("still requires the start time before an upcoming show goes live", () => {
    const r = eventInput.safeParse({ ...pastShow, date: "2099-06-02" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.map((i) => i.path.join("."))).toContain("startTime");
    }
  });

  it("lets an upcoming draft wait for its time", () => {
    const r = eventInput.safeParse({ ...pastShow, date: "2099-06-02", status: "DRAFT" });
    expect(r.success).toBe(true);
  });

  it("still rejects a time that is not 24-hour", () => {
    const r = eventInput.safeParse({ ...pastShow, startTime: "8pm" });
    expect(r.success).toBe(false);
  });
});

describe("collaboration gig titles (N04-30) and separators (N04-31)", () => {
  const collaborationGigs = realEvents.filter((e) =>
    /Bierfabriek|Belushi|Zoku/.test(e.venue)
  );

  it("covers the Bierfabriek, Belushi’s and Zoku nights", () => {
    expect(collaborationGigs.length).toBe(7);
  });

  it("drops the repeated “Osman Meyredi” from collaboration gig titles", () => {
    for (const e of collaborationGigs) {
      expect(e.title, e.id).not.toMatch(/Osman Meyredi/);
    }
    expect(collaborationGigs.filter((e) => e.title === "Live at Bierfabriek")).toHaveLength(4);
    expect(collaborationGigs.filter((e) => e.title === "Live at Belushi’s")).toHaveLength(2);
    const zoku = collaborationGigs.find((e) => e.id === "evt-zoku-rooftop-2026-11-06");
    expect(zoku?.title).toBe("Rooftop event");
    expect(zoku?.venue).toBe("Zoku Amsterdam");
    // No time was ever supplied for it; none is invented.
    expect(zoku?.startTime).toBe("");
  });

  it("uses the en dash, not a spaced hyphen, between parts of a published title", () => {
    // The archived (withdrawn) Orsi video is left exactly as it was.
    const published = [
      ...realEvents.filter((e) => e.status === "PUBLISHED").map((e) => e.title),
      ...demoVideos.filter((v) => v.status === "PUBLISHED").map((v) => v.title),
    ];
    for (const title of published) {
      expect(title).not.toMatch(/ - /);
    }
    const titles = demoVideos.map((v) => v.title);
    expect(titles).toContain("Osman Meyredi on tour with Ike Willis & Zappatika – 2018 U.K. tour");
    expect(titles).toContain("Live at The Cinetol, Amsterdam – June 2026");
  });

  it("keeps every event title free of em dashes", () => {
    for (const e of realEvents) expect(e.title, e.id).not.toContain("—");
  });
});

describe("page copy (Studio defaults)", () => {
  it("titles the contact page “Get in touch” (N04-41)", () => {
    expect(copyDefaults("contact")["heading"]).toBe("Get in touch");
  });

  it("gives Meyredi Records its own band, its button waiting for a working address (N04-22)", () => {
    const c = copyDefaults("service-music-production");
    expect(c["labelHeading"]).toBe("Meyredi Records");
    expect(c["labelUrl"]).toBe("");
    expect(c["labelNote"]).toContain("Meyredi Records");
    // The label's site fails with a certificate error: no link to it yet.
    expect(c["labelNote"]).not.toMatch(/https?:\/\//);
    const kind = copyPage("service-music-production")?.fields.find((f) => f.key === "labelUrl")?.kind;
    expect(kind).toBe("url");
  });

  it("adds no em dashes to client-facing defaults this round", () => {
    const checks: Array<[string, string]> = [
      ["contact", "heading"],
      ["service-music-production", "labelHeading"],
      ["service-music-production", "labelNote"],
      ["service-music-production", "labelCtaLabel"],
      ["service-music-production", "imageAlt"],
    ];
    for (const [page, key] of checks) {
      expect(copyDefaults(page)[key], `${page}.${key}`).not.toContain("—");
    }
  });
});

describe("release labels (N04-35)", () => {
  it("calls a collaboration a Collaboration, never a band project", () => {
    expect(relationshipPublicLabels.COLLABORATION_RELEASE).toBe("Collaboration");
    for (const label of Object.values(relationshipPublicLabels)) {
      expect(label.toLowerCase()).not.toContain("band project");
    }
  });
});
