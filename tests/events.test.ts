import { describe, expect, it } from "vitest";
import {
  agendaLink,
  eventCta,
  formatAgendaDate,
  formatEventDate,
  isPast,
  isUpcoming,
  pastPublished,
  publishWarnings,
  upcomingPublished,
} from "@/lib/events";
import type { EventRecord } from "@/lib/types";

function makeEvent(overrides: Partial<EventRecord> = {}): EventRecord {
  return {
    id: "e1",
    slug: "test-event",
    eventType: "TICKETED_CONCERT",
    title: "Test event",
    description: "",
    date: "2026-09-18",
    startTime: "20:30",
    endTime: null,
    venue: "Venue",
    address: null,
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: null,
    imageAlt: null,
    imageCredit: null,
    ticketUrl: "https://example.com/tickets",
    venueUrl: null,
    priceText: null,
    collaborators: null,
    ticketingType: null,
    ctaLabel: null,
    timezone: "Europe/Amsterdam",
    isDemo: false,
    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: "2026-08-01T00:00:00.000Z",
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("upcoming/past classification", () => {
  it("counts a future event as upcoming", () => {
    const now = new Date("2026-08-10T12:00:00Z");
    expect(isUpcoming(makeEvent({ date: "2026-09-18" }), now)).toBe(true);
  });

  it("keeps a same-day event without an end time upcoming until the venue-local day ends", () => {
    // 21:00 UTC on 18 Sep = 23:00 in Amsterdam (CEST) — still the event day.
    const now = new Date("2026-09-18T20:59:00Z");
    expect(isUpcoming(makeEvent({ date: "2026-09-18" }), now)).toBe(true);
    // 22:30 UTC = 00:30 on 19 Sep in Amsterdam — the day is over.
    const after = new Date("2026-09-18T22:30:00Z");
    expect(isPast(makeEvent({ date: "2026-09-18" }), after)).toBe(true);
  });

  it("moves an event to past right after its configured end time (pack 01 §5)", () => {
    const e = makeEvent({ date: "2026-09-18", startTime: "20:30", endTime: "22:30" });
    // 22:30 Amsterdam = 20:30 UTC in September (CEST)
    expect(isUpcoming(e, new Date("2026-09-18T20:29:00Z"))).toBe(true);
    expect(isPast(e, new Date("2026-09-18T20:31:00Z"))).toBe(true);
  });

  it("handles an end time past midnight as ending on the next day", () => {
    const e = makeEvent({ date: "2026-09-18", startTime: "22:00", endTime: "01:00" });
    // 23:30 UTC on the 18th = 01:30 Amsterdam on the 19th — wait, that is past 01:00.
    expect(isPast(e, new Date("2026-09-18T23:30:00Z"))).toBe(true);
    // 22:30 UTC = 00:30 Amsterdam on the 19th — still before the 01:00 end.
    expect(isUpcoming(e, new Date("2026-09-18T22:30:00Z"))).toBe(true);
  });

  it("falls back to Europe/Amsterdam when the stored timezone is invalid", () => {
    const e = makeEvent({ date: "2026-09-18", timezone: "Not/AZone" });
    expect(isUpcoming(e, new Date("2026-09-18T20:00:00Z"))).toBe(true);
  });

  it("excludes drafts and archived events from the public upcoming list", () => {
    const now = new Date("2026-08-10T12:00:00Z");
    const events = [
      makeEvent({ id: "a", status: "DRAFT" }),
      makeEvent({ id: "b", status: "ARCHIVED" }),
      makeEvent({ id: "c", status: "PUBLISHED" }),
    ];
    expect(upcomingPublished(events, now).map((e) => e.id)).toEqual(["c"]);
  });

  it("keeps cancelled events listed (clearly labelled) rather than hiding them", () => {
    const now = new Date("2026-08-10T12:00:00Z");
    const events = [makeEvent({ eventState: "CANCELLED" })];
    expect(upcomingPublished(events, now)).toHaveLength(1);
  });

  it("sorts upcoming soonest-first and past most-recent-first", () => {
    const now = new Date("2026-08-10T12:00:00Z");
    const events = [
      makeEvent({ id: "far", date: "2026-12-01" }),
      makeEvent({ id: "near", date: "2026-08-15" }),
      makeEvent({ id: "old", date: "2026-01-10" }),
      makeEvent({ id: "older", date: "2025-06-01" }),
    ];
    expect(upcomingPublished(events, now).map((e) => e.id)).toEqual(["near", "far"]);
    expect(pastPublished(events, now).map((e) => e.id)).toEqual(["old", "older"]);
  });
});

describe("event CTA rules", () => {
  it("shows Tickets for a scheduled ticketed concert with a link", () => {
    expect(eventCta(makeEvent())).toEqual({
      kind: "tickets",
      href: "https://example.com/tickets",
    });
  });

  it("NEVER shows a ticket CTA for a free gig, even if a ticketUrl sneaks in", () => {
    const cta = eventCta(
      makeEvent({ eventType: "FREE_GIG", ticketUrl: "https://example.com/wrong" })
    );
    expect(cta.kind).toBe("free");
  });

  it("free gig exposes the venue/details link", () => {
    const cta = eventCta(
      makeEvent({ eventType: "FREE_GIG", ticketUrl: null, venueUrl: "https://venue.example" })
    );
    expect(cta).toEqual({ kind: "free", detailsHref: "https://venue.example" });
  });

  it("sold out replaces the ticket CTA", () => {
    expect(eventCta(makeEvent({ eventState: "SOLD_OUT" })).kind).toBe("sold_out");
  });

  it("cancelled replaces the ticket CTA even when a ticket link exists", () => {
    expect(eventCta(makeEvent({ eventState: "CANCELLED" })).kind).toBe("cancelled");
  });

  it("ticketed concert without a link shows no CTA rather than a broken one", () => {
    expect(eventCta(makeEvent({ ticketUrl: null })).kind).toBe("none");
  });

  it("festival defaults to info-only and links out with READ semantics", () => {
    const e = makeEvent({
      eventType: "FESTIVAL",
      ticketUrl: null,
      venueUrl: "https://festival.example",
    });
    expect(eventCta(e)).toEqual({ kind: "info", href: "https://festival.example" });
    expect(agendaLink(e)).toEqual({
      href: "https://festival.example",
      external: true,
      // 22-10 correction (item 3): event-information links use the approved
      // READ label; the old OPEN deviation is gone.
      cursor: "READ",
      label: "Info",
    });
  });

  it("an explicit ticketingType overrides the event-type default", () => {
    const e = makeEvent({ eventType: "FREE_GIG", ticketingType: "TICKETED" });
    expect(eventCta(e).kind).toBe("tickets");
  });

  it("an event with no destination never implies clickability", () => {
    const e = makeEvent({ ticketingType: "NONE", ticketUrl: null, venueUrl: null });
    expect(eventCta(e).kind).toBe("none");
    expect(agendaLink(e)).toBeNull();
  });

  it("agenda link uses TICKETS/READ cursor labels per link type", () => {
    expect(agendaLink(makeEvent())?.cursor).toBe("TICKETS");
    const free = makeEvent({
      eventType: "FREE_GIG",
      ticketUrl: null,
      venueUrl: "https://venue.example",
    });
    expect(agendaLink(free)?.cursor).toBe("READ");
  });
});

describe("publish warnings", () => {
  it("warns when publishing a ticketed concert without a ticket link", () => {
    const w = publishWarnings({
      eventType: "TICKETED_CONCERT",
      ticketUrl: null,
      eventState: "SCHEDULED",
    });
    expect(w).toHaveLength(1);
  });

  it("does not warn for free gigs or linked concerts", () => {
    expect(
      publishWarnings({ eventType: "FREE_GIG", ticketUrl: null, eventState: "SCHEDULED" })
    ).toHaveLength(0);
    expect(
      publishWarnings({
        eventType: "TICKETED_CONCERT",
        ticketUrl: "https://example.com",
        eventState: "SCHEDULED",
      })
    ).toHaveLength(0);
  });
});

describe("publish warnings for demo records", () => {
  it("flags demo records so they are not published as real bookings", () => {
    const w = publishWarnings({
      eventType: "FREE_GIG",
      ticketUrl: null,
      eventState: "SCHEDULED",
      isDemo: true,
    });
    expect(w.some((x) => x.includes("demo"))).toBe(true);
  });
});

describe("date formatting", () => {
  it("formats a date without timezone drift", () => {
    const f = formatEventDate("2026-09-18");
    expect(f.day).toBe("18");
    expect(f.month).toBe("Sep");
    expect(f.year).toBe("2026");
    expect(f.weekday).toBe("Fri");
    expect(f.full).toBe("18 September 2026");
  });

  it("formats agenda dates as DD/MM/YYYY like the reference", () => {
    expect(formatAgendaDate("2027-07-10")).toBe("10/07/2027");
  });
});
