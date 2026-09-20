import Link from "next/link";
import { PageHeader } from "@/components/studio/PageHeader";
import { COPY_PAGES, GALLERY_PAGE_ID } from "@/data/page-copy";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pages" };

/**
 * Pages — the copy editor index (content-governance pass). Each entry opens
 * a plain-language form of that page's wording, photos and SEO fields.
 * Structured content (shows, videos, releases, media, Q&A, shop) keeps its
 * own dedicated sections.
 */
export default function StudioPagesIndex() {
  const entries = [
    ...COPY_PAGES.map((p) => ({ id: p.id, title: p.title, blurb: p.blurb })),
    {
      id: GALLERY_PAGE_ID,
      title: "Homepage gallery",
      blurb: "The scrolling photo strip on the homepage: swap photos, change their order or descriptions.",
    },
  ];
  return (
    <div className="space-y-8">
      <PageHeader
        title="Pages"
        intro="Edit the wording, photos and SEO of each page. Anything left unchanged keeps the approved text; clearing a field also returns it to the approved text."
      />
      <ul className="divide-y divide-line border-y border-line">
        {entries.map((p) => (
          <li key={p.id}>
            <Link
              href={`/studio/pages/${p.id}`}
              className="block px-1 py-5 transition-colors hover:bg-canvas-soft"
            >
              <span className="font-display text-lg text-ink">{p.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{p.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
