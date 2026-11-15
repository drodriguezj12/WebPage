# Portfolio redesign v3 — design spec

Date: 2026-11-14

## Context

v2 (September 2026) was dark, condensed-uppercase and WebGL-backed. It was distinctive,
but it presented every project as a card and showed almost none of the work itself. This
redesign treats each project as a product page: one section per project, the product on
screen, a few numbers that were actually measured.

The content was brought in line with the CV in a separate change before this one, and
that content is the source of truth here. Nothing in this redesign adds a claim.

## Goals

- A recruiter or CTO understands who this is and what he builds from the first screen.
- Each project gets its own section and its own visual treatment, not a card.
- The site is a product, not a demo: fast, responsive, keyboard-navigable, and correct
  with reduced motion or without JavaScript.

## Non-goals

- Per-project pages, a Spanish version, a light/dark toggle, a CMS.
- Changes to the contact API route or the email flow.

## Decisions

| Decision | Chosen | Rejected |
|---|---|---|
| Concept | Product pages: one full section per project | A single continuous narrative; an editorial index with case-study pages |
| Colour | Monochrome; the only colour is each project's own accent | A site-wide accent; gradients |
| Surfaces | Light page with dark project panels alternating | All dark (v2); all light |
| Type | The system's San Francisco where it exists, Inter (with its display optical size) everywhere else; SF Mono / Geist Mono for labels | Serving SF Pro as a web font (its licence does not allow it); Big Shoulders (v2); Geist |
| Navigation | Floating dark-glass island | Full-width bar glued to the top |
| Motion runtime | GSAP + ScrollTrigger + Lenis, plus CSS | OGL shader background, magnetic cursor, scramble text (all removed) |
| Pulse media | Short silent clips cut from the demo recording | Embedding the full recording; screenshots |
| SECOP II media | Two clips cut from the demo recording (search, assistant) plus a drawn illustration of what the assistant does behind the answer | The full recording, which shows a mailbox and an email address |
| SmartPark media | Animated architecture diagram + click-to-play YouTube demo | A static cover image |

## Visual system

Two themes, set per section with `data-theme`, expose the same semantic tokens (`bg`,
`raised`, `fg`, `muted`, `faint`, `line`, `accent`). Components only use the tokens, so
any component works on either surface. `data-accent` sets `--accent` per project:
Pulse magenta, SECOP II gold, SmartPark green.

Dark sections are inset rounded panels on the light page rather than full-bleed bands,
which gives the alternation depth without any scroll-linked effect.

Media sits in a `.frame`: an outer tray and an inner plate with concentric radii.

## Page structure

1. **Hero** — headline, one-paragraph introduction, three figures, and a project rail
   with three travelling packets in the project colours.
2. **Statement** — one paragraph on how he works, inked in word by word on scroll.
3. **Pulse** (dark) — the hero clip grows from a window to full width as the page
   scrolls; then two moments with their own clips; then three engineering decisions.
4. **SECOP II** (light) — the assistant's flow lit step by step; two moments with
   their own clips; four measured figures with the sample sizes stated; three points.
5. **SmartPark** (dark) — animated event diagram; YouTube demo; three points.
6. **Experience** — SLB and RACO as an editorial timeline; education below.
7. **Stack** — technologies grouped by purpose, set as large type. No meters.
8. **Contact** (dark) — direct channels and the existing form.

## Motion

- First screen: CSS keyframes only, visible from first paint.
- Entrances: one `IntersectionObserver` (`RevealObserver`) flips `data-revealed` on
  anything carrying `data-reveal`; CSS does the transition.
- Scroll-linked: `ScaleStage` (Pulse hero) and `WordReveal` (statement), both GSAP
  ScrollTrigger with scrub.
- Only `transform` and `opacity` are animated.

Hidden starting states exist only under `html.motion`, a class an inline script adds
before first paint when the visitor has not asked for reduced motion. Without it —
reduced motion, or no JavaScript — every element is simply visible and nothing pins.

## Media

Pulse and SECOP II clips are cut from their demo recordings with the browser chrome,
taskbar and navigation bar (which shows an email address) cropped out, silent, 10–14 s,
0.2–1 MB each. The SECOP II recording's mailbox segment is not used. Each has two cuts: `wide` (both sessions
side by side) and `tall` (stacked) for phones. Clips use `preload="none"`, play only
while on screen, never autoplay under reduced motion, and always carry a pause control.

The YouTube player loads only when the visitor presses play.

## Accessibility

Skip link; one `h1`; every section labelled; visible focus on every control; the mobile
menu is `inert` when closed and closes on Escape; diagrams carry text alternatives.

## Testing

Existing unit tests for the contact pipeline, figure parsing and motion tokens stay.
Tests for removed modules (scramble, deep-link hash, scroll control) are removed with
them. Verification of the page itself is manual: desktop and phone widths, reduced
motion, keyboard, console.

## Motion pass (2026-11-15)

A second pass, after the first version read as correct but quiet. Each addition is tied
to something the page is already saying; none is decoration on its own.

| Where | What moves | How |
|---|---|---|
| Hero | A drifting network of nodes with packets in the three project colours, leaning towards the pointer; the headline arrives letter by letter | `SignalField` (canvas 2D, paused off screen and when the tab is hidden); CSS keyframes per letter |
| Dark panels | Each arrives narrower and opens to full width | `ScrollFx` drives `--panel-inset`; CSS turns it into a `clip-path` |
| Pulse hero clip | Starts tipped back in perspective and stands up as it grows | `ScaleStage` adds `rotateX` |
| Pulse moments | Pass sideways while the page scrolls down | `HorizontalMoments`: CSS sticky track, GSAP scrub on `xPercent` |
| SECOP II flow | The question types itself, the query is written line by line, the answer arrives | CSS only, started by `data-revealed` |
| Figures | Digits roll into place like a counter | `Odometer`, CSS only; replaces the count-up |
| SmartPark | A model of the event flow that can be played: pressing a space sends an event through the bus to the service that reacts | `ParkingSim`; runs by itself while on screen until the visitor takes over |
| Stack | Each group drifts sideways, alternating direction, faster with the scroll | `Marquee` on GSAP's ticker |
| Experience | The rule beside the timeline draws itself | `ScrollFx`, `data-draw` |
| Contact | "Let's talk." fills with ink; buttons lean towards the pointer | `ScrollFx`, `data-fill`; `Magnetic` |

Rejected: a preloader with a curtain (it delays the content for a visitor in a hurry) and
a custom cursor.

Guardrails are unchanged. Every effect has its finished state as the CSS default and only
gets a starting state under `html.motion`; on a phone nothing is pinned and nothing moves
sideways; under reduced motion the network does not run, the model does not play by
itself, and its events arrive without travelling.

The SmartPark model is labelled on the page as a model: it talks to no backend.
