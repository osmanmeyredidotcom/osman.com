import type { EventRecord } from "@/lib/types";
import { eventCta, formatEventDate } from "@/lib/events";
import { eventIcsDataUrl } from "@/lib/calendar";
import { TrackedLink } from "./TrackedLink";

/**
 * "Remind me" — saves the show to the visitor's calendar (.ics). The
 * practical answer to the Xavier Rudd RSVP reference (Keynote slide 17):
 * a commitment device that needs no account and works on every platform.
 */
function RemindMe({ event }: { event: EventRecord }) {
  return (
    <a
      href={eventIcsDataUrl(event)}
      download={`osman-meyredi-${event.slug}.ics`}
      className="u-link text-sm text-ink-soft hover:text-accent-strong"
      aria-label={`Add ${event.title} to your calendar`}
      data-cursor="SAVE"
    >
      Remind me
    </a>
  );
}

/**
 * Typographic event listing — hairline rows, no cards.
 * The CTA is decided exclusively by eventCta() in @/lib/events, which guarantees:
 * free gigs never show a ticket button; sold-out and cancelled events never link
 * to a ticket page; cancelled rows stay visible, clearly struck through.
 *
 * variant="archive" renders muted rows with no CTA at all (past events).
 */
export function EventList({
  events,
  variant = "upcoming",
}: {
  events: EventRecord[];
  variant?: "upcoming" | "archive";
}) {
  return (
    <ul className="border-b border-line">
      {events.map((event) => (
        <EventRow key={event.id} event={event} variant={variant} />
      ))}
    </ul>
  );
}

export function EventRow({
  event,
  variant = "upcoming",
}: {
  event: EventRecord;
  variant?: "upcoming" | "archive";
}) {
  const cta = eventCta(event);
  const d = formatEventDate(event.date);
  const cancelled = cta.kind === "cancelled";
  const archive = variant === "archive";
  const struck = cancelled ? "line-through decoration-1 text-ink-faint" : "";

  return (
    <li className={`border-t border-line ${archive ? "opacity-60" : ""}`}>
      <div
        className={`flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-8 ${
          archive ? "" : "event-row"
        }`}
      >
        {/* Date block */}
        <div className="flex items-baseline gap-2 sm:w-24 sm:shrink-0 sm:flex-col sm:gap-0">
          <span
            className={`event-row-day font-display tabular text-3xl leading-none ${
              cancelled ? "text-ink-faint line-through decoration-1" : ""
            }`}
          >
            {d.day}
          </span>
          <span className="tabular text-sm text-ink-soft">
            {d.month} {d.year}
          </span>
        </div>

        {/* Event details */}
        <div className="min-w-0 flex-1">
          <h3 className={`event-row-title font-display text-xl leading-snug ${struck}`}>
            {event.title}
          </h3>
          <p className={`mt-1 text-sm text-ink-soft ${cancelled ? "line-through decoration-1" : ""}`}>
            {event.venue} · {event.city}, {event.country} · {event.startTime}
          </p>
          {(event.collaborators || event.priceText) && (
            <p className="mt-1 text-sm text-ink-faint">
              {[event.collaborators, event.priceText].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {/* CTA — only for upcoming rows */}
        {!archive && <EventRowCta event={event} />}
      </div>
    </li>
  );
}

function EventRowCta({ event }: { event: EventRecord }) {
  const cta = eventCta(event);

  switch (cta.kind) {
    case "tickets":
      return (
        <div className="flex shrink-0 flex-wrap items-center gap-4 sm:justify-end">
          <RemindMe event={event} />
          <TrackedLink
            href={cta.href}
            external
            event="ticket_click"
            eventProps={{ event: event.slug }}
            className="btn-pill btn-pill-sm"
            aria-label={`Tickets for ${event.title}`}
            data-cursor="TICKETS"
          >
            Tickets
          </TrackedLink>
        </div>
      );
    case "free":
      return (
        <div className="flex shrink-0 flex-wrap items-center gap-4 sm:justify-end">
          <span className="inline-block border border-ok px-3 py-1 text-xs font-medium tracking-wide text-ok uppercase">
            Free entry
          </span>
          {cta.detailsHref && (
            <TrackedLink
              href={cta.detailsHref}
              external
              event="gig_details_click"
              eventProps={{ event: event.slug }}
              className="u-link text-sm hover:text-accent-strong"
              aria-label={`Event info for ${event.title}`}
              data-cursor="INFO"
            >
              Event info
            </TrackedLink>
          )}
          <RemindMe event={event} />
        </div>
      );
    case "info":
      return (
        <div className="flex shrink-0 flex-wrap items-center gap-4 sm:justify-end">
          <TrackedLink
            href={cta.href}
            external
            event="gig_details_click"
            eventProps={{ event: event.slug }}
            className="u-link text-sm hover:text-accent-strong"
            aria-label={`Info for ${event.title}`}
            data-cursor="OPEN"
          >
            Event info
          </TrackedLink>
          <RemindMe event={event} />
        </div>
      );
    case "sold_out":
      return (
        <div className="shrink-0 sm:text-right">
          <span className="text-sm font-medium tracking-wide text-ink-faint uppercase">
            Sold out
          </span>
        </div>
      );
    case "cancelled":
      return (
        <div className="shrink-0 sm:text-right">
          <span className="text-sm font-medium tracking-wide text-danger uppercase">
            Cancelled
          </span>
        </div>
      );
    default:
      return null;
  }
}
