import Link from "next/link";

/**
 * Local navigation for the Shows area — Keynote 02-09-2026, slides 15/16.
 * A visitor reported getting lost between Concerts and the other Shows pages;
 * this row keeps every sibling (and the way back to the overview) one click
 * away without a trip through the fullscreen menu.
 */
const ITEMS = [
  { href: "/shows", label: "Hear it live" },
  { href: "/shows/concerts", label: "Concerts" },
  { href: "/shows/gigs", label: "Upcoming gigs" },
  { href: "/shows/live-videos", label: "Live videos" },
] as const;

export function ShowsSubnav({ current }: { current: (typeof ITEMS)[number]["href"] }) {
  return (
    <nav aria-label="Shows section" className="border-b border-line">
      <div className="mx-auto w-full max-w-(--container-site) overflow-x-auto px-5 sm:px-8">
        <ul className="flex min-w-max items-center gap-6 py-3.5 sm:gap-8">
          {ITEMS.map((item) => {
            const active = item.href === current;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-xs tracking-[0.14em] uppercase transition-colors ${
                    active
                      ? "text-accent-strong"
                      : "text-ink-faint hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
