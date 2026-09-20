import type { EventRecord, TicketingType } from "./types";

/**
 * Event date/classification logic. Deliberately dependency-free and pure so it
 * can be unit-tested and shared by public pages, the studio portal and repositories.
 *
 * Timezone strategy (precision pack 01 §5): event dates and times are stored
 * as venue-local values ("2026-09-18", "20:30") together with the venue's
 * IANA timezone (default Europe/Amsterdam). An event becomes "past" after its
 * configured end time in that zone; when no end time is set, the end of the
 * venue-local day is the fallback. Conversion to comparable UTC instants uses
 * the Intl API — no timezone library required.
 */

export const DEFAULT_EVENT_TIMEZONE = "Europe/Amsterdam";

function tzOffsetMs(utcInstant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(utcInstant)) parts[p.type] = p.value;
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - utcInstant.getTime();
}

/** Converts a venue-local date + time in an IANA zone to the actual UTC instant. */
export function venueLocalToUtc(date: string, time: string, timeZone: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const naive = Date.UTC(y, m - 1, d, hh, mm ?? 0, 0);
  let zone = timeZone;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
  } catch {
    zone = DEFAULT_EVENT_TIMEZONE;
  }
  // Two passes stabilise the offset around DST transitions.
  const first = new Date(naive - tzOffsetMs(new Date(naive), zone));
  return new Date(naive - tzOffsetMs(first, zone));
}

type EventTiming = Pick<EventRecord, "date" | "startTime" | "endTime"> &
  Partial<Pick<EventRecord, "timezone">>;

/** The UTC instant at which the event stops counting as upcoming. */
export function eventEndUtc(event: EventTiming): Date {
  const zone = event.timezone || DEFAULT_EVENT_TIMEZONE;
  if (event.endTime) {
    const end = venueLocalToUtc(event.date, event.endTime, zone);
    // Ends past midnight ("01:00" after a "21:00" start) → next day.
    if (event.endTime < event.startTime) end.setUTCDate(end.getUTCDate() + 1);
    return end;
  }
  return venueLocalToUtc(event.date, "23:59", zone);
}

export function isUpcoming(event: EventTiming, now: Date = new Date()): boolean {
  return eventEndUtc(event).getTime() >= now.getTime();
}

export function isPast(event: EventTiming, now: Date = new Date()): boolean {
  return !isUpcoming(event, now);
}

/** Published events, upcoming only, soonest first. Cancelled events stay listed (clearly labelled) so attendees see the change. */
export function upcomingPublished(events: EventRecord[], now: Date = new Date()): EventRecord[] {
  return events
    .filter((e) => e.status === "PUBLISHED" && isUpcoming(e, now))
    .sort(byDateAsc);
}

/** Published past events, most recent first (for archives). */
export function pastPublished(events: EventRecord[], now: Date = new Date()): EventRecord[] {
  return events
    .filter((e) => e.status === "PUBLISHED" && isPast(e, now))
    .sort((a, b) => byDateAsc(b, a));
}

export function byDateAsc(a: EventRecord, b: EventRecord): number {
  const d = a.date.localeCompare(b.date);
  if (d !== 0) return d;
  return a.startTime.localeCompare(b.startTime);
}

/* ---------------- Link semantics (pack 01 §7/§8) ---------------- */

/**
 * Explicit ticketing type wins; otherwise derived conservatively from the
 * event type so legacy records keep behaving exactly as before.
 */
export function effectiveTicketing(
  event: Pick<EventRecord, "eventType" | "ticketingType">
): TicketingType {
  if (event.ticketingType) return event.ticketingType;
  switch (event.eventType) {
    case "TICKETED_CONCERT":
      return "TICKETED";
    case "FREE_GIG":
      return "FREE";
    case "FESTIVAL":
      return "INFO_ONLY";
    default:
      return "NONE";
  }
}

export type EventCta =
  | { kind: "tickets"; href: string }
  | { kind: "free"; detailsHref: string | null }
  | { kind: "info"; href: string }
  | { kind: "sold_out" }
  | { kind: "cancelled" }
  | { kind: "none" };

/**
 * The single decision point for event links. Guarantees: free gigs never show
 * a ticket button; sold-out/cancelled never link out; nothing ever renders a
 * fake link when no destination exists.
 */
export function eventCta(event: EventRecord): EventCta {
  if (event.eventState === "CANCELLED") return { kind: "cancelled" };
  if (event.eventState === "SOLD_OUT") return { kind: "sold_out" };
  switch (effectiveTicketing(event)) {
    case "FREE":
      return { kind: "free", detailsHref: event.venueUrl ?? null };
    case "TICKETED":
      return event.ticketUrl ? { kind: "tickets", href: event.ticketUrl } : { kind: "none" };
    case "INFO_ONLY": {
      const href = event.ticketUrl ?? event.venueUrl;
      return href ? { kind: "info", href } : { kind: "none" };
    }
    default:
      return { kind: "none" };
  }
}

export type AgendaLink = {
  href: string;
  external: boolean;
  cursor: "TICKETS" | "DETAILS" | "OPEN";
  label: string;
};

/**
 * Agenda-row link resolution: the whole event block becomes one link when a
 * destination exists (pack 01 §7); the cursor label follows §8. Returns null
 * when the event must not imply clickability.
 */
export function agendaLink(event: EventRecord): AgendaLink | null {
  const cta = eventCta(event);
  switch (cta.kind) {
    case "tickets":
      return {
        href: cta.href,
        external: true,
        cursor: "TICKETS",
        label: event.ctaLabel ?? "Tickets",
      };
    case "free":
      return cta.detailsHref
        ? {
            href: cta.detailsHref,
            external: true,
            cursor: "DETAILS",
            label: event.ctaLabel ?? "Details",
          }
        : null;
    case "info":
      return {
        href: cta.href,
        external: true,
        cursor: "OPEN",
        label: event.ctaLabel ?? "Info",
      };
    default:
      return null;
  }
}

/** Publishing guard: warn when a ticketed event is about to go live without a ticket link. */
export function publishWarnings(
  event: Pick<EventRecord, "eventType" | "ticketUrl" | "eventState"> &
    Partial<Pick<EventRecord, "ticketingType" | "isDemo">>
): string[] {
  const warnings: string[] = [];
  const ticketing = effectiveTicketing({
    eventType: event.eventType,
    ticketingType: event.ticketingType ?? null,
  });
  if (ticketing === "TICKETED" && !event.ticketUrl && event.eventState === "SCHEDULED") {
    warnings.push(
      "This ticketed event has no ticket link yet. Visitors will see the date but no way to buy tickets."
    );
  }
  if (event.isDemo) {
    warnings.push(
      "This is a demo record. Replace or remove it before the public launch. Visitors must never see invented gigs as real bookings."
    );
  }
  return warnings;
}

/* ---------------- Formatting (display layer only) ---------------- */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/** "2026-09-18" → { day: "18", month: "Sep", year: "2026", weekday: "Fri" } */
export function formatEventDate(isoDate: string): {
  day: string;
  month: string;
  monthFull: string;
  year: string;
  weekday: string;
  full: string;
} {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  const month = MONTHS[m - 1] ?? "";
  const monthFull = MONTHS_FULL[m - 1] ?? "";
  return {
    day: String(d).padStart(2, "0"),
    month,
    monthFull,
    year: String(y),
    weekday: weekdays[dt.getUTCDay()],
    full: `${String(d).padStart(2, "0")} ${monthFull} ${y}`,
  };
}

/** Agenda display format, matching the reference: "18/10/2026". */
export function formatAgendaDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}
