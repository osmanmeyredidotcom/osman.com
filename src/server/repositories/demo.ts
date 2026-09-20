import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
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
} from "@/data/demo/content";
import type { CollectionRepo, CopyRepo, Repos, SettingsRepo, UserRepo } from "./types";

/**
 * Demo backend: used when DATABASE_URL is not configured.
 *
 * - Seeds from src/data/demo/content.ts.
 * - Keeps state in memory (survives HMR via globalThis).
 * - Best-effort persists mutations to .demo-data/store.json so portal edits
 *   survive dev-server restarts. Persistence failures are swallowed: on a
 *   read-only filesystem the app still works, just without cross-restart memory.
 */

interface DemoState {
  events: EventRecord[];
  videos: LiveVideoRecord[];
  releases: ReleaseRecord[];
  libraryTracks: LibraryTrackRecord[];
  collaborations: CollaborationRecord[];
  media: MediaItemRecord[];
  faqs: FaqRecord[];
  services: ServiceRecord[];
  products: ProductRecord[];
  settings: SiteSettings;
  /** Page copy overrides (content-governance pass), "<page>.<key>" → value. */
  copy: Record<string, string>;
  loaded: boolean;
}

const SNAPSHOT = path.join(process.cwd(), ".demo-data", "store.json");

const g = globalThis as typeof globalThis & { __osmanDemoState?: DemoState };

function seedState(): DemoState {
  return {
    events: structuredClone([...realEvents, ...demoEvents, ...agendaDemoEvents]),
    videos: structuredClone(demoVideos),
    releases: structuredClone(demoReleases),
    libraryTracks: structuredClone(demoLibraryTracks),
    collaborations: structuredClone(demoCollaborations),
    media: structuredClone(demoMedia),
    faqs: structuredClone(demoFaqs),
    services: structuredClone(demoServices),
    products: structuredClone(demoProducts),
    settings: structuredClone(demoSettings),
    copy: {},
    loaded: false,
  };
}

async function getState(): Promise<DemoState> {
  if (!g.__osmanDemoState) g.__osmanDemoState = seedState();
  const state = g.__osmanDemoState;
  if (!state.loaded) {
    state.loaded = true;
    try {
      const raw = await fs.readFile(SNAPSHOT, "utf8");
      const snap = JSON.parse(raw) as Partial<DemoState>;
      if (snap && Array.isArray(snap.events)) {
        Object.assign(state, snap, { loaded: true });
        // Older snapshots predate the copy store.
        if (!state.copy || typeof state.copy !== "object") state.copy = {};
      }
    } catch {
      // No snapshot yet (or unreadable) — seeded content is fine.
    }
  }
  return state;
}

async function persist(state: DemoState): Promise<void> {
  try {
    await fs.mkdir(path.dirname(SNAPSHOT), { recursive: true });
    const data: Record<string, unknown> = { ...state };
    delete data.loaded;
    await fs.writeFile(SNAPSHOT, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // Read-only filesystem (e.g. some serverless hosts): in-memory only.
  }
}

function makeCollection<T extends { id: string; slug: string }>(
  key:
    | "events"
    | "videos"
    | "releases"
    | "libraryTracks"
    | "collaborations"
    | "media"
    | "faqs"
    | "services"
    | "products"
): CollectionRepo<T> {
  const rows = async (): Promise<T[]> => {
    const state = await getState();
    return state[key] as unknown as T[];
  };
  return {
    async list() {
      return structuredClone(await rows());
    },
    async get(id) {
      const r = (await rows()).find((x) => x.id === id) ?? null;
      return r ? structuredClone(r) : null;
    },
    async getBySlug(slug) {
      const r = (await rows()).find((x) => x.slug === slug) ?? null;
      return r ? structuredClone(r) : null;
    },
    async create(data) {
      const state = await getState();
      const nowIso = new Date().toISOString();
      const record = {
        ...data,
        id: data.id ?? randomUUID(),
        createdAt: nowIso,
        updatedAt: nowIso,
      } as unknown as T;
      (state[key] as unknown as T[]).push(record);
      await persist(state);
      return structuredClone(record);
    },
    async update(id, patch) {
      const state = await getState();
      const list = state[key] as unknown as T[];
      const idx = list.findIndex((x) => x.id === id);
      if (idx === -1) throw new Error(`Not found: ${key}/${id}`);
      const updated = {
        ...list[idx],
        ...patch,
        id,
        updatedAt: new Date().toISOString(),
      } as T;
      list[idx] = updated;
      await persist(state);
      return structuredClone(updated);
    },
    async remove(id) {
      const state = await getState();
      const list = state[key] as unknown as T[];
      const idx = list.findIndex((x) => x.id === id);
      if (idx === -1) return;
      list.splice(idx, 1);
      await persist(state);
    },
  };
}

const demoUsers: UserRepo = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    // Demo mode has a single owner account configured via environment variables.
    // STUDIO_PASSWORD_HASH is a bcrypt hash — never a plain-text password.
    const adminEmail = process.env.STUDIO_EMAIL;
    // Next.js expands $VAR references inside .env values, which would shred a
    // bcrypt hash ("$2b$12$…"), so .env stores it with escaped dollars ("\$").
    // Bcrypt hashes never contain backslashes, so unescaping here is safe and
    // also keeps plain shell-exported values working.
    const hash = process.env.STUDIO_PASSWORD_HASH?.replace(/\\\$/g, "$");
    if (!adminEmail || !hash) return null;
    if (email.toLowerCase() !== adminEmail.toLowerCase()) return null;
    return {
      id: "demo-owner",
      email: adminEmail,
      name: "Osman Meyredi",
      passwordHash: hash,
      role: "OWNER",
    };
  },
};

const demoSettingsRepo: SettingsRepo = {
  async get() {
    const state = await getState();
    return structuredClone(state.settings);
  },
  async set(settings) {
    const state = await getState();
    state.settings = structuredClone(settings);
    await persist(state);
    return structuredClone(state.settings);
  },
};

const demoCopyRepo: CopyRepo = {
  async getAll() {
    const state = await getState();
    return { ...state.copy };
  },
  async setMany(entries) {
    const state = await getState();
    for (const [key, value] of Object.entries(entries)) {
      if (value === "") delete state.copy[key];
      else state.copy[key] = value;
    }
    await persist(state);
  },
};

export function createDemoRepos(): Repos {
  return {
    events: makeCollection<EventRecord>("events"),
    videos: makeCollection<LiveVideoRecord>("videos"),
    releases: makeCollection<ReleaseRecord>("releases"),
    libraryTracks: makeCollection<LibraryTrackRecord>("libraryTracks"),
    collaborations: makeCollection<CollaborationRecord>("collaborations"),
    media: makeCollection<MediaItemRecord>("media"),
    faqs: makeCollection<FaqRecord>("faqs"),
    services: makeCollection<ServiceRecord>("services"),
    products: makeCollection<ProductRecord>("products"),
    users: demoUsers,
    settings: demoSettingsRepo,
    copy: demoCopyRepo,
    backend: "demo",
  };
}
