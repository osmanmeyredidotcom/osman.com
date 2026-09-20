"use client";

import { useState } from "react";
import { embedUrl, fallbackThumbnail } from "@/lib/embed";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { trackEvent } from "@/lib/analytics";

/**
 * Click-to-load video embed. No iframe (and no third-party request beyond the
 * static thumbnail) is made until the visitor chooses to play. Never autoplays
 * on page load.
 */
export function VideoEmbed({
  title,
  platform,
  videoUrl,
  thumbnailUrl = null,
  className = "",
}: {
  title: string;
  platform: "youtube" | "vimeo" | "file";
  videoUrl: string;
  thumbnailUrl?: string | null;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const isFile = platform === "file";
  const src = isFile ? videoUrl : embedUrl(platform, videoUrl);
  const thumb = isFile ? thumbnailUrl : (thumbnailUrl ?? fallbackThumbnail(platform, videoUrl));

  // If the URL can't be turned into an embed, fall back to a plain outbound link.
  if (!src) {
    return (
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener"
        className={`block ${className}`}
        onClick={() => trackEvent("video_play", { title })}
      >
        <PlaceholderImage label={`Video: ${title}`} ratio="16/9" />
        <span className="mt-2 inline-block text-sm underline underline-offset-4">
          Watch on {platform === "youtube" ? "YouTube" : "Vimeo"}
        </span>
      </a>
    );
  }

  if (playing) {
    return (
      <div
        className={`relative w-full bg-ink ${className}`}
        style={{ aspectRatio: "16/9", animation: "video-in 420ms var(--ease-out-cubic) both" }}
      >
        {isFile ? (
          /* Self-hosted file (Round 2): native player, loads only after the
             visitor presses play — same no-autoplay-on-page-load rule. */
          <video
            src={src ?? undefined}
            title={title}
            controls
            autoPlay
            playsInline
            preload="none"
            poster={thumb ?? undefined}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <iframe
            src={src ?? undefined}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("video_play", { title });
        setPlaying(true);
      }}
      aria-label={`Play ${title}`}
      data-cursor="PLAY"
      className={`video-figure group relative block w-full cursor-pointer text-left ${className}`}
    >
      <span className="media-zoom block">
        {thumb ? (
          // Remote thumbnails come from arbitrary video CDNs; next/image would need
          // per-host config, so a plain img with lazy loading is deliberate here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="w-full object-cover"
            style={{ aspectRatio: "16/9" }}
          />
        ) : (
          <PlaceholderImage label={`Video still: ${title}`} ratio="16/9" />
        )}
      </span>
      <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="play-button flex h-16 w-16 items-center justify-center rounded-none bg-ink/85 text-canvas group-hover:bg-accent">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M5 3.5v13l11-6.5-11-6.5z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
