import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  LineSegments,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { arcFragment, arcVertex, globeFragment, globeVertex } from './shaders';
import type { SceneHandle } from './types';

interface GlobeSceneOptions {
  reducedMotion: boolean;
}

const FOV = 35;
const CAMERA_Z = 9;
const ARC_SEGMENTS = 48;

export function createGlobeScene(canvas: HTMLCanvasElement, { reducedMotion }: GlobeSceneOptions): SceneHandle {
  const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

  // Opaque and cleared to the section colour so additive dots blend against #0C0C0C (see heroScene).
  const renderer = new WebGLRenderer({ canvas, antialias: !compact, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0c0c0c, 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.z = CAMERA_Z;

  const globe = new Group();
  scene.add(globe);

  // Evenly spaced dots on a unit sphere (Fibonacci lattice).
  const count = compact ? 1400 : 2600;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    positions[i * 3] = Math.cos(golden * i) * ring;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(golden * i) * ring;
    seeds[i] = Math.random();
  }
  const dotGeometry = new BufferGeometry();
  dotGeometry.setAttribute('position', new BufferAttribute(positions, 3));
  dotGeometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));

  const emitters = [new Vector3(0.45, 0.55, 0.7), new Vector3(-0.75, -0.15, 0.64), new Vector3(0.2, -0.85, -0.48)].map((v) =>
    v.normalize(),
  );
  const dotUniforms = {
    uTime: { value: 0 },
    uSize: { value: compact ? 28 : 33 },
    uPixelRatio: { value: renderer.getPixelRatio() },
    uEmitters: { value: emitters },
  };
  const dotMaterial = new ShaderMaterial({
    vertexShader: globeVertex,
    fragmentShader: globeFragment,
    uniforms: dotUniforms,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  globe.add(new Points(dotGeometry, dotMaterial));

  // Arcs from the emitters to random points, lifted off the surface; a pulse travels along each one.
  const arcCount = compact ? 6 : 10;
  const arcPositions = new Float32Array(arcCount * ARC_SEGMENTS * 6);
  const arcProgress = new Float32Array(arcCount * ARC_SEGMENTS * 2);
  const arcPhase = new Float32Array(arcCount * ARC_SEGMENTS * 2);
  const from = new Vector3();
  const to = new Vector3();
  const start = new Vector3();
  const end = new Vector3();
  let vertex = 0;
  for (let arc = 0; arc < arcCount; arc++) {
    from.copy(emitters[arc % emitters.length]);
    do {
      to.randomDirection();
    } while (from.angleTo(to) < 0.7);
    const angle = from.angleTo(to);
    const lift = 0.06 + 0.22 * (angle / Math.PI);
    const phase = Math.random();
    const pointAt = (t: number, out: Vector3) =>
      out
        .copy(from)
        .multiplyScalar(Math.sin((1 - t) * angle) / Math.sin(angle))
        .addScaledVector(to, Math.sin(t * angle) / Math.sin(angle))
        .multiplyScalar(1 + lift * Math.sin(Math.PI * t));
    for (let i = 0; i < ARC_SEGMENTS; i++) {
      const t0 = i / ARC_SEGMENTS;
      const t1 = (i + 1) / ARC_SEGMENTS;
      pointAt(t0, start).toArray(arcPositions, vertex * 3);
      pointAt(t1, end).toArray(arcPositions, (vertex + 1) * 3);
      arcProgress[vertex] = t0;
      arcProgress[vertex + 1] = t1;
      arcPhase[vertex] = phase;
      arcPhase[vertex + 1] = phase;
      vertex += 2;
    }
  }
  const arcGeometry = new BufferGeometry();
  arcGeometry.setAttribute('position', new BufferAttribute(arcPositions, 3));
  arcGeometry.setAttribute('aProgress', new BufferAttribute(arcProgress, 1));
  arcGeometry.setAttribute('aPhase', new BufferAttribute(arcPhase, 1));
  const arcUniforms = {
    uTime: { value: 0 },
    uColorA: { value: new Vector3(0.714, 0.0, 0.659) },
    uColorB: { value: new Vector3(0.745, 0.298, 0.0) },
  };
  const arcMaterial = new ShaderMaterial({
    vertexShader: arcVertex,
    fragmentShader: arcFragment,
    uniforms: arcUniforms,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  globe.add(new LineSegments(arcGeometry, arcMaterial));

  const pointer = new Vector2();
  const eased = new Vector2();
  const onPointerMove = (event: PointerEvent) => {
    pointer.set((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1));
  };
  if (!reducedMotion) window.addEventListener('pointermove', onPointerMove, { passive: true });

  let active = false;
  let elapsed = reducedMotion ? 3 : 0;
  let previous = 0;

  const render = (time: number) => {
    const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
    previous = time;
    elapsed += delta;
    eased.lerp(pointer, 0.05);

    dotUniforms.uTime.value = elapsed;
    arcUniforms.uTime.value = elapsed;
    globe.rotation.set(0.28 - eased.y * 0.25, elapsed * 0.08 + eased.x * 0.5, 0);

    renderer.render(scene, camera);
  };

  return {
    resize(width, height) {
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Size the globe in screen pixels and centre it behind the heading, 40% down the section.
      const visibleHeight = 2 * Math.tan((FOV * Math.PI) / 360) * CAMERA_Z;
      const unit = visibleHeight / height;
      globe.scale.setScalar((Math.min(width * 0.92, height * 0.72) / 2) * unit);
      globe.position.y = 0.1 * visibleHeight;
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
      dotGeometry.dispose();
      arcGeometry.dispose();
      dotMaterial.dispose();
      arcMaterial.dispose();
      renderer.dispose();
    },
  };
}
