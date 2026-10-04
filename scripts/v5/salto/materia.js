/* ==========================================================================
   EL SALTO · la materia
   --------------------------------------------------------------------------
   Todos los materiales del mundo comparten la misma luz (un sol, un cielo y
   una niebla con altura) y la misma textura de ruido. Se pintan en alto rango;
   la curva de tono la pone el revelado.
   ========================================================================== */
import { ShaderMaterial, BackSide, DoubleSide, NormalBlending, CustomBlending, OneFactor, OneMinusSrcAlphaFactor } from "three";

export const COMUN = /* glsl */ `
uniform vec3 uSol, uSolCol, uCieloAlto, uCieloBajo, uAmbCielo, uAmbSuelo, uNieblaCol;
uniform float uNieblaDens, uNieblaAlt, uTiempo, uNubes, uEstrellas, uHaloSol, uNivel, uObra, uInterior, uBancos, uSolB, uBajoAgua;
uniform sampler2D tRuido;
float tanSol() { return uSol.y / max(length(uSol.xz), 1e-3); }
float sombraDe(float h) { return smoothstep(h - 0.012, h + 0.075, tanSol()) * smoothstep(-0.03, 0.05, uSol.y); }
vec3 cieloBase(vec3 rd) {
  float y = max(rd.y, 0.0), sd = max(dot(rd, uSol), 0.0);
  vec3 c = mix(uCieloBajo, uCieloAlto, pow(y, 0.45));
  c += uSolCol * (0.10 * pow(sd, 5.0) + 0.55 * pow(sd, 90.0)) * uHaloSol * (0.35 + 0.65 * exp(-y * 5.0));
  return c;
}
vec3 cieloNubes(vec3 rd) {
  vec3 col = cieloBase(rd);
  if (rd.y > -0.03) {
    float sd = max(dot(rd, uSol), 0.0); vec2 uv = rd.xz / (max(rd.y, 0.0) + 0.17);
    float n = texture2D(tRuido, uv * 0.043 + uTiempo * vec2(0.0011, 0.0005)).r * 0.66 + texture2D(tRuido, uv * 0.127 - uTiempo * vec2(0.0015, 0.0002)).a * 0.34;
    float c = smoothstep(1.0 - uNubes, 1.38 - uNubes, n);
    vec3 nube = mix(uCieloBajo * 0.75 + uAmbCielo * 0.35, uCieloBajo * 0.9 + uSolCol * 0.36, 0.12 + 0.88 * pow(sd, 2.5));
    nube *= 1.0 - 0.42 * smoothstep(0.45, 0.95, n);
    col = mix(col, nube, c * smoothstep(-0.03, 0.14, rd.y) * 0.9);
  }
  return col;
}
vec3 colorNiebla(vec3 rd) { return uNieblaCol + uSolCol * 0.22 * pow(max(dot(rd, uSol), 0.0), 6.0) * uHaloSol; }
float cotaCauce(float z) { return z < -30.0 ? 45.0 + (-z - 30.0) * 0.011 : -max(0.0, z - 70.0) * 0.007; }
/* La niebla tiene dos partes: la del aire, que crece con la distancia y se queda abajo, y bancos que se agarran al fondo del valle. */
float cuantaNiebla(vec3 pos) {
  vec3 v = pos - cameraPosition; float dist = length(v), b = 1.0 / uNieblaAlt, k = v.y / dist * b;
  float f = uNieblaDens * exp(-cameraPosition.y * b) * (abs(k) < 1e-5 ? dist : (1.0 - exp(-dist * k)) / k);
  if (uBancos > 0.004) {
    float tramo = min(dist, 2600.0), s = 0.0;
    for (int i = 0; i < 4; i++) {
      vec3 p = cameraPosition + v * ((float(i) + 0.5) / 4.0 * tramo / dist);
      float n = texture2D(tRuido, p.xz * 0.00075 + uTiempo * vec2(0.0005, 0.0013)).r;
      s += exp(-max(p.y - cotaCauce(p.z) - 6.0, 0.0) / (12.0 + 30.0 * n)) * smoothstep(0.34, 0.78, n);
    }
    f += uBancos * 0.0009 * tramo * s * 0.25;
  }
  return 1.0 - exp(-max(f, 0.0));
}
vec3 conNiebla(vec3 col, vec3 pos) { return mix(col, colorNiebla(normalize(pos - cameraPosition)), cuantaNiebla(pos)); }
vec3 luzAmbiente(vec3 N, float ocl) { vec2 h = normalize(uSol.xz); return (mix(uAmbSuelo, uAmbCielo, N.y * 0.5 + 0.5) + uCieloBajo * 0.30 * max(N.x * h.x + N.z * h.y, 0.0) * uHaloSol) * ocl; }
`;

const mat = (U, vertexShader, fragmentShader, mas = {}) => new ShaderMaterial({ uniforms: { ...U, ...(mas.uniforms || {}) }, vertexShader, fragmentShader: COMUN + fragmentShader, ...Object.fromEntries(Object.entries(mas).filter(([k]) => k !== "uniforms")) });

/* ------------------------------------------------------------------ cielo */
export const matCielo = (U) => mat(U, /* glsl */ `
varying vec3 vDir;
void main() { vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(position * 9000.0 + cameraPosition, 1.0); gl_Position = p.xyww; gl_Position.z *= 0.99999; }`, /* glsl */ `
varying vec3 vDir;
float h21(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main() {
  vec3 rd = normalize(vDir);
  vec3 col = cieloNubes(rd);
  if (uEstrellas > 0.001 && rd.y > 0.0) { vec2 g = rd.xz / (rd.y + 0.6) * 260.0; vec2 c = floor(g); float e = h21(c); vec2 o = fract(g) - 0.5 - (vec2(h21(c + 3.1), h21(c + 7.7)) - 0.5) * 0.6; col += vec3(0.9, 0.95, 1.0) * uEstrellas * smoothstep(0.985, 1.0, e) * smoothstep(0.12, 0.0, length(o)) * (0.4 + 2.2 * h21(c + 1.3)) * smoothstep(0.02, 0.3, rd.y); }
  col += uSolCol * 30.0 * smoothstep(0.99986, 0.99996, dot(rd, uSol)) * smoothstep(-0.01, 0.02, rd.y);
  col = mix(col, colorNiebla(rd), exp(-max(rd.y, 0.0) * 11.0) * clamp(uNieblaDens * 1400.0, 0.0, 1.0));
  col = mix(col, uNieblaCol, uBajoAgua);
  gl_FragColor = vec4(col, 1.0);
}`, { side: BackSide, depthWrite: false, depthTest: false });

/* ----------------------------------------------------------------- terreno */
export const matTerreno = (U, mas) => mat(U, /* glsl */ `
attribute vec2 aHor;
varying vec3 vP, vN; varying vec2 vHor;
void main() { vP = position; vN = normal; vHor = aHor; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`, /* glsl */ `
uniform sampler2D tTerreno, tRoca; uniform vec4 uMapa;
varying vec3 vP, vN; varying vec2 vHor;
/* La roca se proyecta por los tres ejes y se mezcla según hacia dónde mira la superficie: así no se estira en las paredes. */
vec4 roca3(vec3 p, vec3 w, float esc, out vec3 grad) {
  vec4 a = texture2D(tRoca, p.zy * esc), b = texture2D(tRoca, p.xz * esc), c = texture2D(tRoca, p.xy * esc);
  grad = vec3(0.0, a.b - 0.5, a.g - 0.5) * w.x + vec3(b.g - 0.5, 0.0, b.b - 0.5) * w.y + vec3(c.g - 0.5, c.b - 0.5, 0.0) * w.z;
  return a * w.x + b * w.y + c * w.z;
}
void main() {
  float dist = length(vP - cameraPosition), cerca = 1.0 - smoothstep(140.0, 620.0, dist);
  vec4 tt = texture2D(tTerreno, (vP.xz - uMapa.xy) * uMapa.zw);
  vec3 Nm = vec3(tt.r * 2.0 - 1.0, 0.0, tt.g * 2.0 - 1.0); Nm.y = sqrt(max(1.0 - dot(Nm.xz, Nm.xz), 0.0));
  vec3 N = normalize(mix(Nm, normalize(vN), cerca * 0.7));
  float pend = 1.0 - N.y;
  vec4 r0 = texture2D(tRuido, vP.xz * 0.0029), r1 = texture2D(tRuido, vP.xz * 0.0137);
  vec3 w = pow(abs(N), vec3(5.0)); w /= w.x + w.y + w.z;
  vec3 gLejos, gCerca;
  vec4 lejos = roca3(vP, w, 1.0 / 150.0, gLejos), fina = roca3(vP + lejos.r * 3.0, w, 1.0 / 21.0, gCerca);
  float esRoca = smoothstep(0.14, 0.32, pend + (lejos.r - 0.5) * 0.2);
  N = normalize(N - gLejos * (0.7 + 1.0 * esRoca) - gCerca * 1.3 * cerca * (0.3 + 0.7 * esRoca));
  // roca fracturada, derrubio, bosque oscuro y nieve arriba
  float grieta = min(lejos.a, mix(1.0, fina.a, cerca));
  vec3 roca = mix(vec3(0.060, 0.062, 0.067), vec3(0.250, 0.247, 0.238), lejos.r * 0.55 + r1.a * 0.25 + fina.r * 0.20 * cerca);
  roca *= 0.74 + 0.26 * grieta;
  vec3 tierra = mix(vec3(0.050, 0.055, 0.046), vec3(0.135, 0.136, 0.118), r1.a * 0.6 + fina.r * 0.4);
  vec3 alb = mix(tierra, roca, esRoca);
  float bosque = smoothstep(0.42, 0.66, r1.r * 0.3 + r0.r * 0.85) * (1.0 - smoothstep(0.16, 0.34, pend)) * smoothstep(20.0, 70.0, vP.y - cotaCauce(vP.z)) * (1.0 - smoothstep(380.0, 520.0, vP.y + r1.a * 80.0));
  alb = mix(alb, vec3(0.016, 0.021, 0.018) * (0.55 + 0.9 * fina.r), bosque);
  float nieve = smoothstep(470.0, 640.0, vP.y + (r1.r - 0.5) * 150.0 + (r0.r - 0.5) * 220.0) * smoothstep(0.62, 0.30, pend + (lejos.r - 0.5) * 0.25);
  alb = mix(alb, vec3(0.78, 0.81, 0.85), nieve);
  // mojado: la franja que deja el embalse y la roca junto al salto
  float moj = smoothstep(uNivel + 3.0, uNivel - 1.0, vP.y) * step(vP.z, -40.0) * (1.0 - nieve);
  moj = max(moj, (1.0 - smoothstep(22.0, 90.0, length(vP.xz - vec2(0.0, -18.0)))) * 0.7);
  alb *= mix(1.0, 0.40, moj);
  alb = mix(alb, vec3(0.11, 0.115, 0.105) * (0.7 + 0.5 * fina.r), uBajoAgua * step(vP.z, -40.0) * smoothstep(uNivel + 1.0, uNivel - 2.0, vP.y));
  float sombra = sombraDe(mix(vHor.x, vHor.y, uSolB));
  float nl = max(dot(N, uSol), 0.0);
  float ocl = tt.b * (0.62 + 0.38 * grieta);
  vec3 luz = uSolCol * nl * sombra + luzAmbiente(N, ocl);
  vec3 col = alb * luz;
  vec3 V = normalize(cameraPosition - vP);
  col += uSolCol * sombra * pow(max(dot(reflect(-uSol, N), V), 0.0), 24.0) * (0.10 * nieve + 0.25 * moj);
  col += cieloBase(reflect(-V, N)) * (moj * 0.16 + 0.02 * esRoca) * pow(1.0 - max(dot(N, V), 0.0), 3.0);   // la roca mojada devuelve el cielo
  gl_FragColor = vec4(conNiebla(col, vP), 1.0);
}`, mas);

/* --------------------------------------------------------------------- río */
export const matRio = (U, mas) => mat(U, /* glsl */ `
attribute vec3 aRio; attribute vec2 aHor;
varying vec3 vP; varying vec3 vRio; varying float vHor;
uniform float uSolB;
void main() { vP = position; vRio = aRio; vHor = mix(aHor.x, aHor.y, uSolB); gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`, /* glsl */ `
uniform float uNatural, uCaudal;
varying vec3 vP; varying vec3 vRio; varying float vHor;
void main() {
  float u = vRio.x, v = vRio.y, cae = vRio.z, t = uTiempo;
  float flujo = vP.z < -18.0 ? uNatural : max(uNatural, uCaudal);
  if (flujo < 0.004) discard;
  // el agua acelera al acercarse al labio y sale revuelta del pie del salto
  float labio = smoothstep(-260.0, -36.0, vP.z) * step(vP.z, -30.0), revuelta = exp(-max(vP.z + 6.0, 0.0) / 210.0) * step(-22.0, vP.z);
  float vel = (3.0 + 7.0 * labio + 9.0 * revuelta + 16.0 * cae) * (0.4 + 0.6 * flujo);
  float x = vP.x;
  float n1 = texture2D(tRuido, vec2(x * 0.023, v * 0.0034 - t * vel * 0.0034)).r, n2 = texture2D(tRuido, vec2(x * 0.071 + n1 * 0.2, v * 0.0105 - t * vel * 0.0105)).a, n3 = texture2D(tRuido, vec2(x * 0.24 - n2 * 0.15, v * 0.034 - t * vel * 0.034)).r, n4 = texture2D(tRuido, vec2(x * 0.71, v * 0.11 - t * vel * 0.11)).a;
  float l3 = 1.0 - abs(n3 * 2.0 - 1.0);
  float bravo = 0.05 + 0.26 * labio + 0.74 * revuelta + smoothstep(0.72, 1.0, abs(u)) * 0.2;
  bravo *= 0.12 + 0.88 * flujo;
  // vetas largas de espuma, más anchas cuanta más fuerza lleva el agua
  float esp = n1 * 0.40 + n2 * 0.30 + n3 * 0.20 + n4 * 0.10;
  float espuma = smoothstep(0.52, 0.86, esp + (bravo - 0.5) * 0.95) * (0.72 + 0.28 * n4);
  vec3 V = normalize(cameraPosition - vP);
  vec3 N = normalize(vec3((n2 - 0.5) * 0.5 + (n3 - 0.5) * 0.35, 1.0, (n1 - 0.5) * 0.4 + (n3 - 0.5) * 0.3));
  float fr = 0.03 + 0.97 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  float sombra = sombraDe(vHor);
  vec3 agua = mix(vec3(0.012, 0.020, 0.022) * (uAmbCielo * 3.0 + uSolCol * sombra * 0.3), cieloBase(reflect(-V, N)), fr * 0.8);
  agua += uSolCol * sombra * pow(max(dot(reflect(-uSol, N), V), 0.0), 140.0) * 2.5;
  vec3 luzBlanca = uAmbCielo * 1.35 + uSolCol * sombra * 0.6;
  vec3 col = mix(agua, luzBlanca * mix(0.6, 0.95, l3), espuma);
  float a = smoothstep(1.0, 0.88 - 0.2 * n3, abs(u)) * smoothstep(0.0, 0.12, flujo);
  if (cae > 0.02) {
    // la caída: hebras verticales que se abren al bajar
    float h1 = texture2D(tRuido, vec2(x * 0.13, v * 0.006 - t * 0.11)).r, h2 = texture2D(tRuido, vec2(x * 0.53 + 0.2, v * 0.015 - t * 0.31)).a, h4 = texture2D(tRuido, vec2(x * 1.7, v * 0.03 - t * 0.6)).r, h3 = texture2D(tRuido, vec2(x * 0.045, v * 0.003 - t * 0.05)).a;
    float hebra = h1 * 0.4 + h2 * 0.36 + h4 * 0.24;
    vec3 velo = luzBlanca * (0.30 + 0.95 * smoothstep(0.3, 0.75, hebra)) * (0.75 + 0.5 * h3);
    col = mix(col, velo, cae);
    a *= mix(1.0, smoothstep(0.26, 0.56, hebra * 0.6 + h3 * 0.55 + flujo * 0.12), cae);
  }
  gl_FragColor = vec4(conNiebla(col, vP), a);
}`, { transparent: true, depthWrite: false, side: DoubleSide, ...mas });

/* ------------------------------------------------------------------- bruma */
export const matBruma = (U, mas) => mat(U, /* glsl */ `
uniform float uRocio, uTiempo, uHorRocio; uniform vec3 uSol;
attribute vec3 aBase; attribute vec4 aDatos;
varying vec2 vUv; varying float vA; varying vec3 vP; varying float vSem, vSol;
void main() {
  float ciclo = fract(aDatos.y + uTiempo * aDatos.z), s = aDatos.y;
  vec3 c = aBase + vec3(sin(s * 37.0) * 14.0 * ciclo, ciclo * aDatos.w, ciclo * ciclo * (10.0 + 36.0 * fract(s * 3.1)));
  float tam = aDatos.x * (0.35 + ciclo * 1.25);
  vA = sin(pow(ciclo, 0.7) * 3.1416) * uRocio * 0.3;
  vec3 der = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), arr = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 wp = c + (der * position.x + arr * position.y) * tam;
  vUv = position.xy; vP = wp; vSem = s;
  float hor = uHorRocio - max(c.y, 0.0) / 160.0;
  vSol = smoothstep(hor - 0.03, hor + 0.12, uSol.y / max(length(uSol.xz), 1e-3)) * smoothstep(-0.03, 0.05, uSol.y);
  vA *= smoothstep(tam * 0.3, tam * 1.6, length(wp - cameraPosition));
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`, /* glsl */ `
varying vec2 vUv; varying float vA; varying vec3 vP; varying float vSem, vSol;
void main() {
  float r = length(vUv); if (r > 1.0 || vA < 0.003) discard;
  float n = texture2D(tRuido, vUv * 0.19 + vSem * 3.7 + uTiempo * 0.008).r * 0.6 + texture2D(tRuido, vUv * 0.47 - vSem * 1.9 - uTiempo * 0.013).a * 0.4;
  float a = pow(1.0 - r, 1.5) * smoothstep(0.25, 0.8, n + (1.0 - r) * 0.5) * vA;
  vec3 rd = normalize(vP - cameraPosition);
  vec3 col = uAmbCielo * 1.3 + uSolCol * (0.22 + 0.5 * pow(max(dot(rd, uSol), 0.0), 3.0)) * vSol + uCieloBajo * 0.55 * pow(max(dot(normalize(rd.xz), normalize(uSol.xz)), 0.0), 2.0) * uHaloSol;
  col = mix(col, colorNiebla(rd), cuantaNiebla(vP) * 0.8);
  gl_FragColor = vec4(col * a, a);
}`, { transparent: true, depthWrite: false, blending: CustomBlending, blendSrc: OneFactor, blendDst: OneMinusSrcAlphaFactor, ...mas });

/* ------------------------------------------------------- hormigón de la presa */
const HORMIGON = /* glsl */ `
/* Hormigón visto: paños de encofrado, tongadas, chorreones de agua y la base húmeda. s: metros a lo largo del muro. */
vec3 hormigon(float s, float y, vec3 P, float sucio) {
  vec4 n1 = texture2D(tRuido, vec2(s, y) * 0.0043), n2 = texture2D(tRuido, vec2(s * 0.085, y * 0.0085)), n3 = texture2D(tRuido, vec2(s, y) * 0.19);
  vec2 pano = floor(vec2(s / 5.67, y / 2.5)); float tono = fract(sin(dot(pano, vec2(12.9898, 78.233))) * 43758.5453);
  vec3 c = vec3(0.335, 0.330, 0.320) * (0.80 + 0.22 * n1.r + 0.10 * tono + 0.10 * n3.r);
  float jv = abs(fract(s / 5.67 + 0.5) - 0.5) * 5.67, jh = abs(fract(y / 2.5 + 0.5) - 0.5) * 2.5;
  c *= 1.0 - 0.30 * smoothstep(0.11, 0.02, jv) - 0.22 * smoothstep(0.09, 0.02, jh);
  float chorreon = smoothstep(0.55, 0.95, n2.a * 0.6 + n1.a * 0.55) * sucio * smoothstep(0.25, 0.7, n1.r + n3.a * 0.2);
  c *= 1.0 - 0.34 * chorreon;
  c += vec3(0.10) * smoothstep(0.62, 0.95, n2.r) * smoothstep(0.05, 0.6, jh) * sucio * 0.6;   // sales blancas
  return c;
}`;
export const matPresa = (U, mas) => mat(U, /* glsl */ `
uniform float uObraY;
attribute vec3 aArco; attribute vec4 aTira;
varying vec3 vP, vN; varying vec4 vDat;
float grosor(float y) { return 7.0 + 17.0 * pow(max(0.0, (120.0 - y) / 82.0), 1.4); }
void main() {
  float tope = max(30.0, min(aTira.x, uObraY + aTira.y * 14.0 - 7.0)), y = min(aArco.y, tope), ang = aArco.x, cara = aTira.z;
  float r = ${"112.0"} - aArco.z * grosor(y), sn = sin(ang), cs = cos(ang);
  vP = vec3(r * sn, y, 40.0 - r * cs);
  float inclin = 17.0 * 1.4 / 82.0 * pow(max(0.0, (120.0 - y) / 82.0), 0.4);
  vN = cara < 0.5 ? vec3(sn, 0.0, -cs) : cara < 1.5 ? normalize(vec3(-sn, inclin, cs)) : cara < 2.5 ? vec3(0.0, 1.0, 0.0) : cara < 3.5 ? vec3(-cs, 0.0, -sn) : vec3(cs, 0.0, sn);
  vDat = vec4(ang * 112.0, cara, aTira.w, tope - y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vP, 1.0);
}`, HORMIGON + /* glsl */ `
uniform float uObraY, uGrabado; uniform sampler2D tGrabado; uniform vec4 uPlaca;
varying vec3 vP, vN; varying vec4 vDat;
void main() {
  vec3 N = normalize(vN); float cara = vDat.y, s = vDat.x;
  float terminado = smoothstep(96.0, 122.0, uObraY);
  vec3 alb = cara > 1.5 && cara < 2.5 ? vec3(0.36, 0.355, 0.345) * (0.85 + 0.3 * texture2D(tRuido, vP.xz * 0.08).r) : hormigon(s + cara * 37.0, vP.y, vP, cara > 2.5 ? 0.3 : 0.35 + 0.65 * terminado);
  // recién desencofrado: lo último que se ha hormigonado es más claro
  alb *= 1.0 + 0.22 * smoothstep(9.0, 0.0, vDat.w) * (1.0 - terminado);
  alb *= mix(0.62, 1.0, smoothstep(40.0, 72.0, vP.y));                       // humedad al pie
  if (cara < 0.5) alb *= mix(0.45, 1.0, smoothstep(uNivel - 0.5, uNivel + 2.5, vP.y));   // la franja mojada del embalse
  float relieve = 0.0;
  if (cara > 0.5 && cara < 1.5 && uGrabado > 0.001) {
    // el nombre grabado en el muro: letras rehundidas, con su sombra y su canto iluminado
    vec2 q = vec2((s - uPlaca.x) / uPlaca.z, (vP.y - uPlaca.y) / uPlaca.w);
    if (q.x > 0.0 && q.x < 1.0 && q.y > 0.0 && q.y < 1.0) {
      float e = 0.0035, h = texture2D(tGrabado, q).r, hx = texture2D(tGrabado, q + vec2(e, 0.0)).r - texture2D(tGrabado, q - vec2(e, 0.0)).r, hy = texture2D(tGrabado, q + vec2(0.0, e * 2.6)).r - texture2D(tGrabado, q - vec2(0.0, e * 2.6)).r;
      vec3 T = vec3(cos(s / 112.0), 0.0, sin(s / 112.0));
      N = normalize(N + (T * hx + vec3(0.0, 1.0, 0.0) * hy) * 2.6 * uGrabado);
      alb *= 1.0 - 0.42 * h * uGrabado; relieve = h * uGrabado;
    }
  }
  float sombra = sombraDe(vDat.z);
  vec3 col = alb * (uSolCol * max(dot(N, uSol), 0.0) * sombra * (1.0 - 0.6 * relieve) + luzAmbiente(N, cara > 1.5 ? 1.0 : 0.82 - 0.35 * relieve));
  gl_FragColor = vec4(conNiebla(col, vP), 1.0);
}`, mas);

/* ------------------------------------------------------------ obra y acero */
export const matObra = (U, mas) => mat(U, /* glsl */ `
attribute float aMat, aHor; varying vec3 vP, vN; varying vec2 vDat;
void main() { vP = position; vN = normal; vDat = vec2(aMat, aHor); gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`, HORMIGON + /* glsl */ `
uniform float uObraY, uLuces;
varying vec3 vP, vN; varying vec2 vDat;
void main() {
  if (vP.y > (uObraY - 24.0) * 1.62 - 2.0) discard;
  vec3 N = normalize(vN), V = normalize(cameraPosition - vP); float m = vDat.x, sombra = sombraDe(vDat.y);
  vec3 alb, extra = vec3(0.0); float brillo = 0.0;
  if (m < 0.5) alb = hormigon(vP.x * abs(N.z) + vP.z * abs(N.x) + vP.x * abs(N.y), vP.y * (1.0 - abs(N.y)) + vP.z * abs(N.y), vP, 0.5);
  else if (m < 1.5) { alb = vec3(0.035, 0.037, 0.040); brillo = 0.5; }
  else if (m < 2.5) { alb = vec3(0.02, 0.025, 0.03); brillo = 1.0; float cel = step(0.35, fract(sin(dot(floor(vP.zy * vec2(0.14, 0.2)), vec2(12.9898, 78.233))) * 43758.5453)); extra = vec3(1.0, 0.70, 0.40) * 2.6 * uLuces * (0.45 + 0.55 * cel); }
  else if (m > 3.5) { gl_FragColor = vec4(mix(vec3(0.0), uNieblaCol, 0.25 * cuantaNiebla(vP)), 1.0); return; }
  else { alb = vec3(0.30, 0.31, 0.32) * (0.85 + 0.3 * texture2D(tRuido, vP.zy * 0.05).r) * (1.0 - 0.35 * smoothstep(0.25, 0.05, abs(fract(length(vP.yz) / 7.0) - 0.5))); brillo = 0.25; }
  vec3 col = alb * (uSolCol * max(dot(N, uSol), 0.0) * sombra + luzAmbiente(N, 0.9));
  col += cieloNubes(reflect(-V, N)) * brillo * (0.04 + 0.5 * pow(1.0 - max(dot(N, V), 0.0), 4.0)) + extra;
  gl_FragColor = vec4(conNiebla(col, vP), 1.0);
}`, mas);

export const matHojas = (U, mas) => mat(U, /* glsl */ `
uniform float uPuertas[5], uObraY; attribute float aHoja; varying vec3 vP, vN; varying float vVer;
void main() { vP = position; vP.y += uPuertas[int(aHoja + 0.5)] * 6.6; vN = normal; vVer = step(121.0, uObraY); gl_Position = projectionMatrix * viewMatrix * vec4(vP, 1.0); }`, /* glsl */ `
varying vec3 vP, vN; varying float vVer;
void main() {
  if (vVer < 0.5) discard;
  vec3 N = normalize(vN), V = normalize(cameraPosition - vP);
  float costilla = smoothstep(0.12, 0.0, abs(fract(vP.y / 1.4) - 0.5) - 0.38);
  vec3 col = vec3(0.045, 0.048, 0.052) * (0.7 + 0.5 * costilla) * (uSolCol * max(dot(N, uSol), 0.0) * 0.8 + luzAmbiente(N, 0.8)) + cieloNubes(reflect(-V, N)) * 0.05;
  gl_FragColor = vec4(conNiebla(col, vP), 1.0);
}`, { side: DoubleSide, ...mas });

/* ------------------------------------------------------------------ chorros */
export const matChorros = (U, mas) => mat(U, /* glsl */ `
uniform float uPuertas[5]; attribute vec3 aChorro; attribute float aHor;
varying vec3 vP, vCho; varying vec2 vDat;
void main() { vP = position; vCho = aChorro; vDat = vec2(uPuertas[int(aChorro.z + 0.5)], aHor); gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`, /* glsl */ `
varying vec3 vP, vCho; varying vec2 vDat;
void main() {
  float u = vCho.x, a = vCho.y, ab = vDat.x; if (ab < 0.012) discard;
  float t = uTiempo, vel = 0.5 + a * 1.5, k = vCho.z * 0.37;
  float h1 = texture2D(tRuido, vec2(u * 0.33 + k, a * 0.9 - t * vel * 0.42)).r, h2 = texture2D(tRuido, vec2(u * 1.3 + k * 2.0, a * 2.2 - t * vel * 0.95)).a, h3 = texture2D(tRuido, vec2(u * 0.12 + k, a * 0.4 - t * 0.21)).a;
  float hebra = h1 * 0.5 + h2 * 0.5, aire = smoothstep(0.0, 0.16, a);
  float sombra = sombraDe(vDat.y - a * 0.12);
  vec3 V = normalize(cameraPosition - vP);
  vec3 luzB = uAmbCielo * 1.4 + uSolCol * sombra * 0.7;
  vec3 col = mix(cieloNubes(reflect(-V, vec3(0.0, 0.5, 0.86))) * 0.55 + luzB * 0.12, luzB * (0.50 + 0.56 * hebra) * (0.8 + 0.4 * h3), aire);
  float ancho = mix(0.55, 1.0, smoothstep(0.0, 0.5, ab));
  float alfa = smoothstep(ancho, ancho * (0.74 - 0.22 * a), abs(u)) * mix(0.92, smoothstep(0.16, 0.56, hebra * 0.62 + h3 * 0.5 + 0.2 * ab - a * 0.12), aire);
  alfa *= smoothstep(0.0, 0.12, ab) * smoothstep(1.0, 0.86, a);
  gl_FragColor = vec4(conNiebla(col, vP), alfa);
}`, { transparent: true, depthWrite: false, side: DoubleSide, ...mas });

/* ------------------------------------------------------------------ embalse */
export const matEmbalse = (U, mas) => mat(U, /* glsl */ `
uniform float uNivel; varying vec3 vP;
void main() { vP = vec3(position.x, uNivel, position.z); gl_Position = projectionMatrix * viewMatrix * vec4(vP, 1.0); }`, /* glsl */ `
uniform sampler2D tTerreno; uniform vec4 uMapa;
varying vec3 vP;
void main() {
  if (uNivel < 46.5 || (length(vec2(vP.x, vP.z - 40.0)) < 111.7 && vP.z < 40.0)) discard;
  float t = uTiempo, dist = length(vP - cameraPosition);
  vec2 g = (texture2D(tRuido, vP.xz * 0.011 + t * vec2(0.004, 0.009)).gb - 0.5) * 0.6 + (texture2D(tRuido, vP.xz * 0.047 - t * vec2(0.013, 0.004)).gb - 0.5) * 0.5 + (texture2D(tRuido, vP.xz * 0.21 + t * vec2(0.03, -0.02)).gb - 0.5) * 0.35 * (1.0 - smoothstep(60.0, 420.0, dist));
  vec3 N = normalize(vec3(g.x * 0.16, 1.0, g.y * 0.16)), V = normalize(cameraPosition - vP);
  float fr = 0.025 + 0.975 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  vec4 tt = texture2D(tTerreno, (vP.xz - uMapa.xy) * uMapa.zw);
  float sombra = sombraDe(tt.a * 1.75 - 0.25);
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  vec3 col = mix(vec3(0.010, 0.022, 0.026) * (uAmbCielo * 2.6 + uSolCol * sombra * 0.4), cieloNubes(R), fr);
  col += uSolCol * sombra * pow(max(dot(R, uSol), 0.0), 380.0) * 5.0;
  if (cameraPosition.y < uNivel) {
    // desde abajo: la superficie es un techo que deja pasar la luz justo encima y es espejo oscuro hacia los lados
    float arriba = max(-V.y, 0.0), ventana = smoothstep(0.62, 0.80, arriba + (g.x + g.y) * 0.22);
    col = mix(uNieblaCol * 0.6, (uCieloBajo * 0.9 + uSolCol * 0.25) * (0.75 + 0.5 * (g.x + g.y + 0.5)), ventana);
    gl_FragColor = vec4(mix(col, uNieblaCol, 1.0 - exp(-dist * 0.012)), 1.0); return;
  }
  gl_FragColor = vec4(conNiebla(col, vP), 1.0);
}`, { side: DoubleSide, ...mas });

/* ------------------------------------------------------------------ farolas */
export const matFaroles = (U, mas) => mat(U, /* glsl */ `
uniform float uLuces, uObraY, uFuerza; attribute vec3 aBase; attribute vec2 aFarol;
varying vec2 vUv; varying float vI;
void main() {
  vec3 der = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), arr = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  float d = length(aBase - cameraPosition), tam = aFarol.x * (0.45 + d * 0.0022);
  vec3 wp = aBase + (der * position.x + arr * position.y) * tam;
  vUv = position.xy; vI = uFuerza * smoothstep(aFarol.y, aFarol.y + 0.04, uLuces) * step(aBase.y, (uObraY - 24.0) * 1.62 - 2.0) * exp(-d * 0.00042);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`, /* glsl */ `
uniform vec3 uColorLuz; varying vec2 vUv; varying float vI;
void main() {
  float r = length(vUv); if (r > 1.0 || vI < 0.004) discard;
  float f = exp(-r * r * 30.0) * 5.0 + exp(-r * 5.5) * 0.4 * (1.0 - r);
  gl_FragColor = vec4(uColorLuz * f * vI, 1.0);
}`, { transparent: true, depthWrite: false, blending: CustomBlending, blendSrc: OneFactor, blendDst: OneFactor, ...mas });

/* --------------------------------------------- bajo el agua: rayos y motas */
export const matRayos = (U, mas) => mat(U, /* glsl */ `
uniform float uNivel, uBajoAgua, uTiempo; attribute vec3 aBase; attribute vec2 aRayo;
varying vec2 vUv; varying float vA, vS;
void main() {
  vec3 c = vec3(aBase.x, uNivel, aBase.z); vec2 a = normalize(cameraPosition.xz - c.xz);
  vec3 der = vec3(a.y, 0.0, -a.x);
  vec3 wp = c + der * position.x * aRayo.x + vec3(0.22, -1.0, 0.1) * (position.y * 0.5 + 0.5) * 62.0;
  vUv = position.xy; vS = aRayo.y; vA = uBajoAgua * smoothstep(6.0, 28.0, length(wp.xz - cameraPosition.xz));
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`, /* glsl */ `
varying vec2 vUv; varying float vA, vS;
void main() {
  if (vA < 0.004) discard;
  float n = texture2D(tRuido, vec2(vUv.x * 0.22 + vS * 5.0, uTiempo * 0.035 + vS)).r, n2 = texture2D(tRuido, vec2(vUv.x * 0.6 + vS * 9.0, uTiempo * 0.06)).a;
  float a = smoothstep(1.0, 0.2, abs(vUv.x)) * smoothstep(1.0, -0.6, vUv.y) * smoothstep(0.38, 0.82, n * 0.6 + n2 * 0.4) * vA;
  gl_FragColor = vec4((uCieloBajo * 0.5 + uSolCol * 0.10) * a * 0.34, 1.0);
}`, { transparent: true, depthWrite: false, blending: CustomBlending, blendSrc: OneFactor, blendDst: OneFactor, side: DoubleSide, ...mas });

export const matMotas = (U, mas) => mat(U, /* glsl */ `
uniform float uBajoAgua, uTiempo; uniform vec3 uBoca, uBocaN; attribute vec3 aBase; attribute vec2 aMota;
varying vec2 vUv; varying float vA;
void main() {
  // cada mota deriva hacia la boca de la toma y entra por ella
  float ciclo = fract(aMota.y + uTiempo * (0.018 + 0.03 * fract(aMota.y * 7.0)));
  vec3 c = mix(aBase, uBoca + (aBase - uBoca) * 0.04, pow(ciclo, 2.2)) + vec3(sin(uTiempo * 0.4 + aMota.y * 30.0), cos(uTiempo * 0.31 + aMota.y * 17.0), sin(uTiempo * 0.27 + aMota.y * 11.0)) * 0.5 * (1.0 - ciclo);
  vec3 der = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), arr = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 wp = c + (der * position.x + arr * position.y) * aMota.x;
  float d = length(wp - cameraPosition);
  vUv = position.xy; vA = uBajoAgua * sin(ciclo * 3.1416) * exp(-d * 0.02) * smoothstep(1.0, 4.0, d);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`, /* glsl */ `
varying vec2 vUv; varying float vA;
void main() { float r = length(vUv); if (r > 1.0 || vA < 0.004) discard; float a = (1.0 - r) * (1.0 - r) * vA; gl_FragColor = vec4((uCieloBajo * 0.9 + uSolCol * 0.12) * a, 1.0); }`, { transparent: true, depthWrite: false, blending: CustomBlending, blendSrc: OneFactor, blendDst: OneFactor, ...mas });

/* ------------------------------------------------------------ la nave */
const NAVE_GLSL = /* glsl */ `
uniform float uGiro, uOnda, uActivo; uniform sampler2D tContador, tRotulo;
const float LARGO = 99.0, MEDIO = 14.0;
const vec2 CONT = vec2(24.0, 5.34); const float CONT_Y = 9.4;
vec3 SOLV = normalize(vec3(0.60, 0.58, -0.07));
float ventana(vec3 q) { float zc = mod(q.z, 11.0); return smoothstep(11.5, 11.75, q.y) * smoothstep(16.5, 16.25, q.y) * smoothstep(3.0, 3.2, zc) * smoothstep(8.0, 7.8, zc) * step(0.0, q.z) * step(q.z, LARGO); }
float solDentro(vec3 P) { if (P.x > 13.95 || P.z < 0.0) return 0.0; float t = (MEDIO - P.x) / SOLV.x; return ventana(P + SOLV * t); }
vec3 tiras(vec3 P, vec3 N) {
  vec3 s = vec3(0.0);
  for (int i = 0; i < 2; i++) { float x0 = i == 0 ? -6.0 : 6.0; vec2 d = vec2(x0 - P.x, 17.2 - P.y); float r = length(d); s += vec3(1.0, 0.965, 0.91) * max(dot(N, vec3(d.x, d.y, 0.0) / r), 0.0) * 1.15 / (r + 2.0); }
  return s * smoothstep(-4.0, 6.0, P.z);
}
vec3 espejo(vec3 P, vec3 R) {
  // lo que se refleja: las tiras del techo, las ventanas y el contador del fondo
  vec3 c = vec3(0.0);
  if (R.y > 0.001) { float t = (17.2 - P.y) / R.y; vec3 q = P + R * t; c += vec3(1.0, 0.965, 0.91) * 5.0 * smoothstep(0.30, 0.12, abs(abs(q.x) - 6.0)) * step(3.0, q.z) * step(q.z, LARGO - 3.0); }
  if (R.x > 0.001) { float t = (MEDIO - P.x) / R.x; c += vec3(1.0) * 3.2 * ventana(P + R * t); }
  if (R.z > 0.001) { float t = (LARGO - 0.55 - P.z) / R.z; vec3 q = P + R * t; vec2 uv = vec2(q.x / CONT.x + 0.5, (q.y - CONT_Y) / CONT.y + 0.5); if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) c += texture2D(tContador, uv).rgb * vec3(1.0, 0.82, 0.60) * 4.0; }
  return c;
}`;
export const matNave = (U, mas) => mat(U, /* glsl */ `
uniform vec3 uOrigen; attribute vec2 aDat; varying vec3 vP, vN; varying vec2 vDat;
void main() { vP = position; vN = normal; vDat = aDat; gl_Position = projectionMatrix * viewMatrix * vec4(position * vec3(-1.0, 1.0, 1.0) + uOrigen, 1.0); }`, HORMIGON + NAVE_GLSL + /* glsl */ `
uniform vec3 uOrigen; varying vec3 vP, vN; varying vec2 vDat;
void main() {
  vec3 C = (cameraPosition - uOrigen) * vec3(-1.0, 1.0, 1.0);
  vec3 N = normalize(vN), P = vP, V = normalize(C - P); float m = vDat.x, dist = length(C - P);
  if (dot(N, V) < 0.0) N = -N;
  vec3 col;
  if (m > 7.5 && m < 8.5) {
    // la tubería: acero mojado, costuras cada seis metros y la luz de la nave al fondo
    float costura = smoothstep(0.16, 0.04, abs(fract(P.z / 6.0) - 0.5) * 6.0), fin = exp(min(P.z, 0.0) * 0.012), veta = texture2D(tRuido, vec2(atan(P.y - 9.0, P.x) * 0.6, P.z * 0.004)).r;
    float brillo = pow(max(dot(reflect(-V, N), vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
    col = vec3(0.006, 0.007, 0.008) * (0.6 + 0.8 * veta) + vec3(1.0, 0.95, 0.88) * fin * fin * (0.012 + 0.20 * brillo * (0.25 + 0.75 * veta) + 0.14 * costura * brillo) + vec3(0.006, 0.008, 0.009) * costura;
    gl_FragColor = vec4(col, 1.0); return;
  }
  float sol = solDentro(P) * max(dot(N, SOLV), 0.0);
  vec3 luz = vec3(0.014, 0.016, 0.019) + tiras(P, N) + vec3(1.0, 0.98, 0.94) * 4.2 * sol;
  // el contador ilumina el fondo de la nave
  vec3 alContador = vec3(0.0, CONT_Y, LARGO) - P; float dc = length(alContador);
  luz += vec3(1.0, 0.80, 0.56) * 34.0 * max(dot(N, alContador / dc), 0.0) / (dc * dc + 60.0) * (0.35 + 0.65 * uActivo);
  if (m < 0.5) { float s = abs(N.x) > 0.5 ? P.z : P.x; col = hormigon(s, P.y, P, 0.25) * 0.62 * luz; }
  else if (m < 1.5) {
    // suelo pulido
    vec2 lo = floor(P.xz / 2.0); float tono = fract(sin(dot(lo, vec2(12.9898, 78.233))) * 43758.5453), junta = smoothstep(0.03, 0.0, min(abs(fract(P.x / 2.0) - 0.5), abs(fract(P.z / 2.0) - 0.5)) * 2.0 - 0.97);
    vec4 r = texture2D(tRuido, P.xz * 0.11);
    vec3 Nr = normalize(N + vec3(r.g - 0.5, 0.0, r.b - 0.5) * 0.012);
    float fr = 0.05 + 0.95 * pow(1.0 - max(dot(Nr, V), 0.0), 4.0);
    col = vec3(0.075, 0.077, 0.080) * (0.85 + 0.2 * tono + 0.15 * r.r) * (1.0 - 0.4 * junta) * luz + espejo(P, reflect(-V, Nr)) * fr * 0.62;
  }
  else if (m < 2.5) { col = vec3(0.030, 0.032, 0.035) * luz + espejo(P, reflect(-V, N)) * 0.03; }
  else if (m < 3.5) col = vec3(1.0, 0.965, 0.91) * 5.0;
  else if (m < 4.5) {
    // la máquina: pintura clara satinada; la tapa de arriba gira
    vec3 c = vec3(0.20, 0.205, 0.21);
    if (vDat.y > 9.5) { float g = vDat.y - 10.0, cz = 26.0 + g * 22.0; float a = atan(P.z - cz, P.x - 4.5) + uGiro * (0.8 + 0.1 * g); c = mix(vec3(0.05), vec3(0.42), smoothstep(0.35, 0.65, fract(a * 6.0 / 6.2832))); }
    c *= 1.0 - 0.3 * smoothstep(0.03, 0.0, abs(fract(P.y / 1.25) - 0.5) - 0.47);
    float fr = 0.04 + 0.5 * pow(1.0 - max(dot(N, V), 0.0), 3.0);
    col = c * luz + espejo(P, reflect(-V, N)) * fr * 0.25;
  }
  else if (m < 5.5) { vec2 uv = vec2(P.x / CONT.x + 0.5, (P.y - CONT_Y) / CONT.y + 0.5); vec3 t = texture2D(tContador, uv).rgb; col = vec3(0.010) + t * vec3(1.0, 0.84, 0.64) * (2.0 + 3.0 * uActivo); }
  else if (m < 6.5) col = vec3(0.95, 0.98, 1.0) * 3.4;
  else if (m < 7.5) { float g = floor(vDat.y), fase = fract(vDat.y) * 2.0; float on = smoothstep(g / 3.0 + fase * 0.27, g / 3.0 + fase * 0.27 + 0.05, uOnda); col = vec3(0.03) + vec3(1.0, 0.72, 0.40) * 6.0 * on; }
  else { vec2 uv = vec2(P.x / 16.0 + 0.5, (P.y - 15.6) / 1.6 + 0.5); col = mix(hormigon(P.x, P.y, P, 0.2) * 0.9, vec3(0.02), texture2D(tRotulo, uv).r * 0.85) * luz; }
  col = mix(col, vec3(0.045, 0.048, 0.052), 1.0 - exp(-dist * 0.0045));
  gl_FragColor = vec4(col, 1.0);
}`, { side: DoubleSide, ...mas });

export const matHaces = (U, mas) => mat(U, /* glsl */ `
uniform vec3 uOrigen; attribute vec3 aHaz; varying vec3 vHaz, vP;
void main() { vHaz = aHaz; vP = position; gl_Position = projectionMatrix * viewMatrix * vec4(position * vec3(-1.0, 1.0, 1.0) + uOrigen, 1.0); }`, /* glsl */ `
uniform vec3 uOrigen; varying vec3 vHaz, vP;
void main() {
  float polvo = texture2D(tRuido, vP.xy * 0.035 + vec2(uTiempo * 0.004, -uTiempo * 0.006) + vHaz.z * 0.31).r * 0.6 + texture2D(tRuido, vP.xy * 0.11 - uTiempo * 0.008).a * 0.4;
  float a = smoothstep(0.0, 0.14, vHaz.x) * smoothstep(1.0, 0.86, vHaz.x) * mix(1.0, 0.25, vHaz.y) * (0.35 + 0.9 * polvo);
  a *= smoothstep(8.0, 42.0, length((cameraPosition - uOrigen) * vec3(-1.0, 1.0, 1.0) - vP));
  gl_FragColor = vec4(vec3(1.0, 0.985, 0.95) * a * 0.11, 1.0);
}`, { transparent: true, depthWrite: false, blending: CustomBlending, blendSrc: OneFactor, blendDst: OneFactor, side: DoubleSide, ...mas });
