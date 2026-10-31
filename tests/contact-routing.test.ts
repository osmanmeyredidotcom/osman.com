import { describe, expect, it } from "vitest";
import {
  contactBody,
  contactSubject,
  recipientsFor,
} from "@/server/services/contactDelivery";
import type { ContactInput } from "@/lib/validation/schemas";

/**
 * Precision pack 05 §27 — the routing matrix, verified for every topic.
 * Routing is backend-only, fixed, and never influenced by the "Who are you?"
 * answer.
 */
describe("contact routing table (pack 05 §5)", () => {
  it("Concerts & Live Performances → bookings@", () => {
    expect(recipientsFor("CONCERTS_LIVE")).toEqual(["bookings@osmanmeyredi.com"]);
  });
  it("Live Piano for Events → bookings@", () => {
    expect(recipientsFor("LIVE_PIANO")).toEqual(["bookings@osmanmeyredi.com"]);
  });
  it("Music Production → osman@ AND jolene@", () => {
    expect(recipientsFor("MUSIC_PRODUCTION")).toEqual([
      "osman@osmanmeyredi.com",
      "jolene@osmanmeyredi.com",
    ]);
  });
  it("Original Tracks → osman@ AND jolene@", () => {
    expect(recipientsFor("ORIGINAL_TRACKS")).toEqual([
      "osman@osmanmeyredi.com",
      "jolene@osmanmeyredi.com",
    ]);
  });
  it("Collaboration → osman@ AND jolene@", () => {
    expect(recipientsFor("COLLABORATION")).toEqual([
      "osman@osmanmeyredi.com",
      "jolene@osmanmeyredi.com",
    ]);
  });
  it("General → info@", () => {
    expect(recipientsFor("GENERAL")).toEqual(["info@osmanmeyredi.com"]);
  });
  it("Something Else → info@", () => {
    expect(recipientsFor("SOMETHING_ELSE")).toEqual(["info@osmanmeyredi.com"]);
  });
});

const input: ContactInput = {
  topic: "MUSIC_PRODUCTION",
  role: "FELLOW_MUSICIAN",
  name: "Jane Smith",
  email: "jane@example.com",
  message: "I have a demo that needs finishing.",
  pageUrl: "https://osmanmeyredi.com/services/music-production",
  website: "",
};

describe("notification formatting (pack 05 §14/§15)", () => {
  it("uses the predictable internal subject", () => {
    expect(contactSubject(input)).toBe("[Osman Website] Music Production · Jane Smith");
  });

  it("strips line breaks from names so user values never become raw headers", () => {
    expect(contactSubject({ topic: "GENERAL", name: "Bad\r\nActor" })).toBe(
      "[Osman Website] General · Bad Actor"
    );
  });

  it("includes category, role, name, email, Amsterdam timestamp, page and message", () => {
    const body = contactBody(input, new Date("2026-09-08T12:22:00Z"));
    expect(body).toContain("Category: Music Production");
    expect(body).toContain("Visitor type: Fellow musician");
    expect(body).toContain("Name: Jane Smith");
    expect(body).toContain("Email: jane@example.com");
    expect(body).toContain("Europe/Amsterdam");
    expect(body).toContain("Page: https://osmanmeyredi.com/services/music-production");
    expect(body).toContain("I have a demo that needs finishing.");
  });

  it("marks an absent role as Not specified — role is context, never routing", () => {
    const body = contactBody({ ...input, role: null });
    expect(body).toContain("Visitor type: Not specified");
  });
});
