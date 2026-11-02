import Link from "next/link";
import { getServiceNav } from "@/server/copy";

/**
 * Local navigation for the Services area — Round 2 brief §43/§44. The client
 * asked for a way back to the broader service choices without reopening the
 * fullscreen menu, and for the Original Tracks & Music Library service to be
 * discoverable rather than buried. Same pattern as the approved Shows
 * subnav: every sibling one click away, horizontally scrollable on mobile.
 * 2-11 (VP): the "All services" link is gone from this subnav on every
 * service page (Live Piano first, in November feedback 2). The All Services
 * page itself stays, reachable from the menu and the footer.
 */
const ITEMS = [
  { href: "/services/concerts", label: "Concerts" },
  { href: "/services/piano-for-events", label: "Live Piano" },
  { href: "/services/music-production", label: "Music Production" },
  { href: "/services/music-library", label: "Original Scores & Custom Music" },
] as const;

export async function ServicesSubnav({ current }: { current: (typeof ITEMS)[number]["href"] }) {
  // Studio-editable service names on the fixed routes.
  const nav = await getServiceNav();
  const items = ITEMS.map((item) => {
    const match = nav.find((n) => n.href === item.href);
    return match ? { ...item, label: match.label } : item;
  });
  return (
    <nav aria-label="Services section" className="border-b border-line">
      <div className="mx-auto w-full max-w-(--container-site) overflow-x-auto px-5 sm:px-8">
        <ul className="flex min-w-max items-center gap-6 py-3.5 sm:gap-8">
          {items.map((item) => {
            const active = item.href === current;
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
