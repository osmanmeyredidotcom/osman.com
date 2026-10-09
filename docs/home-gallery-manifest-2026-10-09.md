# Homepage scrolling gallery — image manifest (09-10-2026)

Built for the "homepage gallery, AltHome style only" brief: the same gallery
(position, pin, 1:1 scroll, swipe strip, progress line) with the photos **no
longer one uniform height** — each takes its size, vertical place and
following space from `HOME_GALLERY_RHYTHM` in `src/data/home-gallery.ts`,
the /althome gallery's composition. Every photo keeps its native aspect
ratio; nothing is cropped.

The set is the team's own curation: every JPG in the master folder's
`Edited/JPG/Use/` subfolder (and only those). Web copies live in
`public/images/gallery/home-*.jpg` (1400 px tall, native aspect, sRGB,
JPEG q75 progressive, metadata stripped). Source originals untouched.

Master folder root (Aditya's Mac):
`/Users/adityavats/Library/Mobile Documents/com~apple~CloudDocs/OsmanMeyredi/Website/Website /09. Images Osman/Edited`

| Slot | Web file | Source file (in `Edited/`) | Subject | Orientation | Size (rhythm) |
|---|---|---|---|---|---|
| 1 | `home-01-singing-bass-neon.jpg` | `JPG/Use/Edited.png` | Singing at the mic, bass on, warm neon | Portrait (0.75) | Dominant, low |
| 2 | `home-02-bass-guitar-cream.jpg` | `JPG/Use/NW_Osman_BassQuitar_HR.jpg` | White bass guitar, eyes closed | Landscape (1.31) | Small, high |
| 3 | `home-03-bass-outdoor-hat.jpg` | `JPG/Use/IMG_1013.jpg` | Straw hat, arms out, outdoor show | Landscape (1.34) | Medium, low |
| 4 | `home-04-drums-singing.jpg` | `JPG/Use/NW_Osman_Drums_HR.jpg` | Singing behind the drum kit | Landscape (1.32) | Dominant, low |
| 5 | `home-05-bass-green-light.jpg` | `JPG/Use/be8dd39bb7c9486b839d931d4f29b265_gemini-3.jpg` | Bass under green stage light | Landscape (1.50) | Smallest, centred |
| 6 | `home-06-stage-piano.jpg` | `JPG/Use/NW_Osman_Dig Piano_HR.jpg` | Stage piano against the orange wall | Landscape (1.54) | Medium-large, low |
| 7 | `home-07-double-bass-hat.jpg` | `JPG/Use/NW_Double BassHR.jpg` | Double bass in the hat, blue light | Portrait (0.67) | Dominant, low |
| 8 | `home-08-electric-guitar.jpg` | `JPG/Use/NW_Osman_ElecQuitar_HR.jpg` | Blue electric guitar, brick wall | Landscape (1.22) | Small, high |

Story: opens on the artist singing, then walks the instruments — bass,
drums, piano, double bass, electric guitar — live shots first, studio
portraits late, mixing colour-graded sets so neighbours never match.

## Notes

- **Studio editability unchanged.** Studio → Pages → Homepage gallery still
  overrides any slot (src/alt/width/height); an emptied src hides the slot.
  A replaced photo takes its slot's size from the rhythm, so swapping images
  keeps the composition.
- **/althome is untouched visually**: it now carries its own copy of the
  previous default set (`src/data/althome-gallery.ts`), so only `/` changed.
- `JPG/Don't use/` was honoured; nothing was taken from it.
- Top-level files in `Edited/` (e.g. `Bassguitar.jpg`, `Silhouet
  performence.jpg`, `Osman_Studio_highres.jpg`, the ZAPPATIKA rehearsals,
  `Osman on stage.jpg`, `Live concert_landscapeHR.jpg`) were inspected and
  left out: the `JPG/Use` folder reads as the team's own pick, the hero
  candidates would duplicate the hero, `NW_Double BassHR.jpg` at top level
  carries a photographer's watermark (the `Use` copy is clean), and the
  B&W Waterhole frames repeat the slot-1 venue.
- `NW_IMG_1019.jpeg` (bass in the hat, same scene as `IMG_1013`) is the
  first alternate if one more portrait is wanted.
