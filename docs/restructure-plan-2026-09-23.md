# Less-text-heavy restructure — internal plan (23-09-2026)

Per OSMAN_NEW_FEEDBACK_RESTRUCTURE_LESS_TEXT_HEAVY.md. Copy-lock: every
approved word stays; only presentation changes. Source doc
`New Osman feedback.pages` is NOT yet available in any connected folder
(searched Website mount, OsmanMeyredi iCloud root, repo folder — Aditya
pinged 23-09). Items §22–27 (gallery swap target, music/collab links,
Falling for You, red Sparrow artwork, ZAPPATiKA link) are HELD until it
arrives; everything else proceeds now.

## Audit — "before" numbers (desktop 1440, from density-audit.js)

| page | paras | chars | max run | run chars | media | chars/media | verdict |
|---|---|---|---|---|---|---|---|
| original-scores | 22 | 2017 | 8 | 1668 | 0 | 2017 | worst: whole intro is one text column, player buried |
| about | 8 | 2134 | 3 | 1032 | 2 | 1067 | document-like chapters, tiny headings, one narrow left column |
| services hub | 9 | 787 | 6 | 712 | 0 | 787 | pure text table, zero imagery |
| shop | 9 | 928 | 5 | 888 | 0 | 928 | placeholder studies; not in §43 scope — leave |
| concerts | 12 | 1606 | 4 | 719 | 1 | 1606 | 2 long paras + callout before any image |
| live-piano | 10 | 1196 | 4 | 912 | 1 | 1196 | 3-para wall after the portrait |
| music-production | 6 | 1276 | 3 | 368 | 2 | 638 | already alternates text/image; light touch |
| home | 40 | 1856 | 3 | 494 | 16 | 116 | already image-led; light touch + §22 later |
| music | 21 | 1103 | 2 | 503 | 5 | 221 | metadata-driven already; §23–27 later |
| live-videos | 16 | 1410 | 2 | 284 | 8 | 176 | video-led already; feature the lead video |
| shows | 13 | 492 | 1 | 91 | 0 | 492 | scannable list; fine |
| media | 17 | 831 | 2 | 165 | 4 | 208 | fine |
| contact | 11 | 243 | 1 | 74 | 0 | 243 | form-led; fine |

## Shared kit (small primitives, composed differently per page — §12)

- `ReadMore` client component: SSR renders ALL copy in the DOM (SEO);
  collapsed region beyond the first paragraph(s), button aria-expanded,
  grid-rows 0fr→1fr height ease, reduced-motion = instant, scroll position
  preserved. Used ONLY on Original Scores ("how he works" detail) and About
  (nowhere else — §32 "selectively").
- `splitCopy(value)`: blank-line paragraph split shared with CopyText so a
  single Studio field can be laid out as lead line + supporting column
  without hardcoding text. Editor text keeps working whatever the count.
- Image-break/split-section layouts are per-page JSX using existing
  `Reveal` variants (mask/media) + `Parallax` — no new scroll system (§40).

## Per-page moves

1. **Home** — already the least text-heavy (116 chars/media). Tighten the
   collaborations strip to metadata treatment; no structural surgery.
   §22 gallery swap (Edited.png) when source names the outgoing frame.
2. **About** — chapter architecture: oversized numbered chapter openers
   (01–04), alternating split layouts (image beside narrow text column),
   childhood-piano photo (gallery-08, approved) leads "Where it started",
   studio-2011 photo available as spare; hero intro narrowed; languages
   chapter as quiet closing band; memorial line unchanged at the foot.
3. **Services hub** — each of the 4 rows becomes an editorial split with an
   approved service photo (concerts-live-landscape / live-piano-grand /
   production-studio / gallery-07-studio-2011), image fields added to the
   services copy registry so Studio can swap them (§36).
4. **Concerts** — live image joins the opener (split hero: statement left,
   photo right) so proof is immediate; "The Show" paragraphs in a narrower
   column; three-ways items get lighter metadata treatment with more
   space; red audience question stays as the big typographic moment; add
   contextual live-videos proof link.
5. **Live Piano** — split hero (portrait right); repertoire paragraph
   narrow; venue-piano paragraph beside second approved piano image
   (live-piano-rome-2025); vocalist line as short pull-line; "Want to
   hear" as full-width band.
6. **Music Production** — scale up statement, keep alternation, pull-line
   from approved copy, wider breathing room. Light.
7. **Original Scores** — biggest rework: opener = H1 + one-line statement +
   callout, then musicianship statement + vinyl player IMMEDIATELY;
   supporting copy (distinctive/classical/ready/closing) moves below the
   player as a "chapter" with studio imagery and a single ReadMore for the
   long explanatory pair; licence CTA + preview note stay with the player.
8. **Music** — visual pass only now (feature treatment already exists);
   §23–27 items on source arrival.
9. **Live Videos** — lead video becomes a full-width feature, rest grid.
10. **Shows / Media / Contact** — verified, already scannable; no surgery.
11. Full regression: routes, vitest, console, mobile 390 sweep,
    before/after density re-run.

## Studio safety (§36–38)

Every moved block keeps reading its existing copy field; new image slots
become copy-registry `image` fields with approved defaults. No field is
deleted; no words change. Field mapping checked page by page before edit.
