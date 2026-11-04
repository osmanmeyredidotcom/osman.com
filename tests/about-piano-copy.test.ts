/**
 * 4-11-2026 (Jolene, via VP): the Bio intro is replaced word for word in two
 * paragraphs, and the Live Piano "Want to hear what it sounds like?" slot
 * plays Osman Meyredi's own YouTube preview instead of "Coming soon".
 */
import { describe, expect, it } from "vitest";
import { copyDefaults } from "@/data/page-copy";
import { splitCopy } from "@/components/public/CopyText";
import { embedUrl, youtubeId } from "@/lib/embed";

describe("Bio intro", () => {
  const paras = splitCopy(copyDefaults("about")["intro"]);

  it("is the client's text, in two paragraphs", () => {
    expect(paras).toHaveLength(2);
    expect(paras[0]).toMatch(/^Osman Meyredi is an Italian-born multi-instrumentalist/);
    expect(paras[0]).toMatch(/never quite predictable\.$/);
    expect(paras[1]).toMatch(/^Trained as a classical double bassist/);
    expect(paras[1]).toContain("He settled in the Netherlands in 2014 to escape from the mountains that blocked his view.");
    expect(paras[1]).toContain("he co-launched his own label, Meyredi Records");
    expect(paras[1]).toMatch(/His debut album follows in April 2027\.$/);
  });

  it("drops the replaced lines and keeps the copy rules", () => {
    const all = paras.join(" ");
    expect(all).not.toContain("1,000 euros");
    expect(all).not.toContain("It’s out on 20 October 2026");
    expect(all).not.toContain("—");
  });
});

describe("Live Piano listen video", () => {
  const c = copyDefaults("service-live-piano");

  it("plays the YouTube preview through the privacy-enhanced player", () => {
    expect(youtubeId(c["listenVideo"])).toBe("B_5JO87fpgI");
    expect(embedUrl("youtube", c["listenVideo"])).toBe(
      "https://www.youtube-nocookie.com/embed/B_5JO87fpgI?autoplay=1&rel=0"
    );
    expect(c["listenVideoPoster"]).toBe("https://i.ytimg.com/vi/B_5JO87fpgI/maxresdefault.jpg");
    expect(c["listenVideoTitle"]).toContain("Osman Meyredi");
  });
});
