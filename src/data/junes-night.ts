import { isUpcoming } from "@/lib/events";
import { absoluteUrl } from "@/lib/site";

/**
 * June’s Night (VP, 2-11-2026): Osman Meyredi's most important solo
 * concert. Friday 2 June 2028 in Amsterdam, location still secret; VIP and
 * regular tickets go on sale in 2027; fans register now for early bird
 * access.
 *
 * Only the facts the site computes with live here (the date drives the
 * highlight's automatic end, the calendar file and the structured data).
 * Every visible word is Studio-editable under Pages → June’s Night
 * (data/page-copy.ts, page id "junes-night").
 */
export const JUNES_NIGHT = {
  slug: "junes-night",
  path: "/shows/junes-night",
  /** Venue-local date. 2028, not 2027 (VP). */
  date: "2028-06-02",
  timezone: "Europe/Amsterdam",
  city: "Amsterdam",
  country: "NL",
} as const;

/**
 * The highlight shows until the night itself is over (23:59 Amsterdam time
 * on 2 June 2028, the site's rule for events without an end time) and then
 * disappears everywhere on its own.
 */
export function junesNightIsUpcoming(now: Date = new Date()): boolean {
  return isUpcoming(
    { date: JUNES_NIGHT.date, startTime: "00:00", endTime: null, timezone: JUNES_NIGHT.timezone },
    now
  );
}

function icsEscape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * "Remind me" for June’s Night: an all-day calendar entry (the start time
 * isn't announced yet, so none is invented), with the page link so the
 * visitor can come back for early bird access.
 */
export function junesNightIcsDataUrl(title: string, tagline: string): string {
  const day = JUNES_NIGHT.date.replaceAll("-", "");
  const next = new Date(`${JUNES_NIGHT.date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const dayAfter = next.toISOString().slice(0, 10).replaceAll("-", "");
  const url = absoluteUrl(JUNES_NIGHT.path);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Osman Meyredi//Shows//EN",
    "BEGIN:VEVENT",
    `UID:${JUNES_NIGHT.slug}-${JUNES_NIGHT.date}@osmanmeyredi.com`,
    "DTSTAMP:20261102T120000Z",
    `DTSTART;VALUE=DATE:${day}`,
    `DTEND;VALUE=DATE:${dayAfter}`,
    `SUMMARY:${icsEscape(`${title} · Osman Meyredi`)}`,
    `LOCATION:${icsEscape(JUNES_NIGHT.city)}`,
    `DESCRIPTION:${icsEscape(`${tagline}. ${url}`)}`,
    `URL:${icsEscape(url)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
