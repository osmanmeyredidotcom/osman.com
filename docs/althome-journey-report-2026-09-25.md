# /althome in the client's homepage journey: report back (25-09-2026)

Brief: `althome-journey.md` (VP, 25-09-2026). Built on branch **`feat/althome`**, on top of the first `/althome` commit that is already live. **Not deployed yet:** this version waits for your review.

Everything from `docs/althome-report-2026-09-25.md` still holds (motion, colour tokens, copy sources, noindex, `/` untouched) except where this report says otherwise.

## 1. The new order, as rendered

Checked in the browser at 1440 and 390 (each section carries a `data-ah-section` marker, and a test holds the order to the brief):

| # | Section | Visitor should feel |
|---|---|---|
| 1 | Hero entry (unchanged), pixels out in the showreel's colour | Who is this? |
| 2 | **Showreel**, one screen tall, pixels out | Wow, he can really perform! |
| · | Instruments marquee | (confirms what was just watched) |
| 3 | **Live gigs**: upcoming dates, then the three most recent past dates, lighter | I can see him live |
| 4 | **Gallery**, re-worked (below), pixels out in the records' colour | I want to see more of him |
| 5 | **Records fan**, **collaborations**, **press**, **shop** | This feels like a serious artist |
| 6 | **About** teaser: portrait, approved sentence, travel line, link | Now I want to know who he is |
| 7 | **BOOK OSMAN LIVE** pill only | Can I book him? |

**First three screens at 1440×900, one viewport at a time:** screen 1 is the hero entry; screen 2 is the showreel's title and the whole video with its play button, all inside the screen (the video box ends at 847px of 900); screen 3 opens on "Next dates / On stage soon" with the first gig row fully in view. The marquee sits exactly under the site header at that point, so it doesn't push the gigs down, and it stays. **At 390px** the order is the same; the showreel and the start of the gigs share the second screen. Stills: `althome-journey-first-three-1440.png`, `althome-journey-first-three-390.png`.

## 2. The showreel

**Live showreel – bass guitar, keyboards, double bass and guitar**: the cross-section of Osman on four instruments that includes the Ponte Caffaro performance with Blue Lou Marini. It is the brief's first choice because it best proves "he can really perform".

It is picked from the Studio, not hard-coded: the first published live video tagged **showreel** (Studio → Live Videos → Tags). Remove that tag and the page falls back to the first video in the Live Videos order (today *Live Piano – Cinetol, Amsterdam*). It can never be the hero's own video, and it is not the 2019 ZAPPATiKA tour video. Nothing plays until the play button is pressed.

On landscape screens the band is exactly one screen tall: the video is sized so the title and the whole 16:9 frame fit under the header (about 1136px wide at 1440×900). The split-line headline reveal and the pixel take-down out are kept.

## 3. The gallery, before and after

**Removed from `/althome`** (the Studio gallery and `/` are unchanged):

- `gallery-08-piano-childhood.jpg`, the childhood photo: "too unprofessional".
- `gallery-07-studio-2011.jpg`: Osman recording keys in 2011 in shorts. It is the dated, casual look the client objected to on 24-09, so it goes too.

**Kept, six photos, now in a rhythm instead of one size.** Every photo keeps its own aspect ratio and is never cropped; what varies is its scale against the row, whether it sits high, centred or low, and the space after it. The rhythm opens on a dominant frame and repeats every six photos. At 1440×900:

| Photo | Size (px) | Place |
|---|---|---|
| Keys, live (black and white) | 1267 × 707 | low, dominant |
| Bass, neon | 296 × 396 | high, small |
| Keys, Eindhoven | 827 × 552 | low, medium |
| Bass by the doorway | 531 × 707 | low, large |
| Bass, crowd in Italy | 472 × 354 | centred, small |
| Bass, wine festival | 446 × 594 | low, medium |

The biggest frame is twice the height of the smallest. The row still scrolls sideways with the page, and each photo drifts vertically as it travels, the small ones most, so the row reads in depth. Big photos sit low, so the pixel take-down still eats into them. On phones it is a swipe strip with the same rhythm; with reduced motion it is a vertical stack that alternates sides. Before and after: `althome-journey-gallery-before-after.png`.

No photo appears twice: the gallery also skips any photo used as the About portrait, the hero poster or the hero fallback image.

## 4. Open questions

1. **The giant name** in the hero vs the client's Round 2 rule ("the logo is enough"). Unchanged; your call.
2. **Better images from the folder.** The client says there are better photos in `09. Images Osman` than the gallery shows. Nothing new was added; Varsha to choose, and they drop into the Studio's gallery slots.
3. **The featured-video flag** in the Studio is still on the 2019 ZAPPATiKA tour video, so `/` still shows it in its Live band. Moving the flag fixes `/` without code.
4. **The showreel's still is soft.** It comes from YouTube at 480px wide and is now the second thing a visitor sees, about 1136px wide. Uploading a proper still to that video's thumbnail in the Studio would sharpen it (on `/` and `/shows/live-videos` too).
5. **Past gigs:** the three most recent past dates follow the upcoming ones, lighter, with no ticket buttons. More or fewer is a one-number change.

## 5. Checks

- `/` unchanged: full-page screenshots at 1440 and 390 match the `staging` baseline pixel for pixel, and the HTML is identical.
- `vitest`: 117 passed (6 new: section order, showreel choice and fallback, gallery exclusions and no repeats, rhythm variety, gigs order). `eslint` and `tsc` clean. `VERCEL=1 npm run build` passes.
- No horizontal overflow at 1440, 1024, 768 and 390, with and without reduced motion. Reduced motion shows everything at once. Pixel take-downs scrub and reverse in the next section's colour (hero → stage, showreel → canvas, gallery → stage). Lenis is desktop-only and fully gone after leaving the page.
- Recording: `althome-journey-1440.mp4` (44s, top to bottom at 1440).

As before, this test browser can't play the MP4 format or reach YouTube: the recording uses a converted copy of the same hero video, and the showreel's still shows as a dark box with the play button. Both appear normally on the live site.

## 6. To deploy after your review

Same steps as last time. On Aditya's Mac: `git checkout staging && git merge --ff-only feat/althome && git push origin staging`, then a pull request from `staging` into `main` on GitHub, and merge. No settings, packages or database changes.
