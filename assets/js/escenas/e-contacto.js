/* ESCENA · CONTACTO
   El cierre: todo lo anterior —las ocho áreas, cada una con su color—
   converge en un solo punto, un anillo que mira a quien está leyendo. El
   sistema termina en una persona: la siguiente conversación es contigo. */
export default function (K, o) {
  const { THREE, M, G } = K;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const luces = K.luces(scene, { key: [-4, 7, 9] });
  const raiz = new THREE.Group(); scene.add(raiz);
  const anillo = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.12, 32, 160), M.aluminio); raiz.add(anillo);
  const cara = new THREE.Mesh(new THREE.CircleGeometry(1.4, 96), M.vidrio); raiz.add(cara);
  const centro = new THREE.Mesh(G.esfera, M.luz(0x8fb0ff, 1.8)); centro.scale.setScalar(0.14); raiz.add(centro);
  const halo = new THREE.PointLight(0x7f9dff, 3, 6, 2); halo.position.z = 0.6; raiz.add(halo);
  const COL = [0x43e0ff, 0xff6b9d, 0x35e0a1, 0xffb43a, 0x5b8cff, 0x2dd4bf, 0x8b93ff, 0xa78bfa];
  const curvas = COL.map((c, i) => { const a = (i / COL.length) * Math.PI * 2; const ini = new THREE.Vector3(Math.cos(a) * 7, Math.sin(a) * 4.2, -5); return new THREE.CatmullRomCurve3([ini, new THREE.Vector3(Math.cos(a + 0.6) * 3.2, Math.sin(a + 0.6) * 2.2, -1.5), new THREE.Vector3(0, 0, 0)]); });
  curvas.forEach((c) => { const t = new THREE.Mesh(new THREE.TubeGeometry(c, 60, 0.012, 5), new THREE.MeshBasicMaterial({ color: 0x8fa2c8, transparent: true, opacity: 0.25, depthWrite: false })); raiz.add(t); });
  const pulsos = COL.map((c, i) => { const p = K.pulsos([curvas[i]], 3, c, 0.07); raiz.add(p); return p; });
  camera.position.set(0, 0, 9.5); camera.lookAt(0, 0, 0);
  function update(t, dt, p, ptr) {
    const c = Math.max(0.3, Math.min(1, (p - 0.1) / 0.5));
    pulsos.forEach((q, i) => q.userData.mover(t + i * 0.13, 0.12 + c * 0.1, 1));
    const late = 0.85 + 0.15 * Math.sin(t * 2);
    centro.scale.setScalar(0.1 + 0.06 * c * late); halo.intensity = 3 * c * late;
    raiz.rotation.y = (ptr.sx || 0) * 0.25; raiz.rotation.x = (ptr.sy || 0) * 0.15;
    return !o.quieto;
  }
  return { scene, camera, update, luces };
}
