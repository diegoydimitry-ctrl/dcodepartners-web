/* ESCENA · SISTEMA (portada, héroe)
   El propio logotipo de D-Code, fabricado: los píxeles de la izquierda son
   las herramientas de una empresa (hoja, correo, chat, facturas, agenda,
   carpetas), cada una de un material distinto porque cada una es de un
   fabricante distinto. Llegan sueltas y encajan en su sitio; la «D» de
   aluminio es el sistema que las recoge; el píxel azul es la IA; por la
   pista grabada en la D circula el dato. Es la frase del titular —«no te
   faltan herramientas, te falta que hablen entre ellas»— en un objeto. */
export default function (K, o) {
  const { THREE, M, G } = K;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  const luces = K.luces(scene, { key: [-6, 8, 9], rim: [8, 3, -6], sombra: 6 });
  const S = 0.05, W = (x) => (x - 60) * S, H = (y) => (50 - y) * S;
  const raiz = new THREE.Group(); scene.add(raiz);
  const firma = o.modo === "firma";

  /* La D: dos bandas con arco y el tramo recto, extruidas con bisel. */
  function banda(abajo) {
    const s = new THREE.Shape(), f = (y) => H(abajo ? 100 - y : y);
    s.moveTo(W(48), f(1)); s.lineTo(W(86), f(1));
    for (let i = 1; i <= 16; i++) { const a = -Math.PI / 2 + (i / 16) * (Math.PI / 2); s.lineTo(W(86 + Math.cos(a) * 32), f(33 + Math.sin(a) * 32)); }
    s.lineTo(W(118), f(38)); s.lineTo(W(102), f(38)); s.lineTo(W(102), f(33));
    for (let i = 1; i <= 16; i++) { const a = 0 - (i / 16) * (Math.PI / 2); s.lineTo(W(86 + Math.cos(a) * 16), f(33 + Math.sin(a) * 16)); }
    s.lineTo(W(48), f(17)); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.44, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.035, bevelSegments: 4, curveSegments: 24 });
    g.translate(0, 0, -0.22); g.computeVertexNormals();
    return g;
  }
  const D = new THREE.Group(); raiz.add(D);
  for (const ab of [false, true]) { const m = new THREE.Mesh(banda(ab), M.aluminio); m.castShadow = true; D.add(m); }
  const barra = new THREE.Mesh(G.redondo(16 * S, 16 * S, 0.52, 0.04), M.aluminio); barra.position.set(W(110), H(51), 0); barra.castShadow = true; D.add(barra);

  /* La pista grabada: el recorrido del dato por dentro del sistema. */
  const pista = new THREE.CurvePath();
  const L = (a, b) => pista.add(new THREE.LineCurve3(a, b));
  const P = (x, y) => new THREE.Vector3(W(x), H(y), 0.25);
  L(P(50, 9), P(86, 9));
  pista.add(arco(86, 33, 24, -Math.PI / 2, 0));
  L(P(110, 33), P(110, 67));
  pista.add(arco(86, 67, 24, 0, Math.PI / 2));
  L(P(86, 91), P(50, 91));
  function arco(cx, cy, r, a0, a1) {
    const pts = []; for (let i = 0; i <= 12; i++) { const a = a0 + (a1 - a0) * (i / 12); pts.push(P(cx + Math.cos(a) * r, cy + Math.sin(a) * r)); }
    return new THREE.CatmullRomCurve3(pts);
  }
  const trazo = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pista.getSpacedPoints(160)), 320, 0.012, 6), M.luz(0x5b8cff, 0.9));
  D.add(trazo);

  /* Los píxeles: las herramientas. */
  const px = [
    [26, 1, 16, "hoja", M.ceramica], [1, 27, 13, "correo", M.vidrio], [35, 26, 13, "chat", M.silicio],
    [2, 64, 12, "factura", M.plastico], [35, 64, 13, "agenda", M.acero], [26, 83, 16, "carpeta", M.ceramica],
  ].map(([x, y, s, ic, mat], i) => {
    const g = new THREE.Group(), lado = s * S;
    const cuerpo = new THREE.Mesh(G.ficha(lado, lado, 0.36 + (i % 3) * 0.08, lado * 0.16), mat); cuerpo.castShadow = true;
    const oscuro = mat === M.ceramica || mat === M.acero;
    const icm = new THREE.Mesh(new THREE.PlaneGeometry(lado * 0.56, lado * 0.56), new THREE.MeshBasicMaterial({ map: K.icono(ic), transparent: true, color: oscuro ? 0x2a2d33 : 0xe8ecf4, opacity: 0.85, depthWrite: false }));
    icm.position.z = 0.26 + (i % 3) * 0.04;
    g.add(cuerpo, icm);
    const dest = new THREE.Vector3(W(x + s / 2), H(y + s / 2), 0);
    const r = (k) => Math.sin(i * 12.9898 + k * 78.233) * 0.5 + 0.5;
    const desde = new THREE.Vector3(-7 - r(1) * 5, (r(2) - 0.5) * 7, (r(3) - 0.5) * 8 - 2);
    g.position.copy(firma ? dest : desde);
    g.rotation.set((r(4) - 0.5) * 3, (r(5) - 0.5) * 3, (r(6) - 0.5) * 2);
    raiz.add(g);
    return { g, dest, desde, vel: new THREE.Vector3(), rot: g.rotation.clone(), retardo: 0.25 + i * 0.13 };
  });

  /* El píxel azul: la IA. Vidrio con un núcleo de luz que late. */
  const ia = new THREE.Group(); ia.position.set(W(23.5), H(52.5), 0); raiz.add(ia);
  const iaCaja = new THREE.Mesh(G.ficha(15 * S, 15 * S, 0.5, 0.12), M.vidrioAzul); ia.add(iaCaja);
  const iaLuz = new THREE.Mesh(G.esfera, M.luz(0x5b8cff, 1.8)); iaLuz.scale.setScalar(0.17); ia.add(iaLuz);
  const iaHalo = new THREE.PointLight(0x5b8cff, 0, 4, 2); ia.add(iaHalo);

  /* Conexiones: cada herramienta, a la IA; la IA, a la D. */
  const cables = px.map((p) => new THREE.CatmullRomCurve3([p.dest.clone().setZ(0.3), p.dest.clone().lerp(ia.position, 0.5).setZ(0.55), ia.position.clone().setZ(0.3)]));
  cables.push(new THREE.CatmullRomCurve3([ia.position.clone().setZ(0.3), P(40, 20), P(50, 9)]), new THREE.CatmullRomCurve3([ia.position.clone().setZ(0.3), P(40, 80), P(50, 91)]));
  const hilos = cables.map((c) => { const m = new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.008, 5), M.luz(0x8fb0ff, 1.1)); m.visible = false; raiz.add(m); return m; });
  const pulsosCables = K.pulsos(cables, 2, 0xa9c1ff, 0.06); raiz.add(pulsosCables);
  const pistaCurva = new THREE.CatmullRomCurve3(pista.getSpacedPoints(160));
  const pulsosPista = K.pulsos([pistaCurva], 7, 0xb5c9ff, 0.065); D.add(pulsosPista);

  const suelo = K.sombra(7, 2, 0.8); suelo.position.set(0.3, -3.0, 0); raiz.add(suelo);

  raiz.rotation.y = -0.32;
  camera.position.set(1.4, 0.6, firma ? 15 : 24);
  camera.lookAt(firma ? 0.3 : 0.2, -0.2, 0);
  const inclina = { x: 0, y: 0, vx: 0, vy: 0 };

  function update(t, dt, p, ptr) {
    const quieto = o.quieto;
    let asentado = true;
    px.forEach((q, i) => {
      if (firma || quieto) { q.g.position.copy(q.dest); q.g.rotation.set(0, 0, 0); return; }
      if (t < q.retardo) { asentado = false; return; }
      const k = 60, a = 11; // muelle: llegan con peso y se asientan
      const f = q.dest.clone().sub(q.g.position).multiplyScalar(k).sub(q.vel.clone().multiplyScalar(a));
      q.vel.addScaledVector(f, dt); q.g.position.addScaledVector(q.vel, dt);
      q.g.rotation.x *= Math.exp(-5 * dt); q.g.rotation.y *= Math.exp(-5 * dt); q.g.rotation.z *= Math.exp(-5 * dt);
      q.g.position.z += Math.sin(t * 0.9 + i) * 0.0008;
      if (q.g.position.distanceTo(q.dest) > 0.02 || q.vel.length() > 0.05) asentado = false;
    });
    const conectado = firma || quieto ? 1 : Math.max(0, Math.min(1, (t - 2.1) / 1.2));
    hilos.forEach((h) => { h.visible = conectado > 0.02; });
    pulsosCables.userData.mover(t, 0.22, conectado);
    pulsosPista.userData.mover(t, 0.07, conectado);
    const late = 0.75 + 0.25 * Math.sin(t * 2.2);
    iaLuz.scale.setScalar(0.12 + 0.07 * conectado * late); iaHalo.intensity = 2.5 * conectado * late;
    // El cursor inclina la pieza con inercia; el scroll la gira al salir.
    const q = Math.max(0, Math.min(1, (p - 0.45) / 0.55));
    const tx = (ptr.sx || 0) * 0.22, ty = (ptr.sy || 0) * 0.14;
    inclina.vx += ((tx - inclina.x) * 30 - inclina.vx * 8) * dt; inclina.x += inclina.vx * dt;
    inclina.vy += ((ty - inclina.y) * 30 - inclina.vy * 8) * dt; inclina.y += inclina.vy * dt;
    raiz.rotation.y = -0.32 + inclina.x + q * 0.6;
    raiz.rotation.x = inclina.y + q * 0.15;
    // Hueco apaisado (móvil, encima del titular): la pieza centrada y más cerca.
    const ancho = camera.aspect > 0.98 && !firma;
    camera.position.set(ancho ? 0.9 : 1.4, 0.6, (firma ? 11 : ancho ? 16.5 : 16) + q * 3);
    camera.lookAt(firma ? 0.3 : ancho ? 0.45 : 0.2, firma ? 0 : -0.2, 0);
    return !quieto;
  }
  return { scene, camera, update, luces };
}
