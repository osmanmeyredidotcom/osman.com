import type { ReactNode } from "react";
import { getRepos } from "@/server/repositories";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { Cursor } from "@/components/motion/Cursor";
import { RouteLoadingCue } from "@/components/public/RouteLoadingCue";
import { ImageRecovery } from "@/components/public/ImageRecovery";

// Settings (footer socials, contact email) are editable in the Studio and must
// appear without a rebuild.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await getRepos().settings.get();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-canvas"
      >
        Skip to content
      </a>
      <SiteHeader settings={settings} />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} />
      <Cursor />
      <RouteLoadingCue />
      {/* Self-healing images: a photo that failed while the optimizer was
          cold re-requests itself instead of staying black (24-09). */}
      <ImageRecovery />
    </>
  );
}
