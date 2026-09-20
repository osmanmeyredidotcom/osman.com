# Feedback Round 3 — implementation report (20-09-2026)

Sources used, in the brief's priority order: `Feedback OM.com3.key` (all 22
slides extracted verbatim), `FINAL SEP_About.pages`, `Final Sep_concerts.pages`,
`FINAL_Sep26_Music Production.pages`, `Original Scores_Final_Sep26.pages`,
`FINAL_Sep26_Live Piano.pages`, plus the piano photograph supplied in chat
("discussed on the call"). Every page below went through implement → build →
render → inspect (desktop + 390px mobile) → verify before moving on.

## Home — VERIFIED
- Roles row: **Artist · Multi-instrumentalist · Producer · Music director**
  (exact list from the slide; the site's established dot separators kept).
- "Booking & Inquiries" with capital I — header, fullscreen menu, footer.
- About block: exact new sentence ("…singer and producer, based in The
  Netherlands.") and the returning **double-bass portrait** replaces the
  landscape photo ("Can we please have this image back?").
- Vinyl shelf: back to the sleeve treatment — square cover, disc slides out
  on hover, **no turning**. Round-label artwork sits on the sleeve's dark
  backing (the "black square" concern). The Disco Sparks "Keep Your Eye on
  the Sparrow" record is removed; the **Special 45 stays**.
- Shop copy, exact: "A small shop is taking shape. A mix of music and things
  Osman loves. Coming soon." + "Visit the shop →".
- Closing band: all text removed, one confident pill — **Book Osman Live**
  (renders BOOK OSMAN LIVE), pointing at /contact.
- Adele gallery untouched per Aditya (already delivered); only its
  double-bass frame swapped for the doorway bass portrait so the same photo
  doesn't appear twice on one page.

## Contact — VERIFIED
- Intro paragraph removed; a restrained **accent-red line** sits under the
  heading (palette accent; thickness/length kept editorial — flag to Varsha
  if she wants it bolder).
- Italian line added exactly: *Scrivi in italiano, inglese o olandese*.
- Topic tile renamed "Original scores & custom music" (internal value
  unchanged so existing submissions keep working).

## About — VERIFIED (source: FINAL SEP_About.pages)
- Entire page replaced verbatim, including the title. Sections: intro → B&W
  **portrait double bass** → On stage with the greats → Two conservatories →
  **landscape all-instruments** → Where it started → Languages & availability.
  Image order exactly "first portrait, then landscape".
- **Blue Lou Marini** links to the live video containing that performance
  (the live showreel's anchor on /shows/live-videos).

## Services — VERIFIED
- Names everywhere (tiles, sub-nav, fullscreen menu, footer, contact email
  labels): **Concerts · Live Piano · Music Production · Original Scores &
  Custom Music**. Old labels removed ("& Live Performances", "for Events",
  "Special Events" from the tile, "Original Tracks & Music Library",
  "Live Bookings").
- /services heading: **All Services / Work with Osman Meyredi** (the
  "Four ways…" title is gone).
- **Concerts** (Final Sep_concerts, verbatim): The Show + the two arc
  paragraphs, the kept tickets note (now linking /shows), the three booking
  options with their new copy, the closing statement line. Title "Concerts".
- **Music Production** (FINAL_Sep26): shorter intro, "he can step in…",
  the Master The Mix Academy sentence, revised second paragraph.
- **Live Piano** (FINAL_Sep26): full doc copy in doc order, the supplied
  white-grand-piano photograph, live-videos link where the doc marks it,
  CTA **Book Osman Meyredi**.
- **Original Scores & Custom Music** (Original Scores_Final_Sep26): new
  intro (the no-AI authorship sentence, verbatim — not embellished), red
  line, both body paragraphs. The "Examples · 5 tracks" section renders as
  soon as tracks exist in the Studio (it shows the demo tracks in demo mode;
  the live site hides it until real tracks are uploaded). The document's
  "Save for later (Epidemic Sound)" block is intentionally NOT published,
  exactly as instructed. URL stays /services/music-library so no links
  break; say the word if the slug itself should change (that needs a
  redirect, which the redirect map is ready for).

## Shows — VERIFIED
- Added both gigs from the slide as played (struck) agenda entries:
  **25/07/2026 Streetfestival, Bagolino, Italy** and **11/08/2026
  Streetfestival, Bagolino, Italy** (Studio-editable, seeded on Neon too).
- **Tickets page removed**: route deleted with a permanent redirect
  /shows/tickets → /shows/concerts; Tickets removed from the Shows sub-nav,
  fullscreen menu, footer and the Shows overview (its section is gone);
  sitemap/IndexNow updated. Ticket buttons stay on the concert entries.

## Music — VERIFIED
- Heading **RELEASES** with the category line "Solo work · Collaborations ·
  Features · Band projects" (struck intro paragraph removed).
- The Disco Sparks "Keep Your Eye on the Sparrow" feature entry is removed;
  the Special 45 remains in Appears On.
- Collaborations: **no duplicated intro blocks** — newer collaborations
  (Kassko / Falling for You) list their recordings directly; the
  **ZAPPATiKA / Frank Zappa block keeps its intro, band image and album**
  by the slide's exception and now closes the page (newest at the top, own
  releases first).
- The closing licensing/sales section is removed.

## Live Videos — VERIFIED
- The reserved first slot now leads the page for the **B&W "Live Piano –
  Cinetol, Amsterdam"** video, which is *yet to be uploaded*: it exists in
  the Studio as a DRAFT carrying the exact approved title/description, so
  publishing = paste the URL and flip the status. No thumbnail was faked.
- **Live highlights** sits directly after it with the exact new sentence
  ("The music you'll hear is written, composed, played and produced by
  Osman Meyredi, especially for this video.").
- Remaining videos keep their approved order below; each video now has an
  anchor id for deep links (used by About's Blue Lou Marini link).

## Global — VERIFIED
- "No forms required if you prefer email…" — removed everywhere (repo-wide
  search: zero occurrences).
- Em dashes swept from non-client-written visible copy and metadata
  (the client's own em dashes — e.g. the Cinetol description — are kept).
- Obsolete labels swept (old service names, "Every Record, Marked",
  "Four ways…", misspelled variants). Full route probe: every public page
  200, sitemap clean, redirects live. Tests: 69/69.

## Blocked / follow-ups for Aditya
1. **Deploy steps**: after push + PR, run `npx prisma migrate deploy` (no new
   migration this round, safe either way) and re-seed
   (`SEED_DEMO_EVENTS=false npx tsx prisma/seed.ts`) so Neon picks up: the
   Bagolino gigs, the Sparrow removal, video order + Highlights copy, the
   Cinetol draft, collaboration order.
2. **Cinetol video**: upload/URL still needed — the draft is ready in the
   Studio.
3. **Contact accent line**: implemented restrained; Varsha may want to tune
   weight/colour.
4. The **homepage hero pick (A–F)** from 17-09 is still open — unaffected by
   this round.
5. Library slug: public name is now Original Scores & Custom Music while the
   URL remains /services/music-library — happy to rename the route with a
   redirect if wanted.
