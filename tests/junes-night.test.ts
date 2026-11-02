/**
 * June’s Night (VP, 2-11-2026): the 2 June 2028 concert highlight, its
 * early bird registration and its automatic end.
 */
import { describe, expect, it } from "vitest";
import { JUNES_NIGHT, junesNightIcsDataUrl, junesNightIsUpcoming } from "@/data/junes-night";
import { copyDefaults } from "@/data/page-copy";
import { earlyBirdInput } from "@/lib/validation/schemas";
import { junesNightJsonLd } from "@/lib/seo";
import { contactSubject, recipientsFor } from "@/server/services/contactDelivery";

const copy = copyDefaults("junes-night");

describe("June’s Night facts", () => {
  it("is on 2 June 2028 (not 2027) in Amsterdam", () => {
    expect(JUNES_NIGHT.date).toBe("2028-06-02");
    expect(JUNES_NIGHT.city).toBe("Amsterdam");
    expect(copy["date"]).toContain("2 June 2028");
    expect(new Date(`${JUNES_NIGHT.date}T12:00:00Z`).getUTCDay()).toBe(5); // a Friday
  });

  it("shows until the night is over in Amsterdam, then disappears", () => {
    expect(junesNightIsUpcoming(new Date("2026-11-02T12:00:00Z"))).toBe(true);
    expect(junesNightIsUpcoming(new Date("2027-06-02T12:00:00Z"))).toBe(true);
    // 23:59 Amsterdam summer time is 21:59 UTC.
    expect(junesNightIsUpcoming(new Date("2028-06-02T21:59:00Z"))).toBe(true);
    expect(junesNightIsUpcoming(new Date("2028-06-02T22:00:00Z"))).toBe(false);
  });

  it("saves an all-day calendar entry on the right day", () => {
    const ics = decodeURIComponent(junesNightIcsDataUrl("June’s Night", "A not so ordinary concert"));
    expect(ics).toContain("DTSTART;VALUE=DATE:20280602");
    expect(ics).toContain("DTEND;VALUE=DATE:20280603");
    expect(ics).toContain("SUMMARY:June’s Night · Osman Meyredi");
    expect(ics).toContain("/shows/junes-night");
  });

  it("marks the event up without inventing a time, venue or offer", () => {
    const data = junesNightJsonLd({ title: "June’s Night", description: "x" });
    expect(data["@type"]).toBe("MusicEvent");
    expect(data.startDate).toBe("2028-06-02");
    expect(data).not.toHaveProperty("offers");
    expect((data.location as { address: { addressLocality: string } }).address.addressLocality).toBe(
      "Amsterdam"
    );
  });
});

describe("June’s Night copy", () => {
  it("follows the client copy rules", () => {
    for (const [key, value] of Object.entries(copy)) {
      expect(value, key).not.toContain("—");
    }
    expect(copy["title"]).toBe("June’s Night");
    expect(copy["lead"]).toContain("Osman Meyredi");
    expect(copy["tickets"]).toContain("2027");
  });
});

describe("early bird registration", () => {
  it("routes to the general inbox under its own subject", () => {
    expect(recipientsFor("JUNES_NIGHT")).toEqual(["info@osmanmeyredi.com"]);
    expect(contactSubject({ topic: "JUNES_NIGHT", name: "Ann Visser" })).toBe(
      "[Osman Website] June’s Night early bird · Ann Visser"
    );
  });

  it("needs a name and a valid email; the ticket interest is optional", () => {
    const ok = earlyBirdInput.safeParse({ name: "Ann", email: "ann@example.com", interest: "" });
    expect(ok.success).toBe(true);
    expect(ok.success && ok.data.interest).toBe(null);
    const vip = earlyBirdInput.safeParse({ name: "Ann", email: "ann@example.com", interest: "VIP" });
    expect(vip.success && vip.data.interest).toBe("VIP");
    expect(earlyBirdInput.safeParse({ name: "Ann", email: "not-an-email" }).success).toBe(false);
    expect(earlyBirdInput.safeParse({ name: "A", email: "ann@example.com" }).success).toBe(false);
    expect(
      earlyBirdInput.safeParse({ name: "Ann", email: "ann@example.com", interest: "BACKSTAGE" }).success
    ).toBe(false);
  });
});
