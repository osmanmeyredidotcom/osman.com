/**
 * Studio "Pages" save: an untouched multi-paragraph default must not turn
 * into a stored override just because the browser submits CRLF line breaks
 * (November N4 copy: Music Production body1/body2 hold blank-line paragraphs).
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`NEXT_REDIRECT_TEST:${path}`);
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

let cookieValue: string | undefined;
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === "osman_studio_session" && cookieValue ? { name, value: cookieValue } : undefined,
    set: vi.fn(),
    delete: vi.fn(),
  }),
  headers: async () => new Map(),
}));

process.env.AUTH_SECRET = "test-secret-test-secret-test-secret";

import { SignJWT } from "jose";
import { savePageCopyAction } from "@/server/actions/pageCopy";
import { copyPage } from "@/data/page-copy";

describe("Studio page copy save", () => {
  it("treats a CRLF re-submit of the default text as no override", async () => {
    cookieValue = await new SignJWT({ email: "osman@example.com", name: "Osman", role: "OWNER" })
      .setSubject("test-user")
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.AUTH_SECRET));

    const page = copyPage("service-music-production");
    expect(page).toBeTruthy();
    const fd = new FormData();
    fd.set("__page", "service-music-production");
    for (const f of page!.fields) fd.set(f.key, f.default.replace(/\n/g, "\r\n"));
    // one real edit, which must still be stored
    fd.set("ctaLabel", "Get In Touch now");

    const state = await savePageCopyAction({}, fd);
    expect(state.ok).toBe(true);

    const { getRepos } = await import("@/server/repositories");
    const stored = await getRepos().copy.getAll();
    expect(stored["service-music-production.body1"] ?? "").toBe("");
    expect(stored["service-music-production.body2"] ?? "").toBe("");
    expect(stored["service-music-production.ctaLabel"]).toBe("Get In Touch now");

    // restore the default for any later test in this process
    fd.set("ctaLabel", page!.fields.find((f) => f.key === "ctaLabel")!.default);
    await savePageCopyAction({}, fd);
  });
});
