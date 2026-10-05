// MUNDO — un tablero donde la gravedad se apaga: las piezas despegan en onda y la cámara vuela entre ellas.
import { lerp, eio, eout, ss, rango, semilla } from '../util.js';
export default async function (ctx) {
  const { THREE, scene, cam, bloom, renderer } = ctx;
  scene.background = ctx.fondo('#2a211a', '#040303', 0.5, 0.3, 0.9);
  scene.environment = await ctx.hdr('royal_esplanade_1k.hdr'); scene.environmentIntensity = 0.55; scene.environmentRotation.y = 2.2;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const sol = new THREE.DirectionalLight(0xffe2bd, 3.4); sol.position.set(-0.5, 0.75, -0.35); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048);
  Object.assign(sol.shadow.camera, { left: -0.5, right: 0.5, top: 0.5, bottom: -0.5, near: 0.1, far: 2.5 }); sol.shadow.bias = -0.0003; sol.shadow.normalBias = 0.002; sol.shadow.radius = 5; scene.add(sol);
  const g = await ctx.gltf('ABeautifulGame.glb'); scene.add(g.scene);
  const piezas = [];
  g.scene.traverse((o) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; const m = o.material;
      if (m.transmission > 0) { m.transmission = 0; m.transparent = true; m.opacity = 0.42; m.roughness = 0.02; m.envMapIntensity = 3; m.depthWrite = false; o.castShadow = false; } } });
  for (const o of g.scene.children[0]?.children?.length > 10 ? g.scene.children[0].children : g.scene.children) if (o.name && o.name !== 'Chessboard') piezas.push(o);
  const P = piezas.map((o, i) => ({ o, p0: o.position.clone(), q0: o.quaternion.clone(), r: Math.hypot(o.position.x, o.position.z + 0.16), h: 0.02 + 0.06 * semilla(i * 3 + 1), eje: new THREE.Vector3(semilla(i + 11) - 0.5, 0.25, semilla(i + 23) - 0.5).normalize(), giro: (semilla(i + 5) - 0.5) * 1.0,
    tapa: o.children.find((c) => /Top/.test(c.name)) }));
  for (const p of P) if (p.tapa) p.tapa.userData.p0 = p.tapa.position.clone();
  const q = new THREE.Quaternion();
  return { dur: 2.8, sub: 1, frame(t) {
    for (const p of P) { const u = eout(rango(t, 0.25 + p.r * 1.7, 0.25 + p.r * 1.7 + 1.5)), fl = Math.sin(t * 2.2 + p.r * 9) * 0.004 * u;
      p.o.position.copy(p.p0); p.o.position.y += p.h * u + fl; p.o.quaternion.copy(p.q0).multiply(q.setFromAxisAngle(p.eje, p.giro * u + 0.25 * u * t));
      if (p.tapa) { p.tapa.position.copy(p.tapa.userData.p0); p.tapa.position.y += 0.03 * eout(rango(t, 0.6 + p.r * 1.7, 2.2 + p.r * 1.7)); } }
    const k = eio(rango(t, 0.15, 2.8));
    cam.fov = 30; cam.updateProjectionMatrix(); cam.position.set(lerp(0.14, 0.36, k), lerp(0.07, 0.25, k), lerp(-0.6, -0.72, k)); cam.lookAt(lerp(-0.02, 0.0, k), lerp(0.045, 0.06, k), lerp(-0.05, 0.0, k));
    cam.near = 0.005; renderer.toneMappingExposure = 1.15; bloom.strength = 0.16; bloom.threshold = 0.95;
  } };
}
