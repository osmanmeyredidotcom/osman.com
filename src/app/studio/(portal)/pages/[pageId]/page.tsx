import { notFound } from "next/navigation";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { PageHeader } from "@/components/studio/PageHeader";
import { PageCopyForm } from "@/components/studio/PageCopyForm";
import {
  copyPage,
  GALLERY_PAGE_ID,
  GALLERY_SLOTS,
  type CopyField,
} from "@/data/page-copy";
import { HOME_GALLERY } from "@/data/home-gallery";

export const dynamic = "force-dynamic";

/** Public route per copy page, for the "View the page" link. */
const PUBLIC_ROUTES: Record<string, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  "service-concerts": "/services/concerts",
  "service-live-piano": "/services/piano-for-events",
  "service-music-production": "/services/music-production",
  "service-original-scores": "/services/music-library",
  contact: "/contact",
  [GALLERY_PAGE_ID]: "/",
};

/** The gallery editor is generated: five plain fields per photo slot. */
function galleryFields(): CopyField[] {
  const fields: CopyField[] = [];
  for (let n = 1; n <= GALLERY_SLOTS; n++) {
    const d = HOME_GALLERY[n - 1];
    fields.push(
      {
        key: `slot${n}.src`,
        label: `Photo ${n} (site path or full URL)`,
        kind: "image",
        help: n <= HOME_GALLERY.length ? undefined : "Leave empty to keep this slot unused.",
        default: d?.src ?? "",
      },
      {
        key: `slot${n}.alt`,
        label: `Photo ${n} description (for screen readers)`,
        kind: "short",
        default: d?.alt ?? "",
      },
      {
        key: `slot${n}.aspect`,
        label: `Photo ${n} shape`,
        kind: "short",
        help: "portrait, landscape or landscape-wide.",
        default: d?.aspect ?? "portrait",
      },
      {
        key: `slot${n}.width`,
        label: `Photo ${n} width in pixels`,
        kind: "short",
        default: d ? String(d.width) : "",
      },
      {
        key: `slot${n}.height`,
        label: `Photo ${n} height in pixels`,
        kind: "short",
        default: d ? String(d.height) : "",
      }
    );
  }
  return fields;
}

export async function generateMetadata({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params;
  const page = copyPage(pageId);
  if (pageId === GALLERY_PAGE_ID) return { title: "Homepage gallery" };
  return { title: page ? page.title : "Pages" };
}

export default async function StudioPageCopy({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;
  const page = copyPage(pageId);
  const isGallery = pageId === GALLERY_PAGE_ID;
  if (!page && !isGallery) notFound();

  const stored = await getRepos().copy.getAll();
  const fields = isGallery ? galleryFields() : page!.fields;
  const title = isGallery ? "Homepage gallery" : page!.title;
  const blurb = isGallery
    ? "Eight photo slots, shown in this order. Empty slots are skipped; photos are never cropped, so fill in each photo's real shape and pixel size."
    : page!.blurb;
  const publicRoute = PUBLIC_ROUTES[pageId];

  return (
    <div className="space-y-8">
      <PageHeader title={title} intro={blurb}>
        {publicRoute && (
          <Link
            href={publicRoute}
            target="_blank"
            className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            View the page
          </Link>
        )}
      </PageHeader>
      <PageCopyForm pageId={pageId} fields={fields} stored={stored} />
    </div>
  );
}
