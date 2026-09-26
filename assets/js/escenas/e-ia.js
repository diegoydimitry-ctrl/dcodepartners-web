/* ESCENA · IA (Agentes de IA)
   Una red de verdad, no un cerebro: capas de nodos de vidrio unidos por
   fibras. Por la izquierda entran consultas (fichas de chat); la señal
   atraviesa la red capa a capa y acaba en una de tres salidas —responde,
   clasifica, pasa a una persona—, que se enciende. Es lo que hace un
   agente: lee, decide y actúa, y lo delicado se lo pasa a alguien. */
export default function (K, o) {
  const { THREE, M, G } = K;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const luces = K.luces(scene, { key: [-4, 8, 8] });
  const raiz = new THREE.Group(); scene.add(raiz);
  const CAPAS = [4, 7, 7, 3], X = [-3.2, -1.1, 1.1, 3.2];
  const nodos = CAPAS.map((n, c) => Array.from({ length: n }, (_, i) => {
    const y = (i - (n - 1) / 2) * (c === 3 ? 1.1 : 0.62), z = Math.sin(i * 2.1 + c) * 0.7;
    const g = new THREE.Group(); g.position.set(X[c], y, z);
    const vid = new THREE.Mesh(G.esfera, M.vidrio); vid.scale.setScalar(c === 3 ? 0.3 : 0.2);
    const luz = new THREE.Mesh(G.esfera, new THREE.MeshBasicMaterial({ color: 0x3a4a70, toneMapped: false })); luz.scale.setScalar(c === 3 ? 0.12 : 0.07);
    g.add(vid, luz); raiz.add(g);
    return { g, luz, act: 0 };
  }));
  // Fibras: cilindros finos instanciados entre capas contiguas.
  const pares = [];
  for (let c = 0; c < 3; c++) nodos[c].forEach((a, i) => nodos[c + 1].forEach((b, j) => { if ((i + j + c) % 2 === 0 || c === 2) pares.push([a, b]); }));
  const fib = new THREE.InstancedMesh(G.cilindro(1, 1, 1, 6), new THREE.MeshPhysicalMaterial({ color: 0xcfd6e6, roughness: 0.3, metalness: 0.2, transparent: true, opacity: 0.35, depthWrite: false }), pares.length);
  const m4 = new THREE.Matrix4(), up = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), sc = new THREE.Vector3(), mid = new THREE.Vector3(), d = new THREE.Vector3();
  pares.forEach(([a, b], i) => { d.subVectors(b.g.position, a.g.position); mid.addVectors(a.g.position, b.g.position).multiplyScalar(0.5); q.setFromUnitVectors(up, d.clone().normalize()); sc.set(0.008, d.length(), 0.008); m4.compose(mid, q, sc); fib.setMatrixAt(i, m4); });
  raiz.add(fib);
  // Recorridos de la señal: 3 caminos por ciclo, de una entrada a una salida.
  const camino = (k) => { const pts = [new THREE.Vector3(-5, (k - 1) * 0.5, 0)]; let idx = k % 4; for (let c = 0; c < 4; c++) { idx = c === 0 ? idx : (idx * 3 + k + c) % CAPAS[c]; pts.push(nodos[c][idx].g.position.clone()); } return { curva: new THREE.CatmullRomCurve3(pts, false, "centripetal"), salida: idx }; };
  const caminos = [0, 1, 2, 3, 4, 5].map(camino);
  const pulsos = K.pulsos(caminos.map((c) => c.curva), 1, 0xa9c1ff, 0.08); raiz.add(pulsos);
  // Consultas entrando: fichas de chat.
  const fichas = [0, 1, 2].map((k) => { const f = new THREE.Mesh(G.ficha(0.5, 0.38, 0.12, 0.1), M.ceramica); const ic = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.26), new THREE.MeshBasicMaterial({ map: K.icono("chat"), transparent: true, color: 0x2a2d33, depthWrite: false })); ic.position.z = 0.08; f.add(ic); raiz.add(f); return f; });
  const salidas = ["Responde", "Clasifica", "Persona"].map((t, i) => { const r = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.26), new THREE.MeshBasicMaterial({ map: K.rotulo(t), transparent: true, depthWrite: false, opacity: 0.8 })); r.position.copy(nodos[3][i].g.position).add(new THREE.Vector3(1.25, 0, 0)); raiz.add(r); return r; });
  camera.position.set(0.6, 1.4, 12.5); camera.lookAt(0.1, 0, 0);
  const frio = new THREE.Color(0x3a4a70), vivo = new THREE.Color(0x8fb0ff);
  function update(t, dt, p, ptr) {
    const vel = 0.18, fase = (t * vel) % 1;
    pulsos.userData.mover(t, vel, 1);
    caminos.forEach((c, k) => {
      const u = ((((k / caminos.length) + t * vel) % 1) + 1) % 1;
      nodos.forEach((capa, ci) => capa.forEach((n) => { /* decae */ }));
      const cap = Math.min(3, Math.floor(u * 4.2));
      const pt = c.curva.getPointAt(u);
      nodos[cap].forEach((n) => { if (n.g.position.distanceTo(pt) < 0.4) n.act = 1; });
    });
    nodos.forEach((capa) => capa.forEach((n) => { n.act *= Math.exp(-2.2 * dt); n.luz.material.color.copy(frio).lerp(vivo, n.act).multiplyScalar(1 + n.act * 1.4); }));
    fichas.forEach((f, k) => { const u = (fase + k / 3) % 1; f.position.set(-6.5 + u * 3.2, (k - 1) * 0.55, 0.2); f.rotation.y = 0.4; f.scale.setScalar(u < 0.9 ? 1 : Math.max(0.01, (1 - u) * 10)); });
    salidas.forEach((s, i) => { s.material.opacity = 0.35 + nodos[3][i].act * 0.65; });
    raiz.rotation.y = -0.28 + (ptr.sx || 0) * 0.18 + (p - 0.5) * 0.3;
    raiz.rotation.x = (ptr.sy || 0) * 0.08;
    return !o.quieto;
  }
  return { scene, camera, update, luces };
}
