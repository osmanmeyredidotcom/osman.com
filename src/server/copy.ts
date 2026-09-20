import "server-only";
import { getRepos } from "@/server/repositories";
import { copyDefaults } from "@/data/page-copy";

/**
 * Page copy access (content-governance pass): stored Studio values merged
 * over the registry defaults. `c("key")` always returns a string — an
 * unset or emptied field falls back to the approved default, so fallbacks
 * fill gaps but never overwrite published edits (brief §52).
 */
export async function getPageCopy(pageId: string): Promise<(key: string) => string> {
  const defaults = copyDefaults(pageId);
  let stored: Record<string, string> = {};
  try {
    stored = await getRepos().copy.getAll();
  } catch {
    // Copy store unavailable (e.g. mid-migration): approved defaults render.
  }
  const prefix = `${pageId}.`;
  return (key: string): string => {
    const v = stored[prefix + key];
    if (v != null && v !== "") return v;
    return defaults[key] ?? "";
  };
}

/** Raw stored map for pages that assemble dynamic slots (gallery). */
export async function getStoredCopy(): Promise<Record<string, string>> {
  try {
    return await getRepos().copy.getAll();
  } catch {
    return {};
  }
}

/** The four service routes with their Studio-editable names (§21/§24). */
export async function getServiceNav(): Promise<{ label: string; href: string }[]> {
  const c = await getPageCopy("services");
  return [
    { label: c("concerts.title"), href: "/services/concerts" },
    { label: c("piano.title"), href: "/services/piano-for-events" },
    { label: c("production.title"), href: "/services/music-production" },
    { label: c("scores.title"), href: "/services/music-library" },
  ];
}
