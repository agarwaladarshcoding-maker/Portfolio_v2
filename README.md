# Adarsh Agarwal — Portfolio

A personal portfolio built with **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion**.

Design direction: a warm, not-pure-black "ink" palette with a signal-orange accent and a mint data-cue. The site opens with a layered intro inspired by steven.com (a `000 → 100` counter with live HUD readouts), an animated name reveal, a monogram logo draw-in, and a cinematic curtain wipe that "booms" into the page — then settles into a clean, editorial layout (à la dvdrod) with ambient matveyan-style cursor + live clock details.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To build for production:

```bash
npm run build
npm start
```

## Make it yours

**Everything you need to edit lives in one file: `lib/data.ts`.**

- `site` — your name, initials, role, summary, email, location, timezone, socials.
- `tickers` — the scrolling data strip in the hero.
- `projects` — your case studies (title, blurb, stack, metrics, link).
- `experience` — your timeline.
- `skills` — grouped skill lists.

The placeholder copy (projects, experience, etc.) is illustrative — swap it for your real work.

The hero headline lives in `components/Hero.tsx` (`headline` array) and the long About paragraphs live in `components/About.tsx`.

## Colors

Defined in `tailwind.config.ts`:

- `ink` — warm near-black backgrounds (`#0e0f14` → `#1a1c24`)
- `bone` — warm off-white text
- `signal` — orange accent (`#ff5d3b`)
- `mint` — cool data/status cue (`#8fe7c4`)

## Structure

```
app/
  layout.tsx       fonts, metadata, global shell
  page.tsx         orchestrates preloader + sections
  globals.css      base styles, grain overlay, marquee, reduced-motion
components/
  Preloader.tsx    the layered intro sequence
  Cursor.tsx       custom cursor + live XY readout
  Nav.tsx          sticky nav
  Hero.tsx         ticker tape + big statement
  Work.tsx         selected projects
  About.tsx        about + quick facts
  Experience.tsx   timeline
  Skills.tsx       grouped skills
  Contact.tsx      closing CTA
  Footer.tsx       footer + live clock
lib/
  data.ts          ALL content lives here
```

## Notes

- Fonts (Inter, Space Grotesk, JetBrains Mono) are loaded via `next/font/google` and fetched at build time — you'll need internet access the first time you build/dev.
- The custom cursor is automatically disabled on touch devices.
- Respects `prefers-reduced-motion`.

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com) — it auto-detects Next.js. No config needed.
