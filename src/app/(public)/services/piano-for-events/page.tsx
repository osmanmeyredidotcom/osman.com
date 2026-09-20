import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";
import { breadcrumbJsonLd, JsonLd, pageOpenGraph } from "@/lib/seo";

// §23 title direction — the event-booking / piano search intent page (§25).
const PAGE_TITLE = "Live Pianist for Events in Amsterdam & the Netherlands | Osman Meyredi";
const PAGE_DESCRIPTION =
  "Osman Meyredi performs live solo piano for company celebrations, brand launches, conferences, receptions and other private and corporate occasions in Amsterdam, the Netherlands and beyond.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/services/piano-for-events" },
  openGraph: pageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/services/piano-for-events",
    image: "/images/services/live-piano-grand.jpg",
    imageAlt: "Osman Meyredi at a white grand piano by the window, black and white",
    imageWidth: 1195,
    imageHeight: 1600,
  }),
};

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Live Piano", path: "/services/piano-for-events" },
];

/**
 * Live Piano — Round 3 Keynote (20-09-2026): "Replace entire text: Doc:
 * FINAL_Sep26_Live Piano", image changed to the photograph supplied after
 * the call (white grand piano by the window), a link to the live videos
 * added where the document marks it, and the CTA reading "Book Osman
 * Meyredi". All copy follows the document verbatim, in its order.
 */
export default function PianoForEventsPage() {
  return (
    <article>
      {/* BreadcrumbList (§37) — mirrors the visible Services sub-nav hierarchy. */}
      <JsonLd data={breadcrumbJsonLd(BREADCRUMBS)} />
      <ServicesSubnav current="/services/piano-for-events" />
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Live Piano</h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              Corporate · Receptions · Conferences · Special Events
            </p>
            <p className="mt-6 text-xl leading-relaxed text-ink-soft">
              Osman Meyredi performs live solo piano for company celebrations, brand launches,
              conferences, receptions and other private and corporate occasions.
            </p>
            <p className="mt-9">
              <TrackedLink
                href="/contact?type=LIVE_PIANO"
                event="service_inquiry_click"
                eventProps={{ service: "piano-for-events", position: "hero" }}
                className="btn-pill"
                data-cursor="BOOK"
              >
                Book Osman Meyredi <span className="arrow-nudge" aria-hidden="true">→</span>
              </TrackedLink>
            </p>
          </Reveal>
        </Container>

        {/* The image supplied after the call — portrait, so it sits as a
            centred column rather than a full-bleed strip. */}
        <Container className="mt-14">
          <Reveal variant="mask">
            <div className="mx-auto max-w-md">
              <div className="media-zoom border border-line">
                <Image
                  src="/images/services/live-piano-grand.jpg"
                  alt="Osman Meyredi at a white grand piano by the window, black and white"
                  width={1195}
                  height={1600}
                  sizes="(min-width: 640px) 28rem, 88vw"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
        </Container>

        <Container className="mt-14">
          <Reveal variant="text" delay={100}>
            <p className="leading-relaxed text-ink">
              He keeps things understated: solo piano, played live, present in the room without
              ever taking it over. His repertoire blends his own compositions with carefully
              chosen covers, drifting easily between light classical, jazz, pop and film music
              depending on the mood he&rsquo;s reading in the room. With his broad musical
              background and his ear for a room, he shapes the set as he goes, rather than
              sticking to a fixed programme.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              If the venue has its own grand piano, that&rsquo;s always his first choice, it
              keeps the set-up simple and adds a natural touch of class. If not, he brings his
              own electronic piano, built discreetly into a grand-piano-style shell, so the
              elegance of a real piano is never lost, even without one in the room.
            </p>
            <p className="mt-6 leading-relaxed text-ink">
              Want something with a bit more presence? A vocalist, male or female, can be added
              on request.
            </p>
          </Reveal>
        </Container>

        {/* Closing listen prompt — the document marks the live-videos link
            here ("Just add a link here [link to live video's]"). */}
        <Container className="mt-16">
          <Reveal variant="text">
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              Want to hear what it sounds like?
            </p>
            <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
              Watch{" "}
              <Link href="/shows/live-videos" className="u-link">
                Osman Meyredi at the piano
              </Link>
              , from intimate performance to jazz, pop and his own compositions.
            </p>
            <p className="mt-7">
              <Link href="/shows/live-videos" className="btn-pill" data-cursor="WATCH">
                Watch the live videos <span className="arrow-nudge" aria-hidden="true">→</span>
              </Link>
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <Reveal variant="text">
            <TrackedLink
              href="/contact?type=LIVE_PIANO"
              event="service_inquiry_click"
              eventProps={{ service: "piano-for-events", position: "footer" }}
              className="btn-pill"
              data-cursor="BOOK"
            >
              Book Osman Meyredi <span className="arrow-nudge" aria-hidden="true">→</span>
            </TrackedLink>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
