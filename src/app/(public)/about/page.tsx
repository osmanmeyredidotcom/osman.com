import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { JsonLd, pageOpenGraph, personJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

// §23 title direction, adjusted to the approved "Italian-born" wording.
const ABOUT_TITLE = "About Osman Meyredi | Italian-Born Multi-Instrumentalist in the Netherlands";
const ABOUT_DESCRIPTION =
  "Osman Meyredi is an Italian-born artist, multi-instrumentalist, songwriter, composer, singer, music director and producer, based in the Netherlands, performing across Europe and beyond.";

export const metadata: Metadata = {
  title: { absolute: ABOUT_TITLE },
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: pageOpenGraph({
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    path: "/about",
    image: "/images/about/about-multi-instrumentalist.jpg",
    imageAlt: "Osman Meyredi on stage surrounded by his instruments, black and white",
    imageWidth: 1920,
    imageHeight: 1071,
  }),
};

/**
 * About — Round 3 Keynote (20-09-2026): "Replace entire text, incl. titel
 * with pages doc: FINAL SEP_About in the about folder. Use first portrait
 * image, then landscape image." Every heading and paragraph below follows
 * FINAL SEP_About.pages verbatim; the portrait is the black & white double
 * bass, the landscape is the all-instruments photograph, in that order.
 * The document links Blue Lou Marini's name to the live video that contains
 * that performance (the live showreel).
 */
export default async function AboutPage() {
  // Person entity on About as well as Home (brief §33) — same stable @id,
  // sameAs from the Studio-configured official profiles only.
  const settings = await getRepos().settings.get();
  const socialUrls = [
    settings.instagramUrl,
    settings.youtubeUrl,
    settings.tiktokUrl,
    settings.linkedinUrl,
    settings.facebookUrl,
  ].filter((u): u is string => Boolean(u));

  return (
    <article>
      <JsonLd data={personJsonLd(socialUrls)} />
      <section className="py-24 sm:py-32">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">About</p>
            <h1 className="font-display mt-6 max-w-4xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Osman Meyredi treats every instrument as a different way of listening.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Osman Meyredi is an Italian-born artist, multi-instrumentalist, songwriter,
              composer, singer, music director and producer, based in the Netherlands. He moves
              between instruments and genres with ease, combining different influences into
              songs that feel personal, honest, and never quite predictable. What makes his work
              distinctive is that he can take different styles, instruments, and influences, and
              make them sound like they belong together.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container wide>
        <Parallax speed={0.1}>
          <Reveal variant="mask" className="mx-auto max-w-md">
            {/* First image — "[black&white image, portrait, double bass]". */}
            <div className="media-zoom border border-line">
              <Image
                src="/images/about/about-double-bass-portrait.jpg"
                alt="Osman Meyredi bowing the double bass, black and white"
                width={1115}
                height={1600}
                sizes="(min-width: 640px) 28rem, 88vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </Parallax>
      </Container>

      {/* On stage with the greats */}
      <section className="py-24">
        <Container>
          <Reveal variant="text">
            <h2 className="font-display text-3xl">On stage with the greats</h2>
            <p className="mt-6 leading-relaxed">
              Osman has toured several times with Ike Willis, Frank Zappa&rsquo;s longtime
              vocalist, playing Zappa&rsquo;s notoriously demanding repertoire alongside a
              singer who lived inside it for decades. In Sardinia, he performed with musicians
              from Laura Pausini and Eros Ramazzotti&rsquo;s bands. In Italy, he shared the
              stage with{" "}
              <Link href="/shows/live-videos#live-showreel" className="u-link">
                Blue Lou Marini
              </Link>
              , saxophonist of the Blues Brothers Band.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Two conservatories */}
      <section className="border-t border-line py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">
              Two conservatories, in Italy and in The Netherlands
            </h2>
            <p className="mt-6 leading-relaxed">
              In 2009 he finished a master&rsquo;s degree in double bass at the Trento
              Conservatory in Italy: the formal proof of years spent inside classical training
              and ensemble playing. But even then, the double bass was never the whole story: on
              the side, almost as easily as breathing, he was picking up drums, percussion,
              guitar, electric guitar, keyboards and synthesisers.
            </p>
            <p className="mt-6 leading-relaxed">
              A decade later he completed a degree in Music Education at the Conservatory of
              Amsterdam, covering pedagogy, arrangement, band coaching, vocal performance, jazz
              piano and music production. Between the two degrees is basically his whole working
              life: one rooted in craft, the other in how craft gets passed on.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container wide>
        {/* Second image — "[Landscape black & white image with all
            instruments, see about folder]". */}
        <Reveal variant="mask">
          <div className="media-zoom border border-line">
            <Image
              src="/images/about/about-multi-instrumentalist.jpg"
              alt="Osman Meyredi on stage surrounded by his instruments, black and white"
              width={1920}
              height={1071}
              sizes="(min-width: 1024px) 72rem, 96vw"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </Container>

      {/* Where it started */}
      <section className="py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">Where it started</h2>
            <p className="mt-6 leading-relaxed">
              His story with music started before he had the language to explain it. When his
              uncle taught him the beginning of a Christmas song but had to leave before
              finishing it, Osman completed the melody by ear, instinctively finding the missing
              notes. That moment felt as if music already belonged to him. Since then he would
              hear songs on the radio and play them almost immediately on the piano without
              reading a single note.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Languages & availability */}
      <section className="border-t border-line py-24">
        <Container>
          <Reveal variant="text" delay={90}>
            <h2 className="font-display text-3xl">Languages &amp; availability</h2>
            <p className="mt-6 leading-relaxed">
              Osman Meyredi works in English, Italian and Dutch. He&rsquo;s based in Amsterdam,
              performs regularly in the Netherlands and Italy, and travels for concerts, events
              and productions across Europe and beyond.
            </p>
            <div className="mt-10 flex flex-wrap gap-6">
              <Link href="/shows/concerts" className="btn-pill">
                Upcoming concerts <span className="arrow-nudge ml-1" aria-hidden="true">→</span>
              </Link>
              <Link href="/contact" className="btn-pill">
                Get in touch
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </article>
  );
}
