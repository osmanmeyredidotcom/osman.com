# Homepage gallery: restored scrolling gallery, approved photos (11-10-2026)

Correction brief: `OSMAN_GALLERY_RESTORE_SCROLL_PHOTOS_ONLY`. It replaces the reference-strip
version committed earlier the same day (one short strip sized to the 1600 px reference: at wide
screens all seven tiles fitted the viewport, so the row no longer moved, and slot 5 showed a text
card).

## 4-11-2026 set (current): the four NDSM kade photographs

VP, 4-11-2026: "Remove the last 3 photographs from the image carousel of homepage". Photos 5, 6
and 7 of the 2-11-2026 set below (blue-lit keyboard performer, singer with a light hat,
black-and-white drummer) are out of the homepage set; their files stay in `public/` for Studio.
The carousel is photos 1 to 4 of that set, unchanged and in the same order: black hat (dark
wall), pointing (green trees), white T-shirt (dark wall, zoom 1.22 at 50% 0%), straw hat (light
sky). The hidden gallery heading now reads "Photographs of Osman Meyredi".

## 2-11-2026 set: Jolene's carousel brief

Brief (Jolene, forwarded by VP with screenshots): remove the studio headphones photo ("We don't
need all the instruments being featured. We need him to be an artist."), the green-lit bass and
the blue electric guitar; replace the NDSM -5 quay photo added earlier that day with -8, cropped
in; add -12 and -15 ("zoom in a bit"); "Black hat image first. Drums and older images at the
back!"; "Mind color and position of images to decide where to add in the carousel."

Order chosen by colour and where Osman Meyredi sits in each frame: dark wall, green trees, dark
wall, light sky, then the older teal, warm and black-and-white stage photos. Sources: the
photographer's NDSM kade set (Joyce van Doorn, JVDPhotography) in
`OsmanMeyredi/FOTO'S/Edited/Carousel` (PSD composites, Adobe RGB converted to sRGB, relative
colorimetric with black-point compensation) and, for -8, the unedited original in
`OsmanMeyredi/FOTO'S/Osman - JVDPhotography`. Derivatives follow the rules below (sRGB, JPEG q80
progressive, metadata stripped, 1600 px tall).

| # | Subject | Source | SHA-256 (12) | Source size | Output asset | Output size | Crop | Zoom | Focal point |
|---|---------|--------|--------------|-------------|--------------|-------------|------|------|-------------|
| 1 | Black hat, dark wall | `Edited/Carousel/Osman - NDSM kade - JVDPhotography -19.psd` | 695824b8a31a | 6000 x 4002 | `/images/gallery/home-carousel-ndsm-19-black-hat.jpg` | 2399 x 1600 | none | none | none |
| 2 | Pointing, green trees | `Edited/Carousel/Osman - NDSM kade - JVDPhotography -12.psd` | ef7146bbace7 | 6000 x 4002 | `/images/gallery/home-carousel-ndsm-12-pointing.jpg` | 2399 x 1600 | none | none | none |
| 3 | White T-shirt, dark wall | `Edited/Carousel/Osman - NDSM kade - JVDPhotography -15.psd` | aa01aa762923 | 6000 x 4002 | `/images/gallery/home-carousel-ndsm-15-white-tee.jpg` | 2399 x 1600 | none | 1.22 | 50% 0% |
| 4 | Straw hat, cloudy sky | `Osman - JVDPhotography/Osman - NDSM kade - JVDPhotography -8.jpg` (original) | 25b54649758e | 6000 x 4002 | `/images/gallery/home-carousel-ndsm-08-straw-hat.jpg` | 2400 x 1600 | x 1760, y 328, 2400 x 1600 (head and shoulders) | none | none |
| 5 | Blue-lit keyboard performer | as photo 2 of the 11-10 set | f603455851ec | 2048 x 2048 | `/images/gallery/home-carousel-02-keys-teal-hr.jpg` | 1600 x 1600 | none | 1.10 | 54% 46% |
| 6 | Singer with a light hat | as photo 3 of the 11-10 set | eef74cf0cb49 | 4284 x 5712 | `/images/gallery/home-carousel-03-hat-singer.jpg` | 1200 x 1600 | none | 1.06 | 50% 8% |
| 7 | Black-and-white drummer | as photo 1 of the 11-10 set | 6aed200a94e6 | 1354 x 1984 | `/images/gallery/home-carousel-01-drummer-bw.jpg` | 1083 x 1600 | 18 px a side | 1.10 | 55% 54% |

Retired from the set (files kept in `public/` for Studio): `home-carousel-04-green-bass.jpg`,
`home-carousel-05-studio-headphones.jpg`, `home-carousel-06-electric-guitar.jpg`,
`home-carousel-07-bassist-bw.jpg`. The NDSM -5 quay derivative (`home-carousel-07-ndsm-kade-quay.jpg`,
added and replaced on 2-11-2026) is deleted.

The tables below record the 11-10 set and its history.

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

## Zoom inside each frame

`zoom` (1.06 to 1.12; photo 6 at 1.28 on request) scales the image layer only, around `focus` (CSS transform-origin), inside
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
| 2 | Blue-lit keyboard performer | high-resolution file supplied by VP in the Cowork chat on 11-10-2026 (`image.jpg`) | f603455851ec | 2048 x 2048 | `/images/gallery/home-carousel-02-keys-teal-hr.jpg` | 1600 x 1600 | none | 1.10 | 54% 46% |
| 3 | Singer with a light hat | `Edited/Carousel Homepage/IMG_1049.jpeg` | eef74cf0cb49 | 4284 x 5712 | `/images/gallery/home-carousel-03-hat-singer.jpg` | 1200 x 1600 | none | 1.06 | 50% 8% |
| 4 | Green-lit player | `Edited/Carousel Homepage/04. Osman Waterhole Bass.psd` (composite exported) | 0fcba1b14832 | 2528 x 1688 | `/images/gallery/home-carousel-04-green-bass.jpg` | 2396 x 1600 | none | 1.12 | 44% 45% |
| 5 | Headphones studio photograph | supplied by VP in the Cowork chat on 11-10-2026 (`image.jpg`) | d623998832d4 | 2092 x 2048 | `/images/gallery/home-carousel-05-studio-headphones.jpg` | 1634 x 1600 | none | 1.08 | 45% 40% |
| 6 | Electric guitar | `Edited/Carousel Homepage/07. NW_Osman_ElecQuitar_HR.jpeg` | cf7d40bd434d | 3584 x 4800 | `/images/gallery/home-carousel-06-electric-guitar.jpg` | 1195 x 1600 | none | 1.28 | 0% 25% |
| 7 | NDSM quay, light straw hat (since 2-11-2026) | `OsmanMeyredi/FOTO'S/Edited/Carousel/Osman - NDSM kade - JVDPhotography -5.psd` (composite exported, Adobe RGB converted to sRGB) | 9cea45d980d9 | 4002 x 6000 | `/images/gallery/home-carousel-07-ndsm-kade-quay.jpg` | 1067 x 1600 | none | none | none |
| 7 (until 2-11-2026) | Black-and-white bassist | supplied by VP in the Cowork chat on 12-10-2026 (`image.jpg`) | 45d1d8fdd476 | 1932 x 2576 | `/images/gallery/home-carousel-07-bassist-bw.jpg` (file kept) | 1200 x 1600 | none | 1.08 | 45% 25% |

Notes:

- 2: replaced on 11-10-2026 by the 2048 px file VP supplied (matches the reference tile at
  0.969). It has exactly the framing of the earlier 199 px file (`Zappatika Picture 8.jpeg`,
  sha 5a8ef23ba506; whole frame to whole frame), and the keyboard's logo shows invented
  lettering, so it appears to be an AI upscale of that file rather than a camera original. Used
  at VP's request. The earlier 4x EDSR derivative (`home-carousel-02-keys-teal.jpg`) is removed.
- 3: the source carries an Apple wide-colour profile; it was converted to sRGB, not just stripped.
- 4: the PSD composite is the same image as `be8dd39bb7c9486b839d931d4f29b265_gemini-3.jpg`
  (mean difference 0.7 of 255), an AI-processed (Gemini) version of the frame, and it is what the
  reference collage used (no grade difference). Correction of the earlier record: the darker file
  is `Edited/Other pages/be8dd39..._gemini-3.1-flash-image-preview.jpg`, not the PSD. The camera
  original is `Forget these/NEW to Edit/NEW_Bass_Color.JPG` (1600 x 1068, darker).
- 5: matches the reference tile at 0.989 (template correlation). Not yet in the approved folder.
- 6: zoomed to 1.28 from the left edge on 12-10-2026 at VP's request, so neither headstock on the
  right shows (his own guitar's tip and the white bass on its stand, whose tuners render oddly).
  The right edge now falls at about 78% of the photo width, near the reference's 85%.
- 7: replaced on 12-10-2026 by the black-and-white photo VP supplied. It is the frame the reference
  used (match 0.983) and a black-and-white version of the colour photo `gallery-04-bass-doorway.jpg`
  (match 0.969). The earlier stand-in, the About page's `about-performance-italy.jpg`, is no longer
  used here and stays on the About page.
