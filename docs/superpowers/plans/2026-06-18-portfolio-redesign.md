# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing static `index.html` portfolio as a Next.js site with a dark + coral
design system and elaborate scroll/hover animation, keeping full content parity with the
original.

**Architecture:** Next.js 16 App Router site, single page (`app/page.tsx`) assembling one
component per section. Content lives in typed data files under `data/`. Shared motion
behavior (scroll reveal, stagger) lives in one reusable component. The only piece of real
logic — contact form field validation — is extracted into a pure function with unit tests;
everything else is presentational and verified via type-check + build + a manual dev-server
smoke test in the final task.

**Tech Stack:** Next.js 16.2.9 (App Router, already scaffolded), React 19.2.4, TypeScript 5,
Tailwind CSS 4 (CSS-first `@theme`, no `tailwind.config.*` file), Framer Motion 12.40.0,
Vitest (added in Task 3) for the one unit-testable module.

## Global Constraints

- Project root: `C:\Users\frapa\OneDrive\Desktop\Projects\portfolio` (already created via
  `create-next-app`, git already initialized, `framer-motion` already installed).
- Dark theme only — no light/dark toggle.
- Palette (exact hex, from the approved design spec): background `#0a0a0c`, surface `#121216`,
  border `#1f1f24`, text `#f4f4f5`, muted `#a1a1aa`, accent `#ff6a3d`, accent-soft `#2a0d02`.
- Fonts: Geist (display/headings) + Inter (body), both via `next/font/google` — no external
  font requests.
- Content must match the original `index.html` (
  `C:\Users\frapa\OneDrive\Desktop\index.html`) — same copy, same 3 projects, same skill
  categories, same education entries, same contact details. Do not invent or drop content.
- Avatar source file is at `C:\Users\frapa\OneDrive\Desktop\Projects\avatar.png` — copy it into
  `public/avatar.png`. It has a teal circular border baked into the image; render it inside a
  plain `overflow-hidden` circle (no border passthrough) and apply the site's own coral ring
  instead — never let the source image's teal border show.
- Respect `prefers-reduced-motion` — Framer Motion respects it automatically for `transform`/
  `opacity` animations driven by `whileInView`/`animate`, but manually-driven effects (custom
  cursor, tilt) must check `window.matchMedia("(prefers-reduced-motion: reduce)")` and disable
  themselves.
- Every component that uses Framer Motion (`motion.*`, hooks) needs a `"use client"` directive
  at the top of the file.
- Tailwind v4 theme tokens are declared once in `app/globals.css` via `@theme`; do not create a
  `tailwind.config.ts` — it doesn't exist in this project and isn't needed.
- Run commands from `C:\Users\frapa\OneDrive\Desktop\Projects\portfolio` (or the bash-equivalent
  path `/c/Users/frapa/OneDrive/Desktop/Projects/portfolio`).

---

### Task 1: Design tokens and global theme shell

**Files:**
- Modify: `app/globals.css` (replace entire contents)
- Modify: `app/layout.tsx` (replace entire contents)

**Interfaces:**
- Produces: Tailwind utility classes `bg-bg`, `bg-surface`, `border-border`, `text-text`,
  `text-muted`, `bg-accent`, `text-accent`, `border-accent`, `bg-accent-soft` (all usable with
  opacity modifiers, e.g. `border-accent/30`), and font utilities `font-display` (Geist),
  `font-sans` (Inter, set as the body default).
- Consumes: nothing (first task).

- [ ] **Step 1: Replace `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0c;
  --color-surface: #121216;
  --color-border: #1f1f24;
  --color-text: #f4f4f5;
  --color-muted: #a1a1aa;
  --color-accent: #ff6a3d;
  --color-accent-soft: #2a0d02;
  --font-display: var(--font-geist-sans);
  --font-sans: var(--font-inter);
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daniel Rodriguez | Full-Stack Developer",
  description:
    "Daniel Rodriguez, Full-Stack Developer and Systems Engineering student in Bogota, Colombia. Portfolio, projects, skills, education, and contact.",
  openGraph: {
    title: "Daniel Rodriguez | Full-Stack Developer",
    description:
      "Full-Stack Developer specialized in Java, Spring Boot, Angular, REST APIs, databases, and production-ready web applications.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-text antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
```

This references `@/components/CustomCursor`, which doesn't exist yet — that's expected, it's
created in Task 5. The build for this task will fail on that import; that's fine, this task's
verification step only checks the CSS/theme layer compiles. Verify with a type-check on the CSS
consumer instead of a full build:

- [ ] **Step 3: Verify Tailwind theme compiles standalone**

Temporarily comment out the `CustomCursor` import and usage to verify the theme/layout shell in
isolation, since `CustomCursor` doesn't exist until Task 5:

Run: `npx tsc --noEmit`
Expected: errors only about `Cannot find module '@/components/CustomCursor'` — no other errors
(no CSS/theme errors, no JSX errors in `layout.tsx` itself). This confirms the rest of the file
is correct; the missing-module error is expected and will resolve in Task 5.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: set up dark/coral design tokens and root layout"
```

---

### Task 2: Content data files

**Files:**
- Create: `data/projects.ts`
- Create: `data/skills.ts`
- Create: `data/education.ts`

**Interfaces:**
- Produces:
  - `data/projects.ts`: `export type Project = { title: string; tag: string; description: string; achievements: string[]; tech: string[]; demoUrl?: string }` and `export const projects: Project[]`.
  - `data/skills.ts`: `export type SkillCategory = { name: string; items: string[] }` and `export const skillCategories: SkillCategory[]`.
  - `data/education.ts`: `export type EducationItem = { institution: string; description: string }` and `export const educationItems: EducationItem[]`.
- Consumes: nothing.

- [ ] **Step 1: Create `data/projects.ts`**

```ts
export type Project = {
  title: string;
  tag: string;
  description: string;
  achievements: string[];
  tech: string[];
  demoUrl?: string;
};

export const projects: Project[] = [
  {
    title: "Smart Parking Management Platform",
    tag: "Real-time",
    description:
      "Real-time parking system for space availability, vehicle plate tracking, reservations, automated billing, and sensor-driven operations.",
    achievements: [
      "Built event-driven microservices with Quarkus, Apache Kafka, PostgreSQL, and Panache ORM.",
      "Designed RESTful APIs for spaces, reservations, billing records, revenue summaries, and sensor simulation.",
      "Created a responsive React 18 + Vite dashboard with occupancy map, reservation modal, event feed, and billing panel.",
      "Implemented Docker Compose, Kubernetes Minikube, Swagger docs, health checks, Prometheus metrics, and integration tests.",
    ],
    tech: ["Quarkus", "Kafka", "PostgreSQL", "React", "Docker", "Kubernetes", "JUnit 5"],
    demoUrl: "https://youtu.be/gIswiIaDojU",
  },
  {
    title: "E-commerce Platform with AI Chatbot Integration",
    tag: "Commerce",
    description:
      "Full-stack commerce platform for product management, dynamic customer interaction, payment flows, and real-time notifications.",
    achievements: [
      "Developed product catalog and CRUD workflows with Spring Boot and Angular.",
      "Integrated a conversational chatbot to automate customer request handling and improve response efficiency.",
      "Implemented payment gateway integration for secure online transactions.",
      "Built a notification system and applied scalable architecture and performance optimization practices.",
    ],
    tech: ["Java", "Spring Boot", "Angular", "REST APIs", "Payments", "Notifications"],
    demoUrl: "https://youtu.be/-6_inzLlELU",
  },
  {
    title: "Contract Data Processing System",
    tag: "Production",
    description:
      "Production web application work at Proyectos y Servicios RACO S.A.S focused on contract search, backend reliability, and database performance.",
    achievements: [
      "Improved contract search query response times by approximately 30%.",
      "Designed and maintained RESTful APIs supporting business logic and large-scale data handling.",
      "Reduced errors through debugging, backend optimization, and database query improvements.",
      "Coordinated development tasks and code review within a small delivery team.",
    ],
    tech: ["Spring Boot", "Angular", "PostgreSQL", "Oracle", "MongoDB", "Git"],
  },
];
```

- [ ] **Step 2: Create `data/skills.ts`**

```ts
export type SkillCategory = {
  name: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  { name: "Languages", items: ["Java", "JavaScript", "Python", "HTML", "CSS"] },
  {
    name: "Backend",
    items: ["Spring Boot", "REST APIs", "Quarkus", "System design", "Clean architecture"],
  },
  {
    name: "Frontend",
    items: ["Angular", "React", "Responsive UI", "Vite", "Forms", "Dashboards"],
  },
  {
    name: "Databases",
    items: ["PostgreSQL", "Oracle", "MongoDB", "Query optimization", "Data consistency"],
  },
  {
    name: "Cloud & DevOps",
    items: ["Docker", "AWS", "Virtual machines", "Kubernetes", "Minikube", "Prometheus"],
  },
  {
    name: "Tools & Methods",
    items: [
      "Git",
      "GitHub",
      "Jira",
      "ClickUp",
      "Scrum",
      "Agile",
      "Cisco Packet Tracer",
      "Vensim",
    ],
  },
];
```

- [ ] **Step 3: Create `data/education.ts`**

```ts
export type EducationItem = {
  institution: string;
  description: string;
};

export const educationItems: EducationItem[] = [
  {
    institution: "Universidad El Bosque",
    description: "Systems Engineering Student, 8th semester. Bogota, Colombia.",
  },
  {
    institution: "Instituto Colombo Americano",
    description:
      "English B2. Spanish native speaker with professional English communication capability.",
  },
];
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: same single error as Task 1 (`Cannot find module '@/components/CustomCursor'`), no
errors from the three new `data/*.ts` files.

- [ ] **Step 5: Commit**

```bash
git add data/projects.ts data/skills.ts data/education.ts
git commit -m "feat: add typed content data for projects, skills, and education"
```

---

### Task 3: Contact field validation logic (TDD)

**Files:**
- Modify: `package.json` (add `vitest` devDependency and `test` script)
- Create: `vitest.config.ts`
- Create: `lib/validateContactField.ts`
- Test: `lib/validateContactField.test.ts`

**Interfaces:**
- Produces: `export type ContactFieldName = "name" | "email" | "subject" | "message"`,
  `export const CONTACT_FIELD_RULES: Record<ContactFieldName, { required: boolean; minLength?: number; isEmail?: boolean }>`,
  `export function validateContactField(field: ContactFieldName, rawValue: string): string`
  (returns `""` when valid, otherwise an error message string).
- Consumes: nothing.

- [ ] **Step 1: Install Vitest**

Run: `npm install -D vitest`
Expected: exits 0, `vitest` added to `devDependencies` in `package.json`.

- [ ] **Step 2: Add a `test` script**

In `package.json`, inside `"scripts"`, add:

```json
"test": "vitest run"
```

(Keep the existing `dev`, `build`, `start`, `lint` scripts as-is.)

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 4: Write the failing test — `lib/validateContactField.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { validateContactField } from "./validateContactField";

describe("validateContactField", () => {
  it("requires a value for required fields", () => {
    expect(validateContactField("name", "")).toBe("This field is required.");
  });

  it("accepts a valid name", () => {
    expect(validateContactField("name", "Daniel")).toBe("");
  });

  it("rejects an invalid email", () => {
    expect(validateContactField("email", "not-an-email")).toBe("Enter a valid email address.");
  });

  it("accepts a valid email", () => {
    expect(validateContactField("email", "person@example.com")).toBe("");
  });

  it("enforces minimum length", () => {
    expect(validateContactField("subject", "hi")).toBe("Use at least 4 characters.");
  });

  it("accepts a message meeting the minimum length", () => {
    expect(validateContactField("message", "This message is long enough.")).toBe("");
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npx vitest run lib/validateContactField.test.ts`
Expected: FAIL — `Cannot find module './validateContactField'` (the implementation file
doesn't exist yet).

- [ ] **Step 6: Implement `lib/validateContactField.ts`**

```ts
export type ContactFieldName = "name" | "email" | "subject" | "message";

export type ContactFieldRules = {
  required: boolean;
  minLength?: number;
  isEmail?: boolean;
};

export const CONTACT_FIELD_RULES: Record<ContactFieldName, ContactFieldRules> = {
  name: { required: true, minLength: 2 },
  email: { required: true, isEmail: true },
  subject: { required: true, minLength: 4 },
  message: { required: true, minLength: 12 },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactField(field: ContactFieldName, rawValue: string): string {
  const rules = CONTACT_FIELD_RULES[field];
  const value = rawValue.trim();

  if (rules.required && !value) {
    return "This field is required.";
  }

  if (rules.isEmail && !EMAIL_PATTERN.test(value)) {
    return "Enter a valid email address.";
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `Use at least ${rules.minLength} characters.`;
  }

  return "";
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npx vitest run lib/validateContactField.test.ts`
Expected: PASS — `6 passed` (or similar; all 6 `it` blocks green, 0 failed).

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/validateContactField.ts lib/validateContactField.test.ts
git commit -m "feat: add contact field validation with unit tests"
```

---

### Task 4: Shared scroll-reveal motion primitive

**Files:**
- Create: `components/RevealOnScroll.tsx`

**Interfaces:**
- Produces: `export function RevealOnScroll(props: { children: ReactNode; className?: string; delay?: number; stagger?: boolean }): JSX.Element` and `export const revealItemVariants: Variants` (a Framer Motion `Variants` object with `hidden`/`visible` states, for child `motion.*` elements to opt into the same stagger group when `stagger` is `true`).
- Consumes: nothing.

- [ ] **Step 1: Create `components/RevealOnScroll.tsx`**

```tsx
"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  stagger = false,
}: RevealOnScrollProps) {
  if (stagger) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.12, delayChildren: delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={revealItemVariants}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: same single pre-existing error (`Cannot find module '@/components/CustomCursor'`),
no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/RevealOnScroll.tsx
git commit -m "feat: add RevealOnScroll shared motion primitive"
```

---

### Task 5: Custom cursor

**Files:**
- Create: `components/CustomCursor.tsx`

**Interfaces:**
- Produces: `export function CustomCursor(): JSX.Element | null` — renders nothing on touch
  devices or when `prefers-reduced-motion: reduce` is set; otherwise renders a fixed-position
  cursor follower.
- Consumes: nothing (Tailwind tokens from Task 1: `border-accent`).

- [ ] **Step 1: Create `components/CustomCursor.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isTouchDevice) return;

    setIsActive(true);
    document.body.style.cursor = "none";

    function handleMove(event: PointerEvent) {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      const target = event.target as HTMLElement;
      setIsPointer(Boolean(target.closest("a, button, [data-cursor-pointer]")));
    }

    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.body.style.cursor = "";
    };
  }, [cursorX, cursorY]);

  if (!isActive) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-accent mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: isPointer ? 48 : 16,
        height: isPointer ? 48 : 16,
        backgroundColor: isPointer ? "rgba(255,106,61,0.15)" : "rgba(255,106,61,0.6)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );
}
```

- [ ] **Step 2: Type-check and confirm the pre-existing error is gone**

Run: `npx tsc --noEmit`
Expected: no errors at all (exit 0). The `Cannot find module '@/components/CustomCursor'`
error from Tasks 1–4 is now resolved since this file exists.

- [ ] **Step 3: Commit**

```bash
git add components/CustomCursor.tsx
git commit -m "feat: add custom cursor with pointer-aware scaling"
```

---

### Task 6: Navigation

**Files:**
- Create: `components/Nav.tsx`

**Interfaces:**
- Produces: `export function Nav(): JSX.Element`.
- Consumes: Tailwind tokens from Task 1 (`bg-bg`, `border-border`, `text-accent`, `bg-accent-soft`,
  `text-muted`, `text-text`).

- [ ] **Step 1: Create `components/Nav.tsx`**

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat: add sticky nav with morphing active-section indicator"
```

---

### Task 7: Hero section

**Files:**
- Create: `components/Hero.tsx`
- Copy: `C:\Users\frapa\OneDrive\Desktop\Projects\avatar.png` → `public/avatar.png`

**Interfaces:**
- Produces: `export function Hero(): JSX.Element`.
- Consumes: `RevealOnScroll`, `revealItemVariants` from `@/components/RevealOnScroll` (Task 4).

- [ ] **Step 1: Copy the avatar image into `public/`**

Run: `cp "/c/Users/frapa/OneDrive/Desktop/Projects/avatar.png" "/c/Users/frapa/OneDrive/Desktop/Projects/portfolio/public/avatar.png"`
Expected: exits 0, file exists at `public/avatar.png`.

- [ ] **Step 2: Create `components/Hero.tsx`**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealOnScroll } from "./RevealOnScroll";

const TITLE_WORDS = ["Daniel", "Rodriguez", "builds", "production-ready", "web", "platforms."];

const STATS = [
  { value: "3+", label: "Years building production applications" },
  { value: "30%", label: "Faster contract search queries" },
  { value: "B2", label: "English professional proficiency" },
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

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-11 px-4 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface px-3 py-2 text-sm font-semibold text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Full-Stack Developer | Systems Engineering Student
          </span>

          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
            {TITLE_WORDS.map((word, index) => (
              <motion.span
                key={word}
                className={`mr-3 inline-block ${word === "production-ready" ? "text-accent" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * index, ease: "easeOut" }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted">
            Java, Spring Boot, Angular, databases, and cloud-minded delivery for scalable
            business applications with measurable performance improvements.
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
          </div>

          <ul className="mt-8 flex flex-wrap gap-2 text-sm font-semibold text-muted">
            <li className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-3">
              Bogota, Colombia
            </li>
            <li className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-3">
              drodriguezj1267@gmail.com
            </li>
          </ul>
        </div>

        <RevealOnScroll className="relative rounded-2xl border border-border bg-surface p-6">
          <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-2xl ring-2 ring-accent/50">
            <Image
              src="/avatar.png"
              alt="Daniel Rodriguez"
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">Full-stack execution.</h2>
          <p className="mt-2 text-muted">
            Focused on performance, maintainability, clean architecture, and business-oriented
            solutions.
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
```

Note: `overflow-hidden rounded-2xl` on the image wrapper is what strips the source image's teal
circular border from view — only the inner square portion is shown, masked to a rounded square,
with the component's own `ring-accent/50` replacing it visually.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx public/avatar.png
git commit -m "feat: add hero section with animated title and profile card"
```

---

### Task 8: About section

**Files:**
- Create: `components/About.tsx`

**Interfaces:**
- Produces: `export function About(): JSX.Element`.
- Consumes: `RevealOnScroll`, `revealItemVariants` from `@/components/RevealOnScroll` (Task 4).

- [ ] **Step 1: Create `components/About.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { RevealOnScroll, revealItemVariants } from "./RevealOnScroll";

const VALUES = [
  {
    title: "Performance-minded backend",
    description:
      "Optimizes APIs, queries, debugging flows, and data processing paths for faster and more consistent systems.",
  },
  {
    title: "Scalable product thinking",
    description:
      "Applies modular design, maintainable architecture, Git workflows, and production-style deployment practices.",
  },
  {
    title: "Client-facing collaboration",
    description:
      "Works directly with clients and small teams to translate needs into focused, business-oriented technical solutions.",
  },
];

export function About() {
  return (
    <section id="about" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">
            About me
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Developer profile built around practical delivery.
          </h2>
          <p className="mt-3 text-lg text-muted">
            Turning business requirements into reliable software through backend optimization,
            clean API design, and user-facing applications that work in real production
            environments.
          </p>
        </RevealOnScroll>

        <div className="grid gap-7 lg:grid-cols-2">
          <RevealOnScroll className="rounded-2xl border border-border bg-surface p-7">
            <h3 className="text-xl font-semibold">Professional profile</h3>
            <p className="mt-3 text-muted">
              I&apos;m a Full-Stack Developer with 3+ years of experience building and
              optimizing web applications using Java, Spring Boot, Angular, PostgreSQL, Oracle,
              MongoDB, Docker, virtual machines, JavaScript, and Python.
            </p>
            <p className="mt-3 text-muted">
              Improved query response times by up to 30% through backend optimization,
              efficient data handling, and large-scale contract data processing. Working with
              RESTful APIs, scalable system design, database performance, and collaborative
              client-facing development.
            </p>
          </RevealOnScroll>

          <RevealOnScroll stagger className="grid gap-3.5">
            {VALUES.map((value) => (
              <motion.div
                key={value.title}
                variants={revealItemVariants}
                className="rounded-md border border-border bg-surface p-5"
              >
                <h3 className="text-lg font-semibold">{value.title}</h3>
                <p className="mt-1 text-muted">{value.description}</p>
              </motion.div>
            ))}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/About.tsx
git commit -m "feat: add about section with staggered value cards"
```

---

### Task 9: Project card and portfolio section

**Files:**
- Create: `components/ProjectCard.tsx`
- Create: `components/Portfolio.tsx`

**Interfaces:**
- Produces: `export function ProjectCard(props: { project: Project }): JSX.Element` and
  `export function Portfolio(): JSX.Element`.
- Consumes: `Project` type from `@/data/projects` (Task 2), `projects` array from
  `@/data/projects` (Task 2), `RevealOnScroll`/`revealItemVariants` from
  `@/components/RevealOnScroll` (Task 4).

- [ ] **Step 1: Create `components/ProjectCard.tsx`**

```tsx
"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left) / bounds.width - 0.5);
    y.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="mt-1 text-muted">{project.description}</p>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-md border border-accent/30 bg-accent-soft px-3 text-sm font-bold text-accent"
            >
              Watch demo
            </a>
          )}
        </div>
        <span className="whitespace-nowrap rounded-full bg-bg px-2.5 py-1.5 text-xs font-extrabold text-accent">
          {project.tag}
        </span>
      </div>

      <ul className="mb-5 grid gap-2 text-sm text-text">
        {project.achievements.map((achievement) => (
          <li key={achievement} className="grid grid-cols-[8px_1fr] items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{achievement}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="inline-flex h-8 items-center rounded-full bg-bg px-2.5 text-xs font-bold text-text"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
```

- [ ] **Step 2: Create `components/Portfolio.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { RevealOnScroll, revealItemVariants } from "./RevealOnScroll";
import { ProjectCard } from "./ProjectCard";
import { projects } from "@/data/projects";

export function Portfolio() {
  return (
    <section id="portfolio" className="border-t border-border bg-surface/40 py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">
            Portfolio
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Selected projects with measurable engineering impact.
          </h2>
          <p className="mt-3 text-lg text-muted">
            A focused sample of full-stack platforms, backend services, real-time interfaces,
            and production-style infrastructure.
          </p>
        </RevealOnScroll>

        <RevealOnScroll stagger className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <motion.div key={project.title} variants={revealItemVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ProjectCard.tsx components/Portfolio.tsx
git commit -m "feat: add portfolio section with tilt-on-hover project cards"
```

---

### Task 10: Education section

**Files:**
- Create: `components/Education.tsx`

**Interfaces:**
- Produces: `export function Education(): JSX.Element`.
- Consumes: `educationItems` from `@/data/education` (Task 2), `RevealOnScroll`/
  `revealItemVariants` from `@/components/RevealOnScroll` (Task 4).

- [ ] **Step 1: Create `components/Education.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { RevealOnScroll, revealItemVariants } from "./RevealOnScroll";
import { educationItems } from "@/data/education";

export function Education() {
  return (
    <section id="education" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">
            Education
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Academic foundation and language capability.
          </h2>
          <p className="mt-3 text-lg text-muted">
            Systems engineering training supported by professional English studies and
            hands-on production development experience.
          </p>
        </RevealOnScroll>

        <RevealOnScroll stagger className="grid max-w-3xl gap-4">
          {educationItems.map((item) => (
            <motion.div
              key={item.institution}
              variants={revealItemVariants}
              className="grid grid-cols-[44px_1fr] gap-4 rounded-2xl border border-border bg-surface p-5"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-text text-bg">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m22 10-10-5-10 5 10 5 10-5Z" />
                  <path d="M6 12v5c3 2 9 2 12 0v-5" />
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-semibold">{item.institution}</h3>
                <p className="mt-1 text-muted">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/Education.tsx
git commit -m "feat: add education timeline section"
```

---

### Task 11: Skills section

**Files:**
- Create: `components/Skills.tsx`

**Interfaces:**
- Produces: `export function Skills(): JSX.Element`.
- Consumes: `skillCategories` from `@/data/skills` (Task 2), `RevealOnScroll`/
  `revealItemVariants` from `@/components/RevealOnScroll` (Task 4).

- [ ] **Step 1: Create `components/Skills.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { RevealOnScroll, revealItemVariants } from "./RevealOnScroll";
import { skillCategories } from "@/data/skills";

export function Skills() {
  return (
    <section id="skills" className="border-t border-border bg-surface/40 py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">
            Skills
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Stack organized for full-stack delivery.
          </h2>
          <p className="mt-3 text-lg text-muted">
            A practical toolkit spanning backend services, frontend interfaces, databases,
            deployment, collaboration, and agile delivery.
          </p>
        </RevealOnScroll>

        <RevealOnScroll stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <motion.div
              key={category.name}
              variants={revealItemVariants}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h3 className="mb-4 text-lg font-semibold">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex h-8 items-center rounded-full bg-bg px-3 text-xs font-bold text-text"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/Skills.tsx
git commit -m "feat: add skills section with categorized pill grids"
```

---

### Task 12: Contact form and contact section

**Files:**
- Create: `components/ContactForm.tsx`
- Create: `components/Contact.tsx`

**Interfaces:**
- Produces: `export function ContactForm(): JSX.Element` and `export function Contact(): JSX.Element`.
- Consumes: `validateContactField`, `CONTACT_FIELD_RULES`, `ContactFieldName` from
  `@/lib/validateContactField` (Task 3), `RevealOnScroll` from `@/components/RevealOnScroll`
  (Task 4).

- [ ] **Step 1: Create `components/ContactForm.tsx`**

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  CONTACT_FIELD_RULES,
  validateContactField,
  type ContactFieldName,
} from "@/lib/validateContactField";

const TEXT_FIELDS: { name: ContactFieldName; label: string; type: string; placeholder: string }[] = [
  { name: "name", label: "Name", type: "text", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "subject", label: "Subject", type: "text", placeholder: "Project or role inquiry" },
];

const EMPTY_VALUES: Record<ContactFieldName, string> = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState<Record<ContactFieldName, string>>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Record<ContactFieldName, string>>(EMPTY_VALUES);
  const [status, setStatus] = useState("");

  function handleChange(field: ContactFieldName, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateContactField(field, value) }));
    }
  }

  function handleBlur(field: ContactFieldName) {
    setErrors((prev) => ({ ...prev, [field]: validateContactField(field, values[field]) }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    const fieldNames = Object.keys(CONTACT_FIELD_RULES) as ContactFieldName[];
    const nextErrors = Object.fromEntries(
      fieldNames.map((field) => [field, validateContactField(field, values[field])])
    ) as Record<ContactFieldName, string>;
    setErrors(nextErrors);

    const isValid = Object.values(nextErrors).every((message) => message === "");
    if (!isValid) {
      setStatus("Please review the highlighted fields.");
      return;
    }

    const body = [
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      "",
      values.message.trim(),
    ].join("\n");
    const mailto = `mailto:drodriguezj1267@gmail.com?subject=${encodeURIComponent(
      values.subject.trim()
    )}&body=${encodeURIComponent(body)}`;

    setStatus("Opening your email client with the message prepared.");
    window.location.href = mailto;
    setValues(EMPTY_VALUES);
    setErrors(EMPTY_VALUES);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-border bg-surface p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        {TEXT_FIELDS.map((field) => (
          <div key={field.name} className="grid gap-1.5">
            <label htmlFor={field.name} className="text-sm font-bold text-text">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={(event) => handleChange(field.name, event.target.value)}
              onBlur={() => handleBlur(field.name)}
              aria-invalid={Boolean(errors[field.name])}
              className="h-11 rounded-md border border-border bg-bg px-3 text-text outline-none focus:border-accent"
            />
            <span className="min-h-[18px] text-sm font-semibold text-red-400">
              {errors[field.name]}
            </span>
          </div>
        ))}

        <div className="grid gap-1.5 sm:col-span-2">
          <label htmlFor="message" className="text-sm font-bold text-text">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Tell Daniel what you need built, optimized, or discussed."
            value={values.message}
            onChange={(event) => handleChange("message", event.target.value)}
            onBlur={() => handleBlur("message")}
            aria-invalid={Boolean(errors.message)}
            className="min-h-[132px] resize-y rounded-md border border-border bg-bg px-3 py-2.5 text-text outline-none focus:border-accent"
          />
          <span className="min-h-[18px] text-sm font-semibold text-red-400">{errors.message}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <motion.button
          type="submit"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 font-bold text-bg"
        >
          Send message
        </motion.button>
        <p role="status" aria-live="polite" className="font-bold text-accent">
          {status}
        </p>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Create `components/Contact.tsx`**

```tsx
import { RevealOnScroll } from "./RevealOnScroll";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="contact" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">
            Contact
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Ready to discuss a role, project, or collaboration.
          </h2>
          <p className="mt-3 text-lg text-muted">
            Use the form or contact me directly by email or phone. The form validates your
            message and opens your email client with the content prepared.
          </p>
        </RevealOnScroll>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <RevealOnScroll className="rounded-2xl border border-border bg-surface p-7">
            <h3 className="text-lg font-semibold">Direct contact</h3>
            <p className="mt-3 text-muted">
              Based in Bogota, Colombia. Available for full-stack development roles, web
              platforms, API work, database optimization, and production support.
            </p>
            <ul className="mt-6 grid gap-3">
              <li>
                <a
                  href="mailto:drodriguezj1267@gmail.com"
                  className="flex items-center gap-3 font-bold text-text"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-accent-soft text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M4 4h16v16H4z" />
                      <path d="m22 6-10 7L2 6" />
                    </svg>
                  </span>
                  drodriguezj1267@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+573184793984"
                  className="flex items-center gap-3 font-bold text-text"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-accent-soft text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.11 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8.05 9.9a16 16 0 0 0 6.05 6.05l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  +57 318 479 3984
                </a>
              </li>
              <li className="flex items-center gap-3 font-bold text-text">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-accent-soft text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                Bogota, Colombia
              </li>
            </ul>
          </RevealOnScroll>

          <RevealOnScroll>
            <ContactForm />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
```

`Contact.tsx` itself has no Framer Motion usage directly (it delegates to `RevealOnScroll` and
`ContactForm`, both already client components), so it does not need `"use client"`.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ContactForm.tsx components/Contact.tsx
git commit -m "feat: add contact section with validated mailto form"
```

---

### Task 13: Footer, page assembly, and final verification

**Files:**
- Create: `components/Footer.tsx`
- Modify: `app/page.tsx` (replace entire contents)

**Interfaces:**
- Produces: `export function Footer(): JSX.Element`; `app/page.tsx` default export renders the
  full page.
- Consumes: every component from Tasks 4–12 (`Nav`, `Hero`, `About`, `Portfolio`, `Education`,
  `Skills`, `Contact`).

- [ ] **Step 1: Create `components/Footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-8 text-sm text-muted">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
        <span>&copy; {new Date().getFullYear()} Daniel Rodriguez. Full-Stack Developer.</span>
        <a href="#home" className="font-bold text-text hover:text-accent">
          Back to top
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Replace `app/page.tsx`**

```tsx
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Portfolio } from "@/components/Portfolio";
import { Education } from "@/components/Education";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Portfolio />
        <Education />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — `6 passed` (the `validateContactField` suite from Task 3; this is the only
test file in the project).

- [ ] **Step 4: Type-check the whole project**

Run: `npx tsc --noEmit`
Expected: no errors (exit 0).

- [ ] **Step 5: Lint the whole project**

Run: `npm run lint`
Expected: no errors (warnings about unused `_` patterns or similar are acceptable if any
appear; there should be none given the code above, but if ESLint flags something, fix it
before proceeding).

- [ ] **Step 6: Production build**

Run: `npm run build`
Expected: build completes successfully, ending with a route summary that includes `/` as a
static or dynamic route, no build errors.

- [ ] **Step 7: Manual smoke test in the browser**

Run: `npm run dev` (leave running)

Open `http://localhost:3000` in a browser and verify:
- Dark background, coral accents visible (status dot, "production-ready" text, buttons).
- Hero title animates in word-by-word on load.
- Scrolling reveals each section (About, Portfolio, Education, Skills, Contact) with a
  fade/slide-in, and cards within Portfolio/Skills/About stagger in.
- Hovering a project card tilts it slightly toward the cursor.
- Moving the mouse shows the custom cursor (dot that grows over links/buttons) — skip this
  check if testing with a touch-only device.
- Nav active-section pill morphs between links while scrolling; mobile menu (narrow viewport)
  opens/closes with the animated hamburger icon.
- Avatar renders in the hero card with no visible teal border, just the component's coral ring.
- Submitting the contact form with empty fields shows inline errors; filling it out validly and
  submitting attempts to open a `mailto:` link with the subject/body populated.
- Reduced-motion: with OS-level "reduce motion" enabled, reload and confirm large animations no
  longer play (the custom cursor also disables itself).

Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 8: Commit**

```bash
git add components/Footer.tsx app/page.tsx
git commit -m "feat: assemble full page with footer"
```

---

## Post-plan note

No deploy is performed as part of this plan — the project is Vercel-compatible by default
(standard Next.js app, no custom server). Deploying is a separate, explicit step the user can
take later (e.g. `vercel` CLI or connecting the GitHub repo to a Vercel project) once they're
ready to publish.
