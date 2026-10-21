import Image from "next/image";
import type { CollaborationRecord, ReleaseRecord } from "@/lib/types";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Discography } from "./Discography";
import { TrackedLink } from "./TrackedLink";

/**
 * Collaboration / band-project feature — precision pack 02 §4/§12.
 *
 * Archival tone, clearly separated from Osman's solo image: explicit
 * COLLABORATION / BAND PROJECT label, project-first billing, visible photo
 * credit next to the image, related releases with their real billing, and —
 * where set — a restrained film-style dedication panel (02 §6): near-black,
 * no commercial CTA, nothing promotional.
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
          <p className="tabular inline-block border border-line-dark px-2.5 py-1 text-[11px] tracking-[0.16em] text-ink-soft uppercase">
            Collaboration / Band project
          </p>
          <h3 className="display-caps mt-5 text-4xl sm:text-6xl">{collaboration.name}</h3>
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

        {collaboration.externalUrl && (
          <Reveal variant="text" delay={140}>
            <p className="mt-6">
              <TrackedLink
                href={collaboration.externalUrl}
                external
                event="collab_link_click"
                eventProps={{ collaboration: collaboration.slug }}
                className="u-link text-sm hover:text-accent-strong"
              >
                {collaboration.name} elsewhere
              </TrackedLink>
            </p>
          </Reveal>
        )}

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

      {/* Restrained end-title dedication (pack 02 §6): near-black panel,
          film-credit typography, no CTA of any kind beside it. */}
      {collaboration.showMemorial && collaboration.memorialName && (
        <div className="bg-stage">
          <Container>
            <div className="flex min-h-[38vh] flex-col items-center justify-center py-20 text-center">
              <Reveal variant="text">
                <p className="tabular text-xs tracking-[0.3em] text-ink-faint uppercase">
                  {collaboration.memorialTitle ?? "In memory of"}
                </p>
                <p className="display-caps mt-5 text-3xl text-ink sm:text-5xl">
                  {collaboration.memorialName}
                </p>
                {collaboration.memorialYears && (
                  <p className="tabular mt-4 text-sm tracking-[0.24em] text-ink-soft">
                    {collaboration.memorialYears}
                  </p>
                )}
                {collaboration.memorialText && (
                  <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
                    {collaboration.memorialText}
                  </p>
                )}
              </Reveal>
            </div>
          </Container>
        </div>
      )}
    </article>
  );
}
