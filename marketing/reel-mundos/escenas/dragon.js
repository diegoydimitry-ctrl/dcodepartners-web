// MATERIA — la misma escultura cambia de materia delante de ti: cristal → oro → metal líquido → luz.
import { lerp, eio, eout, ss, rango } from '../util.js';
export default async function (ctx) {
  const { THREE, scene, cam, bloom, renderer } = ctx;
  const claro = new THREE.Color('#dfe3ec'), oscuro = new THREE.Color('#050507');
  scene.background = new THREE.Color().copy(claro);
  scene.environment = await ctx.hdr('estudio.hdr');
  renderer.localClippingEnabled = true;
  const g = await ctx.gltf('DragonAttenuation.glb'); let d0 = null; g.scene.traverse((o) => { if (o.isMesh && /Dragon/.test(o.name)) d0 = o; });
  d0.updateWorldMatrix(true, false); const geo = d0.geometry.clone().applyMatrix4(d0.matrixWorld); geo.computeBoundingBox(); const bb = geo.boundingBox, c = bb.getCenter(new THREE.Vector3()); geo.translate(-c.x, -c.y, -c.z);
  const alto = bb.max.y - bb.min.y, ancho = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z), y0 = -alto / 2 - 0.02, y1 = alto / 2 + 0.02;
  const agua = await new THREE.TextureLoader().loadAsync('assets/waternormals.jpg'); agua.wrapS = agua.wrapT = THREE.RepeatWrapping; agua.repeat.set(3, 3);
  const cristal = d0.material; cristal.side = THREE.FrontSide;
  const oro = new THREE.MeshPhysicalMaterial({ color: 0xffc56a, metalness: 1, roughness: 0.16, envMapIntensity: 1.3 });
  const liquido = new THREE.MeshPhysicalMaterial({ color: 0xf2f4f8, metalness: 1, roughness: 0.03, normalMap: agua, normalScale: new THREE.Vector2(0.55, 0.55), envMapIntensity: 1.5 });
  // «luz»: sólo brillan los cantos (fresnel), sumando sobre negro
  const luz = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, clipping: true,
    vertexShader: '#include <clipping_planes_pars_vertex>\nvarying vec3 vN; varying vec3 vV; void main(){ vec4 mvPosition = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mvPosition.xyz); gl_Position = projectionMatrix * mvPosition;\n#include <clipping_planes_vertex>\n}',
    fragmentShader: '#include <clipping_planes_pars_fragment>\nvarying vec3 vN; varying vec3 vV; void main(){\n#include <clipping_planes_fragment>\nfloat f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2); vec3 c = mix(vec3(1.0,0.45,0.12), vec3(1.0,0.9,0.7), f) * (0.05 + 1.8 * f); gl_FragColor = vec4(c, 1.0); }' });
  const MATS = [cristal, oro, liquido, luz], H = [{ value: y1 }, { value: y0 }, { value: y0 }, { value: y0 }];        // frentes de barrido (altura)
  const arriba = (i) => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), abajo = () => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  const grupo = new THREE.Group(); scene.add(grupo);
  const P = MATS.map((m, i) => { const pl = [arriba(), abajo()]; m.clippingPlanes = pl; const me = new THREE.Mesh(geo, m); grupo.add(me); return pl; });
  // filo luminoso en cada frente
  const filo = [1, 2, 3].map(() => { const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 5, 3.5), clippingPlanes: [arriba(), abajo()] }); const me = new THREE.Mesh(geo, m); me.scale.setScalar(1.004); grupo.add(me); return m; });
  const BAR = [[0.45, 1.05], [1.2, 1.8], [1.95, 2.5]];
  return { dur: 3.0, sub: 1, frame(t) {
    const f = BAR.map(([a, b]) => lerp(y0, y1, eio(rango(t, a, b))));      // altura de cada frente; por debajo manda el material siguiente
    const sup = [y1 + 1, f[0], f[1], f[2]], inf = [f[0], f[1], f[2], y0 - 1];
    P.forEach((pl, i) => { pl[0].constant = -inf[i]; pl[1].constant = sup[i]; });      // visible si inf < y < sup
    filo.forEach((m, i) => { const act = f[i] > y0 + 0.001 && f[i] < y1 - 0.001; m.clippingPlanes[0].constant = -(f[i] - 0.012); m.clippingPlanes[1].constant = act ? f[i] + 0.012 : f[i] - 1; });
    agua.offset.set(t * 0.22, t * 0.31);
    const k = t / 3, az = lerp(-72, -28, ss(k)) * Math.PI / 180, el = lerp(14, 6, k) * Math.PI / 180, d = ancho * lerp(1.75, 1.3, eio(k)) - ancho * 1.05 * Math.pow(rango(t, 2.6, 3.0), 2.2);
    cam.fov = 34; cam.updateProjectionMatrix(); cam.position.set(d * Math.sin(az) * Math.cos(el), d * Math.sin(el) + alto * 0.05, d * Math.cos(az) * Math.cos(el)); cam.lookAt(0, 0, 0);
    grupo.rotation.y = 0;
    const noche = eio(rango(t, 1.9, 2.5)); scene.background.copy(claro).lerp(oscuro, noche);
    scene.environmentRotation.y = 0.4 + t * 0.9; scene.environmentIntensity = lerp(1.0, 0.5, noche);
    renderer.toneMappingExposure = 1.0; bloom.threshold = 1.0; bloom.strength = lerp(0.1, 0.5, noche); bloom.radius = 0.7;
  } };
}
