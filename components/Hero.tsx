"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealOnScroll } from "./RevealOnScroll";

const TITLE_WORDS = [
  "Daniel",
  "Rodriguez.",
  "Full-Stack",
  "Developer",
  "building",
  "production-ready",
  "web",
  "platforms.",
];

const STATS = [
  { value: "3+", label: "Years building production applications" },
  { value: "30%", label: "Faster contract search queries" },
  { value: "B2", label: "English (B2) professional proficiency" },
];

export function Hero() {
  const { scrollY } = useScroll();
  const decorY = useTransform(scrollY, [0, 600], [0, 120]);
  const decorRotate = useTransform(scrollY, [0, 600], [-10, -4]);

  return (
    <section id="home" className="relative overflow-hidden pt-24 pb-20">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -bottom-32 h-[420px] w-[420px] opacity-40"
        style={{
          y: decorY,
          rotate: decorRotate,
          backgroundImage:
            "linear-gradient(90deg, rgba(255,106,61,0.12) 1px, transparent 1px), linear-gradient(rgba(255,106,61,0.12) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      <div
        aria-hidden="true"
        className="animate-breathe pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,106,61,0.28), rgba(255,106,61,0) 65%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-11 px-4 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface px-3 py-2 text-sm font-semibold text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Full-Stack Developer | Systems Engineering Student
          </span>

          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {TITLE_WORDS.map((word, index) => (
              <motion.span
                key={word}
                className={`mr-3 inline-block ${word === "production-ready" ? "text-gradient-accent" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * index, ease: "easeOut" }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted">
            Backend-focused full-stack development with Java, Spring Boot, and Angular —
            shipping APIs and applications that hold up in production.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <Link
                href="#portfolio"
                className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-5 font-semibold text-bg"
              >
                View portfolio
              </Link>
            </motion.span>
            <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <Link
                href="#contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-border px-5 font-semibold text-text hover:border-accent/40 hover:text-accent"
              >
                Contact
              </Link>
            </motion.span>
            <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <a
                href="/cv.pdf"
                download
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border px-5 font-semibold text-text hover:border-accent/40 hover:text-accent"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Download CV
              </a>
            </motion.span>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2 text-sm font-semibold text-muted">
            <li className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-3">
              Bogotá, Colombia
            </li>
            <li className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-3">
              drodriguezj1267@gmail.com
            </li>
          </ul>
        </div>

        <RevealOnScroll className="relative rounded-2xl border border-border bg-surface p-6">
          <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full ring-2 ring-accent/50">
            <Image
              src="/avatar.png"
              alt="Daniel Rodriguez"
              fill
              sizes="112px"
              className="scale-125 object-cover"
            />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">Open to new opportunities.</h2>
          <p className="mt-2 text-muted">
            Seeking Full-Stack, Backend, or AI-integrated Software Engineering roles.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-md border border-border bg-bg p-3">
                <strong className="block text-2xl text-accent">{stat.value}</strong>
                <span className="mt-2 block text-xs font-semibold leading-tight text-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
