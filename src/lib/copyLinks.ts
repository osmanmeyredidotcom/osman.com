/**
 * Inline links in Studio-editable copy (content-governance §27).
 *
 * Copy fields write links as [text](/internal-path) or [text](https://…);
 * <CopyText> renders them as the site's underlined link. These helpers
 * share that one definition with the places that need plain text (JSON-LD)
 * or that also accept a pasted address on its own (video descriptions).
 */

export const COPY_LINK_RE = /\[([^\]\n]{1,120})\]\((\/[^)\s]*|https:\/\/[^)\s]+)\)/g;

/** A bare https address preceded by the start of the text or whitespace. */
const BARE_URL_RE = /(^|\s)(https:\/\/[^\s<>()[\]]+)/g;

/** Sentence punctuation that ends a sentence rather than the address. */
const TRAILING_PUNCTUATION = /[.,;:!?'"’”]+$/;

/**
 * Turns bare https addresses into the copy link syntax, labelled by the
 * address itself, so <CopyText> renders them as links. Addresses already
 * inside the link syntax are left alone, and so is anything too long for a
 * link label (it stays readable as plain text).
 */
export function linkBareUrls(value: string): string {
  return value.replace(BARE_URL_RE, (match, lead: string, url: string) => {
    const trail = url.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    const href = trail ? url.slice(0, -trail.length) : url;
    if (href.length > 120 || href === "https://") return match;
    return `${lead}[${href}](${href})${trail}`;
  });
}

/** Plain-text form of a copy value: links become their labels, whitespace one space. */
export function plainCopy(value: string): string {
  return value.replace(COPY_LINK_RE, "$1").replace(/\s+/g, " ").trim();
}
