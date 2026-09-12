# Portfolio redesign v2 — design spec

Date: 2026-09-09

## Context

The current site was built in June 2026 (see `2026-06-18-portfolio-redesign-design.md`):
dark theme, coral `#ff6a3d` accent, Geist + Inter, framer-motion reveals, custom cursor,
tilt cards. It works, it is competent, and it looks like a large number of other
developer portfolios built from the same vocabulary.

The goal of this redesign is to make the site memorable to two audiences that pull in
opposite directions: designers, who reward risk and craft, and recruiters, who reward
being able to tell in fifteen seconds what this person does. Every decision below was
made with that tension in mind, and where the two conflict the spec says which one won.

Content substance does not change. The facts — three years of experience, the 30% query
improvement, B2 English, the education, the four projects — stay exactly as they are.

## Goals

- A site a designer would stop on and a recruiter could still read at a glance.
- Show the work in the first screen instead of promising it below the fold.
- Give Pulse, the only project with public code, the weight it earns.
- Keep everything that already works: the contact pipeline, SEO files, tests.

## Non-goals

- No per-project case-study pages. The other three projects have no public repository
  or material, so their pages would be visibly thinner than Pulse's and the asymmetry
  would read as padding.
- No light/dark toggle. The design commits to one look.
- No CMS. Content stays in typed `data/*.ts` files.
- No change to the contact backend, the API route, or the email flow.

## Decisions

Each was chosen from alternatives; the rejected ones are recorded so we do not relitigate
them later.

| Decision | Chosen | Rejected |
|---|---|---|
| Visual direction | Editorial, cinematic | Industrial brutalism (too risky with corporate recruiters); light minimalism; polishing the current design |
| Scope | New narrative, single page, rewritten copy | Reskin only; full rebuild with project pages |
| Accent | Pale steel `#CBD5E1` | Keeping coral; electric cyan; signal lime; frost blue |
| Display type | Big Shoulders 800, uppercase | Instrument Serif; Inter Tight; Fraunces; Anton; Archivo Black; Syne; Bricolage Grotesque; Unbounded |
| Body type | Inter, with JetBrains Mono for labels and figures | Inter alone; IBM Plex Sans |
| Cover layout | Headline plus numbered project index | Full-bleed headline; editorial split |
| Motion | Maximum: WebGL background, magnetic cursor, section transitions | Cinematic without WebGL; restrained reveals |
| Animation runtime | GSAP + ScrollTrigger + Lenis + OGL | framer-motion (removed); three.js (6-14x the weight for no visual gain here); hand-written canvas 2D |

Two notes on consequences the author accepted knowingly:

**Condensed uppercase display type only works for headlines.** It cannot carry body
copy, and a very large condensed headline breaks awkwardly on narrow screens. This is why
a second and third typeface are part of the system rather than a nicety, and why the
cover headline has explicit per-breakpoint line breaks (see below).

**Maximum motion costs performance.** The mitigation is not to avoid the tools but to
choose them by measurement, and to keep every heavy thing off the critical path. Measured
in this project, gzipped: GSAP core 27.6 KB, ScrollTrigger 17.5 KB, Lenis 5.3 KB, OGL
19.6 KB — against three.js at 128-280 KB. three.js earns its weight when there are models,
lights and materials; for a shader background and image distortion it buys nothing OGL
does not. framer-motion is removed rather than kept alongside GSAP: two animation runtimes
competing for the same scroll is a source of bugs, not a capability. Net effect, the site
gains roughly 20 KB over what it ships today and does considerably more.

## Visual system

### Colour

| Token | Value | Use |
|---|---|---|
| `bg` | `#08080A` | Page background |
| `surface` | `#0E0E11` | Cards, raised panels |
| `border` | `#1B1B20` | Hairlines, card edges |
| `text` | `#F2F2F4` | Headlines, primary copy |
| `muted` | `#86868F` | Body copy, secondary |
| `dim` | `#6F6F78` | Mono labels, numbering |
| `steel` | `#CBD5E1` | The accent: emphasised words, primary button, active section |
| `signal` | `#F5A524` | Reserved. Exactly one use on the page: the "available for work" dot |

The palette is deliberately almost neutral. With no colour doing the work, hierarchy has
to come from type, scale, and space — which is the point of the direction. `signal` is
the single exception, and its power comes from scarcity: it must not be reused, not for
links, not for hover states, not for anything else.

### Type

| Role | Face | Treatment |
|---|---|---|
| Display | Big Shoulders 800 | Uppercase, `letter-spacing: -0.01em`, `line-height: 0.86–0.92` |
| Body | Inter 400/500/600 | `line-height: 1.6`, max 46ch measure |
| Label | JetBrains Mono 400/500 | 10–11px, `letter-spacing: 0.14–0.2em`, uppercase |

Google renamed this family: what was published as "Big Shoulders Display" is now simply
"Big Shoulders", and it is the name `next/font/google` exposes. The Inline and Stencil
cuts are different faces and are not used.

All three load through `next/font` — self-hosted, no runtime request to Google, no layout
shift.

Display sizes: 130px at `xl`, 96px at `lg`, 68px at `md`, 44px at base. The cover headline
carries explicit break points per breakpoint rather than relying on natural wrapping,
because condensed type wraps badly at large sizes.

The 130px `xl` size is additionally height-aware: at 1280px wide and up, it steps down
to 108px under 900px of inner height, 98px under 864px, and 84px under 768px (with a
matching reduction in the cover's own vertical gaps at the two ends of that range). A
tall 130px headline on a common laptop viewport pushed the project index — the design's
one concession to a recruiter skimming — below the first screen; shrinking the headline
on short viewports keeps the index on it.

### Grid and space

12 columns, 1440px maximum width, 24px gutter. Section rhythm on an 8px scale, with 160px
of vertical air between sections at desktop and 96px at mobile.

A 1px grid overlay at 4% opacity is visible in the cover and the Pulse section — the
technical-drawing cue the signage type asks for. It is decorative and `aria-hidden`.

## Structure and narrative

Six blocks. The order is the argument: what you do, proof, more proof, how you work, where
you come from, how to reach you.

**01 — Cover.** Name and location in mono at the top. Large headline. Below it, the four
projects as a numbered index with their one-word discipline (`REAL-TIME`, `EVENT-DRIVEN`,
`AI CHATBOT`, `PRODUCTION`). Generative field behind. The index is not decoration: it puts
the body of work on the first screen, which is the concession this design makes to
recruiters, and it earns the cinematic treatment everywhere else.

**02 — Pulse, full section.** The only project with public code gets its own pinned
sequence in three beats: what it is, the demo video, and the three technical decisions that
survive scrutiny — PL/pgSQL stored procedures, keyset pagination, 95 tests against a real
PostgreSQL. Real screenshots and the real-time GIF come from the Pulse repository. Links
out to both the video and the source.

**03 — Other work.** SmartPark, the commerce platform and the contract system, in a
compact grid, each with its existing demo video.

**04 — How I work.** Replaces the generic "About me". Three claims, each with evidence
attached rather than adjectives: query optimisation with the 30% figure, integration tests
against real infrastructure, delivery in production at RACO.

**05 — Track.** Education and stack compressed into one horizontal band.

**06 — Contact.** The existing form, restyled only. Logic, validation, API route and email
delivery are untouched.

### Copy

Headlines and body copy are rewritten in English, matching the current site, the CV and
the Open Graph card. Every number stays as it is. Copy leads with what was built and what
it does, not with self-description: "systems that hold up in production", not "passionate
developer".

### Imagery

The site currently ships no screenshots at all. This redesign adds:

- Pulse: three of the screenshots committed to `drodriguezj12/pulse-social-network`
  under `docs/screenshots/` (feed, create post, profile — not login), optimised to WebP
  and shown beside the description in the feature's first beat. `realtime.gif` is not
  shipped: at 2.6 MB it would outweigh the rest of the section's images combined for
  something the demo video already shows, in motion, for less.
- The other three projects: generated abstract covers in the steel palette, so the grid
  reads as designed rather than as three empty boxes.
- All images served through `next/image` with explicit dimensions, lazy by default.

## Identity beyond the page

A redesign that stops at the page leaves the visitor's first impression on the old
system. Three surfaces carry the identity outside the layout and are rebuilt with it:

**Open Graph card** (`app/opengraph-image.tsx`). Currently the coral design. Rebuilt in
the steel palette with Big Shoulders as the headline face, so the preview that appears in
LinkedIn, WhatsApp and email matches the site it opens. `ImageResponse` cannot use
`next/font` the way the page does, so the two display faces are loaded as font files at
the edge; if that proves unreliable the card falls back to a weight-and-scale composition
in a system face rather than shipping a mismatched typeface.

**Icon** (`app/icon.tsx`). The `DR` monogram is redrawn in the new type and palette. An
SVG favicon cannot load a web font, so a literal `icon.svg` redraw could only set the
mark in a system font — shipped instead as an `ImageResponse` route, loading the same
Big Shoulders file `opengraph-image.tsx` does, generated once at build time (static, not
per-request).

**404 page** (`app/not-found.tsx`). Currently the Next.js default, which is the one screen
on the site that says nothing about who built it. Gets the same grid, type and steel
treatment, with a single route back to the cover. Static: no shader, no pinning, nothing
that costs weight on a page nobody plans to visit. It does still inherit the root
layout's `MagneticCursor`, so GSAP loads there too — accepted, since it is the same chunk
already cached from the home page for anyone who reaches a 404 by following a broken
link from it.

## Motion system

Durations and easings live in `lib/motion.ts` so the whole site moves with one hand.
Baseline: 600–800ms for section-scale movement, 200–300ms for interface feedback, custom
cubic-bezier with a slow exit.

| Element | Behaviour |
|---|---|
| Background | WebGL shader field (OGL), slow drift, reacting to the pointer. Capped pixel ratio, 30fps, paused off-screen, loaded after first paint |
| Cover headline and index | Pure CSS (`@keyframes` driven by inline `animation-delay` steps), not the GSAP `SplitText`/`Stagger` primitives used everywhere else. The headline's lines rise behind a mask, one at a time, mirroring `SplitText`; the index items below it just fade in and rise slightly, mirroring `Stagger`. The page's first screen must be visible from first paint, run once with no JavaScript, and can never be hidden-then-replayed by hydration racing the reveal — a risk a GSAP `set`-to-hidden setup carries and a CSS animation, active from the stylesheet before any script runs, does not |
| Mono labels | Short character scramble before settling |
| Header | Collapses on scroll into a thin bar showing the active section number and name |
| Pulse section | Pinned while its three beats advance with the scroll. Height-aware: below common laptop viewport heights, the screenshots and the demo video shrink (and the two supporting screenshots, then the whole screenshot block on narrow-and-short mobile, drop) so the active beat and the CTA footer both stay fully on screen; a shorter beat is centred in the shared grid cell rather than sitting at its top. Keyboard focus that lands on a beat or the footer while it isn't fully visible — under the fixed header, or below the fold — jumps the pin to the right beat if that's the cause, and otherwise releases the pin and scrolls the element fully into view |
| Figures | `3+`, `30%`, `95` count up on entry |
| Project cards | Enter in sequence; lifts (translate, not the entry transform) on hover |
| Cursor | Magnetic ring that grows and pulls toward interactive elements, layered on top of — not replacing — the native pointer. Hiding the OS cursor centrally sounds cleaner, but every link, button and input brings its own cursor back regardless, so the visitor saw two; the native pointer also carries precision and the text I-beam a custom ring cannot |
| Section changes | Dropped. The pinned beats and the per-section reveals already carry the transitions between sections; a global wipe on top of them would double the movement at every boundary for no added clarity |

### Guardrails

These are requirements, not preferences:

- `prefers-reduced-motion: reduce` disables the shader, the pin, the scramble and the
  count-up. The site stays complete and readable.
- `pointer: coarse` disables the shader and the magnetic cursor. Phones get the typography
  and the reveals, not the parts that cost battery.
- Nothing hijacks scrolling. Pinned sections advance with the scroll and release it.
- No animation gates content. Text is in the DOM and readable with JavaScript disabled.
- The shader canvas is `aria-hidden` and never receives focus.

## Architecture

New motion primitives, each with one responsibility and no knowledge of the sections that
use them:

**Dependencies.** `gsap` (with ScrollTrigger), `lenis`, `ogl` are added; `framer-motion`
is removed.

```
components/motion/
  ShaderField.tsx      WebGL background (OGL), dynamically imported
  SplitText.tsx        line-by-line reveal
  Stagger.tsx          sequenced entry for a group
  CountUp.tsx          figures counting on entry
  MagneticCursor.tsx   replaces CustomCursor
  Pinned.tsx           pinned section with beats
  ScrambleText.tsx     mono label settle
lib/motion.ts          durations, easings, GSAP defaults
lib/useReducedMotion.ts  single source for the two opt-out conditions
lib/smoothScroll.ts    Lenis setup, wired to ScrollTrigger
```

Sections rewritten: `Cover`, `PulseFeature`, `Work`, `HowIWork`, `Track`, `Contact`.

Also rebuilt: `app/opengraph-image.tsx`, `app/icon.tsx` (generated, not a static SVG),
and a new `app/not-found.tsx`.

Kept untouched: `data/*.ts`, `ContactForm`, `app/api/contact`, `lib/site.ts`,
`lib/contactMessage.ts`, `lib/validateContactField.ts`, `app/robots.ts`, `app/sitemap.ts`,
the 13 existing tests.

Removed: `RevealOnScroll`, `TechMarquee`, `CustomCursor`, `Hero`, `About`, `Portfolio`,
`Skills`, `Education`.

`VideoEmbed` and `ProjectCard` are restyled but keep their current behaviour, including
click-to-play and the `repoUrl` link.

`data/projects.ts` gains an optional `cover` field for the project imagery, an optional
`discipline` field for the one-word label in the cover index, and an optional
`screenshots` array (`{ src, alt, label, width, height }`) for real product imagery in a
pinned beat — used only by Pulse. All optional, so nothing breaks if a project lacks
them.

## Performance

The budget is stated as an outcome, not a byte count. A byte ceiling on the whole bundle
would be the wrong instrument: what a visitor feels is when the first screen appears and
whether scrolling stutters, not what the total transfer adds up to.

**Targets**

- The headline paints in under 2.5s on a mid-range phone over 4G.
- Scrolling holds 60fps on desktop and does not stutter on a mid-range phone.
- Nothing heavy blocks first paint.

**Rules that produce those targets**

- The WebGL background is imported dynamically and initialised after first paint. It never
  sits on the critical path, and the page is complete without it.
- It renders at a capped pixel ratio, throttles to 30fps, and stops entirely when its
  section leaves the viewport or the tab is hidden.
- It does not run at all on `pointer: coarse` or under `prefers-reduced-motion`.
- Images go through `next/image`, sized, in AVIF/WebP.
- Fonts are self-hosted and subset through `next/font`.

**Reference point.** The site as it stands today serves 242 KB of gzipped JavaScript
across 15 files, with no background, no scroll choreography and no imagery. That is the
number any claim of "heavier" or "lighter" should be measured against, and it is measured
from the build output, not estimated.

If the targets are missed, the order of sacrifice is fixed: shader complexity first, then
the pinned sequence, then the count-ups. Typography, layout and legibility never give.

## Accessibility

Contrast: `text` on `bg` is well past AA; `muted` on `bg` clears AA for body sizes; mono
labels at `dim` are decorative and never carry information that appears nowhere else.

Focus states are visible and use `steel`, not the removal of an outline. The magnetic
cursor never replaces a real focus ring. All interactive elements remain reachable by
keyboard, including the project index on the cover.

The pinned section needs explicit handling, because a naive implementation traps keyboard
users: tabbing moves focus to an element the pin is holding off-screen, and the page
appears frozen. Focus entering any beat scrolls the timeline to that beat rather than the
browser scrolling inside a pinned container, and every beat's content stays in the tab
order in reading order. This is correctness, not polish.

## Verification

- `npm run lint`, `npm test`, `npm run build` after each slice.
- Bundle size measured from the build output and compared against the 242 KB baseline.
- Manual checks of the `prefers-reduced-motion` path, the `pointer: coarse` path, and the
  page with JavaScript disabled.
- The 404 and the Open Graph card are checked as rendered output, not just as code.
- Existing tests must stay green; new pure logic (scramble, count-up stepping, motion
  helpers) gets unit tests. Animation itself is verified by eye, not by test.

**Known limitation:** the preview pane freezes framer-motion when it lacks focus, so
screenshots of animated sections come back blank. Structure, measurements and state can be
verified programmatically; the judgement on whether the motion *feels* right has to be
made by the author in a real browser.

## Delivery

Work happens on a branch, not on `main`. Vercel builds a preview URL for it while the
current site stays live. The author reviews the preview, we iterate, and the branch merges
only on his approval.

## Risks

- **Condensed uppercase at small widths.** Mitigated with per-breakpoint line breaks and a
  lower display size at base; needs a real check on a phone.
- **Maximum motion on mid-range hardware.** Mitigated by choosing OGL over three.js, the
  dynamic import, the fps and pixel-ratio caps, the off-screen pause and the coarse-pointer
  opt-out. Still the first thing to cut if the preview feels heavy.
- **Consolidating on GSAP.** Removing framer-motion means every existing animation is
  rewritten rather than ported. That is deliberate — the sections are being rewritten
  anyway — but it does mean no component keeps its old motion code.
- **Pinned section reflow on load (accepted).** The server renders the Pulse beats
  stacked, because that is the only layout readable without JavaScript or under reduced
  motion. After hydration, visitors who allow motion get the overlapping pinned layout, so
  the beats fold into one cell. On arrival at `#pulse` itself the fold is harmless — the
  section's top edge does not move, and its content stays fully visible before and after.
  The real cost showed up one level down: ScrollTrigger inserts the pin's spacer *after*
  the browser has already made its own anchor jump, so a deep link to any section after
  Pulse (`#work`, `#approach`, `#track`, `#contact`) landed roughly two screens short of
  its target, on the layout as it existed before the pin spacer pushed everything below
  it down. Fixed by re-applying `location.hash` once the pin spacing exists — see
  `lib/deepLinkHash.ts` and `components/motion/Pinned.tsx` for the exact trigger and
  cutoff. Rejected alternative: an inline head script plus CSS that pre-renders the
  pinned state, which needs a hydration-warning suppression on `<html>` and duplicates
  animation state in CSS for a narrow case.
- **Near-neutral palette reading as lifeless.** This is the risk the direction accepts.
  The counterweights are type scale, generous space, and the single `signal` accent.
