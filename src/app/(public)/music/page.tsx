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
  "Osman Meyredi's music in three clear layers: his own releases, records he appears on, and collaborations & band projects, including ZAPPATiKA with Frank Zappa's longtime vocalist Ike Willis.";

export const metadata: Metadata = {
  title: { absolute: MUSIC_TITLE },
  description: MUSIC_DESCRIPTION,
  alternates: { canonical: "/music" },
  openGraph: pageOpenGraph({
    title: MUSIC_TITLE,
    description: MUSIC_DESCRIPTION,
    path: "/music",
    image: "/images/releases/dance-with-this-mess.jpg",
    imageAlt: "Dance With This Mess — Osman Meyredi's own release, cover artwork",
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
  const appearsOn = published.filter((r) => r.relationshipType === "CONTRIBUTING_ARTIST");
  const collabReleases = published.filter(
    (r) => r.relationshipType === "COLLABORATION_RELEASE"
  );

  const collaborations = allCollaborations
    .filter((c) => c.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  // Round 3 exception: the ZAPPATiKA / Frank Zappa band project keeps its
  // full feature block and closes the page; everything newer lists first.
  const zappatika = collaborations.find((c) => c.slug === "zappatika") ?? null;
  const restCollaborations = collaborations.filter((c) => c !== zappatika);

  const releasesFor = (slug: string): ReleaseRecord[] =>
    collabReleases.filter((r) => r.collaborationSlug === slug);
  const unattached = collabReleases.filter(
    (r) => !r.collaborationSlug || !collaborations.some((c) => c.slug === r.collaborationSlug)
  );

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

      {/* 2 — Appears on */}
      {appearsOn.length > 0 && (
        <section id="appears-on" className="scroll-mt-24 border-t border-line py-16 sm:py-20">
          <Container wide>
            <Reveal variant="text">
              <p className="tabular inline-block border border-line-dark px-2.5 py-1 text-[11px] tracking-[0.16em] text-ink-soft uppercase">
                Appears on
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                Records by other artists with Osman in a credited role — always billed to the
                artists who made them.
              </p>
            </Reveal>
            <div className="mt-8">
              {appearsOn.map((r) => (
                <JsonLd key={r.id} data={musicAlbumJsonLd(r)} />
              ))}
              <Discography releases={appearsOn} />
            </div>
            {/* 11-09-2026: Varsha's high-res Special-45 label replaced the
                interim photo crop — the pending note is resolved. */}
          </Container>
        </section>
      )}

      {/* 3 — Collaborations & band projects */}
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
        {/* Newer collaborations (newest first) — recordings only: the
            Keynote removes the duplicated intro sections so visitors can
            scroll the albums faster. Every entry keeps its real billing. */}
        {restCollaborations.map((collaboration) => {
          const rows = releasesFor(collaboration.slug);
          if (rows.length === 0) return null;
          return (
            <Container key={collaboration.id} wide className="pb-8">
              {rows.map((r) => (
                <JsonLd key={r.id} data={musicAlbumJsonLd(r)} />
              ))}
              <Discography releases={rows} />
            </Container>
          );
        })}
        {unattached.length > 0 && (
          <Container className="pb-16">
            <div className="mt-4">
              {unattached.map((r) => (
                <JsonLd key={r.id} data={musicAlbumJsonLd(r)} />
              ))}
              <Discography releases={unattached} />
            </div>
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
