import Link from "next/link";
import { getRepos } from "@/server/repositories";
import type { ShopMode } from "@/lib/types";
import { Chip, ProductStatusChip } from "@/components/studio/StatusChip";
import { EmptyState, PageHeader } from "@/components/studio/PageHeader";
import { RowAction } from "@/components/studio/rowActions";
import { archiveProductAction, duplicateProductAction } from "@/server/actions/products";

export const dynamic = "force-dynamic";

export const metadata = { title: "Shop" };

const MODE_NOTES: Record<ShopMode, string> = {
  concept: "The shop is in concepts-only mode. Items are shown as ideas, without checkout.",
  external: "The shop links out to an external store.",
  storefront: "The shop runs as an integrated storefront.",
};

export default async function ShopPage() {
  const repos = getRepos();
  const [products, settings] = await Promise.all([
    repos.products.list(),
    repos.settings.get(),
  ]);
  const sorted = [...products].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Shop"
        intro="Products and ideas for the shop."
        actionHref="/studio/shop/new"
        actionLabel="Add shop item"
      />

      <p className="rounded-md border border-line bg-canvas-soft px-4 py-3 text-sm text-ink-soft">
        {MODE_NOTES[settings.shopMode]}{" "}
        <Link
          href="/studio/settings"
          className="font-medium text-accent underline-offset-2 hover:underline"
        >
          Change in Site settings
        </Link>
      </p>

      {sorted.length === 0 ? (
        <EmptyState
          message="No shop items yet."
          actionHref="/studio/shop/new"
          actionLabel="Add shop item"
        />
      ) : (
        <ul className="divide-y divide-line rounded-md border border-line">
          {sorted.map((product) => (
            <li key={product.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
              <span className="min-w-0 flex-1">
                <Link
                  href={`/studio/shop/${product.id}`}
                  className="block truncate text-sm font-medium text-ink hover:text-accent-strong"
                >
                  {product.title}
                </Link>
                <span className="block truncate text-xs text-ink-faint">
                  {[product.category, product.priceText].filter(Boolean).join(" · ")}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <ProductStatusChip status={product.status} />
                {product.featured ? <Chip tone="faint">Featured</Chip> : null}
              </span>
              <span className="flex items-center gap-3">
                <Link
                  href={`/studio/shop/${product.id}`}
                  className="text-xs font-medium text-accent underline-offset-2 hover:underline"
                >
                  Edit
                </Link>
                <RowAction action={duplicateProductAction} id={product.id} label="Duplicate" />
                {product.status !== "ARCHIVED" ? (
                  <RowAction action={archiveProductAction} id={product.id} label="Archive" />
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
