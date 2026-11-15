"use client";

import { useEffect, useRef, useState } from "react";
import { PlayIcon } from "@/components/icons";

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{11})/);
  return match ? match[1] : null;
}

/**
 * A poster until asked. The YouTube player (and its cookies and ~1 MB of
 * script) only loads when the visitor presses play.
 */
export function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  // A click's `detail` is 0 when the browser synthesised it from the keyboard.
  // Focus only needs moving into the player in that case.
  const [keyboardActivated, setKeyboardActivated] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoId = getYouTubeId(url);

  useEffect(() => {
    if (isPlaying && keyboardActivated) iframeRef.current?.focus();
  }, [isPlaying, keyboardActivated]);

  if (!videoId) return null;

  if (isPlaying) {
    return (
      <div className="relative aspect-video">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
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
      aria-label={`Play the ${title} demo video`}
      className="group relative block aspect-video w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover opacity-80 transition-[opacity,transform] duration-700 ease-fluid group-hover:scale-[1.02] group-hover:opacity-100"
      />
      <span className="absolute inset-0 grid place-items-center">
        <span className="flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 text-[0.9375rem] font-medium text-[#1d1d1f] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-fluid group-hover:scale-[1.04] group-active:scale-[0.97]">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1d1d1f] text-white">
            <PlayIcon className="h-3.5 w-3.5 translate-x-px" />
          </span>
          Watch the demo
        </span>
      </span>
    </button>
  );
}
