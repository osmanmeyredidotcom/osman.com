import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { getPageCopy } from "@/server/copy";
import { CONTACT_TOPICS } from "@/lib/validation/schemas";
import { faqPageJsonLd, JsonLd, pageOpenGraph } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { ContactForm } from "@/components/public/ContactForm";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { ContactSelfLinks } from "@/components/public/ContactSelfLinks";
import { SocialIconLinks, socialLinks } from "@/components/public/SocialIcons";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // §23 title direction for Contact; Studio-editable via Pages → Contact.
  const c = await getPageCopy("contact");
  return {
    title: { absolute: c("seo.title") },
    description: c("seo.description"),
    alternates: { canonical: "/contact" },
    openGraph: pageOpenGraph({
      title: c("seo.title"),
      description: c("seo.description"),
      path: "/contact",
      image: "/images/home-hero-landscape.jpg",
      imageAlt: "Osman Meyredi singing at the keys under stage light",
    }),
  };
}

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
// The people/addresses are Studio-editable (Pages → Contact); the role
// labels stay fixed so routing stays predictable.

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
  const [settings, allFaqs, c] = await Promise.all([
    repos.settings.get(),
    repos.faqs.list().catch(() => []),
    getPageCopy("contact"),
  ]);
  const directContacts: Array<{ role: string; person?: string; email: string }> = [
    { role: "Management", person: c("managementName"), email: c("managementEmail") },
    { role: "Bookings", email: c("bookingsEmail") },
    { role: "General", email: c("generalEmail") },
  ];
  const socials = socialLinks(settings);
  const faqs = allFaqs
    .filter((f) => f.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
    {/* 19-11 (N19-13/17): links to this page clicked on this page (FAQ,
        footer) come back up to Get in touch. */}
    <ContactSelfLinks targetId="get-in-touch" />
    <section id="get-in-touch" tabIndex={-1} className="py-24 outline-none sm:py-32">
      <Container wide>
        <Reveal variant="text">
          <p className="eyebrow">Contact</p>
          {/* 4-11 feedback (N04-41): the title is "Get in touch" (Studio:
              Pages → Contact → Page title) and the short red line under it
              is gone ("this particular design only for the shows"). The
              Round 3 removal of the intro paragraph stands. */}
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">
            {c("heading")}
          </h1>
        </Reveal>

        <div className="mt-14 grid gap-16 lg:grid-cols-[1fr_2.2fr]">
          {/* Direct contacts — matched to the Round 2 slide-18 mock (Aditya
              12-09-2026): role label first and clearly legible, then the
              person, then the address. Osman's direct inbox stays off the
              page (strict email rule). */}
          <Reveal variant="card" delay={90}>
            <aside aria-label="Direct contacts">
              <h2 className="eyebrow">{c("directHeading")}</h2>
              <ul className="mt-6">
                {directContacts.map((contact) => (
                  <li key={contact.email} className="border-t border-line py-5 last:border-b">
                    <p className="tabular text-xs tracking-[0.16em] text-ink-soft uppercase">
                      {contact.role}
                    </p>
                    {contact.person && (
                      <p className="mt-1.5 text-sm text-ink">{contact.person}</p>
                    )}
                    <p className="mt-1">
                      <a
                        href={`mailto:${contact.email}`}
                        className="u-link text-sm text-ink hover:text-accent-strong"
                        data-cursor="MAIL"
                      >
                        {contact.email}
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
              {/* Round 3 Keynote: "Add also the Italian sentence" — exact
                  client wording, alongside the English line. */}
              <p className="mt-4 text-xs leading-relaxed text-ink-faint">
                {c("languageLine")}
                <span className="mt-1 block">{c("languageLineItalian")}</span>
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
        structured data mirroring exactly what is on the page. 4-11 (N04-43):
        the questions with a +, the answers collapsed until opened. */}
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
          <Reveal variant="text" delay={60}>
            <div className="mt-10">
              <FaqAccordion
                faqs={faqs.map(({ id, question, answer, linkUrl, linkLabel }) => ({
                  id,
                  question,
                  answer,
                  linkUrl,
                  linkLabel,
                }))}
              />
            </div>
          </Reveal>
        </Container>
      </section>
    )}
    </>
  );
}
