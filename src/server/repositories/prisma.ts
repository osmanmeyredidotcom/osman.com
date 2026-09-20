import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@/generated/prisma/client";
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
import { demoSettings } from "@/data/demo/content";
import type { CollectionRepo, CopyRepo, Repos, SettingsRepo, UserRepo } from "./types";

const g = globalThis as typeof globalThis & { __osmanPrisma?: PrismaClient };

/**
 * node-postgres treats sslmode=require as verify-full but emits a process
 * warning about the upcoming semantic change (which Next's dev overlay then
 * reports as a console error). Making verify-full explicit keeps identical
 * security with no warning, while .env can keep the provider's canonical
 * string (Neon hands out sslmode=require).
 */
function pgConnectionString(raw: string): string {
  return raw.replace(/sslmode=require\b/, "sslmode=verify-full");
}

function client(): PrismaClient {
  if (!g.__osmanPrisma) {
    const raw = process.env.DATABASE_URL;
    if (!raw) throw new Error("DATABASE_URL is not set");
    g.__osmanPrisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: pgConnectionString(raw) }),
    });
  }
  return g.__osmanPrisma;
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function iso(d: Date): string {
  return d.toISOString();
}
function toDay(s: string): Date {
  return new Date(`${s}T00:00:00.000Z`);
}

/* ------------------------------ Events ------------------------------ */

type DbEvent = Prisma.EventGetPayload<Record<string, never>>;

function eventFromDb(e: DbEvent): EventRecord {
  return {
    id: e.id,
    slug: e.slug,
    eventType: e.eventType,
    title: e.title,
    description: e.description,
    date: isoDay(e.date),
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
    publishedAt: e.publishedAt ? iso(e.publishedAt) : null,
    createdAt: iso(e.createdAt),
    updatedAt: iso(e.updatedAt),
  };
}

function eventToDb(r: Partial<EventRecord>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...r };
  delete out.id;
  delete out.createdAt;
  delete out.updatedAt;
  if (r.date !== undefined) out.date = toDay(r.date);
  if (r.publishedAt !== undefined)
    out.publishedAt = r.publishedAt ? new Date(r.publishedAt) : null;
  return out;
}

const eventsRepo: CollectionRepo<EventRecord> = {
  async list() {
    const rows = await client().event.findMany({ orderBy: { date: "asc" } });
    return rows.map(eventFromDb);
  },
  async get(id) {
    const row = await client().event.findUnique({ where: { id } });
    return row ? eventFromDb(row) : null;
  },
  async getBySlug(slug) {
    const row = await client().event.findUnique({ where: { slug } });
    return row ? eventFromDb(row) : null;
  },
  async create(data) {
    const row = await client().event.create({
      data: eventToDb(data as Partial<EventRecord>) as unknown as Prisma.EventUncheckedCreateInput,
    });
    return eventFromDb(row);
  },
  async update(id, patch) {
    const row = await client().event.update({
      where: { id },
      data: eventToDb(patch) as unknown as Prisma.EventUncheckedUpdateInput,
    });
    return eventFromDb(row);
  },
  async remove(id) {
    await client().event.delete({ where: { id } });
  },
};

/* ---------------------- Generic date-mapped repos ---------------------- */

type DbVideo = Prisma.LiveVideoGetPayload<Record<string, never>>;
function videoFromDb(v: DbVideo): LiveVideoRecord {
  return {
    ...v,
    // Keep all three platforms intact — collapsing "file" to "youtube" here
    // broke the self-hosted Website Landscape player on Postgres-backed
    // runs (Aditya 12-09-2026: no poster, dead "Watch on YouTube" link).
    platform: v.platform === "vimeo" ? "vimeo" : v.platform === "file" ? "file" : "youtube",
    performanceDate: v.performanceDate ? isoDay(v.performanceDate) : null,
    createdAt: iso(v.createdAt),
    updatedAt: iso(v.updatedAt),
  };
}
function videoToDb(r: Partial<LiveVideoRecord>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...r };
  delete out.id;
  delete out.createdAt;
  delete out.updatedAt;
  if (r.performanceDate !== undefined)
    out.performanceDate = r.performanceDate ? toDay(r.performanceDate) : null;
  return out;
}

const videosRepo: CollectionRepo<LiveVideoRecord> = {
  async list() {
    const rows = await client().liveVideo.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map(videoFromDb);
  },
  async get(id) {
    const row = await client().liveVideo.findUnique({ where: { id } });
    return row ? videoFromDb(row) : null;
  },
  async getBySlug(slug) {
    const row = await client().liveVideo.findUnique({ where: { slug } });
    return row ? videoFromDb(row) : null;
  },
  async create(data) {
    const row = await client().liveVideo.create({
      data: videoToDb(data as Partial<LiveVideoRecord>) as unknown as Prisma.LiveVideoUncheckedCreateInput,
    });
    return videoFromDb(row);
  },
  async update(id, patch) {
    const row = await client().liveVideo.update({
      where: { id },
      data: videoToDb(patch) as unknown as Prisma.LiveVideoUncheckedUpdateInput,
    });
    return videoFromDb(row);
  },
  async remove(id) {
    await client().liveVideo.delete({ where: { id } });
  },
};

type DbRelease = Prisma.ReleaseGetPayload<Record<string, never>>;
function releaseFromDb(v: DbRelease): ReleaseRecord {
  return {
    ...v,
    releaseDate: v.releaseDate ? isoDay(v.releaseDate) : null,
    createdAt: iso(v.createdAt),
    updatedAt: iso(v.updatedAt),
  };
}
function releaseToDb(r: Partial<ReleaseRecord>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...r };
  delete out.id;
  delete out.createdAt;
  delete out.updatedAt;
  if (r.releaseDate !== undefined)
    out.releaseDate = r.releaseDate ? toDay(r.releaseDate) : null;
  return out;
}

const releasesRepo: CollectionRepo<ReleaseRecord> = {
  async list() {
    const rows = await client().release.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map(releaseFromDb);
  },
  async get(id) {
    const row = await client().release.findUnique({ where: { id } });
    return row ? releaseFromDb(row) : null;
  },
  async getBySlug(slug) {
    const row = await client().release.findUnique({ where: { slug } });
    return row ? releaseFromDb(row) : null;
  },
  async create(data) {
    const row = await client().release.create({
      data: releaseToDb(data as Partial<ReleaseRecord>) as unknown as Prisma.ReleaseUncheckedCreateInput,
    });
    return releaseFromDb(row);
  },
  async update(id, patch) {
    const row = await client().release.update({
      where: { id },
      data: releaseToDb(patch) as unknown as Prisma.ReleaseUncheckedUpdateInput,
    });
    return releaseFromDb(row);
  },
  async remove(id) {
    await client().release.delete({ where: { id } });
  },
};

type DbCollaboration = Prisma.CollaborationGetPayload<Record<string, never>>;
function collaborationFromDb(v: DbCollaboration): CollaborationRecord {
  return {
    ...v,
    createdAt: iso(v.createdAt),
    updatedAt: iso(v.updatedAt),
  };
}
function collaborationToDb(r: Partial<CollaborationRecord>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...r };
  delete out.id;
  delete out.createdAt;
  delete out.updatedAt;
  return out;
}

const collaborationsRepo: CollectionRepo<CollaborationRecord> = {
  async list() {
    const rows = await client().collaboration.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map(collaborationFromDb);
  },
  async get(id) {
    const row = await client().collaboration.findUnique({ where: { id } });
    return row ? collaborationFromDb(row) : null;
  },
  async getBySlug(slug) {
    const row = await client().collaboration.findUnique({ where: { slug } });
    return row ? collaborationFromDb(row) : null;
  },
  async create(data) {
    const row = await client().collaboration.create({
      data: collaborationToDb(data as Partial<CollaborationRecord>) as unknown as Prisma.CollaborationUncheckedCreateInput,
    });
    return collaborationFromDb(row);
  },
  async update(id, patch) {
    const row = await client().collaboration.update({
      where: { id },
      data: collaborationToDb(patch) as unknown as Prisma.CollaborationUncheckedUpdateInput,
    });
    return collaborationFromDb(row);
  },
  async remove(id) {
    await client().collaboration.delete({ where: { id } });
  },
};

type DbLibraryTrack = Prisma.LibraryTrackGetPayload<Record<string, never>>;
function libraryTrackFromDb(v: DbLibraryTrack): LibraryTrackRecord {
  return {
    ...v,
    createdAt: iso(v.createdAt),
    updatedAt: iso(v.updatedAt),
  };
}
function libraryTrackToDb(r: Partial<LibraryTrackRecord>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...r };
  delete out.id;
  delete out.createdAt;
  delete out.updatedAt;
  return out;
}

const libraryTracksRepo: CollectionRepo<LibraryTrackRecord> = {
  async list() {
    const rows = await client().libraryTrack.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map(libraryTrackFromDb);
  },
  async get(id) {
    const row = await client().libraryTrack.findUnique({ where: { id } });
    return row ? libraryTrackFromDb(row) : null;
  },
  async getBySlug(slug) {
    const row = await client().libraryTrack.findUnique({ where: { slug } });
    return row ? libraryTrackFromDb(row) : null;
  },
  async create(data) {
    const row = await client().libraryTrack.create({
      data: libraryTrackToDb(data as Partial<LibraryTrackRecord>) as unknown as Prisma.LibraryTrackUncheckedCreateInput,
    });
    return libraryTrackFromDb(row);
  },
  async update(id, patch) {
    const row = await client().libraryTrack.update({
      where: { id },
      data: libraryTrackToDb(patch) as unknown as Prisma.LibraryTrackUncheckedUpdateInput,
    });
    return libraryTrackFromDb(row);
  },
  async remove(id) {
    await client().libraryTrack.delete({ where: { id } });
  },
};

type DbMedia = Prisma.MediaItemGetPayload<Record<string, never>>;
function mediaFromDb(v: DbMedia): MediaItemRecord {
  return {
    ...v,
    date: v.date ? isoDay(v.date) : null,
    createdAt: iso(v.createdAt),
    updatedAt: iso(v.updatedAt),
  };
}
function mediaToDb(r: Partial<MediaItemRecord>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...r };
  delete out.id;
  delete out.createdAt;
  delete out.updatedAt;
  if (r.date !== undefined) out.date = r.date ? toDay(r.date) : null;
  return out;
}

const mediaRepo: CollectionRepo<MediaItemRecord> = {
  async list() {
    const rows = await client().mediaItem.findMany({ orderBy: { date: "desc" } });
    return rows.map(mediaFromDb);
  },
  async get(id) {
    const row = await client().mediaItem.findUnique({ where: { id } });
    return row ? mediaFromDb(row) : null;
  },
  async getBySlug(slug) {
    const row = await client().mediaItem.findUnique({ where: { slug } });
    return row ? mediaFromDb(row) : null;
  },
  async create(data) {
    const row = await client().mediaItem.create({
      data: mediaToDb(data as Partial<MediaItemRecord>) as unknown as Prisma.MediaItemUncheckedCreateInput,
    });
    return mediaFromDb(row);
  },
  async update(id, patch) {
    const row = await client().mediaItem.update({
      where: { id },
      data: mediaToDb(patch) as unknown as Prisma.MediaItemUncheckedUpdateInput,
    });
    return mediaFromDb(row);
  },
  async remove(id) {
    await client().mediaItem.delete({ where: { id } });
  },
};

type DbFaq = Prisma.FaqGetPayload<Record<string, never>>;
function faqFromDb(v: DbFaq): FaqRecord {
  return { ...v, createdAt: iso(v.createdAt), updatedAt: iso(v.updatedAt) };
}
function faqToDb(r: Partial<FaqRecord>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...r };
  delete out.id;
  delete out.createdAt;
  delete out.updatedAt;
  return out;
}

const faqsRepo: CollectionRepo<FaqRecord> = {
  async list() {
    const rows = await client().faq.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map(faqFromDb);
  },
  async get(id) {
    const row = await client().faq.findUnique({ where: { id } });
    return row ? faqFromDb(row) : null;
  },
  async getBySlug(slug) {
    const row = await client().faq.findUnique({ where: { slug } });
    return row ? faqFromDb(row) : null;
  },
  async create(data) {
    const row = await client().faq.create({
      data: faqToDb(data as Partial<FaqRecord>) as unknown as Prisma.FaqUncheckedCreateInput,
    });
    return faqFromDb(row);
  },
  async update(id, patch) {
    const row = await client().faq.update({
      where: { id },
      data: faqToDb(patch) as unknown as Prisma.FaqUncheckedUpdateInput,
    });
    return faqFromDb(row);
  },
  async remove(id) {
    await client().faq.delete({ where: { id } });
  },
};

type DbService = Prisma.ServiceGetPayload<Record<string, never>>;
function serviceFromDb(v: DbService): ServiceRecord {
  return { ...v, updatedAt: iso(v.updatedAt) };
}

const servicesRepo: CollectionRepo<ServiceRecord> = {
  async list() {
    const rows = await client().service.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map(serviceFromDb);
  },
  async get(id) {
    const row = await client().service.findUnique({ where: { id } });
    return row ? serviceFromDb(row) : null;
  },
  async getBySlug(slug) {
    const row = await client().service.findUnique({ where: { slug } });
    return row ? serviceFromDb(row) : null;
  },
  async create(data) {
    const { ...rest } = data as Partial<ServiceRecord>;
    delete rest.updatedAt;
    const row = await client().service.create({
      data: rest as unknown as Prisma.ServiceUncheckedCreateInput,
    });
    return serviceFromDb(row);
  },
  async update(id, patch) {
    const rest: Record<string, unknown> = { ...patch };
    delete rest.id;
    delete rest.updatedAt;
    const row = await client().service.update({
      where: { id },
      data: rest as unknown as Prisma.ServiceUncheckedUpdateInput,
    });
    return serviceFromDb(row);
  },
  async remove(id) {
    await client().service.delete({ where: { id } });
  },
};

type DbProduct = Prisma.ProductGetPayload<Record<string, never>>;
function productFromDb(v: DbProduct): ProductRecord {
  return { ...v, createdAt: iso(v.createdAt), updatedAt: iso(v.updatedAt) };
}

const productsRepo: CollectionRepo<ProductRecord> = {
  async list() {
    const rows = await client().product.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map(productFromDb);
  },
  async get(id) {
    const row = await client().product.findUnique({ where: { id } });
    return row ? productFromDb(row) : null;
  },
  async getBySlug(slug) {
    const row = await client().product.findUnique({ where: { slug } });
    return row ? productFromDb(row) : null;
  },
  async create(data) {
    const rest: Record<string, unknown> = { ...data };
    delete rest.createdAt;
    delete rest.updatedAt;
    const row = await client().product.create({
      data: rest as unknown as Prisma.ProductUncheckedCreateInput,
    });
    return productFromDb(row);
  },
  async update(id, patch) {
    const rest: Record<string, unknown> = { ...patch };
    delete rest.id;
    delete rest.createdAt;
    delete rest.updatedAt;
    const row = await client().product.update({
      where: { id },
      data: rest as unknown as Prisma.ProductUncheckedUpdateInput,
    });
    return productFromDb(row);
  },
  async remove(id) {
    await client().product.delete({ where: { id } });
  },
};

/* ------------------------------ Users ------------------------------ */

const usersRepo: UserRepo = {
  async findByEmail(email) {
    const row = await client().user.findUnique({ where: { email: email.toLowerCase() } });
    return row
      ? {
          id: row.id,
          email: row.email,
          name: row.name,
          passwordHash: row.passwordHash,
          role: row.role,
        }
      : null;
  },
};

/* ----------------------------- Settings ----------------------------- */

const settingsRepo: SettingsRepo = {
  async get() {
    const rows = await client().siteSetting.findMany();
    const map = new Map(rows.map((r) => [r.key, r.value]));
    const fallback = demoSettings;
    const read = (key: string): string | null => map.get(key) ?? null;
    return {
      heroTagline: read("heroTagline") ?? fallback.heroTagline,
      announcement: read("announcement"),
      contactEmail: read("contactEmail") ?? fallback.contactEmail,
      instagramUrl: read("instagramUrl"),
      youtubeUrl: read("youtubeUrl"),
      tiktokUrl: read("tiktokUrl"),
      linkedinUrl: read("linkedinUrl"),
      facebookUrl: read("facebookUrl"),
      shopMode: (read("shopMode") as SiteSettings["shopMode"]) ?? "concept",
      shopUrl: read("shopUrl"),
    };
  },
  async set(settings) {
    const entries = Object.entries(settings) as [string, string | null][];
    await client().$transaction(
      entries.map(([key, value]) =>
        value === null
          ? client().siteSetting.deleteMany({ where: { key } })
          : client().siteSetting.upsert({
              where: { key },
              update: { value },
              create: { key, value },
            })
      )
    );
    return settingsRepo.get();
  },
};

/* ----------------------------- Page copy ----------------------------- */

const COPY_PREFIX = "copy:";

const copyRepo: CopyRepo = {
  async getAll() {
    const rows = await client().siteSetting.findMany({
      where: { key: { startsWith: COPY_PREFIX } },
    });
    const out: Record<string, string> = {};
    for (const r of rows) out[r.key.slice(COPY_PREFIX.length)] = r.value;
    return out;
  },
  async setMany(entries) {
    const ops = Object.entries(entries).map(([key, value]) =>
      value === ""
        ? client().siteSetting.deleteMany({ where: { key: COPY_PREFIX + key } })
        : client().siteSetting.upsert({
            where: { key: COPY_PREFIX + key },
            update: { value },
            create: { key: COPY_PREFIX + key, value },
          })
    );
    await client().$transaction(ops);
  },
};

export function createPrismaRepos(): Repos {
  return {
    events: eventsRepo,
    videos: videosRepo,
    releases: releasesRepo,
    libraryTracks: libraryTracksRepo,
    collaborations: collaborationsRepo,
    media: mediaRepo,
    faqs: faqsRepo,
    services: servicesRepo,
    products: productsRepo,
    users: usersRepo,
    settings: settingsRepo,
    copy: copyRepo,
    backend: "postgres",
  };
}
