"use client";

import { useEffect, useRef, useState } from "react";

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{11})/);
  return match ? match[1] : null;
}

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  // A click event's `detail` is the mouse click count, which the browser
  // sets to 0 for a "click" it synthesizes from the keyboard (Enter/Space on
  // a button). That is the one signal available in a click handler to tell
  // the two activations apart without listening for keydown separately.
  const [keyboardActivated, setKeyboardActivated] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoId = getYouTubeId(url);

  // The play button unmounts the instant the iframe takes its place, so
  // without this, keyboard focus falls back to <body> and a keyboard user
  // loses their place on the page entirely. A mouse click already left focus
  // exactly where the visitor put it, so only move it — and only show the
  // ring the move needs — when the play was itself a keyboard activation.
  useEffect(() => {
    if (isPlaying && keyboardActivated) iframeRef.current?.focus();
  }, [isPlaying, keyboardActivated]);

  if (!videoId) return null;

  if (isPlaying) {
    return (
      <div
        className={`relative mt-3 aspect-video overflow-hidden border border-border ${
          keyboardActivated ? "focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-steel" : ""
        }`}
      >
        <iframe
          ref={iframeRef}
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
      onClick={(event) => {
        setKeyboardActivated(event.detail === 0);
        setIsPlaying(true);
      }}
      aria-label={`Play ${title} demo video`}
      className="group relative mt-3 block aspect-video w-full overflow-hidden border border-border focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-bg/40 transition-colors group-hover:bg-bg/20">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-steel text-bg">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
