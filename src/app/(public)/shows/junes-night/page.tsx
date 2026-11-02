import type { Metadata } from "next";
import { getPageCopy } from "@/server/copy";
import { JUNES_NIGHT, junesNightIcsDataUrl, junesNightIsUpcoming } from "@/data/junes-night";
import { breadcrumbJsonLd, JsonLd, junesNightJsonLd, pageOpenGraph } from "@/lib/seo";
import { plainCopy } from "@/lib/copyLinks";
import { Container } from "@/components/shared/Container";
import { CopyInline, CopyText, splitCopy } from "@/components/public/CopyText";
import { EarlyBirdForm } from "@/components/public/EarlyBirdForm";
import { ShowsSubnav } from "@/components/public/ShowsSubnav";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageCopy("junes-night");
  return {
    title: { absolute: c("seo.title") },
    description: c("seo.description"),
    alternates: { canonical: JUNES_NIGHT.path },
    openGraph: pageOpenGraph({
      title: c("seo.title"),
      description: c("seo.description"),
      path: JUNES_NIGHT.path,
      image: "/images/home-hero-ndsm-kade.jpg",
      imageAlt: "Osman Meyredi leaning against a dark wall at NDSM in Amsterdam",
    }),
  };
}

/**
 * June’s Night (VP, 2-11-2026): the page every highlight points to. The
 * name leads in display caps, then date, place and tickets in one line, the
 * story next to the early bird form. Under Shows (the sub-nav keeps Solo
 * shows, Collaboration gigs and Videos one click away). After the night the
 * page stays as a record, without the form.
 */
export default async function JunesNightPage() {
  const c = await getPageCopy("junes-night");
  const upcoming = junesNightIsUpcoming();
  // The first paragraph reads large next to the form; the rest is body text.
  // The hero already carries date, place and tickets, so nothing repeats.
  const [introLead = "", ...introRest] = splitCopy(c("page.intro"));

  return (
    <>
      <JsonLd
        data={junesNightJsonLd({
          title: c("title"),
          description: `${c("tagline")}. ${plainCopy(c("lead"))}`,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shows", path: "/shows" },
          { name: "Solo shows", path: "/shows/concerts" },
          { name: c("title"), path: JUNES_NIGHT.path },
        ])}
      />
      <ShowsSubnav />

      <section className="jn-hero border-b border-line py-20 sm:py-28">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow jn-eyebrow">{c("eyebrow")}</p>
            <h1 className="display-caps mt-5 text-6xl leading-[0.92] sm:text-8xl lg:text-9xl">
              {c("title")}
            </h1>
            <p className="font-display mt-5 text-2xl leading-snug text-ink-soft sm:text-4xl">
              {c("tagline")}
            </p>
            <p className="tabular mt-10 flex flex-wrap gap-x-3 gap-y-1 text-sm tracking-[0.14em] text-ink-soft uppercase">
              <span>{c("date")}</span>
              <span aria-hidden="true" className="text-line-dark">
                ·
              </span>
              <span>{c("place")}</span>
            </p>
            <p className="mt-2 text-sm text-ink-faint">{c("tickets")}</p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-12">
            <Reveal variant="text" className="lg:col-span-5">
              <CopyText value={introLead} className="font-display text-2xl leading-snug" />
              {introRest.map((para, i) => (
                <CopyText
                  key={i}
                  value={para}
                  className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
                />
              ))}
              {upcoming && (
                <p className="mt-8">
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
              )}
            </Reveal>
            {upcoming && (
              <Reveal variant="card" delay={100} className="lg:col-span-7">
                <EarlyBirdForm
                  heading={c("form.heading")}
                  note={<CopyInline value={c("form.note")} />}
                  success={<CopyInline value={c("form.success")} />}
                />
              </Reveal>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
