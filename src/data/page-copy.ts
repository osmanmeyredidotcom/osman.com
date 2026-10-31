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
    title: "Bio",
    blurb:
      "The Bio page (option A, 12-10 feedback round): banner, agency introduction and Jolene's chaptered story, 9 Oct copy verbatim. Chapters 1-3 are visible; 4-9 sit under Read more.",
    fields: [
      {
        key: "banner.image",
        label: "Full-width banner image (site path or full URL)",
        kind: "image",
        default: "/images/gallery/gallery-04-bass-doorway.jpg",
      },
      {
        key: "banner.imageAlt",
        label: "Banner image description (for screen readers)",
        kind: "short",
        default: "Osman Meyredi tipping his hat, bass in hand, by a stone doorway",
      },
      {
        key: "intro",
        label: "Agency introduction (the bold opening paragraph)",
        kind: "long",
        default:
          "Osman Meyredi is an Italian-born multi-instrumentalist, songwriter, composer, singer, music director and producer based in Amsterdam. He moves easily between instruments and genres, bringing different styles and influences together into songs that feel personal, honest and never quite predictable. Trained as a classical double bassist, he has toured with Frank Zappa’s longtime vocalist Ike Willis and shared the stage with Blues Brothers saxophonist Blue Lou Marini. He arrived in the Netherlands in 2014 with 1,000 euros and nothing else. In October 2026 he launched his own label, Meyredi Records, starting with a reworked version of his single “Dance with this Mess”, a song that turns the chaos of life into a rhythm you can move to. It’s out on 20 October 2026, and his debut album follows in April 2027.",
      },
      { key: "ch1.heading", label: "Chapter 1 heading", kind: "short", default: "Music before words" },
      {
        key: "ch1.body",
        label: "Chapter 1 body",
        kind: "long",
        default:
          "Osman’s story with music started before he had the language to explain it. As a child, his uncle taught him the beginning of a Christmas song but had to leave before finishing it. Osman completed the melody by ear, finding the missing notes on his own. From then on, he would hear songs on the radio and find them back on the piano, without reading a single note. Music was never something he learned from a method book first. It was something he recognised.",
      },
      { key: "ch2.heading", label: "Chapter 2 heading", kind: "short", default: "Out of the mountains" },
      {
        key: "ch2.body",
        label: "Chapter 2 body",
        kind: "long",
        default:
          "Osman was born in Tione and grew up between Trento and Storo, in the mountains of northern Italy. Where visitors come for the views, Osman saw walls, and he longed for open space and a wider world.\n\nHe channelled that longing into music. In 2009 he completed a master’s degree in double bass at the Trento Conservatory, and taught himself drums, percussion, guitar, keyboards and synthesisers almost as easily as breathing. Along the way, he even appeared as an extra in three Italian films, including Alessandro Baricco’s Lezione Ventuno (2008) with John Hurt and Marco Bellocchio’s Vincere (2009).",
      },
      { key: "ch3.heading", label: "Chapter 3 heading", kind: "short", default: "1,000 euros and a hostel bed" },
      {
        key: "ch3.body",
        label: "Chapter 3 body",
        kind: "long",
        default:
          "In 2014 Osman moved to the Netherlands with 1,000 euros in his bank account and nothing else. His first home was a bed in the cheapest hostel in Amsterdam’s city centre. Coming from a mountain village where everyone knows your name, Amsterdam was a shock: a city where nobody knew him, where people said exactly what they thought, and where everyone seemed free to live as they pleased. That clash, and above all the freedom he discovered in it, became raw material: it inspired his song “Black City”, which will be released in July 2027.\n\nHe built his new life step by step and returned to study. In 2020 he graduated from the Conservatory of Amsterdam, covering pedagogy, arrangement, band coaching, vocal performance, jazz piano and music production. Between his two degrees lies his whole working life: one rooted in craft, the other in how craft gets passed on.",
      },
      { key: "ch4.heading", label: "Chapter 4 heading (under Read more)", kind: "short", default: "On stage with the greats" },
      {
        key: "ch4.body",
        label: "Chapter 4 body",
        kind: "long",
        default:
          "In Italy, Osman learned to move between worlds. He performed in Sardinia with musicians from the bands of Laura Pausini and Eros Ramazzotti, played live for comedians Andrea Pucci, Pino Campagna and Dado, and accompanied singers Letizia Gambi and Luisa Corna. In Milan he played double bass in “IndipenDANCE”, a project with music by Vittorio Cosma and guests including Giuliano Sangiorgi, Eugenio Finardi and musicians from Peter Gabriel’s band.\n\nBetween 2017 and 2019 he toured the UK several times with the late Ike Willis, Frank Zappa’s longtime vocalist, playing Zappa’s notoriously demanding repertoire night after night. He is also credited as keyboardist for ZAPPATiKA. In August 2023 he shared the stage with Blue Lou Marini, saxophonist of the Blues Brothers Band, in Ponte Caffaro, Italy.\n\nArtists describe him as a musical all-rounder with groove in his blood: he comes prepared, listens closely, and knows when to add and when to strip things back. Every stage taught him something new, and all of it found its way into his own sound.",
      },
      { key: "ch5.heading", label: "Chapter 5 heading (under Read more)", kind: "short", default: "Every note his own" },
      {
        key: "ch5.body",
        label: "Chapter 5 body",
        kind: "long",
        default:
          "That sound is unmistakably his, because Osman builds every song from the ground up. Every instrument, sound and effect, every vocal line and every note is written, composed, arranged and produced by him, for his recordings and his live shows alike. Moving across classical, funk, rock, fusion, soul, cinematic and electronic sound, often within one piece, he writes music that stands on its own: take away the vocals, and you still have a strong piece of music.\n\nHis signature is the solo, on piano, guitar or bass guitar. It’s where a song opens up, the moment the walls fall away and the music finds open sky, carrying the same curiosity and love of freedom that once pulled him out of the mountains.",
      },
      { key: "ch6.heading", label: "Chapter 6 heading (under Read more)", kind: "short", default: "Home in Amsterdam" },
      {
        key: "ch6.body",
        label: "Chapter 6 body",
        kind: "long",
        default:
          "Today Osman lives in a house overlooking the lake, a short walk from Amsterdam’s city beach. The view that once felt blocked is now wide open. Amsterdam keeps inspiring him: more than 180 nationalities share the city, people are open-minded, and the Dutch say what they mean. That honesty suits him. In a band, a studio or a rehearsal room, you always know where you stand, so all the energy can go into the music.\n\nHe works in English, Italian and Dutch, performs regularly in the Netherlands and Italy, and will travel to India to perform at a private event in early 2027. On stage, in a theater or in the studio, he still works the way he did as a child: listening first, supporting the whole, and finding what the music needs next. And when there is music, there is always a bit of gezelligheid.",
      },
      { key: "ch7.heading", label: "Chapter 7 heading (under Read more)", kind: "short", default: "What’s next: Meyredi Records" },
      {
        key: "ch7.body",
        label: "Chapter 7 body",
        kind: "long",
        default:
          "After years of bringing other artists’ music to life, Osman is now putting his own songs first. Beginning October 2026 he launched his own label, Meyredi Records, giving him full creative freedom over how his music is written, produced and released. He runs the label together with Jolene Prins, his music manager and creative partner, who brings international experience in creative communication and business leadership. The label is brand new, and its first chapter is already mapped out: a new version of “Dance with this Mess” on 1 November 2026, followed by a new single every few months and his debut album at the end of 2027.",
      },
      { key: "ch8.heading", label: "Chapter 8 heading (under Read more)", kind: "short", default: "Live: an evening, not just a concert" },
      {
        key: "ch8.body",
        label: "Chapter 8 body",
        kind: "long",
        default:
          "On 5 June 2026 Osman presented his first solo show, June’s Night, at Cinetol in Amsterdam. It was a success, and he was immediately booked to play live piano at a champagne event. His shows feel closer to fine dining than to a regular concert. Inspired by Elvis Presley’s shows, where the audience sat at long tables, guests stand or sit at high tables close to the music, and Osman and his team make every evening personal and special.\n\nEvery song in the show is written, composed and played by him, built as one continuous arc rather than a set list. He opens solo on piano with backing tracks, and the night keeps climbing: soul into funk, disco, a shot of the ’80s and rock, before a euphoric, house-tinged finale. The genres blend into something new, there are no breaks, and instruments are handed to him mid-show while lighting, smoke and fire build with the music. The show grows with the room: from an intimate evening, to a festival production, to a full stage with extra musicians and dancers.",
      },
      { key: "ch9.heading", label: "Chapter 9 heading (under Read more)", kind: "short", default: "Building the team" },
      {
        key: "ch9.body",
        label: "Chapter 9 body",
        kind: "long",
        default:
          "With a team now behind him, Osman can finally focus on what he loves most: making music and bringing it to people. The next step is building his own band. He’s looking for musicians with taste, empathy and groove: players who listen as much as they play, move easily between genres, and have the energy to carry a show that never stops. Meanwhile, he’s opening up more of his world on Instagram, from the studio and rehearsals to life on stage, so people can follow the journey as it happens.",
      },
      // 22-10 round 2 (R2-2): every bottom contact/booking CTA says exactly
      // "Get In Touch".
      { key: "ctaLabel", label: "Closing booking button text", kind: "short", default: "Get In Touch" },
      {
        key: "seo.title",
        label: "SEO: browser/Google title",
        kind: "short",
        default: "Bio | Osman Meyredi, Italian-Born Multi-Instrumentalist in the Netherlands",
      },
      {
        key: "seo.description",
        label: "SEO: Google description",
        kind: "long",
        default:
          "Osman Meyredi is an Italian-born multi-instrumentalist, songwriter, composer, singer, music director and producer based in Amsterdam, from the mountains of northern Italy to his own label, Meyredi Records.",
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
      {
        // Restructure round (23-09): the overview is image-led — one
        // approved photo per service, Studio-swappable.
        key: "concerts.image",
        label: "Service 1 photo",
        kind: "image",
        default: "/images/services/concerts-live-landscape.jpg",
      },
      {
        key: "concerts.imageAlt",
        label: "Service 1 photo description",
        kind: "short",
        default: "Osman Meyredi mid-performance at the keys, black and white, head tilted back",
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
      {
        key: "piano.image",
        label: "Service 2 photo",
        kind: "image",
        default: "/images/services/live-piano-grand.jpg",
      },
      {
        key: "piano.imageAlt",
        label: "Service 2 photo description",
        kind: "short",
        default: "Osman Meyredi at a white grand piano by the window, black and white",
      },
      // November feedback (N4): the service is named Music Production again
      // (back from the 12-10 "Meyredi Records" naming) in heading, register,
      // navigation, footer and contact subjects. Meyredi Records stays only
      // where it genuinely means the record label.
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
        // November feedback (N4): the register teaser is the approved lead
        // sentence of the new Music Production copy (FINAL_Sep26 doc, text
        // above PREVIOUS TEXT); the old teaser came from the retired draft.
        default:
          "Every song has something that makes it its own. Osman listens for it, then helps bring it into focus.",
      },
      {
        key: "production.image",
        label: "Service 3 photo",
        kind: "image",
        default: "/images/services/production-zappatika-rehearsals-1.jpg",
      },
      {
        key: "production.imageAlt",
        label: "Service 3 photo description",
        kind: "short",
        default: "Osman Meyredi at the keys in rehearsal with a guitarist, black and white",
      },
      {
        key: "scores.title",
        label: "Service 4 name",
        kind: "short",
        // 12-10 feedback round (CUSTOM_MUSIC.md): the service is named
        // Custom Music everywhere it appears.
        default: "Custom Music",
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
      {
        key: "scores.image",
        label: "Service 4 photo",
        kind: "image",
        default: "/images/gallery/gallery-07-studio-2011.jpg",
      },
      {
        key: "scores.imageAlt",
        label: "Service 4 photo description",
        kind: "short",
        default: "Osman Meyredi recording keyboards in the studio, headphones on",
      },
      { key: "readMore", label: "Tile link text", kind: "short", default: "Read more" },
      {
        key: "seo.title",
        label: "SEO: browser/Google title",
        kind: "short",
        default: "Services | Concerts, Live Piano, Music Production & Custom Music",
      },
      {
        key: "seo.description",
        label: "SEO: meta description",
        kind: "long",
        default:
          "Work with Osman Meyredi: concerts, live solo piano, music production from first idea to finished track, and custom music composed for your project.",
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
      // 12-10 feedback (P10-X251): the closing CTA uses the exact annotated
      // label, rendered as the global pill (uppercased by the pill style).
      // 22-10 round 2 (R2-2): exact capitalisation "Get In Touch".
      { key: "ctaLabelClosing", label: "Closing button text", kind: "short", default: "Get In Touch" },
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
      // 22-10 round 2 (R2-2): the page-end booking pill carries the shared
      // bottom-CTA wording; the hero pill above keeps its own label.
      { key: "ctaLabelClosing", label: "Closing button text", kind: "short", default: "Get In Touch" },
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
        // Restructure round (23-09): second approved photo breaks the
        // three-paragraph run (the Rome 2025 image from earlier rounds).
        key: "image2",
        label: "Second photo (landscape)",
        kind: "image",
        default: "/images/services/live-piano-rome-2025.jpg",
      },
      {
        key: "image2Alt",
        label: "Second photo description",
        kind: "short",
        default: "Osman Meyredi performing at a grand piano in front of an audience, Rome, 2025",
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
      // November feedback (N4): the approved shorter copy from
      // FINAL_Sep26_Music Production.pages (the text above PREVIOUS TEXT),
      // verbatim. Blank lines separate paragraphs inside a field.
      {
        key: "intro",
        label: "Intro sentence",
        kind: "long",
        default:
          "Every song has something that makes it its own. Osman listens for it, then helps bring it into focus.",
      },
      {
        key: "body1",
        label: "First paragraphs",
        kind: "long",
        default:
          "From a first idea to a finished recording, Osman works with artists wherever their music needs him. That might mean developing an arrangement, recording instruments, shaping the production or bringing a track through mixing and mastering.\n\nAs a songwriter, multi-instrumentalist and music director, Osman understands both the individual parts and the complete arrangement. He sings and plays piano, keyboards, bass, guitar and drums, and can compose new parts, write scores and guide other musicians through a recording. Whether programming a rhythm or capturing a live performance, he pays close attention to groove, dynamics and the space each instrument needs.",
      },
      {
        key: "body2",
        label: "Closing paragraphs",
        kind: "long",
        default:
          "The collaboration starts with your music and what you want to express. Together, you agree on the work needed to take it further.\n\nHave a track in mind? Send a listening link and tell Osman what you’re working towards.",
      },
      // 22-10 round 2 (R2-2): bottom contact CTA wording, exact.
      { key: "ctaLabel", label: "Button text", kind: "short", default: "Get In Touch" },
      // November feedback (N4): the bottom note about the record label —
      // a genuine Meyredi Records reference, linked to the label's site.
      {
        key: "labelNote",
        label: "Bottom note (record label)",
        kind: "long",
        default:
          "Osman is co-founder of Meyredi Records. For label enquiries and demo submissions, visit [Meyredi Records](https://www.meyredirecords.com).",
      },
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
      // 22-10 round 2 (R2-2): bottom contact CTA wording, exact.
      { key: "ctaLabel", label: "Button text", kind: "short", default: "Get In Touch" },
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
        default: "Custom Music | Osman Meyredi",
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
