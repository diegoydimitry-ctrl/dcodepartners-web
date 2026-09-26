/* ESCENA · INTEGRACIÓN («Qué hacemos», Integraciones)
   Seis herramientas reales de una empresa —hoja de cálculo, correo, chat,
   facturas, agenda, carpetas— como piezas físicas, cada una de su
   fabricante. Al principio cada una está en su sitio, sola, con su luz de
   estado en ámbar. Al bajar, un cable de fibra sale de cada una hacia el
   centro (D-Code OS), su luz pasa a azul y el dato empieza a ir y venir.
   Modo «puente»: dos grupos de herramientas, unidas a través del centro. */
export default function (K, o) {
  const { THREE, M, G } = K;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const luces = K.luces(scene, { key: [-5, 10, 7], sombra: 7 });
  const puente = o.modo === "puente";
  if (puente) camera.userData.ref = 1.7;
  const raiz = new THREE.Group(); scene.add(raiz);

  // El centro: D-Code OS. Zócalo moleteado, disco de vidrio, luz dentro.
  const hub = new THREE.Group(); raiz.add(hub);
  const base = new THREE.Mesh(G.cilindro(0.95, 1.0, 0.28, 96), M.moleteado); base.position.y = 0.14; base.castShadow = true;
  const disco = new THREE.Mesh(G.cilindro(0.8, 0.8, 0.34, 96), M.vidrio); disco.position.y = 0.45;
  const aro = new THREE.Mesh(G.cilindro(0.84, 0.84, 0.06, 96), M.acero); aro.position.y = 0.64;
  const nucleo = new THREE.Mesh(G.esfera, M.luz(0x5b8cff, 1.8)); nucleo.scale.setScalar(0.16); nucleo.position.y = 0.45;
  const halo = new THREE.PointLight(0x5b8cff, 0, 5, 2); halo.position.y = 0.6;
  hub.add(base, disco, aro, nucleo, halo, Object.assign(K.sombra(3.2, 3.2, 0.9), {}));

  const HER = [["hoja", M.ceramica], ["correo", M.vidrio], ["chat", M.silicio], ["factura", M.plastico], ["agenda", M.acero], ["carpeta", M.ceramica]];
  const piezas = HER.map(([ic, mat], i) => {
    const g = new THREE.Group();
    const cuerpo = new THREE.Mesh(G.ficha(1.05, 1.05, 0.32, 0.2), mat); cuerpo.castShadow = true;
    const oscuro = mat === M.ceramica || mat === M.acero;
    const icm = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.58), new THREE.MeshBasicMaterial({ map: K.icono(ic), transparent: true, color: oscuro ? 0x2a2d33 : 0xe8ecf4, opacity: 0.88, depthWrite: false }));
    icm.position.z = 0.19;
    const led = new THREE.Mesh(G.esfera, new THREE.MeshBasicMaterial({ color: 0xffa23a, toneMapped: false })); led.scale.setScalar(0.045); led.position.set(0.38, 0.38, 0.18);
    const pie = new THREE.Mesh(G.redondo(0.5, 0.06, 0.34, 0.02), M.grafito); pie.position.y = -0.58;
    g.add(cuerpo, icm, led, pie);
    const sh = K.sombra(1.5, 0.8, 0.8); sh.position.y = -0.6; g.add(sh);
    let ang, pos;
    if (puente) { const lado = i < 3 ? -1 : 1, k = i % 3; pos = new THREE.Vector3(lado * 4.2, 0.62, (k - 1) * 1.7); ang = lado < 0 ? Math.PI / 2 : -Math.PI / 2; }
    else { ang = -2.35 + i * 0.94; pos = new THREE.Vector3(Math.sin(ang) * 4, 0.62, Math.cos(ang) * 4 * 0.8); }
    g.position.copy(pos); g.lookAt(0, 0.62, 0); g.rotateY(Math.PI);
    raiz.add(g);
    // El cable: baja por detrás de la pieza, corre por el suelo, sube al centro.
    const a = pos.clone().setY(0.1), b = new THREE.Vector3(0, 0.12, 0);
    const dir = b.clone().sub(a).normalize();
    const curva = new THREE.CatmullRomCurve3([pos.clone().setY(0.3).addScaledVector(dir, 0.25), a.clone().addScaledVector(dir, 0.6).setY(0.03), a.clone().lerp(b, 0.55).setY(0.03), b.clone().addScaledVector(dir, -0.95).setY(0.2)]);
    const tubo = new THREE.Mesh(new THREE.TubeGeometry(curva, 80, 0.045, 10), M.goma); tubo.castShadow = true;
    const total = tubo.geometry.index.count; tubo.geometry.setDrawRange(0, 0);
    raiz.add(tubo);
    return { g, led, tubo, total, curva, fuera: pos.clone().multiplyScalar(1.28), dentro: pos.clone() };
  });
  const pulsos = K.pulsos(piezas.map((p) => p.curva), 3, 0x9fbaff, 0.06); raiz.add(pulsos);
  const pulsosVuelta = K.pulsos(piezas.map((p) => new THREE.CatmullRomCurve3(p.curva.getPoints(20).reverse())), 2, 0xffffff, 0.045); raiz.add(pulsosVuelta);

  camera.position.set(puente ? 0 : 1, puente ? 6.5 : 5, puente ? 12 : 11.5);
  camera.lookAt(0, 0.4, 0);
  const azul = new THREE.Color(0x6f95ff), ambar = new THREE.Color(0xffa23a);

  function update(t, dt, p, ptr) {
    const c = o.quieto ? (p > 0.35 ? 1 : 0) : Math.max(0, Math.min(1, (p - 0.28) / 0.34));
    const e = c * c * (3 - 2 * c);
    piezas.forEach((q, i) => {
      const ci = Math.max(0, Math.min(1, e * 1.6 - i * 0.1));
      q.g.position.lerpVectors(q.fuera, q.dentro, ci);
      q.g.position.y = 0.62 + (1 - ci) * Math.sin(t * 0.9 + i * 1.3) * 0.08;
      q.tubo.geometry.setDrawRange(0, Math.floor((q.total * ci) / 3) * 3);
      q.led.material.color.copy(ambar).lerp(azul, ci).multiplyScalar(ci < 0.5 ? (Math.sin(t * 6 + i) > 0 ? 1.6 : 0.4) : 2);
    });
    pulsos.userData.mover(t, 0.28, Math.max(0, e * 1.4 - 0.4));
    pulsosVuelta.userData.mover(t + 0.3, 0.2, Math.max(0, e * 1.4 - 0.5));
    const late = 0.8 + 0.2 * Math.sin(t * 2.4);
    nucleo.scale.setScalar(0.1 + 0.08 * e * late); halo.intensity = 3 * e * late;
    raiz.rotation.y = (ptr.sx || 0) * 0.15 + (p - 0.5) * 0.35;
    return !o.quieto;
  }
  return { scene, camera, update, luces };
}
