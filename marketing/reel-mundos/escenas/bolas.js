// FÍSICA — cientos de esferas que se apartan y vuelven al paso del cursor. La simulación se calcula entera al cargar (determinista).
import { lerp, eio, ss, rango, semilla, clamp } from '../util.js';
export default async function (ctx) {
  const { THREE, scene, cam, bloom, renderer } = ctx;
  scene.background = ctx.fondo('#f6f1ea', '#e2d9cd', 0.5, 0.45, 0.9);
  scene.environment = await ctx.hdr('estudio.hdr'); scene.environmentIntensity = 0.95; scene.environmentRotation.y = 1.2;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const sol = new THREE.DirectionalLight(0xfff3e4, 2.4); sol.position.set(-5, 7, 9); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
  Object.assign(sol.shadow.camera, { left: -6, right: 6, top: 8, bottom: -8, near: 1, far: 30 }); sol.shadow.bias = -0.0004; sol.shadow.normalBias = 0.03; sol.shadow.radius = 6; scene.add(sol);
  const N = 300, DUR = 2.8, PRE = 2.5, DT = 1 / 120, PASOS = Math.round((DUR + PRE + 0.1) / DT);
  const R = new Float32Array(N), P = new Float32Array(N * 3), V = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { R[i] = 0.2 + 0.36 * semilla(i) ** 2.2 + (i < 5 ? 0.28 : 0); const a = semilla(i + 50) * 6.283, r = 1 + 5 * semilla(i + 90); P[i * 3] = Math.cos(a) * r * 0.6; P[i * 3 + 1] = Math.sin(a) * r; P[i * 3 + 2] = (semilla(i + 7) - 0.5) * 1.5; }
  // el cursor recorre una curva cerrada sobre el montón
  const cur = (t) => { const u = t * 1.9 + 0.6; return [1.55 * Math.sin(u), 2.7 * Math.sin(u * 0.5 + 0.9) * Math.cos(u * 0.37), 0.15]; }, RC = 1.4;
  const HIST = new Float32Array(PASOS * N * 3);
  for (let s = 0; s < PASOS; s++) { const t = s * DT - PRE, c = cur(t), act = t > -0.2 ? 1 : 0;
    for (let i = 0; i < N; i++) { const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
      V[i * 3] += (-x * 7.0) * DT; V[i * 3 + 1] += (-y * 2.6) * DT; V[i * 3 + 2] += (-z * 26) * DT;                // atracción al centro (montón alargado y plano)
      if (act) { const dx = x - c[0], dy = y - c[1], dz = z - c[2], d = Math.hypot(dx, dy, dz), m = RC + R[i]; if (d < m) { const f = (m - d) / d * 110 * DT; V[i * 3] += dx * f; V[i * 3 + 1] += dy * f; V[i * 3 + 2] += dz * f * 0.4; } }
      V[i * 3] *= 0.965; V[i * 3 + 1] *= 0.965; V[i * 3 + 2] *= 0.94; P[i * 3] += V[i * 3] * DT; P[i * 3 + 1] += V[i * 3 + 1] * DT; P[i * 3 + 2] += V[i * 3 + 2] * DT; }
    for (let it = 0; it < 3; it++) for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const dx = P[j * 3] - P[i * 3], dy = P[j * 3 + 1] - P[i * 3 + 1], dz = P[j * 3 + 2] - P[i * 3 + 2], m = R[i] + R[j], d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < m * m && d2 > 1e-9) { const d = Math.sqrt(d2), k = (m - d) / d * 0.5, wi = R[j] / m, wj = R[i] / m; P[i * 3] -= dx * k * wi * 2; P[i * 3 + 1] -= dy * k * wi * 2; P[i * 3 + 2] -= dz * k * wi * 2; P[j * 3] += dx * k * wj * 2; P[j * 3 + 1] += dy * k * wj * 2; P[j * 3 + 2] += dz * k * wj * 2;
        const vx = (V[j * 3] - V[i * 3]) * 0.12, vy = (V[j * 3 + 1] - V[i * 3 + 1]) * 0.12; V[i * 3] += vx; V[i * 3 + 1] += vy; V[j * 3] -= vx; V[j * 3 + 1] -= vy; } }
    HIST.set(P, s * N * 3); }
  // tres familias de material; el color va por instancia
  const geo = new THREE.SphereGeometry(1, 32, 20), PAL = ['#F5B841', '#f3ede4', '#15171c', '#e4572e', '#2b4a8c', '#f3ede4', '#F5B841', '#cfd6dd'];
  const fam = [new THREE.MeshPhysicalMaterial({ roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 }), new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.06, color: 0xffffff }), new THREE.MeshPhysicalMaterial({ roughness: 0.75 })];
  const de = (i) => (semilla(i + 300) < 0.16 ? 1 : semilla(i + 300) < 0.42 ? 2 : 0), idx = [[], [], []]; for (let i = 0; i < N; i++) idx[de(i)].push(i);
  const mallas = fam.map((m, f) => { const im = new THREE.InstancedMesh(geo, m, idx[f].length); im.castShadow = im.receiveShadow = true; const c = new THREE.Color();
    idx[f].forEach((i, k) => { c.set(f === 1 ? (semilla(i + 9) < 0.4 ? '#ffcf7a' : '#ffffff') : PAL[Math.floor(semilla(i + 500) * PAL.length)]); im.setColorAt(k, c); }); scene.add(im); return im; });
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3();
  // puntero de ratón (DOM) sobre el lienzo
  const pt = document.createElement('div'); pt.innerHTML = '<svg viewBox="0 0 24 24" width="92" height="92"><path d="M5 2l14 11-6.500.9 3.800 7.300-2.700 1.400-3.800-7.400L5 20z" fill="#fff" stroke="#111" stroke-width="1.300" stroke-linejoin="round"/></svg>';
  pt.style.cssText = 'position:fixed;left:0;top:0;z-index:5;filter:drop-shadow(0 8px 12px rgba(0,0,0,.35));pointer-events:none'; if (!ctx.Q.has('sinpuntero')) document.body.appendChild(pt);
  return { dur: DUR, sub: 1, frame(t) {
    const fs = clamp((t + PRE) / DT, 0, PASOS - 1.001), s0 = Math.floor(fs), u = fs - s0, a = s0 * N * 3, b = a + N * 3;
    mallas.forEach((im, f) => { idx[f].forEach((i, k) => { v.set(lerp(HIST[a + i * 3], HIST[b + i * 3], u), lerp(HIST[a + i * 3 + 1], HIST[b + i * 3 + 1], u), lerp(HIST[a + i * 3 + 2], HIST[b + i * 3 + 2], u)); im.setMatrixAt(k, M.compose(v, q, sc.setScalar(R[i]))); }); im.instanceMatrix.needsUpdate = true; });
    const k = t / DUR; cam.fov = 30; cam.updateProjectionMatrix(); cam.position.set(0.5 * Math.sin(t * 0.7), -0.8 + 0.5 * k, lerp(15.5, 13.2, eio(k))); cam.lookAt(0, 0, 0); cam.updateMatrixWorld();
    const c = cur(t); v.set(c[0], c[1], c[2] + 0.4).project(cam); pt.style.transform = `translate(${((v.x * 0.5 + 0.5) * innerWidth - 10).toFixed(1)}px,${((-v.y * 0.5 + 0.5) * innerHeight - 6).toFixed(1)}px)`;
    renderer.toneMappingExposure = 1.0; bloom.strength = 0.06; bloom.threshold = 1.0;
  } };
}
