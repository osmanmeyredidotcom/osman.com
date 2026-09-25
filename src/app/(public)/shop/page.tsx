import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { Container } from "@/components/shared/Container";
import { TrackedLink } from "@/components/public/TrackedLink";
import { Reveal } from "@/components/motion/Reveal";
import { ConceptVisual, ExampleVisual } from "@/components/public/ShopVisuals";
import { SHOP_EXAMPLES } from "@/data/shop-examples";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Objects from Osman Meyredi's world, built around listening, rhythm, space and sound. A small collection in development.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const repos = getRepos();
  const [settings, allProducts] = await Promise.all([
    repos.settings.get(),
    repos.products.list(),
  ]);

  const concepts = allProducts
    .filter((p) => p.status === "CONCEPT")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="py-24 sm:py-32">
      <Container wide>
        <Reveal variant="text">
          <p className="eyebrow">Shop</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
            Objects built around listening
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            A small collection is taking shape: printed matter, studio objects and editions that
            come out of the same habits as the music: listening closely, keeping time, leaving
            space. Everything is made slowly and on purpose, which is also why it isn&rsquo;t for
            sale yet.
          </p>
        </Reveal>

        {settings.shopMode === "external" && settings.shopUrl && (
          <Reveal variant="text" delay={120}>
            <p className="mt-10">
              <TrackedLink
                href={settings.shopUrl}
                external
                event="shop_click"
                eventProps={{ source: "shop_page" }}
                className="btn-pill"
              >
                Visit the shop <span className="arrow-nudge ml-1" aria-hidden="true">→</span>
              </TrackedLink>
            </p>
          </Reveal>
        )}

        {settings.shopMode === "storefront" && (
          <div className="mt-10 border border-line bg-canvas-soft px-6 py-5">
            <p className="text-sm text-ink-soft">
              The storefront is configured through the site&rsquo;s commerce adapter. Products
              will appear here once the integration is switched on.
            </p>
          </div>
        )}

        {settings.shopMode === "concept" && (
          <>
            {/* 25-09-2026 shop preview: example pieces first (always labelled,
                nothing for sale), then the Studio's own concept products, all
                as finished shop cards with a product shot, so the page shows
                how the shop will look once it opens. */}
            <div className="mt-16 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-line pt-6">
              <p className="eyebrow">A first look</p>
              <p className="text-sm text-ink-soft">
                Example pieces, to show how the shop will look. Nothing is for sale yet.
              </p>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-4 lg:gap-y-16">
              {SHOP_EXAMPLES.map((item, i) => (
                <li key={item.id} className="shop-card group/shop">
                  <Reveal variant="card" delay={Math.min(i, 3) * 80}>
                    <div className="shop-visual">
                      <ExampleVisual visual={item.visual} />
                      <span className="shop-flag">Example</span>
                    </div>
                    <p className="eyebrow mt-5">{item.category}</p>
                    <h2 className="font-display mt-2 text-lg leading-snug sm:text-xl">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.detail}</p>
                    <p className="shop-price">Coming soon</p>
                  </Reveal>
                </li>
              ))}
              {concepts.map((product, i) => (
                <li key={product.id} className="shop-card group/shop">
                  <Reveal variant="card" delay={Math.min(SHOP_EXAMPLES.length + i, 3) * 80}>
                    <div className="shop-visual">
                      <ConceptVisual product={product} />
                      <span className="shop-flag">Concept</span>
                    </div>
                    <p className="eyebrow mt-5">{product.category}</p>
                    <h2 className="font-display mt-2 text-lg leading-snug sm:text-xl">{product.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                      {product.description}
                    </p>
                    <p className="shop-price">{product.priceText ?? "Coming soon"}</p>
                  </Reveal>
                </li>
              ))}
            </ul>

            <p className="mt-20 max-w-2xl border-t border-line pt-8 text-sm leading-relaxed text-ink-soft">
              These pieces are in development, not on sale. No dates promised. If you&rsquo;d
              like to know when the first ones are ready, follow along on the social channels in
              the footer, or{" "}
              <Link href="/contact" className="u-link">
                drop a line
              </Link>{" "}
              and mention the shop.
            </p>
          </>
        )}
      </Container>
    </section>
  );
}
