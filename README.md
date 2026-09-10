# Daniel Rodriguez — Portfolio

Personal site: **https://danielrodriguezportfolio.vercel.app**

A single page — hero, about, projects, education, skills and contact — built with the
Next.js App Router. Projects carry an embedded demo video and, where the code is public,
a link to the repository. The contact form delivers straight to my inbox.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
framer-motion · Vitest · Resend for transactional email · deployed on Vercel.

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
app/          layout, page, opengraph-image, icon, robots, sitemap
  api/contact route handler that validates and sends the contact message
components/   one component per section, plus Nav, Footer and the visual effects
data/         projects, skills and education — the content lives here
lib/          site URLs, contact validation and message building (unit tested)
```

To add a project, append an entry to `data/projects.ts`: `demoUrl` renders a
click-to-play YouTube embed, and `repoUrl` adds a link to the source. Both are optional.
