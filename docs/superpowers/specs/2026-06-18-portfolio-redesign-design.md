# Portfolio redesign — design spec

## Context

Existing portfolio is a single static `index.html` (vanilla CSS/JS, teal/white theme) at
`C:\Users\frapa\OneDrive\Desktop\index.html`. Goal: rebuild as a modern, professional,
visually striking site on a current stack, keeping the same content (about, portfolio,
education, skills, contact) but with a new design system and richer animation.

## Stack

- Next.js 14 (App Router), TypeScript
- Tailwind CSS
- Framer Motion for animation
- `next/font` for Geist (display) + Inter (body) — no external font requests
- Deploy target: Vercel (no deploy performed now; project just needs to be Vercel-compatible,
  which Next.js is by default — no extra config required)

## Project structure

```
portfolio/
  app/
    layout.tsx        # fonts, metadata, dark theme
    page.tsx           # assembles sections
    globals.css        # tailwind + design tokens
  components/
    Nav.tsx
    Hero.tsx
    About.tsx
    Portfolio.tsx
    ProjectCard.tsx
    Education.tsx
    Skills.tsx
    Contact.tsx
    ContactForm.tsx
    Footer.tsx
    CustomCursor.tsx
    RevealOnScroll.tsx   # generic Framer Motion scroll-reveal wrapper
  data/
    projects.ts
    skills.ts
    education.ts
  public/
    avatar.png
```

Content lives in typed `data/*.ts` files, not hardcoded in JSX, so it's easy to edit later
without touching component logic.

## Visual design

**Theme:** dark, fixed (no light/dark toggle).

**Palette:**
- Background base `#0a0a0c`, surface `#121216`, border `#1f1f24`
- Text strong `#f4f4f5`, muted `#a1a1aa`
- Accent coral `#ff6a3d`, coral-soft (pill backgrounds) `#2a0d02`
- Subtle coral glow on CTAs and the hero status dot

**Typography:** Geist for headings/display (large, tight leading, tight letter-spacing),
Inter for body text. Confirmed via mockup comparison against a serif-editorial option and a
Space Grotesk option — Geist/Inter chosen for clean, modern, dev-portfolio feel.

**Layout:** airy section spacing (~120px vertical on desktop), asymmetric editorial grid in
the hero (text block + floating profile card), same six sections as the original site.

**Avatar:** user-supplied image at `Projects/avatar.png`, copied to `public/avatar.png`.
Original image has a teal circular border that clashes with the new coral accent — strip/crop
that border in the component (render as a plain circle mask, no inherited border) and apply
the site's own subtle coral ring instead.

## Animation (elaborate level)

- **Scroll reveal with stagger:** each section fades + translates in; children (cards, pills)
  cascade via Framer's `staggerChildren`.
- **Hero:** subtle parallax on the decorative grid/blob on scroll; title reveals word-by-word.
- **Project cards:** 3D tilt on hover (rotateX/Y driven by cursor position) + coral glow border.
- **Custom cursor:** dot + ring that grows over links/buttons.
- **Nav:** active-section indicator morphs between links using a shared `layoutId`.
- **Buttons:** spring micro-interaction on hover/tap.
- Respect `prefers-reduced-motion` — disable non-essential motion, matching the original
  site's existing behavior.

## Components and content (parity with original)

Same content as `index.html`, redistributed into components:

- **Nav** — sticky, blurred background, "DR" logo, links with morphing active indicator,
  animated hamburger → X mobile menu.
- **Hero** — pulsing status dot + kicker, large title with coral-accented "production-ready",
  two CTAs (View portfolio / Contact), mini-stat list (3+ years, 30%, B2), avatar in a
  floating profile card.
- **About** — profile copy + 3 value cards (performance-minded backend, scalable product
  thinking, client-facing collaboration).
- **Portfolio** — 3 project cards (Smart Parking Management Platform, E-commerce Platform with
  AI Chatbot Integration, Contract Data Processing System) with tilt hover, tech tags, demo
  links where applicable (YouTube links preserved).
- **Education** — vertical timeline (Universidad El Bosque, Instituto Colombo Americano).
- **Skills** — 6 category cards (Languages, Backend, Frontend, Databases, Cloud & DevOps,
  Tools & Methods) with the same pill lists as the original.
- **Contact** — direct contact info (email/phone/location) + client-validated form using the
  same `mailto:` composition logic as the original (no backend).
- **Footer** — copyright + back-to-top link.

## Out of scope

- No CMS, no backend/API routes — content is static TS data.
- No light/dark toggle.
- No actual Vercel deploy in this work — only Vercel-compatible project structure (Next.js
  defaults satisfy this).
