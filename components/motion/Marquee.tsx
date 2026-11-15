"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/** Roughly how many items one copy of the row needs to span a wide screen. */
const MIN_ITEMS = 12;

/**
 * A row of words that drifts sideways and picks up speed from the scroll, in
 * the scroll's direction. Without motion (or JavaScript) it is a plain wrapped
 * list: the CSS in globals.css only turns it into a single moving line under
 * `html.motion`.
 *
 * The list is repeated so the line never runs out. Every repeat is hidden from
 * assistive technology; the items are announced once.
 */
export function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { animate } = useMotionAllowed();
  const repeats = Math.max(1, Math.ceil(MIN_ITEMS / items.length));

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner || !animate) return;

    const row = inner.firstElementChild as HTMLElement;
    const direction = reverse ? -1 : 1;
    let offset = 0;
    let lastScroll = window.scrollY;
    let visible = false;

    const tick = (_time: number, deltaTime: number) => {
      const scrolled = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (!visible) return;
      const span = row.offsetWidth;
      if (span === 0) return;
      offset += direction * (deltaTime * 0.03 + scrolled * 0.45);
      // Keep the offset inside one copy's width so the seam never shows.
      offset = ((offset % span) + span) % span;
      inner.style.transform = `translate3d(${-offset}px,0,0)`;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(root);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      observer.disconnect();
      inner.style.transform = "";
    };
  }, [animate, reverse]);

  const row = (copy: number) => (
    <ul className="marquee-row" aria-hidden={copy > 0 ? true : undefined}>
      {Array.from({ length: repeats }, (_, repeat) =>
        items.map((item) => (
          <li key={`${repeat}-${item}`} aria-hidden={copy === 0 && repeat > 0 ? true : undefined}>
            {item}
          </li>
        )),
      )}
    </ul>
  );

  return (
    <div ref={rootRef} className="marquee">
      <div ref={innerRef} className="marquee-inner">
        {row(0)}
        <div className="marquee-dup">{row(1)}</div>
      </div>
    </div>
  );
}
