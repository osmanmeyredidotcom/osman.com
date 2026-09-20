import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { CONTACT_TOPICS } from "@/lib/validation/schemas";
import { faqPageJsonLd, JsonLd, pageOpenGraph } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { ContactForm } from "@/components/public/ContactForm";
import { SocialIconLinks, socialLinks } from "@/components/public/SocialIcons";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

// §23 title direction for Contact.
const CONTACT_TITLE = "Book Osman Meyredi | Live Music, Piano & Music Production";
const CONTACT_DESCRIPTION =
  "Tell Osman Meyredi about it: bookings, live piano, production, licensing, collaborations and press. Direct contacts for management and bookings, or one structured form for everything else.";

export const metadata: Metadata = {
  title: { absolute: CONTACT_TITLE },
  description: CONTACT_DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: pageOpenGraph({
    title: CONTACT_TITLE,
    description: CONTACT_DESCRIPTION,
    path: "/contact",
    image: "/images/home-hero-landscape.jpg",
    imageAlt: "Osman Meyredi singing at the keys under stage light",
  }),
};

/**
 * Contact — precision pack 04 + Round 2 Keynote slides 18–19.
 *
 * Two complementary ways in, never merged: role-based direct addresses for
 * people who already know whom they need, and one structured form for
 * everyone else. Round 2 changes: Osman's direct address is no longer shown
 * publicly (strict email rule — topic routing still reaches him server-side),
 * the MANAGEMENT/BOOKINGS/GENERAL labels are quieter so the addresses lead,
 * each column states plainly who it is for (the Xavier Rudd clarity idea),
 * and the language line reads "Write in Italian, English or Dutch."
 */
const DIRECT_CONTACTS: Array<{ role: string; person?: string; email: string }> = [
  { role: "Management", person: "Jolene Prins", email: "jolene@osmanmeyredi.com" },
  { role: "Bookings", email: "bookings@osmanmeyredi.com" },
  { role: "General", email: "info@osmanmeyredi.com" },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>;
}) {
  const params = await searchParams;
  const typeParam = Array.isArray(params.type) ? params.type[0] : params.type;
  const initialTopic = (CONTACT_TOPICS as readonly string[]).includes(typeParam ?? "")
    ? typeParam
    : undefined;

  const repos = getRepos();
  // Q&As degrade gracefully: on a database that hasn't run the Faq
  // migration yet (or a stale generated client), the contact page must
  // still render — it just omits the section until `prisma generate` +
  // `prisma migrate deploy` have been run.
  const [settings, allFaqs] = await Promise.all([
    repos.settings.get(),
    repos.faqs.list().catch(() => []),
  ]);
  const socials = socialLinks(settings);
  const faqs = allFaqs
    .filter((f) => f.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
    <section className="py-24 sm:py-32">
      <Container wide>
        <Reveal variant="text">
          <p className="eyebrow">Contact</p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">
            Tell Osman Meyredi about it
          </h1>
          {/* Round 3 Keynote: the intro paragraph is removed ("Remove text.
              I realise it's not needed") and replaced by the requested
              palette-accent line — restrained, per the site's accent red. */}
          <div className="mt-8 h-0.5 w-24 bg-accent-strong" aria-hidden="true" />
        </Reveal>

        <div className="mt-14 grid gap-16 lg:grid-cols-[1fr_2.2fr]">
          {/* Direct contacts — matched to the Round 2 slide-18 mock (Aditya
              12-09-2026): role label first and clearly legible, then the
              person, then the address. Osman's direct inbox stays off the
              page (strict email rule). */}
          <Reveal variant="card" delay={90}>
            <aside aria-label="Direct contacts">
              <h2 className="eyebrow">Straight to the right person</h2>
              <ul className="mt-6">
                {DIRECT_CONTACTS.map((c) => (
                  <li key={c.email} className="border-t border-line py-5 last:border-b">
                    <p className="tabular text-xs tracking-[0.16em] text-ink-soft uppercase">
                      {c.role}
                    </p>
                    {c.person && <p className="mt-1.5 text-sm text-ink">{c.person}</p>}
                    <p className="mt-1">
                      <a
                        href={`mailto:${c.email}`}
                        className="u-link text-sm text-ink hover:text-accent-strong"
                        data-cursor="MAIL"
                      >
                        {c.email}
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
              {/* Round 3 Keynote: "Add also the Italian sentence" — exact
                  client wording, alongside the English line. */}
              <p className="mt-4 text-xs leading-relaxed text-ink-faint">
                Write in Italian, English or Dutch.
                <span className="mt-1 block">Scrivi in italiano, inglese o olandese</span>
              </p>

              {socials.length > 0 && (
                <div className="mt-10">
                  <h2 className="eyebrow">Elsewhere</h2>
                  <SocialIconLinks links={socials} className="mt-4" />
                </div>
              )}
            </aside>
          </Reveal>

          {/* The form — leads with its own "What's this about?" heading,
              as on the slide. */}
          <Reveal variant="text" delay={130}>
            <div>
              <ContactForm initialTopic={initialTopic} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>

    {/* Practical Q&A (SEO/AI foundation §30) — Studio-managed approved
        answers to the questions bookers actually ask, with FAQPage
        structured data mirroring exactly what is visible here. */}
    {faqs.length > 0 && (
      <section className="border-t border-line py-20 sm:py-24">
        <JsonLd data={faqPageJsonLd(faqs)} />
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Practical information</p>
            <h2 className="font-display mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl">
              The questions bookers ask first
            </h2>
          </Reveal>
          <dl className="mt-10 grid gap-x-14 gap-y-10 lg:grid-cols-2">
            {faqs.map((faq, i) => (
              <Reveal key={faq.id} variant="text" delay={Math.min(i * 60, 240)}>
                <div className="border-t border-line pt-5">
                  <dt className="font-display text-xl leading-snug">{faq.question}</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {faq.answer}
                    {faq.linkUrl && (
                      <>
                        {" "}
                        <Link href={faq.linkUrl} className="u-link whitespace-nowrap text-ink hover:text-accent-strong">
                          {faq.linkLabel ?? "Read more"}{" "}
                          <span className="arrow-nudge" aria-hidden="true">→</span>
                        </Link>
                      </>
                    )}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>
    )}
    </>
  );
}
