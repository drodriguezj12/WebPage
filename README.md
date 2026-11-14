# Daniel Rodriguez — Portfolio

Personal site: **https://danielrodriguezportfolio.vercel.app**

A single page built with the Next.js App Router. Each project is presented as its own
product section: Pulse with clips cut from its demo, the SECOP II platform with its
measured results, SmartPark with an animated architecture diagram. Then experience,
stack and contact. The contact form delivers straight to my inbox.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
GSAP + ScrollTrigger · Lenis (smooth scroll) · Vitest ·
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
components/         SiteNav, SiteFooter, PillLink, ClipVideo, YouTubeEmbed, ContactForm, icons
  sections/         one component per page section (Hero, Statement, PulseSection,
                    SecopSection, SmartParkSection, Experience, Stack, Contact)
  project/          pieces shared by the project sections, and the SmartPark diagram
  motion/           RevealObserver, ScaleStage, WordReveal, CountUp, SmoothScrollProvider
data/               profile.ts and projects.ts: all the content lives here
lib/                motion tokens, the reduced-motion hook, Lenis setup, site URLs,
                    contact validation
public/projects/    Pulse clips (a wide and a tall cut of each) and their posters
docs/superpowers/   design specs
```

Colours are semantic tokens set per section (`data-theme`, `data-accent`) in
`app/globals.css`. Entrance animation only has a hidden starting state under
`html.motion`, which an inline script sets before first paint unless the visitor asked
for reduced motion.

## Motion

Three mechanisms, each for one job:

- **First screen:** CSS keyframes, so the hero is visible from first paint.
- **Entrances:** one `IntersectionObserver` (`RevealObserver`) flips `data-revealed` on
  elements carrying `data-reveal`; CSS does the transition.
- **Scroll-linked:** `ScaleStage` (the Pulse clip growing to full width) and
  `WordReveal` (the statement), driven by GSAP ScrollTrigger on Lenis's clock.

The guardrails are requirements, not preferences:

- `prefers-reduced-motion: reduce` turns off every entrance, the growing stage, the
  travelling packets and clip autoplay. The site stays complete and readable, just still.
- The page is readable without JavaScript: all copy is server-rendered and nothing is
  hidden waiting for a script.
- Only `transform` and `opacity` are animated.
- Clips download only when they come near the viewport, play only while on screen, and
  always have a pause control. The YouTube player loads only when play is pressed.
