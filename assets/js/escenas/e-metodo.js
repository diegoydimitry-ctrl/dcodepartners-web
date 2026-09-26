/* ESCENA · MÉTODO (Método, Casos)
   Seis recorridos —un cliente, un pedido, una factura…— tal como van hoy:
   enredados, cruzándose, con vueltas que no llevan a ninguna parte. Una
   lámina de luz los analiza al pasar y, detrás de ella, cada recorrido
   queda recto y directo. Es el método: seguir el recorrido real y
   diseñar el que debería ser.
   Modo «casos»: antes y después, uno junto a otro, separados por vidrio. */
export default function (K, o) {
  const { THREE, M, G } = K;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  camera.userData.ref = 1.7;
  const luces = K.luces(scene, { key: [-4, 9, 8] });
  const raiz = new THREE.Group(); scene.add(raiz);
  const casos = o.modo === "casos";
  const L = 6, P = 44, r = (i, k) => Math.sin(i * 12.9898 + k * 78.233) * 0.5 + 0.5;
  const grupos = casos ? [{ dx: -4.2, fijo: 0 }, { dx: 4.2, fijo: 1 }] : [{ dx: 0, fijo: null }];
  const TIN = [0x43e0ff, 0x5b8cff, 0xffb43a, 0x35e0a1, 0xa78bfa, 0xff6b9d];
  const ancho = casos ? 3.4 : 4.6;
  const cadenas = [];
  grupos.forEach((gr, gi) => {
    for (let l = 0; l < L; l++) {
      const pts = Array.from({ length: 7 }, (_, k) => new THREE.Vector3(-ancho + k * (ancho * 2 / 6) + (r(l * 7 + k + gi, 1) - 0.5) * 1.6, (r(l * 7 + k, 2) - 0.5) * 3, (r(l * 7 + k, 3) - 0.5) * 2.4));
      const enredo = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.9);
      const y = (l - (L - 1) / 2) * 0.46;
      const recta = new THREE.LineCurve3(new THREE.Vector3(-ancho, y, 0), new THREE.Vector3(ancho, y, 0));
      cadenas.push({ enredo, recta, gr, color: new THREE.Color(TIN[l]) });
    }
  });
  const n = cadenas.length * P;
  const im = new THREE.InstancedMesh(G.esfera, M.acero.clone(), n); raiz.add(im);
  const trazos = [];
  const lamina = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 3.6), M.luz(0x8fb0ff, 1.6)); lamina.rotation.y = 0; raiz.add(lamina);
  const velo = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 3.6), new THREE.MeshBasicMaterial({ color: 0x5b8cff, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })); velo.rotation.y = Math.PI / 2; raiz.add(velo);
  if (casos) { const div = new THREE.Mesh(G.ficha(0.05, 4.4, 2.4, 0.02), M.vidrio); raiz.add(div); lamina.visible = velo.visible = false;
    ["Antes", "Después"].forEach((t, i) => { const e = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.32), new THREE.MeshBasicMaterial({ map: K.rotulo(t), transparent: true, depthWrite: false, opacity: 0.8 })); e.position.set(i ? 4.2 : -4.2, 2.3, 0); raiz.add(e); }); }
  const puls = casos ? K.pulsos(cadenas.filter((c) => c.gr.fijo === 1).map((c) => new THREE.CatmullRomCurve3([c.recta.v1.clone().setX(c.recta.v1.x + 4.2), c.recta.v2.clone().setX(c.recta.v2.x + 4.2)])), 2, 0xa9c1ff, 0.07) : null;
  if (puls) raiz.add(puls);
  camera.position.set(0, 1.2, casos ? 16 : 12); camera.lookAt(0, 0, 0);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), gris = new THREE.Color(0x9a8f80);
  function update(t, dt, p, ptr) {
    const scan = casos ? 0 : -ancho - 0.6 + Math.max(0, Math.min(1, (p - 0.22) / 0.5)) * (ancho * 2 + 1.2);
    lamina.position.x = velo.position.x = scan;
    let k = 0;
    cadenas.forEach((c) => {
      for (let i = 0; i < P; i++, k++) {
        const u = i / (P - 1);
        c.enredo.getPointAt(u, a); c.recta.getPointAt(u, b);
        let ord = c.gr.fijo != null ? c.gr.fijo : Math.max(0, Math.min(1, (scan - b.x) / 0.9));
        ord = ord * ord * (3 - 2 * ord);
        a.y += Math.sin(t * 0.7 + i * 0.3 + k) * 0.03 * (1 - ord);
        a.lerp(b, ord).x += c.gr.dx;
        s.setScalar(0.055 + ord * 0.012); m4.compose(a, q, s); im.setMatrixAt(k, m4);
        im.setColorAt(k, gris.clone().lerp(c.color, ord * 0.85));
      }
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    if (puls) puls.userData.mover(t, 0.12, 1);
    raiz.rotation.y = (ptr.sx || 0) * 0.15 + (casos ? (p - 0.5) * 0.3 : -0.12);
    return !o.quieto;
  }
  return { scene, camera, update, luces };
}
