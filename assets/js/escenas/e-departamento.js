/* ESCENA · DEPARTAMENTOS
   Ocho áreas, ocho objetos: cada uno dice qué hace su parte del sistema.
     Comercial      embudo      (oportunidades que se convierten)
     Marketing      antena      (captar señales)
     Clientes       anillo      (el ciclo que vuelve)
     Producción     engranaje   (el trabajo que se mueve)
     Finanzas       monedas     (el dinero, apilado y contado)
     Soporte        mensaje     (la conversación)
     Administración archivo     (documentos en orden)
     Dirección      esfera      (una decisión cada mañana)
   Todos sobre su peana, en círculo, cableados a D-Code OS en el centro.
   Modo «todos»: el conjunto. Modo «<área>»: su objeto en primer plano,
   iluminado, enviando su dato al centro; los demás detrás. */
export default function (K, o) {
  const { THREE, M, G } = K;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  const luces = K.luces(scene, { key: [-5, 10, 7], sombra: 8 });
  const raiz = new THREE.Group(); scene.add(raiz);
  const AREAS = [["comercial", 0x43e0ff], ["marketing", 0xff6b9d], ["clientes", 0x35e0a1], ["produccion", 0xffb43a], ["finanzas", 0x5b8cff], ["soporte", 0x2dd4bf], ["administracion", 0x8b93ff], ["direccion", 0xa78bfa]];
  const foco = AREAS.findIndex((a) => a[0] === o.modo);
  const lathe = (pts, mat) => { const m = new THREE.Mesh(new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 64), mat); m.castShadow = true; return m; };
  function objeto(id, col) {
    const g = new THREE.Group();
    if (id === "comercial") { const e = lathe([[0.08, 0], [0.1, 0.25], [0.18, 0.45], [0.62, 1.05], [0.66, 1.1], [0.6, 1.1], [0.16, 0.48], [0.06, 0.26], [0.04, 0]], M.aluminio); e.material = M.aluminio; g.add(e); }
    if (id === "marketing") { const d = lathe(Array.from({ length: 12 }, (_, i) => { const r = i / 11 * 0.7; return [Math.max(0.01, r), r * r * 0.9]; }), M.ceramica); d.rotation.x = -0.9; d.position.y = 0.55; const brazo = new THREE.Mesh(G.cilindro(0.025, 0.025, 0.7, 12), M.acero); brazo.position.y = 0.3; const feed = new THREE.Mesh(G.esfera, M.luz(col, 1.6)); feed.scale.setScalar(0.05); feed.position.set(0, 0.85, 0.3); g.add(d, brazo, feed); }
    if (id === "clientes") { const t = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.12, 32, 96), M.acero); t.position.y = 0.62; t.castShadow = true; g.add(t); }
    if (id === "produccion") { const s = new THREE.Shape(); const Z = 12; for (let i = 0; i <= Z * 2; i++) { const a = (i / (Z * 2)) * Math.PI * 2, r = i % 2 ? 0.46 : 0.56; const b = a + Math.PI / (Z * 2) * 0.6; s[i ? "lineTo" : "moveTo"](Math.cos(a) * r, Math.sin(a) * r); s.lineTo(Math.cos(b) * r, Math.sin(b) * r); } const h = new THREE.Path(); h.absarc(0, 0, 0.16, 0, Math.PI * 2, true); s.holes.push(h);
      const eg = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.18, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 }), M.aluminio); eg.position.set(0, 0.64, -0.09); eg.castShadow = true; g.add(eg); g.userData.gira = eg; }
    if (id === "finanzas") { for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(G.cilindro(0.34, 0.34, 0.07, 64), M.laton); c.position.set(Math.sin(i * 1.7) * 0.03, 0.06 + i * 0.075, Math.cos(i * 2.3) * 0.03); c.castShadow = true; g.add(c); } }
    if (id === "soporte") { const b = new THREE.Mesh(G.ficha(0.95, 0.7, 0.26, 0.24), M.plastico); b.position.y = 0.62; b.castShadow = true; const ic = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), new THREE.MeshBasicMaterial({ map: K.icono("chat"), transparent: true, color: 0xe8ecf4, depthWrite: false })); ic.position.set(0, 0.62, 0.15); g.add(b, ic); }
    if (id === "administracion") { for (let i = 0; i < 4; i++) { const f = new THREE.Mesh(G.redondo(0.9, 0.09, 0.66, 0.03), i % 2 ? M.ceramica : M.grafito); f.position.set(i * 0.03, 0.08 + i * 0.12, -i * 0.02); f.castShadow = true; g.add(f); } }
    if (id === "direccion") { const e = new THREE.Mesh(G.esfera, M.vidrio); e.scale.setScalar(0.42); e.position.y = 0.62; const n = new THREE.Mesh(G.esfera, M.luz(col, 1.5)); n.scale.setScalar(0.1); n.position.y = 0.62; const aro = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.018, 12, 96), M.acero); aro.position.y = 0.62; aro.rotation.x = 1.2; g.add(e, n, aro); g.userData.gira = aro; }
    return g;
  }
  const R = 4.2;
  const hub = new THREE.Group(); raiz.add(hub);
  hub.add(Object.assign(new THREE.Mesh(G.cilindro(0.8, 0.86, 0.3, 96), M.moleteado), { castShadow: true }));
  const nuc = new THREE.Mesh(G.cilindro(0.62, 0.62, 0.22, 96), M.vidrioAzul); nuc.position.y = 0.26; hub.add(nuc);
  const piezas = AREAS.map(([id, col], i) => {
    const ang = (i / AREAS.length) * Math.PI * 2, pos = new THREE.Vector3(Math.sin(ang) * R, 0, Math.cos(ang) * R);
    const g = new THREE.Group(); g.position.copy(pos);
    const peana = new THREE.Mesh(G.cilindro(0.72, 0.78, 0.16, 96), M.grafito); peana.position.y = 0.08; peana.castShadow = true;
    const filo = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.012, 8, 128), M.luz(col, 1.2)); filo.rotation.x = Math.PI / 2; filo.position.y = 0.16;
    const ob = objeto(id, col); ob.position.y = 0.16;
    const sh = K.sombra(2.2, 2.2, 0.8); sh.position.y = 0.002;
    g.add(peana, filo, ob, sh); raiz.add(g);
    const curva = new THREE.CatmullRomCurve3([pos.clone().multiplyScalar(0.8).setY(0.05), pos.clone().multiplyScalar(0.5).setY(0.03), new THREE.Vector3(0, 0.1, 0).addScaledVector(pos.clone().normalize(), 0.9)]);
    const cable = new THREE.Mesh(new THREE.TubeGeometry(curva, 30, 0.035, 8), M.goma); raiz.add(cable);
    return { g, ob, filo, curva, col, ang };
  });
  const pulsos = K.pulsos(piezas.map((p) => p.curva), 2, 0xffffff, 0.05); raiz.add(pulsos);
  const pulsoFoco = foco >= 0 ? K.pulsos([piezas[foco].curva], 4, piezas[foco].col, 0.07) : null; if (pulsoFoco) raiz.add(pulsoFoco);
  // Encuadre: el conjunto, o el objeto del área en primer plano.
  if (foco >= 0) { raiz.rotation.y = -piezas[foco].ang; camera.position.set(1.4, 2.1, R + 3.4); camera.lookAt(-0.4, 0.5, R - 1.2); }
  else { camera.position.set(0, 11.5, 17.5); camera.lookAt(0, -0.3, 0); }
  function update(t, dt, p, ptr) {
    piezas.forEach((q, i) => { if (q.ob.userData.gira) q.ob.userData.gira.rotation.z = t * (i === 3 ? 0.5 : 0.3); });
    pulsos.userData.mover(t, 0.2, foco >= 0 ? 0.5 : 1);
    if (pulsoFoco) pulsoFoco.userData.mover(t, 0.3, 1);
    if (foco < 0) raiz.rotation.y = t * 0.03 + (p - 0.5) * 0.9 + (ptr.sx || 0) * 0.12;
    else raiz.rotation.y = -piezas[foco].ang + (ptr.sx || 0) * 0.08 + (p - 0.5) * 0.12;
    return !o.quieto;
  }
  return { scene, camera, update, luces };
}
