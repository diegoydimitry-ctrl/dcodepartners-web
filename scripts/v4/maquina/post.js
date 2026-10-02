/* ==========================================================================
   LA MÁQUINA · el revelado
   --------------------------------------------------------------------------
   La escena se pinta en alto rango (media precisión) con su profundidad, y de
   ahí sale la imagen final en una sola pasada: desenfoque de lente según la
   distancia, halo de las luces altas, viñeta, grano y curva de tono.
   El halo es una cadena de reducciones y ampliaciones a baja resolución.
   ========================================================================== */
import { WebGLRenderTarget, DepthTexture, LinearMipmapLinearFilter, HalfFloatType, UnsignedByteType, UnsignedIntType, LinearFilter, NearestFilter, RGBAFormat, ShaderMaterial, Mesh, BufferGeometry, Float32BufferAttribute, OrthographicCamera, Scene, Vector2, NoBlending, AdditiveBlending } from "three";

const VERT = /* glsl */ `varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const BRILLO = /* glsl */ `
uniform sampler2D tD; uniform vec2 uPx; uniform float uUmbral; varying vec2 vUv;
void main() {
  vec3 c = (texture2D(tD, vUv + uPx * vec2(-1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(-1., 1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., 1.)).rgb) * 0.25;
  c = min(c, vec3(24.0));
  float l = max(c.r, max(c.g, c.b)), k = max(0.0, l - uUmbral); k = k * k / (k + 0.6);
  gl_FragColor = vec4(c * k / max(l, 1e-4), 1.0);
}`;
const BAJAR = /* glsl */ `
uniform sampler2D tD; uniform vec2 uPx; varying vec2 vUv;
void main() {
  vec3 a = texture2D(tD, vUv).rgb * 4.0;
  a += texture2D(tD, vUv + uPx * vec2(-1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(-1., 1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., 1.)).rgb;
  gl_FragColor = vec4(a / 8.0, 1.0);
}`;
const SUBIR = /* glsl */ `
uniform sampler2D tD; uniform vec2 uPx; uniform float uFuerza; varying vec2 vUv;
void main() {
  vec3 a = texture2D(tD, vUv + uPx * vec2(-1., 0.)).rgb + texture2D(tD, vUv + uPx * vec2(1., 0.)).rgb + texture2D(tD, vUv + uPx * vec2(0., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(0., 1.)).rgb;
  a = a * 2.0 + texture2D(tD, vUv + uPx * vec2(-1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(-1., 1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., 1.)).rgb;
  gl_FragColor = vec4(a / 12.0 * uFuerza, 1.0);
}`;
const FINAL = (tomas) => /* glsl */ `
uniform sampler2D tEscena, tProf, tHalo; uniform vec2 uPx; uniform float uCerca, uLejos, uFoco, uApertura, uMaxDesenfoque, uHalo, uExposicion, uVineta, uGrano, uTiempo, uFundido, uAberracion; uniform vec3 uTinte;
varying vec2 vUv;
float zVista(vec2 uv) { float d = texture2D(tProf, uv).x; return uCerca * uLejos / (uLejos - d * (uLejos - uCerca)); }
float coc(float z) { return clamp(uApertura * abs(z - uFoco) / z, 0.0, 1.0) * uMaxDesenfoque; }
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float ruido(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
void main() {
  float z0 = zVista(vUv), c0 = coc(z0);
  vec3 col = min(texture2D(tEscena, vUv).rgb, vec3(12.0));
  ${tomas > 0 ? `
  float giro = ruido(gl_FragCoord.xy + 17.0) * 6.2831, tot = 1.0;
  // recogida en disco: una muestra cuenta si su propio círculo de confusión llega hasta el centro
  for (int i = 0; i < ${tomas}; i++) {
    float r = sqrt((float(i) + 0.5) / ${tomas}.0) * uMaxDesenfoque, a = float(i) * 2.39996 + giro;
    vec2 uv = vUv + vec2(cos(a), sin(a)) * r * uPx;
    float zi = zVista(uv), ci = coc(zi);
    if (zi > z0) ci = clamp(ci, 0.0, c0 * 2.0);
    float m = smoothstep(r - 0.5, r + 0.5, ci);
    col += mix(col / tot, min(textureLod(tEscena, uv, log2(max(1.0, ci * ${(Math.sqrt(3.1416 / Math.max(1, tomas)) * 0.55).toFixed(3)}))).rgb, vec3(7.0)), m); tot += 1.0;
  }
  col /= tot;` : ""}
  if (uAberracion > 0.0) { vec2 d = (vUv - 0.5) * uAberracion * dot(vUv - 0.5, vUv - 0.5); col.r = mix(col.r, texture2D(tEscena, vUv + d).r, 0.6); col.b = mix(col.b, texture2D(tEscena, vUv - d).b, 0.6); }
  col += texture2D(tHalo, vUv).rgb * uHalo;
  vec2 q = vUv - 0.5; col *= mix(1.0, smoothstep(0.95, 0.25, length(q * vec2(1.0, 1.15))), uVineta);
  col = aces(col * uExposicion) * uTinte;
  col = pow(col, vec3(1.0 / 2.2));
  col += (ruido(gl_FragCoord.xy + fract(uTiempo) * 91.7) - 0.5) * uGrano;
  gl_FragColor = vec4(col * uFundido, 1.0);
}`;

export function crearRevelado(renderer, { muestras = 4, tomas = 40, nivelesHalo = 5 } = {}) {
  const tri = new BufferGeometry(); tri.setAttribute("position", new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1), esc = new Scene(), malla = new Mesh(tri, null); malla.frustumCulled = false; esc.add(malla);
  const mat = (frag, uniforms, blending = NoBlending) => new ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false, blending, transparent: blending !== NoBlending });
  const medio = renderer.extensions.has("EXT_color_buffer_float") || renderer.extensions.has("EXT_color_buffer_half_float");
  const tipo = medio ? HalfFloatType : UnsignedByteType;
  let escena = null, halo = [], W = 0, H = 0;
  const mBrillo = mat(BRILLO, { tD: { value: null }, uPx: { value: new Vector2() }, uUmbral: { value: 1.5 } });
  const mBajar = mat(BAJAR, { tD: { value: null }, uPx: { value: new Vector2() } });
  const mSubir = mat(SUBIR, { tD: { value: null }, uPx: { value: new Vector2() }, uFuerza: { value: 1 } }, AdditiveBlending);
  const U = { tEscena: { value: null }, tProf: { value: null }, tHalo: { value: null }, uPx: { value: new Vector2() }, uCerca: { value: 0.1 }, uLejos: { value: 100 }, uFoco: { value: 10 }, uApertura: { value: 0 }, uMaxDesenfoque: { value: 18 }, uHalo: { value: 0.5 }, uExposicion: { value: 1 }, uVineta: { value: 0.5 }, uGrano: { value: 0.035 }, uTiempo: { value: 0 }, uFundido: { value: 1 }, uAberracion: { value: 0 }, uTinte: { value: [1, 1, 1] } };
  let mFinal = mat(FINAL(tomas), U), tomasAhora = tomas;

  function medir(w, h) {
    if (w === W && h === H) return; W = w; H = h;
    if (escena) { escena.dispose(); halo.forEach((t) => t.dispose()); }
    const prof = new DepthTexture(w, h); prof.type = UnsignedIntType; prof.minFilter = prof.magFilter = NearestFilter;
    escena = new WebGLRenderTarget(w, h, { type: tipo, format: RGBAFormat, minFilter: LinearMipmapLinearFilter, magFilter: LinearFilter, generateMipmaps: true, samples: muestras, depthBuffer: true, depthTexture: prof, stencilBuffer: false });
    halo = [];
    let a = Math.max(2, w >> 1), b = Math.max(2, h >> 1);
    for (let i = 0; i < nivelesHalo && a > 8 && b > 8; i++) { halo.push(new WebGLRenderTarget(a, b, { type: tipo, format: RGBAFormat, minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false })); a = Math.max(2, a >> 1); b = Math.max(2, b >> 1); }
  }
  const pasar = (m, destino) => { malla.material = m; renderer.setRenderTarget(destino); renderer.render(esc, cam); };

  return {
    U, medir, get destino() { return escena; },
    tomas(n) { if (n !== tomasAhora) { tomasAhora = n; mFinal.dispose(); mFinal = mat(FINAL(n), U); } },
    revelar(camara, tiempo) {
      const auto = renderer.autoClear; renderer.autoClear = true;
      // halo
      mBrillo.uniforms.tD.value = escena.texture; mBrillo.uniforms.uPx.value.set(0.5 / W, 0.5 / H); pasar(mBrillo, halo[0]);
      for (let i = 1; i < halo.length; i++) { mBajar.uniforms.tD.value = halo[i - 1].texture; mBajar.uniforms.uPx.value.set(1 / halo[i - 1].width, 1 / halo[i - 1].height); pasar(mBajar, halo[i]); }
      renderer.autoClear = false;
      for (let i = halo.length - 1; i > 0; i--) { mSubir.uniforms.tD.value = halo[i].texture; mSubir.uniforms.uPx.value.set(1 / halo[i].width, 1 / halo[i].height); pasar(mSubir, halo[i - 1]); }
      renderer.autoClear = true;
      // imagen final
      U.tEscena.value = escena.texture; U.tProf.value = escena.depthTexture; U.tHalo.value = halo[0].texture; U.uPx.value.set(1 / W, 1 / H);
      U.uCerca.value = camara.near; U.uLejos.value = camara.far; U.uTiempo.value = tiempo;
      pasar(mFinal, null); renderer.autoClear = auto;
    },
    liberar() { if (escena) escena.dispose(); halo.forEach((t) => t.dispose()); [mBrillo, mBajar, mSubir, mFinal].forEach((m) => m.dispose()); tri.dispose(); },
  };
}
