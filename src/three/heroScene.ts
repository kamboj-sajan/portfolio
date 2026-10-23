import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
} from 'three';
import type { RefObject } from 'react';
import { starFragment, starVertex } from './shaders';
import type { SceneHandle } from './types';

interface HeroSceneOptions {
  reducedMotion: boolean;
  // The portrait wrapper: the orbit rings are centred on it.
  focus: RefObject<HTMLElement | null>;
}

const FOV = 35;
const CAMERA_Z = 9;
const STAR_COLORS = [0xd7e2ea, 0xd7e2ea, 0xd7e2ea, 0xb600a8, 0x7621b0, 0xbe4c00];

export function createHeroScene(canvas: HTMLCanvasElement, { reducedMotion, focus }: HeroSceneOptions): SceneHandle {
  const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

  // Opaque and cleared to the page colour: the additive rings and stars then blend against #0C0C0C inside
  // WebGL, instead of writing alpha into a transparent canvas, which composites as dark patches.
  const renderer = new WebGLRenderer({ canvas, antialias: !compact, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0c0c0c, 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.z = CAMERA_Z;

  // Orbit rings around the portrait, each with a small moon travelling along it.
  const orbits = new Group();
  scene.add(orbits);

  const ringGeometry = new TorusGeometry(1, 0.005, 8, 240);
  const moonGeometry = new SphereGeometry(0.028, 12, 12);
  const ringMaterials = [0xb600a8, 0x7621b0, 0xbe4c00].map(
    (color) => new MeshBasicMaterial({ color, transparent: true, opacity: 0.7, blending: AdditiveBlending, depthWrite: false }),
  );
  const rings = ringMaterials.map((material, index) => {
    // Tighter on phones, where the outer ring would otherwise run off both screen edges.
    const radius = compact ? 1.6 + index * 0.2 : 1.8 + index * 0.28;
    const pivot = new Group();
    pivot.rotation.set(1.18 + index * 0.12, 0, -0.35 + index * 0.4);
    const ring = new Mesh(ringGeometry, material);
    ring.scale.setScalar(radius);
    const moon = new Mesh(moonGeometry, material);
    moon.position.x = radius;
    const spinner = new Group();
    spinner.add(moon);
    pivot.add(ring, spinner);
    orbits.add(pivot);
    return { pivot, spinner, speed: 0.5 - index * 0.12, tilt: pivot.rotation.z };
  });

  // Star field spread through depth, so pointer parallax reads as 3D.
  const starCount = compact ? 700 : 1800;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const scales = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = 2 - Math.random() * 16;
    const hex = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    colors[i * 3] = ((hex >> 16) & 255) / 255;
    colors[i * 3 + 1] = ((hex >> 8) & 255) / 255;
    colors[i * 3 + 2] = (hex & 255) / 255;
    scales[i] = 0.4 + Math.random();
  }
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute('position', new BufferAttribute(positions, 3));
  starGeometry.setAttribute('aColor', new BufferAttribute(colors, 3));
  starGeometry.setAttribute('aScale', new BufferAttribute(scales, 1));
  const starUniforms = { uTime: { value: 0 }, uSize: { value: 30 }, uPixelRatio: { value: renderer.getPixelRatio() } };
  const starMaterial = new ShaderMaterial({
    vertexShader: starVertex,
    fragmentShader: starFragment,
    uniforms: starUniforms,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const stars = new Points(starGeometry, starMaterial);
  scene.add(stars);

  // Pointer input is stored here and eased inside the frame loop.
  const pointer = new Vector2();
  const eased = new Vector2();
  const onPointerMove = (event: PointerEvent) => {
    pointer.set((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1));
  };
  if (!reducedMotion) window.addEventListener('pointermove', onPointerMove, { passive: true });

  const focusPoint = new Vector2();
  let focusScale = 1;
  let height = 0;
  const measureFocus = () => {
    const element = focus.current;
    if (!element || !height) return;
    const box = element.getBoundingClientRect();
    const frame = canvas.getBoundingClientRect();
    const unit = (2 * Math.tan((FOV * Math.PI) / 360) * CAMERA_Z) / frame.height; // world units per CSS pixel
    // The face sits right of centre in the portrait (the hair sweeps left), so anchor on the face, not the box.
    focusPoint.set(
      (box.left + box.width * 0.56 - frame.left - frame.width / 2) * unit,
      -(box.top + box.height * 0.5 - frame.top - frame.height / 2) * unit,
    );
    // Ring radii above are in units of 0.3 portrait widths.
    focusScale = box.width * unit * 0.3;
  };

  let active = false;
  let elapsed = reducedMotion ? 2 : 0;
  let previous = 0;
  let sinceMeasure = 0;

  const render = (time: number) => {
    const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
    previous = time;
    elapsed += delta;
    // The portrait fades up into place after load, so keep re-reading its position for a while.
    sinceMeasure += delta;
    if (sinceMeasure > 0.5) {
      sinceMeasure = 0;
      measureFocus();
    }

    eased.lerp(pointer, 0.06);
    const scroll = Math.min(window.scrollY / Math.max(height, 1), 1);

    starUniforms.uTime.value = elapsed;

    orbits.position.set(focusPoint.x + eased.x * 0.25, focusPoint.y + eased.y * 0.15 + scroll * 0.9, 0);
    orbits.scale.setScalar(focusScale * (1 - scroll * 0.25));
    for (const ring of rings) {
      ring.spinner.rotation.z = elapsed * ring.speed;
      ring.pivot.rotation.z = ring.tilt + eased.x * 0.12;
    }
    stars.rotation.set(eased.y * 0.04, eased.x * 0.06, 0);
    stars.position.y = scroll * 1.6;

    renderer.render(scene, camera);
  };

  return {
    resize(width, nextHeight) {
      height = nextHeight;
      if (!width || !nextHeight) return;
      renderer.setSize(width, nextHeight, false);
      camera.aspect = width / nextHeight;
      camera.updateProjectionMatrix();
      measureFocus();
      // Paused or reduced motion: still keep a correct frame on screen.
      if (!active) render(previous);
    },
    setActive(next) {
      active = next && !reducedMotion;
      if (!active) previous = 0;
      renderer.setAnimationLoop(active ? render : null);
    },
    dispose() {
      renderer.setAnimationLoop(null);
      window.removeEventListener('pointermove', onPointerMove);
      for (const geometry of [ringGeometry, moonGeometry, starGeometry]) geometry.dispose();
      for (const material of [starMaterial, ...ringMaterials]) material.dispose();
      renderer.dispose();
    },
  };
}
