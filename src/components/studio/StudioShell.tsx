"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/server/actions/auth";
import { LogoWordmark } from "@/components/LogoWordmark";

const NAV = [
  { href: "/studio", label: "Dashboard", exact: true },
  { href: "/studio/pages", label: "Pages" },
  { href: "/studio/events", label: "Shows" },
  { href: "/studio/videos", label: "Live videos" },
  { href: "/studio/releases", label: "Releases" },
  { href: "/studio/collaborations", label: "Collaborations" },
  { href: "/studio/library", label: "Music library" },
  { href: "/studio/media", label: "Media" },
  { href: "/studio/faqs", label: "Practical Q&A" },
  { href: "/studio/shop", label: "Shop" },
  { href: "/studio/settings", label: "Site settings" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Studio" className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const active =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-canvas-soft font-medium text-accent-strong"
                : "text-ink-soft hover:bg-canvas-soft hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="space-y-1 border-t border-line pt-4">
      <a
        href="/"
        target="_blank"
        rel="noopener"
        className="block rounded-md px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-canvas-soft hover:text-ink"
      >
        View live site
        <span aria-hidden="true" className="ml-1 text-ink-faint">
          &#8599;
        </span>
      </a>
      <form action={logoutAction}>
        <button
          type="submit"
          className="w-full rounded-md px-3 py-2 text-left text-sm text-ink-soft transition-colors hover:bg-canvas-soft hover:text-ink"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

export function StudioShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Mobile topbar */}
      <header className="flex items-center justify-between border-b border-line px-5 py-3 lg:hidden">
        <Link
          href="/studio"
          aria-label="Osman Studio"
          className="flex items-baseline gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <LogoWordmark className="h-6" />
          <span className="eyebrow">Studio</span>
        </Link>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="studio-mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>
      {menuOpen ? (
        <div id="studio-mobile-nav" className="border-b border-line px-3 py-3 lg:hidden">
          <NavLinks onNavigate={() => setMenuOpen(false)} />
          <div className="mt-3">
            <SidebarFooter />
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-(--container-site)">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col justify-between border-r border-line px-3 py-6 lg:flex">
          <div className="space-y-6">
            <div className="px-3">
              <Link href="/studio" aria-label="Osman Studio" className="block text-ink">
                <LogoWordmark className="h-7" />
                <span className="eyebrow mt-1.5 block">Studio</span>
              </Link>
              <p className="mt-1 truncate text-xs text-ink-faint">{userName}</p>
            </div>
            <NavLinks />
          </div>
          <SidebarFooter />
        </aside>

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
