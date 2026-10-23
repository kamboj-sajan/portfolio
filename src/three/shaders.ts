// Colours are written as sRGB and output without conversion, so they match the CSS brand gradient exactly.

// Magenta #B600A8 -> purple #7621B0 -> orange #BE4C00, the ContactButton gradient.
const palette = /* glsl */ `
vec3 palette(float h){
  vec3 c1 = vec3(0.714, 0.0, 0.659);
  vec3 c2 = vec3(0.463, 0.129, 0.690);
  vec3 c3 = vec3(0.745, 0.298, 0.0);
  h = fract(h) * 3.0;
  if (h < 1.0) return mix(c1, c2, smoothstep(0.0, 1.0, h));
  if (h < 2.0) return mix(c2, c3, smoothstep(0.0, 1.0, h - 1.0));
  return mix(c3, c1, smoothstep(0.0, 1.0, h - 2.0));
}`;

export const starVertex = /* glsl */ `
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
  gl_PointSize = uSize * aScale * twinkle * uPixelRatio / -mv.z;
  vColor = aColor;
}`;

export const starFragment = /* glsl */ `
varying vec3 vColor;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 2.0);
  gl_FragColor = vec4(vColor, a);
}`;

// Dots on a unit sphere; rings of "signal" radiate from a few emitter points across the surface.
export const globeVertex = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uEmitters[3];
varying vec3 vColor;
varying float vAlpha;
${palette}

void main(){
  float ripple = 0.0;
  for (int i = 0; i < 3; i++) {
    float d = acos(clamp(dot(position, uEmitters[i]), -1.0, 1.0));
    float wave = sin(d * 16.0 - uTime * 2.2 + float(i) * 2.1);
    ripple += smoothstep(0.55, 1.0, wave) * exp(-d * 1.3);
  }
  ripple = clamp(ripple, 0.0, 1.0);

  vec4 mv = modelViewMatrix * vec4(position * (1.0 + ripple * 0.04), 1.0);
  gl_Position = projectionMatrix * mv;

  float facing = smoothstep(-0.4, 0.7, normalize(normalMatrix * position).z);
  vColor = mix(vec3(0.843, 0.886, 0.918) * 0.6, palette(aSeed * 0.5 + uTime * 0.03), ripple);
  vAlpha = facing * (0.38 + 0.62 * ripple);
  gl_PointSize = uSize * (0.55 + ripple * 0.9) * uPixelRatio / -mv.z;
}`;

export const globeFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor, smoothstep(0.5, 0.15, d) * vAlpha);
}`;

// Each arc carries its own phase, so one draw call animates every pulse independently.
export const arcVertex = /* glsl */ `
attribute float aProgress;
attribute float aPhase;
uniform float uTime;
varying float vProgress;
varying float vHead;
void main(){
  vProgress = aProgress;
  vHead = fract(uTime * 0.16 + aPhase) * 1.5 - 0.2;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const arcFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vProgress;
varying float vHead;
void main(){
  float trail = smoothstep(vHead - 0.3, vHead, vProgress) * (1.0 - step(vHead, vProgress));
  gl_FragColor = vec4(mix(uColorA, uColorB, vProgress), 0.06 + trail * 0.85);
}`;
