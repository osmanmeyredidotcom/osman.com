import { Fragment } from "react";
import Link from "next/link";

/**
 * Renders a Studio-editable copy value safely (content-governance §27):
 *
 * - Blank lines split paragraphs; single newlines become line breaks.
 * - Inline links written as [text](/internal-path) or [text](https://…)
 *   render as the site's underlined link. Anything else stays plain text —
 *   no raw HTML, ever.
 *
 * `as`/`className` style each paragraph; single-paragraph values can also
 * be rendered inline via <CopyInline>.
 */

const LINK_RE = /\[([^\]\n]{1,120})\]\((\/[^)\s]*|https:\/\/[^)\s]+)\)/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const [full, label, href] = m;
    const at = m.index ?? 0;
    if (at > last) out.push(withBreaks(text.slice(last, at), `${keyPrefix}-t${i}`));
    out.push(
      href.startsWith("/") ? (
        <Link key={`${keyPrefix}-l${i}`} href={href} className="u-link">
          {label}
        </Link>
      ) : (
        <a
          key={`${keyPrefix}-l${i}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="u-link"
        >
          {label}
        </a>
      )
    );
    last = at + full.length;
    i += 1;
  }
  if (last < text.length) out.push(withBreaks(text.slice(last), `${keyPrefix}-tail`));
  return out;
}

function withBreaks(text: string, key: string): React.ReactNode {
  const lines = text.split("\n");
  if (lines.length === 1) return <Fragment key={key}>{text}</Fragment>;
  return (
    <Fragment key={key}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </Fragment>
  );
}

export function CopyInline({ value }: { value: string }) {
  return <>{renderInline(value, "c")}</>;
}

export function CopyText({
  value,
  className,
  firstClassName,
}: {
  value: string;
  className?: string;
  /** Optional distinct class for the first paragraph (e.g. lead styling). */
  firstClassName?: string;
}) {
  const paragraphs = value
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className={i === 0 ? (firstClassName ?? className) : className}>
          {renderInline(para, `p${i}`)}
        </p>
      ))}
    </>
  );
}
