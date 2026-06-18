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
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-text text-bg">
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
        </nav>
      )}
    </header>
  );
}
