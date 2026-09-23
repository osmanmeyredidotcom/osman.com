import type { Metadata } from "next";
import { getRepos } from "@/server/repositories";
import type { ReleaseRecord } from "@/lib/types";
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
    image: "/images/releases/dance-with-this-mess.jpg",
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

  const published = allReleases
    .filter((r) => r.status === "PUBLISHED" && r.rightsStatus !== "DO_NOT_PUBLISH")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const own = published.filter((r) => r.relationshipType === "OWN_RELEASE");

  const collaborations = allCollaborations
    .filter((c) => c.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  // Round 3 exception: the ZAPPATiKA / Frank Zappa band project keeps its
  // full feature block and closes the page (older than everything above).
  const zappatika = collaborations.find((c) => c.slug === "zappatika") ?? null;

  const releasesFor = (slug: string): ReleaseRecord[] =>
    published.filter(
      (r) => r.relationshipType === "COLLABORATION_RELEASE" && r.collaborationSlug === slug
    );
  // New Osman feedback.pages (23-09-2026): "All albums go to the chapter
  // 'collaboration', only Dance with the mess is Osman's own release …
  // oldest ones at the bottom, newest on top." One unified collaborations
  // chapter now lists every non-own release (each keeping its real billing
  // tag), newest year first; only the ZAPPATiKA feature's own recordings
  // stay inside that closing block.
  const collabRows = published
    .filter((r) => r.relationshipType !== "OWN_RELEASE")
    .filter((r) => !(zappatika && r.collaborationSlug === zappatika.slug))
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.sortOrder - b.sortOrder);

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

      {/* 1 — Own releases */}
      <section id="own-releases" className="scroll-mt-24 border-t border-line py-16 sm:py-20">
        <Container wide>
          <Reveal variant="text">
            <p className="tabular inline-block border border-accent-strong px-2.5 py-1 text-[11px] tracking-[0.16em] text-accent-strong uppercase">
              Own releases
            </p>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl">Osman Meyredi</h2>
          </Reveal>
          <div className="mt-8">
            {own.length > 0 ? (
              <>
                {own.map((r) => (
                  <JsonLd key={r.id} data={musicAlbumJsonLd(r)} />
                ))}
                <Discography releases={own} />
              </>
            ) : (
              <Reveal variant="text" delay={100}>
                <p className="max-w-xl border-t border-line pt-6 leading-relaxed text-ink-soft">
                  Osman&rsquo;s first release under his own name, a solo vinyl, is in the
                  works. When it lands, this is where it will live. Until then, hear him on the
                  collaborations below.
                </p>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {/* 2 — Collaborations & band projects: one unified chapter (New Osman
          feedback.pages, 23-09-2026 — "All albums go to the chapter
          'collaboration'"), newest year on top, continuous numbering after
          the own releases (the doc's own example numbers the 2023 single
          "04"). Every entry keeps its real billing tag — appears-on rows
          stay billed to the artists who made them. */}
      <section id="collaborations" className="scroll-mt-24 border-t border-line">
        <Container wide>
          <Reveal variant="text">
            <div className="py-16 sm:py-20">
              <p className="eyebrow">Collaborations &amp; projects</p>
              <h2 className="font-display mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl">
                Band projects and recurring collaborations
              </h2>
            </div>
          </Reveal>
        </Container>
        {collabRows.length > 0 && (
          <Container wide className="pb-8">
            {collabRows.map((r) => (
              <JsonLd key={r.id} data={musicAlbumJsonLd(r)} />
            ))}
            <Discography releases={collabRows} startIndex={own.length} />
          </Container>
        )}
        {/* The Frank Zappa era — kept intro + band image + album by the
            Keynote's explicit exception, all the way down the page because
            it is older than the collaborations above. */}
        {zappatika && (
          <div>
            {releasesFor(zappatika.slug).map((r) => (
              <JsonLd key={r.id} data={musicAlbumJsonLd(r)} />
            ))}
            <CollaborationFeature
              collaboration={zappatika}
              releases={releasesFor(zappatika.slug)}
            />
          </div>
        )}
      </section>

      {/* Round 3 Keynote: the closing licensing section is removed — "It's
          irrelevant on the music page. We don't need to sell him that
          desperately." The Original Scores & Custom Music page carries that
          story now. */}
    </>
  );
}
