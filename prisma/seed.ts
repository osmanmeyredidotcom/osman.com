/**
 * Seeds a PostgreSQL database with the same verified content the demo backend uses,
 * plus the owner account.
 *
 * Usage:
 *   DATABASE_URL=... STUDIO_EMAIL=... STUDIO_PASSWORD=... npx prisma db seed
 *
 * The owner password is read from STUDIO_PASSWORD (plain text, seed-time only),
 * hashed with bcrypt and never stored in code. Demo events are clearly labelled
 * "[DEMO]" — delete them from the Studio before launch, or seed without them by
 * setting SEED_DEMO_EVENTS=false.
 */
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  agendaDemoEvents,
  demoCollaborations,
  demoEvents,
  demoFaqs,
  demoLibraryTracks,
  realEvents,
  demoMedia,
  demoProducts,
  demoReleases,
  demoServices,
  demoSettings,
  demoVideos,
} from "../src/data/demo/content";

async function main() {
  // The seed runs as a plain tsx process — load .env explicitly (optional,
  // so environments that inject real env vars need no file).
  try {
    process.loadEnvFile();
  } catch {
    /* no .env present — fine */
  }
  // Prefer the direct (unpooled) connection for seeding when available.
  const raw = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is required to seed");
  // sslmode=require → verify-full: same behaviour in node-postgres today,
  // but explicit — avoids pg's SECURITY WARNING at startup.
  const connectionString = raw.replace(/sslmode=require\b/, "sslmode=verify-full");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  const email = process.env.STUDIO_EMAIL;
  const password = process.env.STUDIO_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "Set STUDIO_EMAIL and STUDIO_PASSWORD in the environment to create the owner account (they are not stored in code)."
    );
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash },
    create: {
      email: email.toLowerCase(),
      name: "Osman Meyredi",
      passwordHash,
      role: "OWNER",
    },
  });

  for (const s of demoServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { shortDescription: s.shortDescription, body: s.body },
      create: {
        id: s.id,
        slug: s.slug,
        serviceType: s.serviceType,
        title: s.title,
        shortDescription: s.shortDescription,
        body: s.body,
        imageUrl: s.imageUrl,
        status: s.status,
        sortOrder: s.sortOrder,
      },
    });
  }

  for (const v of demoVideos) {
    await prisma.liveVideo.upsert({
      where: { slug: v.slug },
      // Round 2 (10-09): re-seeding pushes the approved order and the new
      // per-video descriptions (Keynote slides 26–28) to existing rows.
      // 12-09: platform/videoUrl/thumbnailUrl refresh too, so the
      // self-hosted Website Landscape row can never stay half-migrated.
      update: {
        // Content-governance pass (20-09): title refreshes too, so the
        // punctuation-audited titles reach existing rows. 21-09: status
        // refreshes as well, so the Cinetol draft publishes on re-seed
        // now that its YouTube upload is confirmed.
        title: v.title,
        sortOrder: v.sortOrder,
        description: v.description,
        platform: v.platform,
        videoUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
        status: v.status,
      },
      create: {
        id: v.id,
        slug: v.slug,
        title: v.title,
        description: v.description,
        platform: v.platform,
        videoUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
        venue: v.venue,
        performanceDate: v.performanceDate ? new Date(v.performanceDate) : null,
        year: v.year,
        tags: v.tags,
        status: v.status,
        featured: v.featured,
        sortOrder: v.sortOrder,
      },
    });
  }

  // Round 3 Keynote (vinyl slide + Music/collaboration slide): the Disco
  // Sparks album-cover entry of "Keep Your Eye on the Sparrow" is removed —
  // "We keep the other one (same song)", i.e. the Special 45 stays.
  await prisma.release.deleteMany({ where: { slug: "keep-your-eye-on-the-sparrow" } });

  for (const r of demoReleases) {
    await prisma.release.upsert({
      where: { slug: r.slug },
      // Round 2: re-seeding refreshes the approved vinyl set — real covers,
      // labels, Spotify links, running order, and the draft status of the
      // release that has no proper cover yet.
      update: {
        title: r.title,
        relationshipType: r.relationshipType,
        primaryArtistName: r.primaryArtistName,
        osmanCredit: r.osmanCredit,
        labelName: r.labelName,
        catalogNumber: r.catalogNumber,
        artworkCredit: r.artworkCredit,
        artworkUrl: r.artworkUrl,
        rightsStatus: r.rightsStatus,
        sourceUrl: r.sourceUrl,
        collaborationSlug: r.collaborationSlug,
        year: r.year,
        description: r.description,
        credits: r.credits,
        spotifyUrl: r.spotifyUrl,
        // New Osman feedback.pages (23-09-2026): re-seeding also refreshes
        // the Apple Music links supplied for the existing releases.
        appleMusicUrl: r.appleMusicUrl,
        status: r.status,
        featured: r.featured,
        sortOrder: r.sortOrder,
      },
      create: {
        id: r.id,
        slug: r.slug,
        title: r.title,
        releaseType: r.releaseType,
        relationshipType: r.relationshipType,
        primaryArtistName: r.primaryArtistName,
        osmanCredit: r.osmanCredit,
        labelName: r.labelName,
        catalogNumber: r.catalogNumber,
        artworkCredit: r.artworkCredit,
        rightsStatus: r.rightsStatus,
        sourceUrl: r.sourceUrl,
        collaborationSlug: r.collaborationSlug,
        artworkUrl: r.artworkUrl,
        releaseDate: r.releaseDate ? new Date(r.releaseDate) : null,
        year: r.year,
        description: r.description,
        credits: r.credits,
        spotifyUrl: r.spotifyUrl,
        appleMusicUrl: r.appleMusicUrl,
        youtubeUrl: r.youtubeUrl,
        bandcampUrl: r.bandcampUrl,
        otherUrl: r.otherUrl,
        status: r.status,
        featured: r.featured,
        sortOrder: r.sortOrder,
      },
    });
  }

  for (const m of demoMedia) {
    await prisma.mediaItem.upsert({
      where: { slug: m.slug },
      update: {},
      create: {
        id: m.id,
        slug: m.slug,
        publication: m.publication,
        headline: m.headline,
        mediaType: m.mediaType,
        date: m.date ? new Date(m.date) : null,
        articleUrl: m.articleUrl,
        imageUrl: m.imageUrl,
        summary: m.summary,
        status: m.status,
        featured: m.featured,
      },
    });
  }

  // Practical Q&A (SEO/AI foundation §30) — create-only: after the first
  // seed the Studio owns the answers, so re-seeding never overwrites edits.
  for (const f of demoFaqs) {
    await prisma.faq.upsert({
      where: { slug: f.slug },
      // Content-governance pass: approved Q&A wording refreshes on re-seed.
      update: { question: f.question, answer: f.answer },
      create: {
        id: f.id,
        slug: f.slug,
        question: f.question,
        answer: f.answer,
        linkUrl: f.linkUrl,
        linkLabel: f.linkLabel,
        aiApproved: f.aiApproved,
        status: f.status,
        sortOrder: f.sortOrder,
      },
    });
  }

  for (const p of demoProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { description: p.description },
      create: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl,
        category: p.category,
        priceText: p.priceText,
        status: p.status,
        externalCommerceId: p.externalCommerceId,
        externalUrl: p.externalUrl,
        featured: p.featured,
        sortOrder: p.sortOrder,
      },
    });
  }

  // Real events from the Keynote (02-09-2026) — seeded in every mode.
  const eventRows = [
    ...realEvents,
    ...(process.env.SEED_DEMO_EVENTS !== "false" ? [...demoEvents, ...agendaDemoEvents] : []),
  ];
  {
    for (const e of eventRows) {
      await prisma.event.upsert({
        where: { slug: e.slug },
        // Existing rows pick up the precision-pack metadata on re-seed,
        // plus the Round 2 slide-20 exact details (title/venue/end time).
        update: {
          title: e.title,
          endTime: e.endTime,
          venue: e.venue,
          ticketingType: e.ticketingType,
          timezone: e.timezone,
          isDemo: e.isDemo,
        },
        create: {
          id: e.id,
          slug: e.slug,
          eventType: e.eventType,
          title: e.title,
          description: e.description,
          date: new Date(`${e.date}T00:00:00.000Z`),
          startTime: e.startTime,
          endTime: e.endTime,
          venue: e.venue,
          address: e.address,
          city: e.city,
          country: e.country,
          imageUrl: e.imageUrl,
          imageAlt: e.imageAlt,
          imageCredit: e.imageCredit,
          ticketUrl: e.ticketUrl,
          venueUrl: e.venueUrl,
          priceText: e.priceText,
          collaborators: e.collaborators,
          ticketingType: e.ticketingType,
          ctaLabel: e.ctaLabel,
          timezone: e.timezone,
          isDemo: e.isDemo,
          status: e.status,
          eventState: e.eventState,
          featured: e.featured,
          publishedAt: e.publishedAt ? new Date(e.publishedAt) : null,
        },
      });
    }
  }

  // Music Library preview tracks (brief 20-09-2026): the five ~25s preview
  // cuts. Old demo fixtures are removed by slug; re-seeding refreshes the
  // preview metadata (title/genre/url/duration/order) without touching any
  // tracks the Studio team adds themselves.
  await prisma.libraryTrack.deleteMany({
    where: {
      slug: {
        in: [
          "demo-midnight-motorway",
          "demo-brass-tacks",
          "demo-glass-harbour",
          "demo-quiet-hours",
          "demo-low-light-district",
        ],
      },
    },
  });
  for (const t of demoLibraryTracks) {
    await prisma.libraryTrack.upsert({
      where: { slug: t.slug },
      update: {
        title: t.title,
        genre: t.genre,
        moods: t.moods,
        useCases: t.useCases,
        durationSec: t.durationSec,
        audioUrl: t.audioUrl,
        description: t.description,
        status: t.status,
        featured: t.featured,
        sortOrder: t.sortOrder,
      },
      create: {
        id: t.id,
        slug: t.slug,
        title: t.title,
        genre: t.genre,
        moods: t.moods,
        useCases: t.useCases,
        durationSec: t.durationSec,
        audioUrl: t.audioUrl,
        description: t.description,
        status: t.status,
        featured: t.featured,
        sortOrder: t.sortOrder,
      },
    });
  }

  for (const c of demoCollaborations) {
    await prisma.collaboration.upsert({
      where: { slug: c.slug },
      // Verified facts + memorial refresh on re-seed; internal notes preserved.
      // Round 2 adds the approved band image and the full memorial dates.
      update: {
        role: c.role,
        collaborators: c.collaborators,
        heroImageUrl: c.heroImageUrl,
        heroImageAlt: c.heroImageAlt,
        heroImageCredit: c.heroImageCredit,
        heroImageRights: c.heroImageRights,
        memorialTitle: c.memorialTitle,
        memorialName: c.memorialName,
        memorialYears: c.memorialYears,
        showMemorial: c.showMemorial,
        // Round 3: newest-first ordering (Kassko above the Zappa era).
        sortOrder: c.sortOrder,
        // Content-governance pass: audited descriptions refresh too.
        shortDescription: c.shortDescription,
        longDescription: c.longDescription,
      },
      create: {
        id: c.id,
        slug: c.slug,
        name: c.name,
        role: c.role,
        startYear: c.startYear,
        endYear: c.endYear,
        ongoing: c.ongoing,
        shortDescription: c.shortDescription,
        longDescription: c.longDescription,
        heroImageUrl: c.heroImageUrl,
        heroImageAlt: c.heroImageAlt,
        heroImageCredit: c.heroImageCredit,
        heroImageRights: c.heroImageRights,
        collaborators: c.collaborators,
        externalUrl: c.externalUrl,
        memorialTitle: c.memorialTitle,
        memorialName: c.memorialName,
        memorialYears: c.memorialYears,
        memorialText: c.memorialText,
        showMemorial: c.showMemorial,
        publicCulturalNote: c.publicCulturalNote,
        culturalNoteStatus: c.culturalNoteStatus,
        internalNotes: c.internalNotes,
        status: c.status,
        sortOrder: c.sortOrder,
      },
    });
  }

  const settingsEntries = Object.entries(demoSettings).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string"
  );
  for (const [key, value] of settingsEntries) {
    await prisma.siteSetting.upsert({
      where: { key },
      // Settings stay Studio-owned on re-seed, with one exception: the
      // Round 2 strict email rule (never Osman's personal inbox) must reach
      // existing databases, so contactEmail is always refreshed.
      update: key === "contactEmail" ? { value } : {},
      create: { key, value },
    });
  }

  console.log("Seed complete.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
