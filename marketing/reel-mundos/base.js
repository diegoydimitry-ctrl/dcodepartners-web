// Base común de las escenas: render, postproceso, cargadores y captura con desenfoque de movimiento por acumulación.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const Q = new URLSearchParams(location.search), CAPTURA = Q.has('captura'), FPS = 30;
const W = CAPTURA ? 1080 : innerWidth, H = CAPTURA ? 1920 : innerHeight;
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(CAPTURA ? +(Q.get('esc') ?? 1) : Math.min(devicePixelRatio, 2)); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, W / H, 0.05, 2000);
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: +(Q.get('msaa') ?? 4) });
const composer = new EffectComposer(renderer, rt); composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(W, H);
composer.addPass(new RenderPass(scene, cam));
const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.25, 0.6, 1.0); composer.addPass(bloom); composer.addPass(new OutputPass());

import { clamp, lerp } from './util.js';
const pmrem = new THREE.PMREMGenerator(renderer);
const ctx = { THREE, Q, W, H, renderer, scene, cam, composer, bloom, pmrem, CAPTURA,
  gltf: (f) => new GLTFLoader().loadAsync('assets/' + f),
  hdr: async (f) => { const t = await new RGBELoader().loadAsync('assets/' + f); t.mapping = THREE.EquirectangularReflectionMapping; return t; },
  fondo: (c0, c1, cx = 0.5, cy = 0.45, r = 0.75) => { const c = document.createElement('canvas'); c.width = 270; c.height = 480; const x = c.getContext('2d'), g = x.createRadialGradient(270 * cx, 480 * cy, 0, 270 * cx, 480 * cy, 480 * r);
    g.addColorStop(0, c0); g.addColorStop(1, c1); x.fillStyle = g; x.fillRect(0, 0, 270, 480); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; },
  variantes: async (g) => { const nombres = (g.userData.gltfExtensions?.KHR_materials_variants?.variants || []).map((v) => v.name), mallas = [], tareas = [];
    g.scene.traverse((o) => { const map = o.isMesh && o.userData.gltfExtensions?.KHR_materials_variants?.mappings; if (!map) return; o.userData.var = []; mallas.push(o);
      for (const m of map) for (const v of m.variants) tareas.push(g.parser.getDependency('material', m.material).then((mat) => { o.userData.var[v] = mat; })); });
    await Promise.all(tareas); return (nombre) => { const i = nombres.indexOf(nombre); for (const o of mallas) if (o.userData.var[i]) { o.material = o.userData.var[i]; g.parser.assignFinalMaterial(o); } }; },
};
const E = (await import(`./escenas/${Q.get('e') || 'reloj'}.js`)).default, esc = await E(ctx);
const SUB = +(Q.get('sub') ?? esc.sub ?? 1), OBT = esc.obturador ?? 0.5;      // subfotogramas y fracción de obturador
const acc = document.getElementById('acc'), a2 = acc.getContext('2d'); acc.width = canvas.width; acc.height = canvas.height;
function pinta(t) { esc.frame(t); (esc.render || (() => composer.render()))(t); }
function pintaMB(t) { if (SUB <= 1) return pinta(t);
  for (let k = 0; k < SUB; k++) { pinta(t + (k / SUB - 0.5) * OBT / FPS); a2.globalAlpha = 1 / (k + 1); a2.drawImage(canvas, 0, 0); } }
window.META = { fps: FPS, duracion: esc.dur, fotogramas: Math.round(esc.dur * FPS) };
if (CAPTURA) { if (SUB > 1) { acc.style.display = 'block'; canvas.style.visibility = 'hidden'; }
  window.pintaFrame = (n) => { pintaMB(n / FPS); renderer.getContext().finish(); return true; }; pintaMB(0); }
else { const t0 = performance.now(); const bucle = () => { pinta(((performance.now() - t0) / 1000) % esc.dur); requestAnimationFrame(bucle); }; bucle(); }
window.LISTO = true;
