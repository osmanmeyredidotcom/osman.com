# New Osman feedback.pages — source items implemented (23-09-2026)

The client's Pages document arrived in chat (23-09) and was extracted
directly (bundle unzipped; full text pulled from Index/Document.iwa,
every embedded image inspected). All five numbered items are now
implemented. Companion to restructure-2026-09-23.md, which carried the
whole-site less-text-heavy pass.

## Item 1 — gallery swap (§22)

The screenshot identifies the outgoing frame: the arms-raised red-stage
bass photo = home gallery slot 2 (gallery-02-bass-red-stage.jpg, now
removed). Replaced with the exact client file
`09. Images Osman/Edited.png` (colour, bass + mic under warm neon),
exported to gallery spec (1045×1400 JPG, no crop, Osman fully visible)
as gallery-02-bass-neon.jpg. Verified rendered in the scroll gallery,
correct aspect, Studio slot override still works (slot defaults come
from home-gallery.ts).

## Items 2–4 — Telesoluzioni "L’omino" + streaming links (§23–24)

New release added to the collaborations chapter with BOTH platforms:

- Title/artist verified against both platforms before entry (no
  title-similarity guessing): **L’omino — Telesoluzioni**, single,
  released 01-04-2023.
- Spotify: track 19JhSglD9feg9jRce3rp2D (the client's exact link; the
  WhatsApp share-tracking suffix `?si=…&utm_source=whatsapp` is not
  stored — same track id, matching the clean format of every existing
  Spotify link on the site. Flag if you want the suffix kept.)
- Apple Music: exact URL as supplied
  (…/lomino/1675913691?i=1675913704&l=en-GB).
- Credit exactly per the doc's template, in the site's credit
  convention: "Osman Meyredi: electric guitar"; billing tag APPEARS ON ·
  Single under artist TELESOLUZIONI (as in the doc's example).
- Artwork: the HR file the doc points to
  (04. Music/Collaboration/L'omino_Telesoluzioni.jpeg), exported
  1200×1200 with the full title type intact (edge-tone letterbox, no
  cropped letters).

Chapter rule from the doc — "All albums go to the chapter
'collaboration', only Dance with the mess is Osman's own release …
oldest ones at the bottom, newest on top":

- The separate "Appears on" section is gone; every non-own release now
  lists in ONE collaborations chapter ordered newest→oldest
  (Falling for You 2025 → Sparrow 45 2024 → L’omino 2023), each keeping
  its real billing tag. The chapter's old explanatory line ("Records by
  other artists…") left with the chapter it described — billing is
  still carried by the per-row tags.
- Numbering is continuous across the page, matching the doc's own
  example ("04. TELESOLUZIONI"): 01 Dance With This Mess → 02 → 03 →
  04 L’omino. ZAPPATiKA keeps its approved feature block at the bottom
  (older era), its selected recordings numbered within the block.
- Knowledge layer + anchors updated (/music#appears-on →
  #collaborations); tests adjusted expectations already covered.

Apple Music links also added (exact URLs from the doc) to:
Dance With This Mess, Falling for You, Keep Your Eye on the Sparrow
(Special 45), and — the ZAPPATiKA instruction, unambiguous in the doc —
the **Highway Maintenance (Live in the U.K.) album**, which now shows
Spotify · Apple Music · Bandcamp. Re-seeding refreshes the links on
Neon (appleMusicUrl added to the seed's update block) and creates the
L’omino row.

## Sparrow artwork (§26)

The doc: "we keep the ZR red image instead of the brown image /
record". The repo already carries exactly that state since Round 3 —
the red Z-Records Side-B label scan on the Special 45, and the brown
album-cover entry deleted (the seed also deletes it from Neon). The
client's screenshot shows the LIVE site still listing both — that
resolves on the next deploy + re-seed. Verified rendered red ✓.

## Item 5 — restructure notes reconciled

The doc's own wording adds two constraints to the README:

- "Adding a read more button with some animation is a priority where
  the text is too long" → ReadMore (native details, animated, full copy
  in the DOM) now live in the two longest remaining reads: About's
  conservatories chapter and Concerts' "The Show". Verified: collapsed
  on load, click/Enter toggle, Read less state, SEO content served.
- "The animations, the sections and their positions should not be
  changed at all sequentially" → the restructure kept section sequence
  everywhere EXCEPT two moves the README explicitly ordered: the
  Original Scores player now sits before the narrative (§17) and the
  Concerts live photo joined the opener (§15 "media earlier").
  **RESOLVED 23-09 (Vansh):** disregard the sequence note; Original
  Scores is explicitly the exception and keeps its player-first order
  as the README directed. Both moves stand as implemented.

## Verification

vitest 69/69; routes clean (200, no real console errors); music page
desktop + mobile inspected (zero horizontal overflow); ReadMore
functional both pages; gallery slot verified desktop; L’omino row
renders with both platform buttons and correct billing.

## For Aditya

1. `git push origin staging` (deploys everything).
2. Re-seed Neon so the database matches:
   `SEED_DEMO_EVENTS=false STUDIO_EMAIL=… STUDIO_PASSWORD=… npx tsx prisma/seed.ts`
   — creates L’omino, adds the four Apple Music links, publishes
   Cinetol, seeds the five preview tracks, deletes the brown Sparrow
   album row (all previously pending items in one run).
3. On the live site afterwards: check the gallery's second frame, the
   music page order/numbering, and that every APPLE MUSIC button lands
   on the right release.
