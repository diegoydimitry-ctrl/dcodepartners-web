/* ESCENA · SOFTWARE (sistemas a medida, páginas web, Finance, laboratorio)
   Software propio, enseñado como lo que es: pantallas reales de D-Code
   (Finance, D-Code OS, Comercial, Operaciones, Atención) montadas en
   láminas de vidrio con canto de aluminio, en capas. Al bajar, las capas
   se separan —se ve de qué está hecho— y vuelven a juntarse.
   Modo «web»: las webs de producción (inmobiliaria, restaurante, clínica,
   tienda) en abanico, cada una cableada al mismo núcleo: la web es la
   puerta del sistema, lee y escribe en él (CRM, agenda, stock). */
export default function (K, o) {
  const { THREE, M, G } = K;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  const luces = K.luces(scene, { key: [-5, 7, 9] });
  const raiz = new THREE.Group(); scene.add(raiz);
  const ORDEN = { finance: ["finance", "os", "comercial"], web: ["comercial", "atencion", "os"], medida: ["operaciones", "comercial", "os", "finance"], lab: ["os", "finance", "comercial", "operaciones", "atencion"] }[o.modo] || ["os", "finance", "operaciones", "comercial"];
  const web = o.modo === "web";
  if (web) ORDEN.splice(0, ORDEN.length, "inmobiliaria", "restaurante", "clinica", "tienda");
  const W = web ? 3.2 : 4.4, Hh = web ? W * 820 / 1200 : W * 813 / 1400;
  let claro = K.claro;
  // Ojo: en producción «-light» es la captura oscura (para la página clara) y al revés.
  const url = (n) => web ? `/assets/img/webs/web-${n}-600.webp` : `/assets/img/demos/${n}-${claro ? "dark" : "light"}-700.webp`;
  const paneles = ORDEN.map((n, i) => {
    const g = new THREE.Group();
    const marco = new THREE.Mesh(G.ficha(W + 0.16, Hh + 0.16, 0.08, 0.12), M.aluminio); marco.castShadow = true;
    const mat = new THREE.MeshBasicMaterial({ color: 0xbfc4cc, toneMapped: false });
    const pant = new THREE.Mesh(new THREE.PlaneGeometry(W, Hh), mat); pant.position.z = 0.045;
    const vid = new THREE.Mesh(new THREE.PlaneGeometry(W, Hh), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.12, clearcoat: 1, envMapIntensity: 1.5, depthWrite: false }));
    vid.position.z = 0.05;
    g.add(marco, pant, vid); raiz.add(g);
    cargar(mat, n);
    return { g, mat, n, i };
  });
  function cargar(mat, n) { new THREE.TextureLoader().load(url(n), (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; const v = mat.map; mat.map = t; mat.color.set(claro ? 0xe6e8ec : 0xc9cdd4); mat.needsUpdate = true; v && v.dispose(); }); }
  const sombra = K.sombra(7, 2.4, 0.7); sombra.position.y = -2.3; raiz.add(sombra);
  camera.position.set(0, 0.4, 13.5); camera.lookAt(0, 0, 0);
  const n = paneles.length;
  let pulsos = null;
  if (web) {
    // Abanico de webs y, detrás, el núcleo al que todas leen y escriben.
    paneles.forEach((q) => { const k = q.i - (n - 1) / 2; q.g.position.set(k * 2.35, Math.abs(k) * -0.25 + 0.5, -Math.abs(k) * 1.1); q.g.rotation.y = -k * 0.36; });
    const nucleo = new THREE.Group(); nucleo.position.set(0, -1.7, -2.6); raiz.add(nucleo);
    const base = new THREE.Mesh(G.redondo(2.2, 0.5, 1.2, 0.12), M.grafito); base.castShadow = true; nucleo.add(base);
    const tapa = new THREE.Mesh(G.redondo(1.9, 0.08, 0.9, 0.03), M.aluminio); tapa.position.y = 0.28; nucleo.add(tapa);
    const led = new THREE.Mesh(G.esfera, M.luz(0x5b8cff, 2)); led.scale.setScalar(0.07); led.position.set(0.7, 0.33, 0.3); nucleo.add(led);
    const curvas = paneles.map((q) => { const a = q.g.position.clone().add(new THREE.Vector3(0, -Hh / 2 - 0.05, -0.1)); const b = nucleo.position.clone().add(new THREE.Vector3((q.i - 1.5) * 0.35, 0.3, 0)); return new THREE.CatmullRomCurve3([a, a.clone().setY(-1.6).lerp(b, 0.2), b]); });
    curvas.forEach((c) => raiz.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.02, 6), M.goma)));
    pulsos = K.pulsos(curvas.concat(curvas.map((c) => new THREE.CatmullRomCurve3(c.getPoints(16).reverse()))), 2, 0x8fb0ff, 0.05); raiz.add(pulsos);
    sombra.position.y = -2.3; camera.position.set(0, 1.6, 20.5); camera.lookAt(0, -0.4, 0);
  }
  function update(t, dt, p, ptr) {
    if (web) {
      pulsos.userData.mover(t, 0.22, 1);
      raiz.rotation.y = (ptr.sx || 0) * 0.12 + (p - 0.5) * 0.2;
      raiz.rotation.x = (ptr.sy || 0) * 0.05;
      paneles.forEach((q) => { q.g.position.y = Math.abs(q.i - (n - 1) / 2) * -0.25 + 0.5 + Math.sin(t * 0.7 + q.i) * 0.04; });
      return !o.quieto;
    }
    const d = camera.aspect > 2.2 ? 9.5 : 13.5; // banda apaisada: más cerca
    if (camera.position.z !== d) { camera.position.set(0, 0.4, d); camera.lookAt(0, 0, 0); }
    const c = Math.max(0, Math.min(1, (p - 0.2) / 0.5)), abre = Math.sin(c * Math.PI) * 0.75 + 0.25;
    paneles.forEach((q) => {
      const k = q.i - (n - 1) / 2;
      q.g.position.set(k * 0.55 * abre, k * -0.22 * abre, -q.i * 1.25 * abre);
      q.g.rotation.set(0, 0, 0);
    });
    raiz.rotation.y = -0.55 + (ptr.sx || 0) * 0.2 + c * 0.25;
    raiz.rotation.x = 0.08 + (ptr.sy || 0) * 0.08;
    raiz.position.y = Math.sin(t * 0.6) * 0.05;
    return !o.quieto;
  }
  return { scene, camera, update, luces, tema(c) { claro = c; if (!web) paneles.forEach((q) => cargar(q.mat, q.n)); } };
}
