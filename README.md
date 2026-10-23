# Sajan Kamboj — Portfolio

Personal portfolio built with React, TypeScript, Tailwind CSS and Framer Motion: a giant gradient hero with a magnetic 3D portrait, a scroll-driven project marquee, a scroll-revealed bio, sticky stacking project cards and a contact section. Respects `prefers-reduced-motion`.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
```

## Edit content

Everything on the page (profile, stats, skills, projects, achievements, links) lives in [`src/data/portfolio.ts`](src/data/portfolio.ts).

- **Hero portrait:** `public/images/hero-portrait.webp` is the 3D character from the design template, not a picture of me. Replace it with a transparent cut-out of yourself, about 1040×1126 px.
- **Project cards:** each card takes three images from `public/images/projects/`: two stacked on the left, one tall on the right.
- **Marquee:** `public/images/marquee/` holds 840×540 WebP tiles. The first 11 entries of `marqueeImages` form the top row, the rest the bottom row.

## Structure

```
src/
  components/   FadeIn, Magnet, AnimatedText, CountUp, ContactButton, LiveProjectButton, PillLink
  sections/     Hero, Marquee, About, Skills, Projects, Achievements, Contact
  data/         portfolio.ts — all copy and links
public/images/  hero portrait, About decor, marquee tiles, project screenshots
```

## Deploy

`vercel.json` tells Vercel to build with Vite and serve `dist/`.

## Design tooling

`.claude/skills/` contains [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) and its sub-skills for Claude Code. Claude picks it up automatically for UI work, or you can query it directly:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "reduced motion scroll animation" --domain ux
```
