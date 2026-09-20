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
  UserRecord,
} from "@/lib/types";

/**
 * Persistence boundary. The UI and server actions depend on these interfaces only;
 * implementations are `demo` (in-memory + optional JSON snapshot, used when
 * DATABASE_URL is absent) and `prisma` (PostgreSQL).
 */

export interface CollectionRepo<T extends { id: string; slug: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  getBySlug(slug: string): Promise<T | null>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt"> & Partial<Pick<T, "id">>): Promise<T>;
  update(id: string, patch: Partial<Omit<T, "id">>): Promise<T>;
  remove(id: string): Promise<void>;
}

export interface UserRepo {
  findByEmail(email: string): Promise<UserRecord | null>;
}

export interface SettingsRepo {
  get(): Promise<SiteSettings>;
  set(settings: SiteSettings): Promise<SiteSettings>;
}

/**
 * Page copy store (content-governance pass): flat key → value strings,
 * namespaced "<page>.<key>". Backed by SiteSetting rows ("copy:" prefix)
 * in Postgres and by the demo snapshot in demo mode. Pages merge these
 * over the registry defaults, so an absent key means "approved default".
 */
export interface CopyRepo {
  getAll(): Promise<Record<string, string>>;
  setMany(entries: Record<string, string>): Promise<void>;
}

export interface Repos {
  events: CollectionRepo<EventRecord>;
  videos: CollectionRepo<LiveVideoRecord>;
  releases: CollectionRepo<ReleaseRecord>;
  libraryTracks: CollectionRepo<LibraryTrackRecord>;
  collaborations: CollectionRepo<CollaborationRecord>;
  media: CollectionRepo<MediaItemRecord>;
  faqs: CollectionRepo<FaqRecord>;
  services: CollectionRepo<ServiceRecord>;
  products: CollectionRepo<ProductRecord>;
  users: UserRepo;
  settings: SettingsRepo;
  copy: CopyRepo;
  /** "demo" or "postgres" — surfaced in the Studio so Osman's team knows which mode is live. */
  backend: "demo" | "postgres";
}
