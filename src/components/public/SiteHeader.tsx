import Link from "next/link";
import { getServiceNav } from "@/server/copy";
import type { SiteSettings } from "@/lib/types";
import { HeaderScroll } from "./HeaderScroll";
import { FullscreenMenu } from "./FullscreenMenu";
import { LogoWordmark } from "@/components/LogoWordmark";

/**
 * Minimal header: wordmark left, vinyl navigation trigger right — the record
 * is the menu (no inline nav row, no hamburger). All navigation lives in the
 * fullscreen menu. The bar keeps its scroll compaction + translucent veil,
 * and stays above the menu veil (z-70) so the vinyl remains the close control.
 */
export async function SiteHeader({ settings }: { settings: SiteSettings }) {
  const serviceLinks = await getServiceNav();
  return (
    <header className="site-header sticky top-0 z-70 border-b border-line bg-canvas">
      <HeaderScroll />
      <div className="header-inner mx-auto flex h-16 w-full max-w-(--container-site) items-center justify-between px-5 sm:px-8">
        {/* relative z-80 keeps the logotype floating crisp above the menu
            veil (z-60), same layer as the vinyl close control. */}
        <Link
          href="/"
          aria-label="Osman Meyredi, home"
          className="relative z-80 transition-opacity duration-200 hover:opacity-70"
        >
          <LogoWordmark className="h-5 sm:h-6" />
        </Link>
        <FullscreenMenu settings={settings} serviceLinks={serviceLinks} />
      </div>
    </header>
  );
}
