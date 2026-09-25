# /althome: alternate homepage, report back (25-09-2026)

Brief: `ALTHOME_BRIEF.md` (VP, 25-09-2026). Built on branch **`feat/althome`**, cut from `staging` at `6c50440`. Not merged, not deployed.

`/althome` shows the same content as `/`, from the same sources, presented image- and motion-first: the Van Morrison hero entry, the Van Morrison "records" fan in place of the vinyl shelf, and the Paul Kalkbrenner scroll feel (Lenis, pixel take-downs, rising reveals, split headlines, drifting photos).

## 1. Files

Added:

| File | What it is |
|---|---|
| `src/app/(public)/althome/page.tsx` | The route. Same data calls as `/` (settings, events, releases, videos, media, collaborations, `getPageCopy("home")`, `getStoredCopy()`, gallery slots). `robots: { index: false, follow: false }`. |
| `src/components/althome/AlthomeRoot.tsx` | The page's one motion controller: Lenis, reveal groups, split headlines, photo drift. Everything is created on mount and destroyed on unmount. |
| `src/components/althome/HeroEntry.tsx` | Element A: video, curtains, outline and fill name, roles and CTAs, promo card. |
| `src/components/althome/MusicFan.tsx` | Element B: the records fan (entry, hover, resize). |
| `src/components/althome/fanGeometry.ts` | Fan sizes, rotations, stacking and spacing from the brief, shared by the server CSS and GSAP. |
| `src/components/althome/PixelatedTransition.tsx` | Element C: the reusable pixel take-down (`columns`, `rows`, `mode`, `color`). |
| `src/components/althome/AltGallery.tsx` | The main image moment: a GSAP copy of the homepage gallery, larger. `HomeScrollGallery` itself is untouched. |
| `src/components/althome/motion.ts` | Registers ScrollTrigger, SplitText and CustomEase (`osmo`) on first use, client side only. |
| `src/components/althome/labels.ts` | The labels `/` hard-codes, mirrored verbatim in one place (see Open questions 1). |
| `src/components/althome/althome.css` | Page styles. Every selector is scoped (`.ah-*`, `[data-althome]`, `html.lenis`). Existing tokens and fonts only. |
| `tests/althome.test.ts` | 42 tests: not in the sitemap, fan geometry equals the brief and the browser measurement, fans stay on screen at every width, every label exists verbatim on `/`, no em dashes. |
| `docs/althome-report-2026-09-25.md` | This report. |

Changed:

| File | Change |
|---|---|
| `package.json`, `package-lock.json` | `gsap ^3.15.0`, `lenis ^1.3.26`. |
| `src/app/sitemap.ts` | A two-line comment only. The sitemap is an explicit allowlist, so `/althome` was never in it. |

Nothing that `/` renders was touched: `git diff staging --stat` shows only the files above.

**For Aditya:** `git checkout feat/althome && npm install && npm run dev`, then open `/althome`. No migration, no reseed. Push with `git push -u origin feat/althome` when you are ready; do not merge.

## 2. Acceptance checklist (brief §8)

| # | Item | Result |
|---|---|---|
| 1 | `/` unchanged | **Pass.** `staging` and `feat/althome` built and served side by side, every image decoded before capture: full-page screenshots at 1440 and 390 differ by **0 pixels**, and `<main>` HTML is identical. |
| 2 | Header, footer, noindex, sitemap, nav | **Pass.** Header and footer render. `<meta name="robots" content="noindex, nofollow">`. Not in `/sitemap.xml` (also a test). No link to `/althome` anywhere in the site. |
| 3 | Hero entry | **Pass.** Measured in Chromium frame by frame (times from the moment the name appears; ±1 frame): name risen by 0.54 to 0.6s (spec 0.75s, power3.out is visually done earlier); curtains and fill wipe start at 1.12 to 1.18s (spec 1.10s) and open from the centre together; header, roles, CTAs and promo card start at 1.53 to 1.60s (spec 1.60s), roles and CTAs 0.05s apart; outline fades 1.75 to 2.08s (spec 1.80 to 2.10s). The entry waits for the video's first frame, never more than 1.8s. Video muted, looping, playing. No splash, no gate, no sound. |
| 4 | Records fan | **Pass.** Covers start low, small and hidden; the top card rises first, the rest 0.04s apart; then they fan out with `back.out(1.3)`: 6% rotation and position overshoot (25.5° before settling on 24°). Hover: lifted card y −14, scale 1.03, on top; cards to the left −8px and −4°, to the right +8px and +4°, the rest scale 0.985; everything returns on leave. Resize re-lays the fan without replaying it. Each record once. Nothing spins. |
| 5 | Pixel transitions | **Pass.** Three: hero → marquee, gallery → About, live video band → media. Pixels are `--color-canvas`, the colour of each next section. The share of visible pixels follows the scrollbar exactly (0, 15, 35, 60, 100%) and returns to 0 on the way back up. The bottom row goes first with a ragged edge. 25 columns on desktop, 6 at 390px. |
| 6 | Lenis | **Pass.** Desktop: on (a 400px wheel scrolls 500px smoothly). Touch devices and reduced motion: off. After leaving `/althome` by a normal link: no `lenis` class, no inline styles on `<html>` or the header, native scrolling; it comes back on browser Back. |
| 7 | Reveals, parallax, reduced motion | **Pass.** Reveal groups on roles and CTAs (inside the entry), next dates (35ms stagger), About text, collaborations, media, shop, CTA. Line-by-line headlines on "On stage soon", "The records" and the live video title. Photos drift at their own pace (see Deviations 7). Reduced motion: final state at once, no curtains, no pixels created, nothing hidden anywhere on the page. |
| 8 | Tokens, fonts, assets, copy | **Pass.** Existing colour tokens only (the hero gradient and card shadow are `--color-stage` at partial opacity). Archivo and Inter. Images from `public/images/…` plus `website-landscape.mp4` and its poster; no new files. All copy comes from the Studio copy and the repositories, except labels that `/` itself hard-codes (Open questions 1). |
| 9 | Client rules | **Pass.** No em dash added (the dashes on the page are in existing Studio content: event titles, the Cinetol video title, the press headline). Full name "Osman Meyredi". Buttons are compact pills. No duplicates: the hero video is not the band video, the promo card's record is not in the fan, no gallery photo repeats the About portrait. No memorial. |
| 10 | Tests, lint, build, console, overflow | **Pass.** `vitest`: 111 passed (69 existing + 42 new). `eslint .` clean. `tsc` clean. `VERCEL=1 npm run build` passes. No page errors; the only console message in this sandbox is the YouTube still for the band video failing to download (the sandbox cannot reach YouTube; `/` logs the same; it loads in a normal browser). No horizontal overflow at 1440, 1024, 768 and 390, with and without reduced motion, checked at every screen of the page. The name sits on one line at all four widths. |
| 11 | Screen recording | `althome-walkthrough-1440.mp4` (40s, 1440×900): entry, hero take-down, next dates, gallery, gallery take-down into the About portrait, the fan dealing out, hover over three covers. Stills: `althome-desktop-stills.png`, `althome-mobile-stills.png`. |

## 3. Open questions

1. **Labels that `/` hard-codes.** These are not in the Studio copy registry, so `/althome` reuses `/`'s own wording from one file (`labels.ts`, tested against `/`'s source): "See dates", "Booking & Inquiries", "Next dates", "On stage soon", "All dates", the no-dates sentence, "Featured release", "The full discography", "The records", "Spin through the shelf", "Listen", "About", "More about Osman Meyredi", "Collaborations & projects", "All collaborations", "Live", "All live videos", "Read the article", "All press", "Osman Meyredi, live and in the studio" (screen readers only), "Instruments and disciplines" (marquee label), the two shop-open lines, the instrument list, and the name "Osman Meyredi" (from `/`'s `<h1>`). Should they move into the registry so both homepages become Studio-editable at once?
2. **"Spin through the shelf"** now sits above a fan, not a shelf. It is kept as the small eyebrow because it is the section's existing copy. Keep it or drop it here?
3. **The giant name.** The client asked in Round 2 not to repeat the name huge on the homepage ("the logo is enough"). The brief asks for Van Morrison's giant name, so it is built as specified. Worth raising before the client sees it.
4. **The promo card's record** is the Studio's featured release: *Highway Maintenance* (Ike Willis & Zappatika, 2019). The client's rule is Osman's own releases first, then newest. Setting a different featured release in the Studio (for example *Dance With This Mess*) changes both homepages.
5. **Featured video.** The Studio's featured flag is on the 2019 ZAPPATiKA tour video, so **`/` still shows that video in its Live band**, although the client asked (24-09) for Osman's own show video on the homepage. `/althome` shows the first video in the Live Videos order that is not the hero's (*Live Piano – Cinetol, Amsterdam*). Moving the flag in the Studio would fix `/` without code; it was not changed here because `/` is out of scope.
6. **Collaborations teaser.** Following the brief (ZAPPATiKA is a normal collaboration, not a "band project"), `/althome` drops the "Collaboration / band project" tag and shows only each project's Studio role line. `/` still shows the tag.
7. **Fan labels.** The fan shows covers only, as on the reference. Title, credits and "Listen · platform" are in each cover's accessible name and on `/music`. The client asked for collaborations to be clearly labelled on the homepage records; if wanted here, the lightest addition is one caption line under the fan that follows hover and focus.
8. **Falling for You** appears as a cover in the fan and as the first entry in the collaborations teaser, the same as on `/`. The client's no-repetition rule could read this as a duplicate.
9. **The band video's still** comes from YouTube at 480px wide and is stretched to full width, so it looks soft. A thumbnail uploaded in the Studio for that video would sharpen it on both homepages.
10. **Hero video weight.** `website-landscape.mp4` is 19MB (1080p, 32s). It loads with `preload="metadata"` and a poster, and the entry never waits more than 1.8s, but it then streams in full. A lighter encode (720p, about 4 to 6MB) would help phones; that is a new file, so it needs your OK.
11. **Shop.** The shop band is now prominent (large line plus a pill). The client also asked to see the shop with products in it; that needs product data, which is not one of the homepage's sources in the brief.

## 4. Deviations from the spec, and why

1. **Hero height** is `calc(100svh − 65px)` (minimum 600px) rather than `100dvh`, so the hero exactly fills the screen under the site's sticky 65px header, and the name does not jump when a phone's browser bars move.
2. **Name size** is `min(15.7vw, 301px)` without the 5rem minimum: a 5rem floor overflows at 390px. Measured: 1294px of 1440, 350px of 390, one line everywhere.
3. **Phones:** the name centres in the space above the hero content, not the whole screen, so the two never overlap on short screens.
4. **Four covers, not five.** The featured release is already in the promo card and each record appears once. The top card is Osman's own release (*Dance With This Mess*); the others follow by prominence, newest first (*Falling for You* 2025, *Keep Your Eye on the Sparrow* 2024, *L'omino* 2023).
5. **Fan on smaller screens:** covers are dealt 1.4× larger at 641 to 768px and 1.75× at 640px and below; the measured table applies above 768px. With the table as is, phone covers would be 68 to 88px and almost fully stacked, because the overlap has a fixed 57px part. Spread factors (0.62, 0.48) and the overlap formula are unchanged; the multipliers are the largest that keep a five-cover fan 12px inside the screen (tested).
6. **Fan title:** "The records" is the giant title because it fits on one line like "THE MUSIC"; "Spin through the shelf" (the heading on `/`) is the eyebrow above it.
7. **Parallax without cropping.** The reference moves the image inside a frame, which hides about a fifth of the photo at any moment. The double bass in the About portrait touches the top and bottom of the photo, and the gallery rule is that Osman and the instrument always stay fully visible. So the photos drift whole instead: gallery photos rise and fall at alternating rates while the row travels, and the About portrait drifts −8% to 8% of its height against its text. The exact in-frame version is a small change if you prefer it.
8. **Gallery:** on landscape screens from 768px, a sticky full-screen row that scrolls sideways; photos sit low and as large as the screen allows (the widest is capped at 88vw so each can be seen whole), so the take-down eats into the photographs. On phones and portrait tablets, a swipe strip. With reduced motion, a vertical stack, as on `/`.
9. **Pixel start on short sections.** For sections at least a screen tall the take-down starts at `bottom bottom`, as measured. On phones, where the hero, gallery and video band are shorter than the screen, that would bite the photos while they are fully in view, so there it starts as the section begins to leave (`top top`). End (`bottom top`), scrub and pixel order are unchanged.
10. **Live video band** plays the first Live Videos entry that is not the hero video, rather than the Studio's featured video, because the featured one is the 2019 ZAPPATiKA tour video that the client rules keep off the homepage.
11. **Featured release details.** `/` shows the featured record's description, credits and type line; the brief's promo card is cover, title and links, so those lines are not on `/althome`. They stay on `/music`.
12. **Cover links** go to each record's first listening platform, the same link the shelf uses, because records have no pages of their own.
13. **No Person JSON-LD** on `/althome`: the page is noindex, and a second copy would duplicate `/`'s entity.
14. **Menu and Lenis:** the fullscreen menu scrolls natively and Lenis pauses while it is open. A workaround for Lenis 1.3.26, whose velocity timer otherwise put the `lenis` class back on `<html>` after leaving the page.
15. **Scroll behaviour:** while `/althome` is in the document, `<html>` uses `scroll-behavior: auto` (the site default is smooth), so Lenis and ScrollTrigger own the easing and ScrollTrigger never leaves an inline style on `<html>` for other pages.
16. **Reduced-motion hover** on the fan is a plain CSS lift of the hovered cover, as the brief allows.

## 5. How this was verified

Production builds in demo mode (the same records as the seed), in headless Chromium with real motion, not reduced motion, except where reduced motion was the thing under test. Timings come from sampling computed styles every frame. This Chromium has no H.264 decoder, so during tests and the recording the hero video was served as a VP9 copy of the same file; the site itself still uses `website-landscape.mp4`. The YouTube still for the band video cannot load in this sandbox and shows as empty in the stills and the recording; in a normal browser it loads.
