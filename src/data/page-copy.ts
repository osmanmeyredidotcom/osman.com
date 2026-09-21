/**
 * Page copy registry — content-governance pass (20-09-2026).
 *
 * One place that declares every Studio-editable copy field on the public
 * pages: its key, its plain-language label for the Studio form, and its
 * DEFAULT value, which is the client-approved wording exactly as it stood
 * when this registry was created. Pages render `stored value ?? default`
 * (brief §52: fallbacks never overwrite published content — they only fill
 * gaps), so an empty Studio field simply means "the approved default".
 *
 * Long fields ("long") support blank-line paragraph breaks and safe inline
 * links written as [text](/internal-path) or [text](https://…) — rendered
 * by <CopyText>, never as raw HTML (brief §27).
 *
 * Storage is the existing key-value store (SiteSetting rows prefixed
 * "copy:<page>.<key>" in Postgres; the same map in the demo snapshot), so
 * no schema migration is needed and re-deploys never touch edits (§54).
 */

export type CopyKind = "short" | "long" | "url" | "image";

export interface CopyField {
  key: string;
  label: string;
  kind: CopyKind;
  help?: string;
  /** The approved wording this field falls back to when unset. */
  default: string;
}

export interface CopyPageDef {
  id: string;
  title: string;
  blurb: string;
  fields: CopyField[];
}

export const COPY_PAGES: CopyPageDef[] = [
  {
    id: "home",
    title: "Home",
    blurb: "The landing page: roles row, About block, shop line and the closing button.",
    fields: [
      {
        key: "roles",
        label: "Roles row (under the logo)",
        kind: "short",
        help: "Separate roles with · (middle dots), as now.",
        default: "Artist · Multi-instrumentalist · Producer · Music director",
      },
      {
        key: "hero.image",
        label: "Hero image (site path or full URL)",
        kind: "image",
        default: "/images/home-hero-landscape.jpg",
      },
      {
        key: "hero.imageAlt",
        label: "Hero image description (for screen readers)",
        kind: "short",
        default: "Osman Meyredi singing at the keys under stage light, black headband, dark stage",
      },
      {
        key: "about.sentence",
        label: "About block, identity sentence",
        kind: "long",
        default:
          "Osman Meyredi is an Italian-born artist, multi-instrumentalist, songwriter, composer, singer and producer, based in The Netherlands.",
      },
      {
        key: "about.travel",
        label: "About block, second line",
        kind: "long",
        default:
          "He performs regularly in the Netherlands and Italy, and travels for concerts, events and productions across Europe and beyond.",
      },
      {
        key: "about.image",
        label: "About block image (site path or full URL)",
        kind: "image",
        default: "/images/about/about-double-bass-portrait.jpg",
      },
      {
        key: "about.imageAlt",
        label: "About block image description",
        kind: "short",
        default: "Osman Meyredi bowing the double bass, black and white",
      },
      {
        key: "shop.teaser",
        label: "Shop line (while the shop is coming soon)",
        kind: "long",
        default: "A small shop is taking shape. A mix of music and things Osman loves. Coming soon.",
      },
      {
        key: "shop.linkLabel",
        label: "Shop link text",
        kind: "short",
        default: "Visit the shop",
      },
      {
        key: "cta.label",
        label: "Closing button text",
        kind: "short",
        default: "Book Osman Live",
      },
      {
        key: "cta.href",
        label: "Closing button link",
        kind: "url",
        default: "/contact",
      },
      {
        key: "seo.title",
        label: "SEO: browser/Google title",
        kind: "short",
        default: "Osman Meyredi | Italian-Born Multi-Instrumentalist, Composer & Producer",
      },
      {
        key: "seo.description",
        label: "SEO: meta description",
        kind: "long",
        default:
          "Osman Meyredi is an Italian-born multi-instrumentalist, composer and producer based in Amsterdam. Live shows, piano for events, music production and original tracks across the Netherlands, Italy and Europe.",
      },
    ],
  },
  {
    id: "about",
    title: "About",
    blurb: "Every heading, paragraph and photo on the About page.",
    fields: [
      {
        key: "title",
        label: "Page title",
        kind: "long",
        default: "Osman Meyredi treats every instrument as a different way of listening.",
      },
      {
        key: "intro",
        label: "Intro paragraph",
        kind: "long",
        default:
          "Osman Meyredi is an Italian-born artist, multi-instrumentalist, songwriter, composer, singer, music director and producer, based in the Netherlands. He moves between instruments and genres with ease, combining different influences into songs that feel personal, honest, and never quite predictable. What makes his work distinctive is that he can take different styles, instruments, and influences, and make them sound like they belong together.",
      },
      {
        key: "image1",
        label: "First photo (portrait)",
        kind: "image",
        default: "/images/about/about-double-bass-portrait.jpg",
      },
      {
        key: "image1Alt",
        label: "First photo description",
        kind: "short",
        default: "Osman Meyredi bowing the double bass, black and white",
      },
      {
        key: "greats.heading",
        label: "Section heading 1",
        kind: "short",
        default: "On stage with the greats",
      },
      {
        key: "greats.body",
        label: "Section 1 text",
        kind: "long",
        help: "Links are written as [text](/path), e.g. the Blue Lou Marini link.",
        default:
          "Osman has toured several times with Ike Willis, Frank Zappa’s longtime vocalist, playing Zappa’s notoriously demanding repertoire alongside a singer who lived inside it for decades. In Sardinia, he performed with musicians from Laura Pausini and Eros Ramazzotti’s bands. In Italy, he shared the stage with [Blue Lou Marini](https://www.youtube.com/watch?v=3uWIoIGESxI), saxophonist of the Blues Brothers Band.",
      },
      {
        key: "cons.heading",
        label: "Section heading 2",
        kind: "short",
        default: "Two conservatories, in Italy and in The Netherlands",
      },
      {
        key: "cons.body",
        label: "Section 2 text",
        kind: "long",
        default:
          "In 2009 he finished a master’s degree in double bass at the Trento Conservatory in Italy: the formal proof of years spent inside classical training and ensemble playing. But even then, the double bass was never the whole story: on the side, almost as easily as breathing, he was picking up drums, percussion, guitar, electric guitar, keyboards and synthesisers.\n\nA decade later he completed a degree in Music Education at the Conservatory of Amsterdam, covering pedagogy, arrangement, band coaching, vocal performance, jazz piano and music production. Between the two degrees is basically his whole working life: one rooted in craft, the other in how craft gets passed on.",
      },
      {
        key: "image2",
        label: "Second photo (landscape)",
        kind: "image",
        default: "/images/about/about-multi-instrumentalist.jpg",
      },
      {
        key: "image2Alt",
        label: "Second photo description",
        kind: "short",
        default: "Osman Meyredi on stage surrounded by his instruments, black and white",
      },
      {
        key: "started.heading",
        label: "Section heading 3",
        kind: "short",
        default: "Where it started",
      },
      {
        key: "started.body",
        label: "Section 3 text",
        kind: "long",
        default:
          "His story with music started before he had the language to explain it. When his uncle taught him the beginning of a Christmas song but had to leave before finishing it, Osman completed the melody by ear, instinctively finding the missing notes. That moment felt as if music already belonged to him. Since then he would hear songs on the radio and play them almost immediately on the piano without reading a single note.",
      },
      {
        key: "langs.heading",
        label: "Section heading 4",
        kind: "short",
        default: "Languages & availability",
      },
      {
        key: "langs.body",
        label: "Section 4 text",
        kind: "long",
        default:
          "Osman Meyredi works in English, Italian and Dutch. He’s based in Amsterdam, performs regularly in the Netherlands and Italy, and travels for concerts, events and productions across Europe and beyond.",
      },
      {
        key: "memorial",
        label: "Memorial line (bottom of the page)",
        kind: "short",
        default: "In memory of Ike Willis (1955–2026)",
      },
      {
        key: "seo.title",
        label: "SEO: browser/Google title",
        kind: "short",
        default: "About Osman Meyredi | Italian-Born Multi-Instrumentalist in the Netherlands",
      },
      {
        key: "seo.description",
        label: "SEO: meta description",
        kind: "long",
        default:
          "Osman Meyredi is an Italian-born artist, multi-instrumentalist, songwriter, composer, singer, music director and producer, based in the Netherlands, performing across Europe and beyond.",
      },
    ],
  },
  {
    id: "services",
    title: "Services overview",
    blurb:
      "The service names and teasers. These names also feed the menu, the footer and the services sub-navigation.",
    fields: [
      { key: "eyebrow", label: "Small heading", kind: "short", default: "All Services" },
      { key: "heading", label: "Page title", kind: "short", default: "Work with Osman Meyredi" },
      { key: "concerts.title", label: "Service 1 name", kind: "short", default: "Concerts" },
      {
        key: "concerts.subtitle",
        label: "Service 1 tags",
        kind: "short",
        default: "Festivals · Venues · Events",
      },
      {
        key: "concerts.intro",
        label: "Service 1 teaser",
        kind: "long",
        default: "BOOK OSMAN LIVE. One artist. Many instruments. A show built around the moment.",
      },
      { key: "piano.title", label: "Service 2 name", kind: "short", default: "Live Piano" },
      {
        key: "piano.subtitle",
        label: "Service 2 tags",
        kind: "short",
        default: "Corporate · Receptions · Conferences",
      },
      {
        key: "piano.intro",
        label: "Service 2 teaser",
        kind: "long",
        default:
          "Osman Meyredi performs live solo piano for company celebrations, brand launches, conferences, receptions and other private and corporate occasions.",
      },
      { key: "production.title", label: "Service 3 name", kind: "short", default: "Music Production" },
      {
        key: "production.subtitle",
        label: "Service 3 tags",
        kind: "short",
        default: "Production · Arrangement · Instrumentation · Recording · Mixing · Mastering",
      },
      {
        key: "production.intro",
        label: "Service 3 teaser",
        kind: "long",
        default:
          "Whether you have a rough idea, a demo that isn't quite there yet, or a nearly finished song that needs the final production, mixing or mastering, he can step in at the point where you need him.",
      },
      {
        key: "scores.title",
        label: "Service 4 name",
        kind: "short",
        default: "Original Scores & Custom Music",
      },
      {
        key: "scores.subtitle",
        label: "Service 4 tags",
        kind: "short",
        default: "Film · TV · Documentary · Events · Online · Series · Adverts · Radio",
      },
      {
        key: "scores.intro",
        label: "Service 4 teaser",
        kind: "long",
        default:
          "Every track is composed, performed and produced by Osman personally, from the melody to the backing tracks, with no AI involved and nothing outsourced.",
      },
      { key: "readMore", label: "Tile link text", kind: "short", default: "Read more" },
      {
        key: "seo.title",
        label: "SEO: browser/Google title",
        kind: "short",
        default: "Services | Concerts, live piano, production & original scores",
      },
      {
        key: "seo.description",
        label: "SEO: meta description",
        kind: "long",
        default:
          "Work with Osman Meyredi: concerts, live solo piano, music production from first idea to finished track, and original scores and custom music composed for your project.",
      },
    ],
  },
  {
    id: "service-concerts",
    title: "Concerts page",
    blurb: "The full Concerts service page.",
    fields: [
      {
        key: "showHeading",
        label: "First heading",
        kind: "short",
        default: "The Show",
      },
      {
        key: "body",
        label: "The Show text",
        kind: "long",
        default:
          "Every song is Osman Meyredi’s own. It’s built as one continuous arc, not a set list. He opens solo and intimate, on piano with backing tracks, and from there the night keeps climbing: soul into funk into disco into a shot of 80’s, up to rock at its peak, before turning euphoric for the finale, a house-tinged closer that sends the room home on a high.\n\nIt’s never just one genre at a time: each transition blends into the next until it feels like something new that didn’t exist before. And there are no breaks. Instruments are handed to him live, mid-show, so the build never stops. Lighting, smoke and fire escalate with it.",
      },
      {
        key: "ticketsNote",
        label: "Tickets note (red line)",
        kind: "long",
        default:
          "Looking for tickets to an upcoming show? [See Shows](/shows). This page is about booking Osman to perform at your event.",
      },
      { key: "ctaLabel", label: "Booking button text", kind: "short", default: "Book Osman live" },
      {
        key: "image",
        label: "Page image (site path or full URL)",
        kind: "image",
        default: "/images/services/concerts-live-landscape.jpg",
      },
      {
        key: "imageAlt",
        label: "Page image description",
        kind: "short",
        default: "Osman Meyredi mid-performance at the keys, black and white, head tilted back",
      },
      {
        key: "optionsHeading",
        label: "Options heading",
        kind: "short",
        default: "Three ways to book a show",
      },
      {
        key: "opt1.title",
        label: "Option 1 name",
        kind: "short",
        default: "Live Multi-Instrumental Performance",
      },
      {
        key: "opt1.body",
        label: "Option 1 text",
        kind: "long",
        default:
          "One person, an entire band's worth of sound. Osman switches in real time between vocals, piano, synths, bass, guitar, double bass and percussion, layering it live with custom tracks and electronics he's built himself. No backing musicians, no safety net. Best for intimate theatres and events where watching one artist build a full show from scratch is the draw.",
      },
      { key: "opt2.title", label: "Option 2 name", kind: "short", default: "Visual Production" },
      {
        key: "opt2.body",
        label: "Option 2 text",
        kind: "long",
        default:
          "The same solo show, built up with lighting, visuals, smoke and fire, scaled for festivals and larger crowds who want spectacle to match the performance.",
      },
      { key: "opt3.title", label: "Option 3 name", kind: "short", default: "Expanded Live Show" },
      {
        key: "opt3.body",
        label: "Option 3 text",
        kind: "long",
        default:
          "Additional musicians, dancers and production, for when the moment calls for a full band-sized sound and presence on stage.",
      },
      {
        key: "statementLead",
        label: "Closing statement, first lines",
        kind: "long",
        default: "Not every performance needs the same set-up.\nThe starting point is always the same:",
      },
      {
        key: "statementEmphasis",
        label: "Closing statement, emphasis line",
        kind: "short",
        default: "What would make this particular audience feel something?",
      },
      {
        key: "seo.title",
        label: "SEO: browser/Google title",
        kind: "short",
        default: "Live Musician & Concert Performances | Osman Meyredi",
      },
      {
        key: "seo.description",
        label: "SEO: meta description",
        kind: "long",
        default:
          "Book Osman Meyredi live: every song his own, built as one continuous arc: soul into funk into disco into rock, with instruments handed to him mid-show. Based in Amsterdam, performing across the Netherlands, Italy and Europe.",
      },
    ],
  },
  {
    id: "service-live-piano",
    title: "Live Piano page",
    blurb: "The full Live Piano service page.",
    fields: [
      {
        key: "strip",
        label: "Tags line",
        kind: "short",
        default: "Corporate · Receptions · Conferences · Special Events",
      },
      {
        key: "intro",
        label: "Intro paragraph",
        kind: "long",
        default:
          "Osman Meyredi performs live solo piano for company celebrations, brand launches, conferences, receptions and other private and corporate occasions.",
      },
      { key: "ctaLabel", label: "Booking button text", kind: "short", default: "Book Osman Meyredi" },
      {
        key: "image",
        label: "Page image (site path or full URL)",
        kind: "image",
        default: "/images/services/live-piano-grand.jpg",
      },
      {
        key: "imageAlt",
        label: "Page image description",
        kind: "short",
        default: "Osman Meyredi at a white grand piano by the window, black and white",
      },
      {
        key: "body",
        label: "Main text",
        kind: "long",
        default:
          "He keeps things understated: solo piano, played live, present in the room without ever taking it over. His repertoire blends his own compositions with carefully chosen covers, drifting easily between light classical, jazz, pop and film music depending on the mood he’s reading in the room. With his broad musical background and his ear for a room, he shapes the set as he goes, rather than sticking to a fixed programme.\n\nIf the venue has its own grand piano, that’s always his first choice, it keeps the set-up simple and adds a natural touch of class. If not, he brings his own electronic piano, built discreetly into a grand-piano-style shell, so the elegance of a real piano is never lost, even without one in the room.\n\nWant something with a bit more presence? A vocalist, male or female, can be added on request.",
      },
      {
        key: "listenHeading",
        label: "Listen prompt heading",
        kind: "short",
        default: "Want to hear what it sounds like?",
      },
      {
        key: "listenBody",
        label: "Listen prompt text",
        kind: "long",
        default:
          "Watch [Osman Meyredi at the piano](/shows/live-videos), from intimate performance to jazz, pop and his own compositions.",
      },
      {
        key: "listenCtaLabel",
        label: "Listen button text",
        kind: "short",
        default: "Watch the live videos",
      },
      {
        key: "seo.title",
        label: "SEO: browser/Google title",
        kind: "short",
        default: "Live Pianist for Events in Amsterdam & the Netherlands | Osman Meyredi",
      },
      {
        key: "seo.description",
        label: "SEO: meta description",
        kind: "long",
        default:
          "Osman Meyredi performs live solo piano for company celebrations, brand launches, conferences, receptions and other private and corporate occasions in Amsterdam, the Netherlands and beyond.",
      },
    ],
  },
  {
    id: "service-music-production",
    title: "Music Production page",
    blurb: "The full Music Production service page.",
    fields: [
      {
        key: "intro",
        label: "Intro sentence",
        kind: "long",
        default:
          "Osman Meyredi is an artist-producer who works with artists to develop, shape and finish their music.",
      },
      {
        key: "redline",
        label: "Red line",
        kind: "long",
        default:
          "Whether you have a rough idea, a demo that isn’t quite there yet, or a nearly finished song that needs the final production, mixing or mastering, he can step in at the point where you need him.",
      },
      {
        key: "body1",
        label: "First paragraph",
        kind: "long",
        default:
          "Playing bass taught Osman what the drummer needs. Playing drums taught him what the bass should leave out. Enough time at the piano and you start hearing exactly how much space a singer actually has, which matters, because he sings too. That instinct is backed by formal training too, a degree in Music Production from Master The Mix Academy, covering everything from arrangement to studio engineering.",
      },
      {
        key: "body2",
        label: "Second paragraph",
        kind: "long",
        default:
          "He’s just as at home on both sides of production: programming and arranging on a laptop, and riding the console when it’s time to capture a live take. That’s what lets him hear what a track is missing, shape the musical direction, and, when needed, play and record the instruments himself. It’s also why artists like working with him. He’s not just telling a singer or a guitarist what to do, he’s usually sat in that chair himself, and he writes and produces parts musicians actually want to play.",
      },
      { key: "ctaLabel", label: "Button text", kind: "short", default: "Work with Osman" },
      {
        key: "seo.title",
        label: "SEO: browser/Google title",
        kind: "short",
        default: "Music Producer & Multi-Instrumentalist in the Netherlands | Osman Meyredi",
      },
      {
        key: "seo.description",
        label: "SEO: meta description",
        kind: "long",
        default:
          "Osman Meyredi is an artist-producer who works with artists to develop, shape and finish their music, stepping in at the point where you need him.",
      },
    ],
  },
  {
    id: "service-original-scores",
    title: "Original Scores & Custom Music page",
    blurb: "The full Original Scores & Custom Music service page.",
    fields: [
      {
        key: "intro",
        label: "Intro sentence",
        kind: "long",
        default:
          "Every track is composed, performed and produced by Osman personally, from the melody to the backing tracks, with no AI involved and nothing outsourced.",
      },
      {
        key: "redline",
        label: "Red line",
        kind: "long",
        default:
          "Know exactly what you need? [Get in touch](/contact?type=ORIGINAL_TRACKS) and there’s a good chance it can be made.",
      },
      {
        key: "body",
        label: "Main text",
        kind: "long",
        default:
          "What makes Osman Meyredi’s work distinctive is that he can take different styles, instruments and influences and make them sound as though they belong together. That’s exactly why writing something new is where the real work happens, especially for film, series and TV, where music isn’t decoration, it’s part of how a story is told. It needs to carry a feeling the pictures alone can’t, land in exactly the right moment, and come from a proper briefing rather than a search filter.\n\nMore classical, more jazzy, cinematic, stripped back to just piano, whatever the scene calls for. That’s where a first conversation about the vision starts, and from there, the track takes shape around it.",
      },
      {
        key: "examplesHeading",
        label: "Examples heading (shown once tracks exist)",
        kind: "short",
        default: "Examples · 5 tracks",
      },
      {
        key: "examplesBody",
        label: "Examples text",
        kind: "long",
        default:
          "These five tracks are just a taste of what’s possible, not the limit of it. For a fuller sense of his range, from solo piano to full live sets, see his [live videos](/shows/live-videos). And whatever direction you need, every style, mood or arrangement can be shaped entirely around your project.",
      },
      { key: "ctaLabel", label: "Button text", kind: "short", default: "Work with Osman" },
      {
        key: "musicianship.heading",
        label: "Musicianship statement (above the previews)",
        kind: "long",
        default: "Every instrument you hear is played by Osman Meyredi.",
      },
      {
        key: "musicianship.support",
        label: "Musicianship supporting line",
        kind: "long",
        default: "Original music, performed and produced by Osman himself. No AI-generated performances.",
      },
      {
        key: "readyBlock",
        label: "Ready-made library paragraph",
        kind: "long",
        default:
          "Prefer something ready to go right now? His library is filled with high-quality tracks across every genre and mood, suited to adverts, YouTube content, event openings, weddings and more. And because everything is composed and produced in his own studio, licences can be arranged directly with him, no middlemen involved.",
      },
      {
        key: "readyClosing",
        label: "Closing line (after the previews)",
        kind: "long",
        default:
          "If you can't find the right track in the library, [get in touch](/contact?type=ORIGINAL_TRACKS)! There's a good chance it can still be made.",
      },
      {
        key: "previewNote",
        label: "Preview rights note (below the previews)",
        kind: "long",
        default: "Preview only. Usage requires permission/licensing from Osman Meyredi.",
      },
      {
        key: "licenseCta",
        label: "Per-track licensing link text",
        kind: "short",
        default: "Enquire about licensing",
      },
      {
        key: "seo.title",
        label: "SEO: browser/Google title",
        kind: "short",
        default: "Original Scores & Custom Music | Osman Meyredi",
      },
      {
        key: "seo.description",
        label: "SEO: meta description",
        kind: "long",
        default:
          "Every track is composed, performed and produced by Osman Meyredi personally, from the melody to the backing tracks, with no AI involved and nothing outsourced, for film, TV, documentary, events, online, series, adverts and radio.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    blurb: "The public contact details and page wording (not the form's internal routing).",
    fields: [
      {
        key: "heading",
        label: "Page title",
        kind: "short",
        default: "Tell Osman Meyredi about it",
      },
      {
        key: "directHeading",
        label: "Contacts column heading",
        kind: "short",
        default: "Straight to the right person",
      },
      { key: "managementName", label: "Management contact name", kind: "short", default: "Jolene Prins" },
      {
        key: "managementEmail",
        label: "Management email",
        kind: "short",
        default: "jolene@osmanmeyredi.com",
      },
      {
        key: "bookingsEmail",
        label: "Bookings email",
        kind: "short",
        default: "bookings@osmanmeyredi.com",
      },
      { key: "generalEmail", label: "General email", kind: "short", default: "info@osmanmeyredi.com" },
      {
        key: "languageLine",
        label: "Language line",
        kind: "short",
        default: "Write in Italian, English or Dutch.",
      },
      {
        key: "languageLineItalian",
        label: "Language line (Italian)",
        kind: "short",
        default: "Scrivi in italiano, inglese o olandese",
      },
      {
        key: "seo.title",
        label: "SEO: browser/Google title",
        kind: "short",
        default: "Book Osman Meyredi | Live Music, Piano & Music Production",
      },
      {
        key: "seo.description",
        label: "SEO: meta description",
        kind: "long",
        default:
          "Tell Osman Meyredi about it: bookings, live piano, production, licensing, collaborations and press. Direct contacts for management and bookings, or one structured form for everything else.",
      },
    ],
  },
];

/** Home gallery slots — a dedicated Studio page built from the same store. */
export const GALLERY_PAGE_ID = "home-gallery";
export const GALLERY_SLOTS = 8;

export function copyPage(id: string): CopyPageDef | null {
  return COPY_PAGES.find((p) => p.id === id) ?? null;
}

export function copyDefaults(id: string): Record<string, string> {
  const page = copyPage(id);
  const out: Record<string, string> = {};
  for (const f of page?.fields ?? []) out[f.key] = f.default;
  return out;
}
