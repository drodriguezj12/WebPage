"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/icons";
import type { Clip, ClipSource } from "@/data/projects";

/**
 * A short, silent, looping product clip.
 *
 * - Nothing is downloaded until the clip is near the viewport, and it only
 *   plays while it is on screen.
 * - With reduced motion it never autoplays: the poster shows and the visitor
 *   can start it.
 * - The pause control is always there. Anything that moves on its own for
 *   more than five seconds needs a way to stop it.
 */
function ClipPlayer({
  src,
  poster,
  label,
  width,
  height,
  className,
}: ClipSource & { label: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Set once the visitor pauses by hand, so scrolling back does not restart it.
  const userPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!reduced && !userPaused.current) video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  return (
    <div className={`relative ${className}`}>
      <video
        ref={ref}
        className="block h-auto w-full"
        width={width}
        height={height}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause clip" : "Play clip"}
        className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white opacity-70 backdrop-blur-sm transition-[opacity,transform] duration-300 ease-fluid hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 md:bottom-4 md:right-4"
      >
        {playing ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

/**
 * Renders both cuts and lets CSS show one. The hidden one costs nothing: it has
 * `preload="none"` and, being `display: none`, never intersects the viewport,
 * so it is never asked to play or download.
 */
export function ClipVideo({ clip }: { clip: Clip }) {
  return (
    <>
      <ClipPlayer {...clip.tall} label={clip.label} className="md:hidden" />
      <ClipPlayer {...clip.wide} label={clip.label} className="hidden md:block" />
    </>
  );
}
