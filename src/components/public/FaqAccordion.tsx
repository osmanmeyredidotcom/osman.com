"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  linkUrl: string | null;
  linkLabel: string | null;
};

/**
 * Contact page Q&A — 4-11 feedback (N04-43, "let's not have this answer
 * right up there. You can have a plus sign where anyone can just click on
 * that and you can see the answer"): one column of questions, each with a
 * + that turns into − when open; the answers start collapsed.
 *
 * Built on the native <details> element, like Read more: the approved
 * answers stay in the served page (the FAQPage structured data still
 * mirrors exactly what is here), the question is a real disclosure button
 * for keyboard and screen readers, and without scripts or modern CSS it
 * still opens and closes, only instantly. The open animates where
 * ::details-content is supported (globals.css, .faq-item); reduced motion
 * gets the instant toggle. Scripts only keep the hover label honest: MORE
 * on a closed question, LESS on an open one.
 */
export function FaqAccordion({ faqs }: { faqs: FaqEntry[] }) {
  return (
    <div className="border-b border-line">
      {faqs.map((faq) => (
        <FaqItem key={faq.id} faq={faq} />
      ))}
    </div>
  );
}

function FaqItem({ faq }: { faq: FaqEntry }) {
  const [open, setOpen] = useState(false);
  const summaryRef = useRef<HTMLElement | null>(null);

  // The custom cursor reads data-cursor on pointerover; when the label flips
  // under a resting pointer, nudge it to read it again (as the menu does).
  useEffect(() => {
    if (summaryRef.current?.matches(":hover")) {
      summaryRef.current.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    }
  }, [open]);

  return (
    <details
      className="faq-item border-t border-line"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary ref={summaryRef} className="faq-summary" data-cursor={open ? "LESS" : "MORE"}>
        <span className="font-display text-xl">{faq.question}</span>
        <span className="faq-glyph" aria-hidden="true" />
      </summary>
      <div className="faq-answer">
        <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
          {faq.answer}
          {faq.linkUrl && (
            <>
              {" "}
              <Link
                href={faq.linkUrl}
                className="u-link whitespace-nowrap text-ink hover:text-accent-strong"
              >
                {faq.linkLabel ?? "Read more"}
              </Link>
            </>
          )}
        </p>
      </div>
    </details>
  );
}
