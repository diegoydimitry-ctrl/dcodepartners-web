/* ESCENA · PRECIOS
   Modularidad: un bastidor y tres módulos que encajan en él —D-Code
   Finance, un sistema a medida, agentes e integraciones—, las tres formas
   de empezar que publica la web. Se montan uno a uno al bajar: se empieza
   por uno y se añade lo que haga falta, sobre la misma base. */
export default function (K, o) {
  const { THREE, M, G } = K;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  const luces = K.luces(scene, { key: [-4, 9, 8], sombra: 6 });
  const raiz = new THREE.Group(); scene.add(raiz);
  const bastidor = new THREE.Mesh(G.redondo(7.2, 0.34, 2, 0.08), M.grafito); bastidor.position.y = -0.17; bastidor.castShadow = true; raiz.add(bastidor);
  for (const z of [-0.7, 0.7]) { const r = new THREE.Mesh(G.redondo(7, 0.06, 0.12, 0.02), M.acero); r.position.set(0, 0.03, z); raiz.add(r); }
  const sh = K.sombra(10, 3.4, 0.8); sh.position.y = -0.34; raiz.add(sh);
  const anodBlue = M.aluminio.clone(); anodBlue.color.set(0x5577c8);
  const MOD = [["Finance", 1.7, 1.3, anodBlue, 0x5b8cff], ["A medida", 2.2, 1.9, M.ceramica, 0x35e0a1], ["Agentes", 1.7, 1.1, M.silicio, 0xa78bfa]];
  let x = -2.4;
  const mods = MOD.map(([n, w, h, mat, col], i) => {
    const g = new THREE.Group(), cx = x + w / 2; x += w + 0.25;
    const cuerpo = new THREE.Mesh(G.redondo(w, h, 1.5, 0.08), mat); cuerpo.position.y = h / 2; cuerpo.castShadow = true;
    const placa = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.8, 0.26), new THREE.MeshBasicMaterial({ map: K.rotulo(n, mat === M.ceramica ? "#2a2d33" : "#e9ecf2"), transparent: true, depthWrite: false })); placa.position.set(0, h * 0.28, 0.76);
    const led = new THREE.Mesh(G.esfera, new THREE.MeshBasicMaterial({ color: 0x3a4a70, toneMapped: false })); led.scale.setScalar(0.05); led.position.set(w / 2 - 0.2, h - 0.2, 0.76);
    g.add(cuerpo, placa, led); g.position.set(cx, 0, 0); raiz.add(g);
    return { g, led, col: new THREE.Color(col), vy: 0, y: 4 + i };
  });
  camera.position.set(1.2, 3.6, 13); camera.lookAt(0.3, 0.9, 0);
  const apagado = new THREE.Color(0x3a4a70);
  function update(t, dt, p, ptr) {
    // En una banda apaisada el bastidor se ve pequeño: la cámara se acerca.
    const d = camera.aspect > 2.5 ? 7 : 13;
    if (camera.position.z !== d) { camera.position.set(1.2 * d / 13, 3.6 * d / 13, d); camera.lookAt(0.3, 0.9, 0); }
    const c = o.quieto ? 1 : Math.max(0, Math.min(1, (p - 0.2) / 0.45));
    mods.forEach((m, i) => {
      const dentro = c * 3.2 > i + 0.3, obj = dentro ? 0 : 3.5 + i * 0.4;
      if (o.quieto) m.y = obj; else { m.vy += ((obj - m.y) * 70 - m.vy * 11) * dt; m.y += m.vy * dt; }
      m.g.position.y = m.y;
      m.led.material.color.copy(dentro && m.y < 0.05 ? m.col : apagado).multiplyScalar(dentro ? 2 : 1);
    });
    raiz.rotation.y = -0.35 + (ptr.sx || 0) * 0.15;
    return !o.quieto;
  }
  return { scene, camera, update, luces };
}
