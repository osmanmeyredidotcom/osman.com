import type { Metadata } from "next";
import Link from "next/link";
import { getRepos } from "@/server/repositories";
import { Container } from "@/components/shared/Container";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { TrackedLink } from "@/components/public/TrackedLink";
import { Reveal } from "@/components/motion/Reveal";

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
            {concepts.length > 0 && (
              <ul className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {concepts.map((product, i) => (
                  <li key={product.id}>
                    <Reveal variant="card" delay={i * 80} className="border-t border-line pt-6">
                      <div className="media-zoom">
                        <PlaceholderImage
                          label={`Product study: ${product.title}`}
                          ratio="1/1"
                        />
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-4">
                        <h2 className="font-display text-xl">{product.title}</h2>
                        <span className="inline-block shrink-0 border border-line-dark px-2.5 py-0.5 text-xs font-medium tracking-wide text-ink-soft uppercase">
                          Concept
                        </span>
                      </div>
                      <p className="eyebrow mt-1">{product.category}</p>
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                        {product.description}
                      </p>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}

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
