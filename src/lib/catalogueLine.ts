import type { ReleaseRecord } from "./types";

/**
 * The catalogue line an own release shows in its framed label on /music,
 * where collaborations show their billing tag (Jolene, 9-11-2026, "Urgent":
 * instead of an "Own release" / "Solo work" badge, "℗ 2026 Meyredi Records –
 * MEY001D"; ℗ as written in her Additional Singles overview, VP 12-11).
 *
 * Built from the Studio record (Label + Catalogue number + Year), so every
 * future own release carries its own approved number and year; nothing is
 * reused. No line unless both the label and the catalogue number are set,
 * and never for collaborations or features (they keep their billing tag).
 */
export function catalogueLine(
  release: Pick<
    ReleaseRecord,
    "relationshipType" | "labelName" | "catalogNumber" | "year" | "releaseDate"
  >
): string | null {
  if (release.relationshipType !== "OWN_RELEASE") return null;
  const label = release.labelName?.trim();
  const catalogue = release.catalogNumber?.trim();
  if (!label || !catalogue) return null;
  const year =
    release.year ?? (release.releaseDate ? Number(release.releaseDate.slice(0, 4)) : null);
  return `℗ ${year ? `${year} ` : ""}${label} – ${catalogue}`;
}
