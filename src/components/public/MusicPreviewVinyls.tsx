"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Music preview vinyl players — briefs 20-09-2026 (preview tracks + vinyl
 * animation pass).
 *
 * Each track is an editorial row with a small physical music object beside
 * it: a dark sleeve tile, the site's own vinyl (same .vinyl language as the
 * menu record and the shelf) emerging from it, and a tonearm that swings
 * onto the record when play is pressed. The record turns only while the
 * audio actually plays; pausing holds the groove angle and lifts the arm;
 * ending returns the arm home. Animation state is driven exclusively by
 * real playback state — never faked.
 *
 * Mechanics carried over from the approved LibraryPlayer: one shared
 * <audio> element (nothing loads until the first play, one track at a
 * time), a native range input for accessible seeking, timeupdate-driven
 * progress (no rAF loop). Research notes for the motion live with the CSS
 * in globals.css.
 */

export type PlayableTrack = {
  slug: string;
  title: string;
  genre: string | null;
  moods: string[];
  useCases: string[];
  durationSec: number | null;
  audioUrl: string | null;
  featured: boolean;
};

/** The site's label tones (same palette as the shelf and menu vinyl). */
const TONES = ["#46586b", "#a34b46", "#4d5c48", "#7d6a4f", "#3a3d41"];

function fmt(sec: number | null | undefined): string {
  if (sec == null || !Number.isFinite(sec) || sec <= 0) return "0:00";
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function PlayGlyph({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="3" y="2.5" width="3.4" height="11" fill="currentColor" />
      <rect x="9.6" y="2.5" width="3.4" height="11" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M4 2.4v11.2L13.2 8 4 2.4Z" fill="currentColor" />
    </svg>
  );
}

/** Tonearm: pivot bearing top-right, straight arm, angled headshell. */
function Tonearm() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="mpv-arm pointer-events-none absolute top-0 right-0 h-[84%] w-[84%]"
      aria-hidden="true"
    >
      {/* pivot bearing */}
      <circle cx="82" cy="18" r="7.5" fill="none" stroke="#8b8f94" strokeWidth="2.4" />
      <circle cx="82" cy="18" r="2.6" fill="#8b8f94" />
      {/* arm */}
      <line x1="78" y1="23" x2="42" y2="66" stroke="#8b8f94" strokeWidth="3" strokeLinecap="round" />
      {/* headshell */}
      <line x1="42" y1="66" x2="34" y2="72" stroke="#8b8f94" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function VinylObject({
  tone,
  state,
  title,
  genre,
}: {
  tone: string;
  state: "idle" | "playing" | "paused";
  title: string;
  genre: string | null;
}) {
  return (
    <div
      className="mpv-object relative h-[104px] w-[150px] shrink-0 select-none sm:h-[120px] sm:w-[178px]"
      data-state={state}
      aria-hidden="true"
    >
      {/* Sleeve tile — temporary typographic artwork system (brief §18) in
          the RecordSleeve placeholder language. */}
      <div
        className="absolute top-0 left-0 z-10 flex h-[104px] w-[104px] flex-col justify-between border border-line-dark p-2.5 sm:h-[120px] sm:w-[120px]"
        style={{
          background: `linear-gradient(150deg, #1b1d21 0%, #101114 55%, ${tone}30 100%)`,
          boxShadow: "5px 5px 0 0 rgb(0 0 0 / 0.14)",
        }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: tone, opacity: 0.9 }}
        />
        <span className="min-w-0">
          <span className="font-display block truncate text-[13px] leading-tight text-ink">
            {title}
          </span>
          {genre && (
            <span className="tabular mt-0.5 block truncate text-[8px] tracking-[0.14em] text-ink-faint uppercase">
              {genre}
            </span>
          )}
        </span>
      </div>
      {/* Vinyl emerging from the sleeve (the site's shelf motif). */}
      <div className="mpv-disc-wrap absolute top-1/2 right-[12px] aspect-square w-[94px] -translate-y-1/2 sm:w-[108px]">
        <div
          className="vinyl vinyl-dark mpv-disc h-full w-full"
          style={{ "--vinyl-label": tone } as React.CSSProperties}
        />
      </div>
      <Tonearm />
    </div>
  );
}

export function MusicPreviewVinyls({
  tracks,
  licenseLabel,
}: {
  tracks: PlayableTrack[];
  licenseLabel: string;
}) {
  const [current, setCurrent] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setPosition(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      // Arm returns home, record stops, progress resets (brief state §8).
      setPlaying(false);
      setEnded(true);
      setPosition(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.pause();
    };
  }, []);

  const toggle = (track: PlayableTrack) => {
    const audio = audioRef.current;
    if (!audio || !track.audioUrl) return;
    if (current === track.slug && !ended) {
      if (audio.paused) {
        void audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
      return;
    }
    // New track (or replay after end): the previous row falls back to idle.
    setCurrent(track.slug);
    setEnded(false);
    setPosition(0);
    setDuration(track.durationSec ?? 0);
    audio.src = track.audioUrl;
    void audio.play();
    setPlaying(true);
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setPosition(value);
  };

  return (
    <div>
      {/* One shared element behind every row — nothing preloads until the
          first play, and only one preview can sound at a time. */}
      <audio ref={audioRef} preload="none" />

      <ul className="border-b border-line">
        {tracks.map((track, i) => {
          const tone = TONES[i % TONES.length];
          const active = current === track.slug && !ended;
          const isPlaying = active && playing;
          const state: "idle" | "playing" | "paused" = !active
            ? "idle"
            : isPlaying
              ? "playing"
              : "paused";
          return (
            <li key={track.slug} className="border-t border-line">
              <div className="flex items-center gap-4 py-6 sm:gap-7">
                {track.audioUrl ? (
                  <button
                    type="button"
                    onClick={() => toggle(track)}
                    aria-label={`${isPlaying ? "Pause" : "Play"} ${track.title} preview`}
                    data-cursor={isPlaying ? "PAUSE" : "PLAY"}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      active
                        ? "border-accent-strong text-accent-strong"
                        : "border-line-dark text-ink hover:border-accent-strong hover:text-accent-strong"
                    }`}
                  >
                    <PlayGlyph playing={isPlaying} />
                  </button>
                ) : (
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink-faint"
                    title="Preview to come"
                  >
                    <PlayGlyph playing={false} />
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-display truncate text-xl leading-snug sm:text-2xl">
                    {track.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs tracking-[0.14em] text-ink-faint uppercase">
                    {[track.genre, track.moods.join(" · ")].filter(Boolean).join("  ·  ")}
                    {!track.audioUrl && "  ·  preview to come"}
                  </p>
                  <div className="mt-2.5 flex items-center gap-4">
                    <span className="tabular shrink-0 text-xs text-ink-soft">
                      {active && duration > 0
                        ? `${fmt(position)} / ${fmt(duration)}`
                        : fmt(track.durationSec)}
                    </span>
                    {active && duration > 0 ? (
                      <input
                        type="range"
                        min={0}
                        max={Math.max(1, Math.floor(duration))}
                        step={1}
                        value={Math.floor(position)}
                        onChange={(e) => seek(Number(e.currentTarget.value))}
                        aria-label={`Position in ${track.title} preview`}
                        className="track-seek max-w-64"
                      />
                    ) : (
                      <span className="h-px max-w-64 flex-1 bg-line" aria-hidden="true" />
                    )}
                    <Link
                      href="/contact?type=ORIGINAL_TRACKS"
                      className="u-link hidden shrink-0 text-sm hover:text-accent-strong md:inline"
                      data-cursor="LICENSE"
                      aria-label={`${licenseLabel}: ${track.title}`}
                    >
                      {licenseLabel} <span className="arrow-nudge" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>

                <VinylObject tone={tone} state={state} title={track.title} genre={track.genre} />
              </div>
              {/* Mobile licensing link keeps the CTA reachable everywhere. */}
              <div className="pb-5 md:hidden">
                <Link
                  href="/contact?type=ORIGINAL_TRACKS"
                  className="u-link text-sm hover:text-accent-strong"
                  aria-label={`${licenseLabel}: ${track.title}`}
                >
                  {licenseLabel} <span className="arrow-nudge" aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
