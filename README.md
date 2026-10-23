# Sajan Kamboj — Portfolio

Personal portfolio built with React, TypeScript, Tailwind CSS, Framer Motion and Three.js: a giant gradient hero with a magnetic 3D portrait inside WebGL orbit rings, a scroll-driven project marquee, a scroll-revealed bio, sticky stacking project cards and a contact section with a 3D signal globe. Respects `prefers-reduced-motion`.

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

## 3D scenes

Two Three.js scenes, loaded lazily in their own chunk once the page has rendered:

- **Hero orbits** (`src/three/heroScene.ts`): orbit rings with travelling moons around the portrait, inside a twinkling star field. They follow the pointer and drift away as you scroll.
- **Contact globe** (`src/three/globeScene.ts`): a dotted globe with signal ripples spreading from a few points and pulses travelling along arcs.

Each scene pauses when offscreen or in a background tab, renders one still frame under `prefers-reduced-motion`, and the page works without WebGL.

## Structure

```
src/
  components/   FadeIn, Magnet, AnimatedText, CountUp, ContactButton, LiveProjectButton, PillLink, ThreeCanvas
  sections/     Hero, Marquee, About, Skills, Projects, Achievements, Contact
  three/        heroScene, globeScene, shaders
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
