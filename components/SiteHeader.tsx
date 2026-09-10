"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

const SECTIONS = [
  { id: "home", index: "00", label: "Cover" },
  { id: "pulse", index: "01", label: "Pulse" },
  { id: "work", index: "02", label: "Work" },
  { id: "approach", index: "03", label: "Approach" },
  { id: "track", index: "04", label: "Track" },
  { id: "contact", index: "05", label: "Contact" },
];

/**
 * Collapses on scroll into a thin bar naming the section you are in, the way
 * airport signage tells you where you are rather than where you could go.
 */
export function SiteHeader() {
  const [active, setActive] = useState(SECTIONS[0]);
  const [collapsed, setCollapsed] = useState(false);
  // The first measurement must land instantly. Animating it would show every
  // visitor who reloads mid-page a header shrinking for no reason.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 120);
    onScroll();
    // Enable the transition one frame after the corrected height has painted.
    // Setting state from a frame callback also keeps it out of the effect body,
    // which this repo's react-hooks lint rules flag.
    const frame = requestAnimationFrame(() => setReady(true));
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const match = SECTIONS.find((section) => section.id === entry.target.id);
          if (match) setActive(match);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/85 backdrop-blur ${
        ready ? "transition-[height] duration-300" : ""
      } ${collapsed ? "h-12" : "h-20"}`}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-6">
        <Link href="#home" className="display text-lg tracking-normal focus-visible:text-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel">
          DR
        </Link>

        <p className="label hidden items-center gap-3 sm:flex">
          <span>{active.index}</span>
          <span aria-hidden="true" className="h-px w-6 bg-border" />
          <span className="text-steel">{active.label}</span>
        </p>

        <nav className="flex items-center gap-5">
          <a className="label hover:text-steel focus-visible:text-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="label hover:text-steel focus-visible:text-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className="label hover:text-steel focus-visible:text-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel" href="/cv.pdf" download>
            CV
          </a>
        </nav>
      </div>
    </header>
  );
}
