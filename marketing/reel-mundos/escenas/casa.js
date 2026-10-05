// ARQUITECTURA — una villa sobre el mar al anochecer: la cámara llega rozando el agua, la casa se enciende y atravesamos la fachada de cristal.
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { lerp, eio, eout, ein, ss, rango, semilla } from '../util.js';
export default async function (ctx) {
  const { THREE, scene, cam, bloom, renderer, pmrem } = ctx;
  // cielo y sol bajo
  const sky = new Sky(); sky.scale.setScalar(4000); scene.add(sky); const U = sky.material.uniforms;
  U.turbidity.value = 9; U.rayleigh.value = 3.0; U.mieCoefficient.value = 0.006; U.mieDirectionalG.value = 0.86;
  const dirSol = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - 3.2), THREE.MathUtils.degToRad(205)); U.sunPosition.value.copy(dirSol);
  { const s2 = new THREE.Scene(), k2 = new Sky(); k2.scale.setScalar(4000); Object.keys(U).forEach((k) => { k2.material.uniforms[k].value = U[k].value; }); s2.add(k2); scene.environment = pmrem.fromScene(s2).texture; }
  scene.environmentIntensity = 0.55;
  const agua = new Water(new THREE.PlaneGeometry(4000, 4000), { textureWidth: 1024, textureHeight: 1024, waterNormals: new THREE.TextureLoader().load('assets/waternormals.jpg', (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; }),
    sunDirection: dirSol.clone(), sunColor: 0xffb070, waterColor: 0x0a1f26, distortionScale: 2.4, fog: false });
  agua.rotation.x = -Math.PI / 2; scene.add(agua);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const sol = new THREE.DirectionalLight(0xffa25c, 2.6); sol.position.copy(dirSol).multiplyScalar(40); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048);
  Object.assign(sol.shadow.camera, { left: -14, right: 14, top: 12, bottom: -6, near: 5, far: 90 }); sol.shadow.bias = -0.0005; sol.shadow.normalBias = 0.04; scene.add(sol);
  scene.add(new THREE.HemisphereLight(0x8fa3c9, 0x2a2420, 0.55));
  // materiales
  const blanco = new THREE.MeshStandardMaterial({ color: 0xe9e6df, roughness: 0.85 }), oscuro = new THREE.MeshStandardMaterial({ color: 0x1b1c1e, roughness: 0.5, metalness: 0.6 });
  const madera = new THREE.MeshStandardMaterial({ color: 0x8a5a36, roughness: 0.6 }), suelo = new THREE.MeshStandardMaterial({ color: 0x55504a, roughness: 0.35 });
  const cristal = new THREE.MeshPhysicalMaterial({ color: 0x9fb4bd, transparent: true, opacity: 0.16, roughness: 0.0, metalness: 0, envMapIntensity: 2.2, depthWrite: false, side: THREE.DoubleSide });
  const casa = new THREE.Group(); scene.add(casa);
  const caja = (m, sx, sy, sz, x, y, z, sombra = true) => { const me = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m); me.position.set(x, y, z); me.castShadow = sombra && m !== cristal; me.receiveShadow = true; casa.add(me); return me; };
  caja(blanco, 19, 0.7, 12, 0, 0.2, -1);                 // plataforma sobre el agua
  caja(suelo, 15.6, 0.06, 8.6, 0, 0.58, -1.2);           // suelo interior
  caja(blanco, 16.6, 0.4, 10.4, 0, 3.9, -1.0);           // cubierta en voladizo
  caja(blanco, 16, 3.2, 0.3, 0, 2.15, -5.4);             // muro trasero
  caja(blanco, 0.3, 3.2, 4.2, -7.85, 2.15, -3.4); caja(blanco, 0.3, 3.2, 2.2, 7.85, 2.15, -4.4);
  for (let i = 0; i < 46; i++) caja(madera, 0.07, 3.1, 0.12, -7.6 + i * 0.165, 2.15, -5.15, false);      // panel de lamas de madera
  for (const x of [-7.7, -3.85, 0, 3.85, 7.7]) caja(oscuro, 0.07, 3.15, 0.07, x, 2.15, 3.0, false);       // montantes
  caja(cristal, 15.4, 3.1, 0.03, 0, 2.15, 3.0); caja(cristal, 0.03, 3.1, 6.2, 7.85, 2.15, -0.2); caja(cristal, 0.03, 3.1, 4.3, -7.85, 2.15, 0.85);
  caja(blanco, 9, 3.0, 7, 4.4, 5.6, -2.2); caja(cristal, 8.4, 2.4, 0.03, 4.4, 5.6, 1.31); for (let i = 0; i < 22; i++) caja(madera, 0.08, 2.9, 0.16, 0.2 + i * 0.4, 5.6, 1.5, false);       // volumen superior con celosía
  caja(blanco, 3.2, 0.12, 1.4, -4.6, 0.62, 5.4); caja(blanco, 3.2, 0.12, 1.4, -4.6, 0.3, 6.6);                                                                                              // escalones al agua
  // interior: sofá, alfombra y luces que se encienden una a una
  const g = await ctx.gltf('sofa.glb'); (await ctx.variantes(g))('Champagne'); g.scene.position.set(-0.6, 0.61, -2.6); g.scene.rotation.y = 0.12; g.scene.traverse((o) => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); casa.add(g.scene);
  caja(new THREE.MeshStandardMaterial({ color: 0xcfc5b4, roughness: 1 }), 5.2, 0.02, 3.4, -0.5, 0.62, -2.2, false);
  caja(oscuro, 1.5, 0.34, 0.9, -0.4, 0.8, -0.9);
  const LUCES = [-5.6, -2.8, 0, 2.8, 5.6].map((x, i) => { const m = new THREE.MeshBasicMaterial({ color: 0x000000 }), tira = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 0.14), m); tira.position.set(x, 3.68, -1.6); casa.add(tira);
    const p = new THREE.PointLight(0xffb774, 0, 14, 1.6); p.position.set(x, 3.2, -1.6); casa.add(p); return { m, p, t0: 0.7 + i * 0.16 }; });
  const pared = new THREE.PointLight(0xff9a50, 0, 9, 1.4); pared.position.set(0, 1.4, -4.6); casa.add(pared);
  const cal = new THREE.Color(1, 0.72, 0.42);
  return { dur: 3.2, sub: 1, frame(t) {
    agua.material.uniforms.time.value = 3 + t * 0.9;
    for (const L of LUCES) { const k = ss(rango(t, L.t0, L.t0 + 0.25)); L.m.color.copy(cal).multiplyScalar(3.5 * k); L.p.intensity = 4.5 * k; } pared.intensity = 7 * ss(rango(t, 1.3, 1.9));
    const k = t / 3.2, z = lerp(74, 1.3, 1 - Math.pow(1 - k, 2.4)), y = lerp(0.75, 1.75, ss(rango(k, 0.25, 0.95))), x = lerp(-9, -0.4, eout(k));
    cam.fov = 44; cam.near = 0.1; cam.updateProjectionMatrix(); cam.position.set(x, y, z); cam.lookAt(lerp(1.5, -0.5, k), lerp(2.6, 1.25, ss(k)), -3.2);
    renderer.toneMappingExposure = lerp(0.56, 0.72, k); bloom.strength = 0.3; bloom.threshold = 1.0; bloom.radius = 0.7;
  } };
}
