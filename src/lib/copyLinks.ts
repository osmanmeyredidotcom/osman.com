/**
 * Inline links in Studio-editable copy (content-governance §27).
 *
 * Copy fields write links as [text](/internal-path) or [text](https://…);
 * <CopyText> renders them as the site's underlined link. These helpers
 * share that one definition with the places that need plain text (JSON-LD)
 * or that also accept a pasted address on its own (video descriptions).
 */

export const COPY_LINK_RE = /\[([^\]\n]{1,120})\]\((\/[^)\s]*|https:\/\/[^)\s]+)\)/g;

/** A bare https address after the start of the text, a space, an opening
 *  bracket or an opening quote. */
const BARE_URL_RE = /(^|[\s(“‘"'])(https:\/\/[^\s<>[\]]+)/g;

/** Sentence punctuation that ends a sentence rather than the address. */
const TRAILING_PUNCTUATION = /[.,;:!?'"’”]$/;

const count = (s: string, ch: string) => s.split(ch).length - 1;

/**
 * Turns bare https addresses into the copy link syntax, labelled by the
 * address itself, so <CopyText> renders them as links. Sentence
 * punctuation and an unmatched closing bracket after the address stay
 * outside the link. Addresses already inside the link syntax are left
 * alone, and so is anything the link syntax cannot carry exactly (an
 * address with brackets of its own, or one too long for a label): it stays
 * readable as plain text rather than linking somewhere else.
 */
export function linkBareUrls(value: string): string {
  return value.replace(BARE_URL_RE, (match, lead: string, url: string, at: number) => {
    // "](https://…" is the target of an existing [label](…) link.
    if (lead === "(" && value[at - 1] === "]") return match;
    let href = url;
    let trail = "";
    for (;;) {
      if (TRAILING_PUNCTUATION.test(href)) {
        trail = href.slice(-1) + trail;
        href = href.slice(0, -1);
      } else if (href.endsWith(")") && count(href, ")") > count(href, "(")) {
        trail = ")" + trail;
        href = href.slice(0, -1);
      } else {
        break;
      }
    }
    if (href.length > 120 || href === "https://" || /[()]/.test(href)) return match;
    return `${lead}[${href}](${href})${trail}`;
  });
}

/** Plain-text form of a copy value: links become their labels, whitespace one space. */
export function plainCopy(value: string): string {
  return value.replace(COPY_LINK_RE, "$1").replace(/\s+/g, " ").trim();
}
