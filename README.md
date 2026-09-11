# Daniel Rodriguez — Portfolio

Personal site: **https://danielrodriguezportfolio.vercel.app**

A single-page narrative built with the Next.js App Router: a cover with the project
index, a pinned Pulse feature section, the other projects, how I work, education and
stack, and contact. The contact form delivers straight to my inbox.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
GSAP + ScrollTrigger · Lenis (smooth scroll) · OGL (WebGL background) · Vitest ·
Resend for transactional email · deployed on Vercel.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script | Purpose |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest suite |

## Environment

Everything runs without configuration; email is the exception. Without a key the contact
form falls back to opening the visitor's own mail client, so nothing breaks — messages
just travel a slower path.

| Variable | Required | Default | What it does |
|---|---|---|---|
| `RESEND_API_KEY` | for email | — | Resend API key. Without it `/api/contact` answers `503` and the form falls back to `mailto:`. |
| `CONTACT_TO_EMAIL` | no | `drodriguezj1267@gmail.com` | Where form messages are delivered. |
| `CONTACT_FROM_EMAIL` | no | `Portfolio <onboarding@resend.dev>` | Sender. Resend's shared address needs no domain of your own, but only delivers to the address that registered the account; a verified domain lifts that. |
| `NEXT_PUBLIC_SITE_URL` | no | production domain | Origin for canonical links, Open Graph images and the sitemap. |

Set them in Vercel under Settings → Environment Variables, or in a local `.env.local`.

## Structure

```
app/                layout, page, icon, opengraph-image, robots, sitemap, 404
  api/contact       route handler that validates and sends the contact message
components/         shared components: SiteHeader, SiteFooter, ProjectCard, VideoEmbed,
                    SectionHeader, ContactForm
  sections/         one component per page section (Cover, PulseFeature, Work,
                    HowIWork, Track, ContactSection)
  motion/           motion primitives (ShaderField, Pinned, Stagger, SplitText,
                    ScrambleText, CountUp, MagneticCursor, SmoothScrollProvider) —
                    each owns one behaviour and knows nothing about the sections
                    that use it
data/               projects, skills and education — the content lives here
lib/                motion tokens (lib/motion.ts), the reduced-motion/coarse-pointer
                    hook, scroll control, the deep-link hash fix for the pinned
                    section, site URLs, and contact validation — all unit tested
```

To add a project, append an entry to `data/projects.ts`: `demoUrl` renders a
click-to-play YouTube embed, `repoUrl` adds a link to the source, `cover` shows an
image on the project card, and `screenshots` (an array of `{ src, alt, label, width,
height }`) shows real product screenshots — currently used only for Pulse's featured
section. All four are optional.

## Motion

Every duration and easing curve comes from `lib/motion.ts`, so the whole site moves
with one hand. The guardrails are requirements, not preferences:

- `prefers-reduced-motion: reduce` turns off the shader, the pin, the scramble and the
  count-up. The site stays complete and readable, just still.
- `pointer: coarse` turns off the shader and the magnetic cursor. Touch devices get the
  typography and the reveals, not the parts that cost battery.
- The page is readable without JavaScript: all copy is server-rendered, and motion is
  an enhancement layered on top rather than something content depends on.
- The WebGL background loads after first paint (never on the critical path) and pauses
  itself when its section is off-screen or the tab is hidden.
