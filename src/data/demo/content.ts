import type {
  CollaborationRecord,
  EventRecord,
  FaqRecord,
  LibraryTrackRecord,
  LiveVideoRecord,
  MediaItemRecord,
  ProductRecord,
  ReleaseRecord,
  ServiceRecord,
  SiteSettings,
} from "@/lib/types";

/**
 * Demo/seed content.
 *
 * FACTUAL INTEGRITY RULES (see docs/architecture.md):
 * - Biography, services, videos, releases and media below use ONLY facts verified
 *   from osmanmeyredi.com and public sources (Bandcamp, Discogs, Here Comes The Flood).
 * - Events are FICTIONAL DEMO FIXTURES so the interface is testable. They are
 *   clearly labelled "[DEMO]" in their titles and must be deleted before launch.
 * - Shop items are explicitly CONCEPTS (status CONCEPT), not purchasable products.
 * - Round 2 (Sep 2026): the client supplied Spotify links for the four vinyls and
 *   the own release (Keynote + the Collaboration folder's pages doc); covers are the
 *   original artwork files from Website/04. Music/Collaboration/.
 */

const now = "2026-08-10T00:00:00.000Z";
const meta = { createdAt: now, updatedAt: now };

export const demoSettings: SiteSettings = {
  heroTagline:
    "Multi-instrumentalist, bassist and composer. Performing, coaching and facilitating across the Netherlands, Italy and Europe.",
  announcement: null,
  // Round 2 strict email rule: never Osman's personal inbox — info@ everywhere public.
  contactEmail: "info@osmanmeyredi.com",
  instagramUrl: "https://www.instagram.com/osman.meyredi/",
  youtubeUrl: "https://www.youtube.com/@theOsmanMusic",
  tiktokUrl: "https://www.tiktok.com/@ozzymeyredi",
  linkedinUrl: "https://www.linkedin.com/in/osmanmeyredi/",
  facebookUrl: "https://www.facebook.com/ozzymeyredimusic",
  shopMode: "concept",
  shopUrl: null,
};

export const demoServices: ServiceRecord[] = [
  {
    id: "svc-concerts",
    slug: "concerts",
    serviceType: "CONCERTS",
    title: "Concerts & live performance",
    shortDescription:
      "Book Osman for private events, weddings, corporate evenings, intimate concerts, festivals and session work, solo or with hand-picked musicians.",
    body: [
      "Every room has its own sound. Osman's starting point for any booking is listening: to the space, to the occasion, and to the people in it. From there he shapes a performance that fits: a warm acoustic set at a wedding dinner, a full-energy band for a festival stage, or a quiet solo double bass in a candlelit room.",
      "As a multi-instrumentalist (bass guitar, double bass, keyboards, guitar, piano and vocals) he can scale the music to the moment rather than forcing the moment to fit the music. He performs regularly in the Netherlands and Italy and travels across Europe.",
      "Typical bookings include private events and parties, weddings, corporate events and receptions, intimate concerts, festivals, and live session support for other artists and bands.",
      "Tell Osman about the occasion, the room and the atmosphere you want, and he'll come back with a concrete proposal.",
    ].join("\n\n"),
    imageUrl: null,
    status: "PUBLISHED",
    sortOrder: 1,
    updatedAt: now,
  },
  {
    id: "svc-coaching",
    slug: "coaching",
    serviceType: "COACHING",
    title: "Band coaching",
    shortDescription:
      "Practical coaching for bands and musicians built around listening, space, groove and interaction: playing together, not just playing more notes.",
    body: [
      "Most bands don't have a technique problem. They have a listening problem. Osman's coaching starts from what a group actually sounds like together: who is leaving space, who is filling it, where the groove sits, and what the music is asking for that nobody is playing yet.",
      "Sessions are practical and hands-on. You play, you listen back, you adjust. Themes include listening to yourself and to the other musicians, space and dynamics, groove and time feel, interaction and musical conversation, and arrangement choices that serve the song.",
      "Osman studied music education, pedagogy, band coaching and arrangement at the Conservatory of Amsterdam, and brings twenty years of stage and studio experience across Europe. Coaching is available in English, Italian and Dutch.",
      "Coaching works for existing bands, ad-hoc ensembles, and individual musicians who want to become better bandmates.",
    ].join("\n\n"),
    imageUrl: null,
    status: "PUBLISHED",
    sortOrder: 2,
    updatedAt: now,
  },
  {
    id: "svc-workshops",
    slug: "workshops",
    serviceType: "WORKSHOPS",
    title: "Workshops: listening & collaboration",
    shortDescription:
      "Music-based workshops for organisations and teams. No musical experience required. Just ears, attention and each other.",
    body: [
      "When a band plays well, you can hear the trust. Musicians lead and follow, leave space, adjust in real time, and stay locked to a shared rhythm, all without a word. Osman's workshops use exactly these mechanics to work on how teams communicate.",
      "In a session of about three hours, groups experience listening and collaboration directly through music: shared rhythm and attention, leading and following, building on each other's ideas, and noticing what is not being said. No musical experience is required.",
      "Workshops suit newly formed teams, teams navigating a merger or reorganisation, and groups that simply want to reconnect. Sessions are delivered in English, Italian or Dutch, on location or in a studio setting.",
      "Every workshop is shaped around the group in the room. Tell Osman about your team and what you're working on, and he'll design the session around it.",
    ].join("\n\n"),
    imageUrl: null,
    status: "PUBLISHED",
    sortOrder: 3,
    updatedAt: now,
  },
];

export const demoVideos: LiveVideoRecord[] = [
  {
    // Round 3 Keynote: "Black & White video (yet to be uploaded)" — the most
    // recent video, to sit FIRST once the file exists. Kept as a DRAFT with
    // the exact approved copy so publishing is just adding the URL in the
    // Studio and flipping the status.
    id: "vid-cinetol-piano",
    slug: "live-piano-cinetol-amsterdam",
    title: "Live Piano – Cinetol, Amsterdam",
    description:
      "Filmed during a full concert, this video puts the spotlight on Osman's piano performance — plus a live guitar solo. Every instrument you hear was written, composed and played by Osman Meyredi himself.",
    platform: "youtube",
    videoUrl: "",
    thumbnailUrl: null,
    venue: "Cinetol, Amsterdam",
    performanceDate: null,
    year: null,
    tags: ["piano", "live"],
    status: "DRAFT",
    featured: false,
    sortOrder: 1,
    ...meta,
  },
  {
    id: "vid-showreel",
    slug: "live-showreel",
    title: "Live showreel – bass guitar, keyboards, double bass and guitar",
    // Round 2 slide 26 exact replacement copy. The Keynote types the town as
    // "Ponte Caffero"; the brief (§35) spells the real town Ponte Caffaro —
    // divergence flagged in the implementation report.
    description:
      "A cross-section of Osman Meyredi's live playing across four instruments, filmed in The Netherlands and Italy. The video also includes a performance in Ponte Caffaro in Italy, with Blue Lou Marini, saxophonist from the Blues Brothers Band and some exceptional keyboard solo work.",
    platform: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=3uWIoIGESxI",
    thumbnailUrl: null,
    venue: null,
    performanceDate: null,
    year: null,
    tags: ["showreel", "bass", "keys", "double bass", "guitar"],
    status: "PUBLISHED",
    featured: false,
    sortOrder: 4, // R3: the two latest videos lead the page
    ...meta,
  },
  {
    id: "vid-zappatika",
    slug: "ike-willis-zappatika-uk-tour-2019",
    title: "Ike Willis & Zappatika – 2019 U.K. tour",
    description:
      "On tour across the U.K. with Frank Zappa's longtime vocalist Ike Willis and Zappatika.",
    platform: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=t1Iq7DRuAW4",
    thumbnailUrl: null,
    venue: null,
    performanceDate: null,
    year: 2019,
    tags: ["tour", "keyboards", "zappa"],
    status: "PUBLISHED",
    featured: true,
    sortOrder: 3, // R3: the two latest videos lead the page
    ...meta,
  },
  {
    id: "vid-andrew-laureth",
    slug: "andrew-laureth-trio-teatro-munganga",
    title: "Andrew Laureth Trio – live at Teatro Munganga, Amsterdam",
    // Round 2 slide 27 exact copy (full-name treatment).
    description: "Osman Meyredi on double bass with the Andrew Laureth Trio.",
    platform: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=EJwDdGpFFGE",
    thumbnailUrl: null,
    venue: "Teatro Munganga, Amsterdam",
    performanceDate: null,
    year: 2020,
    tags: ["double bass", "trio", "amsterdam"],
    status: "PUBLISHED",
    featured: false,
    sortOrder: 5,
    ...meta,
  },
  {
    id: "vid-don-camaleon",
    slug: "don-camaleon-na-moral",
    title: "Don Camaleon – “Na Moral”",
    // Round 2 slide 27 "Add:" — verbatim, including the Keynote's
    // "DonCameleon" spelling (§36: do not change collaborator spellings;
    // divergence from the band's own "Don Camaleon" flagged in the report).
    description:
      "Osman Meyredi settling into bass guitar and backing vocals, playing with DonCameleon live at Belushi's in Amsterdam, The Netherlands.",
    platform: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=d-a_XoRKmMQ",
    thumbnailUrl: null,
    venue: null,
    performanceDate: null,
    year: null,
    tags: ["live"],
    status: "PUBLISHED",
    featured: false,
    sortOrder: 6,
    ...meta,
  },
  {
    id: "vid-turbo-trouble",
    slug: "turbo-trouble-trio-let-it-ride",
    title: "Turbo Trouble Trio – “Let It Ride” (Ryan Adams cover)",
    // Round 2 slide 28 — annotation positioned under this card.
    description: "Osman Meyredi on double bass",
    platform: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=SG1pQS-a9hs",
    thumbnailUrl: null,
    venue: null,
    performanceDate: null,
    year: null,
    tags: ["trio", "cover"],
    status: "PUBLISHED",
    featured: false,
    sortOrder: 7,
    ...meta,
  },
  {
    id: "vid-santo-stefano",
    slug: "santo-stefano-resort-teaser",
    title: "Santo Stefano Resort – live show teaser",
    // Round 2 slide 28 — the fuller residency wording of the two variants on
    // the slide (choice explained in the implementation report).
    description:
      "Osman Meyredi during a three-month residency at Santo Stefano Resort in Sardinia, where he played guitar, bass, keyboards, drums and vocals.",
    platform: "youtube",
    videoUrl: "https://www.youtube.com/watch?v=ygAcIs9I8GU",
    thumbnailUrl: null,
    venue: "Santo Stefano Resort",
    performanceDate: null,
    year: null,
    tags: ["live", "italy"],
    status: "PUBLISHED",
    featured: false,
    sortOrder: 8,
    ...meta,
  },
  {
    // Round 2 slide 29 / brief §39 — the approved Shows-folder video
    // (Aditya confirmed "Website Landscape.mp4", 10-09-2026), transcoded
    // from the 4K original for the web and self-hosted.
    id: "vid-website-landscape",
    slug: "live-highlights-landscape",
    title: "Live highlights – bass guitar, keyboards and vocals",
    // Round 3 Keynote exact sentence for the Highlights video.
    description:
      "The music you'll hear is written, composed, played and produced by Osman Meyredi, especially for this video.",
    platform: "file",
    videoUrl: "/videos/website-landscape.mp4",
    thumbnailUrl: "/images/videos/website-landscape-poster.jpg",
    venue: null,
    performanceDate: null,
    year: null,
    tags: ["live"],
    status: "PUBLISHED",
    featured: false,
    sortOrder: 2,
    ...meta,
  },
];

/**
 * Round 2 Keynote slides 3/5/21/23: the four vinyls with proper covers
 * (Website/04. Music/Collaboration/ + the pages doc's Spotify links), plus
 * Osman Meyredi's own release "Dance With This Mess". "Before the Shit Hit
 * the Fan" is kept in the Studio as a draft: it is not one of the four
 * enumerated vinyls and has no proper cover, and Round 2 bans generated
 * sleeves — restore it once real artwork exists.
 */
export const demoReleases: ReleaseRecord[] = [
  {
    id: "rel-dance-with-this-mess",
    slug: "dance-with-this-mess",
    title: "Dance With This Mess",
    releaseType: "SINGLE",
    relationshipType: "OWN_RELEASE",
    primaryArtistName: null,
    osmanCredit: null,
    labelName: null,
    catalogNumber: null,
    artworkCredit: "Osman Meyredi: official single artwork",
    rightsStatus: "VERIFIED",
    sourceUrl: "https://open.spotify.com/track/2Rri29xVddvQb7kYerkxwk",
    collaborationSlug: null,
    artworkUrl: "/images/releases/dance-with-this-mess.jpg",
    releaseDate: "2021-11-14",
    year: 2021,
    description: null,
    credits: null,
    spotifyUrl: "https://open.spotify.com/track/2Rri29xVddvQb7kYerkxwk",
    appleMusicUrl: null,
    youtubeUrl: null,
    bandcampUrl: null,
    otherUrl: null,
    status: "PUBLISHED",
    featured: false,
    sortOrder: 5,
    ...meta,
  },
  {
    id: "rel-highway-maintenance",
    slug: "highway-maintenance",
    title: "Highway Maintenance",
    releaseType: "COLLABORATION",
    relationshipType: "COLLABORATION_RELEASE",
    primaryArtistName: "Ike Willis & Zappatika",
    osmanCredit: "Osman Meyredi: engineer, keyboards, vocals",
    labelName: null,
    catalogNumber: null,
    artworkCredit: "Ike Willis & Zappatika: official release artwork",
    rightsStatus: "VERIFIED",
    sourceUrl: "https://zappatika.bandcamp.com/album/highway-maintenance",
    collaborationSlug: "zappatika",
    artworkUrl: "/images/releases/highway-maintenance.jpg",
    releaseDate: "2019-04-01",
    year: 2019,
    description:
      "Live album with Ike Willis & Zappatika, recorded on the 2018 U.K. tour.",
    credits: "Ike Willis & Zappatika · Osman Meyredi: engineer, keyboards, vocals",
    spotifyUrl: "https://open.spotify.com/album/1DknBWqPfPNWZVIkobFLmc",
    appleMusicUrl: null,
    youtubeUrl: null,
    bandcampUrl: "https://zappatika.bandcamp.com/album/highway-maintenance",
    otherUrl: null,
    status: "PUBLISHED",
    featured: true,
    sortOrder: 2,
    ...meta,
  },
  {
    id: "rel-keep-your-eye-on-the-sparrow-45",
    slug: "keep-your-eye-on-the-sparrow-special-45",
    title: "Keep Your Eye on the Sparrow (Special 45 Version)",
    releaseType: "SINGLE",
    relationshipType: "CONTRIBUTING_ARTIST",
    primaryArtistName: "Disco Sparks feat. Christine Wiltshire & The D.S. Orchestra",
    osmanCredit: "Osman Meyredi: bass",
    labelName: "Z Records",
    catalogNumber: "Zedd7007",
    artworkCredit: "Z Records: official Side B label",
    rightsStatus: "VERIFIED",
    sourceUrl: "https://open.spotify.com/track/58gBUO0yLgaHC0gcRGVi7t",
    collaborationSlug: null,
    artworkUrl: "/images/releases/keep-your-eye-on-the-sparrow-45.jpg",
    releaseDate: null,
    year: 2024,
    description: null,
    credits:
      "Disco Sparks feat. Christine Wiltshire & The D.S. Orchestra · Osman Meyredi: bass",
    spotifyUrl: "https://open.spotify.com/track/58gBUO0yLgaHC0gcRGVi7t",
    appleMusicUrl: null,
    youtubeUrl: null,
    bandcampUrl: null,
    otherUrl: null,
    status: "PUBLISHED",
    featured: false,
    sortOrder: 4,
    ...meta,
  },
  {
    id: "rel-falling-for-you",
    slug: "falling-for-you",
    title: "Falling for You",
    releaseType: "SINGLE",
    relationshipType: "COLLABORATION_RELEASE",
    primaryArtistName: "Kassko, Ozzy Meyredi, Stephanie Laurence",
    osmanCredit: "Osman Meyredi: keyboards, bass guitar and electric guitar",
    labelName: "Peppermint Jam",
    catalogNumber: "PJ314",
    artworkCredit: "Peppermint Jam: official white-label artwork",
    rightsStatus: "VERIFIED",
    sourceUrl: "https://open.spotify.com/track/2D7JeBqVQzZ5vTGSMzTDMb",
    collaborationSlug: "falling-for-you",
    artworkUrl: "/images/releases/falling-for-you.jpg",
    releaseDate: null,
    year: 2025,
    description: "Single from the album Good Things Take Time (2025).",
    credits:
      "Kassko: producer · Stephanie Laurence: vocals · Osman Meyredi: keyboards, bass guitar and electric guitar",
    spotifyUrl: "https://open.spotify.com/track/2D7JeBqVQzZ5vTGSMzTDMb",
    appleMusicUrl: null,
    youtubeUrl: null,
    bandcampUrl: null,
    otherUrl: null,
    status: "PUBLISHED",
    featured: false,
    sortOrder: 3,
    ...meta,
  },
  {
    id: "rel-before-the-shit",
    slug: "before-the-shit-hit-the-fan",
    title: "Before the Shit Hit the Fan — Live in the U.K.",
    releaseType: "COLLABORATION",
    relationshipType: "COLLABORATION_RELEASE",
    primaryArtistName: "Ike Willis & Zappatika",
    osmanCredit: "Osman Meyredi: keyboards",
    labelName: null,
    catalogNumber: null,
    artworkCredit: null,
    rightsStatus: "VERIFIED",
    sourceUrl:
      "https://www.herecomestheflood.com/2020/12/ike-willis-zappatika-before-shit-hit.html",
    collaborationSlug: "zappatika",
    artworkUrl: null,
    releaseDate: "2020-12-20",
    year: 2020,
    description:
      "Live album from Zappatika's October 2019 “Music Is The Best” U.K. tour with Ike Willis.",
    credits: "Ike Willis & Zappatika · Osman Meyredi: keyboards",
    spotifyUrl: null,
    appleMusicUrl: null,
    youtubeUrl: null,
    bandcampUrl:
      "https://zappatika.bandcamp.com/album/before-the-shit-hit-the-fan-live-in-the-u-k",
    otherUrl: null,
    // Round 2: not among the four vinyls with proper covers; generated
    // sleeves are banned, so it waits in the Studio until real artwork exists.
    status: "DRAFT",
    featured: false,
    sortOrder: 6,
    ...meta,
  },
];

export const demoMedia: MediaItemRecord[] = [
  {
    // Round 2 slide 25 "Add one more" — the newspaper interview supplied as
    // Website/06. Media/Newspaper Scan.jpeg (Corriere del Trentino, 5 March
    // 2017, "Astri nascenti" column by Veronica Pederzolli). The scan itself
    // is the linked article.
    id: "med-corriere-trentino",
    slug: "corriere-del-trentino-da-tione-fino-ad-amsterdam",
    publication: "Corriere del Trentino",
    headline: "Da Tione fino ad Amsterdam — «Suono e seguo il mio istinto»",
    mediaType: "INTERVIEW",
    date: "2017-03-05",
    articleUrl: "/images/media/corriere-del-trentino-2017.jpg",
    imageUrl: "/images/media/corriere-del-trentino-2017.jpg",
    summary:
      "The Trentino daily profiles Osman Meyredi, keyboardist of ZAPPATiKA, on following his instinct from Tione to Amsterdam.",
    status: "PUBLISHED",
    featured: false,
    ...meta,
  },
  {
    id: "med-hctf",
    slug: "here-comes-the-flood-zappatika",
    publication: "Here Comes The Flood",
    headline:
      "Ike Willis & Zappatika: Before The Shit Hit The Fan — Live in the U.K.",
    mediaType: "REVIEW",
    date: "2020-12-20",
    articleUrl:
      "https://www.herecomestheflood.com/2020/12/ike-willis-zappatika-before-shit-hit.html",
    imageUrl: null,
    summary:
      "The Dutch music blog covers Zappatika's free live album from the 2019 U.K. tour with Ike Willis, with Osman Meyredi on keyboards.",
    status: "PUBLISHED",
    featured: true,
    ...meta,
  },
];

/**
 * Practical Q&A (SEO/AI foundation brief §30). Every answer is composed
 * strictly from copy already approved and live on the site — the About
 * page, the Concerts & Live Performances and Live Piano final documents,
 * the approved instrument list and the contact page. No new facts, no
 * assumptions (§30: "only publish approved answers"); flagged for
 * Jolene/Osman review in the implementation report. `aiApproved` marks
 * items the future "Ask About Osman" assistant may draw on (§4).
 */
export const demoFaqs: FaqRecord[] = [
  {
    id: "faq-instruments",
    slug: "what-instruments-does-osman-meyredi-play",
    question: "What instruments does Osman Meyredi play?",
    // Sources: approved instrument list (Keynote slides 2/23) + Concerts
    // final copy ("singing, piano, synths, bass, guitar, double bass,
    // percussion" / "he moves between instruments himself").
    answer:
      "Double bass, bass guitar, piano, keyboard, synthesiser, guitar, drums and percussion, and he sings. On stage he moves between instruments himself, layering them live rather than sticking to one.",
    linkUrl: "/about",
    linkLabel: "More about Osman Meyredi",
    aiApproved: true,
    status: "PUBLISHED",
    sortOrder: 1,
    ...meta,
  },
  {
    id: "faq-corporate-events",
    slug: "is-osman-available-for-corporate-events",
    question: "Is Osman Meyredi available for corporate events?",
    // Sources: Live Piano final copy (occasion list) + Concerts service
    // card ("festival, venue, corporate event or special occasion").
    answer:
      "Yes. He performs live piano for company celebrations, brand launches, conferences, (wedding) receptions and other private and corporate occasions, and full live shows for festivals, venues, corporate events and special occasions.",
    linkUrl: "/services/piano-for-events",
    linkLabel: "Live Piano",
    aiApproved: true,
    status: "PUBLISHED",
    sortOrder: 2,
    ...meta,
  },
  {
    id: "faq-singer",
    slug: "can-a-singer-be-added",
    question: "Can a singer be added?",
    // Source: Live Piano final copy, verbatim.
    answer:
      "Yes. Want something with a bit more presence? A vocalist, male or female, can be added on request.",
    linkUrl: "/services/piano-for-events",
    linkLabel: "Live Piano",
    aiApproved: true,
    status: "PUBLISHED",
    sortOrder: 3,
    ...meta,
  },
  {
    id: "faq-international",
    slug: "does-osman-meyredi-perform-internationally",
    question: "Does Osman Meyredi perform internationally?",
    // Source: About final copy (Languages & availability), verbatim facts.
    answer:
      "Yes. He is based in Amsterdam, performs regularly in the Netherlands and Italy, and travels for concerts, events and productions across Europe and beyond. He works in English, Italian and Dutch.",
    linkUrl: "/about",
    linkLabel: "Languages & availability",
    aiApproved: true,
    status: "PUBLISHED",
    sortOrder: 4,
    ...meta,
  },
  {
    id: "faq-covers-originals",
    slug: "does-he-play-covers-and-original-music",
    question: "Does he play covers and original music?",
    // Sources: Live Piano final copy (repertoire sentence) + Concerts final
    // copy ("his own studio productions come to life").
    answer:
      "Both. At the piano his repertoire blends his own compositions with carefully chosen covers, drifting between light classical, jazz, pop and film music. His full live shows are built around his own studio productions.",
    linkUrl: "/music",
    linkLabel: "His music",
    aiApproved: true,
    status: "PUBLISHED",
    sortOrder: 5,
    ...meta,
  },
  {
    id: "faq-event-types",
    slug: "what-type-of-events-can-he-perform-at",
    question: "What type of events can he perform at?",
    // Sources: Concerts final copy ("festival, theatre, club night,
    // headline slot") + Live Piano final copy (occasion list).
    answer:
      "Full live shows scale from festivals, theatres and club nights to headline slots. Live piano suits company celebrations, brand launches, conferences, (wedding) receptions and other private and corporate occasions.",
    linkUrl: "/services",
    linkLabel: "The four ways to work with Osman",
    aiApproved: true,
    status: "PUBLISHED",
    sortOrder: 6,
    ...meta,
  },
  {
    id: "faq-booking",
    slug: "how-do-i-book-osman-meyredi",
    question: "How do I book Osman Meyredi?",
    // Sources: contact page (direct addresses + form) + home contact band
    // ("Tell him about the occasion, the room and the people in it…").
    answer:
      "Email bookings@osmanmeyredi.com directly, or use the contact form and your message lands with the right person. Tell him about the occasion, the room and the people in it. He'll come back with a concrete proposal.",
    linkUrl: "/contact",
    linkLabel: "Contact & booking",
    aiApproved: true,
    status: "PUBLISHED",
    sortOrder: 7,
    ...meta,
  },
  {
    id: "faq-technical-setup",
    slug: "what-technical-setup-is-required",
    question: "What technical setup is required?",
    // Source: Live Piano final copy (grand piano / grand-piano-style shell),
    // verbatim. The full-show rider is not documented in approved content,
    // so that half only routes to Contact rather than inventing specifics.
    answer:
      "For live piano: if the venue has its own grand piano, that's always Osman's first choice. If not, he brings his own electronic piano, built discreetly into a grand-piano-style shell. For full live shows the setup depends on the format. Share the details of your event via the contact page.",
    linkUrl: "/contact",
    linkLabel: "Contact & booking",
    aiApproved: true,
    status: "PUBLISHED",
    sortOrder: 8,
    ...meta,
  },
];


/**
 * FICTIONAL demo library tracks — interface fixtures only, prefixed [DEMO]
 * like the demo events. Osman's real jingles are added via the Studio
 * (Music library) once uploaded; production seeds no tracks, so the public
 * library page shows its honest "being stocked" state until then. The two
 * synth previews exist purely to exercise the player.
 */
export const demoLibraryTracks: LibraryTrackRecord[] = [
  {
    id: "trk-demo-1",
    slug: "demo-midnight-motorway",
    title: "[DEMO] Midnight Motorway",
    genre: "Cinematic",
    moods: ["Driving", "Nocturnal", "Tense"],
    useCases: ["Film", "Series", "Trailer"],
    durationSec: 128,
    audioUrl: "/audio/demo-preview.mp3",
    description: "Demo fixture so the player can be tested. Not a real track.",
    status: "PUBLISHED",
    featured: true,
    sortOrder: 1,
    ...meta,
  },
  {
    id: "trk-demo-2",
    slug: "demo-brass-tacks",
    title: "[DEMO] Brass Tacks",
    genre: "Funk",
    moods: ["Upbeat", "Confident"],
    useCases: ["Advert", "YouTube", "Event opening"],
    durationSec: 96,
    audioUrl: "/audio/demo-preview.mp3",
    description: "Demo fixture so the player can be tested. Not a real track.",
    status: "PUBLISHED",
    featured: false,
    sortOrder: 2,
    ...meta,
  },
  {
    id: "trk-demo-3",
    slug: "demo-glass-harbour",
    title: "[DEMO] Glass Harbour",
    genre: "Electronic",
    moods: ["Weightless", "Optimistic"],
    useCases: ["Documentary", "Tech", "Online"],
    durationSec: 154,
    audioUrl: null,
    description: "Demo fixture. Preview audio still to be uploaded.",
    status: "PUBLISHED",
    featured: false,
    sortOrder: 3,
    ...meta,
  },
  {
    id: "trk-demo-4",
    slug: "demo-quiet-hours",
    title: "[DEMO] Quiet Hours",
    genre: "Solo piano",
    moods: ["Intimate", "Reflective"],
    useCases: ["Wedding", "Reception", "Film"],
    durationSec: 112,
    audioUrl: null,
    description: "Demo fixture. Preview audio still to be uploaded.",
    status: "PUBLISHED",
    featured: false,
    sortOrder: 4,
    ...meta,
  },
  {
    id: "trk-demo-5",
    slug: "demo-low-light-district",
    title: "[DEMO] Low Light District",
    genre: "Jazz",
    moods: ["Smoky", "Late-night"],
    useCases: ["Series", "Bar scene", "Radio"],
    durationSec: 141,
    audioUrl: null,
    description: "Demo fixture. Preview audio still to be uploaded.",
    status: "PUBLISHED",
    featured: false,
    sortOrder: 5,
    ...meta,
  },
  {
    id: "trk-demo-6",
    slug: "demo-cast-iron",
    title: "[DEMO] Cast Iron",
    genre: "Rock",
    moods: ["Gritty", "Rhythmic"],
    useCases: ["Advert", "Sport", "TV"],
    durationSec: 87,
    audioUrl: null,
    description: "Demo fixture. Preview audio still to be uploaded.",
    status: "PUBLISHED",
    featured: false,
    sortOrder: 6,
    ...meta,
  },
];


/**
 * Collaborations & band projects. ZAPPATiKA uses only facts verified from
 * Here Comes The Flood (2016 line-up; 2020 live-album line-up) and JamBase
 * (Ike Willis obituary). The Friends poster anecdote is retained ONLY as an
 * internal research note with culturalNoteStatus PENDING — it must never
 * render publicly until directly verified (pack 02 §7–§10).
 */
export const demoCollaborations: CollaborationRecord[] = [
  {
    id: "collab-zappatika",
    slug: "zappatika",
    name: "ZAPPATiKA",
    role: "Keyboards & vocals",
    startYear: 2016,
    endYear: null,
    ongoing: false,
    shortDescription:
      "Amsterdam-based Frank Zappa project. Osman joined as keyboardist and vocalist in 2016 and toured the U.K. with Frank Zappa's longtime vocalist Ike Willis, including the October 2019 “Music Is The Best” tour captured on the live album Before the Shit Hit the Fan.",
    longDescription:
      "ZAPPATiKA performs the music of Frank Zappa with a rotating international line-up. Osman Meyredi joined on keyboards and vocals in 2016. In October 2019 the band toured the United Kingdom with Ike Willis (Zappa's longtime guitarist and vocalist, the voice of Joe's Garage), a collaboration documented on the live album Before the Shit Hit the Fan — Live in the U.K. (2020), billed to Ike Willis & Zappatika, with Osman on keyboards.",
    // Round 2 slide 22: the band image from Website/09. Images Osman —
    // "Osman Zappatika Band_UK.jpg" (identified by the Finder screenshot on
    // the slide). Band photography stays in its collaboration context.
    heroImageUrl: "/images/collaborations/zappatika-band-uk.jpg",
    heroImageAlt: "ZAPPATiKA band members standing in a field on the U.K. tour, black and white",
    heroImageCredit: "ZAPPATiKA archive",
    heroImageRights: "VERIFIED",
    collaborators:
      "Ike Willis · Mark Mcinnes · Emile de Jonge · Joep Oosterbaan · Sander van Elferen",
    externalUrl: "https://zappatika.bandcamp.com/",
    memorialTitle: "Dedicated to the memory of",
    memorialName: "Ike Willis",
    // Round 2 slide 24: full approved dates.
    memorialYears: "12 November 1955 – 16 May 2026",
    memorialText: null,
    showMemorial: true,
    publicCulturalNote: null,
    culturalNoteStatus: "PENDING",
    internalNotes:
      "UNVERIFIED (do not publish): claim that a ZAPPATiKA poster appears for several seconds in Friends season 2. Timeline conflict — Friends S2 aired 1995–96; ZAPPATiKA formed later. Needs exact season/episode/timestamp/frame evidence before culturalNoteStatus may become VERIFIED.",
    status: "PUBLISHED",
    sortOrder: 2, // R3: newest first (Kassko above the Zappa era)
    ...meta,
  },
  {
    // Round 2 slide 23 / brief §29 — exact client-supplied metadata only.
    id: "collab-falling-for-you",
    slug: "falling-for-you",
    name: "Falling for You",
    role: "Keyboards, bass guitar & electric guitar",
    startYear: 2025,
    endYear: 2025,
    ongoing: false,
    shortDescription:
      "Single from Kassko's album Good Things Take Time (2025). Kassko: producer. Stephanie Laurence: vocals. Osman Meyredi: keyboards, bass guitar and electric guitar.",
    longDescription: null,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    heroImageRights: "PENDING",
    collaborators: "Kassko (producer) · Stephanie Laurence (vocals)",
    externalUrl: "https://open.spotify.com/track/2D7JeBqVQzZ5vTGSMzTDMb",
    memorialTitle: null,
    memorialName: null,
    memorialYears: null,
    memorialText: null,
    showMemorial: false,
    publicCulturalNote: null,
    culturalNoteStatus: "PENDING",
    internalNotes: null,
    status: "PUBLISHED",
    sortOrder: 1, // R3: newest first
    ...meta,
  },
];

/**
 * REAL events supplied in the Keynote of 02-09-2026 (slide 17). These are
 * production content: they are seeded in every mode and never carry the
 * [DEMO] prefix. The Wine Festival date has since passed and therefore shows
 * in the "Past shows" archive — kept deliberately as content evidence.
 */
export const realEvents: EventRecord[] = [
  {
    // Round 3 Keynote (Shows / Upcoming Gigs slide): "pLease add the dates:
    // 11/08/2026 Streetfestival Bagolino, Italy" — past date, shown struck
    // on the agenda like the other played gigs.
    id: "evt-streetfestival-bagolino-2026-08-11",
    slug: "streetfestival-bagolino-2026-08-11",
    eventType: "FREE_GIG",
    title: "Streetfestival",
    description: "",
    date: "2026-08-11",
    startTime: "",
    endTime: null,
    venue: "Bagolino",
    address: null,
    city: "Italy",
    country: "Italy",
    imageUrl: null,
    imageAlt: null,
    imageCredit: null,
    ticketUrl: null,
    venueUrl: null,
    priceText: null,
    collaborators: null,
    ticketingType: null,

    ctaLabel: null,

    timezone: "Europe/Rome",

    isDemo: false,

    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    // Round 3 Keynote: "Streetfestival 25/07/2026 Bagolino, Italy".
    id: "evt-streetfestival-bagolino-2026-07-25",
    slug: "streetfestival-bagolino-2026-07-25",
    eventType: "FREE_GIG",
    title: "Streetfestival",
    description: "",
    date: "2026-07-25",
    startTime: "",
    endTime: null,
    venue: "Bagolino",
    address: null,
    city: "Italy",
    country: "Italy",
    imageUrl: null,
    imageAlt: null,
    imageCredit: null,
    ticketUrl: null,
    venueUrl: null,
    priceText: null,
    collaborators: null,
    ticketingType: null,

    ctaLabel: null,

    timezone: "Europe/Rome",

    isDemo: false,

    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-wine-festival-2026",
    slug: "amsterdam-wine-festival-2026",
    eventType: "FREE_GIG",
    // Round 2 slide 20 exact details — kept on the wall as a past event.
    title: "Amsterdam Wine Festival",
    description:
      "A free-entry set at the Amsterdam Wine Festival in Amstelpark. For festival tickets and more info, see the festival site.",
    date: "2026-09-06",
    startTime: "18:00",
    endTime: "19:00",
    venue: "Main Stage, Amstelpark",
    address: null,
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: null,
    imageAlt: null,
    imageCredit: null,
    ticketUrl: null,
    venueUrl: "https://www.amsterdamwinefestival.nl/",
    priceText: null,
    collaborators: null,
    ticketingType: null,

    ctaLabel: null,

    timezone: "Europe/Amsterdam",

    isDemo: false,

    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-bierfabriek-2026-09-10",
    slug: "bierfabriek-amsterdam-2026-09-10",
    eventType: "FREE_GIG",
    title: "Osman Meyredi – live at Bierfabriek",
    description:
      "A free-entry night at Bierfabriek Amsterdam. For reservations, please check with the venue.",
    date: "2026-09-10",
    startTime: "20:30",
    endTime: "22:30",
    venue: "Bierfabriek",
    address: null,
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: null,
    imageAlt: null,
    imageCredit: null,
    ticketUrl: null,
    venueUrl: "https://www.bierfabriek.com/amsterdam/",
    priceText: null,
    collaborators: null,
    ticketingType: null,

    ctaLabel: null,

    timezone: "Europe/Amsterdam",

    isDemo: false,

    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: true,
    publishedAt: now,
    ...meta,
  },
];


/**
 * Agenda demo records — pack 01 §9, verbatim dates/titles/cities. Placeholder
 * fixtures only (isDemo: true, abstract placeholder imagery): shown on
 * dev/preview, replaced or removed via the Studio before public launch.
 */
export const agendaDemoEvents: EventRecord[] = [
  {
    id: "evt-agenda-demo-1",
    slug: "demo-night-session",
    eventType: "TICKETED_CONCERT",
    title: "Demo: Night Session",
    description:
      "Demo fixture from the agenda brief so the composition can be evaluated. Not a real event.",
    date: "2026-10-18",
    startTime: "20:30",
    endTime: null,
    venue: "Night Session",
    address: null,
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: "/images/agenda/demo-1.jpg",
    imageAlt: "Abstract stage-light placeholder for Demo: Night Session",
    imageCredit: "Demo placeholder image. Replace in the Studio",
    ticketUrl: "https://example.com/tickets/night-session",
    venueUrl: null,
    priceText: null,
    collaborators: null,
    ticketingType: "TICKETED",
    ctaLabel: null,
    timezone: "Europe/Amsterdam",
    isDemo: true,
    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-agenda-demo-2",
    slug: "demo-live-at-noord",
    eventType: "FREE_GIG",
    title: "Demo: Live at Noord",
    description:
      "Demo fixture from the agenda brief so the composition can be evaluated. Not a real event.",
    date: "2026-11-07",
    startTime: "21:00",
    endTime: null,
    venue: "Live at Noord",
    address: null,
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: "/images/agenda/demo-2.jpg",
    imageAlt: "Abstract stage-light placeholder for Demo: Live at Noord",
    imageCredit: "Demo placeholder image. Replace in the Studio",
    ticketUrl: null,
    venueUrl: "https://example.com/venue/noord",
    priceText: null,
    collaborators: null,
    ticketingType: "FREE",
    ctaLabel: null,
    timezone: "Europe/Amsterdam",
    isDemo: true,
    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-agenda-demo-3",
    slug: "demo-music-room",
    eventType: "TICKETED_CONCERT",
    title: "Demo: Music Room",
    description:
      "Demo fixture from the agenda brief so the composition can be evaluated. Not a real event.",
    date: "2026-11-28",
    startTime: "20:00",
    endTime: null,
    venue: "Music Room",
    address: null,
    city: "Utrecht",
    country: "Netherlands",
    imageUrl: "/images/agenda/demo-3.jpg",
    imageAlt: "Abstract stage-light placeholder for Demo: Music Room",
    imageCredit: "Demo placeholder image. Replace in the Studio",
    ticketUrl: "https://example.com/tickets/music-room",
    venueUrl: null,
    priceText: null,
    collaborators: null,
    ticketingType: "TICKETED",
    ctaLabel: null,
    timezone: "Europe/Amsterdam",
    isDemo: true,
    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-agenda-demo-4",
    slug: "demo-winter-sessions",
    eventType: "FESTIVAL",
    title: "Demo: Winter Sessions",
    description:
      "Demo fixture from the agenda brief so the composition can be evaluated. Not a real event.",
    date: "2026-12-19",
    startTime: "19:30",
    endTime: null,
    venue: "Winter Sessions",
    address: null,
    city: "Rotterdam",
    country: "Netherlands",
    imageUrl: "/images/agenda/demo-4.jpg",
    imageAlt: "Abstract stage-light placeholder for Demo: Winter Sessions",
    imageCredit: "Demo placeholder image. Replace in the Studio",
    ticketUrl: null,
    venueUrl: "https://example.com/festival/winter-sessions",
    priceText: null,
    collaborators: null,
    ticketingType: "INFO_ONLY",
    ctaLabel: null,
    timezone: "Europe/Amsterdam",
    isDemo: true,
    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-agenda-demo-5",
    slug: "demo-studio-live",
    eventType: "OTHER",
    title: "Demo: Studio Live",
    description:
      "Demo fixture from the agenda brief so the composition can be evaluated. Not a real event.",
    date: "2027-01-23",
    startTime: "20:30",
    endTime: null,
    venue: "Studio Live",
    address: null,
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: "/images/agenda/demo-5.jpg",
    imageAlt: "Abstract stage-light placeholder for Demo: Studio Live",
    imageCredit: "Demo placeholder image. Replace in the Studio",
    ticketUrl: null,
    venueUrl: null,
    priceText: null,
    collaborators: null,
    ticketingType: "NONE",
    ctaLabel: null,
    timezone: "Europe/Amsterdam",
    isDemo: true,
    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-agenda-demo-6",
    slug: "demo-spring-stage",
    eventType: "FREE_GIG",
    title: "Demo: Spring Stage",
    description:
      "Demo fixture from the agenda brief so the composition can be evaluated. Not a real event.",
    date: "2027-03-20",
    startTime: "20:00",
    endTime: null,
    venue: "Spring Stage",
    address: null,
    city: "Haarlem",
    country: "Netherlands",
    imageUrl: "/images/agenda/demo-6.jpg",
    imageAlt: "Abstract stage-light placeholder for Demo: Spring Stage",
    imageCredit: "Demo placeholder image. Replace in the Studio",
    ticketUrl: null,
    venueUrl: "https://example.com/venue/spring-stage",
    priceText: null,
    collaborators: null,
    ticketingType: "FREE",
    ctaLabel: null,
    timezone: "Europe/Amsterdam",
    isDemo: true,
    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-agenda-demo-7",
    slug: "demo-late-summer-set",
    eventType: "FREE_GIG",
    title: "Demo: Late Summer Set",
    description:
      "Demo fixture from the agenda brief so the composition can be evaluated. Not a real event.",
    date: "2026-08-22",
    startTime: "20:30",
    endTime: null,
    venue: "Late Summer Set",
    address: null,
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: "/images/agenda/demo-7.jpg",
    imageAlt: "Abstract stage-light placeholder for Demo: Late Summer Set",
    imageCredit: "Demo placeholder image. Replace in the Studio",
    ticketUrl: null,
    venueUrl: null,
    priceText: null,
    collaborators: null,
    ticketingType: "FREE",
    ctaLabel: null,
    timezone: "Europe/Amsterdam",
    isDemo: true,
    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-agenda-demo-8",
    slug: "demo-riverside-session",
    eventType: "TICKETED_CONCERT",
    title: "Demo: Riverside Session",
    description:
      "Demo fixture from the agenda brief so the composition can be evaluated. Not a real event.",
    date: "2026-07-15",
    startTime: "20:00",
    endTime: null,
    venue: "Riverside Session",
    address: null,
    city: "Utrecht",
    country: "Netherlands",
    imageUrl: "/images/agenda/demo-8.jpg",
    imageAlt: "Abstract stage-light placeholder for Demo: Riverside Session",
    imageCredit: "Demo placeholder image. Replace in the Studio",
    ticketUrl: null,
    venueUrl: null,
    priceText: null,
    collaborators: null,
    ticketingType: "TICKETED",
    ctaLabel: null,
    timezone: "Europe/Amsterdam",
    isDemo: true,
    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-agenda-demo-9",
    slug: "demo-solstice-gig",
    eventType: "FREE_GIG",
    title: "Demo: Solstice Gig",
    description:
      "Demo fixture from the agenda brief so the composition can be evaluated. Not a real event.",
    date: "2026-06-21",
    startTime: "19:00",
    endTime: "21:30",
    venue: "Solstice Gig",
    address: null,
    city: "Rotterdam",
    country: "Netherlands",
    imageUrl: "/images/agenda/demo-9.jpg",
    imageAlt: "Abstract stage-light placeholder for Demo: Solstice Gig",
    imageCredit: "Demo placeholder image. Replace in the Studio",
    ticketUrl: null,
    venueUrl: null,
    priceText: null,
    collaborators: null,
    ticketingType: "FREE",
    ctaLabel: null,
    timezone: "Europe/Amsterdam",
    isDemo: true,
    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
];

/**
 * FICTIONAL demo events — interface fixtures only. Delete via the Studio (or reset
 * demo data) before launch. Every title is prefixed [DEMO].
 */
export const demoEvents: EventRecord[] = [
  {
    id: "evt-demo-concert-1",
    slug: "demo-paradiso-noord",
    eventType: "TICKETED_CONCERT",
    title: "[DEMO] Osman Meyredi Group – album night",
    description:
      "Demo fixture: a ticketed concert example so the interface can be tested. Not a real event.",
    date: "2026-10-16",
    startTime: "20:30",
    endTime: null,
    venue: "Tolhuistuin",
    address: "IJpromenade 2",
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: null,
    imageAlt: null,
    imageCredit: null,
    ticketUrl: "https://example.com/tickets/demo",
    venueUrl: null,
    priceText: "€ 18,50",
    collaborators: null,
    ticketingType: null,

    ctaLabel: null,

    timezone: "Europe/Amsterdam",

    isDemo: true,

    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: true,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-demo-concert-2",
    slug: "demo-trento-jazz",
    eventType: "TICKETED_CONCERT",
    title: "[DEMO] Trio notte – Trento jazz evening",
    description:
      "Demo fixture: a second ticketed concert example (sold out state). Not a real event.",
    date: "2026-11-07",
    startTime: "21:00",
    endTime: null,
    venue: "Teatro Sanbàpolis",
    address: null,
    city: "Trento",
    country: "Italy",
    imageUrl: null,
    imageAlt: null,
    imageCredit: null,
    ticketUrl: "https://example.com/tickets/demo-2",
    venueUrl: null,
    priceText: "€ 15,00",
    collaborators: null,
    ticketingType: null,

    ctaLabel: null,

    timezone: "Europe/Amsterdam",

    isDemo: true,

    status: "PUBLISHED",
    eventState: "SOLD_OUT",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-demo-gig-1",
    slug: "demo-cafe-de-ruimte",
    eventType: "FREE_GIG",
    title: "[DEMO] Solo bass & keys evening",
    description:
      "Demo fixture: a free gig example so the free-entry presentation can be tested. Not a real event.",
    date: "2026-09-12",
    startTime: "20:00",
    endTime: "22:30",
    venue: "Café de Ruimte",
    address: "Distelweg 83",
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: null,
    imageAlt: null,
    imageCredit: null,
    ticketUrl: null,
    venueUrl: "https://example.com/venue/demo",
    priceText: null,
    collaborators: null,
    ticketingType: null,

    ctaLabel: null,

    timezone: "Europe/Amsterdam",

    isDemo: true,

    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-demo-gig-2",
    slug: "demo-past-gig",
    eventType: "FREE_GIG",
    title: "[DEMO] Past gig (archive example)",
    description:
      "Demo fixture: a past free gig so archive/auto-hide behaviour can be tested. Not a real event.",
    date: "2026-06-20",
    startTime: "19:30",
    endTime: null,
    venue: "Bar Bukowski",
    address: null,
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: null,
    imageAlt: null,
    imageCredit: null,
    ticketUrl: null,
    venueUrl: null,
    priceText: null,
    collaborators: null,
    ticketingType: null,

    ctaLabel: null,

    timezone: "Europe/Amsterdam",

    isDemo: true,

    status: "PUBLISHED",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: now,
    ...meta,
  },
  {
    id: "evt-demo-draft",
    slug: "demo-draft-concert",
    eventType: "TICKETED_CONCERT",
    title: "[DEMO] Draft concert (unpublished)",
    description:
      "Demo fixture: a draft so the Studio's draft workflow can be tested. Not visible on the public site.",
    date: "2026-12-05",
    startTime: "20:00",
    endTime: null,
    venue: "TBC",
    address: null,
    city: "Utrecht",
    country: "Netherlands",
    imageUrl: null,
    imageAlt: null,
    imageCredit: null,
    ticketUrl: null,
    venueUrl: null,
    priceText: null,
    collaborators: null,
    ticketingType: null,

    ctaLabel: null,

    timezone: "Europe/Amsterdam",

    isDemo: true,

    status: "DRAFT",
    eventState: "SCHEDULED",
    featured: false,
    publishedAt: null,
    ...meta,
  },
];

/** Shop concepts — explicitly labelled concepts, not purchasable products. */
export const demoProducts: ProductRecord[] = [
  {
    id: "prod-listening-notebook",
    slug: "listening-notebook",
    title: "The Listening Notebook",
    description:
      "A structured notebook for musicians and listeners: pages for transcription, rehearsal notes, and a 'what did I hear?' practice log. Concept, not yet in production.",
    imageUrl: null,
    category: "Printed matter",
    priceText: null,
    status: "CONCEPT",
    externalCommerceId: null,
    externalUrl: null,
    featured: true,
    sortOrder: 1,
    ...meta,
  },
  {
    id: "prod-groove-cards",
    slug: "groove-cards",
    title: "Groove Cards",
    description:
      "A deck of rhythm and interaction prompts for band rehearsals and workshops: one constraint per card. Concept, not yet in production.",
    imageUrl: null,
    category: "Studio objects",
    priceText: null,
    status: "CONCEPT",
    externalCommerceId: null,
    externalUrl: null,
    featured: true,
    sortOrder: 2,
    ...meta,
  },
  {
    id: "prod-score-print",
    slug: "score-prints",
    title: "Score prints",
    description:
      "Limited-edition prints of hand-arranged scores and transcriptions, printed on heavy archival paper. Concept, not yet in production.",
    imageUrl: null,
    category: "Editions",
    priceText: null,
    status: "CONCEPT",
    externalCommerceId: null,
    externalUrl: null,
    featured: false,
    sortOrder: 3,
    ...meta,
  },
];
