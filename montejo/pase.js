// Montejo · «El pase»: una cinta 3D curvada de bandejas reales que corre sin fin.
// Avanza sola y se acelera, ondula y se inclina con la velocidad del scroll; se puede arrastrar.
import * as THREE from '../lib/three.module.min.js';

const caja = document.getElementById('pase');
const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
function hayWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
if (caja && !reducir && hayWebGL()) iniciar();

function iniciar() {
  const movil = matchMedia('(max-width: 640px)').matches;
  const lienzo = document.createElement('canvas');
  lienzo.setAttribute('aria-hidden', 'true');
  caja.appendChild(lienzo);
  const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(movil ? 52 : 34, 1, 0.1, 50);

  const fotos = ['chupitos', 'tartar', 'bao', 'caprese', 'brochetas', 'wraps', 'burger-negra', 'brownies', 'zumos', 'rollitos', 'vasitos', 'hojaldres', 'galletas', 'postre-oreo'];
  const W = 1, H = 1.333, G = 0.07, N = fotos.length, L = N * (W + G), R = movil ? 2.2 : 3.1;
  const geo = new THREE.PlaneGeometry(W, H, 20, 20);
  const comunes = { uOff: { value: 0 }, uVel: { value: 0 }, uT: { value: 0 }, uL: { value: L }, uR: { value: R } };
  const vs = `
    uniform float uOff, uVel, uT, uL, uR; uniform float uC;
    varying vec2 vUv; varying float vLado;
    void main(){
      vUv = uv;
      float c = mod(uC + uOff + uL*0.5, uL) - uL*0.5;
      float giro = uVel * 0.9 + sin(c * 0.7 + uT * 0.8) * 0.18;
      float lx = position.x * cos(giro);
      float lz = position.x * sin(giro);
      float x = c + lx;
      float y = position.y + sin(x*1.4 + uT*1.3) * 0.05 + sin(x*0.9 - uT) * uVel * 0.35;
      float a = x / uR;
      vec3 p = vec3(sin(a)*(uR + lz), y, (1.0 - cos(a))*uR - lz*cos(a));
      p.y += (uv.x - 0.5) * uVel * 0.25;
      vLado = clamp(abs(a)/1.4, 0.0, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }`;
  const fs = `
    uniform sampler2D uTex; uniform float uListo; uniform float uImgAsp;
    varying vec2 vUv; varying float vLado;
    void main(){
      float tileAsp = ${(W / H).toFixed(4)};
      vec2 uv = vUv;
      if (uImgAsp > tileAsp) { uv.x = (uv.x - 0.5) * tileAsp / uImgAsp + 0.5; } else { uv.y = (uv.y - 0.5) * uImgAsp / tileAsp + 0.5; }
      vec3 c = texture2D(uTex, uv).rgb;
      c *= 1.0 - vLado * 0.45;
      vec3 rojo = vec3(0.69, 0.157, 0.11);
      c = mix(c, rojo, (1.0 - uListo));
      gl_FragColor = vec4(c, 1.0);
      #include <colorspace_fragment>
    }`;
  const loader = new THREE.TextureLoader();
  const mallas = fotos.map((n, i) => {
    const mat = new THREE.ShaderMaterial({ vertexShader: vs, fragmentShader: fs,
      uniforms: { ...comunes, uC: { value: i * (W + G) - L / 2 }, uTex: { value: null }, uListo: { value: 0 }, uImgAsp: { value: 0.75 } } });
    const m = new THREE.Mesh(geo, mat); m.frustumCulled = false; scene.add(m);
    loader.load(`img/${n}-640.webp`, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; mat.uniforms.uTex.value = t; mat.uniforms.uImgAsp.value = t.image.width / t.image.height; mat.uniforms.uListo.value = 1; });
    return m;
  });

  function medir() { const w = caja.clientWidth, h = caja.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  caja.classList.add('gl'); medir(); new ResizeObserver(medir).observe(caja);
  cam.position.set(0, movil ? 0.25 : 0.45, movil ? 3.2 : 4.2); cam.lookAt(0, 0.1, 0);
  scene.rotation.z = -0.07;

  let off = 0, vel = 0, ultY = scrollY, arrastre = null, visible = true, t0 = performance.now(), prev = t0;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(caja);
  caja.addEventListener('pointerdown', (e) => { arrastre = e.clientX; caja.setPointerCapture(e.pointerId); });
  caja.addEventListener('pointermove', (e) => { if (arrastre === null) return; const dx = (e.clientX - arrastre) / caja.clientWidth; arrastre = e.clientX; off += dx * (movil ? 3 : 5); vel = Math.max(-1.2, Math.min(1.2, vel + dx * 6)); });
  const soltar = () => { arrastre = null; };
  caja.addEventListener('pointerup', soltar); caja.addEventListener('pointercancel', soltar);

  function cuadro(now) {
    requestAnimationFrame(cuadro);
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    const dy = scrollY - ultY; ultY = scrollY;
    vel += (dy * 0.004 - vel) * 0.08;
    vel = Math.max(-1.2, Math.min(1.2, vel));
    off -= (0.22 + Math.abs(vel) * 2.2) * dt * (vel < -0.05 ? -1 : 1);
    if (!visible || document.hidden) return;
    comunes.uOff.value = off; comunes.uVel.value = vel; comunes.uT.value = (now - t0) / 1000;
    cam.rotation.z = vel * 0.04;
    renderer.render(scene, cam);
  }
  requestAnimationFrame(cuadro);
}
