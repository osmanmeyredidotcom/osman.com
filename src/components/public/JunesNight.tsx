import { getPageCopy } from "@/server/copy";
import { JUNES_NIGHT, junesNightIcsDataUrl, junesNightIsUpcoming } from "@/data/junes-night";
import { CopyText } from "@/components/public/CopyText";
import { TrackedLink } from "@/components/public/TrackedLink";

/** The name's size in the panel at each breakpoint. The date block borrows
 *  it so its em-based top padding follows the name (22-11, see below). */
const NAME_SIZE = "text-5xl sm:text-7xl lg:text-6xl xl:text-7xl";

/**
 * June’s Night highlight (VP, 2-11-2026): the 2 June 2028 solo concert,
 * set apart from the regular date rows wherever upcoming shows appear.
 *
 * - "panel": homepage On stage soon, the Shows overview and Solo shows.
 *   Eyebrow, the name in display caps, the tagline, then date, place and
 *   tickets, the highlight text, the early bird pill and Remind me. The date
 *   block and the pill share one left edge (4-11, N04-05).
 * - "strip": one line for pages where it is a pointer, not the topic. No
 *   page uses it at the moment: Collaboration gigs dropped it on 2-11 and
 *   the Concerts service page on 19-11 (VP). Kept so it can come back.
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

  // 4-11 feedback (N04-05, "Friday 2nd June and the button get early bird
  // access has to be aligned"): one grid for the whole panel. From lg up the
  // right-hand column is as wide as its widest content (the pill and Remind
  // me), so the date block and the early bird pill start on the same left
  // edge whatever the copy. Below lg everything stacks on the panel's left
  // edge. June’s Night keeps its capitals: a named concert is the one
  // exception to sentence case (N04-04).
  // 22-11 (VP: "the friday 2 june text is fine on x axis but adjust y axis
  // (height) in alignment to the big june's night text, dont increase the
  // font size just let it be aligned with it"): from lg the eyebrow, the
  // name and the tagline are the grid's first three rows, and the date
  // block starts in the name's row with the date's line centred on the
  // name's line. The block borrows the name's font size (NAME_SIZE), so its
  // top padding, half of the name's line (0.92em, .display-caps) minus the
  // date's line (1.04 × 1.5rem, .font-display at text-2xl), follows the
  // name at every breakpoint. Place and tickets stay right under the date;
  // no size changes, and phones and tablets keep the stacked order.
  return (
    <div className={`jn-frame jn-panel ${className}`}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-12">
        <p className="eyebrow jn-eyebrow mb-4 lg:col-start-1 lg:row-start-1">{c("eyebrow")}</p>
        <Heading
          className={`display-caps leading-[0.95] ${NAME_SIZE} lg:col-start-1 lg:row-start-2`}
        >
          {c("title")}
        </Heading>
        <p className="font-display mt-4 text-2xl leading-snug text-ink-soft sm:text-3xl lg:col-start-1 lg:row-start-3">
          {c("tagline")}
        </p>
        <div
          className={`jn-when mt-8 ${NAME_SIZE} lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:mt-0 lg:self-start lg:pt-[calc((0.92em_-_1.56rem)/2)]`}
        >
          <p className="font-display text-2xl leading-snug">{c("date")}</p>
          <p className="tabular mt-2 text-sm tracking-[0.14em] text-ink-soft uppercase">
            {c("place")}
          </p>
          <p className="mt-1 text-sm text-ink-faint">{c("tickets")}</p>
        </div>
        <div aria-hidden="true" className="mt-10 border-t border-line lg:col-span-2" />
        <div className="mt-8 max-w-xl space-y-4 lg:self-center">
          <CopyText value={c("lead")} className="leading-relaxed text-ink-soft" />
        </div>
        <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-8 lg:self-center">
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
