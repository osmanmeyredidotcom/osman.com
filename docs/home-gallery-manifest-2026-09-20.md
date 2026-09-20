# Homepage scrolling gallery — image manifest (20-09-2026)

Built for the "Adele-style scrolling gallery" brief. This is the **temporary**
placeholder set (brief §6) selected from the master content folder; swap any
entry by editing `src/data/home-gallery.ts` — the animation is data-driven and
needs no rebuild (§25). Source originals were not modified (§11); web copies
live in `public/images/gallery/` (max 1400px tall, stripped metadata).

Master folder root (Aditya's Mac):
`/Users/adityavats/Library/Mobile Documents/com~apple~CloudDocs/OsmanMeyredi/Website/Website `

| Order | Source file (relative to master folder) | Subject | Instrument/context | Orientation | Temporary |
|---|---|---|---|---|---|
| 1 | `09. Images Osman/Osman_Studio_highres.jpg` | Osman at the mic behind a keyboard, B&W | Keys / live | Landscape-wide (1.79) | Yes |
| 2 | `09. Images Osman/Osman Performing HR.jpg` | Arms raised, bass on, red-lit stage | Bass guitar / live | Portrait (0.76) | Yes |
| 3 | `03. Shows/Images/keyboards (POPEI - EINDHOVEN).jpg` | At the keyboards, blue/pink light | Keys / live | Landscape (1.50) | Yes |
| 4 | `09. Images Osman/Osman_DoubleBass_HR.jpg` | Bowing the double bass, B&W | Double bass / live | Portrait (0.70) | Yes |
| 5 | `03. Shows/Images/LIVE IN ITALY (2012) BASS.JPG` | Pointing to the crowd, StingRay bass | Bass guitar / outdoor show | Landscape (1.33) | Yes |
| 6 | `09. Images Osman/IMG_1723.jpeg` | Full-stage under the red canopy, wine barrels | Bass guitar / festival | Portrait (0.75) | Yes |
| 7 | `03. Shows/Images/IN STUDIO (ITALY - 2011).JPG` | Headphones on at an electric piano | Keys / studio | Landscape (1.33) | Yes |
| 8 | `09. Images Osman/Osman_Child_Piano_HR.jpg` | Childhood at the upright piano, B&W | Piano / archival | Portrait (0.75) | Yes |

Story: opens on the artist mid-performance, walks through keys → bass →
double bass → festival stage → studio, and closes on the childhood piano —
artist first, multi-instrumentalist throughout (§7).

## Deliberately excluded

- `09. Images Osman/Live concert_landscapeHR.jpg` and the three files in
  `01. Home/Homepage banner image/` — these are the **homepage hero
  candidates** still awaiting Osman's pick; using them here would duplicate
  the hero.
- `09. Images Osman/Osman on stage.jpg` — same session as the current live
  hero image.
- `Osman_On Stage.jpg` (656×864 — too small), `IO YEAH.jpg` (heavy vintage
  filter, near-duplicate of #5), `Maggio 2011 … BRESCIA` (Osman not
  recognisable), `IMG_1015.jpeg` (kept as first alternate; three portraits in
  a row hurt the rhythm), `IMG_1724.jpeg` (near-duplicate of #6).
- `AMS_Bierfabriek20March2026/IMG_7003.jpeg` — band trio frame; two other
  musicians are co-equal subjects, so it needs Aditya's explicit OK before it
  can appear on the homepage (§9).
- All `*gemini-*-image-preview*` files — AI-generated, excluded per §6.
- ZAPPATIKA tour photos — collaboration context (§9); the rehearsal shots
  already serve the Music Production page.

## Missing types (§26)

No clear-subject **drums** or **guitar** photographs exist in the master
folder (the only drum shots are chat-supplied B&W prints not present in the
folder, and the one band frame above). If Osman wants those instruments in
the gallery, supply one photo of each and they slot straight into the array.

## Live-reference study notes (adele.com, 20-09-2026)

Measured live: full-viewport snap sections; the photo row is a native
horizontal strip (`overflow-x`), uniform image height ≈70% of the viewport,
widths follow native aspect, 20px gaps, ~7vw lead-in, black background, and
the "progress indicator" is the strip's thin (5px) styled scrollbar; a
"SCROLL →" hint sits above; no GSAP/pinning on the live site today. The brief
mandates the scroll-driven pinned version, so the desktop build pins and
drives the row from vertical scroll 1:1 with a real progress line (reversible,
no trap); mobile mirrors the live site's native swipe strip; reduced motion
gets a vertical stack.
