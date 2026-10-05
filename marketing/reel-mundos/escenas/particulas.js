// DATOS VIVOS — un cuarto de millón de partículas que fluyen como una bandada y acaban escribiendo la frase.
import { lerp, eio, eout, ss, rango, semilla } from '../util.js';
export default async function (ctx) {
  const { THREE, scene, cam, bloom, renderer } = ctx;
  scene.background = ctx.fondo('#1a1410', '#030203', 0.5, 0.5, 0.8);
  const N = +(ctx.Q.get('n') ?? 260000), frase = ctx.Q.get('txt') || 'ES UNA|WEB.';
  // destino: píxeles del texto
  const cv = document.createElement('canvas'); cv.width = 720; cv.height = 1280; const x = cv.getContext('2d');
  await document.fonts.load('900 200px Archivo').catch(() => {});
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; const lin = frase.split('|');
  lin.forEach((l, i) => { let px = 330; x.font = `900 ${px}px Archivo, Arial Black, sans-serif`; while (x.measureText(l).width > 640) { px -= 6; x.font = `900 ${px}px Archivo, Arial Black, sans-serif`; } x.fillText(l, 360, 640 + (i - (lin.length - 1) / 2) * 270); });
  const data = x.getImageData(0, 0, 720, 1280).data, llenos = []; for (let p = 0; p < 720 * 1280; p++) if (data[p * 4 + 3] > 128) llenos.push(p);
  const semi = new Float32Array(N * 4), dest = new Float32Array(N * 3), pos = new Float32Array(N * 3); let s = 12345; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = 0; i < N; i++) { semi.set([rnd(), rnd(), rnd(), rnd()], i * 4); const p = llenos[Math.floor(rnd() * llenos.length)], px = p % 720 + rnd(), py = Math.floor(p / 720) + rnd();
    dest.set([(px - 360) / 720 * 4.1, -(py - 640) / 720 * 4.1 + 0.5, (rnd() - 0.5) * 0.12], i * 3); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aS', new THREE.BufferAttribute(semi, 4)); geo.setAttribute('aD', new THREE.BufferAttribute(dest, 3));
  const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, uniforms: { uT: { value: 0 }, uP: { value: 0 }, uPx: { value: renderer.getPixelRatio() * ctx.H / 1920 } },
    vertexShader: `attribute vec4 aS; attribute vec3 aD; uniform float uT, uP, uPx; varying float vK; varying float vU;
      vec3 nudo(float a){ return vec3(sin(a) + 2.0 * sin(2.0 * a), (cos(a) - 2.0 * cos(2.0 * a)) * 1.55, -sin(3.0 * a) * 1.3) * 0.95; }
      vec3 flujo(float tt){ float a = aS.x * 6.2832 + tt * (0.16 + 0.1 * aS.y); vec3 c = nudo(a), tg = normalize(nudo(a + 0.02) - c), n1 = normalize(cross(tg, vec3(0.3, 1.0, 0.2))), n2 = cross(tg, n1);
        float r = 0.04 + 0.95 * pow(aS.w, 2.6), f = aS.z * 6.2832 + tt * (1.5 - aS.w) + a * 3.0; return c + (n1 * cos(f) + n2 * sin(f)) * r * (1.0 + 0.3 * sin(tt * 2.0 + a * 5.0)); }
      void main(){ float u = smoothstep(aS.y * 0.55, aS.y * 0.55 + 0.45, uP); u = u * u * (3.0 - 2.0 * u); vec3 a = flujo(uT), p = mix(a, aD, u);
        p += (1.0 - u) * u * 2.4 * vec3(sin(aS.x * 40.0), cos(aS.z * 37.0), sin(aS.w * 29.0)); p += u * 0.012 * vec3(sin(uT * 3.0 + aS.x * 50.0), cos(uT * 2.6 + aS.y * 50.0), 0.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; vU = u; vK = aS.w; gl_PointSize = uPx * mix(46.0, 30.0, u) * (0.45 + aS.z) / max(0.6, -mv.z); }`,
    fragmentShader: `varying float vK; varying float vU; void main(){ vec2 d = gl_PointCoord - 0.5; float r = dot(d, d); if (r > 0.25) discard; float a = exp(-r * 22.0);
      vec3 c = mix(vec3(1.0, 0.62, 0.2), vec3(1.0, 0.93, 0.82), smoothstep(0.35, 0.9, vK)); gl_FragColor = vec4(c * a * mix(0.34, 0.8, vU), 1.0); }` });
  const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; scene.add(pts);
  return { dur: 3.6, sub: 1, frame(t) {
    mat.uniforms.uT.value = t * 1.5 + 4; mat.uniforms.uP.value = rango(t, 1.25, 2.55);
    const k = eio(rango(t, 0.9, 2.7)), az = lerp(1.5, 0, k) + 0.25 * t * (1 - k), el = lerp(0.35, 0, k), d = lerp(8.5, 11.5, eio(rango(t, 0.0, 2.6))) - 0.5 * rango(t, 2.6, 3.6);
    cam.fov = 40; cam.updateProjectionMatrix(); cam.position.set(d * Math.sin(az) * Math.cos(el), d * Math.sin(el), d * Math.cos(az) * Math.cos(el)); cam.lookAt(0, 0, 0);
    renderer.toneMappingExposure = 1.0; bloom.strength = lerp(0.45, 0.28, k); bloom.threshold = 0.5; bloom.radius = 0.8;
  } };
}
