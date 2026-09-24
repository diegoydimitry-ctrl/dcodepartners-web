#!/usr/bin/env node
/*
 * EL MODO CLARO, DERIVADO DEL OSCURO — NO INVERTIDO
 * ---------------------------------------------------------------------------
 * La web se diseñó en oscuro y tiene cerca de 1.300 colores escritos a mano
 * repartidos por siete hojas. Un modo claro hecho a mano, regla a regla, se
 * quedaría atrás en cuanto alguien tocara una de ellas. Así que se DERIVA:
 * este script lee cada hoja, encuentra cada declaración con color y escribe
 * su versión clara en assets/css/tema-claro.css, dentro de
 * html[data-theme="light"] y en la misma @media que la original.
 *
 * No es invertir. Cada color se traduce según el PAPEL que cumple:
 *   · texto     claro sobre oscuro → tinta oscura con un punto de azul; los
 *               acentos conservan su tono y bajan a una luminosidad que se lee
 *               sobre blanco (≥ 4,5:1)
 *   · fondos    oscuros → superficies claras, y la elevación se conserva: lo
 *               que en oscuro estaba "más arriba" (más claro) sigue más arriba
 *               (más blanco); los velos oscuros bajo el texto pasan a velos
 *               claros, así que siguen protegiendo la lectura
 *   · bordes    los filos claros y translúcidos pasan a filos oscuros suaves
 *   · sombras   las negras se aligeran y se tiñen de azul marino; los halos
 *               de color se quedan, más suaves
 *   · text-shadow  fuera: en oscuro dan contraste, en claro ensucian
 * Los tokens (:root) y las piezas con identidad propia se ajustan a mano en
 * assets/css/tema.css, que va después y manda.
 *
 * Uso: node scripts/build-tema-claro.mjs   (volver a ejecutarlo tras tocar
 * cualquiera de las hojas de ORIGENES; check:tema falla si se olvida).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ORIGENES = ['styles.css', 'dcp5.css', 'dcp6.css', 'dcp7.css', 'dcp8.css', 'dcp10.css'];
const DESTINO = path.join(RAIZ, 'assets/css/tema-claro.css');
const PRE = 'html[data-theme="light"]';

/* ------------------------------------------------------------ color math */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const s2l = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const l2s = (c) => { const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; return clamp(Math.round(v * 255), 0, 255); };
function rgb2oklch([r, g, b]) {
  r = s2l(r); g = s2l(g); b = s2l(b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  return [L, Math.hypot(A, B), (Math.atan2(B, A) * 180 / Math.PI + 360) % 360];
}
function oklch2rgbRaw(L, C, h) {
  const A = C * Math.cos(h * Math.PI / 180), B = C * Math.sin(h * Math.PI / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
          -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
          -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
}
function oklch2rgb(L, C, h) {
  // reduce el croma hasta que quepa en sRGB
  let c = C;
  for (let i = 0; i < 40; i++) { const v = oklch2rgbRaw(L, c, h); if (v.every((x) => x >= -0.0005 && x <= 1.0005)) break; c *= 0.93; }
  return oklch2rgbRaw(L, c, h).map(l2s);
}
const lum = ([r, g, b]) => 0.2126 * s2l(r) + 0.7152 * s2l(g) + 0.0722 * s2l(b);

/* ----------------------------------------------------------- parse color */
const NOMBRES = { white: [255, 255, 255, 1], black: [0, 0, 0, 1] };
const RE_COLOR = /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{4}\b|#[0-9a-fA-F]{3}\b|rgba?\(\s*[\d.]+%?\s*[, ]\s*[\d.]+%?\s*[, ]\s*[\d.]+%?\s*(?:[,/]\s*[\d.]+%?\s*)?\)|\b(?:white|black)\b/g;
function parse(txt) {
  if (NOMBRES[txt]) return NOMBRES[txt].slice();
  if (txt[0] === '#') {
    let h = txt.slice(1);
    if (h.length <= 4) h = h.split('').map((x) => x + x).join('');
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  const p = txt.replace(/rgba?\(|\)/g, '').split(/[\s,/]+/).filter(Boolean).map((x) => x.endsWith('%') ? parseFloat(x) * (x === p3 ? 1 : 2.55) : parseFloat(x));
  var p3;
  if (p.length === 4 && /%\s*\)$/.test(txt)) p[3] = p[3] / 255; // alfa en %
  return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
}
function fmt([r, g, b, a]) {
  a = Math.round(a * 1000) / 1000;
  if (a >= 1) return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `rgba(${r},${g},${b},${a})`;
}

/* ------------------------------------------------------- mapas por papel */
const TINTA_H = 262;
function mapTexto(c) {
  const [r, g, b, a] = c; if (a === 0) return c;
  const [L, C, h] = rgb2oklch([r, g, b]);
  if (L < 0.52) return c;                              // ya es oscuro: va sobre algo claro
  if (C < 0.05) return [...oklch2rgb(clamp(1.10 - L, 0.17, 0.46), 0.025, TINTA_H), a];
  return [...oklch2rgb(0.47, Math.min(C, 0.2), h), a];  // acento legible sobre blanco
}
function superficie(L, C, h, a) {
  const L2 = clamp(0.955 + (L - 0.10) * 0.25, 0.945, 0.996);
  return [...oklch2rgb(L2, C < 0.06 ? 0.008 : Math.min(C * 0.25, 0.02), C < 0.06 ? TINTA_H : h), a];
}
function mapFondo(c) {
  const [r, g, b, a] = c; if (a === 0) return c;
  const [L, C, h] = rgb2oklch([r, g, b]);
  if (L < 0.45 && C < 0.12) return superficie(L, C, h, a);
  if (C < 0.06 && L >= 0.45 && a <= 0.35) return [22, 32, 70, Math.round(a * 0.85 * 1000) / 1000];
  return c;
}
function mapBorde(c) {
  const [r, g, b, a] = c; if (a === 0) return c;
  const [L, C, h] = rgb2oklch([r, g, b]);
  if (L < 0.45) return [...oklch2rgb(clamp(0.93 - L * 0.2, 0.84, 0.92), 0.012, TINTA_H), a];
  if (a < 0.6) return [...oklch2rgb(0.36, Math.min(C, 0.07), C < 0.03 ? TINTA_H : h), clamp(a * 1.1 + 0.02, 0.08, 0.3)];
  if (C < 0.06) return [...oklch2rgb(clamp(1.35 - L, 0.55, 0.85), 0.015, TINTA_H), a];
  return c;
}
function mapSombra(c) {
  const [r, g, b, a] = c; if (a === 0) return c;
  const [L, C] = rgb2oklch([r, g, b]);
  if (L < 0.35) return [20, 30, 64, Math.round(a * 0.3 * 1000) / 1000];
  if (C >= 0.06) return [r, g, b, Math.round(a * 0.55 * 1000) / 1000];
  return c;
}
function mapGrafico(c) {             // fill / stroke de SVG decorativo
  const [r, g, b, a] = c; if (a === 0) return c;
  const [L, C, h] = rgb2oklch([r, g, b]);
  if (L < 0.45 && C < 0.12) return superficie(L, C, h, a);
  if (C < 0.05) return [...oklch2rgb(clamp(1.10 - L, 0.2, 0.5), 0.025, TINTA_H), a];
  if (L > 0.72) return [...oklch2rgb(0.56, C, h), a];
  return c;
}

/* ------------------------------------------------ clasificar propiedades */
const TEXTO = new Set(['color', '-webkit-text-fill-color', 'caret-color', 'text-decoration-color', 'column-rule-color']);
const FONDO = new Set(['background', 'background-color', 'background-image']);
const BORDE = /^(border(-top|-right|-bottom|-left|-block|-inline)?(-start|-end)?(-color)?|outline(-color)?)$/;
const IGNORAR = /^(mask|-webkit-mask|mask-image|-webkit-mask-image|transition|animation|content|font|will-change)/;
function papelVar(nombre) {
  if (/(ink|text|txt|tinta|letra|fg|-t[0-9]?$|label)/.test(nombre)) return mapTexto;
  if (/(line|edge|border|borde|linea|filo|ring)/.test(nombre)) return mapBorde;
  if (/(shadow|sombra|glow|halo|resplandor)/.test(nombre)) return mapSombra;
  return mapFondo;
}
function mapear(prop, valor) {
  if (IGNORAR.test(prop)) return null;
  if (prop === 'text-shadow') return /none/.test(valor) ? null : 'none';
  let fn;
  if (TEXTO.has(prop)) fn = mapTexto;
  else if (FONDO.has(prop)) fn = mapFondo;
  else if (BORDE.test(prop)) fn = mapBorde;
  else if (prop === 'box-shadow') {
    // las luces interiores claras (biseles) se quedan; el resto, sombra
    return reemplazar(valor, (c, ctx) => (/inset/.test(ctx) && rgb2oklch(c)[0] > 0.6) ? c : mapSombra(c), true);
  }
  else if (prop === 'filter' || prop === '-webkit-filter') fn = mapSombra;
  else if (prop === 'fill' || prop === 'stroke' || prop === 'stop-color') fn = mapGrafico;
  else if (prop.startsWith('--')) fn = papelVar(prop);
  else return null;
  return reemplazar(valor, fn);
}
function reemplazar(valor, fn, conContexto) {
  let cambio = false;
  // contexto por capa de sombra (separadas por comas de primer nivel)
  const out = valor.replace(RE_COLOR, (m, off) => {
    if (/var\(/.test(m)) return m;
    const c = parse(m);
    let ctx = '';
    if (conContexto) { const ini = valor.lastIndexOf(',', off) + 1; const fin = valor.indexOf(',', off + m.length); ctx = valor.slice(ini, fin < 0 ? undefined : fin); }
    const n = fn(c, ctx);
    const s = fmt(n.map((x, i) => i < 3 ? Math.round(x) : x));
    if (s.toLowerCase() !== fmt(c).toLowerCase()) cambio = true;
    return cambio ? s : m;
  });
  return cambio ? out : null;
}

/* ------------------------------------------------------------ CSS parser */
function sinComentarios(css) { return css.replace(/\/\*[\s\S]*?\*\//g, ''); }
function bloques(css) {
  // devuelve [{sel, cuerpo}] de primer nivel, con cuerpo sin llaves exteriores
  const out = []; let i = 0, n = css.length;
  while (i < n) {
    const a = css.indexOf('{', i); if (a < 0) break;
    const semi = css.indexOf(';', i);
    if (semi >= 0 && semi < a && /^\s*@(import|charset|namespace)/.test(css.slice(i, semi))) { i = semi + 1; continue; }
    let prof = 1, j = a + 1;
    while (j < n && prof) { const ch = css[j]; if (ch === '{') prof++; else if (ch === '}') prof--; else if (ch === '"' || ch === "'") { const q = ch; j++; while (j < n && css[j] !== q) { if (css[j] === '\\') j++; j++; } } j++; }
    out.push({ sel: css.slice(i, a).trim(), cuerpo: css.slice(a + 1, j - 1) });
    i = j;
  }
  return out;
}
function declaraciones(cuerpo) {
  const out = []; let prof = 0, ini = 0, q = null;
  for (let k = 0; k <= cuerpo.length; k++) {
    const ch = cuerpo[k];
    if (q) { if (ch === q && cuerpo[k - 1] !== '\\') q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; continue; }
    if (ch === '(') prof++; else if (ch === ')') prof--;
    else if ((ch === ';' || k === cuerpo.length) && prof === 0) {
      const d = cuerpo.slice(ini, k).trim(); ini = k + 1;
      const p = d.indexOf(':'); if (p > 0) out.push({ prop: d.slice(0, p).trim().toLowerCase(), valor: d.slice(p + 1).trim() });
    }
  }
  return out;
}
function prefijar(sel) {
  return sel.split(/,(?![^(]*\))/).map((s) => {
    s = s.trim();
    if (!s || /view-transition/.test(s) || s.includes('*/') || /[—]/.test(s)) return null;
    if (/^:root\b/.test(s) || /^html$/.test(s)) return null;          // tokens: a mano
    if (/^html\b/.test(s)) return s.replace(/^html/, PRE);
    if (/^:root/.test(s)) return s.replace(/^:root/, ':root[data-theme="light"]');
    return `${PRE} ${s}`;
  }).filter(Boolean).join(',\n');
}
const stats = { reglas: 0, decl: 0 };
function procesar(css, sangria = '') {
  let out = '';
  for (const b of bloques(css)) {
    if (/^@(media|supports|container|layer)/.test(b.sel)) {
      const dentro = procesar(b.cuerpo, sangria + '  ');
      if (dentro.trim()) out += `${sangria}${b.sel}{\n${dentro}${sangria}}\n`;
      continue;
    }
    if (b.sel.startsWith('@')) continue;                                   // keyframes, font-face, property
    const sel = prefijar(b.sel); if (!sel) continue;
    const nuevas = [];
    for (const d of declaraciones(b.cuerpo)) {
      const imp = /!important\s*$/.test(d.valor);
      const v = d.valor.replace(/\s*!important\s*$/, '');
      const m = mapear(d.prop, v);
      if (m) nuevas.push(`${d.prop}:${m}${imp ? ' !important' : ''}`);
    }
    if (nuevas.length) { stats.reglas++; stats.decl += nuevas.length; out += `${sangria}${sel.replace(/\n/g, '\n' + sangria)}{ ${nuevas.join('; ')}; }\n`; }
  }
  return out;
}

let salida = `/* ============================================================================
   MODO CLARO DERIVADO — GENERADO por scripts/build-tema-claro.mjs.
   No editar a mano: lo que haya que afinar va en assets/css/tema.css.
   Origen: ${ORIGENES.join(', ')}
   ========================================================================= */
`;
for (const f of ORIGENES) {
  const css = sinComentarios(fs.readFileSync(path.join(RAIZ, 'assets/css', f), 'utf8'));
  salida += `\n/* ---- ${f} ---- */\n` + procesar(css);
}

/* ============================================================================
   SUPERFICIES — el fondo y las cajas llevan paletas CONTRARIAS.
   Oscuro: espacio oscuro + módulos claros. Claro: espacio claro + módulos
   oscuros. Se genera aquí porque reutiliza el mismo mapeo de colores:
   · en oscuro, dentro de una caja, las reglas de la web se traducen como en
     el modo claro (texto oscuro sobre blanco roto);
   · en claro, dentro de una caja, se restauran los valores originales (los
     del diseño oscuro).
   Las demos (.sd, D-Code Finance) y D-Code OS ya funcionan con variables: a
   sus cajas se les da la paleta del otro tema.
   ========================================================================= */
const DESTINO_SUP = path.join(RAIZ, 'assets/css/superficies.css');
const CAJAS = ['.rcard', '.arq-area', 'a.area', '.conexion', '.gal-tab', '.gal-historia > li', '.arq-mod', '.arq-btn', '.board',
  'details.plan', '.window', '.chaos-order', '.vf-cadena', '.vf-col', '.vf-sello', '.conc-fig', '.cmp',
  '.mega-menu', '.gal-carga', '.gal-sig-b', '.dx', '.btn-ghost', '.v7-fiscal-i', '.vf-track', '.v6-of', '.gal-movil'];
// Piezas que cuelgan de una caja pero se pintan fuera de ella, sobre el fondo
const FUERA = /\.arq-area-p\b/;
const APPS = [
  // la demo ENTERA lleva la paleta contraria al fondo de la página
  { sup: '--sd-s', cajas: ['.sd'], hoja: 'demo-sistemas.css', dia: '.sd', noche: 'html[data-theme="dark"] .sd', color: 'var(--sd-t)' },
  { sup: '--dc-surface', cajas: ['.fdemo-scope'], hoja: 'finance-demo.css', dia: '.fdemo-scope', noche: 'html[data-theme="dark"] .fdemo-scope', color: 'var(--dc-text)' },
  { sup: '--os-s', cajas: ['.os-app', '.oss', '.os-capa'], hoja: 'dcode-os.css', dia: 'html[data-theme="light"] .os', noche: '.os', color: 'var(--os-t1)' },
];
function vars(css, selector) {
  const out = new Map();
  for (const b of bloques(sinComentarios(css))) if (b.sel.split(',').map((x) => x.trim()).includes(selector))
    for (const d of declaraciones(b.cuerpo)) if (d.prop.startsWith('--')) out.set(d.prop, d.valor);
  return out;
}
const decl = (m) => [...m].map(([k, v]) => `${k}:${v}`).join('; ');
// En una caja que lleva la paleta contraria, los tintes translúcidos (…-bg)
// no pueden transparentar el fondo del otro tema: se vuelven opacos,
// mezclados sobre la superficie de su propia paleta.
function opacos(m, superficie) {
  const base = m.get(superficie); if (!base) return m;
  return new Map([...m].map(([k, v]) => {
    const r = /bg$/.test(k) && v.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
    return [k, r ? `color-mix(in srgb, rgb(${r[1]},${r[2]},${r[3]}) ${Math.round(+r[4] * 100)}%, ${base})` : v];
  }));
}
/* CONFORT: ni blanco de folio en una pantalla oscura, ni negro de tinta en
   una clara. Las superficies que llegan al extremo se acercan un paso al
   centro; el texto no se toca, así que el contraste sigue donde estaba. */
function aColor(v) {
  const t = v.trim();
  let m = t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) { const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1]; }
  m = t.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*([\d.]+)\s*)?\)$/i);
  if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  return null;
}
const lumS = (c) => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
const hacia = (c, d, k) => [0, 1, 2].map((i) => Math.round(c[i] + (d[i] - c[i]) * k)).concat(c[3]);
const cssColor = (c) => (c[3] === 1 ? `rgb(${c[0]},${c[1]},${c[2]})` : `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`);
function suaviza(m, cual) {
  return new Map([...m].map(([k, v]) => {
    const c = aColor(v); if (!c || c[3] < 0.9) return [k, v];
    const L = lumS(c);
    if (cual === 'dark' && L > 0.88) return [k, cssColor(hacia(c, [222, 229, 243], Math.min(1, (L - 0.88) * 5.2)))];
    if (cual === 'light' && L < 0.10) return [k, cssColor(hacia(c, [28, 36, 62], Math.min(1, (0.10 - L) * 7)))];
    return [k, v];
  }));
}
const IS = `:is(${CAJAS.join(', ')})`;
function sinRaiz(s) { return s.replace(/^((html|body)(\.[\w-]+|\[[^\]]+\])*|\.v[0-9]+)\s+/, ''); }
function escopar(sel) {
  // relativo a la caja (CSS anidado): «& s» = dentro de la caja; «&:is(s)» = la propia caja
  return sel.split(/,(?![^(]*\))/).map((s) => {
    s = s.trim();
    if (!s || /view-transition/.test(s) || s.includes('*/') || /[—]/.test(s) || /^:root\b/.test(s) || /^html$/.test(s) || /^body$/.test(s)) return null;
    if (/^(html|body)\b/.test(s) && !/\s/.test(s)) return null;
    // lo que se dibuja FUERA de la caja (sobre el fondo de la página) conserva su tema
    if (FUERA.test(s)) return null;
    // «& :is(s)»: un descendiente de la caja que cumple s en la página entera
    // (sus antepasados pueden estar fuera de la caja); «&:is(s)»: la propia caja
    const m = s.match(/(::?(before|after|placeholder|marker|selection|first-line|first-letter|-webkit-[\w-]+))+$/);
    const base = m ? s.slice(0, m.index) : s, pseudo = m ? m[0] : '';
    if (!base) return `& ${pseudo}`;
    return `& :is(${base})${pseudo}, &:is(${base})${pseudo}`;
  }).filter(Boolean).join(', ');
}
const statsS = { reglas: 0 };
function procesarSup(css, cual, sangria = '  ') {
  let out = '';
  for (const b of bloques(css)) {
    if (/^@(media|supports|container|layer)/.test(b.sel)) {
      const dentro = procesarSup(b.cuerpo, cual, sangria + '  ');
      if (dentro.trim()) out += `${sangria}${b.sel}{\n${dentro}${sangria}}\n`;
      continue;
    }
    if (b.sel.startsWith('@')) continue;
    const decl = [];
    for (const d of declaraciones(b.cuerpo)) {
      if (d.prop.startsWith('--')) continue;
      const imp = /!important\s*$/.test(d.valor);
      const v = d.valor.replace(/\s*!important\s*$/, '');
      const m = mapear(d.prop, v);
      if (m) decl.push(`${d.prop}:${cual === 'dark' ? m : v}${imp ? ' !important' : ''}`);
    }
    if (!decl.length) continue;
    const sel = escopar(b.sel); if (!sel) continue;
    if (cual === 'dark') statsS.reglas++;
    out += `${sangria}${sel}{ ${decl.join('; ')}; }\n`;
  }
  return out;
}
// variables de la web: las del claro (tema.css) y sus valores originales
const temaCss = fs.readFileSync(path.join(RAIZ, 'assets/css/tema.css'), 'utf8');
const claroVars = new Map([...vars(temaCss, 'html[data-theme="light"]')].filter(([k]) => !k.startsWith('--gx-')));
const oscuroVars = new Map();
for (const f of ORIGENES) { const m = vars(fs.readFileSync(path.join(RAIZ, 'assets/css', f), 'utf8'), ':root'); for (const [k, v] of m) if (claroVars.has(k)) oscuroVars.set(k, v); }
let sup = `/* ============================================================================
   SUPERFICIES — GENERADO por scripts/build-tema-claro.mjs. No editar a mano.
   Oscuro: fondo oscuro + cajas claras. Claro: fondo claro + cajas oscuras.
   ========================================================================= */
/* Las cajas de la web */
html[data-theme="dark"] ${IS}{ ${decl(suaviza(claroVars, 'dark'))}; color:#121a2c; background-color:#e9eef8 !important; background-image:linear-gradient(180deg, #f3f6fd 0%, #e9eef8 55%, #dfe6f4 100%) !important; border-color:rgba(160,184,255,.55); box-shadow:inset 0 1px 0 #fff, 0 0 0 1px rgba(120,150,255,.18), 0 18px 44px -26px rgba(91,140,255,.55), 0 2px 10px -4px rgba(0,0,0,.45); }
html[data-theme="light"] ${IS}{ ${decl(suaviza(oscuroVars, 'light'))}; color:#e9eefb; background-color:#141c35 !important; background-image:linear-gradient(180deg, #1d2749 0%, #151d38 50%, #10162c 100%) !important; border-color:rgba(110,140,240,.32); box-shadow:inset 0 1px 0 rgba(255,255,255,.07), 0 0 0 1px rgba(20,34,110,.12), 0 20px 44px -26px rgba(20,34,110,.6), 0 2px 8px -4px rgba(20,30,64,.3); }
`;
for (const a of APPS) {
  const css = fs.readFileSync(path.join(RAIZ, 'assets/css', a.hoja), 'utf8');
  const dia = suaviza(opacos(vars(css, a.dia), a.sup), 'dark'), noche = suaviza(opacos(vars(css, a.noche), a.sup), 'light'), is = `:is(${a.cajas.join(', ')})`;
  sup += `/* ${a.hoja}: la demo entera con la paleta del otro tema */\n`;
  sup += `html[data-theme="dark"] body ${is}{ ${decl(dia)}; color:${a.color}; color-scheme:light; }\n`;
  sup += `html[data-theme="dark"] body ${a.cajas[0]}{ box-shadow:0 0 0 1px rgba(120,150,255,.22), 0 30px 70px -34px rgba(91,140,255,.55); }\nhtml[data-theme="light"] body ${a.cajas[0]}{ box-shadow:0 0 0 1px rgba(20,34,110,.14), 0 30px 70px -34px rgba(20,34,110,.6); }\n`;
  sup += `html[data-theme="light"] body ${is}{ ${decl(noche)}; color:${a.color}; color-scheme:dark; }\n`;
}
sup += '\n/* Lo que la web escribe con colores fijos, dentro de las cajas (CSS anidado) */\n';
for (const cual of ['dark', 'light']) {
  sup += `html[data-theme="${cual}"] ${IS}{\n`;
  for (const f of ORIGENES) sup += `  /* ${f} */\n` + procesarSup(sinComentarios(fs.readFileSync(path.join(RAIZ, 'assets/css', f), 'utf8')), cual);
  sup += '}\n';
}

/* Estados que el fondo forzado de la caja taparía: lo elegido tiene que verse */
sup += `
/* Estados visibles en las dos paletas */
html[data-theme] body .gal-tab[aria-selected="true"]{ border-color:var(--c, #3b6cf6) !important; box-shadow:0 0 0 2px var(--c, #3b6cf6), 0 18px 40px -22px var(--c, #3b6cf6) !important; }
html[data-theme] body .dx-opt input:checked + span{ border-color:#d6453c !important; box-shadow:inset 0 0 0 1px #d6453c; }
html[data-theme="dark"] body .dx-opt input:checked + span{ background:#fde6e4 !important; }
html[data-theme="light"] body .dx-opt input:checked + span{ background:#3a1614 !important; }
html[data-theme="dark"] body .conc-mov.es-cuadra{ --est:#0b7a52; }
html[data-theme="dark"] body .conc-mov.es-suelto{ --est:#8a5400; }
html[data-theme="dark"] body ${IS} [data-conc="1"], html[data-theme="dark"] body ${IS}[data-conc="1"]{ --tono:#6a42dc; }
html[data-theme="light"] body ${IS} [data-conc="1"], html[data-theme="light"] body ${IS}[data-conc="1"]{ --tono:#b89cff; }
html[data-theme="dark"] body .v7-fiscal-i:has([data-conc]){ --tono-i:#6a42dc; }
html[data-theme="light"] body .v7-fiscal-i:has([data-conc]){ --tono-i:#b89cff; }
`;

if (process.argv.includes('--check')) {
  const actual = fs.existsSync(DESTINO) ? fs.readFileSync(DESTINO, 'utf8') : '';
  if (actual !== salida) { console.error('✗ tema-claro.css no está al día: ejecuta node scripts/build-tema-claro.mjs'); process.exit(1); }
  if ((fs.existsSync(DESTINO_SUP) ? fs.readFileSync(DESTINO_SUP, 'utf8') : '') !== sup) { console.error('✗ superficies.css no está al día: ejecuta node scripts/build-tema-claro.mjs'); process.exit(1); }
  console.log('✓ tema-claro.css al día con ' + ORIGENES.length + ' hojas'); process.exit(0);
}
fs.writeFileSync(DESTINO, salida);
fs.writeFileSync(DESTINO_SUP, sup);
console.log(`superficies.css: ${statsS.reglas} reglas · ${(sup.length / 1024).toFixed(1)} KB`);
console.log(`tema-claro.css: ${stats.reglas} reglas · ${stats.decl} declaraciones · ${(salida.length / 1024).toFixed(1)} KB`);
