import "server-only";
import { getRepos } from "@/server/repositories";
import { SERVICES } from "@/data/services";
import { getPageCopy } from "@/server/copy";
import type { ApprovedKnowledgeItem, KnowledgeType } from "./types";
import {
  collaborationToKnowledge,
  eventToKnowledge,
  faqToKnowledge,
  releaseToKnowledge,
  serviceToKnowledge,
  staticKnowledge,
  videoToKnowledge,
} from "./normalise-content";

/**
 * Knowledge-builder (AI-ready foundation brief §6).
 *
 * Reads the SAME repositories the public site renders from — Studio stays
 * the single source of truth (§3) — and normalizes them into the approved
 * corpus a future "Ask About Osman" assistant would draw on. Deliberately
 * NOT connected to any model, embedding or vector store (§1/§10): today
 * its only consumers are tests; later, an assistant endpoint imports
 * `getApprovedKnowledge()` and gains a ready, policy-filtered corpus.
 */

/** Every normalized item, all statuses — the unfiltered view (for review/tests). */
export async function getAllKnowledgeItems(): Promise<ApprovedKnowledgeItem[]> {
  const repos = getRepos();
  const [events, videos, releases, collaborations, faqs] = await Promise.all([
    repos.events.list(),
    repos.videos.list(),
    repos.releases.list(),
    repos.collaborations.list(),
    repos.faqs.list(),
  ]);

  // §44 (content governance): the knowledge layer reads the same Studio-
  // resolved service copy the pages render — one source of truth, no
  // second AI-specific copy of the services.
  const sv = await getPageCopy("services");
  const serviceCards = SERVICES.map((card, i) => {
    const slug = (["concerts", "piano", "production", "scores"] as const)[i];
    return {
      ...card,
      title: sv(`${slug}.title`),
      subtitle: sv(`${slug}.subtitle`),
      intro: sv(`${slug}.intro`),
    };
  });

  return [
    ...staticKnowledge(),
    ...serviceCards.map(serviceToKnowledge),
    // Rights-blocked releases never leave the repository layer in any form.
    ...releases
      .filter((r) => r.rightsStatus !== "DO_NOT_PUBLISH")
      .map(releaseToKnowledge),
    ...collaborations.map(collaborationToKnowledge),
    ...videos.map(videoToKnowledge),
    ...events.map(eventToKnowledge),
    ...faqs.map(faqToKnowledge),
  ];
}

/**
 * The approved corpus (§4): published AND ai-approved items only.
 * Drafts, archived records, rights-pending releases and demo fixtures can
 * never appear here.
 */
export async function getApprovedKnowledge(): Promise<ApprovedKnowledgeItem[]> {
  const items = await getAllKnowledgeItems();
  return items.filter((item) => item.status === "PUBLISHED" && item.aiApproved);
}

export async function getKnowledgeItem(id: string): Promise<ApprovedKnowledgeItem | null> {
  const items = await getApprovedKnowledge();
  return items.find((item) => item.id === id) ?? null;
}

export async function getKnowledgeByType(
  type: KnowledgeType
): Promise<ApprovedKnowledgeItem[]> {
  const items = await getApprovedKnowledge();
  return items.filter((item) => item.type === type);
}
