// AUTOMOCIÓN — un coche atraviesa un túnel de arcos de luz; los reflejos son reales (el entorno se recalcula en cada fotograma). Se abre y entramos.
import { lerp, eio, eout, ein, ss, rango, semilla } from '../util.js';
export default async function (ctx) {
  const { THREE, scene, cam, bloom, renderer, pmrem } = ctx;
  scene.background = new THREE.Color(0x020203); scene.fog = new THREE.Fog(0x020203, 30, 95);
  const g = await ctx.gltf('CarConcept.glb'); const coche = g.scene; scene.add(coche); coche.updateMatrixWorld(true);
  (await ctx.variantes(g))('Carmine');
  const N = {}; coche.traverse((o) => { if (o.name) N[o.name] = o; });
  for (const n of ['License_Plate', 'InteriorSteeringEmblem']) if (N[n]) N[n].visible = false;
  const mats = new Set(); coche.traverse((o) => { if (o.isMesh) mats.add(o.material); });
  for (const m of mats) { m.userData.e0 = m.emissiveIntensity;
    if (m.transmission > 0) { m.transmission = 0; m.transparent = true; m.opacity = 0.28; m.depthWrite = false; m.color.set(0x020304); m.roughness = 0; m.metalness = 0; m.envMapIntensity = 2.6; }
    if (m.name === 'Tireside') { m.map = null; m.color.set(0x0c0c0d); } }
  const emis = (re, k) => { for (const m of mats) if (re.test(m.name)) m.emissiveIntensity = m.userData.e0 * k; };
  const body = coche.children[0];
  const puertas = [['BodyDoorLColor1', 1], ['BodyDoorRColor1', -1]].map(([n, lado]) => { const o = N[n]; if (!o) return null; const p = new THREE.Group(); p.position.copy(body.worldToLocal(new THREE.Vector3(1.03 * lado, 0.42, 0.93))); body.add(p); p.attach(o); p.userData = { lado, x0: p.position.x }; return p; }).filter(Boolean);
  const giros = [];
  for (const n of ['WheelFrontL', 'WheelFrontR', 'WheelRearL', 'WheelRearR']) { const w = N[n]; if (!w) continue; const partes = w.children.filter((c) => !/BrakePad/.test(c.name)), neum = w.children.find((c) => !/Rim|Brake/.test(c.name)) || partes[0];
    const b = new THREE.Box3().setFromObject(neum), c = b.getCenter(new THREE.Vector3()), sz = b.getSize(new THREE.Vector3());
    const ejeM = sz.x <= sz.y && sz.x <= sz.z ? new THREE.Vector3(1, 0, 0) : (sz.y <= sz.z ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1));
    const eje = ejeM.applyQuaternion(w.getWorldQuaternion(new THREE.Quaternion()).invert()).normalize(), gr = new THREE.Group(); gr.position.copy(w.worldToLocal(c.clone())); w.add(gr); gr.updateMatrixWorld(true); partes.forEach((p) => gr.attach(p)); giros.push({ g: gr, eje }); }
  // suelo y túnel de arcos de luz
  const SUELO = -0.158;
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(60, 400), new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.22, metalness: 0.0, envMapIntensity: 0.3 })); suelo.rotation.x = -Math.PI / 2; suelo.position.y = SUELO; scene.add(suelo);
  { const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'); x.filter = 'blur(28px)'; x.fillStyle = 'rgba(0,0,0,.95)'; x.beginPath(); x.roundRect(168, 96, 176, 320, 50); x.fill();
    const m = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8 })); m.rotation.x = -Math.PI / 2; m.position.set(0, SUELO + 0.004, 0.24); scene.add(m); }
  const NA = 26, PASO = 7.5, LARGO = NA * PASO, arcos = new THREE.Group(); scene.add(arcos);
  const caja = new THREE.BoxGeometry(1, 1, 1), A = [];
  for (let i = 0; i < NA; i++) { const calido = semilla(i) < 0.3, col = calido ? new THREE.Color(5.0, 2.4, 0.7) : new THREE.Color(3.6, 3.8, 4.2), m = new THREE.MeshBasicMaterial({ color: col }), gr = new THREE.Group();
    const pieza = (sx, sy, sz, x, y) => { const me = new THREE.Mesh(caja, m); me.scale.set(sx, sy, sz); me.position.set(x, y, 0); gr.add(me); };
    pieza(0.09, 4.6, 0.09, -4.4, SUELO + 2.3); pieza(0.09, 4.6, 0.09, 4.4, SUELO + 2.3); pieza(8.9, 0.09, 0.09, 0, SUELO + 4.6); arcos.add(gr); A.push(gr); }
  // entorno dinámico: se captura el túnel desde el coche y se filtra (PMREM) en cada fotograma
  const cubo = new THREE.WebGLCubeRenderTarget(128, { type: THREE.HalfFloatType }), camC = new THREE.CubeCamera(0.5, 200, cubo); camC.position.set(0, 0.9, 0); scene.add(camC);
  const relleno = new THREE.HemisphereLight(0x8fa6c8, 0x08090c, 0.1); scene.add(relleno);
  let envRT = null;
  const v3 = (a) => new THREE.Vector3(...a);
  const cP = new THREE.CatmullRomCurve3([[2.9, 0.42, 6.4], [4.5, 0.9, 2.6], [3.3, 1.25, 0.2], [1.75, 1.08, 0.55], [0.75, 1.0, 0.35], [0.0, 0.95, 0.22]].map(v3), false, 'centripetal');
  const cT = new THREE.CatmullRomCurve3([[0, 0.5, 1.0], [0.2, 0.6, 0.4], [0.3, 0.75, 0.5], [0.0, 0.78, 0.9], [0.0, 0.72, 1.3], [0.0, 0.68, 1.6]].map(v3), false, 'centripetal');
  const CORTE = 1.25;      // plano exterior → corte → plano desde el asiento
  return { dur: 2.7, sub: 2, obturador: 0.6, frame(t) {
    const dist = 16 + t * 30 + 14 * Math.pow(rango(t, CORTE, 2.7), 2);
    A.forEach((gr, i) => { gr.position.z = LARGO / 2 - ((i * PASO + dist) % LARGO); });
    for (const { g: gr, eje } of giros) gr.quaternion.setFromAxisAngle(eje, dist / 0.34);
    if (t < CORTE) { const k = t / CORTE, az = lerp(30, -16, ss(k)) * Math.PI / 180, el = lerp(9, 5, k) * Math.PI / 180, r = lerp(7.6, 6.3, eout(k));
      cam.fov = 36; cam.position.set(r * Math.sin(az) * Math.cos(el), 0.55 + r * Math.sin(el), 0.5 + r * Math.cos(az) * Math.cos(el)); cam.updateProjectionMatrix(); cam.lookAt(0, 0.62, 0.5); renderer.toneMappingExposure = 1.15; scene.environmentIntensity = 2.6; }
    else { const k = rango(t, CORTE, 2.7); cam.fov = lerp(66, 74, ein(k)); cam.position.set(0, 0.97, lerp(0.22, 0.4, eout(k))); cam.updateProjectionMatrix(); cam.lookAt(0, lerp(0.8, 0.9, k), 3); renderer.toneMappingExposure = 1.7; scene.environmentIntensity = 2.0; }
    cam.position.y += Math.sin(t * 37) * 0.004; coche.position.y = Math.sin(t * 31) * 0.002;
    emis(/Headlight/, 2.2); emis(/Brakelight/, 1.2);
    bloom.strength = 0.28; bloom.threshold = 1.0; bloom.radius = 0.6;
  }, render() {
    coche.visible = false; camC.update(renderer, scene); coche.visible = true;
    if (envRT) envRT.dispose(); envRT = pmrem.fromCubemap(cubo.texture); scene.environment = envRT.texture;
    ctx.composer.render();
  } };
}
