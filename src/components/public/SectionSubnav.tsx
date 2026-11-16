"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type SubnavItem = { href: string; label: string };

/**
 * The local navigation bar of the Services and Shows areas (Round 2 brief
 * §43/§44 and Keynote 02-09-2026, slides 15/16): every sibling page one
 * click away without a trip through the fullscreen menu, horizontally
 * scrollable on phones.
 *
 * 4-11 feedback (N04-20 / N04-27, slide: "One should see this tab even when
 * scrolled at the bottom"): the bar stays under the site header for the
 * whole page, footer included. A sticky bar only travels as far as its
 * parent, and inside a page it left with the page's last section, which on
 * a phone (where the footer fills the screen) meant it was gone at the
 * bottom. It is therefore rendered once by the public layout, beside the
 * page rather than inside it, and picks its items from the route.
 *
 * Services: the four fixed routes with their Studio-editable names (Pages →
 * Services overview); no "All services" entry (2-11, VP). Shows: Solo shows
 * · Collaboration gigs · Videos (12-10 naming, P19-X268); the overview and
 * the June’s Night page carry the bar with no entry marked as current.
 */
const SHOWS_ITEMS: SubnavItem[] = [
  { href: "/shows/concerts", label: "Solo shows" },
  { href: "/shows/gigs", label: "Collaboration gigs" },
  { href: "/shows/live-videos", label: "Videos" },
];
const SHOWS_ALSO = ["/shows", "/shows/junes-night"];

export function SectionSubnav({ services }: { services: SubnavItem[] }) {
  const pathname = usePathname() ?? "";

  let label: string;
  let items: SubnavItem[];
  if (services.some((s) => s.href === pathname)) {
    label = "Services section";
    items = services;
  } else if (SHOWS_ITEMS.some((s) => s.href === pathname) || SHOWS_ALSO.includes(pathname)) {
    label = "Shows section";
    items = SHOWS_ITEMS;
  } else {
    return null;
  }

  return (
    <nav aria-label={label} className="subnav border-b border-line">
      <div className="mx-auto w-full max-w-(--container-site) overflow-x-auto px-5 sm:px-8">
        <ul className="flex min-w-max items-center gap-6 py-3.5 sm:gap-8">
          {items.map((item) => {
            const active = item.href === pathname;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-xs tracking-[0.14em] uppercase transition-colors ${
                    active ? "text-accent-strong" : "text-ink-faint hover:text-ink"
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
