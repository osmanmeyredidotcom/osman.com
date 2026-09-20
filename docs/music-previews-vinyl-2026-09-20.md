# Music Library preview tracks + vinyl player — implementation report (20-09-2026)

Covers both briefs: OSMAN_MUSIC_LIBRARY_PREVIEW_TRACKS.md and
OSMAN_VINYL_ANIMATION_MUSIC_PREVIEWS(_UPDATED).md.

## 1. Source files and preview cuts

All five exact originals were found in the master content folder
(iCloud › OsmanMeyredi/Website/Website /05. Services/Original Tracks &
Music Library) and used untouched — nothing renamed, moved or re-exported
at source. The cut windows follow the brief, with each boundary checked
against an RMS energy profile (±0.8s) and snapped to the nearest quiet
dip so no preview starts or ends mid-hit:

| Public title | Genre | Source file | Brief window | Exported window | Why nudged |
|---|---|---|---|---|---|
| Blue Hour | Blues | BLUES STYLE in G.wav | 02:14–02:39 | 02:14.35–02:38.65 | both ends snapped to clear dips |
| Prime Time '84 | 80s Disco | DISCO STYLE 80's : INTRO TV SHOW .wav | 00:09–00:34 | 00:08.3–00:33.9 | start pulled to the phrase gap before the entry |
| Orbit After Dark | Electronic / Space Disco | ELECTRONIC SPACEY DISCO.wav | 01:26–01:51 | 01:26.75–01:51.4 | both ends to dips |
| Deep Pocket | Funk | FUNK - GROOVY OCTOPUSS.wav | 00:27–00:52 | 00:26.75–00:52.8 | near-silent phrase gaps on both ends |
| Electric Therapy | Rock | ROCK - PSYCHO REPORT THERAPY (ROCK).wav | 00:05–00:30 | 00:05.1–00:30 | start to a dip; end kept |

Export: MP3 192 kbps stereo 44.1 kHz, 0.4 s fade-in / 0.8 s fade-out,
metadata stripped, ~25 s each (~600 KB per file), served from
`/public/audio/music-library/` with the clean filenames from the brief.
Levels verified (mean −13.9 to −19.6 dB, peaks ≤ −0.2 dB, no silence).

**Full tracks stay private**: the WAV masters exist only in the master
content folder, `public/` contains zero WAV files, and a probe for a
WAV-style URL returns 404. The old demo preview MP3 was removed.

## 2. Data (existing Neon database, no new database)

The existing **LibraryTrack** model fits the brief's metadata needs, so no
schema change and no new database. The five tracks replace the demo
fixtures in the demo content and are seeded to Neon (upsert with a full
update block, so re-seeding refreshes preview metadata without touching
tracks the team adds; the old `demo-*` fixtures are deleted by slug). Per
§21, moods/use-cases/descriptions are left empty — no invented facts. The
source-file ↔ title ↔ window mapping lives in this document as the
internal reference.

Studio: the existing **Music library** section manages all of it (title,
genre, preview URL, order, publish state), and the audio field now warns:
"Upload only the public preview version here, not the full master track."

## 3. Page presentation

On Original Scores & Custom Music, the Examples section now renders: the
approved intro, the musicianship statement ("Every instrument you hear is
played by Osman Meyredi." + the supporting line), five vinyl preview
rows, the per-track "Enquire about licensing →" CTA (to the contact form
with Original Scores preselected), and the closing rights note ("Preview
only. Usage requires permission/licensing from Osman Meyredi."). All of
that wording is Studio-editable (Pages → Original Scores & Custom Music).

## 4. Vinyl interaction — research and result

References reviewed before building (per the brief's research
requirement):

- **hexagoncircle's CSS record player** (fetched): distinct
  playing/stopped classes, arm rotating ~0.5 s around a transform-origin
  pivot, 4 s/rev spin, eased spin-down → adopted the pivot technique, the
  ~0.38 s arm move, the 4 s/rev believable speed and hard state
  separation.
- **MD Vinyl on 60fps.design** (fetched): tonearm lands first, record
  spins just after, with a subtle settle → adopted the 0.3 s spin delay
  after the arm lands and a gentle settle easing (no bounce, per the
  brief).
- **dmaaus' record player pen** (fetched): arm built from simple shapes
  around a pivot → adopted the idea, drawn instead as one lightweight
  stroke SVG (bearing + arm + headshell).
- **Waxxy** (fetched, metadata-level): dark, ritual/tactile record
  object positioning → the row object is treated as a small physical
  thing, not an app widget.
- Hot Wax/GSAP Vault and the two Dribbble shots are JS-heavy pages that
  could not be meaningfully fetched here; they informed the editorial
  row presentation and proportions only through the brief's own notes.
- **The site itself** is the strongest reference: the disc reuses the
  exact `.vinyl` motif from the menu record and the shelf, the sleeve
  uses the RecordSleeve placeholder language, and the disc emerging from
  the sleeve echoes the approved shelf interaction — one vinyl language
  site-wide.

Behaviour: play → arm swings in (380 ms, slight settle) → disc starts
turning 0.3 s later (4 s/rev) → progress line and time move. Pause →
audio pauses, the disc **holds its groove angle** (animation-play-state,
no snap-back), the arm lifts just off the record. End → arm returns
home, progress resets. Switching tracks pauses the previous row; only
one preview can sound at a time (one shared audio element; nothing
loads before the first tap). All motion is transform-only CSS; under
`prefers-reduced-motion` the flourish is stripped and the player stays
fully functional.

## 5. Verification (demo build, production bundle)

Automated Playwright run: no autoplay on load (single audio element, no
src); pressing Play actually plays (currentTime advances) and drives
data-state + the arm transform; progress text updates; switching tracks
leaves exactly one playing; pause holds state; keyboard focus + Enter
resumes; mobile 390 px has **zero horizontal overflow** (an earlier 18 px
overflow from the arm's rotated bounding box was fixed by clipping the
object and keeping every visible part inside it); reduced-motion plays
without any spin animation. Tests 69/69; all routes 200; the rights note
and musicianship statement render; desktop + mobile screenshots captured.

## 6. For Aditya

- Deploy as usual; then re-seed (`SEED_DEMO_EVENTS=false npx tsx
  prisma/seed.ts`) so Neon gets the five tracks (and drops the demo
  fixtures). No prisma migration needed.
- §55 check on Vercel: play a preview on the live site, confirm smooth
  motion, and confirm a WAV URL guess 404s.
- Working titles/genres are the brief's table; if the client renames
  them later it's a Studio edit, no code.
- Not built (per brief): automatic licence purchase, private master
  storage, per-track uploaded artwork (the typographic sleeve system
  stands in until artwork exists — swap-in ready via the Studio audio/
  artwork fields when supplied).

## 7. Progress animation pass (combo 1 + 3, same day)

Per OSMAN_PROGRESS_ANIMATION_COMBO_1_AND_3.md. One custom property `--p`
(0..1) is written once per animation frame on the active row only —
requestAnimationFrame runs solely while audio actually plays — and CSS
derives all three cues from it: the scaleX played line (soft warm white),
the travelling 7px dot with a restrained glow (settles when paused,
slightly larger on hover/focus), and a hairline arc around the active
vinyl (pathLength=1 circle, dashoffset = 1−p). The arc starts at 12
o'clock and sits beside the rotating disc, never inside it, so it
progresses but cannot spin — the brief's most important detail, asserted
in the automated run (disc transform changes frame to frame; ring
transform stays constant). The native range input remains the real seek
control, now invisible above the custom bar (drag, click, keyboard and
screen-reader seeking preserved; step 0.1 with aria-valuetext), and a
seek writes `--p` in the same call so bar, dot and ring jump together.
Idle rows show only the quiet base line — no dots, no rings, no updates.
Reduced motion keeps everything functional and drops the glow and
transitions. Verified: monotonic smooth `--p` samples during playback,
frozen on pause, ring invisible on all idle rows, zero mobile overflow,
tests 69/69.
