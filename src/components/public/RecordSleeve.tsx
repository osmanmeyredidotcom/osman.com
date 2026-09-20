/**
 * Record sleeve placeholder: square cover with generated tone + release title
 * set like a sleeve, optional vinyl disc peeking out behind (slide distance
 * controlled by the parent via the .disco-vinyl class or inline transform).
 * Replace by passing artworkUrl once real cover art exists — layout and
 * animation wrappers stay identical.
 */
export function RecordSleeve({
  title,
  year,
  tone = "#a34b46",
  artworkUrl = null,
  withVinyl = false,
  spinVinyl = true,
  vinylClassName = "",
  className = "",
}: {
  title: string;
  year?: number | null;
  tone?: string;
  artworkUrl?: string | null;
  withVinyl?: boolean;
  /** Round 3: the shelf presentation must not turn ("it makes me dizzy"). */
  spinVinyl?: boolean;
  vinylClassName?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {withVinyl && (
        <div
          className={`absolute top-1/2 right-0 aspect-square w-[86%] -translate-y-1/2 ${vinylClassName}`}
          aria-hidden="true"
        >
          <div
            className={`vinyl ${spinVinyl ? "vinyl-spin" : ""} h-full w-full`}
            style={{ "--vinyl-label": tone, "--spin-duration": "18s" } as React.CSSProperties}
          />
        </div>
      )}
      <div
        className="relative aspect-square w-full overflow-hidden border border-line-dark bg-stage"
        style={{ boxShadow: "6px 6px 0 0 rgb(0 0 0 / 0.12)" }}
      >
        {artworkUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artworkUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full flex-col justify-between p-[8%]"
            style={{
              background: `linear-gradient(150deg, #1b1d21 0%, #101114 55%, ${tone}30 100%)`,
            }}
            role="img"
            aria-label={`Placeholder sleeve artwork — ${title}`}
          >
            <div className="flex items-start justify-between">
              <span
                className="eyebrow"
                style={{ color: "#8b8f94" }}
              >
                {year ?? "—"}
              </span>
              <span
                className="h-10 w-10 rounded-full"
                style={{ background: tone, opacity: 0.85 }}
                aria-hidden="true"
              />
            </div>
            <p
              className="display-caps text-ink"
              style={{ fontSize: "clamp(1.2rem, 4.2cqw, 2.1rem)", opacity: 0.92 }}
            >
              {title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
