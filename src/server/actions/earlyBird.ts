"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { earlyBirdInput, type EarlyBirdInterest } from "@/lib/validation/schemas";
import { rateLimit } from "@/lib/rateLimit";
import { deliverInquiry } from "@/server/services/contactDelivery";

export type EarlyBirdState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<string, string[]>>;
};

const INTEREST_LABELS: Record<EarlyBirdInterest, string> = {
  VIP: "VIP tickets",
  REGULAR: "Regular tickets",
  UNDECIDED: "Not sure yet",
};

/**
 * June’s Night early bird registration (2-11). Rides on the contact
 * delivery pipeline (Resend in production, the local JSON log in demo mode)
 * under its own subject, so every registration lands in one inbox with the
 * same "[Osman Website]" prefix. Same honeypot and rate limit as the
 * contact form; field errors come back without clearing what was typed.
 */
export async function registerEarlyBird(
  _prev: EarlyBirdState,
  formData: FormData
): Promise<EarlyBirdState> {
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (!rateLimit(`earlybird:${ip}`, 5, 10 * 60 * 1000)) {
    return {
      ok: false,
      message: "You've registered a few times in quick succession. Please wait ten minutes and try again.",
    };
  }

  const parsed = earlyBirdInput.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    interest: formData.get("interest") ?? "",
    pageUrl: (formData.get("pageUrl") ?? "").toString().slice(0, 2000),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields below.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { name, email, interest, pageUrl } = parsed.data;
  const message = [
    "Early bird registration for June’s Night (Friday 2 June 2028, Amsterdam).",
    `Ticket interest: ${interest ? INTEREST_LABELS[interest] : "Not given"}`,
  ].join("\n");

  try {
    await deliverInquiry({
      topic: "JUNES_NIGHT",
      role: "FAN_GENERAL_PUBLIC",
      name,
      email,
      message,
      pageUrl,
      website: "",
    });
  } catch {
    return {
      ok: false,
      message: "Something went wrong while registering. Your details are still here. Please try again.",
    };
  }
  return { ok: true };
}
