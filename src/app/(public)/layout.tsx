import type { ReactNode } from "react";
import { getRepos } from "@/server/repositories";
import { getServiceNav } from "@/server/copy";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SectionSubnav } from "@/components/public/SectionSubnav";
import { SiteFooter } from "@/components/public/SiteFooter";
import { Cursor } from "@/components/motion/Cursor";
import { RouteLoadingCue } from "@/components/public/RouteLoadingCue";
import { ImageRecovery } from "@/components/public/ImageRecovery";

// Settings (footer socials, contact email) are editable in the Studio and must
// appear without a rebuild.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  // The Studio-editable service names serve both the Services bar and the
  // footer, so they are read once here.
  const [settings, serviceNav] = await Promise.all([
    getRepos().settings.get(),
    getServiceNav(),
  ]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-canvas"
      >
        Skip to content
      </a>
      <SiteHeader settings={settings} />
      {/* 4-11 (N04-20/27): the Services and Shows bar sits beside the page,
          not inside it, so it stays under the header down to the footer
          (see SectionSubnav). Nothing renders on other routes. */}
      <SectionSubnav services={serviceNav} />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} serviceNav={serviceNav} />
      <Cursor />
      <RouteLoadingCue />
      {/* Self-healing images: a photo that failed while the optimizer was
          cold re-requests itself instead of staying black (24-09). */}
      <ImageRecovery />
    </>
  );
}
