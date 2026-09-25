/**
 * /althome — labels the current homepage (src/app/(public)/page.tsx)
 * renders as LITERALS. They are not in the Studio copy registry today, so
 * the brief's rule (§0.4: no new copy, reuse existing wording) is met by
 * mirroring them verbatim here, in one place. They are listed under "Open
 * questions" in docs/althome-report-2026-09-25.md so they can move into the
 * registry for both homepages at once. Never reword them here.
 */
export const HOME_LABELS = {
  /** The visually hidden <h1> on / ("Osman Meyredi"). */
  name: "Osman Meyredi",
  seeDates: "See dates",
  booking: "Booking & Inquiries",
  nextDatesEyebrow: "Next dates",
  nextDatesHeading: "On stage soon",
  allDates: "All dates",
  noDates: "No public dates are in the diary right now. In the meantime, there is plenty to",
  noDatesWatch: "watch",
  noDatesAnd: "and",
  noDatesListen: "listen to",
  featuredRelease: "Featured release",
  fullDiscography: "The full discography",
  recordsEyebrow: "The records",
  recordsHeading: "Spin through the shelf",
  listen: "Listen",
  aboutEyebrow: "About",
  moreAbout: "More about Osman Meyredi",
  collabEyebrow: "Collaborations & projects",
  allCollabs: "All collaborations",
  liveEyebrow: "Live",
  allLiveVideos: "All live videos",
  readArticle: "Read the article",
  allPress: "All press",
  gallery: "Osman Meyredi, live and in the studio",
  instruments: "Instruments and disciplines",
  shopOpenExternal: "The shop is open. Records and objects from Osman's world.",
  shopOpen: "The shop is open.",
} as const;

/** Keynote slides 2/23: the approved instrument list (mirrors / verbatim). */
export const INSTRUMENTS = [
  "Double bass",
  "Bass guitar",
  "Piano",
  "Keyboard",
  "Synthesiser",
  "Guitar",
  "Drums",
  "Percussion",
];
