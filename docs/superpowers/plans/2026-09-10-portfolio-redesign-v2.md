# Portfolio redesign v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as an editorial, cinematic single page — pale-steel palette, condensed display type, WebGL background and scroll-driven choreography — without touching the contact pipeline, SEO routes or existing tests.

**Architecture:** A layer of motion primitives (`components/motion/*`) that know nothing about the sections using them, driven by one set of timing tokens (`lib/motion.ts`) and one opt-out rule (`lib/useReducedMotion.ts`). Six rewritten sections consume those primitives. GSAP owns all animation; Lenis owns scrolling and feeds ScrollTrigger; OGL renders the background and is loaded only after first paint.

**Tech Stack:** Next.js 16.2.9 (App Router, Turbopack), React 19.2.4, TypeScript, Tailwind CSS 4, GSAP 3.15 + ScrollTrigger, Lenis 1.3, OGL 1.0, Vitest 4 (node environment).

**Spec:** `docs/superpowers/specs/2026-09-09-portfolio-redesign-v2-design.md`

## Global Constraints

- All code, comments, commit messages and site copy in **English**. Spec sections quoted below use the spec's exact values.
- Colour tokens, exact values: `bg #08080A`, `surface #0E0E11`, `border #1B1B20`, `text #F2F2F4`, `muted #86868F`, `dim #6F6F78`, `steel #CBD5E1`, `signal #F5A524`.
- `signal` has **exactly one** use on the whole page: the "available for work" dot. Never for links, hovers or anything else.
- Type: Big Shoulders 800 uppercase for display, Inter 400/500/600 for body, JetBrains Mono 400/500 for labels. All via `next/font`.
- Display sizes: 130px at `xl`, 96px at `lg`, 68px at `md`, 44px at base. Cover headline uses explicit per-breakpoint line breaks.
- Motion timings: 600–800ms section scale, 200–300ms interface feedback.
- `prefers-reduced-motion: reduce` disables shader, pin, scramble, wipe and count-up.
- `pointer: coarse` disables shader and magnetic cursor.
- Nothing hijacks scroll. No animation gates content. Text readable with JavaScript disabled.
- The shader canvas is `aria-hidden` and never focusable.
- Do **not** modify: `data/skills.ts`, `data/education.ts`, `components/ContactForm.tsx`, `app/api/contact/route.ts`, `lib/site.ts`, `lib/contactMessage.ts`, `lib/validateContactField.ts`, `app/robots.ts`, `app/sitemap.ts`, and the 13 existing tests must stay green.
- Vitest runs in the **node** environment. Only pure logic gets unit tests — no DOM/component tests. Animation is verified by eye.
- Every task ends with `npm run lint && npm test && npm run build` passing before its commit.
- Never add a `Co-Authored-By` trailer to commits.

## File structure

**Created**

| Path | Responsibility |
|---|---|
| `lib/motion.ts` | Durations, easings, GSAP defaults. No DOM. |
| `lib/useReducedMotion.ts` | The two opt-out conditions, one hook, one source of truth. |
| `lib/smoothScroll.ts` | Lenis instance wired to GSAP ticker and ScrollTrigger. |
| `lib/scramble.ts` | Pure character-scramble stepping. Unit tested. |
| `lib/countUp.ts` | Pure count-up stepping and value formatting. Unit tested. |
| `components/motion/SmoothScrollProvider.tsx` | Mounts Lenis for the app. |
| `components/motion/SplitText.tsx` | Line-by-line masked reveal. |
| `components/motion/ScrambleText.tsx` | Mono label settle. |
| `components/motion/Stagger.tsx` | Sequenced entry for a group of children. |
| `components/motion/CountUp.tsx` | Figures counting on entry. |
| `components/motion/MagneticCursor.tsx` | Magnetic cursor. |
| `components/motion/Pinned.tsx` | Pinned section with beats, keyboard-safe. |
| `components/motion/ShaderField.tsx` | OGL background, dynamically imported. |
| `components/sections/Cover.tsx` | 01 — headline plus numbered project index. |
| `components/sections/PulseFeature.tsx` | 02 — pinned three-beat Pulse sequence. |
| `components/sections/Work.tsx` | 03 — the other three projects. |
| `components/sections/HowIWork.tsx` | 04 — three claims with evidence. |
| `components/sections/Track.tsx` | 05 — education and stack band. |
| `components/sections/ContactSection.tsx` | 06 — restyled shell around the existing form. |
| `components/SectionHeader.tsx` | Shared number + label + heading block. |
| `app/not-found.tsx` | Designed 404. |
| `lib/scramble.test.ts`, `lib/countUp.test.ts`, `lib/motion.test.ts` | Unit tests for the pure logic above. |

**Modified**

| Path | Change |
|---|---|
| `app/globals.css` | New tokens, grid overlay, keyframes. Coral removed. |
| `app/layout.tsx` | New fonts, providers, cursor. |
| `app/page.tsx` | New section assembly. |
| `app/opengraph-image.tsx` | Rebuilt in the new system. |
| `app/icon.svg` | Monogram redrawn. |
| `data/projects.ts` | Adds optional `cover` and `discipline`. |
| `components/ProjectCard.tsx` | Restyled, GSAP hover, keeps `repoUrl`. |
| `components/VideoEmbed.tsx` | Restyled, keeps click-to-play. |
| `package.json` | `framer-motion` removed. |

**Deleted**

`components/Hero.tsx`, `About.tsx`, `Portfolio.tsx`, `Skills.tsx`, `Education.tsx`, `Nav.tsx`, `Footer.tsx`, `TechMarquee.tsx`, `CustomCursor.tsx`, `RevealOnScroll.tsx`, `Contact.tsx`.

> `Nav` and `Footer` are replaced by `components/SiteHeader.tsx` and `components/SiteFooter.tsx` in Task 8; `Contact.tsx` is replaced by `components/sections/ContactSection.tsx` in Task 12. `ContactForm.tsx` itself survives untouched.

---

## Task 1: Branch, tokens and type scale

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind utilities `bg-bg`, `bg-surface`, `border-border`, `text-text`, `text-muted`, `text-dim`, `text-steel`, `text-signal`; CSS variables `--font-display`, `--font-sans`, `--font-mono`; utility classes `.display`, `.label`, `.grid-overlay`.

- [ ] **Step 1: Create the branch**

```bash
cd "C:/Users/frapa/OneDrive/Desktop/Projects/portfolio"
git checkout -b redesign/v2
```

- [ ] **Step 2: Replace the design tokens**

Replace the whole `@theme { … }` block and the `.text-gradient-accent`, `@keyframes marquee`, `.animate-marquee`, `@keyframes breathe`, `.animate-breathe` rules in `app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-bg: #08080a;
  --color-surface: #0e0e11;
  --color-border: #1b1b20;
  --color-text: #f2f2f4;
  --color-muted: #86868f;
  --color-dim: #6f6f78;
  --color-steel: #cbd5e1;
  --color-signal: #f5a524;

  --font-display: var(--font-big-shoulders);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains);
}

html {
  /* Lenis drives scrolling; native smooth scrolling fights it. */
  scroll-behavior: auto;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}

/* Display type: condensed, uppercase, tight. Never used for body copy. */
.display {
  font-family: var(--font-display);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 0.88;
}

/* Mono label: small, wide, quiet. */
.label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-dim);
}

/* Technical-drawing cue. Decorative only. */
.grid-overlay {
  background-image:
    linear-gradient(to right, rgba(203, 213, 225, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(203, 213, 225, 0.04) 1px, transparent 1px);
  background-size: 96px 96px;
}

/* A line of a SplitText reveal sits behind this edge until animated. */
.split-line {
  display: block;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Swap the fonts in the layout**

In `app/layout.tsx`, replace the two font imports and their instances:

```tsx
import { Big_Shoulders, Inter, JetBrains_Mono } from "next/font/google";

const display = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});
const sans = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});
```

and the `<html>` class:

```tsx
<html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
```

- [ ] **Step 4: Verify the build compiles with the new tokens**

Run: `npm run build`
Expected: `✓ Compiled successfully`. The page still renders with old components; colours will look wrong because the old components reference `accent`. That is expected until Task 16 — **only** if the build fails on an unknown utility do you fix it here, by leaving the old class in place.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat(design): install the steel palette and the new type scale"
```

---

## Task 2: Motion tokens and the opt-out rule

**Files:**
- Create: `lib/motion.ts`
- Create: `lib/motion.test.ts`
- Create: `lib/useReducedMotion.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `DURATION: { feedback: 0.24; element: 0.6; section: 0.8 }` (seconds)
  - `EASE: { out: string; inOut: string }` — GSAP easing strings
  - `stagger(count: number, total?: number): number`
  - `useMotionAllowed(): { animate: boolean; heavy: boolean }` — `animate` false under reduced motion, `heavy` false under reduced motion **or** coarse pointer.

- [ ] **Step 1: Write the failing test**

Create `lib/motion.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { DURATION, EASE, stagger } from "./motion";

describe("motion tokens", () => {
  it("keeps section movement inside the 600-800ms band the spec fixes", () => {
    expect(DURATION.section).toBeGreaterThanOrEqual(0.6);
    expect(DURATION.section).toBeLessThanOrEqual(0.8);
  });

  it("keeps interface feedback inside the 200-300ms band", () => {
    expect(DURATION.feedback).toBeGreaterThanOrEqual(0.2);
    expect(DURATION.feedback).toBeLessThanOrEqual(0.3);
  });

  it("exposes GSAP easing strings, not cubic-bezier CSS", () => {
    expect(EASE.out).toMatch(/^[a-z]/);
  });

  it("spreads a group over the given total, regardless of count", () => {
    expect(stagger(4, 0.4)).toBeCloseTo(0.1);
    expect(stagger(8, 0.4)).toBeCloseTo(0.05);
  });

  it("never returns a negative or infinite step", () => {
    expect(stagger(0)).toBe(0);
    expect(stagger(1)).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run lib/motion.test.ts`
Expected: FAIL — `Failed to resolve import "./motion"`.

- [ ] **Step 3: Write the tokens**

Create `lib/motion.ts`:

```ts
/**
 * Every duration and curve on the site comes from here. One hand moves
 * everything, so nothing drifts out of rhythm as sections are added.
 * Values are in seconds because GSAP takes seconds.
 */
export const DURATION = {
  /** Interface feedback: hover, press, focus. */
  feedback: 0.24,
  /** A single element entering or leaving. */
  element: 0.6,
  /** Section-scale movement: wipes, pinned beats. */
  section: 0.8,
} as const;

export const EASE = {
  /** Slow exit. The curve that makes movement read as deliberate. */
  out: "power3.out",
  inOut: "power2.inOut",
} as const;

/**
 * Step between siblings so a group of any size finishes in `total` seconds.
 * A fixed per-item delay would make a twelve-item grid crawl.
 */
export function stagger(count: number, total = 0.4): number {
  if (count <= 0) return 0;
  if (count === 1) return total;
  return total / count;
}
```

- [ ] **Step 4: Run the test again**

Run: `npx vitest run lib/motion.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Write the opt-out hook**

Create `lib/useReducedMotion.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export type MotionAllowance = {
  /** False when the visitor asked for reduced motion. */
  animate: boolean;
  /** Also false on touch devices: the shader and the cursor cost battery. */
  heavy: boolean;
};

const REDUCED = "(prefers-reduced-motion: reduce)";
const COARSE = "(pointer: coarse)";

/**
 * The single place the two opt-out conditions are read. Components ask this
 * hook rather than matching media queries themselves, so the rule cannot drift
 * apart across the codebase.
 *
 * Starts pessimistic — no animation until the client has measured — so the
 * server render and the first paint never show motion that must then be undone.
 */
export function useMotionAllowed(): MotionAllowance {
  const [allowance, setAllowance] = useState<MotionAllowance>({
    animate: false,
    heavy: false,
  });

  useEffect(() => {
    const reduced = window.matchMedia(REDUCED);
    const coarse = window.matchMedia(COARSE);

    const read = () =>
      setAllowance({
        animate: !reduced.matches,
        heavy: !reduced.matches && !coarse.matches,
      });

    read();
    reduced.addEventListener("change", read);
    coarse.addEventListener("change", read);
    return () => {
      reduced.removeEventListener("change", read);
      coarse.removeEventListener("change", read);
    };
  }, []);

  return allowance;
}
```

- [ ] **Step 6: Run the full suite and the build**

Run: `npm run lint && npm test && npm run build`
Expected: lint clean, 18 tests passing (13 existing + 5 new), build succeeds.

- [ ] **Step 7: Commit**

```bash
git add lib/motion.ts lib/motion.test.ts lib/useReducedMotion.ts
git commit -m "feat(motion): centralise timing tokens and the reduced-motion rule"
```

---

## Task 3: Smooth scroll

**Files:**
- Create: `lib/smoothScroll.ts`
- Create: `components/motion/SmoothScrollProvider.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `useMotionAllowed` from Task 2.
- Produces: `startSmoothScroll(): () => void` — starts Lenis wired to GSAP and returns a teardown. `<SmoothScrollProvider />` — mounts it for the app, renders nothing.

- [ ] **Step 1: Write the Lenis wiring**

Create `lib/smoothScroll.ts`:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Lenis and ScrollTrigger both want to own the frame loop. Left alone they
 * drift apart and pinned sections lag behind the page by a frame or two, which
 * reads as jitter. Driving Lenis from GSAP's ticker keeps one clock.
 *
 * Returns a teardown; call it on unmount.
 */
export function startSmoothScroll(): () => void {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.05,
    // Long, slow exit. Matches the easing of everything else on the page.
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  // GSAP's lag smoothing skips frames to catch up, which desynchronises Lenis.
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.destroy();
  };
}
```

- [ ] **Step 2: Write the provider**

Create `components/motion/SmoothScrollProvider.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * Renders nothing. Smooth scrolling is motion: a visitor who asked for reduced
 * motion gets the browser's own scrolling, untouched.
 */
export function SmoothScrollProvider() {
  const { animate } = useMotionAllowed();

  useEffect(() => {
    if (!animate) return;
    let teardown: (() => void) | undefined;
    let cancelled = false;

    import("@/lib/smoothScroll").then(({ startSmoothScroll }) => {
      if (!cancelled) teardown = startSmoothScroll();
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [animate]);

  return null;
}
```

- [ ] **Step 3: Mount it**

In `app/layout.tsx`, replace `<ScrollProgress />` and `<CustomCursor />` in the body with:

```tsx
<SmoothScrollProvider />
```

and add the import:

```tsx
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
```

Leave `components/ScrollProgress.tsx` and `components/CustomCursor.tsx` on disk; they are deleted in Task 16.

- [ ] **Step 4: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all green. Then `npm run dev` and confirm in a browser that scrolling feels smoothed and that the page still scrolls to the bottom. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add lib/smoothScroll.ts components/motion/SmoothScrollProvider.tsx app/layout.tsx
git commit -m "feat(motion): drive Lenis and ScrollTrigger from one clock"
```

---

## Task 4: Scramble text

**Files:**
- Create: `lib/scramble.ts`
- Create: `lib/scramble.test.ts`
- Create: `components/motion/ScrambleText.tsx`

**Interfaces:**
- Consumes: `DURATION`, `EASE`, `useMotionAllowed`.
- Produces: `scrambleFrame(target: string, progress: number, pick?: (i: number) => string): string`; `<ScrambleText text={string} className?={string} />`.

- [ ] **Step 1: Write the failing test**

Create `lib/scramble.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { scrambleFrame } from "./scramble";

// A fixed substitute so the output is deterministic in tests.
const fixed = () => "#";

describe("scrambleFrame", () => {
  it("returns the finished string at full progress", () => {
    expect(scrambleFrame("REAL-TIME", 1, fixed)).toBe("REAL-TIME");
  });

  it("returns no settled characters at zero progress", () => {
    expect(scrambleFrame("ABC", 0, fixed)).toBe("###");
  });

  it("settles characters left to right", () => {
    expect(scrambleFrame("ABCD", 0.5, fixed)).toBe("AB##");
  });

  it("keeps the length identical at every step, so nothing reflows", () => {
    for (const p of [0, 0.13, 0.5, 0.77, 1]) {
      expect(scrambleFrame("BOGOTA, CO", p, fixed)).toHaveLength(10);
    }
  });

  it("never scrambles spaces, which would make the label jump", () => {
    expect(scrambleFrame("A B", 0, fixed)).toBe("# #");
  });

  it("clamps progress outside 0..1", () => {
    expect(scrambleFrame("AB", -1, fixed)).toBe("##");
    expect(scrambleFrame("AB", 9, fixed)).toBe("AB");
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run lib/scramble.test.ts`
Expected: FAIL — `Failed to resolve import "./scramble"`.

- [ ] **Step 3: Write the implementation**

Create `lib/scramble.ts`:

```ts
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-_";

/**
 * One frame of a left-to-right settle: the first `progress` share of the
 * characters have arrived, the rest are still noise.
 *
 * The substitute character is injected so the function stays pure and the
 * tests stay deterministic; in the browser it is random.
 */
export function scrambleFrame(
  target: string,
  progress: number,
  pick: (index: number) => string = () =>
    GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
): string {
  const clamped = Math.min(1, Math.max(0, progress));
  const settled = Math.round(target.length * clamped);

  let out = "";
  for (let i = 0; i < target.length; i += 1) {
    // A scrambled space would make the label visibly jitter in width.
    if (i < settled || target[i] === " ") {
      out += target[i];
    } else {
      out += pick(i);
    }
  }
  return out;
}
```

- [ ] **Step 4: Run the test again**

Run: `npx vitest run lib/scramble.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Write the component**

Create `components/motion/ScrambleText.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrambleFrame } from "@/lib/scramble";
import { DURATION, EASE } from "@/lib/motion";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * A mono label that settles into place. The finished text is rendered on the
 * server, so with JavaScript off — or reduced motion on — the label is simply
 * there.
 */
export function ScrambleText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    gsap.registerPlugin(ScrollTrigger);
    const state = { progress: 0 };

    const ctx = gsap.context(() => {
      gsap.to(state, {
        progress: 1,
        duration: DURATION.element,
        ease: EASE.out,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = scrambleFrame(text, state.progress);
        },
        onComplete: () => {
          el.textContent = text;
        },
      });
    }, el);

    return () => {
      ctx.revert();
      el.textContent = text;
    };
  }, [text, animate]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
```

- [ ] **Step 6: Verify**

Run: `npm run lint && npm test`
Expected: lint clean, 24 tests passing.

- [ ] **Step 7: Commit**

```bash
git add lib/scramble.ts lib/scramble.test.ts components/motion/ScrambleText.tsx
git commit -m "feat(motion): settle mono labels with a left-to-right scramble"
```

---

## Task 5: Line-by-line reveal

**Files:**
- Create: `components/motion/SplitText.tsx`

**Interfaces:**
- Consumes: `DURATION`, `EASE`, `stagger`, `useMotionAllowed`.
- Produces: `<SplitText lines={ReactNode[]} as?={"h1" | "h2" | "p"} className?={string} delay?={number} />`.

Lines are passed in explicitly rather than measured. The spec fixes per-breakpoint line breaks for the cover headline, and measuring wrapped lines at runtime is fragile with condensed type and a web font that may still be loading.

- [ ] **Step 1: Write the component**

Create `components/motion/SplitText.tsx`:

```tsx
"use client";

import { createElement, useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, stagger } from "@/lib/motion";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * Each line sits inside a clipping wrapper and starts below it, so the text
 * rises from behind an invisible edge instead of fading in. The mask is what
 * separates this from a generic reveal.
 */
export function SplitText({
  lines,
  as = "h2",
  className = "",
  delay = 0,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "p";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const inner = el.querySelectorAll<HTMLElement>("[data-line-inner]");
      gsap.set(inner, { yPercent: 110 });
      gsap.to(inner, {
        yPercent: 0,
        duration: DURATION.section,
        ease: EASE.out,
        delay,
        stagger: stagger(inner.length, 0.35),
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [animate, delay]);

  return createElement(
    as,
    { ref, className },
    lines.map((line, index) => (
      <span className="split-line" key={index}>
        <span data-line-inner style={{ display: "block" }}>
          {line}
        </span>
      </span>
    )),
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint && npm run build`
Expected: both clean. `gsap.context` reverts inline styles on unmount, so nothing is left behind.

- [ ] **Step 3: Commit**

```bash
git add components/motion/SplitText.tsx
git commit -m "feat(motion): reveal headlines line by line behind a mask"
```

---

## Task 6: Counting figures and sequenced groups

**Files:**
- Create: `lib/countUp.ts`
- Create: `lib/countUp.test.ts`
- Create: `components/motion/CountUp.tsx`
- Create: `components/motion/Stagger.tsx`

**Interfaces:**
- Consumes: `DURATION`, `EASE`, `stagger`, `useMotionAllowed`.
- Produces: `parseFigure(raw: string): { value: number; prefix: string; suffix: string }`; `formatFigure(value: number, parsed: ParsedFigure): string`; `<CountUp figure={string} className?={string} />`; `<Stagger className?={string} total?={number}>{children}</Stagger>`.

- [ ] **Step 1: Write the failing test**

Create `lib/countUp.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatFigure, parseFigure } from "./countUp";

describe("parseFigure", () => {
  it("reads a bare number", () => {
    expect(parseFigure("95")).toEqual({ value: 95, prefix: "", suffix: "" });
  });

  it("keeps a trailing plus as a suffix", () => {
    expect(parseFigure("3+")).toEqual({ value: 3, prefix: "", suffix: "+" });
  });

  it("keeps a percent sign as a suffix", () => {
    expect(parseFigure("30%")).toEqual({ value: 30, prefix: "", suffix: "%" });
  });

  it("keeps a leading symbol as a prefix", () => {
    expect(parseFigure("~40")).toEqual({ value: 40, prefix: "~", suffix: "" });
  });

  it("treats a leading letter as a prefix so B2 still animates its digit", () => {
    expect(parseFigure("B2")).toEqual({ value: 2, prefix: "B", suffix: "" });
  });
});

describe("formatFigure", () => {
  it("rounds and reattaches the affixes", () => {
    const parsed = parseFigure("30%");
    expect(formatFigure(12.6, parsed)).toBe("13%");
  });

  it("never renders a negative intermediate value", () => {
    const parsed = parseFigure("95");
    expect(formatFigure(-4, parsed)).toBe("0");
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run lib/countUp.test.ts`
Expected: FAIL — `Failed to resolve import "./countUp"`.

- [ ] **Step 3: Write the implementation**

Create `lib/countUp.ts`:

```ts
export type ParsedFigure = {
  value: number;
  prefix: string;
  suffix: string;
};

/**
 * Figures on the site are written the way they should read — "3+", "30%",
 * "95" — not as numbers with formatting options. This splits one into the part
 * that animates and the parts that stay put.
 */
export function parseFigure(raw: string): ParsedFigure {
  const match = raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { value: 0, prefix: raw, suffix: "" };
  const [, prefix, digits, suffix] = match;
  return { value: Number(digits), prefix, suffix };
}

export function formatFigure(current: number, parsed: ParsedFigure): string {
  const safe = Math.max(0, Math.round(current));
  return `${parsed.prefix}${safe}${parsed.suffix}`;
}
```

- [ ] **Step 4: Run the test again**

Run: `npx vitest run lib/countUp.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Write the CountUp component**

Create `components/motion/CountUp.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatFigure, parseFigure } from "@/lib/countUp";
import { DURATION, EASE } from "@/lib/motion";
import { useMotionAllowed } from "@/lib/useReducedMotion";

export function CountUp({
  figure,
  className = "",
}: {
  figure: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    gsap.registerPlugin(ScrollTrigger);
    const parsed = parseFigure(figure);
    const state = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(state, {
        value: parsed.value,
        duration: DURATION.section,
        ease: EASE.out,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = formatFigure(state.value, parsed);
        },
        onComplete: () => {
          el.textContent = figure;
        },
      });
    }, el);

    return () => {
      ctx.revert();
      el.textContent = figure;
    };
  }, [figure, animate]);

  // The final value is the server-rendered content: no JavaScript, no problem.
  return (
    <span ref={ref} className={className}>
      {figure}
    </span>
  );
}
```

- [ ] **Step 6: Write the Stagger component**

Create `components/motion/Stagger.tsx`:

```tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, stagger } from "@/lib/motion";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * Sequenced entry for a group. Animates its direct children, so the caller
 * controls the grouping by markup rather than by prop.
 */
export function Stagger({
  children,
  className = "",
  total = 0.4,
}: {
  children: ReactNode;
  className?: string;
  total?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = Array.from(el.children) as HTMLElement[];
      gsap.set(items, { opacity: 0, y: 24 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: DURATION.element,
        ease: EASE.out,
        stagger: stagger(items.length, total),
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [animate, total]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

- [ ] **Step 7: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: lint clean, 31 tests passing, build succeeds.

- [ ] **Step 8: Commit**

```bash
git add lib/countUp.ts lib/countUp.test.ts components/motion/CountUp.tsx components/motion/Stagger.tsx
git commit -m "feat(motion): count figures on entry and sequence groups"
```

---

## Task 7: Magnetic cursor

**Files:**
- Create: `components/motion/MagneticCursor.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `useMotionAllowed`.
- Produces: `<MagneticCursor />` — renders a fixed, `aria-hidden` element; nothing else consumes it.

- [ ] **Step 1: Write the component**

Create `components/motion/MagneticCursor.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionAllowed } from "@/lib/useReducedMotion";

const INTERACTIVE = "a, button, [data-cursor]";

/**
 * A ring that follows the pointer and is pulled toward interactive elements.
 * It never replaces the real focus ring, and it never appears on touch.
 */
export function MagneticCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const { heavy } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !heavy) return;

    // quickTo keeps one tween alive instead of creating one per pointer event.
    const moveX = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    document.body.style.cursor = "none";

    function onMove(event: PointerEvent) {
      const target = (event.target as HTMLElement).closest<HTMLElement>(INTERACTIVE);

      if (target) {
        // Pull toward the element's centre rather than sitting on the pointer.
        const box = target.getBoundingClientRect();
        moveX(box.left + box.width / 2);
        moveY(box.top + box.height / 2);
        gsap.to(el, { scale: 2.4, opacity: 0.55, duration: 0.24, ease: "power3.out" });
      } else {
        moveX(event.clientX);
        moveY(event.clientY);
        gsap.to(el, { scale: 1, opacity: 1, duration: 0.24, ease: "power3.out" });
      }
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.body.style.cursor = "";
      gsap.killTweensOf(el);
    };
  }, [heavy]);

  if (!heavy) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-steel mix-blend-difference"
    />
  );
}
```

- [ ] **Step 2: Mount it**

In `app/layout.tsx`, add below `<SmoothScrollProvider />`:

```tsx
<MagneticCursor />
```

with the import:

```tsx
import { MagneticCursor } from "@/components/motion/MagneticCursor";
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all green. Then `npm run dev`, confirm the ring follows the pointer and swells over links, and confirm the native cursor returns when you toggle "Emulate CSS prefers-reduced-motion: reduce" in DevTools. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add components/motion/MagneticCursor.tsx app/layout.tsx
git commit -m "feat(motion): replace the custom cursor with a magnetic one"
```

---

## Task 8: WebGL background

**Files:**
- Create: `components/motion/ShaderField.tsx`
- Create: `components/motion/ShaderFieldMount.tsx`

**Interfaces:**
- Consumes: `useMotionAllowed`.
- Produces: `<ShaderFieldMount className?={string} />` — the only thing sections import. It dynamically imports `ShaderField`, which owns the OGL renderer and is the module's default export.

- [ ] **Step 1: Write the renderer**

Create `components/motion/ShaderField.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

const VERTEX = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Slow drifting bands, warped near the pointer. Cheap: no loops, no textures.
const FRAGMENT = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uResolution;

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 uv = vec2(vUv.x * aspect, vUv.y);
    vec2 pointer = vec2(uPointer.x * aspect, uPointer.y);

    float distance = length(uv - pointer);
    float warp = 0.06 / (distance + 0.35);

    float band = sin((uv.x + uv.y) * 6.0 - uTime * 0.15 + warp * 6.0);
    float line = smoothstep(0.985, 1.0, band);

    // Steel, at the edge of visible. The background must never fight the type.
    vec3 colour = vec3(0.796, 0.835, 0.882) * line;
    gl_FragColor = vec4(colour, line * 0.16);
  }
`;

export default function ShaderField({ className = "" }: { className?: string }) {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = holder.current;
    if (!mount) return;

    const renderer = new Renderer({
      alpha: true,
      antialias: false,
      // A retina pixel ratio quadruples the fragment work for a background
      // nobody is looking at directly.
      dpr: Math.min(window.devicePixelRatio, 1.5),
    });
    const gl = renderer.gl;
    gl.canvas.setAttribute("aria-hidden", "true");
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    mount.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: [0.5, 0.5] },
        uResolution: { value: [1, 1] },
      },
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    function resize() {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      program.uniforms.uResolution.value = [mount.clientWidth, mount.clientHeight];
    }
    resize();
    window.addEventListener("resize", resize);

    function onPointer(event: PointerEvent) {
      program.uniforms.uPointer.value = [
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight,
      ];
    }
    window.addEventListener("pointermove", onPointer);

    // Three independent reasons to stop drawing: off-screen, hidden tab, or
    // simply between frames at the 30fps cap.
    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(mount);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    let frame = 0;
    let last = 0;
    const MIN_STEP = 1000 / 30;

    function loop(now: number) {
      frame = requestAnimationFrame(loop);
      if (!visible || now - last < MIN_STEP) return;
      last = now;
      program.uniforms.uTime.value = now * 0.001;
      renderer.render({ scene: mesh });
    }
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={holder} className={className} aria-hidden="true" />;
}
```

- [ ] **Step 2: Write the mount**

Create `components/motion/ShaderFieldMount.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMotionAllowed } from "@/lib/useReducedMotion";

const ShaderField = dynamic(() => import("./ShaderField"), { ssr: false });

/**
 * Keeps OGL off the critical path. The shader is requested only after the
 * first paint has happened, and never at all on touch or reduced motion, so
 * the headline never waits on a background.
 */
export function ShaderFieldMount({ className = "" }: { className?: string }) {
  const { heavy } = useMotionAllowed();
  const [afterPaint, setAfterPaint] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => setAfterPaint(true)),
    );
    return () => window.cancelAnimationFrame(id);
  }, []);

  if (!heavy || !afterPaint) return null;
  return <ShaderField className={className} />;
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all green, and the build output shows a **separate chunk** for the shader — proof it is not in the main bundle.

- [ ] **Step 4: Commit**

```bash
git add components/motion/ShaderField.tsx components/motion/ShaderFieldMount.tsx
git commit -m "feat(motion): add the WebGL field, loaded after first paint"
```

---

## Task 9: Project data and the shared section header

**Files:**
- Modify: `data/projects.ts`
- Create: `components/SectionHeader.tsx`

**Interfaces:**
- Consumes: `ScrambleText`, `SplitText`.
- Produces: `Project` gains `shortName?: string`, `discipline?: string` and `cover?: string`; every project gets both `shortName` and `discipline`. `<SectionHeader index={string} label={string} lines={ReactNode[]} />`.

- [ ] **Step 1: Add the two optional fields**

In `data/projects.ts`, extend the type:

```ts
export type Project = {
  title: string;
  tag: string;
  description: string;
  achievements: string[];
  tech: string[];
  demoUrl?: string;
  repoUrl?: string;
  /** Name for the cover index, where the full title does not fit. */
  shortName?: string;
  /** One word for the cover index. Uppercase, no punctuation. */
  discipline?: string;
  /** Path under /public for the card image. */
  cover?: string;
};
```

- [ ] **Step 2: Fill in the disciplines**

Add to each entry, in order:

```ts
// Pulse
shortName: "Pulse", discipline: "REAL-TIME",
// Smart Parking Management Platform
shortName: "SmartPark", discipline: "EVENT-DRIVEN",
// E-commerce Platform with AI Chatbot Integration
shortName: "Commerce", discipline: "AI CHATBOT",
// Contract Data Processing System
shortName: "Contracts", discipline: "PRODUCTION",
```

- [ ] **Step 3: Write the shared header**

Create `components/SectionHeader.tsx`:

```tsx
import type { ReactNode } from "react";
import { ScrambleText } from "./motion/ScrambleText";
import { SplitText } from "./motion/SplitText";

/**
 * Every section opens the same way: a number, a label, a rule, a headline.
 * Repeating the shape is what makes the page read as one document rather than
 * six pages stacked.
 */
export function SectionHeader({
  index,
  label,
  lines,
}: {
  index: string;
  label: string;
  lines: ReactNode[];
}) {
  return (
    <header className="mb-16">
      <p className="label mb-6 flex items-center gap-4">
        <span className="text-dim">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-border" />
        <ScrambleText text={label} />
      </p>
      <SplitText
        as="h2"
        lines={lines}
        className="display text-[44px] md:text-[68px] lg:text-[96px]"
      />
    </header>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all green, 31 tests.

- [ ] **Step 5: Commit**

```bash
git add data/projects.ts components/SectionHeader.tsx
git commit -m "feat(content): give projects a discipline and sections one header"
```

---

## Task 10: Cover

**Files:**
- Create: `components/sections/Cover.tsx`

**Interfaces:**
- Consumes: `ShaderFieldMount`, `SplitText`, `ScrambleText`, `CountUp`, `Stagger`, `projects`.
- Produces: `<Cover />`, rendering `<section id="home">`.

- [ ] **Step 1: Write the section**

Create `components/sections/Cover.tsx`:

```tsx
import Link from "next/link";
import { projects } from "@/data/projects";
import { CountUp } from "@/components/motion/CountUp";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { ShaderFieldMount } from "@/components/motion/ShaderFieldMount";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger } from "@/components/motion/Stagger";

const FIGURES = [
  { figure: "3+", label: "Years shipping" },
  { figure: "30%", label: "Faster queries" },
  { figure: "95", label: "Tests on Pulse" },
];

export function Cover() {
  return (
    <section id="home" className="relative min-h-svh overflow-hidden pt-28 pb-16">
      <ShaderFieldMount className="pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="label">
            <ScrambleText text="DANIEL RODRIGUEZ — BOGOTA, CO" />
          </p>
          <p className="label flex items-center gap-2">
            {/* The single use of `signal` on the page. */}
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
            Available for work
          </p>
        </div>

        <SplitText
          as="h1"
          className="display text-[44px] md:text-[68px] lg:text-[96px] xl:text-[130px]"
          lines={[
            "Systems that",
            "hold up in",
            <span key="production" className="text-steel">
              production
            </span>,
          ]}
        />

        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[46ch] text-base leading-relaxed text-muted">
            Backend-leaning full-stack developer. Java, Spring Boot and PostgreSQL —
            three years building and optimising applications that run for real.
          </p>

          <Stagger className="flex gap-10">
            {FIGURES.map((item) => (
              <div key={item.label}>
                <CountUp figure={item.figure} className="display block text-[40px] text-steel" />
                <span className="label mt-2 block">{item.label}</span>
              </div>
            ))}
          </Stagger>
        </div>

        <Stagger className="grid gap-px border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <Link
              key={project.title}
              href="#work"
              className="group border-b border-border bg-bg py-6 pr-6 transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
            >
              <span className="label block">{String(index + 1).padStart(2, "0")}</span>
              <span className="display mt-3 block text-[26px] group-hover:text-steel">
                {project.shortName ?? project.title}
              </span>
              <span className="label mt-2 block">{project.discipline}</span>
            </Link>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint && npm run build`
Expected: both clean. The section is not on the page yet — it is wired up in Task 16.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Cover.tsx
git commit -m "feat(cover): open with the headline and the work already visible"
```

---

## Task 11: Header and footer

**Files:**
- Create: `components/SiteHeader.tsx`
- Create: `components/SiteFooter.tsx`

**Interfaces:**
- Consumes: `GITHUB_URL`, `LINKEDIN_URL` from `lib/site.ts`; `useMotionAllowed`.
- Produces: `<SiteHeader />`, `<SiteFooter />`.

- [ ] **Step 1: Write the header**

Create `components/SiteHeader.tsx`:

```tsx
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

  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 120);
    onScroll();
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
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/85 backdrop-blur transition-[height] duration-300 ${
        collapsed ? "h-12" : "h-20"
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-6">
        <Link href="#home" className="display text-lg tracking-normal">
          DR
        </Link>

        <p className="label flex items-center gap-3" aria-live="polite">
          <span>{active.index}</span>
          <span aria-hidden="true" className="h-px w-6 bg-border" />
          <span className="text-steel">{active.label}</span>
        </p>

        <nav className="flex items-center gap-5">
          <a className="label hover:text-steel" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="label hover:text-steel" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className="label hover:text-steel" href="/cv.pdf" download>
            CV
          </a>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Write the footer**

Create `components/SiteFooter.tsx`:

```tsx
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6">
        <p className="label">© {new Date().getFullYear()} Daniel Rodriguez</p>
        <div className="flex gap-5">
          <a className="label hover:text-steel" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="label hover:text-steel" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className="label hover:text-steel" href="#home">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`
Expected: both clean.

- [ ] **Step 4: Commit**

```bash
git add components/SiteHeader.tsx components/SiteFooter.tsx
git commit -m "feat(chrome): collapse the header into section signage"
```

---

## Task 12: Pinned Pulse section

**Files:**
- Create: `components/motion/Pinned.tsx`
- Create: `components/sections/PulseFeature.tsx`

**Interfaces:**
- Consumes: `useMotionAllowed`, `DURATION`, `EASE`, `projects`, `VideoEmbed`, `SectionHeader`.
- Produces: `<Pinned beats={ReactNode[]} className?={string} />`; `<PulseFeature />` rendering `<section id="pulse">`.

The keyboard rule from the spec is implemented here: focus entering a beat scrolls the timeline to that beat. Without it, tabbing lands on content the pin is holding off-screen and the page looks frozen.

- [ ] **Step 1: Write the primitive**

Create `components/motion/Pinned.tsx`:

```tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionAllowed } from "@/lib/useReducedMotion";

/**
 * Holds a section in place while its beats advance with the scroll. Without
 * motion it degrades to the beats stacked vertically, which is a perfectly
 * good layout — the pin is an enhancement, not the structure.
 */
export function Pinned({
  beats,
  className = "",
}: {
  beats: ReactNode[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    gsap.registerPlugin(ScrollTrigger);
    let trigger: ScrollTrigger | undefined;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-beat]", el);
      gsap.set(items, { autoAlpha: 0, y: 40 });
      gsap.set(items[0], { autoAlpha: 1, y: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          // One viewport of scroll per transition, so the pin releases as soon
          // as the beats are done. It borrows scroll; it never keeps it.
          end: () => `+=${window.innerHeight * (items.length - 1)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });

      items.forEach((item, index) => {
        if (index === 0) return;
        timeline
          .to(items[index - 1], { autoAlpha: 0, y: -40 })
          .to(item, { autoAlpha: 1, y: 0 }, "<");
      });

      trigger = timeline.scrollTrigger;

      // Keyboard: focus entering a beat drives the timeline to that beat
      // instead of the browser scrolling inside a pinned container.
      items.forEach((item, index) => {
        item.addEventListener("focusin", () => {
          if (!trigger) return;
          const span = trigger.end - trigger.start;
          const target = trigger.start + (span * index) / Math.max(1, items.length - 1);
          window.scrollTo({ top: target, behavior: "auto" });
        });
      });
    }, el);

    return () => ctx.revert();
  }, [animate]);

  return (
    <div ref={ref} className={className}>
      {beats.map((beat, index) => (
        <div key={index} data-beat>
          {beat}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write the section**

Create `components/sections/PulseFeature.tsx`:

```tsx
import { projects } from "@/data/projects";
import { SectionHeader } from "@/components/SectionHeader";
import { Pinned } from "@/components/motion/Pinned";
import { VideoEmbed } from "@/components/VideoEmbed";

export function PulseFeature() {
  const pulse = projects[0];

  return (
    <section id="pulse" className="relative border-t border-border py-24">
      <div
        aria-hidden="true"
        className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-40"
      />
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <SectionHeader
          index="01"
          label="Featured"
          lines={["Pulse —", "real time,", "end to end"]}
        />

        <Pinned
          className="relative"
          beats={[
            <div key="what" className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <p className="max-w-[46ch] text-lg leading-relaxed text-muted">
                {pulse.description}
              </p>
              <ul className="flex flex-wrap gap-2">
                {pulse.tech.map((tech) => (
                  <li key={tech} className="label border border-border px-3 py-2">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>,

            <div key="demo" className="mx-auto w-full max-w-3xl">
              {pulse.demoUrl ? (
                <VideoEmbed url={pulse.demoUrl} title={pulse.title} />
              ) : null}
            </div>,

            <div key="decisions" className="grid gap-8 md:grid-cols-3">
              {pulse.achievements.slice(0, 3).map((achievement, index) => (
                <div key={achievement}>
                  <span className="label block">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 text-base leading-relaxed text-muted">{achievement}</p>
                </div>
              ))}
            </div>,
          ]}
        />

        <div className="mt-16 flex flex-wrap gap-4">
          {pulse.repoUrl ? (
            <a
              className="label border border-border px-5 py-4 hover:border-steel hover:text-steel"
              href={pulse.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View code on GitHub
            </a>
          ) : null}
          {pulse.demoUrl ? (
            <a
              className="label border border-border px-5 py-4 hover:border-steel hover:text-steel"
              href={pulse.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch the demo
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add components/motion/Pinned.tsx components/sections/PulseFeature.tsx
git commit -m "feat(pulse): pin the feature and advance it in three beats"
```

---

## Task 13: Work grid

**Files:**
- Create: `components/sections/Work.tsx`
- Modify: `components/ProjectCard.tsx`
- Modify: `components/VideoEmbed.tsx`

**Interfaces:**
- Consumes: `projects`, `Stagger`, `SectionHeader`, `VideoEmbed`.
- Produces: `<Work />` rendering `<section id="work">`. `ProjectCard` keeps its `{ project }` prop and its `repoUrl` link; `VideoEmbed` keeps `{ url, title }` and click-to-play.

- [ ] **Step 1: Restyle the card**

Replace the whole body of `components/ProjectCard.tsx` with:

```tsx
import Image from "next/image";
import type { Project } from "@/data/projects";
import { VideoEmbed } from "./VideoEmbed";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col border border-border bg-surface p-8 transition-colors hover:border-steel/40">
      <div className="mb-6 flex items-start justify-between gap-6">
        <h3 className="display text-[28px]">{project.title}</h3>
        <span className="label whitespace-nowrap">{project.discipline ?? project.tag}</span>
      </div>

      {project.cover ? (
        <Image
          src={project.cover}
          alt=""
          width={1200}
          height={675}
          className="mb-6 h-auto w-full border border-border"
        />
      ) : null}

      <p className="mb-6 max-w-[46ch] text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      {project.demoUrl ? <VideoEmbed url={project.demoUrl} title={project.title} /> : null}

      <ul className="mb-6 mt-6 grid gap-3 text-sm leading-relaxed text-muted">
        {project.achievements.map((achievement) => (
          <li key={achievement} className="grid grid-cols-[10px_1fr] gap-3">
            <span aria-hidden="true" className="mt-2 h-px w-2.5 bg-steel" />
            <span>{achievement}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span key={tech} className="label border border-border px-2.5 py-1.5">
            {tech}
          </span>
        ))}
      </div>

      {project.repoUrl ? (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="label mt-6 w-fit border border-border px-4 py-3 hover:border-steel hover:text-steel"
        >
          View code on GitHub
        </a>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 2: Restyle the embed**

In `components/VideoEmbed.tsx`, change only the two `className` strings on the wrapper and the button, and the play badge colour:

- wrapper: `"relative mt-3 aspect-video overflow-hidden border border-border"`
- button: `"group relative mt-3 block aspect-video w-full overflow-hidden border border-border"`
- badge: `"grid h-12 w-12 place-items-center rounded-full bg-steel text-bg"`

Leave `getYouTubeId`, the state and the iframe untouched.

- [ ] **Step 3: Write the section**

Create `components/sections/Work.tsx`:

```tsx
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Stagger } from "@/components/motion/Stagger";

export function Work() {
  // Pulse has its own section; this grid is everything else.
  const rest = projects.slice(1);

  return (
    <section id="work" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <SectionHeader index="02" label="Selected work" lines={["Other", "systems"]} />
        <Stagger className="grid gap-6 lg:grid-cols-3" total={0.5}>
          {rest.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Work.tsx components/ProjectCard.tsx components/VideoEmbed.tsx
git commit -m "feat(work): restyle the project grid for the new system"
```

---

## Task 14: Approach and track

**Files:**
- Create: `components/sections/HowIWork.tsx`
- Create: `components/sections/Track.tsx`

**Interfaces:**
- Consumes: `SectionHeader`, `Stagger`, `skillCategories`, `educationItems`.
- Produces: `<HowIWork />` rendering `<section id="approach">`; `<Track />` rendering `<section id="track">`.

- [ ] **Step 1: Write the approach section**

Create `components/sections/HowIWork.tsx`:

```tsx
import { SectionHeader } from "@/components/SectionHeader";
import { Stagger } from "@/components/motion/Stagger";

/**
 * Claims with evidence attached. An adjective ("passionate", "detail-oriented")
 * is worth nothing to a reader who has seen a hundred portfolios; a number is.
 */
const CLAIMS = [
  {
    title: "I optimise what I can measure",
    body: "Contract search at Proyectos y Servicios RACO returned roughly 30% faster after reworking the queries and the indexes behind them.",
  },
  {
    title: "I test against the real thing",
    body: "Pulse runs 95 tests, integration included, against a real PostgreSQL through Testcontainers. H2 cannot execute PL/pgSQL, so a suite built on it would skip the part that matters.",
  },
  {
    title: "I ship whole systems",
    body: "Database, services and frontend come up with one Docker Compose command, migrations included, and every push is built and tested by CI.",
  },
];

export function HowIWork() {
  return (
    <section id="approach" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <SectionHeader index="03" label="Approach" lines={["How I", "work"]} />
        <Stagger className="grid gap-12 md:grid-cols-3" total={0.45}>
          {CLAIMS.map((claim, index) => (
            <div key={claim.title}>
              <span className="label block">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="display mt-4 text-[26px] text-steel">{claim.title}</h3>
              <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-muted">
                {claim.body}
              </p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write the track section**

Create `components/sections/Track.tsx`:

```tsx
import { educationItems } from "@/data/education";
import { skillCategories } from "@/data/skills";
import { SectionHeader } from "@/components/SectionHeader";
import { Stagger } from "@/components/motion/Stagger";

export function Track() {
  return (
    <section id="track" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <SectionHeader index="04" label="Track" lines={["Where", "it comes from"]} />

        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <Stagger className="grid gap-8">
            {educationItems.map((item) => (
              <div key={item.institution} className="border-t border-border pt-5">
                <h3 className="display text-[24px]">{item.institution}</h3>
                <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </Stagger>

          <Stagger className="grid gap-8 sm:grid-cols-2" total={0.5}>
            {skillCategories.map((category) => (
              <div key={category.name} className="border-t border-border pt-5">
                <h3 className="label mb-4">{category.name}</h3>
                <ul className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <li key={item} className="border border-border px-2.5 py-1.5 text-xs text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add components/sections/HowIWork.tsx components/sections/Track.tsx
git commit -m "feat(sections): claim with evidence and compress the track"
```

---

## Task 15: Contact

**Files:**
- Create: `components/sections/ContactSection.tsx`

**Interfaces:**
- Consumes: `ContactForm` (unmodified), `SectionHeader`, `GITHUB_URL`, `LINKEDIN_URL`.
- Produces: `<ContactSection />` rendering `<section id="contact">`.

`components/ContactForm.tsx` is not touched. Only the shell around it changes.

- [ ] **Step 1: Write the section**

Create `components/sections/ContactSection.tsx`:

```tsx
import { ContactForm } from "@/components/ContactForm";
import { SectionHeader } from "@/components/SectionHeader";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

const DIRECT = [
  { label: "Email", value: "drodriguezj1267@gmail.com", href: "mailto:drodriguezj1267@gmail.com" },
  { label: "Phone", value: "+57 318 479 3984", href: "tel:+573184793984" },
  { label: "GitHub", value: "github.com/drodriguezj12", href: GITHUB_URL },
  { label: "LinkedIn", value: "LinkedIn profile", href: LINKEDIN_URL },
];

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <SectionHeader index="05" label="Contact" lines={["Let's", "talk"]} />

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="max-w-[40ch] text-base leading-relaxed text-muted">
              Based in Bogotá, Colombia. Open to full-stack and backend roles, API work and
              database optimisation. The form below reaches my inbox directly.
            </p>
            <dl className="mt-10 grid gap-5">
              {DIRECT.map((item) => (
                <div key={item.label} className="border-t border-border pt-4">
                  <dt className="label">{item.label}</dt>
                  <dd className="mt-2">
                    <a
                      className="text-text hover:text-steel"
                      href={item.href}
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {item.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all green.

- [ ] **Step 3: Commit**

```bash
git add components/sections/ContactSection.tsx
git commit -m "feat(contact): restyle the shell around the working form"
```

---

## Task 16: Assemble the page and delete the old one

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Delete: `components/{Hero,About,Portfolio,Skills,Education,Nav,Footer,TechMarquee,CustomCursor,RevealOnScroll,Contact,ScrollProgress}.tsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: every section from Tasks 10–15.
- Produces: the finished page.

- [ ] **Step 1: Assemble the page**

Replace `app/page.tsx` entirely:

```tsx
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ContactSection } from "@/components/sections/ContactSection";
import { Cover } from "@/components/sections/Cover";
import { HowIWork } from "@/components/sections/HowIWork";
import { PulseFeature } from "@/components/sections/PulseFeature";
import { Track } from "@/components/sections/Track";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Cover />
        <PulseFeature />
        <Work />
        <HowIWork />
        <Track />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 2: Delete the old components**

```bash
git rm components/Hero.tsx components/About.tsx components/Portfolio.tsx components/Skills.tsx components/Education.tsx components/Nav.tsx components/Footer.tsx components/TechMarquee.tsx components/CustomCursor.tsx components/RevealOnScroll.tsx components/Contact.tsx components/ScrollProgress.tsx
```

- [ ] **Step 3: Drop framer-motion**

```bash
npm uninstall framer-motion
```

- [ ] **Step 4: Prove nothing still imports it**

Run: `npx eslint . && grep -r "framer-motion" app components lib`
Expected: eslint clean, and `grep` prints nothing and exits 1. A hit here means a component was missed — fix it before continuing.

- [ ] **Step 5: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: lint clean, 31 tests, build succeeds. Then `npm run dev` and read the whole page top to bottom in a browser.

- [ ] **Step 6: Commit**

```bash
git add -A app components package.json package-lock.json
git commit -m "feat(page): assemble the redesign and retire the old sections"
```

---

## Task 17: Identity beyond the page

**Files:**
- Modify: `app/opengraph-image.tsx`
- Modify: `app/icon.svg`
- Create: `app/not-found.tsx`

**Interfaces:**
- Consumes: `SITE_URL` (already exported from `lib/site.ts`).
- Produces: nothing other components use.

- [ ] **Step 1: Rebuild the Open Graph card**

In `app/opengraph-image.tsx`, keep the exports and the structure, and change only the palette and type so the card matches the site:

- background `#0a0a0c` → `#08080a`
- the `DR` badge background `#f4f4f5` → `#cbd5e1`, its text `#0a0a0c` → `#08080a`
- the eyebrow colour `#ff6a3d` → `#cbd5e1`
- the headline: replace the four `<span>`s with `Systems that hold up`, then `in production.` in `#cbd5e1`
- `fontWeight: 700` on the headline, `fontSize: "76px"`, `textTransform: "uppercase"`, `letterSpacing: "-0.01em"`
- the footer line stays, colour `#86868f`

`ImageResponse` renders with a system sans by default. Keep it: shipping a mismatched webfont looks worse than a neutral one, and the spec allows this fallback explicitly.

- [ ] **Step 2: Redraw the icon**

Replace `app/icon.svg` with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#08080a"/>
  <rect x="0.5" y="0.5" width="63" height="63" rx="13.5" fill="none" stroke="#1b1b20"/>
  <text x="32" y="43" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="30" font-weight="700" letter-spacing="-1" fill="#cbd5e1">DR</text>
</svg>
```

- [ ] **Step 3: Write the 404**

Create `app/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center">
      <div
        aria-hidden="true"
        className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-50"
      />
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <p className="label mb-6">Error 404</p>
        <h1 className="display text-[44px] md:text-[68px] lg:text-[96px]">
          This page does
          <br />
          not <span className="text-steel">exist</span>
        </h1>
        <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-muted">
          The address is wrong, or the page was removed. Everything worth seeing is on the
          cover.
        </p>
        <Link
          href="/"
          className="label mt-10 inline-block border border-border px-5 py-4 hover:border-steel hover:text-steel"
        >
          Back to the cover
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify as rendered output, not as code**

Run: `npm run build && npm run start`
Then, in another shell:

```bash
curl -s -o og.png -w "%{http_code} %{content_type} %{size_download}\n" http://localhost:3000/opengraph-image
curl -s -o /dev/null -w "404 page: %{http_code}\n" http://localhost:3000/this-does-not-exist
```

Expected: `200 image/png` with a non-trivial size, and `404` for the missing page. Open `og.png` and confirm it reads in steel, not coral. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add app/opengraph-image.tsx app/icon.svg app/not-found.tsx
git commit -m "feat(identity): carry the new system into the card, icon and 404"
```

---

## Task 18: Imagery

**Files:**
- Create: `public/projects/*.jpg` (four files)
- Modify: `data/projects.ts`

**Interfaces:**
- Consumes: `Project.cover` added in Task 9.
- Produces: every project has a `cover`.

- [ ] **Step 1: Bring in the Pulse screenshot**

```bash
cp "C:/Users/frapa/OneDrive/Desktop/Projects/periferia-social/docs/screenshots/feed.png" public/projects/pulse.png
```

If that path does not exist, run `ls "C:/Users/frapa/OneDrive/Desktop/Projects/periferia-social/docs/screenshots/"` and copy `feed.png` from wherever it is. Do not invent an image.

- [ ] **Step 2: Generate the three remaining covers**

Run this from the repo root — it writes three abstract covers in the steel palette so the grid reads as designed rather than as three empty boxes:

```bash
python - <<'PY'
from PIL import Image, ImageDraw, ImageFilter
import pathlib, random

OUT = pathlib.Path("public/projects")
OUT.mkdir(parents=True, exist_ok=True)
W, H = 1200, 675

specs = [
    ("smartpark.jpg", 7, 21),
    ("commerce.jpg", 13, 34),
    ("contracts.jpg", 29, 47),
]

for name, seed, lines in specs:
    random.seed(seed)
    img = Image.new("RGB", (W, H), (8, 8, 10))
    d = ImageDraw.Draw(img)
    for i in range(lines):
        x = random.randint(-W // 3, W)
        y = random.randint(-H // 3, H)
        length = random.randint(W // 4, W)
        width = random.choice([1, 1, 1, 2])
        shade = random.randint(28, 74)
        d.line([(x, y), (x + length, y + length // 3)], fill=(shade, shade + 4, shade + 8), width=width)
    img = img.filter(ImageFilter.GaussianBlur(0.4))
    img.save(OUT / name, quality=88, optimize=True)
    print("wrote", name)
PY
```

- [ ] **Step 3: Point the data at the files**

In `data/projects.ts`, add to each project in order:

```ts
// Pulse
cover: "/projects/pulse.png",
// Smart Parking Management Platform
cover: "/projects/smartpark.jpg",
// E-commerce Platform with AI Chatbot Integration
cover: "/projects/commerce.jpg",
// Contract Data Processing System
cover: "/projects/contracts.jpg",
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npm test && npm run build`
Expected: all green, no `next/image` warnings about missing dimensions.

- [ ] **Step 5: Commit**

```bash
git add public/projects data/projects.ts
git commit -m "feat(work): give every project an image"
```

---

## Task 19: Verification and preview

**Files:** none changed unless a check fails.

- [ ] **Step 1: Measure the bundle against the baseline**

```bash
npm run build
python - <<'PY'
import pathlib, gzip
total = sum(len(gzip.compress(f.read_bytes(), 9)) for f in pathlib.Path(".next/static").rglob("*.js"))
print(f"{total/1024:.1f} KB gzipped total JS (baseline before redesign: 242.3 KB)")
PY
```

Expected: in the neighbourhood of the baseline. A large jump means the shader is not being split out — check the build output for a separate chunk before continuing.

- [ ] **Step 2: Check the three degraded paths**

Run `npm run dev`, then in DevTools:

1. Rendering → Emulate CSS `prefers-reduced-motion: reduce`. Reload. Expected: no shader, no pin, no scramble, no count-up; every section readable; scrolling native.
2. Device toolbar → any phone. Reload. Expected: no shader, no custom cursor, headline does not overflow, the pinned section still advances.
3. Disable JavaScript. Reload. Expected: all copy present and readable, links work.

Fix anything that fails before continuing. Stop the dev server.

- [ ] **Step 3: Push the branch**

```bash
git push -u origin redesign/v2
```

- [ ] **Step 4: Get the preview URL**

Vercel builds the branch automatically. Retrieve the preview URL from the Vercel dashboard, or from the deployment check on the branch. Confirm the production site is unchanged:

```bash
curl -s -o /dev/null -w "production still live: %{http_code}\n" https://danielrodriguezportfolio.vercel.app
```

- [ ] **Step 5: Hand over for review**

Report to Daniel: the preview URL, the measured bundle figure against the 242 KB baseline, and the results of the three degraded-path checks. The judgement on whether the motion *feels* right is his, in a real browser — the preview pane freezes animations and cannot answer that question.

Do **not** merge to `main` without his approval.

---

## Self-review

**Spec coverage**

| Spec section | Task |
|---|---|
| Colour tokens, type, grid, space | 1 |
| Motion tokens and guardrails | 2, 3 |
| Cover (01) | 10 |
| Pulse pinned (02) | 12 |
| Other work (03) | 13 |
| How I work (04) | 14 |
| Track (05) | 14 |
| Contact (06) | 15 |
| Copy rewritten in English | 10, 12, 13, 14, 15 |
| Imagery | 18 |
| Identity: OG, icon, 404 | 17 |
| Shader, split text, scramble, count-up, stagger, cursor, pin | 4–8, 12 |
| Header collapse | 11 |
| Keyboard behaviour of the pin | 12 |
| Performance rules and measurement | 8, 19 |
| Reduced motion / coarse pointer / no-JS | 2, 19 |
| Branch and preview delivery | 1, 19 |
| framer-motion removed | 16 |

**Not implemented, deliberately:** the "soft wipe between sections" in the spec's motion table. The pinned section and the per-section reveals already carry the transitions, and a global wipe on top of them would double the movement at every boundary. If it is wanted after seeing the preview, it is one task on `Pinned`'s pattern.

**Type consistency:** `useMotionAllowed` returns `{ animate, heavy }` and is consumed under those names in Tasks 3, 4, 5, 6, 7, 8, 12. `stagger(count, total)` is called with both arguments in Tasks 5 and 6. `ParsedFigure` is produced by `parseFigure` and consumed by `formatFigure` in Task 6. `ShaderField` is a default export and is imported as one in Task 8. `Project.discipline` and `Project.cover` are added in Task 9 and consumed in Tasks 10, 13, 18.
