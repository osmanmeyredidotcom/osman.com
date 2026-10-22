import Image from "next/image";
import type { CollaborationRecord, ReleaseRecord } from "@/lib/types";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Discography } from "./Discography";

/**
 * Collaboration / band-project feature — precision pack 02 §4/§12.
 *
 * Archival tone, clearly separated from Osman's solo image: project-first
 * billing, visible photo credit next to the image, and related releases with
 * their real billing. The 12-10/22-10 feedback rounds removed the category
 * eyebrow (X302), the elsewhere link (X300) and the separate end-title
 * memorial (X304, 22-10 item 9) — a remembered musician's lifetime dates
 * now live in the Musicians line of the header data.
 *
 * Safety rails: the hero image renders only when rights are VERIFIED and a
 * credit exists; a cultural note renders only when its verification status
 * is VERIFIED. PENDING/REJECTED content never reaches the page.
 */
export function CollaborationFeature({
  collaboration,
  releases,
}: {
  collaboration: CollaborationRecord;
  releases: ReleaseRecord[];
}) {
  const years =
    collaboration.startYear != null
      ? `${collaboration.startYear}–${
          collaboration.ongoing ? "present" : (collaboration.endYear ?? "")
        }`.replace(/–$/, "")
      : null;

  const showImage =
    collaboration.heroImageUrl &&
    collaboration.heroImageRights === "VERIFIED" &&
    collaboration.heroImageCredit;

  const showCulturalNote =
    collaboration.publicCulturalNote && collaboration.culturalNoteStatus === "VERIFIED";

  return (
    <article className="border-t border-line">
      <Container className="py-16 sm:py-20">
        <Reveal variant="text">
          {/* 12-10 feedback (P32-X302 "no section title"): the category
              eyebrow is gone; the band name leads. */}
          <h3 className="display-caps text-4xl sm:text-6xl">{collaboration.name}</h3>
          <dl className="tabular mt-5 grid gap-x-10 gap-y-2 text-sm text-ink-soft sm:grid-cols-[auto_auto_auto] sm:justify-start">
            {years && (
              <div>
                <dt className="text-xs tracking-[0.14em] text-ink-faint uppercase">Years</dt>
                <dd className="mt-0.5">{years}</dd>
              </div>
            )}
            {collaboration.role && (
              <div>
                <dt className="text-xs tracking-[0.14em] text-ink-faint uppercase">
                  Osman&rsquo;s role
                </dt>
                <dd className="mt-0.5">{collaboration.role}</dd>
              </div>
            )}
            {collaboration.collaborators && (
              <div>
                <dt className="text-xs tracking-[0.14em] text-ink-faint uppercase">
                  Musicians
                </dt>
                <dd className="mt-0.5 max-w-md">{collaboration.collaborators}</dd>
              </div>
            )}
          </dl>
        </Reveal>

        {showImage && (
          <Reveal variant="mask" delay={100} className="mt-10">
            <figure className="m-0 max-w-2xl">
              <div className="media-zoom border border-line">
                <Image
                  src={collaboration.heroImageUrl as string}
                  alt={collaboration.heroImageAlt ?? collaboration.name}
                  width={1200}
                  height={800}
                  sizes="(min-width: 768px) 42rem, 92vw"
                  className="h-auto w-full"
                />
              </div>
              {/* Credit stays next to the image — never only in a legal page. */}
              <figcaption className="tabular mt-2 text-xs tracking-[0.12em] text-ink-faint uppercase">
                {collaboration.heroImageCredit}
              </figcaption>
            </figure>
          </Reveal>
        )}

        {(collaboration.longDescription || collaboration.shortDescription) && (
          <Reveal variant="text" delay={120}>
            <p className="mt-10 max-w-2xl leading-relaxed text-ink">
              {collaboration.longDescription ?? collaboration.shortDescription}
            </p>
          </Reveal>
        )}

        {/* 12-10 feedback (P32-X300): the "elsewhere" outbound link is
            removed; the stored externalUrl stays in the Studio untouched. */}

        {showCulturalNote && (
          <Reveal variant="text" delay={150}>
            <div className="mt-10 max-w-2xl">
              <p className="eyebrow">Cultural footnote</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {collaboration.publicCulturalNote}
              </p>
            </div>
          </Reveal>
        )}
      </Container>

      {releases.length > 0 && (
        <Container className="pb-16">
          <Reveal variant="text">
            <h4 className="eyebrow">Selected recordings</h4>
          </Reveal>
          <div className="mt-6">
            <Discography releases={releases} />
          </div>
        </Container>
      )}

      {/* 22-10 correction (item 9 / P32-X304 "Remove from here"): the separate
          end-title memorial no longer renders — the lifetime dates sit beside
          the name in the Musicians line above ("Ike Willis (12 nov 1955- 16
          may 2026) · …", X308 exact wording). The memorial fields and toggle
          stay in the Studio untouched; the page simply never shows a separate
          dedication panel any more. */}
    </article>
  );
}
