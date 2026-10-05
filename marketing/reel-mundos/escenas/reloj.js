// GANCHO — un reloj desmontado en el aire que se ensambla solo delante de la cámara.
import { lerp, eio, eout, ss, rango, clamp } from '../util.js';
export default async function (ctx) {
  const { THREE, scene, cam, bloom, renderer } = ctx;
  scene.background = ctx.fondo('#3a2f1c', '#050403', 0.5, 0.42, 0.8);
  scene.environment = await ctx.hdr('estudio.hdr'); scene.environmentIntensity = 1.1;
  const luz = new THREE.DirectionalLight(0xfff0dc, 2.2); luz.position.set(-4, 6, 8); scene.add(luz);
  const g = await ctx.gltf('reloj.glb'); (await ctx.variantes(g))('Midnight Gold');
  const img = await new THREE.ImageLoader().loadAsync('assets/esfera.png'), orm = await new THREE.ImageLoader().loadAsync('assets/esfera-orm.png');
  g.scene.traverse((o) => { if (!o.isMesh) return; const m = o.material;
    if (m.name === 'Watch Face' && m.map && !m.userData.ok) { const t = m.map.clone(); t.image = img; t.needsUpdate = true; m.map = t; const t2 = m.roughnessMap.clone(); t2.image = orm; t2.needsUpdate = true; m.roughnessMap = m.metalnessMap = t2; if (m.aoMap) m.aoMap = t2; m.userData.ok = 1; }
    if (/Backplate|Clasp/.test(m.name)) { m.map = null; m.color.set(0x1a1b1d); m.metalness = 1; m.roughness = 0.35; }
    if (m.transmission > 0) { m.transmission = 0; m.transparent = true; m.opacity = 0.07; m.depthWrite = false; m.color.set(0x000000); m.roughness = 0.02; m.metalness = 0; m.envMapIntensity = 1.2; } });
  const raiz = new THREE.Group(); raiz.add(g.scene); scene.add(raiz);
  const N = {}; g.scene.traverse((o) => { if (o.name) N[o.name] = o; });
  // pieza → [desplazamiento en z, giro en z (vueltas), orden de llegada]
  const DESP = { Glass_Face: [7.2, 0.5, 6], Hands: [5.0, -1.25, 5], Watch_Face: [3.1, 0.25, 4], Bezel_Frame: [1.5, -0.25, 3], Button_Metal: [0.7, 0.125, 2], Button_Plastic: [0.35, -0.125, 2],
    Band_Plastic: [-2.2, 0, 1], Band_Carbon_Fiber: [-3.6, 0, 1], Backplate_Khronos: [-5.4, 0.5, 0], Clasp_DGG: [-7.0, 0, 0] };
  const P = Object.entries(DESP).map(([n, d]) => N[n] && { o: N[n], z0: N[n].position.z, p0: N[n].position.clone(), q0: N[n].quaternion.clone(), d }).filter(Boolean);
  const seg = N.Hand_Seconds, qs0 = seg && seg.quaternion.clone(), qA = new THREE.Quaternion(), Z = new THREE.Vector3(0, 0, 1), C = new THREE.Vector3(0, 0, 0.6);
  // el eje de la esfera es z del modelo; cada pieza se desplaza por ese eje en el espacio de su padre
  const ejeP = (o) => Z.clone().transformDirection(new THREE.Matrix4().copy(o.parent.matrixWorld).invert()).normalize();
  g.scene.updateMatrixWorld(true); for (const p of P) p.eje = ejeP(p.o);
  const atras = (u) => { const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };      // llegada con rebote
  return { dur: 2.6, sub: 4, obturador: 0.6, frame(t) {
    for (const p of P) { const fin = 1.28 + p.d[2] * 0.085, u = rango(t, 0.55, fin), e = (1 - atras(u)) * (1 - 0.06 * ss(rango(t, 0, 0.55)));
      p.o.position.copy(p.p0).addScaledVector(p.eje, p.d[0] * e); p.o.quaternion.copy(qA.setFromAxisAngle(p.eje, p.d[1] * Math.PI * 2 * e)).multiply(p.q0); }
    if (seg) seg.quaternion.copy(qA.setFromAxisAngle(Z, -(Math.floor(t * 2) / 2 + eout(((t * 2) % 1) * 3) / 2) * 6 * Math.PI / 180)).multiply(qs0);
    const k = eio(rango(t, 0.0, 1.85)), az = lerp(28, -14, k) * Math.PI / 180, el = lerp(4, 5, k) * Math.PI / 180, golpe = rango(t, 1.86, 2.0) * (1 - rango(t, 2.0, 2.5));
    const d = lerp(27, 19.5, eio(rango(t, 0.3, 1.7))) - 3.2 * eout(rango(t, 1.86, 2.6)) + 0.25 * Math.sin(t * 90) * golpe * (1 - rango(t, 1.86, 2.3));
    cam.fov = 30; cam.updateProjectionMatrix(); C.z = 0.6;
    cam.position.set(C.x + d * Math.sin(az) * Math.cos(el), C.y + d * Math.sin(el), C.z + d * Math.cos(az) * Math.cos(el)); cam.lookAt(C);
    raiz.rotation.y = 0.18 * Math.sin(t * 1.3); raiz.rotation.x = lerp(-1.12, 0, eio(rango(t, 0.35, 1.75))); raiz.rotation.z = lerp(0.35, 0, k);
    scene.environmentRotation.y = 0.6 + t * 1.5; renderer.toneMappingExposure = 1.05 + 0.5 * golpe; bloom.strength = 0.1 + 0.35 * golpe; bloom.threshold = 1.0;
  } };
}
