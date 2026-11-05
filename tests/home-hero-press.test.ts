/**
 * Homepage, 5-11 (VP): the hero text shares the "On stage soon" left edge
 * (Container wide) with fluid, slightly larger type that stops before
 * Osman's jacket on md+, and the press band is gone from the homepage.
 * Source-level guards; the layout itself was checked in a browser at
 * 390 to 2560px.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(path.join(process.cwd(), p), "utf8");
const home = read("src/app/(public)/page.tsx");
const css = read("src/app/globals.css");

/** The body of one top-level CSS rule, e.g. `.hero-roles { … }`. */
function rule(selector: string): string {
  const at = css.indexOf(`\n${selector} {`);
  expect(at, selector).toBeGreaterThan(-1);
  return css.slice(at, css.indexOf("}", at));
}

describe("homepage hero text", () => {
  it("sits in Container wide, the same edge as On stage soon", () => {
    const foot = home.slice(home.indexOf('className="hero-foot'), home.indexOf("hero-image-mask"));
    expect(foot).toContain("<Container wide>");
    expect(foot).not.toContain("md:px-[clamp(");
    expect(home).toMatch(/<Container wide>\s*<Reveal variant="text">[\s\S]{0,400}On stage soon/);
  });

  it("scales the artist line, button and link with the viewport", () => {
    for (const sel of [".hero-roles", ".hero-cta", ".hero-link"]) {
      expect(rule(sel), sel).toMatch(/font-size:\s*clamp\(/);
    }
    // never smaller than before on phones: 12px line, 12.8px button, 14px link
    expect(rule(".hero-roles")).toContain("clamp(0.75rem");
    expect(rule(".hero-cta")).toContain("clamp(0.8rem");
    expect(rule(".hero-link")).toContain("clamp(0.875rem");
  });

  it("keeps the block left of the jacket on md+", () => {
    expect(css).toMatch(/\.hero-meta\s*\{\s*max-width:\s*min\(57\.5vw - 32px, 7\.5vw \+ 544px\)/);
  });
});

describe("homepage press band", () => {
  it("is removed from the homepage", () => {
    expect(home).not.toContain("press-band");
    expect(home).not.toContain("featuredMedia");
    expect(home).not.toContain("repos.media.list()");
    expect(css).not.toContain(".press-band");
  });

  it("leaves the interview as the section after the gallery, with its own top border", () => {
    const gallery = home.indexOf("<HomeScrollGallery");
    const interview = home.indexOf('<section aria-labelledby="home-interview"');
    expect(gallery).toBeGreaterThan(-1);
    expect(interview).toBeGreaterThan(gallery);
    expect(home.slice(gallery, interview)).not.toMatch(/<section\b/);
    expect(home).toContain('aria-labelledby="home-interview" className="border-t border-line py-24"');
  });
});
