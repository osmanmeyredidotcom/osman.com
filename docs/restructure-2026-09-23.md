# Less-text-heavy restructure — implementation report (23-09-2026)

Per OSMAN_NEW_FEEDBACK_RESTRUCTURE_LESS_TEXT_HEAVY.md. Companion to the
audit/plan in restructure-plan-2026-09-23.md.

## Status: global restructure DONE · source items DONE (see source-items-2026-09-23.md)

Update 23-09, later the same day: `New Osman feedback.pages` arrived in
chat and every §22–27 item is implemented — see
docs/source-items-2026-09-23.md. The paragraph below records the state
while the document was missing.

`New Osman feedback.pages` is not present in any folder this session can
reach (searched the whole iCloud Website folder, the OsmanMeyredi iCloud
root — access granted 23-09 — and the repo folder; nothing new since
21-09). Until it arrives, these items are **open**, exactly as the brief
orders (use the exact source, never guess):

- §22 which gallery frame Edited.png replaces (the file itself is
  confirmed at 09. Images Osman/Edited.png, 20.7 MB — ready to stage)
- §23–24 the new collaboration/music item + exact Spotify AND Apple Music
  URLs
- §25 the Falling for You correction
- §26 the exact RED Keep Your Eye on the Sparrow artwork (site currently
  has the white-background red-label 45 scan; no red variant exists in
  the master folders by name — it must come from the source)
- §27 the ZAPPATiKA link instruction

Aditya was pinged with three unblock options (copy into iCloud Website /
attach in chat / grant Desktop-Downloads access).

## What changed (copy: zero words added, removed or rewritten)

Shared kit: `splitCopy()` (paragraph groups from one Studio field, layouts
adapt to editor changes), `ReadMore` (native `<details>`, SSR content,
zero JS — held in reserve until the source shows where the client wants
it; deliberately not sprinkled everywhere per §5/§32), `.chapter-num`
ghost numerals extending the existing outline-type language.

- **About** — four visual chapters: poster hero (offset intro column),
  01 portrait-beside-story, 02 number-led narrow reading column,
  full-width image break, 03 story-beside-childhood-piano photo (new
  Studio field image3, approved home-gallery photo), 04 closing band.
  Mobile order is marker/heading → image → body, so photos interrupt
  reading at every width.
- **Services overview** — was a zero-image text table (run of 6); now four
  editorial splits with approved photos on alternating sides + ghost
  indices. New Studio fields: {concerts,piano,production,scores}.image(+Alt).
- **Concerts** — split hero (approved statement + live photo immediately),
  "The Show" as heading-rail + narrow column chapter, the three booking
  options as a horizontal 3-column band, red audience question unchanged
  as the typographic close. Varsha pending-note kept.
- **Live Piano** — split hero with the grand-piano portrait, lead
  paragraph as offset narrow column, Rome-2025 photo (new Studio field
  image2, the approved earlier-round image) beside the set-up paragraph,
  the short vocalist line as display type, listen band full-width.
- **Music Production** — approved intro as display statement; portrait
  moved beside the first paragraph; second paragraph as offset column.
- **Original Scores & Custom Music** — the worst page (8-paragraph run,
  player buried ~1500px deep): now statement + red line → vinyl previews
  immediately → "just a taste" + ready-made library copy grouped in two
  columns after the player → the two "how custom music works" paragraphs
  beside the studio photo → CTA. Save-for-later block still unpublished.
- **Live Videos** — the lead video (Cinetol) is a full-width feature; the
  rest keep the two-column grid.
- **Home / Music / Shows / Media / Contact / Shop** — audited (see plan
  table): already image-led or scannable; no structural surgery, per the
  brief's warning against one generic restructure. Home §22 swap and the
  Music §23–27 items follow the source document.

## Before → after (desktop 1440; DOM-order counter, resets only on media,
so side-by-side columns and headings still count as "consecutive" — the
visual check is the authority, §45)

| page | max para run | run chars | media | chars per media |
|---|---|---|---|---|
| services | 6 → 2 | 712 → 268 | 0 → 4 | 787 → 210 |
| original-scores | 8 → 4 | 1668 → 387 | 0 → 1 | 2017 → 2017* |
| live-piano | 4 → 3 | 912 → 492 | 1 → 2 | 1196 → 598 |
| about | 3 → 3 | 1032 → 1032† | 2 → 3 | 1067 → 714 |
| concerts | 4 → 7‡ | 719 → 1454‡ | 1 → 1 | — |

\* player/vinyl objects aren't `<img>` so the counter can't see them.
† the conservatories chapter keeps its two approved paragraphs together
by design — composed as a numbered chapter, not hidden.
‡ counter artefact: hero image now precedes all copy, so The Show + the
three option columns are DOM-adjacent; visually the run is 2 (split
chapter → 3-column band → statement).

## Verification

All 16 routes 200 with clean consoles (only sandbox-blocked ytimg/_rsc
noise filtered); vitest 69/69; zero mobile horizontal overflow on every
changed page (390px); vinyl player full functional run OK in the new
position (play/switch/pause/keyboard/reduced-motion, overflow 0); Studio
round-trip on the restructured About (edit → public shows it → clear →
default restored) and all new image fields render in Pages editors.
Desktop + mobile full-page screenshots inspected per page. Motion:
existing Reveal/Parallax only, no new scroll systems, ReadMore is
CSS-only — §40 preserved.
