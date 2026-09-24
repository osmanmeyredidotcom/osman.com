# Image-first cohesion pass + new shows (24-09-2026)

Two briefs, two commits: OSMAN_NEW_SHOWS_AND_REMOVE_WAITING_FOR_VARSHA
(commit f4d1120) and OSMAN_IMAGE_FIRST_LAYOUT_COHESION_PASS (this one).
Copy-lock held throughout — zero wording changes; sentinel checks on
every touched page.

## Shows brief

- Four events added via realEvents (seeded in every mode, fully
  Studio-editable — verified: rows listed, Zoku edit form opens):
  02-10 / 04-11 / 13-11 Bierfabriek (Nes 67, Amsterdam, 20:30–23:30) and
  06-11 "Zoku Amsterdam — Rooftop Event" (Weesperstraat 105; no time
  supplied, none invented).
- Bierfabriek titles follow the EXISTING approved convention from the
  10-09 event ("Osman Meyredi – live at Bierfabriek"), per the brief's
  own §3 rule; the venue link already approved for Bierfabriek is
  reused. NO free-entry claim copied: eventType OTHER → no CTA, no
  invented ticketing.
- **FLAG for Aditya:** the brief says "Friday 4 November 2026" — that
  date is a Wednesday. Entered as dated (04-11); a Studio edit fixes it
  in seconds if the client meant another day.
- "Waiting for Varsha" removed everywhere public (concerts note +
  wrapper + dead .pending-note CSS); no replacement label; served-HTML
  sweep across pages shows zero occurrences.

## Cohesion pass

- **Shared grid**: every page hero now sits on the same wide-container
  left edge (Music Production's hero was the one outlier — fixed;
  measured H1 x=176 on all 12 audited routes at 1440). Mobile sweep:
  zero horizontal overflow on all routes.
- **Shared red-line component** (`Callout`): one implementation now used
  for concerts ticketsNote, production redline, scores redline and
  scores readyClosing — same line, gap, width everywhere; the Original
  Scores instance sits flush on the page grid (the flagged offset is
  gone), and the whole scores intro (eyebrow → H1 → categories → key
  statement → red line) reads as one left-aligned composition (§24).
- **Original Scores vinyls**: the player object scaled from 178×120 to
  310×210 on desktop (sleeve 210px, disc 190px, proportional slide-out
  18px; 170×118 on phones) so tonearm, rotation and the progress ring
  read at normal zoom. Full functional run after scaling: play/pause/
  switch/keyboard/reduced-motion OK, zero mobile overflow. Bottom copy
  blocks now share one two-column grid with a common top baseline.
- **Live Piano** rebuilt to the brief's recommended shape: title/intro →
  LARGE Rome performance image → two aligned copy columns (same top
  baseline and reading width) → grand-piano portrait at scale beside the
  short vocalist statement → listen band → CTA. No orphan paragraphs, no
  offsets.
- **Music Production**: both paragraphs in ONE left column (the floating
  offset paragraph is gone), portrait enlarged beside them — same grid
  language as Live Piano.
- **Home About section**: image-led — the portrait is now the section
  (large, first in DOM so phones lead with it), approved copy supports
  it in a narrow column.
- **Spin Through the Shelf**: two records per row on desktop (sleeves
  ~560px, one per row on phones) so artwork and the vinyl slide-out
  actually read; metadata stays compact (year/title/credits/listen).
- **Media**: image-heavy — featured story is an image-led split, press
  scans render large on a deliberate grid (the floated thumbnail text-
  wrap is gone, per §6), and the three film covers carry the On-screen
  band as full-column posters.

## Verification

vitest 69/69 · all 14 routes 200 with clean consoles · left-edge audit
consistent · zero mobile overflow on every route · vinyl player
functional run OK at the new scale · Studio: events editable, new image
fields intact · desktop + mobile screenshots inspected per changed page.

## Still with Aditya

- `git push origin staging` (device repo carries the docs note f4d1120
  + this pass; the earlier feature commits are already on GitHub).
- Re-seed after push so Neon gets the four events:
  `SEED_DEMO_EVENTS=false npx tsx prisma/seed.ts` (idempotent).
- The production domain still served the pre-restructure build at the
  time of writing — the client is clearly reviewing a preview
  deployment; check the Vercel dashboard for the stuck/unpromoted
  production deployment.
- Confirm the 4-November Wednesday/Friday question with the client.
