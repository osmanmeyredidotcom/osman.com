"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { registerEarlyBird, type EarlyBirdState } from "@/server/actions/earlyBird";
import { trackEvent } from "@/lib/analytics";

const INTERESTS: Array<{ value: string; label: string }> = [
  { value: "VIP", label: "VIP" },
  { value: "REGULAR", label: "Regular" },
  { value: "UNDECIDED", label: "Not sure yet" },
];

const initialState: EarlyBirdState = { ok: false };

/**
 * June’s Night early bird form (2-11): name, email and an optional ticket
 * interest. Same behaviour as the contact form: real radio pills that clear
 * on a second click, typed text survives any error (uncontrolled inputs,
 * submit through a transition), focus moves to the status after sending,
 * and a honeypot instead of a captcha.
 */
export function EarlyBirdForm({
  heading,
  note,
  success,
}: {
  heading: string;
  /** Rendered on the server from the Studio copy (links allowed). */
  note: ReactNode;
  success: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(registerEarlyBird, initialState);
  const [interest, setInterest] = useState("");
  const pathname = usePathname();
  const statusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (state.ok) trackEvent("early_bird_register", { concert: "junes-night" });
    if (state.ok || state.message) statusRef.current?.focus();
  }, [state]);

  const fieldError = (name: string): string | undefined => state.errors?.[name]?.[0];
  const labelClass = "mb-1.5 block text-sm font-medium text-ink";
  const inputClass =
    "w-full border border-line-dark bg-transparent px-3.5 py-2.5 text-ink placeholder:text-ink-faint focus:border-ink focus:outline-2 focus:outline-offset-2 focus:outline-accent";

  if (state.ok) {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="jn-frame jn-panel">
        <p className="eyebrow jn-eyebrow">{heading}</p>
        <div className="font-display mt-4 text-2xl leading-snug">{success}</div>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };

  return (
    <form onSubmit={onSubmit} noValidate className="jn-frame jn-panel space-y-8">
      <h2 className="eyebrow jn-eyebrow">{heading}</h2>
      <input type="hidden" name="pageUrl" value={pathname ?? ""} readOnly />
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="eb-website">Website</label>
        <input id="eb-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
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

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="eb-name" className={labelClass}>
            Name
          </label>
          <input
            id="eb-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={fieldError("name") ? true : undefined}
            aria-describedby={fieldError("name") ? "eb-name-error" : undefined}
            className={inputClass}
          />
          {fieldError("name") && (
            <p id="eb-name-error" className="mt-1.5 text-sm text-danger" role="alert">
              {fieldError("name")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="eb-email" className={labelClass}>
            Email
          </label>
          <input
            id="eb-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@email.com"
            aria-invalid={fieldError("email") ? true : undefined}
            aria-describedby={fieldError("email") ? "eb-email-error" : undefined}
            className={inputClass}
          />
          {fieldError("email") && (
            <p id="eb-email-error" className="mt-1.5 text-sm text-danger" role="alert">
              {fieldError("email")}
            </p>
          )}
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-ink">
          Tickets you&rsquo;re interested in{" "}
          <span className="font-normal text-ink-faint">(optional)</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {INTERESTS.map((o) => {
            const selected = interest === o.value;
            return (
              <label
                key={o.value}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent ${
                  selected
                    ? "border-accent-strong text-accent-strong"
                    : "border-line-dark text-ink-soft hover:border-ink-faint hover:text-ink"
                }`}
              >
                <input
                  type="radio"
                  name="interest"
                  value={o.value}
                  checked={selected}
                  onChange={() => setInterest(o.value)}
                  onClick={() => {
                    if (selected) setInterest("");
                  }}
                  className="sr-only"
                />
                {o.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <button type="submit" disabled={pending} className="btn-pill" data-cursor="SEND">
          {pending ? "Registering…" : "Register"}
        </button>
        {pending && (
          <p className="mt-2 text-sm text-ink-faint" role="status">
            Registering you for early bird access…
          </p>
        )}
        <div className="mt-4 max-w-md text-xs leading-relaxed text-ink-faint">{note}</div>
      </div>
    </form>
  );
}
