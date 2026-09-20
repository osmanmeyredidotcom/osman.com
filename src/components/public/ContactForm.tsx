"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { submitContact, type ContactFormState } from "@/server/actions/contact";
import type { ContactTopic } from "@/lib/validation/schemas";

/**
 * Contact form — precision pack 04 + supplied mockup, restyled into the dark
 * system ("Ignore colors — look & feel according to the website").
 *
 * Structure follows the mockup exactly: What's this about? (7 editorial
 * tiles) → Who are you? (8 optional pills) → Name → Email → Message →
 * "Send to Osman Meyredi". Topic and role are real radio groups (keyboard
 * and screen-reader operable); selection never depends on colour alone —
 * the selected tile carries a filled marker and border change. Typed content
 * survives failure: inputs are uncontrolled and never reset on error, and
 * the server action returns field errors without clearing anything.
 */
const TOPICS: Array<{ value: ContactTopic; title: string; support?: string }> = [
  {
    value: "CONCERTS_LIVE",
    title: "Concerts & live performances",
    support: "Festivals · venues · events",
  },
  {
    value: "LIVE_PIANO",
    title: "Live piano for events",
    support: "Corporate · receptions · private events",
  },
  {
    value: "MUSIC_PRODUCTION",
    title: "Music production",
    support: "Production · arrangement · instrumentation · recording · mixing · mastering",
  },
  {
    // Round 3: the service's new public name (value stays ORIGINAL_TRACKS
    // so existing submissions and routing keep working).
    value: "ORIGINAL_TRACKS",
    title: "Original scores & custom music",
    support: "Film · TV · documentary · events · online · series · adverts · radio",
  },
  { value: "COLLABORATION", title: "Collaboration" },
  { value: "GENERAL", title: "General" },
  { value: "SOMETHING_ELSE", title: "Something else" },
];

const ROLES: Array<{ value: string; label: string }> = [
  { value: "BOOKING_AGENT_PROMOTER", label: "Booking agent / promoter" },
  { value: "FESTIVAL_EVENT_ORGANISER", label: "Festival / event organiser" },
  { value: "VENUE_MANAGER", label: "Venue manager" },
  { value: "BRAND_CORPORATE", label: "Brand / corporate" },
  { value: "MEDIA_JOURNALIST", label: "Media / journalist" },
  { value: "FELLOW_MUSICIAN", label: "Fellow musician" },
  { value: "FAN_GENERAL_PUBLIC", label: "Fan / general public" },
  { value: "SOMEONE_ELSE", label: "Someone else" },
];

const initialState: ContactFormState = { ok: false };

export function ContactForm({ initialTopic }: { initialTopic?: string }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const [topic, setTopic] = useState<string>(
    TOPICS.some((t) => t.value === initialTopic) ? (initialTopic as string) : ""
  );
  const [role, setRole] = useState<string>("");
  const pathname = usePathname();
  const statusRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Success renders the confirmation panel (the form unmounts, so nothing
  // needs resetting); errors keep everything exactly as typed.
  useEffect(() => {
    if (state.ok || state.message) statusRef.current?.focus();
  }, [state]);

  const fieldError = (name: string): string | undefined => state.errors?.[name]?.[0];

  const labelClass = "mb-1.5 block text-sm font-medium text-ink";
  const inputClass =
    "w-full border border-line-dark bg-transparent px-3.5 py-2.5 text-ink placeholder:text-ink-faint focus:border-ink focus:outline-2 focus:outline-offset-2 focus:outline-accent";

  if (state.ok) {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="border border-line p-6"
      >
        <p className="font-display text-xl">Thanks, your message has been sent.</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          It has gone straight to the right inbox. Replies come from Osman or his team.
        </p>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Submitting through the transition (instead of the native form action)
    // keeps React from resetting the fields — a failed send must leave the
    // visitor's text exactly where they typed it.
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-9" noValidate>
      {/* Context for triage (pack 05 §20) — never used for routing. */}
      <input type="hidden" name="pageUrl" value={pathname ?? ""} readOnly />
      {/* Honeypot: visually hidden, still reachable by bots. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.message && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="border border-danger/50 bg-danger/5 p-4 text-sm leading-relaxed text-ink"
        >
          {state.message}
        </div>
      )}

      {/* 1 — What's this about? */}
      <fieldset>
        <legend className="font-display text-xl">What&rsquo;s this about?</legend>
        {fieldError("topic") && (
          <p className="mt-2 text-sm text-danger" role="alert">
            {fieldError("topic")}
          </p>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => {
            const selected = topic === t.value;
            return (
              <label
                key={t.value}
                className={`cursor-pointer border p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent ${
                  selected
                    ? "border-accent-strong bg-accent/5"
                    : "border-line-dark hover:border-ink-faint"
                }`}
              >
                <input
                  type="radio"
                  name="topic"
                  value={t.value}
                  checked={selected}
                  onChange={() => setTopic(t.value)}
                  className="sr-only"
                />
                <span className="flex items-start justify-between gap-3">
                  <span className="block text-sm font-semibold text-ink">{t.title}</span>
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full border transition-colors ${
                      selected ? "border-accent-strong bg-accent-strong" : "border-line-dark"
                    }`}
                  />
                </span>
                {t.support && (
                  <span className="mt-1.5 block text-xs leading-relaxed text-ink-soft">
                    {t.support}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* 2 — Who are you? (optional context, never routing) */}
      <fieldset>
        <legend className="font-display text-xl">
          Who are you?{" "}
          <span className="text-sm font-normal text-ink-faint">(optional)</span>
        </legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {ROLES.map((r) => {
            const selected = role === r.value;
            return (
              <label
                key={r.value}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent ${
                  selected
                    ? "border-accent-strong text-accent-strong"
                    : "border-line-dark text-ink-soft hover:border-ink-faint hover:text-ink"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  checked={selected}
                  onChange={() => setRole(r.value)}
                  onClick={() => {
                    // Second click on the same pill clears it — the field is optional.
                    if (selected) setRole("");
                  }}
                  className="sr-only"
                />
                {r.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* 3/4 — Name + Email */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={fieldError("name") ? true : undefined}
            aria-describedby={fieldError("name") ? "contact-name-error" : undefined}
            className={inputClass}
          />
          {fieldError("name") && (
            <p id="contact-name-error" className="mt-1.5 text-sm text-danger" role="alert">
              {fieldError("name")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@email.com"
            aria-invalid={fieldError("email") ? true : undefined}
            aria-describedby={fieldError("email") ? "contact-email-error" : undefined}
            className={inputClass}
          />
          {fieldError("email") && (
            <p id="contact-email-error" className="mt-1.5 text-sm text-danger" role="alert">
              {fieldError("email")}
            </p>
          )}
        </div>
      </div>

      {/* 5 — Message */}
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder="Booking a show, asking a question, or just saying hi. Tell us here."
          aria-invalid={fieldError("message") ? true : undefined}
          aria-describedby={fieldError("message") ? "contact-message-error" : undefined}
          className={inputClass}
        />
        {fieldError("message") && (
          <p id="contact-message-error" className="mt-1.5 text-sm text-danger" role="alert">
            {fieldError("message")}
          </p>
        )}
        {/* Round 2 slide 19 (Aditya 12-09-2026): the language line lives
            under the message field too. */}
        <p className="mt-2 text-xs text-ink-faint">Write in Italian, English or Dutch.</p>
      </div>

      {/* 6 — Submit */}
      <div>
        <button type="submit" disabled={pending} className="btn-pill" data-cursor="SEND">
          {pending ? "Sending…" : "Send to Osman Meyredi"}
        </button>
        {pending && (
          <p className="mt-2 text-sm text-ink-faint" role="status">
            Sending your message…
          </p>
        )}
      </div>
    </form>
  );
}
