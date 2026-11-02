import { getPageCopy } from "@/server/copy";
import { JUNES_NIGHT, junesNightIcsDataUrl, junesNightIsUpcoming } from "@/data/junes-night";
import { CopyText } from "@/components/public/CopyText";
import { TrackedLink } from "@/components/public/TrackedLink";

/**
 * June’s Night highlight (VP, 2-11-2026): the 2 June 2028 solo concert,
 * set apart from the regular date rows wherever upcoming shows appear.
 *
 * - "panel": homepage On stage soon, the Shows overview and Solo shows.
 *   Eyebrow, the name in display caps, the tagline, then date, place and
 *   tickets, the highlight text, the early bird pill and Remind me.
 * - "strip": one line for the pages where it is a pointer, not the topic
 *   (Collaboration gigs, the Concerts service page).
 *
 * Both sit in a frame with a red top rule and a soft red glow from the
 * top-right corner (the palette's two reds), so it reads as the one special
 * date without a new button style. The pill is the site's standard btn-pill
 * and goes to the June’s Night page with the early bird form. Nothing
 * renders once the night has passed. Every word is Studio-editable (Pages →
 * June’s Night).
 */
export async function JunesNightHighlight({
  variant = "panel",
  position,
  headingLevel = 3,
  className = "",
}: {
  variant?: "panel" | "strip";
  /** Analytics: where the click came from. */
  position: string;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  if (!junesNightIsUpcoming()) return null;
  const c = await getPageCopy("junes-night");
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const cta = (
    <TrackedLink
      href={JUNES_NIGHT.path}
      event="junes_night_click"
      eventProps={{ position }}
      className={variant === "panel" ? "btn-pill" : "u-link text-sm hover:text-accent-strong"}
      data-cursor="VIEW"
    >
      {c("ctaLabel")}
    </TrackedLink>
  );

  if (variant === "strip") {
    return (
      <div className={`jn-frame jn-strip ${className}`}>
        <p className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="eyebrow jn-eyebrow">{c("eyebrow")}</span>
          <span className="font-display text-xl leading-snug">{c("title")}</span>
          <span className="tabular text-sm tracking-[0.14em] text-ink-soft uppercase">
            {c("date")} · {JUNES_NIGHT.city}
          </span>
        </p>
        <p className="shrink-0">{cta}</p>
      </div>
    );
  }

  return (
    <div className={`jn-frame jn-panel ${className}`}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-12">
        <div className="lg:col-span-7">
          <p className="eyebrow jn-eyebrow">{c("eyebrow")}</p>
          <Heading className="display-caps mt-4 text-5xl leading-[0.95] sm:text-7xl">
            {c("title")}
          </Heading>
          <p className="font-display mt-4 text-2xl leading-snug text-ink-soft sm:text-3xl">
            {c("tagline")}
          </p>
        </div>
        <div className="lg:col-span-5">
          <p className="font-display text-2xl leading-snug">{c("date")}</p>
          <p className="tabular mt-2 text-sm tracking-[0.14em] text-ink-soft uppercase">
            {c("place")}
          </p>
          <p className="mt-1 text-sm text-ink-faint">{c("tickets")}</p>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <CopyText value={c("lead")} className="max-w-xl leading-relaxed text-ink-soft" />
        <p className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3">
          {cta}
          <a
            href={junesNightIcsDataUrl(c("title"), c("tagline"))}
            download="osman-meyredi-junes-night.ics"
            className="u-link text-sm text-ink-soft hover:text-accent-strong"
            aria-label={`Add ${c("title")} to your calendar`}
            data-cursor="SAVE"
          >
            Remind me
          </a>
        </p>
      </div>
    </div>
  );
}
