import type {
  EventType,
  MediaType,
  RelationshipType,
  ReleaseType,
  RightsStatus,
  TicketingType,
  VerificationStatus,
} from "@/lib/types";

/** Human labels for enum values — the UI never shows raw enum names. */

export const eventTypeLabels: Record<EventType, string> = {
  TICKETED_CONCERT: "Concert",
  FREE_GIG: "Free gig",
  FESTIVAL: "Festival",
  PRIVATE_EVENT: "Private event",
  OTHER: "Other",
};

export const ticketingTypeLabels: Record<TicketingType, string> = {
  TICKETED: "Ticketed",
  FREE: "Free entry",
  INFO_ONLY: "Information only",
  NONE: "No public link",
};

export const relationshipTypeLabels: Record<RelationshipType, string> = {
  OWN_RELEASE: "Osman's own release",
  CONTRIBUTING_ARTIST: "Osman appears on this release",
  COLLABORATION_RELEASE: "Collaboration release",
};

// 4-11 feedback (N04-35): "band project" goes everywhere it appears; a
// collaboration is a Collaboration.
export const relationshipPublicLabels: Record<RelationshipType, string> = {
  OWN_RELEASE: "Own release",
  CONTRIBUTING_ARTIST: "Appears on",
  COLLABORATION_RELEASE: "Collaboration",
};

export const rightsStatusLabels: Record<RightsStatus, string> = {
  VERIFIED: "Rights confirmed",
  PENDING: "Rights not confirmed yet",
  DO_NOT_PUBLISH: "Do not publish",
};

export const verificationStatusLabels: Record<VerificationStatus, string> = {
  VERIFIED: "Verified",
  PENDING: "Pending verification",
  REJECTED: "Rejected",
};

export const releaseTypeLabels: Record<ReleaseType, string> = {
  SINGLE: "Single",
  EP: "EP",
  ALBUM: "Album",
  COLLABORATION: "Collaboration",
};

export const mediaTypeLabels: Record<MediaType, string> = {
  ARTICLE: "Article",
  INTERVIEW: "Interview",
  PODCAST: "Podcast",
  REVIEW: "Review",
  VIDEO: "Video",
};
