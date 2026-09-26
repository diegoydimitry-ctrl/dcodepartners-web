/* ESCENA · DATOS («El problema»)
   Treinta fichas: las treinta veces al día que alguien copia, pega, busca,
   responde, apunta, revisa y recuerda (las cifras de la lista de la
   sección: 6, 6, 4, 5, 3, 2, 4). A la izquierda, sueltas y en ámbar: el
   trabajo a mano. Al bajar, pasan por el anillo del sistema y salen
   ordenadas en siete columnas, una por tarea. El dato entra una vez. */
export default function (K, o) {
  const { THREE, M, G } = K;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  const luces = K.luces(scene, { key: [-4, 9, 8], sombra: 7 });
  const raiz = new THREE.Group(); scene.add(raiz);
  const VECES = [6, 6, 4, 5, 3, 2, 4], N = VECES.reduce((a, b) => a + b, 0);
  const mat = M.ceramica.clone(); mat.vertexColors = false;
  const im = new THREE.InstancedMesh(G.redondo(0.5, 0.14, 0.5, 0.05), mat, N); im.castShadow = true; raiz.add(im);
  const r = (i, k) => Math.sin(i * 12.9898 + k * 78.233) * 0.5 + 0.5;
  const fichas = []; let n = 0;
  VECES.forEach((v, col) => { for (let j = 0; j < v; j++, n++) fichas.push({
    caos: new THREE.Vector3(-6.2 + r(n, 1) * 3.4, -0.4 + r(n, 2) * 2.8, -1.4 + r(n, 3) * 2.8),
    rot: new THREE.Euler(r(n, 4) * 6, r(n, 5) * 6, r(n, 6) * 6),
    fin: new THREE.Vector3(1.6 + col * 0.72, -0.64 + j * 0.16, 0), orden: n }); });
  const anillo = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.09, 24, 128), M.aluminio); anillo.position.set(-0.8, 0.6, 0); anillo.rotation.y = Math.PI / 2; anillo.castShadow = true; raiz.add(anillo);
  const velo = new THREE.Mesh(new THREE.CircleGeometry(0.98, 64), new THREE.MeshBasicMaterial({ color: 0x5b8cff, transparent: true, opacity: 0.12, depthWrite: false, toneMapped: false })); velo.position.copy(anillo.position); velo.rotation.y = Math.PI / 2; raiz.add(velo);
  const base = new THREE.Mesh(G.redondo(5.4, 0.12, 1.1, 0.05), M.grafito); base.position.set(3.76, -0.78, 0); base.receiveShadow = true; raiz.add(base);
  const sh = K.sombra(12, 3, 0.6); sh.position.y = -0.85; raiz.add(sh);
  camera.position.set(-0.6, 3.2, 12.5); camera.lookAt(-0.2, 0.2, 0);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), pos = new THREE.Vector3(), e = new THREE.Euler();
  const ambar = new THREE.Color(0xd9a066), blanco = new THREE.Color(0xe9e7e2), azul = new THREE.Color(0xa9bdf5);
  function update(t, dt, p, ptr) {
    const c = o.quieto ? (p > 0.45 ? 1 : 0) : Math.max(0, Math.min(1, (p - 0.25) / 0.45));
    fichas.forEach((f, i) => {
      const u = Math.max(0, Math.min(1, (c * 1.35 - (f.orden / N)) * 2.4)), eu = u * u * (3 - 2 * u);
      const a = f.caos.clone(); a.y += Math.sin(t * 0.8 + i) * 0.06 * (1 - eu);
      const m = anillo.position;
      // Bézier cuadrática: suelta → anillo → su columna.
      pos.set(0, 0, 0).addScaledVector(a, (1 - eu) * (1 - eu)).addScaledVector(m, 2 * eu * (1 - eu)).addScaledVector(f.fin, eu * eu);
      e.set(f.rot.x * (1 - eu) + t * 0.3 * (1 - eu), f.rot.y * (1 - eu), f.rot.z * (1 - eu)); q.setFromEuler(e);
      m4.compose(pos, q, s); im.setMatrixAt(i, m4);
      im.setColorAt(i, ambar.clone().lerp(u > 0.98 && (i + Math.floor(t * 2)) % 9 === 0 ? azul : blanco, eu));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    velo.material.opacity = 0.08 + 0.1 * Math.sin(t * 2) ** 2;
    raiz.rotation.y = -0.18 + (ptr.sx || 0) * 0.12;
    return !o.quieto;
  }
  return { scene, camera, update, luces };
}
