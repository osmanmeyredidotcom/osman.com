import type { ReactNode } from "react";
import { ReadLess } from "./ReadLess";

/**
 * Restructure round (§5/§32): restrained progressive disclosure built on the
 * native <details> element, so it costs no JavaScript and degrades perfectly:
 *
 * - the full approved copy is always in the server-rendered DOM (SEO, §5);
 * - keyboard and screen-reader support come from the platform (summary is a
 *   native disclosure button);
 * - with no JS and no modern CSS it still opens/closes instantly;
 * - in modern browsers the open animates via ::details-content block-size
 *   (see globals.css), reduced-motion gets the instant toggle.
 *
 * Use sparingly — only where the visitor understands the section from the
 * visible opening block and the rest is supporting depth.
 */
export function ReadMore({
  label = "Read more",
  lessLabel = "Read less",
  className = "",
  children,
}: {
  label?: string;
  lessLabel?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <details className={`readmore ${className}`}>
      <summary className="readmore-summary" data-cursor="MORE">
        <span className="readmore-more">
          {label} <span className="readmore-glyph" aria-hidden="true">+</span>
        </span>
        <span className="readmore-less">
          {lessLabel} <span className="readmore-glyph" aria-hidden="true">−</span>
        </span>
      </summary>
      <div className="readmore-content">
        {children}
        {/* 22-10 item 7: a Read less control also sits at the END of the
            expanded content (see ReadLess for the no-JS reasoning). */}
        <ReadLess label={lessLabel} />
      </div>
    </details>
  );
}
