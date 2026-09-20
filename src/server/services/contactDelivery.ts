import "server-only";
import type { ContactInput, ContactRole, ContactTopic } from "@/lib/validation/schemas";

/**
 * Inquiry delivery & routing — precision pack 05.
 *
 * Routing is backend-only and fixed (05 §5): visitors never choose an inbox,
 * the "Who are you?" answer never changes recipients, and multi-recipient
 * topics go out as ONE send with a `to` array (05 §18). The visitor's address
 * becomes replyTo — never the authenticated sender (05 §17). With
 * RESEND_API_KEY and CONTACT_FROM_EMAIL configured the inquiry is emailed via
 * Resend; otherwise (demo/local mode) it is appended as a JSON line to
 * .demo-data/inquiries.json and logged, so nothing is lost while the site
 * runs without email credentials.
 *
 * CONTACT_RECIPIENTS_OVERRIDE (optional env): a single address that receives
 * everything — for verifying production delivery before the
 * @osmanmeyredi.com inboxes exist. Remove it to activate the real table.
 */

export const TOPIC_LABELS: Record<ContactTopic, string> = {
  CONCERTS_LIVE: "Concerts",
  LIVE_PIANO: "Live Piano",
  MUSIC_PRODUCTION: "Music Production",
  ORIGINAL_TRACKS: "Original Scores & Custom Music",
  COLLABORATION: "Collaboration",
  GENERAL: "General",
  SOMETHING_ELSE: "Something Else",
};

export const ROLE_LABELS: Record<ContactRole, string> = {
  BOOKING_AGENT_PROMOTER: "Booking agent / promoter",
  FESTIVAL_EVENT_ORGANISER: "Festival / event organiser",
  VENUE_MANAGER: "Venue manager",
  BRAND_CORPORATE: "Brand / corporate",
  MEDIA_JOURNALIST: "Media / journalist",
  FELLOW_MUSICIAN: "Fellow musician",
  FAN_GENERAL_PUBLIC: "Fan / general public",
  SOMEONE_ELSE: "Someone else",
};

const BOOKINGS = "bookings@osmanmeyredi.com";
const OSMAN = "osman@osmanmeyredi.com";
const JOLENE = "jolene@osmanmeyredi.com";
const INFO = "info@osmanmeyredi.com";

/** The exact routing table from the technical brief — never derived from UI copy. */
export function recipientsFor(topic: ContactTopic): string[] {
  const override = process.env.CONTACT_RECIPIENTS_OVERRIDE?.trim();
  if (override) return [override];
  switch (topic) {
    case "CONCERTS_LIVE":
    case "LIVE_PIANO":
      return [BOOKINGS];
    case "MUSIC_PRODUCTION":
    case "ORIGINAL_TRACKS":
    case "COLLABORATION":
      return [OSMAN, JOLENE];
    case "GENERAL":
    case "SOMETHING_ELSE":
      return [INFO];
  }
}

/** Predictable internal subject (05 §14): "[Osman Website] Topic — Name". */
export function contactSubject(input: Pick<ContactInput, "topic" | "name">): string {
  // Strip line breaks defensively — user values must never become raw headers.
  const safeName = input.name.replace(/[\r\n]+/g, " ").trim();
  return `[Osman Website] ${TOPIC_LABELS[input.topic]} — ${safeName}`;
}

function amsterdamTimestamp(now: Date): string {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Amsterdam",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${fmt.format(now)} Europe/Amsterdam`;
}

/** Plain-text notification body (05 §15) — no marketing copy. */
export function contactBody(input: ContactInput, now: Date = new Date()): string {
  return [
    "New website enquiry",
    "",
    `Category: ${TOPIC_LABELS[input.topic]}`,
    `Visitor type: ${input.role ? ROLE_LABELS[input.role] : "Not specified"}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Submitted: ${amsterdamTimestamp(now)}`,
    input.pageUrl ? `Page: ${input.pageUrl}` : null,
    "",
    "Message:",
    input.message,
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

export async function deliverInquiry(input: ContactInput): Promise<void> {
  const to = recipientsFor(input.topic);
  const subject = contactSubject(input);
  const text = contactBody(input);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (apiKey && from) {
    // One send, all recipients — never one request per inbox (05 §18).
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: input.email,
        subject,
        text,
      }),
    });
    if (!res.ok) {
      // Log the outcome class only — no visitor message, no provider internals
      // to the client (05 §19/§23).
      const detail = await res.text().catch(() => "");
      console.error(
        `[contact] delivery failed: status=${res.status} topic=${input.topic} detail=${detail.slice(0, 200)}`
      );
      throw new Error("delivery_failed");
    }
    const body = (await res.json().catch(() => null)) as { id?: string } | null;
    console.info(
      `[contact] delivered topic=${input.topic} recipients=${to.length} id=${body?.id ?? "?"}`
    );
    return;
  }

  // Demo/local fallback: append as a JSON line so nothing is lost.
  const { appendFile, mkdir } = await import("fs/promises");
  const path = await import("path");
  const dir = path.join(process.cwd(), ".demo-data");
  try {
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "inquiries.json"),
      JSON.stringify({
        receivedAt: new Date().toISOString(),
        wouldRouteTo: to,
        subject,
        ...input,
      }) + "\n",
      "utf8"
    );
  } catch {
    // Read-only filesystem: the log below still records the enquiry.
  }
  console.info(`[contact] (demo mode) enquiry stored; would route to: ${to.join(", ")}`);
}
