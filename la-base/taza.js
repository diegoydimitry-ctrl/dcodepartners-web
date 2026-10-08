// La Base · la taza: una taza 3D blanca con su logotipo, café con corazón de leche y vapor.
// Gira sola, se puede girar arrastrando y se inclina al hacer scroll para enseñar el café.
import * as THREE from '../lib/three.module.min.js';

const caja = document.getElementById('taza');
const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
function hayWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
if (caja && hayWebGL()) cargarLogo().then(iniciar);

function cargarLogo() {
  return new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = 'img/logo-labase.png'; });
}

function iniciar(logo) {
  const movil = matchMedia('(max-width: 620px)').matches;
  const lienzo = document.createElement('canvas'); lienzo.setAttribute('aria-hidden', 'true'); caja.appendChild(lienzo);
  const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 60);

  // entorno de estudio hecho a mano (paneles de luz) para reflejos de cerámica
  const pm = new THREE.PMREMGenerator(renderer);
  const est = new THREE.Scene();
  est.add(new THREE.Mesh(new THREE.BoxGeometry(20, 14, 20), new THREE.MeshBasicMaterial({ color: 0x9fb8b0, side: THREE.BackSide })));
  const panel = (w, h, x, y, z, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(i, i, i), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); est.add(m); };
  panel(8, 4, 0, 6.5, 2, 6); panel(3, 7, -9, 1, 2, 4); panel(3, 6, 9, 0, -3, 2.5); panel(10, 2, 0, -2, 9, 1.4);
  scene.environment = pm.fromScene(est, 0.04).texture;
  const sol = new THREE.DirectionalLight(0xfff4e6, 1.6); sol.position.set(-3, 6, 4); scene.add(sol);

  // textura de la pared exterior: blanco cerámica con el logotipo de La Base
  const tx = document.createElement('canvas'); tx.width = 2048; tx.height = 512;
  const g = tx.getContext('2d'); g.fillStyle = '#f7f6f2'; g.fillRect(0, 0, 2048, 512);
  if (logo) { const h = 250, w = h * logo.width / logo.height; g.drawImage(logo, 1950 - w / 2, 196 - h / 2, w, h); g.drawImage(logo, 1950 - 2048 - w / 2, 196 - h / 2, w, h); }
  const texPared = new THREE.CanvasTexture(tx); texPared.colorSpace = THREE.SRGBColorSpace; texPared.anisotropy = 8;

  const ceramica = { color: 0xffffff, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.1 };
  const grupo = new THREE.Group(); scene.add(grupo);
  const V = (x, y) => new THREE.Vector2(x, y);

  // pared exterior (con logotipo)
  const ext = [V(0.60, 0.0), V(0.66, 0.06), V(0.74, 0.25), V(0.84, 0.55), V(0.93, 0.85), V(0.99, 1.12), V(1.01, 1.24)];
  grupo.add(new THREE.Mesh(new THREE.LatheGeometry(ext, 96), new THREE.MeshPhysicalMaterial({ ...ceramica, map: texPared })));
  // borde, pared interior y fondo
  const intr = [V(1.01, 1.24), V(1.0, 1.27), V(0.97, 1.28), V(0.94, 1.25), V(0.91, 1.12), V(0.82, 0.8), V(0.7, 0.4), V(0.6, 0.16), V(0.0, 0.14)];
  grupo.add(new THREE.Mesh(new THREE.LatheGeometry(intr, 96), new THREE.MeshPhysicalMaterial({ ...ceramica, side: THREE.DoubleSide })));
  const base = new THREE.Mesh(new THREE.CircleGeometry(0.6, 64), new THREE.MeshPhysicalMaterial(ceramica)); base.rotation.x = Math.PI / 2; base.position.y = 0.001; grupo.add(base);

  // café con corazón de leche
  const cc = document.createElement('canvas'); cc.width = cc.height = 512; const c = cc.getContext('2d');
  const gr = c.createRadialGradient(256, 256, 30, 256, 256, 256); gr.addColorStop(0, '#c48a55'); gr.addColorStop(0.7, '#8a5630'); gr.addColorStop(1, '#5a3218');
  c.fillStyle = gr; c.fillRect(0, 0, 512, 512);
  c.fillStyle = '#f5ead9'; c.globalAlpha = 0.95; c.beginPath();
  c.moveTo(256, 395); c.bezierCurveTo(120, 300, 110, 175, 190, 158); c.bezierCurveTo(232, 150, 252, 180, 256, 205);
  c.bezierCurveTo(260, 180, 280, 150, 322, 158); c.bezierCurveTo(402, 175, 392, 300, 256, 395); c.fill();
  c.globalAlpha = 0.35; c.strokeStyle = '#8a5630'; c.lineWidth = 7; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(256, 250 + k * 22, 60 - k * 14, Math.PI * 0.15, Math.PI * 0.85); c.stroke(); }
  const texCafe = new THREE.CanvasTexture(cc); texCafe.colorSpace = THREE.SRGBColorSpace;
  const cafe = new THREE.Mesh(new THREE.CircleGeometry(0.925, 64), new THREE.MeshPhysicalMaterial({ map: texCafe, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 }));
  cafe.rotation.x = -Math.PI / 2; cafe.position.y = 1.13; cafe.rotation.z = Math.PI; grupo.add(cafe);

  // asa
  const asa = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.085, 24, 64, Math.PI), new THREE.MeshPhysicalMaterial(ceramica));
  asa.position.set(-0.88, 0.62, 0); asa.rotation.z = Math.PI / 2; asa.scale.set(1.1, 0.88, 1); grupo.add(asa);

  // plato
  const pl = [V(0.0, 0.0), V(0.75, 0.0), V(0.8, 0.02), V(0.86, 0.05), V(1.5, 0.12), V(1.68, 0.19), V(1.72, 0.22), V(1.69, 0.24), V(1.5, 0.17), V(0.86, 0.09), V(0.8, 0.07), V(0.0, 0.07)];
  const plato = new THREE.Mesh(new THREE.LatheGeometry(pl, 96), new THREE.MeshPhysicalMaterial({ ...ceramica, side: THREE.DoubleSide }));
  plato.position.y = -0.07; scene.add(plato);
  grupo.position.y = 0.0;

  // sombra de contacto
  const sc = document.createElement('canvas'); sc.width = sc.height = 256; const s2 = sc.getContext('2d');
  const sg = s2.createRadialGradient(128, 128, 10, 128, 128, 128); sg.addColorStop(0, 'rgba(20,50,45,.55)'); sg.addColorStop(1, 'rgba(20,50,45,0)'); s2.fillStyle = sg; s2.fillRect(0, 0, 256, 256);
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  sombra.rotation.x = -Math.PI / 2; sombra.position.y = -0.075; scene.add(sombra);

  // vapor
  const vapor = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: { uT: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform float uT; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f); return mix(mix(h(i),h(i+vec2(1,0)),u.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x), u.y); }
      void main(){ vec2 uv=vUv; float t=uT*0.35;
        float x = uv.x - 0.5 + (n(vec2(uv.y*3.0 - t*2.0, t))-0.5)*0.55*uv.y;
        float hilo = smoothstep(0.22, 0.0, abs(x));
        float ruido = n(vec2(uv.x*2.5 + t*0.3, uv.y*3.0 - t*2.2)) * 0.7 + n(vec2(uv.x*6.0, uv.y*8.0 - t*3.5)) * 0.3;
        float a = hilo * ruido * smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.45, uv.y);
        gl_FragColor = vec4(vec3(1.0), a*0.38); }`
  });
  const humos = [];
  for (let k = 0; k < 3; k++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2.2), vapor); m.position.set((k - 1) * 0.3, 2.35, (k - 1) * 0.1); scene.add(m); humos.push(m); }

  function medir() { const w = caja.clientWidth, h = caja.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  caja.classList.add('gl'); medir(); new ResizeObserver(medir).observe(caja);

  let giro = Math.PI / 2 - 0.35, velGiro = 0, arr = null, ultX = 0, visible = true, t0 = performance.now(), prev = t0;
  caja.addEventListener('pointerdown', (e) => { arr = true; ultX = e.clientX; caja.setPointerCapture(e.pointerId); });
  caja.addEventListener('pointermove', (e) => { if (!arr) return; const dx = e.clientX - ultX; ultX = e.clientX; velGiro = dx * 0.012; giro += dx * 0.012; });
  const fin = () => { arr = null; }; caja.addEventListener('pointerup', fin); caja.addEventListener('pointercancel', fin);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(caja);

  function cuadro(now) {
    requestAnimationFrame(cuadro);
    if (!visible || document.hidden) return;
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now; const t = (now - t0) / 1000;
    if (!arr) { velGiro *= 0.95; giro += velGiro + (reducir ? 0 : dt * 0.35); }
    const r = caja.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top) / (r.height * 1.1)));
    grupo.rotation.y = giro; plato.rotation.y = giro * 0.3;
    const elev = 0.3 + k * 0.75, dist = movil ? 7.2 : 9.2;
    cam.position.set(Math.sin(0.0) * dist, 1.0 + Math.sin(elev) * dist * 0.62, Math.cos(elev) * dist);
    cam.lookAt(0, 0.7 - k * 0.15, 0);
    grupo.position.y = Math.sin(t * 1.2) * 0.02;
    vapor.uniforms.uT.value = t;
    humos.forEach((m) => m.quaternion.copy(cam.quaternion));
    renderer.render(scene, cam);
  }
  requestAnimationFrame(cuadro);
}
