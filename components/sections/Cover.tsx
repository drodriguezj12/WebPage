import Link from "next/link";
import type { CSSProperties } from "react";
import { projects } from "@/data/projects";
import { CountUp } from "@/components/motion/CountUp";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { ShaderFieldMount } from "@/components/motion/ShaderFieldMount";
import { CSS_EASE, DURATION, stagger } from "@/lib/motion";

const FIGURES = [
  { figure: "3+", label: "Years shipping" },
  { figure: "30%", label: "Faster queries" },
  { figure: "95", label: "Tests on Pulse" },
];

const HEADLINE = [
  "Systems that",
  "hold up in",
  <span key="production" className="text-steel">
    production
  </span>,
];

/**
 * The cover's reveal is pure CSS (`.cover-reveal-line` / `.cover-reveal-item`
 * in globals.css, active only under `prefers-reduced-motion: no-preference`)
 * so the headline and the project index — the page's first screen — are
 * visible from first paint, run once with no JavaScript, and can never be
 * hidden-then-replayed the way the GSAP `set`-to-hidden approach was (I2).
 *
 * Each group is sequenced to start as the previous group's last item begins
 * revealing, so the cascade reads headline -> figures -> index and the whole
 * cover settles in ~1.4s (durations and steps come from lib/motion.ts).
 */
const HEADLINE_STEP = stagger(HEADLINE.length, 0.35);
const FIGURES_STEP = stagger(FIGURES.length, 0.4);
const FIGURES_BASE = HEADLINE_STEP * (HEADLINE.length - 1);
const INDEX_STEP = stagger(projects.length, 0.4);
const INDEX_BASE = FIGURES_BASE + FIGURES_STEP * (FIGURES.length - 1);

function reveal(duration: number, delay: number): CSSProperties {
  return {
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    animationTimingFunction: CSS_EASE.out,
  };
}

export function Cover() {
  return (
    <section
      id="home"
      className="cover-section relative min-h-svh overflow-hidden pt-28 pb-16"
    >
      <ShaderFieldMount className="pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      <div className="cover-shell mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="label">
            <ScrambleText text="DANIEL RODRIGUEZ — BOGOTÁ, CO" />
          </p>
          <p className="label flex items-center gap-2">
            {/* The single use of `signal` on the page. */}
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
            Available for work
          </p>
        </div>

        <h1 className="cover-headline display text-[44px] md:text-[68px] lg:text-[96px] xl:text-[130px]">
          {HEADLINE.map((line, index) => (
            <span className="split-line" key={index}>
              <span
                className="cover-reveal-line block"
                style={reveal(DURATION.section, HEADLINE_STEP * index)}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[46ch] text-base leading-relaxed text-muted">
            Backend-leaning full-stack developer. Java, Spring Boot and PostgreSQL —
            three years building and optimising applications that run for real.
          </p>

          <div className="flex gap-10">
            {FIGURES.map((item, index) => (
              <div
                key={item.label}
                className="cover-reveal-item"
                style={reveal(DURATION.element, FIGURES_BASE + FIGURES_STEP * index)}
              >
                <CountUp figure={item.figure} className="display block text-[40px] text-steel" />
                <span className="label mt-2 block">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/*
          The grid is pulled out by the cell's own left padding (-ml-6, width
          grown to match) so px-6 cells get symmetric inner padding — the
          filled hover/focus state no longer sits flush against the cell's
          edge (T13) — while the first column's text still lines up with the
          headline above it.
        */}
        <div className="-ml-6 grid w-[calc(100%+1.5rem)] gap-px border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <Link
              key={project.title}
              href={index === 0 ? "#pulse" : "#work"}
              className="cover-reveal-item group border-b border-border bg-bg px-6 py-6 transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-steel"
              style={reveal(DURATION.element, INDEX_BASE + INDEX_STEP * index)}
            >
              <span className="label block">{String(index + 1).padStart(2, "0")}</span>
              <span className="display mt-3 block text-[26px] group-hover:text-steel group-focus-visible:text-steel">
                {project.shortName ?? project.title}
              </span>
              <span className="label mt-2 block">{project.discipline}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
