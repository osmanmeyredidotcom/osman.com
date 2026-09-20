import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { StudioShell } from "@/components/studio/StudioShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Osman Studio",
    template: "%s | Osman Studio",
  },
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/studio/login");

  return <StudioShell userName={user.name}>{children}</StudioShell>;
}
