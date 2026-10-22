import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import { JsonLd, musicAlbumJsonLd, pageOpenGraph } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Discography } from "@/components/public/Discography";
import { CollaborationFeature } from "@/components/public/CollaborationFeature";

export const dynamic = "force-dynamic";

// §23 title direction for the Music page.
const MUSIC_TITLE = "Music by Osman Meyredi | Releases & Collaborations";
const MUSIC_DESCRIPTION =
  "Osman Meyredi's music in two clear layers: his own releases, and the collaborations, features and band projects he plays on, including ZAPPATiKA with Frank Zappa's longtime vocalist Ike Willis.";

export const metadata: Metadata = {
  title: { absolute: MUSIC_TITLE },
  description: MUSIC_DESCRIPTION,
  alternates: { canonical: "/music" },
  openGraph: pageOpenGraph({
    title: MUSIC_TITLE,
    description: MUSIC_DESCRIPTION,
    path: "/music",
    image: "/images/releases/dance-with-this-mess-v2.jpg",
    imageAlt: "Dance With This Mess: Osman Meyredi's own release, cover artwork",
    imageWidth: 1200,
    imageHeight: 1200,
  }),
};

/**
 * Music — Round 3 Keynote (20-09-2026) on top of the pack-02 ownership
 * layers: heading is RELEASES; newer collaborations show only their
 * recordings (no duplicated intro block), while the ZAPPATiKA / Frank Zappa
 * band project keeps its intro + band image by exception and sits at the
 * bottom of the page; own releases stay first; the closing licensing
 * section is removed. Rendering guard: DO_NOT_PUBLISH rights never reach
 * the page.
 */
export default async function MusicPage() {
  const repos = getRepos();
  const [allReleases, allCollaborations] = await Promise.all([
    repos.releases.list(),
    repos.collaborations.list(),
  ]);

  // 12-10 feedback round (MUSIC.md): one chronological release list, newest
  // year first — Highway Maintenance sits inside it rather than as a separate
  // feature (P31-X295/A-MUSIC-01); the Own-releases and Collaborations group
  // headers are gone (P31-X291/X293). Every entry keeps its real billing and
  // credits beneath the song name.
  const published = allReleases
    .filter((r) => r.status === "PUBLISHED" && r.rightsStatus !== "DO_NOT_PUBLISH")
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.sortOrder - b.sortOrder);

  const collaborations = allCollaborations
    .filter((c) => c.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  // The ZAPPATiKA / Frank Zappa band project keeps its feature block (band
  // name, photo and body text per P32-X302's "no section title" — only the
  // eyebrow goes) at the bottom of the page; its recordings now live in the
  // chronological list above, so the block carries no release rows.
  const zappatika = collaborations.find((c) => c.slug === "zappatika") ?? null;

  return (
    <>
      <section className="py-24 sm:py-28">
        <Container wide>
          <Reveal variant="text">
            <p className="eyebrow">Music</p>
            {/* Round 3 Keynote: "Change into: RELEASES", with the category
                line "Solo work · Collaborations · Features · Band projects"
                replacing the struck intro paragraph. */}
            <h1 className="display-caps mt-4 text-5xl sm:text-7xl">Releases</h1>
            <p className="tabular mt-6 text-sm tracking-[0.14em] text-ink-faint uppercase">
              Solo work · Collaborations · Features · Band projects
            </p>
          </Reveal>
        </Container>
      </section>

      {/* The releases — one list, continuous numbering, year and credits
          beneath each song name (P31-X297: no dotted year leaders). */}
      <section id="releases" className="scroll-mt-24 border-t border-line py-4 sm:py-6">
        <Container wide>
          {published.length > 0 ? (
            <>
              {published.map((r) => (
                <JsonLd key={r.id} data={musicAlbumJsonLd(r)} />
              ))}
              <Discography releases={published} />
            </>
          ) : (
            <Reveal variant="text" delay={100}>
              <p className="max-w-xl border-t border-line pt-6 leading-relaxed text-ink-soft">
                Osman&rsquo;s releases are on their way back online. Check back soon.
              </p>
            </Reveal>
          )}
        </Container>
      </section>

      {/* The Frank Zappa era — band name, photo and body text stay (MUSIC.md);
          the memorial information now lives in the musicians line (P32-X306/
          X308), managed in the Studio. */}
      {zappatika && (
        <section id="collaborations" className="scroll-mt-24 border-t border-line">
          <CollaborationFeature collaboration={zappatika} releases={[]} />
        </section>
      )}
    </>
  );
}
