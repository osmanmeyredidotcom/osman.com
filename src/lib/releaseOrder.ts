import type { ReleaseRecord } from "./types";

type Dated = Pick<ReleaseRecord, "year" | "releaseDate" | "sortOrder">;

/** The release's year: its own field, else the year of its release date. */
function releaseYear(r: Dated): number | null {
  if (r.year != null) return r.year;
  return r.releaseDate ? Number(r.releaseDate.slice(0, 4)) : null;
}

/**
 * Newest release first, by the approved release date in the Studio record
 * (HOMEPAGE_RECORDS_CAROUSEL_RESTORE §4). One fixed ranking, so any mix of
 * records sorts the same way every time:
 *  1. year, newest first (as on the Music page's chronological discography);
 *  2. within a year, releases with a full date first, newest date first;
 *  3. then the existing Studio order.
 * Undated releases go last. Featured status, upload time and titles play no
 * part. (A dated and a year-only release in the same year cannot be put in
 * true order; that case needs the real date in the Studio.)
 */
export function byReleaseDateDesc(a: Dated, b: Dated): number {
  const ya = releaseYear(a);
  const yb = releaseYear(b);
  if (ya !== yb) {
    if (ya == null) return 1;
    if (yb == null) return -1;
    return yb - ya;
  }
  const da = a.releaseDate ?? "";
  const db = b.releaseDate ?? "";
  if (da !== db) {
    if (!da) return 1;
    if (!db) return -1;
    return da < db ? 1 : -1;
  }
  return a.sortOrder - b.sortOrder;
}

/** How many previous releases the homepage records shelf holds (19-11). */
export const HOME_SHELF_MAX = 5;

/** How many releases the Music page lists before its plus (19-11). */
export const MUSIC_LIST_VISIBLE = 5;

/**
 * The homepage's records (19-11, N19-03, Jolene: "the newest one should not
 * be displayed there [in the carousel]"; "five or six max … if a new one
 * comes here, the oldest one will fall off"). By the same release-date
 * ranking as everywhere else: the newest release is the featured one, and
 * the shelf holds the releases before it, newest first, at most
 * HOME_SHELF_MAX. A new upload therefore takes over the feature by itself,
 * the old feature becomes the shelf's first record and the oldest record
 * leaves the homepage (it stays on the Music page). The Studio's
 * "featured" flag plays no part.
 */
export function homepageReleases<T extends Dated>(
  releases: readonly T[],
  max: number = HOME_SHELF_MAX
): { featured: T | null; shelf: T[] } {
  const ordered = [...releases].sort(byReleaseDateDesc);
  return { featured: ordered[0] ?? null, shelf: ordered.slice(1, 1 + max) };
}
