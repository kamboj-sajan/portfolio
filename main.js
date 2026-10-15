import * as THREE from 'three';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
const isMobile = () => innerWidth < 768;

document.body.classList.add('loading');
document.getElementById('year').textContent = new Date().getFullYear();

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* ------------------------------------------------------------------ */
/* Hero title: split into characters                                   */
/* ------------------------------------------------------------------ */
document.querySelectorAll('.split').forEach((el, lineIndex) => {
  const text = el.textContent;
  el.textContent = '';
  // Gradient text can't be split per letter without breaking the gradient,
  // so that line animates as a single block.
  if (el.classList.contains('gradient-text')) {
    el.classList.remove('gradient-text');
    const span = document.createElement('span');
    span.className = 'char gradient-text';
    span.textContent = text;
    span.style.transitionDelay = `${0.35 + lineIndex * 0.1}s`;
    el.appendChild(span);
    return;
  }
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch;
    span.style.transitionDelay = `${i * 0.05}s`;
    el.appendChild(span);
  });
});

/* ------------------------------------------------------------------ */
/* WebGL scene                                                          */
/* ------------------------------------------------------------------ */
const noiseGLSL = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}`;

const blobVertex = /* glsl */ `
uniform float uTime;
uniform float uDistort;
uniform float uFreq;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vNoise;
${noiseGLSL}

float field(vec3 p){
  return snoise(p * uFreq + uTime * 0.25) * 0.75 + snoise(p * uFreq * 2.3 - uTime * 0.35) * 0.25;
}

vec3 displace(vec3 p){
  return p + normalize(p) * field(p) * uDistort;
}

vec3 orthogonal(vec3 v){
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}

void main(){
  vec3 n = normalize(position);
  vec3 t = orthogonal(n);
  vec3 b = cross(n, t);
  float e = 0.01;
  vec3 p  = displace(position);
  vec3 pt = displace(position + t * e);
  vec3 pb = displace(position + b * e);
  vec3 dn = normalize(cross(pt - p, pb - p));

  vNoise = field(position);
  vNormal = normalize(normalMatrix * dn);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const blobFragment = /* glsl */ `
uniform float uHue;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vNoise;

vec3 palette(float h){
  vec3 c1 = vec3(0.486, 0.361, 1.0);   // violet
  vec3 c2 = vec3(0.0, 0.898, 1.0);     // cyan
  vec3 c3 = vec3(1.0, 0.235, 0.675);   // pink
  h = fract(h) * 3.0;
  if (h < 1.0) return mix(c1, c2, smoothstep(0.0, 1.0, h));
  if (h < 2.0) return mix(c2, c3, smoothstep(0.0, 1.0, h - 1.0));
  return mix(c3, c1, smoothstep(0.0, 1.0, h - 2.0));
}

void main(){
  vec3 n = normalize(vNormal);
  vec3 v = normalize(-vViewPos);
  vec3 l = normalize(vec3(0.6, 0.8, 0.6));

  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.2);
  float diff = max(dot(n, l), 0.0);
  float spec = pow(max(dot(reflect(-l, n), v), 0.0), 48.0);

  vec3 base = palette(vNoise * 0.35 + uHue + fres * 0.25);
  vec3 col = base * (0.08 + 0.55 * diff);
  col += base * fres * 1.3;
  col += vec3(1.0) * spec * 0.6;
  col += palette(uHue + 0.5) * pow(fres, 5.0) * 0.8;

  gl_FragColor = vec4(col, 1.0);
}`;

const particleVertex = /* glsl */ `
attribute float aScale;
attribute vec3 aColor;
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
varying vec3 vColor;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float twinkle = 0.55 + 0.45 * sin(uTime * 1.5 + aScale * 40.0);
  gl_PointSize = uSize * aScale * twinkle * uPixelRatio * (1.0 / -mv.z);
  vColor = aColor;
}`;

const particleFragment = /* glsl */ `
varying vec3 vColor;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 2.0);
  gl_FragColor = vec4(vColor, a);
}`;

function createScene() {
  const canvas = document.getElementById('webgl');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile(), powerPreference: 'high-performance' });
  } catch (err) {
    console.warn('WebGL unavailable, skipping 3D scene.', err);
    canvas.remove();
    return null;
  }

  const pixelRatio = Math.min(devicePixelRatio, isMobile() ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x05050a, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05050a, 0.04);

  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  // Group that follows scroll keyframes
  const hero = new THREE.Group();
  scene.add(hero);

  // Morphing blob
  const blobUniforms = {
    uTime: { value: 0 },
    uDistort: { value: 0.32 },
    uFreq: { value: 0.9 },
    uHue: { value: 0 },
  };
  const blob = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.35, isMobile() ? 40 : 72),
    new THREE.ShaderMaterial({ vertexShader: blobVertex, fragmentShader: blobFragment, uniforms: blobUniforms })
  );
  hero.add(blob);

  // Wireframe shell
  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.05, 2),
    new THREE.MeshBasicMaterial({ color: 0x7c5cff, wireframe: true, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  hero.add(shell);

  // Orbit rings
  const rings = [
    { r: 2.55, color: 0x00e5ff, rot: [1.2, 0.2, 0] },
    { r: 2.9, color: 0xff3cac, rot: [1.9, -0.5, 0.4] },
    { r: 3.3, color: 0x7c5cff, rot: [0.6, 0.9, -0.3] },
  ].map(({ r, color, rot }) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.007, 8, 256),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    ring.rotation.set(...rot);
    // A small glowing "moon" travelling on each ring
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshBasicMaterial({ color, blending: THREE.AdditiveBlending })
    );
    moon.position.x = r;
    const pivot = new THREE.Group();
    pivot.add(moon);
    ring.add(pivot);
    hero.add(ring);
    return { ring, pivot, speed: 0.3 + Math.random() * 0.5 };
  });

  // Floating wireframe shapes
  const shapeGeos = [
    new THREE.OctahedronGeometry(0.28),
    new THREE.TetrahedronGeometry(0.3),
    new THREE.TorusKnotGeometry(0.18, 0.05, 80, 8),
    new THREE.IcosahedronGeometry(0.26),
    new THREE.TorusGeometry(0.2, 0.06, 12, 32),
    new THREE.OctahedronGeometry(0.2),
  ];
  const shapeColors = [0x00e5ff, 0xff3cac, 0x7c5cff];
  const shapes = shapeGeos.map((geo, i) => {
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: shapeColors[i % 3], wireframe: true, transparent: true, opacity: 0.7 })
    );
    const angle = (i / shapeGeos.length) * Math.PI * 2;
    mesh.userData = {
      base: new THREE.Vector3(Math.cos(angle) * 5, Math.sin(angle * 1.7) * 2.4, -2 - Math.random() * 3),
      speed: 0.4 + Math.random() * 0.6,
      offset: Math.random() * 10,
    };
    scene.add(mesh);
    return mesh;
  });

  // Particle field
  const count = isMobile() ? 1800 : 4500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const palette = [new THREE.Color(0x7c5cff), new THREE.Color(0x00e5ff), new THREE.Color(0xff3cac), new THREE.Color(0xffffff)];
  for (let i = 0; i < count; i++) {
    const r = 4 + Math.pow(Math.random(), 0.7) * 22;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors.set([c.r, c.g, c.b], i * 3);
    scales[i] = 0.3 + Math.random();
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  particleGeo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
  const particleUniforms = {
    uTime: { value: 0 },
    uSize: { value: 70 },
    uPixelRatio: { value: pixelRatio },
  };
  const particles = new THREE.Points(
    particleGeo,
    new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: particleUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(particles);

  /* ---- Scroll keyframes: where the blob sits for each section ---- */
  const sectionEls = [...document.querySelectorAll('.hero, #about, #skills, #work, #achievements, #contact')];
  const desktopFrames = [
    { x: 2.1, y: 0.0, z: 0, s: 1.0, hue: 0.0 },
    { x: -3.0, y: -1.5, z: -2, s: 0.75, hue: 0.33 },
    { x: -3.6, y: -1.6, z: -3, s: 0.6, hue: 0.55 },
    { x: 0.0, y: 0.0, z: -6, s: 1.3, hue: 0.8 },
    { x: 3.2, y: -1.2, z: -4, s: 0.8, hue: 0.9 },
    { x: 0.0, y: 0.0, z: -6, s: 1.2, hue: 1.0 },
  ];
  const mobileFrames = [
    { x: 0.0, y: 1.7, z: -1, s: 0.6, hue: 0.0 },
    { x: 1.3, y: -1.6, z: -4, s: 0.6, hue: 0.33 },
    { x: -1.3, y: -1.6, z: -4, s: 0.55, hue: 0.55 },
    { x: 0.0, y: 0.0, z: -8, s: 1.1, hue: 0.8 },
    { x: 1.2, y: -1.6, z: -5, s: 0.7, hue: 0.9 },
    { x: 0.0, y: 0.0, z: -7, s: 1.0, hue: 1.0 },
  ];
  let sectionCenters = [];
  const measure = () => {
    sectionCenters = sectionEls.map((el) => el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2);
  };
  const sectionProgress = () => {
    const mid = scrollY + innerHeight / 2;
    if (mid <= sectionCenters[0]) return 0;
    for (let i = 0; i < sectionCenters.length - 1; i++) {
      if (mid < sectionCenters[i + 1]) return i + (mid - sectionCenters[i]) / (sectionCenters[i + 1] - sectionCenters[i]);
    }
    return sectionCenters.length - 1;
  };
  const frameAt = (p) => {
    const frames = isMobile() ? mobileFrames : desktopFrames;
    const i = clamp(Math.floor(p), 0, frames.length - 1);
    const j = Math.min(i + 1, frames.length - 1);
    let t = p - i;
    t = t * t * (3 - 2 * t); // smoothstep
    const a = frames[i];
    const b = frames[j];
    return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t), s: lerp(a.s, b.s, t), hue: lerp(a.hue, b.hue, t) };
  };

  /* ---- Input ---- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / innerHeight) * 2 - 1);
  });

  let lastScroll = scrollY;
  let scrollVel = 0;
  const current = { ...frameAt(0) };

  const onResize = () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    measure();
  };
  addEventListener('resize', onResize);
  addEventListener('load', measure);
  measure();

  /* ---- Loop ---- */
  const clock = new THREE.Clock();
  const timeScale = reduceMotion ? 0.15 : 1;
  let intro = 0; // 0 → 1 after the loader finishes

  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime * timeScale;

    mouse.x = lerp(mouse.x, mouse.tx, 0.05);
    mouse.y = lerp(mouse.y, mouse.ty, 0.05);

    const vel = scrollY - lastScroll;
    lastScroll = scrollY;
    scrollVel = lerp(scrollVel, clamp(Math.abs(vel) / 40, 0, 1), 0.08);

    const target = frameAt(sectionProgress());
    for (const k in current) current[k] = lerp(current[k], target[k], 0.06);

    intro = lerp(intro, document.body.classList.contains('ready') ? 1 : 0, 0.035);

    hero.position.set(current.x, current.y, current.z);
    hero.scale.setScalar(current.s * (0.4 + 0.6 * intro));
    hero.rotation.y = lerp(hero.rotation.y, mouse.x * 0.5, 0.08);
    hero.rotation.x = lerp(hero.rotation.x, -mouse.y * 0.35, 0.08);

    blob.rotation.y += dt * 0.15 * timeScale;
    blob.rotation.z += dt * 0.05 * timeScale;
    blobUniforms.uTime.value = t;
    blobUniforms.uHue.value = current.hue + t * 0.02;
    blobUniforms.uDistort.value = 0.3 + scrollVel * 0.35 + Math.sin(t * 0.6) * 0.04;

    shell.rotation.x -= dt * 0.08 * timeScale;
    shell.rotation.y -= dt * 0.12 * timeScale;

    rings.forEach(({ ring, pivot, speed }, i) => {
      ring.rotation.z += dt * 0.1 * (i % 2 ? -1 : 1) * timeScale;
      pivot.rotation.z = t * speed;
    });

    shapes.forEach((m) => {
      const { base, speed, offset } = m.userData;
      m.position.set(
        base.x + Math.sin(t * speed + offset) * 0.4,
        base.y + Math.cos(t * speed * 1.3 + offset) * 0.5 - scrollY * 0.0012 * (1 + speed),
        base.z
      );
      m.rotation.x += dt * speed * timeScale;
      m.rotation.y += dt * speed * 0.7 * timeScale;
    });

    particles.rotation.y = t * 0.02 + scrollY * 0.0002;
    particles.rotation.x = t * 0.01;
    particleUniforms.uTime.value = t;

    camera.position.x = lerp(camera.position.x, mouse.x * 0.4, 0.05);
    camera.position.y = lerp(camera.position.y, mouse.y * 0.3, 0.05);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  return { measure };
}

const scene3d = createScene();

/* ------------------------------------------------------------------ */
/* Loader                                                               */
/* ------------------------------------------------------------------ */
const loader = document.getElementById('loader');
const loaderCount = document.getElementById('loaderCount');
const loaderBar = document.getElementById('loaderBar');
const loaderStart = performance.now();
const loaderDuration = reduceMotion ? 300 : 1600;
let assetsReady = false;
Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]).then(() => (assetsReady = true));

function updateLoader(now) {
  const p = clamp((now - loaderStart) / loaderDuration, 0, assetsReady ? 1 : 0.9);
  const eased = 1 - Math.pow(1 - p, 3);
  const value = Math.round(eased * 100);
  loaderCount.textContent = value;
  loaderBar.style.width = `${value}%`;
  if (p >= 1) {
    setTimeout(finishLoading, 200);
  } else {
    requestAnimationFrame(updateLoader);
  }
}
requestAnimationFrame(updateLoader);

function finishLoading() {
  loader.classList.add('done');
  document.body.classList.remove('loading');
  document.body.classList.add('ready');
  scene3d?.measure();
  startReveals();
  startTyping();
  setTimeout(() => loader.remove(), 1200);
}

/* ------------------------------------------------------------------ */
/* Scroll reveal + stat counters                                        */
/* ------------------------------------------------------------------ */
function countUp(el) {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const step = (now) => {
    const p = clamp((now - start) / 1400, 0, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function startReveals() {
  const reveals = document.querySelectorAll('.reveal');
  // Stagger siblings that reveal together
  const groups = new Map();
  reveals.forEach((el) => {
    const list = groups.get(el.parentElement) || [];
    el.style.setProperty('--delay', `${list.length * 0.08}s`);
    list.push(el);
    groups.set(el.parentElement, list);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
  );
  reveals.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------ */
/* Typing effect                                                        */
/* ------------------------------------------------------------------ */
function startTyping() {
  const el = document.getElementById('typed');
  const words = ['AI-powered web apps', 'RAG pipelines & AI agents', 'cloud IDEs', 'low-level tools in C++', 'RISC-V cores in SystemVerilog'];
  if (reduceMotion) return;
  let w = 0;
  let i = words[0].length;
  let deleting = true;
  const loop = () => {
    const word = words[w];
    i += deleting ? -1 : 1;
    el.textContent = word.slice(0, i);
    let delay = deleting ? 35 : 70;
    if (!deleting && i === word.length) {
      deleting = true;
      delay = 2200;
    } else if (deleting && i === 0) {
      deleting = false;
      w = (w + 1) % words.length;
      delay = 400;
    }
    setTimeout(loop, delay);
  };
  setTimeout(loop, 2600);
}

/* ------------------------------------------------------------------ */
/* Nav state                                                            */
/* ------------------------------------------------------------------ */
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ------------------------------------------------------------------ */
/* Custom cursor, magnetic buttons, tilt cards                          */
/* ------------------------------------------------------------------ */
if (!isTouch) {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { ...pos };
  addEventListener('pointermove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
  });
  const followRing = () => {
    ringPos.x = lerp(ringPos.x, pos.x, 0.18);
    ringPos.y = lerp(ringPos.y, pos.y, 0.18);
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    requestAnimationFrame(followRing);
  };
  followRing();
  document.querySelectorAll('a, button, [data-tilt], .tag-sphere').forEach((el) => {
    el.addEventListener('pointerenter', () => ring.classList.add('hover'));
    el.addEventListener('pointerleave', () => ring.classList.remove('hover'));
  });

  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transition = 'transform 0.2s ease-out';
      el.style.transform = `translate(${dx * 0.3}px, ${dy * 0.4}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = '';
    });
  });

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.classList.add('tilting');
      card.style.setProperty('--ry', `${(px - 0.5) * 16}deg`);
      card.style.setProperty('--rx', `${(0.5 - py) * 16}deg`);
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* ------------------------------------------------------------------ */
/* 3D skills sphere                                                     */
/* ------------------------------------------------------------------ */
(function tagSphere() {
  const root = document.getElementById('tagSphere');
  const skills = [
    'C++', 'TypeScript', 'JavaScript', 'Python', 'SQL', 'React', 'Next.js', 'Tailwind',
    'Node.js', 'Express', 'Convex', 'PostgreSQL', 'pgvector', 'Prisma', 'Redis', 'LangChain',
    'Gemini', 'RAG', 'Docker', 'GitHub Actions', 'Cloud Run', 'AWS', 'Vercel', 'Clerk',
    'Inngest', 'Solidity', 'Hardhat', 'SystemVerilog', 'Three.js', 'Git',
  ];
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points = skills.map((name, i) => {
    const y = 1 - (i / (skills.length - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const el = document.createElement('span');
    el.textContent = name;
    root.appendChild(el);
    return { el, x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  });

  let vx = 0.003;
  let vy = 0.004;
  let dragging = false;
  let last = null;
  let visible = false;

  root.addEventListener('pointerdown', (e) => {
    dragging = true;
    last = { x: e.clientX, y: e.clientY };
    root.setPointerCapture(e.pointerId);
  });
  root.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    vy = (e.clientX - last.x) * 0.0015;
    vx = -(e.clientY - last.y) * 0.0015;
    last = { x: e.clientX, y: e.clientY };
  });
  const release = () => (dragging = false);
  root.addEventListener('pointerup', release);
  root.addEventListener('pointercancel', release);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) requestAnimationFrame(render);
  }).observe(root);

  function render() {
    if (!visible) return;
    if (!dragging) {
      // Ease back toward a gentle idle spin
      vx = lerp(vx, reduceMotion ? 0 : 0.002, 0.02);
      vy = lerp(vy, reduceMotion ? 0 : 0.004, 0.02);
    }
    const radius = root.clientWidth * 0.4;
    const cosX = Math.cos(vx);
    const sinX = Math.sin(vx);
    const cosY = Math.cos(vy);
    const sinY = Math.sin(vy);
    points.forEach((p) => {
      // rotate around X
      const y1 = p.y * cosX - p.z * sinX;
      const z1 = p.y * sinX + p.z * cosX;
      // rotate around Y
      const x2 = p.x * cosY + z1 * sinY;
      const z2 = -p.x * sinY + z1 * cosY;
      p.x = x2;
      p.y = y1;
      p.z = z2;
      const depth = (p.z + 1) / 2; // 0 (back) → 1 (front)
      const scale = 0.6 + depth * 0.8;
      p.el.style.transform = `translate(-50%, -50%) translate3d(${p.x * radius}px, ${p.y * radius}px, 0) scale(${scale})`;
      p.el.style.opacity = 0.15 + depth * 0.85;
      p.el.style.zIndex = Math.round(depth * 100);
      p.el.style.filter = depth < 0.35 ? 'blur(1px)' : 'none';
    });
    requestAnimationFrame(render);
  }
})();
