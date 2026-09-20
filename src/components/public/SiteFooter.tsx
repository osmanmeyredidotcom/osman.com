import Link from "next/link";
import { getServiceNav } from "@/server/copy";
import type { SiteSettings } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { SocialIconLinks, socialLinks } from "@/components/public/SocialIcons";

const FOOTER_GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "Music", href: "/music" },
      { label: "Media", href: "/media" },
      { label: "Shop", href: "/shop" },
    ],
  },
  {
    heading: "Services",
    links: [
      // Placeholder labels: replaced at render with the Studio-editable
      // service names (getServiceNav), same fixed routes.
      { label: "Concerts", href: "/services/concerts" },
      { label: "Live Piano", href: "/services/piano-for-events" },
      { label: "Music Production", href: "/services/music-production" },
      { label: "Original Scores & Custom Music", href: "/services/music-library" },
    ],
  },
  {
    heading: "Shows",
    links: [
      { label: "Concerts", href: "/shows/concerts" },
      { label: "Upcoming gigs", href: "/shows/gigs" },
      { label: "Live videos", href: "/shows/live-videos" },
    ],
  },
];

/** Keynote 02-09, slide 2: the footer marquee spells out the instruments. */
const FOOTER_INSTRUMENTS = [
  "Double bass",
  "Bass guitar",
  "Piano",
  "Keyboard",
  "Synthesiser",
  "Guitar",
  "Drums",
  "Percussion",
];

export async function SiteFooter({ settings }: { settings: SiteSettings }) {
  const socials = socialLinks(settings);
  const serviceLinks = await getServiceNav();
  const groups = FOOTER_GROUPS.map((group) =>
    group.heading === "Services" ? { ...group, links: serviceLinks } : group
  );

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-(--container-site) px-5 py-16 sm:px-8">
        <Reveal variant="text">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <nav key={group.heading} aria-label={`Footer: ${group.heading}`}>
                <h2 className="eyebrow">{group.heading}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="u-link text-sm text-ink-soft hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="eyebrow">Contact</h2>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="u-link text-sm text-ink-soft hover:text-ink"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="u-link text-sm text-ink-soft hover:text-ink"
                  >
                    Booking &amp; Inquiries
                  </Link>
                </li>
              </ul>
              <SocialIconLinks links={socials} className="mt-6" />
            </div>
          </div>

          <div className="mt-14 border-t border-line pt-6">
            <p className="text-xs text-ink-faint">© Osman Meyredi</p>
          </div>
        </Reveal>
      </div>

      {/* Instrument marquee (Keynote slide 2) — the words replace the
          repeated wordmark, drifting very slowly */}
      <div className="pb-6" aria-hidden="true">
        <Marquee duration={70} label="Instruments">
          {FOOTER_INSTRUMENTS.map((label) => (
            <span
              key={label}
              className="flex items-center text-xl tracking-[0.14em] whitespace-nowrap text-ink-faint/50 uppercase"
            >
              <span className="px-7">{label}</span>
              <span aria-hidden="true" className="text-line-dark">·</span>
            </span>
          ))}
        </Marquee>
      </div>
    </footer>
  );
}
