/* ESCENA · AUTOMATIZACIÓN (Automatizaciones)
   «Lo que termina un área dispara la siguiente»: una línea de producción
   de datos. Evento (un arco que detecta), proceso (un tambor que trabaja),
   decisión (un desvío que elige camino) y acción (dos muelles que
   reciben). Las cápsulas recorren la línea solas; cada estación se
   enciende al pasar una. Nadie empuja nada. */
export default function (K, o) {
  const { THREE, M, G } = K;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  camera.userData.ref = 1.9; // la línea es muy apaisada: en huecos verticales cabe entera
  const luces = K.luces(scene, { key: [-3, 10, 8], sombra: 8 });
  const raiz = new THREE.Group(); scene.add(raiz);
  const tronco = [new THREE.Vector3(-7, 0.5, 0), new THREE.Vector3(-3.5, 0.5, 0), new THREE.Vector3(0.6, 0.5, 0), new THREE.Vector3(1.8, 0.5, 0)];
  const rama = (s) => new THREE.CatmullRomCurve3([...tronco, new THREE.Vector3(3.4, 0.5, s * 0.9), new THREE.Vector3(5.2, 0.5, s * 1.6), new THREE.Vector3(6.6, 0.5, s * 1.6)], false, "centripetal", 0.3);
  const rutas = [rama(1), rama(-1)];
  rutas.forEach((c) => { const t = new THREE.Mesh(new THREE.TubeGeometry(c, 200, 0.05, 10), M.acero); t.castShadow = true; raiz.add(t); const sp = new THREE.Mesh(new THREE.TubeGeometry(c, 200, 0.12, 8), M.grafito); sp.position.y = -0.42; sp.scale.set(1, 0.3, 1); raiz.add(sp); });
  const losa = new THREE.Mesh(G.redondo(15, 0.18, 5.2, 0.06), M.grafito); losa.position.set(0, -0.1, 0); losa.receiveShadow = true; raiz.add(losa);
  const est = [];
  const estacion = (x, obj, etiqueta) => { obj.position.x = x; raiz.add(obj); const led = new THREE.Mesh(G.esfera, new THREE.MeshBasicMaterial({ color: 0x3a4a70, toneMapped: false })); led.scale.setScalar(0.07); led.position.set(x, 1.55, 0.6); raiz.add(led);
    const r = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.32), new THREE.MeshBasicMaterial({ map: K.rotulo(etiqueta), transparent: true, depthWrite: false, opacity: 0.85 })); r.position.set(x, 0.02, 1.35); r.rotation.x = -Math.PI / 2; raiz.add(r);
    est.push({ x, led, act: 0, obj }); };
  const arco = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 20, 96), M.aluminio); arco.position.y = 0.5; arco.rotation.y = Math.PI / 2; arco.castShadow = true;
  const g1 = new THREE.Group(); g1.add(arco); estacion(-5, g1, "Evento");
  const tambor = new THREE.Mesh(G.cilindro(0.55, 0.55, 1.1, 64), M.moleteado); tambor.rotation.z = Math.PI / 2; tambor.position.y = 0.5; tambor.castShadow = true;
  const g2 = new THREE.Group(); g2.add(tambor); estacion(-1.6, g2, "Proceso");
  const cuna = new THREE.Mesh(G.redondo(0.9, 0.5, 0.9, 0.08), M.silicio); cuna.position.y = 0.95; cuna.rotation.y = Math.PI / 4; cuna.castShadow = true;
  const g3 = new THREE.Group(); g3.add(cuna); estacion(1.9, g3, "Decisión");
  const muelles = [1, -1].map((s) => { const m = new THREE.Mesh(G.redondo(1.1, 0.5, 0.9, 0.06), M.ceramica); m.position.set(6.9, 0.35, s * 1.6); m.castShadow = true; raiz.add(m); return m; });
  estacion(6.9, new THREE.Group(), "Acción");
  const N = 7, capsulas = Array.from({ length: N }, (_, i) => { const c = new THREE.Mesh(G.redondo(0.46, 0.26, 0.26, 0.12), M.vidrioAzul); c.castShadow = true; const l = new THREE.Mesh(G.esfera, M.luz(0x6f95ff, 2)); l.scale.setScalar(0.06); c.add(l); raiz.add(c); return { c, ruta: i % 2 }; });
  camera.position.set(-1, 7.5, 17); camera.lookAt(0.2, 0.3, 0);
  const v = new THREE.Vector3(), tg = new THREE.Vector3(), fr = new THREE.Color(0x3a4a70), vi = new THREE.Color(0x8fb0ff);
  function update(t, dt, p, ptr) {
    const vel = 0.07;
    capsulas.forEach((k, i) => { const u = ((((i / N) + t * vel) % 1) + 1) % 1, r = rutas[k.ruta]; r.getPointAt(u, v); r.getTangentAt(u, tg); k.c.position.copy(v); k.c.lookAt(v.clone().add(tg)); k.c.rotateY(Math.PI / 2);
      est.forEach((e) => { if (Math.abs(v.x - e.x) < 0.35) e.act = 1; }); });
    est.forEach((e) => { e.act *= Math.exp(-2.5 * dt); e.led.material.color.copy(fr).lerp(vi, e.act).multiplyScalar(1 + e.act * 1.5); });
    tambor.rotation.x = t * 1.6; cuna.rotation.y = Math.PI / 4 + Math.sin(t * 0.8) * 0.15;
    const q = Math.max(0, Math.min(1, p));
    camera.position.x = -1.6 + q * 2.4 + (ptr.sx || 0) * 0.4; camera.lookAt(-0.3 + q * 1.2, 0.3, 0);
    return !o.quieto;
  }
  return { scene, camera, update, luces };
}
