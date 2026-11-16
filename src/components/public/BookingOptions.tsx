import { Reveal } from "@/components/motion/Reveal";

export type BookingOption = { title: string; body: string };

/**
 * Concerts, "Three ways to book a show". VP, 16-11: "make this section look
 * similar like the services page". The three options are set as the rows of
 * the Services overview register (services/page.tsx), in the Bio-template
 * reading column: a hairline above each row, the outlined index number,
 * the option name in the display face and its text below. They arrive the
 * way those rows do (the card rise, staggered) and lean in on hover the
 * same way (soft tint, the row widens, the name moves 4px, the number fills
 * with the red), through the shared .service-row / .service-index styles.
 *
 * The names are one step below the chapter heading above them, so the
 * heading still leads. An ordered list carries the order for screen
 * readers; the drawn numbers are decoration. (Until 16-11 the options sat
 * on a red rail with solid numbers and level meters.)
 */
export function BookingOptions({ options }: { options: BookingOption[] }) {
  return (
    <ol className="border-b border-line">
      {options.map((option, i) => (
        <li key={option.title} className="border-t border-line">
          <Reveal variant="card" delay={Math.min(i * 70, 210)}>
            <div className="service-row flex items-start gap-6 py-12 sm:py-14">
              <p aria-hidden="true" className="service-index shrink-0 text-4xl sm:text-5xl">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="min-w-0">
                <h3 className="font-display text-2xl sm:text-3xl">
                  <span className="service-row-title">{option.title}</span>
                </h3>
                <p className="mt-4 leading-relaxed text-ink-soft">{option.body}</p>
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
