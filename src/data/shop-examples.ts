/**
 * Shop preview (25-09-2026): example pieces that show how the shop will look
 * once it opens ("add some example items to give a rough idea how it will
 * look at final"). Shown only while the shop is in concept mode, before the
 * Studio's own concept products, and always labelled as examples: nothing
 * here is for sale. Swap or delete entries freely; the page needs no other
 * change. Images are the site's own artwork and photos; apparel and
 * accessories are drawn mock-ups carrying the OM mark.
 */
export type ShopExampleVisual =
  | { kind: "record"; artworkUrl: string; title: string; year: number | null }
  | { kind: "print"; src: string; alt: string; width: number; height: number }
  | { kind: "tee" }
  | { kind: "tote" }
  | { kind: "picks" };

export type ShopExample = {
  id: string;
  title: string;
  /** Kind of piece · format, shown above the title. */
  category: string;
  detail: string;
  visual: ShopExampleVisual;
};

export const SHOP_EXAMPLES: ShopExample[] = [
  {
    id: "example-vinyl",
    title: "Dance With This Mess",
    category: "Music · 7-inch vinyl",
    detail: "Osman Meyredi's own single, pressed on vinyl.",
    visual: {
      kind: "record",
      artworkUrl: "/images/releases/dance-with-this-mess.jpg",
      title: "Dance With This Mess",
      year: 2021,
    },
  },
  {
    id: "example-print",
    title: "Live print, black and white",
    category: "Editions · Archival print",
    detail: "A live photograph printed on heavy paper, A3.",
    visual: {
      kind: "print",
      src: "/images/gallery/gallery-01-keys-live.jpg",
      alt: "Osman Meyredi at the microphone behind a keyboard, black and white",
      width: 2508,
      height: 1400,
    },
  },
  {
    id: "example-tee",
    title: "OM tee",
    category: "Apparel · Heavyweight cotton",
    detail: "A heavyweight tee with the OM mark on the chest.",
    visual: { kind: "tee" },
  },
  {
    id: "example-tote",
    title: "Score tote",
    category: "Accessories · Canvas bag",
    detail: "Sized for scores, cables and a laptop.",
    visual: { kind: "tote" },
  },
  {
    id: "example-picks",
    title: "Plectrum set",
    category: "Accessories · Guitar picks",
    detail: "Three picks in three weights, stamped with the OM mark.",
    visual: { kind: "picks" },
  },
];
