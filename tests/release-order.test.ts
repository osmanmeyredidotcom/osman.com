import { describe, expect, it } from "vitest";
import { byReleaseDateDesc } from "@/lib/releaseOrder";
import { demoReleases } from "@/data/demo/content";

describe("homepage records shelf order (31-10 brief §4)", () => {
  it("runs newest to oldest by release date over the homepage set", () => {
    const shelf = demoReleases
      .filter((r) => r.status === "PUBLISHED" && r.rightsStatus !== "DO_NOT_PUBLISH")
      .sort(byReleaseDateDesc)
      .map((r) => r.title);
    expect(shelf).toEqual([
      "Dance With This Mess",
      "Falling for You",
      "Keep Your Eye on the Sparrow (Special 45 Version)",
      "L’omino",
      "Highway Maintenance",
    ]);
  });

  it("uses full dates within a year, then the Studio order, and puts undated last", () => {
    const rows = [
      { title: "undated", year: null, releaseDate: null, sortOrder: 1 },
      { title: "spring", year: 2024, releaseDate: "2024-03-01", sortOrder: 2 },
      { title: "autumn", year: 2024, releaseDate: "2024-10-01", sortOrder: 9 },
      { title: "year-only-a", year: 2023, releaseDate: null, sortOrder: 5 },
      { title: "year-only-b", year: 2023, releaseDate: "2023-06-01", sortOrder: 4 },
      { title: "date-only", year: null, releaseDate: "2025-01-01", sortOrder: 7 },
    ];
    expect([...rows].sort(byReleaseDateDesc).map((r) => r.title)).toEqual([
      "date-only",
      "autumn",
      "spring",
      "year-only-b",
      "year-only-a",
      "undated",
    ]);
  });

  it("is one consistent ranking for mixed dated / year-only records in a year", () => {
    // Review case: March (Studio order 5), year-only (6), October (7).
    const rows = [
      { title: "march", year: 2026, releaseDate: "2026-03-01", sortOrder: 5 },
      { title: "year-only", year: 2026, releaseDate: null, sortOrder: 6 },
      { title: "october", year: 2026, releaseDate: "2026-10-01", sortOrder: 7 },
    ];
    const perms = [
      [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0],
    ].map((p) => p.map((i) => rows[i]));
    for (const p of perms) {
      expect(p.sort(byReleaseDateDesc).map((r) => r.title)).toEqual(["october", "march", "year-only"]);
    }
  });
});
