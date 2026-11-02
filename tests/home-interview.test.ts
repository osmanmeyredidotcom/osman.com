/**
 * Homepage interview (2-11, VP): the Storytime · Evoluzione Radio interview
 * under the press band. Guards the client copy rules on the new defaults
 * (full name, no em dashes) and that the default video and still ship with
 * the site, so the section never renders a broken player.
 */
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { copyDefaults } from "@/data/page-copy";

const home = copyDefaults("home");
const KEYS = [
  "interview.heading",
  "interview.text",
  "interview.video",
  "interview.poster",
  "interview.videoTitle",
] as const;

describe("homepage interview copy", () => {
  it("declares every interview field with a default", () => {
    for (const key of KEYS) expect(home[key], key).toBeTruthy();
  });

  it("follows the client copy rules", () => {
    for (const key of ["interview.heading", "interview.text", "interview.videoTitle"]) {
      expect(home[key], key).not.toContain("—");
    }
    expect(home["interview.heading"]).toContain("Osman Meyredi");
    expect(home["interview.videoTitle"]).toContain("Osman Meyredi");
  });

  it("ships the default video and still", () => {
    for (const key of ["interview.video", "interview.poster"]) {
      const file = path.join(process.cwd(), "public", home[key]);
      expect(existsSync(file), file).toBe(true);
      expect(statSync(file).size, file).toBeGreaterThan(10_000);
    }
    // GitHub refuses files over 100 MB and warns from 50 MB.
    const video = path.join(process.cwd(), "public", home["interview.video"]);
    expect(statSync(video).size).toBeLessThan(50 * 1024 * 1024);
  });
});
