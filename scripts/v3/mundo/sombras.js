/* Sombreadores del mundo (WebGL2, GLSL ES 3.00).
   Un solo material manda: el papel. Todo lo demás (suelo, mesas, haces, bruma)
   existe para que el papel tenga peso, profundidad y luz. */

export const HOJA_V = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
layout(location=1) in vec4 iP;   // xyz, escala
layout(location=2) in vec4 iQ;   // giro
layout(location=3) in vec4 iA;   // tipo, doblez, sello, alfa
layout(location=4) in vec4 iB;   // lectura (0..1), luz propia, semilla, campos
uniform mat4 uVP; uniform vec3 uCam, uDir; uniform vec2 uTam;
uniform float uFoco, uAbertura, uCocMax, uT, uEspejo;
out vec2 vUv; out vec3 vN, vW; out vec4 vA, vB; out float vCoc, vE;
vec3 rot(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
void main() {
  float d = dot(iP.xyz - uCam, uDir);
  float coc = clamp(abs(d - uFoco) / max(d, 0.5) * uAbertura, 0.0, uCocMax);
  float e = 1.0 + 2.0 * coc;
  float fase = (aPos.y + 0.5) * 3.1416 + iB.z * 6.283 + uT * 1.9;
  float z = iA.y * (sin(fase) * 0.075 + aPos.x * aPos.y * 0.55 * sin(uT * 1.3 + iB.z * 40.0));
  vec3 nl = normalize(vec3(-iA.y * aPos.y * 0.4 * sin(uT * 1.3 + iB.z * 40.0), -iA.y * cos(fase) * 0.17, 1.0));
  vec3 l = vec3(aPos.x * e * uTam.x, aPos.y * e * uTam.y, z * uTam.y) * iP.w;
  vec3 w = iP.xyz + rot(iQ, l);
  vec3 n = rot(iQ, nl);
  w.y *= uEspejo; n.y *= uEspejo;
  vW = w; vN = n; vUv = aPos * e + 0.5; vA = iA; vB = iB; vCoc = coc; vE = e;
  gl_Position = uVP * vec4(w, 1.0);
}`;

export const HOJA_F = `#version 300 es
precision highp float;
uniform sampler2D uAtlas; uniform vec2 uCelda; uniform float uPxCelda;
uniform vec3 uLuzPos, uLuzDir, uCam, uNiebla, uTinte;
uniform float uCosInt, uCosExt, uLuzI, uAmb, uNoche, uDens, uEspejo, uReflejo, uClaro;
in vec2 vUv; in vec3 vN, vW; in vec4 vA, vB; in float vCoc, vE;
out vec4 o;
const vec3 AIRE = vec3(0.357, 0.549, 1.0);
void main() {
  float borde = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y) * 1.4);
  float aa = fwidth(borde) * 0.75;
  float a = smoothstep(-vCoc - aa, vCoc + aa, borde);
  if (a < 0.004) discard;
  bool frente = gl_FrontFacing == (uEspejo > 0.0);
  vec2 u = clamp(vUv, 0.012, 0.988);
  vec2 ut = frente ? u : vec2(1.0 - u.x, u.y);
  float tipo = floor(vA.x + 0.5);
  vec2 celda = vec2(mod(tipo, 4.0), floor(tipo / 4.0));
  float lod = log2(1.0 + vCoc * uPxCelda * 1.5) + (uReflejo < 1.0 ? 2.0 : 0.0);
  vec3 t = textureLod(uAtlas, (celda + vec2(ut.x, 1.0 - ut.y)) * uCelda, lod).rgb;
  float papel = frente ? t.r : mix(0.80, t.r, 0.12);

  vec3 N = normalize(vN) * (frente ? 1.0 : -1.0);
  vec3 Lv = uLuzPos - vW; float dl = length(Lv); vec3 L = Lv / dl;
  float nl = dot(N, L);
  float cono = smoothstep(uCosExt, uCosInt, dot(-L, uLuzDir));
  float luz = (max(nl, 0.0) * 0.92 + max(-nl, 0.0) * 0.46) * cono * uLuzI;
  luz = (luz + uAmb * (0.6 + 0.4 * N.y) + max(vB.y, 0.0)) * (1.0 + min(vB.y, 0.0));
  vec3 V = normalize(uCam - vW);
  float brillo = pow(max(dot(reflect(-L, N), V), 0.0), 18.0) * cono * uLuzI * 0.22;
  papel *= mix(0.86, 1.0, smoothstep(0.0, 0.012, borde));   // el canto de la hoja
  vec3 col = vec3(papel) * luz * uTinte + brillo;
  col = 1.0 - exp(-col * 1.25); col = mix(col, col * col * (3.0 - 2.0 * col), 0.55);

  // la lectura: una franja de luz baja por la hoja y deja marcados los campos que entiende
  float y = 1.0 - vB.x;
  float leyendo = step(0.001, vB.x) * step(vB.x, 0.999);
  float franja = (exp(-pow((u.y - y) * 60.0, 2.0)) + 0.35 * exp(-pow((u.y - y) * 12.0, 2.0)) * step(y, u.y)) * leyendo;
  float leido = frente ? t.g * vB.w * smoothstep(y - 0.01, y + 0.03, u.y) : 0.0;
  col = mix(col, col * vec3(0.6, 0.76, 1.0) + AIRE * 0.1, leido * 0.92);
  col += (vec3(0.62, 0.78, 1.0) * franja * 0.8) * (frente ? 1.0 : 0.35);

  float dist = length(vW - uCam);
  float s = step(0.795, ut.x) * step(ut.x, 0.9) * step(0.862, u.y) * step(u.y, 0.937) * vA.z * (frente ? 1.0 : 0.0);
  col = mix(col, AIRE * clamp(0.3 + 0.7 * luz + uNoche * 0.9, 0.0, 1.15), s);
  col = mix(col, uNiebla, 1.0 - exp(-dist * uDens));
  float alfa = a * vA.w / pow(vE, 1.55) * smoothstep(0.7, 2.4, dist);
  if (uReflejo < 1.0) alfa *= uReflejo * exp(-abs(vW.y) * 0.85);
  o = vec4(col, alfa);
}`;

/* Sombra proyectada en el suelo desde el foco: sin mapas de profundidad. */
export const SOMBRA_V = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
layout(location=1) in vec4 iP;
layout(location=2) in vec4 iQ;
layout(location=3) in vec4 iA;
uniform mat4 uVP; uniform vec3 uLuzPos; uniform vec2 uTam;
out vec2 vUv; out float vH, vAlfa; out vec3 vW;
vec3 rot(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
void main() {
  vec3 w = iP.xyz + rot(iQ, vec3(aPos.x * uTam.x, aPos.y * uTam.y, 0.0) * iP.w * 1.12);
  float h = max(w.y, 0.0);
  float k = uLuzPos.y / max(uLuzPos.y - h, 0.5);
  vec3 s = uLuzPos + (w - uLuzPos) * k; s.y = 0.004;
  vUv = aPos + 0.5; vH = h; vAlfa = iA.w; vW = s;
  gl_Position = uVP * vec4(s, 1.0);
}`;
export const SOMBRA_F = `#version 300 es
precision highp float;
uniform vec3 uLuzPos, uLuzDir; uniform float uCosInt, uCosExt, uSombra;
in vec2 vUv; in float vH, vAlfa; in vec3 vW; out vec4 o;
void main() {
  float b = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float blando = clamp(0.06 + vH * 0.22, 0.06, 0.5);
  float a = smoothstep(0.0, blando, b) / (1.0 + vH * 1.1);
  vec3 L = normalize(uLuzPos - vW);
  float cono = smoothstep(uCosExt, uCosInt, dot(-L, uLuzDir));
  o = vec4(0.0, 0.0, 0.0, a * vAlfa * uSombra * (0.25 + 0.75 * cono));
}`;

export const SUELO_V = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
uniform mat4 uVP; out vec3 vW;
void main() { vW = vec3(aPos.x * 140.0, 0.0, aPos.y * 140.0); gl_Position = uVP * vec4(vW, 1.0); }`;
export const SUELO_F = `#version 300 es
precision highp float;
uniform vec3 uLuzPos, uLuzDir, uCam, uNiebla, uTinte; uniform float uCosInt, uCosExt, uLuzI, uAmb, uDens, uSueloAlfa, uAlbedo;
in vec3 vW; out vec4 o;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float ruido(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
void main() {
  vec3 Lv = uLuzPos - vW; float dl = length(Lv); vec3 L = Lv / dl;
  float cono = smoothstep(uCosExt, uCosInt, dot(-L, uLuzDir));
  float n = ruido(vW.xz * 0.9) * 0.6 + ruido(vW.xz * 7.0) * 0.4;
  float luz = max(L.y, 0.0) * cono * uLuzI + uAmb * 0.8;
  vec3 V = normalize(uCam - vW);
  float esp = pow(max(dot(reflect(-L, vec3(0, 1, 0)), V), 0.0), 40.0) * cono * uLuzI * 0.5;
  vec3 col = vec3(uAlbedo * (0.82 + 0.36 * n)) * luz * uTinte + esp * 0.12;
  col = 1.0 - exp(-col * 1.25); col = mix(col, col * col * (3.0 - 2.0 * col), 0.55);
  float dist = length(vW - uCam);
  col = mix(col, uNiebla, 1.0 - exp(-dist * uDens));
  o = vec4(col, uSueloAlfa);
}`;

/* Mesas, pórticos y haces: cajas instanciadas. */
export const CAJA_V = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNor;
layout(location=2) in vec3 iPos;
layout(location=3) in vec4 iTam;   // xyz tamaño, w = tipo (0 sólido, 1 haz)
uniform mat4 uVP;
out vec3 vW, vN, vL; out float vTipo;
void main() { vW = iPos + aPos * iTam.xyz; vN = aNor; vL = aPos; vTipo = iTam.w; gl_Position = uVP * vec4(vW, 1.0); }`;
export const CAJA_F = `#version 300 es
precision highp float;
uniform vec3 uLuzPos, uLuzDir, uCam, uNiebla, uTinte; uniform float uCosInt, uCosExt, uLuzI, uAmb, uDens, uHaz, uPase, uAlbedo;
in vec3 vW, vN, vL; in float vTipo; out vec4 o;
void main() {
  if ((vTipo > 0.5) != (uPase > 0.5)) discard;
  float dist = length(vW - uCam);
  float f = 1.0 - exp(-dist * uDens);
  if (vTipo > 0.5) { // haz de lectura: luz, se suma
    float g = pow(1.0 - (vL.y + 0.5), 1.6) * (0.35 + 0.65 * smoothstep(0.5, 0.0, abs(vL.z)));
    o = vec4(vec3(0.357, 0.549, 1.0) * g * uHaz * (1.0 - f), 1.0); return;
  }
  vec3 L = normalize(uLuzPos - vW); vec3 N = normalize(vN);
  float cono = smoothstep(uCosExt, uCosInt, dot(-L, uLuzDir));
  float luz = max(dot(N, L), 0.0) * cono * uLuzI + uAmb * (0.5 + 0.5 * N.y);
  vec3 V = normalize(uCam - vW);
  float canto = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.06 * (cono * uLuzI + uAmb);
  vec3 col = vec3(uAlbedo) * luz * uTinte + canto;
  col = 1.0 - exp(-col * 1.25); col = mix(col, col * col * (3.0 - 2.0 * col), 0.55);
  o = vec4(mix(col, uNiebla, f), 1.0);
}`;

/* La bruma del foco: se integra la luz a lo largo de cada rayo de la cámara. */
export const BRUMA_V = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos; out vec2 vNdc;
void main() { vNdc = aPos * 2.0; gl_Position = vec4(aPos * 2.0, 0.0, 1.0); }`;
export const BRUMA_F = (pasos) => `#version 300 es
precision highp float;
uniform mat4 uInv; uniform vec3 uLuzPos, uLuzDir, uTinte; uniform float uCosInt, uCosExt, uLuzI, uBruma, uLargo;
in vec2 vNdc; out vec4 o;
float ign(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec4 a = uInv * vec4(vNdc, -1.0, 1.0), b = uInv * vec4(vNdc, 1.0, 1.0);
  vec3 ro = a.xyz / a.w, rd = normalize(b.xyz / b.w - ro);
  float paso = uLargo / float(${pasos});
  float t = paso * ign(gl_FragCoord.xy), acc = 0.0;
  for (int i = 0; i < ${pasos}; i++) {
    vec3 p = ro + rd * t;
    if (p.y > 0.0) { vec3 Lv = uLuzPos - p; float dl = length(Lv); acc += smoothstep(uCosExt, uCosInt, dot(-Lv / dl, uLuzDir)) / (1.0 + dl * dl * 0.012); }
    t += paso;
  }
  o = vec4(uTinte * acc * paso * uLuzI * uBruma, 1.0);
}`;
