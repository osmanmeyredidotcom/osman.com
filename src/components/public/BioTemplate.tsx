import type { ReactNode } from "react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CopyText, splitCopy } from "@/components/public/CopyText";

/**
 * The Bio template — 4-11 feedback (Concerts, Live Piano and Music
 * Production "designed like the bio one", N04-17/18/19). Bio is the only
 * layout to copy, so these parts ARE Bio's: Bio itself renders through them
 * and the three service pages use the same pieces, never look-alikes.
 *
 * The composition, top to bottom:
 *  1. TitleBand: eyebrow and H1 on the site's left edge (Container wide),
 *     with the service tags line where a page has one;
 *  2. the full-width PageBanner (3:2 on phones, 2880 × 1350 from 640px up);
 *  3. BioSection blocks: Bio's reading column (READING_COLUMN: since 22-11
 *     the page container's full content width, 1088px on desktop; 42rem
 *     until 19-11, 54rem until 22-11) on the same left edge as the eyebrow
 *     and H1 (VP, 16-11: "left aligned uniform with the whole website"; it
 *     used to sit centred), Bio's vertical rhythm (64px / 80px padding, a
 *     hairline between sections), the lead in .tpl-lead, chapter headings
 *     and body copy in Bio's sizes;
 *  4. Read more where the copy runs long (the shared <ReadMore>);
 *  5. one rounded pill CTA on the column's left edge (TemplateCta).
 *
 * Measured on Bio (1440 / 390): eyebrow Inter 11.52px 700, H1 Archivo
 * 48 / 36px 620, chapter heading 36 / 30px, body Inter 16 / 26px, column
 * x 176 / 20 (the eyebrow's edge) and 1088 / 350 wide, Read more 13px,
 * pill 160 × 47.
 */

/**
 * Bio's reading column, shared by Bio, Concerts, Live Piano, Music
 * Production and Custom Music. 19-11 (N19-04/05, Jolene: "just increase
 * the width a little bit. It also makes us less scrolling"; Varsha: "let's
 * just increase the width to match this so that everything is balanced";
 * "apply that same width to all these inner pages"): first 672 → 864px.
 * 22-11 (VP: "the pages on this template … are looking very empty on the
 * right hand side, so you have to increase the width enough to not make it
 * look empty there"): no cap of its own any more, so the column runs the
 * page container's full content width (1088px on desktop, the edges of the
 * header's logo and menu button), with equal margins left and right. The
 * Concerts closing line stays on one line; the intro keeps its lighter
 * weight and size.
 */
export const READING_COLUMN = "max-w-none";

export function TitleBand({
  eyebrow,
  title,
  tags,
}: {
  eyebrow: string;
  title: ReactNode;
  /** The service categories line (Studio), e.g. "Festivals · Venues · Events". */
  tags?: string;
}) {
  return (
    <Container wide>
      <Reveal variant="text">
        <p className="eyebrow pt-14 sm:pt-16">{eyebrow}</p>
        <h1
          className={`font-display mt-4 text-4xl leading-tight sm:text-5xl ${
            tags ? "" : "pb-10 sm:pb-12"
          }`}
        >
          {title}
        </h1>
        {tags && (
          <p className="tabular mt-4 pb-10 text-sm tracking-[0.14em] text-ink-faint uppercase sm:pb-12">
            {tags}
          </p>
        )}
      </Reveal>
    </Container>
  );
}

/** One block of the reading column, with Bio's padding; `divider` adds the
 *  hairline Bio draws between its intro and its story. */
export function BioSection({
  children,
  divider = false,
  className = "",
  labelledBy,
}: {
  children: ReactNode;
  divider?: boolean;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={`py-16 sm:py-20 ${divider ? "border-t border-line" : ""} ${className}`}
    >
      <Container wide>
        <div className={READING_COLUMN}>{children}</div>
      </Container>
    </section>
  );
}

/** The lead statement under the banner (Bio's introduction style). */
export function LeadCopy({ value }: { value: string }) {
  return (
    <Reveal variant="text">
      <div className="space-y-6">
        <CopyText value={value} className="tpl-lead text-ink" />
      </div>
    </Reveal>
  );
}

/** A chapter heading in the reading column (Bio's chapter size). */
export function ChapterHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="font-display text-3xl sm:text-4xl">
      {children}
    </h2>
  );
}

/** Body copy in the reading column: Bio's paragraphs, a paragraph apart. */
export function BodyCopy({ value, className = "" }: { value: string; className?: string }) {
  if (splitCopy(value).length === 0) return null;
  return (
    <div className={`space-y-6 ${className}`}>
      <CopyText value={value} className="leading-relaxed text-ink-soft" />
    </div>
  );
}

/** The closing CTA slot: Bio's spacing above the one pill. */
export function TemplateCta({ children, className = "mt-12" }: { children: ReactNode; className?: string }) {
  return (
    <Reveal variant="text">
      <p className={className}>{children}</p>
    </Reveal>
  );
}
