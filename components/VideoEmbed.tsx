"use client";

import { useState } from "react";

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{11})/);
  return match ? match[1] : null;
}

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(url);

  if (!videoId) return null;

  if (isPlaying) {
    return (
      <div className="relative mt-3 aspect-video overflow-hidden rounded-md border border-border">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={`${title} demo video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      aria-label={`Play ${title} demo video`}
      className="group relative mt-3 block aspect-video w-full overflow-hidden rounded-md border border-border"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-bg/40 transition-colors group-hover:bg-bg/20">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-bg">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
