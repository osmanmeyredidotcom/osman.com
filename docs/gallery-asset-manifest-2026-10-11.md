# Homepage gallery: restored scrolling gallery, approved photos (11-10-2026)

Correction brief: `OSMAN_GALLERY_RESTORE_SCROLL_PHOTOS_ONLY`. It replaces the reference-strip
version committed earlier the same day (one short strip sized to the 1600 px reference: at wide
screens all seven tiles fitted the viewport, so the row no longer moved, and slot 5 showed a text
card).

## Restored behaviour (the working baseline)

The gallery code and styles are back to the Adele-reference gallery of 20-09-2026 (commit
`bf2d30e`, unchanged through `f223f42`), before the mixed-size change (`5d8a579`) and the
reference-strip change:

- Desktop (768 px and wider, motion allowed): the section pins (sticky 100vh viewport) and
  vertical scrolling moves the row horizontally 1:1 with light smoothing; reverse scrolling
  reverses it; the thin progress line fills with the travel. Wheel, trackpad, keyboard page
  scrolling and touch scrolling all drive it, because the position comes from the page scroll.
- Phones (below 768 px): the row is a native horizontal swipe strip; vertical page scrolling is
  untouched; the progress line follows the swipe.
- Reduced motion: a vertical stack, everything visible, no pin.
- No autoplay, loop, snapping, hover pause or extra controls existed, and none were added.
- Geometry: one row height for every photo (66vh desktop, 54vh phones), width = height x the
  photo's aspect ratio, gaps `clamp(14px, 1.8vw, 26px)`, 7vw lead-in and run-out.

## Slight zoom inside each frame

`zoom` (1 to 1.12) scales the image layer only, around `focus` (CSS transform-origin), inside
its own frame (`.hg-item`, overflow hidden). The frame, the row, the gaps and the scroll travel
keep their size; the track's own transform is untouched. Studio replacements show unzoomed.

## Asset manifest (sequence as approved)

Master folder root (Aditya's Mac):
`/Users/adityavats/Library/Mobile Documents/com~apple~CloudDocs/OsmanMeyredi/Website/Website /09. Images Osman`
(note the space after the second `Website`). The approved folder `Edited/Caroussel` was renamed
`Edited/Carousel Homepage` on 11-10-2026 (13:56) and some files moved; checksums are unchanged and
current locations are given. Derivatives: sRGB, JPEG q80 progressive, metadata stripped, 1600 px
tall where the source allows, native aspect ratio, no reference crop. Originals untouched.

| # | Subject | Source (current location) | SHA-256 (12) | Source size | Output asset | Output size | Crop | Zoom | Focal point |
|---|---------|---------------------------|--------------|-------------|--------------|-------------|------|------|-------------|
| 1 | Black-and-white drummer | `How to make High Res?/IMG_2154.jpeg` (was in `Edited/Caroussel/How to make High Res?`) | 6aed200a94e6 | 1354 x 1984 | `/images/gallery/home-carousel-01-drummer-bw.jpg` | 1083 x 1600 | 18 px a side (white scanner margin only) | 1.10 | 55% 54% |
| 2 | Blue-lit keyboard performer | `Forget these/Zappatika Picture 8.jpeg` (was in `Edited/Caroussel`) | 5a8ef23ba506 | 199 x 199 | `/images/gallery/home-carousel-02-keys-teal.jpg` | 796 x 796 | none | 1.10 | 54% 46% |
| 3 | Singer with a light hat | `Edited/Carousel Homepage/IMG_1049.jpeg` | eef74cf0cb49 | 4284 x 5712 | `/images/gallery/home-carousel-03-hat-singer.jpg` | 1200 x 1600 | none | 1.06 | 50% 8% |
| 4 | Green-lit player | `Edited/Carousel Homepage/04. Osman Waterhole Bass.psd` (composite exported) | 0fcba1b14832 | 2528 x 1688 | `/images/gallery/home-carousel-04-green-bass.jpg` | 2396 x 1600 | none | 1.12 | 44% 45% |
| 5 | Headphones studio photograph | supplied by VP in the Cowork chat on 11-10-2026 (`image.jpg`) | d623998832d4 | 2092 x 2048 | `/images/gallery/home-carousel-05-studio-headphones.jpg` | 1634 x 1600 | none | 1.08 | 45% 40% |
| 6 | Electric guitar | `Edited/Carousel Homepage/07. NW_Osman_ElecQuitar_HR.jpeg` | cf7d40bd434d | 3584 x 4800 | `/images/gallery/home-carousel-06-electric-guitar.jpg` | 1195 x 1600 | none | 1.08 | 43% 40% |
| 7 | Black-and-white bassist | existing site asset `public/images/about/about-performance-italy.jpg` (used as is) | a05df05b4d1a | 1920 x 1071 | `/images/about/about-performance-italy.jpg` | 1920 x 1071 | none | 1.06 | 54% 15% |

Notes:

- 2: the only source is 199 px. The file is a 4x super-resolution derivative of the whole frame
  (EDSR, a fidelity model, not generative; OpenCV-contrib 4.10 `dnn_superres`, `EDSR_x4.pb`
  sha256 `dd35ce3cae53ecee2d16045e08a932c3e7242d641bb65cb971d123e06904347f`), no retouching or
  regrading. It is not an original high-resolution file and reads soft at full gallery height.
  The other copy found (`Forget these/Zappatika/Zappatika Picture 8.jpg`, 960 x 540) holds the
  same pixels 1:1.
- 3: the source carries an Apple wide-colour profile; it was converted to sRGB, not just stripped.
- 4: the PSD composite is the same image as `be8dd39bb7c9486b839d931d4f29b265_gemini-3.jpg`
  (mean difference 0.7 of 255), an AI-processed (Gemini) version of the frame, and it is what the
  reference collage used (no grade difference). Correction of the earlier record: the darker file
  is `Edited/Other pages/be8dd39..._gemini-3.1-flash-image-preview.jpg`, not the PSD. The camera
  original is `Forget these/NEW to Edit/NEW_Bass_Color.JPG` (1600 x 1068, darker).
- 5: matches the reference tile at 0.989 (template correlation). Not yet in the approved folder.
- 7: no copy of this frame exists in the approved folder; this black-and-white site asset is the
  approved subject (the colour frame `gallery-04-bass-doorway.jpg` matches the reference pose more
  closely but is in colour, and colours are not changed).
