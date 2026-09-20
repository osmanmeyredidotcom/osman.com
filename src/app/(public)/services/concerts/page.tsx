import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/public/TrackedLink";
import { ServicesSubnav } from "@/components/public/ServicesSubnav";
import { breadcrumbJsonLd, JsonLd, pageOpenGraph } from "@/lib/seo";

// §23 title direction for the concerts/live-performance booking page.
const PAGE_TITLE = "Live Musician & Concert Performances | Osman Meyredi";
const PAGE_DESCRIPTION =
  "Book Osman Meyredi live: every song his own, built as one continuous arc — soul into funk into disco into rock, with instruments handed to him mid-show. Based in Amsterdam, performing across the Netherlands, Italy and Europe.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/services/concerts" },
  openGraph: pageOpenGraph({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: "/services/concerts",
    image: "/images/services/concerts-live-landscape.jpg",
    imageAlt: "Osman Meyredi mid-performance at the keys, black and white",
    imageWidth: 2400,
    imageHeight: 1350,
  }),
};

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Concerts", path: "/services/concerts" },
];

/**
 * Concerts — Round 3 Keynote (20-09-2026): "Replace the entire text with
 * pages doc 'Final Sep_concerts'", title trimmed to "Concerts". Every
 * paragraph and the three booking options follow that document verbatim.
 * The slide marks the tickets note as "Keep" (its link now points at /shows,
 * since the separate Tickets page is removed this round). The closing
 * statement line and the supplied landscape image stay.
 */
const OPTIONS = [
  {
    title: "Live Multi-Instrumental Performance",
    body: "One person, an entire band's worth of sound. Osman switches in real time between vocals, piano, synths, bass, guitar, double bass and percussion, layering it live with custom tracks and electronics he's built himself. No backing musicians, no safety net. Best for intimate theatres and events where watching one artist build a full show from scratch is the draw.",
  },
  {
    title: "Visual Production",
    body: "The same solo show, built up with lighting, visuals, smoke and fire, scaled for festivals and larger crowds who want spectacle to match the performance.",
  },
  {
    title: "Expanded Live Show",
    body: "Additional musicians, dancers and production, for when the moment calls for a full band-sized sound and presence on stage.",
  },
];

export default function ConcertsServicePage() {
  return (
    <article>
      {/* BreadcrumbList (§37) — mirrors the visible Services sub-nav hierarchy. */}
      <JsonLd data={breadcrumbJsonLd(BREADCRUMBS)} />
      <ServicesSubnav current="/services/concerts" />
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal variant="text">
            <p className="eyebrow">Services</p>
            <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">Concerts</h1>
            <p className="tabular mt-4 text-sm tracking-[0.14em] text-ink-faint uppercase">
              Festivals · Venues · Events
            </p>
            {/* The Show — Final Sep_concerts, verbatim. */}
            <h2 className="font-display mt-10 text-2xl">The Show</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Every song is Osman Meyredi&rsquo;s own. It&rsquo;s built as one continuous arc,
              not a set list. He opens solo and intimate, on piano with backing tracks, and from
              there the night keeps climbing: soul into funk into disco into a shot of
              80&rsquo;s, up to rock at its peak, before turning euphoric for the finale, a
              house-tinged closer that sends the room home on a high.
            </p>
            <p className="mt-6 leading-relaxed text-ink-soft">
              It&rsquo;s never just one genre at a time: each transition blends into the next
              until it feels like something new that didn&rsquo;t exist before. And there are no
              breaks. Instruments are handed to him live, mid-show, so the build never stops.
              Lighting, smoke and fire escalate with it.
            </p>
            {/* Kept element (slide: "Keep") — the tickets note; its link now
                goes to Shows since the separate Tickets page was removed. */}
            <p className="mt-6 border-l-2 border-accent pl-4 text-sm text-ink-soft">
              Looking for tickets to an upcoming show?{" "}
              <Link href="/shows" className="u-link">
                See Shows
              </Link>
              . This page is about booking Osman to perform at your event.
            </p>
            <p className="mt-9">
              <TrackedLink
                href="/contact?type=CONCERTS_LIVE"
                event="service_inquiry_click"
                eventProps={{ service: "concerts", position: "hero" }}
                className="btn-pill"
                data-cursor="BOOK"
              >
                Book Osman live <span className="arrow-nudge" aria-hidden="true">→</span>
              </TrackedLink>
            </p>
          </Reveal>
        </Container>

        {/* The supplied landscape image (colour version still with Varsha —
            visible pending note by client request). */}
        <Container wide className="mt-14">
          <Reveal variant="mask">
            <div className="relative overflow-hidden border border-line" style={{ aspectRatio: "2400/1350" }}>
              <Image
                src="/images/services/concerts-live-landscape.jpg"
                alt="Osman Meyredi mid-performance at the keys, black and white, head tilted back"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <p className="mt-3">
            <span className="pending-note">Waiting for Varsha — colour version to follow</span>
          </p>
        </Container>

        {/* Three ways to book a show — Final Sep_concerts option copy. */}
        <Container className="mt-20">
          <Reveal variant="text">
            <h2 className="eyebrow">Three ways to book a show</h2>
          </Reveal>
          <div className="mt-8">
            {OPTIONS.map((option, i) => (
              <Reveal
                key={option.title}
                variant="card"
                delay={i * 90}
                className="grid gap-3 border-t border-line py-8 last:border-b sm:grid-cols-[4rem_1fr] sm:gap-8"
              >
                <span className="service-index text-4xl sm:text-5xl" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl tracking-wide uppercase">{option.title}</h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">{option.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>

        {/* Statement break — final line carries the emphasis (in the doc). */}
        <Container className="mt-20">
          <Reveal variant="text">
            <p className="font-display text-2xl leading-snug text-ink-soft sm:text-3xl">
              Not every performance needs the same set-up.
              <br />
              The starting point is always the same:
            </p>
            <p className="display-caps mt-6 max-w-3xl text-3xl leading-tight text-accent-strong sm:text-5xl">
              What would make this particular audience feel something?
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line py-16">
        <Container>
          <Reveal variant="text">
            <TrackedLink
              href="/contact?type=CONCERTS_LIVE"
              event="service_inquiry_click"
              eventProps={{ service: "concerts", position: "footer" }}
              className="btn-pill"
              data-cursor="BOOK"
            >
              Book Osman live <span className="arrow-nudge" aria-hidden="true">→</span>
            </TrackedLink>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
