"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { contactInput } from "@/lib/validation/schemas";
import { rateLimit } from "@/lib/rateLimit";
import { deliverInquiry } from "@/server/services/contactDelivery";

export type ContactFormState = {
  ok: boolean;
  /** General (non-field) message: rate limit, delivery failure, validation hint. */
  message?: string;
  /** Field-level errors keyed by input name. */
  errors?: Partial<Record<string, string[]>>;
};

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot: real visitors never see or fill this field. Pretend success so
  // bots get no signal, and deliver nothing.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return {
      ok: false,
      message:
        "You've sent a few messages in quick succession. Please wait ten minutes and try again, or email Osman directly.",
    };
  }

  // Oversized bodies are rejected before parsing (pack 05 §13).
  const rawMessage = formData.get("message");
  if (typeof rawMessage === "string" && rawMessage.length > 20000) {
    return { ok: false, message: "That message is too long to send." };
  }

  const parsed = contactInput.safeParse({
    topic: formData.get("topic") ?? "",
    role: formData.get("role") ?? "",
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
    pageUrl: (formData.get("pageUrl") ?? "").toString().slice(0, 2000),
    website: "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields below.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await deliverInquiry(parsed.data);
  } catch {
    return {
      ok: false,
      message:
        "Something went wrong while sending your message. Your text is still here. Please try again.",
    };
  }

  return { ok: true };
}
