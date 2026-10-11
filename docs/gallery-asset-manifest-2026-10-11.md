# Homepage gallery: reference reproduction asset manifest (11-10-2026)

Built for the homepage gallery reference-matching brief (`image(9).png`, 1600 x 287; strip rows
y12-253, height 242) and implemented after approval of "Gallery review v01" on 11-10-2026.
Reference tile boundaries measured: x = 0, 233, (2 px light seam), 235, 458, 718, 921, 1176, 1399, 1596.

Derivatives live in `public/images/gallery-ref/` (JPEG q88, optimised, metadata stripped, Lanczos
resize to 1000 px tall where the crop is larger). Originals are untouched. Crop rectangles are in
oriented source pixels (EXIF orientation applied). "Slot" is the existing Studio gallery slot
(Pages - Homepage gallery); a Studio-supplied image in slot 5 replaces the reserved placeholder.

Master folder root (Aditya's Mac):
`/Users/adityavats/Library/Mobile Documents/com~apple~CloudDocs/OsmanMeyredi/Website/Website /09. Images Osman`
(note the space after the second `Website`). Sources were taken from `Edited/Caroussel` on 11-10-2026
(13:26-13:33). At 13:56 the folder was reorganised; every source below still has the same checksum,
and its current location is listed after the arrow.

| # | Subject | Source (taken from -> now at) | SHA-256 (12) | Oriented size | Output (dims, bytes) | Crop rect x,y,w,h | Tile AR | @1600 | @390 | Slot | Landmarks verified | Status |
|---|---------|-------------------------------|--------------|---------------|----------------------|-------------------|---------|-------|------|------|--------------------|--------|
| 1 | Black-and-white drummer | `Edited/Caroussel/How to make High Res?/IMG_2154.jpeg` -> `How to make High Res?/IMG_2154.jpeg` | 6aed200a94e6 | 1354 x 1984 | ref-1-drummer-bw.jpg (962 x 1000, 196,953 B) | 106, 433, 1229, 1277 | 0.962 | 233 x 242 | 165 x 172 | 1 | head x/y, ride-cymbal edge, tablecloth corner | match 0.961. Raw scan, unretouched, as approved (G-3). The reference shows a brightened edit of this scan; no cleaned export of this frame exists. `img079.jpeg` is a same-size near-duplicate. |
| 2 | Blue-lit keyboard performer | `Edited/Caroussel/Zappatika Picture 8.jpeg` -> `Forget these/Zappatika Picture 8.jpeg` | 5a8ef23ba506 | 199 x 199 | ref-2-keys-teal.jpg (640 x 696, 46,702 B) | 28, 5, 160, 174 (at 4x: 112, 20, 640, 696) | 0.920 | 223 x 242 | 158 x 172 | 2 | smoke plume apex, keyboard front edge | match 0.896. UPSCALED DERIVATIVE, not an original high-resolution file (G-2, approved): see "Photo 2 upscale" below. The only other copy, `Forget these/Zappatika/Zappatika Picture 8.jpg` (960 x 540 full-band photo, sha 73ae9eaf6654), holds this crop at the same 1:1 scale (match 0.999), so no higher-resolution original exists in the folders. Reference grade slightly brighter (not regraded). |
| 3 | Singer in light hat | `Edited/Caroussel/IMG_1049.jpeg` -> `Edited/Carousel Homepage/IMG_1049.jpeg` | eef74cf0cb49 | 4284 x 5712 | ref-3-hat-singer.jpg (1074 x 1000, 164,808 B) | 33, 33, 4241, 3947 | 1.074 | 260 x 242 | 185 x 172 | 3 | hat brim ends, mic capsule, bottle cap | match 0.949; no discrepancy. |
| 4 | Green-lit player | repo `public/images/gallery/home-05-bass-green-light.jpg`, the 09-10-2026 web export of `be8dd39bb7c9486b839d931d4f29b265_gemini-3.jpg` (sha 24af3830c135, now in `Forget these/JPG/Don't use/`) | 5248d2038251 | 2097 x 1400 | ref-4-green-bass.jpg (839 x 1000, 172,829 B) | 393, 64, 1077, 1284 | 0.839 | 203 x 242 | 144 x 172 | 4 | hairline highlight, tank-top strap, tie-dye pattern | match 0.937. Implemented as approved (G-4 preview). PROVENANCE CORRECTION (11-10-2026, after approval): this is not an untouched camera original, as the review PDF said. It is the AI-processed (Gemini) version of the frame, without the later colour grade. The reference used the graded version of the same file, now `Edited/Carousel Homepage/04. Osman Waterhole Bass.psd` (formerly `Caroussel/01 be8dd39...psd`, sha 0fcba1b14832, match 0.961). Detail is identical (high-frequency correlation 0.99); only the grade differs. No camera original of this frame was found. |
| 5 | Headphones studio photograph | NOT FOUND (searched: Caroussel + How to make High Res?, Edited root + JPG/Use + Don't use, Forget these + NEW to Edit, 09. Images Osman root, 05. Services, site repo assets) | - | - | reserved slot, no file | - | 1.054 (255/242) | 255 x 242 | 181 x 172 | 5 | - | MISSING SOURCE. Placeholder approved (G-1): a labelled tile at the exact reference geometry. A Studio image in slot 5 replaces it. |
| 6 | Electric guitar vs brick | `Edited/Caroussel/07. NW_Osman_ElecQuitar_HR.jpeg` -> `Edited/Carousel Homepage/07. NW_Osman_ElecQuitar_HR.jpeg` | cf7d40bd434d | 3584 x 4800 | ref-6-electric-brick.jpg (922 x 1000, 244,487 B) | 14, 598, 3030, 3288 | 0.922 | 223 x 242 | 158 x 172 | 6 | mic stand top-left, guitar horn, brick courses | match 0.869; reference slightly brighter (not regraded). |
| 7 | Black-and-white bassist (hat tip) | repo `public/images/about/about-performance-italy.jpg` (existing approved site asset, already black and white) | a05df05b4d1a | 1920 x 1071 | ref-7-bass-bw.jpg (870 x 1069, 201,957 B) | 557, 0, 870, 1069 | 0.814 | 197 x 242 | 140 x 172 | 7 | hat brim + hand, mic capsule, bass horn | match 0.777 (edge-refined rect within 8 px of photometric best). The reference copy is blurrier (upscaled from a smaller copy); framing within about 1%. |

## Photo 2 upscale (decision G-2)

- Method: EDSR x4 super-resolution (enhanced deep residual network, trained for fidelity with an
  L1 loss; not a generative or GAN model, so it does not invent detail), run through OpenCV-contrib
  4.10.0 `dnn_superres` with `EDSR_x4.pb` (the model the OpenCV documentation uses; sha256
  `dd35ce3cae53ecee2d16045e08a932c3e7242d641bb65cb971d123e06904347f`). Applied to the whole
  199 x 199 source so the crop edges have context, then the approved crop was taken at 4x.
  No retouching, regrading, denoising or extra sharpening.
- Verification: the delivered file, scaled back to 160 x 174 (area filter), matches the source crop
  at PSNR 37.6 dB, SSIM 0.990, mean absolute difference 1.6 of 255, mean colour shift under 0.1
  per channel. Plain Lanczos interpolation, which adds no information by definition, scores
  39.3 dB / 1.2 on the same test. The difference map shows only thin residuals along existing
  edges, no new shapes. Side by side at tile size: same content, crisper edges.
- Resolution: 640 x 696 covers the largest desktop tile (300 CSS px tall at the height cap,
  276 px wide) at 2x density.
- Output sha256: `7903398f77ba1cd93e026312152313b9c6f5df07c565a9ca12dbb3f4b88e91b5`.

## Rendering rule

One shared height per breakpoint: desktop `clamp(150px, 15.125vw, 300px)` (242 px at a 1600 px
viewport, the reference), phones `clamp(150px, 44vw, 210px)`; width = height x tile aspect ratio;
no gaps except the reference's 2 px light seam after tile 1; no lead-in padding. The existing
scroll/pin, swipe strip, progress line and reduced-motion stack are unchanged.

## Decisions recorded with the approval (11-10-2026)

- G-1 photo 5: labelled placeholder until the file arrives (approved).
- G-2 photo 2: faithful upscale, no added or changed elements (approved; above).
- G-3 photo 1: raw scan, as previewed.
- G-4 photo 4: the previewed file (see the provenance correction in row 4).
- G-5: the 2 px seam after the drummer is kept.
- G-6: the existing full-viewport gallery section is kept.

## Folder reorganisation noted (11-10-2026, 13:56)

`Edited/Caroussel` became `Edited/Carousel Homepage`. `Zappatika Picture 8.jpeg` moved to
`Forget these/`, `How to make High Res?` moved to the master folder root, the photo-4 PSD was
renamed `04. Osman Waterhole Bass.psd`, and `03. NW_Osman_Drums_HR.jpeg` (the other drum frame)
stayed in the carousel folder. The implementation follows the approved review PDF; the new folder
state was not treated as a new selection.
