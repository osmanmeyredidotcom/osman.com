import { describe, expect, it } from "vitest";
import { linkBareUrls, plainCopy } from "@/lib/copyLinks";
import { videoJsonLd } from "@/lib/seo";
import { demoVideos } from "@/data/demo/content";

const FULL_VIDEO = "https://www.youtube.com/watch?v=Gvl2r93A52Q";

describe("copy links (November N5a)", () => {
  it("turns a pasted address into a link labelled by the address", () => {
    expect(linkBareUrls(`To see the full video: ${FULL_VIDEO}`)).toBe(
      `To see the full video: [${FULL_VIDEO}](${FULL_VIDEO})`
    );
  });

  it("keeps sentence punctuation outside the link", () => {
    expect(linkBareUrls(`Watch ${FULL_VIDEO}.`)).toBe(`Watch [${FULL_VIDEO}](${FULL_VIDEO}).`);
  });

  it("leaves the existing link syntax alone", () => {
    const value = `Visit [Meyredi Records](https://www.meyredirecords.com).`;
    expect(linkBareUrls(value)).toBe(value);
  });

  it("works across Studio line endings", () => {
    expect(linkBareUrls(`Highlights.\r\n\r\nTo see the full video: ${FULL_VIDEO}`)).toBe(
      `Highlights.\r\n\r\nTo see the full video: [${FULL_VIDEO}](${FULL_VIDEO})`
    );
  });

  it("gives structured data the plain-text form", () => {
    expect(plainCopy(`One.\n\nSee [Meyredi Records](https://www.meyredirecords.com).`)).toBe(
      "One. See Meyredi Records."
    );
  });

  it("keeps the Ike Willis entry single, 2018, on the highlights clip", () => {
    const ike = demoVideos.filter((v) => /Ike Willis/.test(v.title));
    expect(ike).toHaveLength(1);
    expect(ike[0].year).toBe(2018);
    expect(ike[0].videoUrl).toBe("https://youtu.be/doANHOS64Ks");
    const ld = videoJsonLd(ike[0]);
    expect(ld.description).toBe(
      `Highlights of Osman Meyredi, being on tour across the U.K. with Frank Zappa's longtime vocalist Ike Willis and Zappatika. To see the full video: ${FULL_VIDEO}`
    );
    expect(ld.embedUrl).toBe("https://www.youtube-nocookie.com/embed/doANHOS64Ks");
  });

  it("has each video address once", () => {
    const urls = demoVideos.map((v) => v.videoUrl);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
