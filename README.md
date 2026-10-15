# Sajan Kamboj — Portfolio

A personal portfolio with real-time 3D animations built with [Three.js](https://threejs.org/) and plain HTML, CSS and JavaScript. No build step needed.

## Features

- Morphing liquid blob (custom GLSL noise shader) with orbit rings, a wireframe shell and a twinkling particle field
- 3D scene reacts to the mouse and moves/changes color as you scroll through sections
- Animated loader, split-letter hero title, typewriter subtitle
- Draggable 3D skills sphere
- Project cards with 3D tilt and light glare
- Custom cursor, magnetic buttons, scroll-reveal animations
- Responsive, mobile-optimized, respects `prefers-reduced-motion`

## Run locally

ES modules need a local server (opening the file directly won't work):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Push to GitHub and enable **Settings → Pages → Deploy from branch** (root folder).

## Customize

- Text, projects and links: `index.html`
- Colors and fonts: CSS variables at the top of `style.css`
- Skills in the sphere, typed phrases, 3D scene: `main.js`
