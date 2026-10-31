import type { ReleaseRecord } from "./types";

type Dated = Pick<ReleaseRecord, "year" | "releaseDate" | "sortOrder">;

/** The release's year: its own field, else the year of its release date. */
function releaseYear(r: Dated): number | null {
  if (r.year != null) return r.year;
  return r.releaseDate ? Number(r.releaseDate.slice(0, 4)) : null;
}

/**
 * Newest release first, by the approved release date in the Studio record
 * (HOMEPAGE_RECORDS_CAROUSEL_RESTORE §4). Years decide first, as on the
 * Music page's chronological discography; within one year two full release
 * dates decide; otherwise the existing Studio order holds. Undated releases
 * go last. Featured status, upload time and titles play no part.
 */
export function byReleaseDateDesc(a: Dated, b: Dated): number {
  const ya = releaseYear(a);
  const yb = releaseYear(b);
  if (ya !== yb) {
    if (ya == null) return 1;
    if (yb == null) return -1;
    return yb - ya;
  }
  if (a.releaseDate && b.releaseDate && a.releaseDate !== b.releaseDate) {
    return a.releaseDate < b.releaseDate ? 1 : -1;
  }
  return a.sortOrder - b.sortOrder;
}
