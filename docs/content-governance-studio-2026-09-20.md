# Content governance + Studio rework — final report (20-09-2026)

Two-part pass per OSMAN_FULL_CONTENT_AUDIT_AND_STUDIO_REWORK.md: first the
site-wide dash/punctuation audit under the copy-lock rule, then the Studio
rework so normal website content is editable without code.

## 1. Content audit

Pages checked (rendered + source + data + seeds + Studio UI + validation +
knowledge layer): Home, About, Services overview, Concerts, Live Piano,
Music Production, Original Scores & Custom Music, Shows, Concerts (shows),
Upcoming Gigs, Live Videos, Music, Media, Contact, Shop, footer, fullscreen
menu, sub-navs, buttons/CTAs, alt text, OG/meta descriptions, JSON-LD
sources, form helper/empty/error/success text, Studio field help and
notices, email subjects.

- **130 punctuation-only edits** applied; the full before/after table is in
  `docs/content-audit-log-2026-09-20.md`. Words are identical in every
  edit (verified string-by-string; the fix script asserts each exact
  match). No sentence was rewritten, shortened or paraphrased.
- Separator conventions now used instead of em dashes: `·` for label
  pairs (credits "Band · Osman Meyredi: role", "Listen · Spotify", email
  subjects), `:` for name→role credits and label→detail lines, `|` for
  SEO title separators, and the client's own ` – ` for video/event title
  separators (their "Live Piano – Cinetol, Amsterdam" convention).
- **Retained on purpose (§56)**: official titles (the BTSHTF album, the
  Alto Adige headline), client-written text (Cinetol description), date
  ranges, empty-value glyphs, internal notes and code comments. Rendered
  check: the only em dash left on the homepage is the official album title.
- The seed's update blocks now refresh the audited fields (video titles,
  FAQ answers, product/service/collaboration descriptions), so one re-seed
  pushes the cleaned wording to Neon without touching Studio-owned edits
  beyond those approved fields.

## 2. Studio rework

**Model.** A page-copy layer (`src/data/page-copy.ts` registry +
`CopyRepo`) stores overrides in the existing key-value store (SiteSetting
rows prefixed `copy:`; the demo snapshot in demo mode) — deliberately **no
schema migration** (§54: nothing to break, nothing to back up, works on
Neon the moment it deploys). The registry declares every editable field
with a plain-language label and the client-approved wording as its
default; pages render `stored ?? default`, so fallbacks fill gaps but can
never overwrite an edit (§52), and clearing a field safely returns the
approved text.

**Studio sections added.** "Pages" (nav item) → Home, About, Services
overview, the four service pages, Contact, plus **Homepage gallery**
(eight photo slots: image, description, shape, pixel size; emptying a
slot's image hides it). Forms are generated from the registry: no JSON,
IDs or enum codes (§38); URL/image fields validate site paths or https
addresses before publishing (§30/§41); long fields support paragraphs and
safe `[text](/path)` links — no raw HTML (§27).

**Now editable without code** (§57 checklist): homepage roles/intro/hero
image/About block/shop line/closing button (label + destination), all
About copy + both photos, service names (feeding the fullscreen menu,
footer, sub-nav, tiles and breadcrumbs from one source), every service
page's copy/CTAs/images, contact heading + management name and all three
public emails + language lines, per-page SEO titles and meta descriptions,
plus everything already Studio-driven: releases (all platform links,
covers, credits), collaborations, live videos (YouTube/**Vimeo**/file —
provider auto-detected from a pasted URL, §17), events (dates, venues,
ticket links), media items, Q&A, shop, social links, announcement.

**One source of truth (§43/§44).** JSON-LD keeps reading the same records
that render; the AI knowledge layer now resolves service copy through the
same Studio store instead of a code constant.

## 3. QA

- Build clean; **69/69 tests** pass (subject-format tests updated to the
  audited `·` separator).
- Every public route 200 in demo mode; sitemap intact.
- Word-identity spot checks on all copy-wired pages (exact signature
  sentences incl. curly-apostrophe fidelity, "80’s").
- **End-to-end edit flow verified through the real Studio UI** (Playwright:
  login → Pages → About → edit a heading → Save → public page shows it →
  clear → approved default returns, in the editor and on the page).
- Gallery renders all 8 slots through the Studio-driven path; animations
  untouched (§48 — the motion components only received data props).

## 4. Deploy notes for Aditya

1. Push + PR as usual. **No prisma migration needed** for the copy layer.
2. Re-seed once (`SEED_DEMO_EVENTS=false npx tsx prisma/seed.ts`) so the
   punctuation-audited titles/credits/answers reach existing Neon rows.
3. Production check per §55: sign into the Studio → Pages → edit one field
   → Save → confirm the live page updates without a redeploy (server
   actions revalidate the site on save).

## 5. Blockers / not done (honest list)

- **Media library with uploads, focal points, drag-and-drop ordering,
  draft/preview-before-publish for copy fields, revision history** (§28,
  §29, §31, §32, §34-drag): not built this pass. Copy edits are
  immediate-on-save (like Site settings today); list ordering stays
  numeric in the existing sections. Flagging per §58 rather than
  half-building them; say the word and these become the next pass.
- Images are referenced by site path/URL; new files still land in
  `public/images/` via deploy (no binary upload pipeline exists in the
  stack today).
- Shows/Music/Media page headings + a few micro-labels (e.g. "All dates",
  role labels on the contact column) remain code-side by design — they are
  structural UI, and §10 allows it.
- §55 Vercel verification requires the deploy; local prod-mode behaviour
  is fully verified.
