"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

const LINKEDIN_URL = "https://www.linkedin.com/in/daniel-rodriguez-b795a8406/";

export function Nav() {
  const [activeHref, setActiveHref] = useState("#home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.querySelector(link.href)).filter(
      (el): el is Element => el !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="#home"
          className="flex items-center gap-2 font-display text-sm font-semibold text-text"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent/30 bg-accent-soft text-accent">
            DR
          </span>
          <span className="hidden sm:inline">Daniel Rodriguez</span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  onClick={() => setActiveHref(link.href)}
                  className={`relative z-10 inline-flex h-11 items-center rounded-md px-3 text-sm font-semibold transition-colors ${
                    activeHref === link.href ? "text-accent" : "text-muted hover:text-text"
                  }`}
                >
                  {link.label}
                </a>
                {activeHref === link.href && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-md bg-accent-soft"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Daniel Rodriguez on LinkedIn"
            className="grid h-11 w-11 place-items-center rounded-md border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
          </a>
          <a
            href="/cv.pdf"
            download
            className="inline-flex h-11 items-center rounded-md border border-border px-3 text-sm font-semibold text-text transition-colors hover:border-accent/40 hover:text-accent"
          >
            Download CV
          </a>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="grid h-11 w-11 place-items-center rounded-md border border-border text-text md:hidden"
        >
          <span className="relative block h-4 w-5">
            <motion.span
              className="absolute left-0 top-0 h-0.5 w-5 bg-text"
              animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 7 : 0 }}
            />
            <motion.span
              className="absolute left-0 top-1.5 h-0.5 w-5 bg-text"
              animate={{ opacity: isMenuOpen ? 0 : 1 }}
            />
            <motion.span
              className="absolute left-0 top-3 h-0.5 w-5 bg-text"
              animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -7 : 0 }}
            />
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <nav className="border-b border-border bg-bg px-4 pb-4 md:hidden">
          <ul className="grid gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => {
                    setActiveHref(link.href);
                    setIsMenuOpen(false);
                  }}
                  className={`flex h-11 items-center justify-center rounded-md text-sm font-semibold ${
                    activeHref === link.href ? "bg-accent-soft text-accent" : "text-muted"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2 border-t border-border pt-3">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 flex-1 items-center justify-center rounded-md border border-border text-sm font-semibold text-muted"
            >
              LinkedIn
            </a>
            <a
              href="/cv.pdf"
              download
              className="flex h-11 flex-1 items-center justify-center rounded-md border border-border text-sm font-semibold text-text"
            >
              Download CV
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
