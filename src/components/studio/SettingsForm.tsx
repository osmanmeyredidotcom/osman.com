"use client";

import { useActionState, useState } from "react";
import type { ShopMode, SiteSettings } from "@/lib/types";
import { saveSettingsAction } from "@/server/actions/settings";
import { initialActionState } from "./actionState";
import {
  FormError,
  SavedNotice,
  TextField,
  TextareaField,
  primaryButtonClass,
} from "./fields";

const SHOP_MODES: Array<{ value: ShopMode; title: string; help: string }> = [
  {
    value: "concept",
    title: "Concepts only",
    help: "Show shop ideas without any checkout.",
  },
  {
    value: "external",
    title: "Link out to external shop",
    help: "Buttons send visitors to a shop hosted elsewhere.",
  },
  {
    value: "storefront",
    title: "Integrated storefront (advanced)",
    help: "Sell directly on the site. Needs extra setup.",
  },
];

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(saveSettingsAction, initialActionState);

  const v = (name: string, fallback?: string | null): string | undefined =>
    state.values?.[name] ?? fallback ?? undefined;

  const [shopMode, setShopMode] = useState<ShopMode>(() => {
    const submitted = state.values?.shopMode;
    if (submitted === "concept" || submitted === "external" || submitted === "storefront") {
      return submitted;
    }
    return settings.shopMode;
  });

  const shopUrlValue = v("shopUrl", settings.shopUrl);

  return (
    <div className="max-w-xl">
      <form action={formAction} className="space-y-6">
        <FormError errors={state.errors} />
        <SavedNotice show={state.ok} />

        <TextareaField
          label="Hero tagline"
          name="heroTagline"
          rows={3}
          help="The first line visitors read on the homepage."
          defaultValue={v("heroTagline", settings.heroTagline)}
          errors={state.errors?.heroTagline}
        />

        <TextareaField
          label="Announcement"
          name="announcement"
          optional
          rows={2}
          help="Shown as a banner on the homepage. Leave empty to hide."
          defaultValue={v("announcement", settings.announcement)}
          errors={state.errors?.announcement}
        />

        <TextField
          label="Contact email"
          name="contactEmail"
          type="email"
          help="Where enquiries from the contact form arrive."
          defaultValue={v("contactEmail", settings.contactEmail)}
          errors={state.errors?.contactEmail}
        />

        <fieldset className="space-y-5 rounded-md border border-line p-4">
          <legend className="px-1 text-sm font-medium text-ink">Social links</legend>
          <TextField
            label="Instagram"
            name="instagramUrl"
            type="url"
            optional
            defaultValue={v("instagramUrl", settings.instagramUrl)}
            errors={state.errors?.instagramUrl}
          />
          <TextField
            label="YouTube"
            name="youtubeUrl"
            type="url"
            optional
            defaultValue={v("youtubeUrl", settings.youtubeUrl)}
            errors={state.errors?.youtubeUrl}
          />
          <TextField
            label="TikTok"
            name="tiktokUrl"
            type="url"
            optional
            defaultValue={v("tiktokUrl", settings.tiktokUrl)}
            errors={state.errors?.tiktokUrl}
          />

          <TextField
            label="LinkedIn"
            name="linkedinUrl"
            type="url"
            optional
            defaultValue={v("linkedinUrl", settings.linkedinUrl)}
            errors={state.errors?.linkedinUrl}
          />
          <TextField
            label="Facebook"
            name="facebookUrl"
            type="url"
            optional
            defaultValue={v("facebookUrl", settings.facebookUrl)}
            errors={state.errors?.facebookUrl}
          />
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-ink">Shop mode</legend>
          <div className="mt-2 space-y-3">
            {SHOP_MODES.map((mode) => (
              <label
                key={mode.value}
                className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                  shopMode === mode.value
                    ? "border-accent bg-accent/5"
                    : "border-line hover:border-ink-faint"
                }`}
              >
                <input
                  type="radio"
                  name="shopMode"
                  value={mode.value}
                  checked={shopMode === mode.value}
                  onChange={() => setShopMode(mode.value)}
                  className="mt-0.5 h-4 w-4 accent-(--color-accent)"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink">{mode.title}</span>
                  <span className="mt-0.5 block text-xs text-ink-soft">{mode.help}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {shopMode === "external" ? (
          <TextField
            label="Shop address"
            name="shopUrl"
            type="url"
            help="The full link to the external shop."
            defaultValue={shopUrlValue}
            errors={state.errors?.shopUrl}
          />
        ) : (
          // Keep the stored address so switching modes never wipes it.
          <input type="hidden" name="shopUrl" value={shopUrlValue ?? ""} />
        )}

        <div className="border-t border-line pt-6">
          <button type="submit" disabled={pending} className={primaryButtonClass}>
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
