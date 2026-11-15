"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

const LINK =
  "rounded-full px-3 py-1.5 text-[0.8125rem] font-medium text-white/70 transition-colors duration-300 ease-fluid hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * A floating island rather than a bar glued to the top edge. It is dark glass
 * on purpose: the page alternates light and dark sections, and this is the one
 * treatment that stays legible over both without switching theme mid-scroll.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[60] -translate-y-20 rounded-full bg-[#1d1d1f] px-4 py-2 text-sm font-medium text-white transition-transform duration-300 focus-visible:translate-y-0"
      >
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-5">
        <nav
          aria-label="Primary"
          className="pointer-events-auto flex items-center gap-1 rounded-full bg-[#1d1d1f]/80 p-1.5 pl-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <a
            href="#top"
            className="mr-2 text-[0.8125rem] font-semibold tracking-[-0.01em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Daniel Rodriguez
          </a>

          <div className="hidden items-center md:flex">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className={LINK}>
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="/cv.pdf"
            download
            className="ml-1 rounded-full bg-white px-3.5 py-1.5 text-[0.8125rem] font-medium text-[#1d1d1f] transition-transform duration-300 ease-fluid active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            CV
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="relative ml-1 grid h-8 w-8 place-items-center rounded-full text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
          >
            <span
              className={`absolute h-px w-4 bg-current transition-transform duration-500 ease-fluid ${
                open ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`absolute h-px w-4 bg-current transition-transform duration-500 ease-fluid ${
                open ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </button>
        </nav>
      </header>

      <div
        id="mobile-menu"
        // `inert` keeps the closed menu's links out of the tab order.
        inert={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-[#0a0a0c]/90 px-8 backdrop-blur-2xl transition-opacity duration-500 ease-fluid md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="grid gap-2">
          {LINKS.map((link, index) => (
            <li key={link.href} className="overflow-hidden">
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${index * 60 + 100}ms` : "0ms" }}
                className={`block py-2 text-[2.5rem] font-semibold tracking-[-0.04em] text-white transition-[transform,opacity] duration-700 ease-fluid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
