// La Quinta · «El paseo»: recorrido 3D entre fotos reales del lugar, de la tarde a la noche.
// La cámara avanza con el scroll por un pasillo de fotografías; la niebla pasa de bruma a noche
// y aparecen luciérnagas cálidas. Si no hay WebGL o se pide menos movimiento, se queda la versión estática.
import * as THREE from '../lib/three.module.min.js';

const escena = document.getElementById('inicio');
const lienzo = document.getElementById('paseo');
const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;

function hayWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

if (escena && lienzo && !reducir && hayWebGL()) iniciar();

function iniciar() {
  const movil = matchMedia('(max-width: 640px)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, movil ? 1.6 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(movil ? 62 : 50, 1, 0.1, 80);

  const DIA = new THREE.Color('#E7E8DE'), TARDE = new THREE.Color('#C9B79C'), NOCHE = new THREE.Color('#17131C');
  const niebla = new THREE.Color().copy(DIA);

  // fotos en orden de la tarde a la noche
  const fotos = [
    ['jardin', 1.333], ['coctel-jardin', 0.667], ['huerta', 1.91], ['carpa', 0.667], ['mesa-larga', 0.667],
    ['emplatado', 1.333], ['salon', 1.53], ['rincon', 0.8], ['atardecer', 1], ['mesa-cesped', 1.5],
    ['pergola', 1.5], ['velas-mesa', 1.5], ['velas', 1.5], ['noche', 1], ['noche-jardin', 1.5], ['abedules', 1.5]
  ];
  const ancho = (n) => n === 'abedules' ? 637 : (movil ? 640 : ({ jardin: 1280, 'coctel-jardin': 1280, carpa: 1280, 'mesa-larga': 1280, emplatado: 1280, salon: 1280, huerta: 1280, atardecer: 1200, noche: 1080, rincon: 1080 }[n] || 640));
  const D = movil ? 5.2 : 5.6, N = fotos.length, FIN = -(N - 1) * D + (movil ? 4.6 : 4.2);

  const vs = `
    varying vec2 vUv; varying float vDist; uniform float uOnda; uniform float uT;
    void main(){
      vUv = uv;
      vec3 p = position;
      p.z += sin(uv.x * 3.14159) * uOnda * 0.35 + sin(uv.y * 6.0 + uT) * uOnda * 0.04;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      vDist = -mv.z;
      gl_Position = projectionMatrix * mv;
    }`;
  const fs = `
    uniform sampler2D uTex; uniform vec3 uNiebla; uniform float uListo; uniform float uAspect; uniform float uNoche;
    varying vec2 vUv; varying float vDist;
    void main(){
      vec2 q = abs(vUv - 0.5) * 2.0;
      vec2 r = vec2(0.035 / uAspect, 0.035);
      vec2 d = max(q - (1.0 - r), 0.0) / r;
      if (length(d) > 1.0) discard;
      vec3 c = texture2D(uTex, vUv).rgb;
      c = mix(c, c * vec3(1.02, 0.93, 0.82), uNoche * 0.35);
      float lejos = smoothstep(9.0, 34.0, vDist);
      float cerca = smoothstep(0.4, 2.6, vDist);
      c = mix(c, uNiebla, lejos * 0.92);
      gl_FragColor = vec4(c, cerca * uListo);
      #include <colorspace_fragment>
    }`;

  const loader = new THREE.TextureLoader();
  const planos = [];
  fotos.forEach(([n, asp], i) => {
    const lado = i % 2 ? 1 : -1;
    const h = movil ? 2.3 : 2.7, w = Math.min(h * asp, movil ? 3.0 : 4.6), hh = w / asp;
    const geo = new THREE.PlaneGeometry(w, hh, 24, 8);
    const mat = new THREE.ShaderMaterial({
      vertexShader: vs, fragmentShader: fs, transparent: true, depthWrite: false,
      uniforms: { uTex: { value: null }, uNiebla: { value: niebla }, uListo: { value: 0 }, uAspect: { value: asp }, uOnda: { value: 0 }, uT: { value: 0 }, uNoche: { value: 0 } }
    });
    const m = new THREE.Mesh(geo, mat);
    const ultimo = i === N - 1;
    const x = ultimo ? 0 : lado * (movil ? 1.05 + (i % 3) * 0.12 : 2.0 + ((i * 37) % 5) * 0.18);
    m.position.set(x, ultimo ? 0.55 : (((i * 53) % 7) - 3) * (movil ? 0.07 : 0.12) + 0.45, -i * D);
    m.rotation.y = ultimo ? 0 : -lado * (movil ? 0.42 : 0.32);
    if (ultimo) m.scale.setScalar(movil ? 0.95 : 1.15);
    m.renderOrder = N - i;
    scene.add(m);
    planos.push(m);
    loader.load(`img/${n}-${ancho(n)}.webp`, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; mat.uniforms.uTex.value = t; mat.uniforms.uListo.value = 1; });
  });

  // luciérnagas: polvo dorado de día, luz de vela de noche
  const NP = movil ? 320 : 700, pos = new Float32Array(NP * 3), fase = new Float32Array(NP);
  for (let i = 0; i < NP; i++) {
    pos[i * 3] = (Math.random() - 0.5) * (movil ? 6 : 10);
    pos[i * 3 + 1] = (Math.random() - 0.35) * 4;
    pos[i * 3 + 2] = 4 - Math.random() * (N * D + 12);
    fase[i] = Math.random() * 6.28;
  }
  const gp = new THREE.BufferGeometry();
  gp.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  gp.setAttribute('aFase', new THREE.BufferAttribute(fase, 1));
  const mp = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uT: { value: 0 }, uNoche: { value: 0 }, uPx: { value: renderer.getPixelRatio() } },
    vertexShader: `attribute float aFase; uniform float uT; uniform float uPx; varying float vB;
      void main(){ vec3 p = position; p.y += sin(uT*0.6 + aFase)*0.25; p.x += cos(uT*0.4 + aFase*1.3)*0.2;
        vec4 mv = modelViewMatrix * vec4(p,1.0); gl_Position = projectionMatrix * mv;
        vB = 0.55 + 0.45*sin(uT*2.2 + aFase*3.0);
        gl_PointSize = (44.0 * uPx) / max(1.0, -mv.z); }`,
    fragmentShader: `uniform float uNoche; varying float vB;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d);
        vec3 c = mix(vec3(1.0,0.96,0.85), vec3(1.0,0.72,0.32), uNoche);
        gl_FragColor = vec4(c * a * a * vB * (0.05 + uNoche*1.6), 1.0); }`
  });
  scene.add(new THREE.Points(gp, mp));

  // tamaño
  function medir() {
    const w = lienzo.clientWidth, h = lienzo.clientHeight;
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
  }
  escena.classList.add('gl');
  medir(); addEventListener('resize', medir); new ResizeObserver(medir).observe(lienzo);

  // entrada: ratón / inclinación
  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener('pointermove', (e) => { tx = (e.clientX / innerWidth - 0.5); ty = (e.clientY / innerHeight - 0.5); }, { passive: true });

  const ease = (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  let p = 0, pSuave = 0, visible = true, t0 = performance.now();
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(escena);

  function cuadro(now) {
    requestAnimationFrame(cuadro);
    if (!visible || document.hidden) return;
    const t = (now - t0) / 1000;
    const r = escena.getBoundingClientRect(), total = escena.offsetHeight - innerHeight;
    p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    pSuave += (p - pSuave) * 0.08;
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;

    const z = 4 + (FIN - 4) * ease(pSuave);
    cam.position.set(Math.sin(pSuave * 9) * 0.25 + mx * 0.6, 0.15 - my * 0.3 + Math.sin(t * 0.5) * 0.03, z);
    cam.lookAt(mx * 0.4 + Math.sin(pSuave * 9 + 0.6) * 0.3 * (1 - ss(0.85, 1, pSuave)), movil ? -1.05 : 0.32, z - 6);

    const noche = ss(0.5, 0.88, pSuave), tarde = ss(0.25, 0.55, pSuave);
    niebla.copy(DIA).lerp(TARDE, tarde * (1 - noche)).lerp(NOCHE, noche);
    renderer.setClearColor(niebla);
    const luz = noche > 0.42 ? 'noche' : 'dia'; if (escena.dataset.luz !== luz) { escena.dataset.luz = luz; document.body.classList.toggle('heroclaro', luz === 'dia' && p < 0.995); }
    if (p >= 0.995) document.body.classList.remove('heroclaro');
    mp.uniforms.uT.value = t; mp.uniforms.uNoche.value = noche;
    for (const m of planos) {
      const u = m.material.uniforms, dz = m.position.z - z;
      u.uT.value = t; u.uNoche.value = noche;
      u.uOnda.value = Math.max(0, 1 - Math.abs(dz + 3) / 5) * 0.6;
    }
    renderer.render(scene, cam);
  }
  requestAnimationFrame(cuadro);
}
