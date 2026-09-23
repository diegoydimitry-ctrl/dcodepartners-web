#!/usr/bin/env node
/*
 * CENTINELA DEL TEMA (oscuro/claro), DEL CIELO Y DE D-CODE OS
 *   1. Cada página con cabecera lleva el tema completo y en su sitio: el
 *      script que fija data-theme ANTES de cualquier hoja (sin destello), el
 *      cielo nada más abrir <body>, el botón con sus dos etiquetas en su
 *      idioma, las tres hojas del tema al final (tema.css la última) y
 *      tema.js.
 *   2. Lo generado está al día: tema-claro.css (derivado de las hojas) y
 *      galaxia.css.
 *   3. Los colores de texto del modo claro llegan a 4,5:1 sobre blanco y
 *      sobre el fondo claro.
 *   4. D-Code OS está en la portada ES y EN con la misma estructura: cuatro
 *      miniaturas que vuelven a su demo, siete módulos, seis pasos de flujo.
 * Uso: npm run check:tema
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errores = [];
const leer = (f) => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const paginas = execSync('git ls-files "*.html"', { cwd: RAIZ }).toString().split('\n').filter(Boolean).filter((f) => leer(f).includes('id="site-header"'));

for (const f of paginas) {
  const h = leer(f);
  const en = f.startsWith('en/');
  const iScript = h.indexOf("getItem('dcp-tema')");
  const iPrimeraHoja = h.indexOf('<link rel="stylesheet"');
  if (iScript < 0) errores.push(`${f}: falta el script de tema en <head>`);
  else if (iPrimeraHoja >= 0 && iScript > iPrimeraHoja) errores.push(`${f}: el script de tema va después de las hojas (habría destello)`);
  if (!/<body[^>]*>\s*<div class="gx" aria-hidden="true">/.test(h)) errores.push(`${f}: el cielo (.gx) no está justo después de <body>`);
  const botones = (h.match(/data-tema-btn/g) || []).length;
  if (botones !== 1) errores.push(`${f}: ${botones} botones de tema (debe haber 1)`);
  const [a, b] = en ? ['Light mode', 'Dark mode'] : ['Modo claro', 'Modo oscuro'];
  if (!h.includes(`<span class="t-a-claro">${a}</span>`) || !h.includes(`<span class="t-a-oscuro">${b}</span>`)) errores.push(`${f}: etiquetas del botón que no son de su idioma`);
  const hojas = [...h.slice(0, h.indexOf('</head>')).matchAll(/<link rel="stylesheet" href="([^"?]+)/g)].map((m) => m[1]);
  if (hojas[hojas.length - 1] !== '/assets/css/superficies.css' || hojas[hojas.length - 2] !== '/assets/css/tema.css') errores.push(`${f}: tema.css y superficies.css tienen que ser las dos últimas hojas`);
  for (const c of ['/assets/css/galaxia.css', '/assets/css/tema-claro.css']) if (!hojas.includes(c)) errores.push(`${f}: falta ${c}`);
  if (!h.includes('/assets/js/tema.js?v=')) errores.push(`${f}: falta tema.js`);
}

for (const g of ['scripts/build-tema-claro.mjs', 'scripts/build-galaxia.mjs']) {
  try { execSync(`node ${g} --check`, { cwd: RAIZ, stdio: 'pipe' }); }
  catch (e) { errores.push(((e.stderr || e.stdout || '').toString().trim() || `${g} --check falló`).replace(/^✗\s*/, '')); }
}

/* Contraste de los tokens de texto del modo claro */
const css = leer('assets/css/tema.css');
const bloque = css.slice(css.indexOf('html[data-theme="light"]{'), css.indexOf('}', css.indexOf('html[data-theme="light"]{')));
const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const TEXTO = ['--ink', '--stone', '--stone-soft', '--v-ink', '--v-ink-2', '--v-ink-3', '--blue', '--cyan', '--violet', '--green', '--amber', '--red', '--signal-text', '--v-a', '--v-b', '--v-c', '--k-direccion', '--k-comercial', '--k-marketing', '--k-clientes', '--k-produccion', '--k-finanzas', '--k-soporte', '--k-administracion', '--x-ok', '--x-bad', '--x-warn'];
let medidos = 0;
for (const t of TEXTO) {
  const m = bloque.match(new RegExp(`${t.replace(/[-]/g, '\\-')}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) { errores.push(`tema.css: el token claro ${t} no está definido`); continue; }
  for (const fondo of ['#ffffff', '#f3f5fb']) {
    const r = ratio(m[1], fondo); medidos++;
    if (r < 4.5) errores.push(`tema.css: ${t} ${m[1]} sobre ${fondo} da ${r.toFixed(2)}:1 (< 4,5)`);
  }
}

/* D-Code OS en la portada */
const cuenta = (h, re) => (h.match(re) || []).length;
const est = {};
for (const f of ['index.html', 'en/index.html']) {
  const h = leer(f);
  const i = h.indexOf('id="dcode-os"');
  if (i < 0) { errores.push(`${f}: falta la sección D-Code OS`); continue; }
  const s = h.slice(i, h.indexOf('</section>', h.indexOf('os-nota', i)));
  const sis = s.slice(s.indexOf('class="os-sis"'), s.indexOf('class="os-cables"'));
  est[f] = { sistemas: cuenta(sis, /class="oss" /g), nav: cuenta(s, /class="os-nav-b"/g), pasos: cuenta(s, /class="os-paso"/g), vistas: cuenta(s, /data-os-vista="/g), kpis: cuenta(s, /class="os-kpi"/g) };
  // La narrativa: D-Code Finance NO es uno de los sistemas que «construyen»
  // D-Code OS; aparece entre los que también se conectan, bajo la capa.
  if (/Finance/.test(sis)) errores.push(`${f}: D-Code Finance no puede estar entre los sistemas que convergen en D-Code OS`);
  if (!/class="oss oss--mas os-otros"[\s\S]*D-Code Finance/.test(s)) errores.push(`${f}: falta «cualquier otro sistema» con D-Code Finance bajo la capa`);
  if (!/data-os-capa/.test(s)) errores.push(`${f}: falta la capa D-Code OS`);
  if (!h.includes('/assets/css/dcode-os.css?v=') || !h.includes('/assets/js/dcode-os.js?v=')) errores.push(`${f}: faltan dcode-os.css o dcode-os.js`);
  if (h.indexOf('id="dcode-os"') < h.indexOf('id="sistemas"')) errores.push(`${f}: D-Code OS tiene que ir DESPUÉS de las cuatro demos`);
  const e = est[f];
  if (e.sistemas !== 4 || e.nav !== 7 || e.pasos !== 6 || e.vistas !== 7 || e.kpis !== 4) errores.push(`${f}: estructura de D-Code OS inesperada ${JSON.stringify(e)}`);
}
if (est['index.html'] && est['en/index.html'] && JSON.stringify(est['index.html']) !== JSON.stringify(est['en/index.html'])) errores.push('D-Code OS: ES y EN no tienen la misma estructura');

/* Cielo ligero: la salvaguarda de rendimiento tiene que seguir en su sitio.
   tema.js mide los fotogramas y marca html.gx-ligero; tema.css, DESPUÉS del
   modo claro, deja el cielo quieto y el campo sin mezcla. */
{
  const js = leer('assets/js/tema.js');
  if (!/classList\.add\('gx-ligero'\)/.test(js) || !/requestAnimationFrame\(paso\)/.test(js)) errores.push('tema.js: falta la medida de fotogramas del cielo ligero');
  // OJO: el selector nombra el campo de PARTICULAS (> .field[data-field]), no
  // «.field» a secas, que tambien es el campo de un formulario.
  const iLig = css.indexOf('html.gx-ligero .gx > i{'), iClaro = css.indexOf('html[data-theme="light"] body:has(> .gx) > .field[data-field]');
  /* El campo de particulas y el campo de un formulario se llaman igual
     (.field). Una regla que invierta «.field» a secas apaga todos los
     formularios de la web en claro: aqui se cierra esa puerta. */
  const invierteSuelto = /(^|[,{}])\s*[^,{}]*[\s>]\.field\s*(,|\{)/m.test(
    css.split('\n').filter((l) => /filter:\s*invert/.test(l) || /\.field(\s*,|\s*\{)/.test(l)).join('\n')
      .split('\n').filter((l) => /\.field\s*(,|\{)/.test(l) && !/data-field|--inst/.test(l)).join('\n'));
  if (invierteSuelto) errores.push('tema.css: hay una regla sobre «.field» a secas; el campo de particulas es «.field[data-field]» o «.field--inst» (si no, se invierten los formularios)');
  if (iLig < 0) errores.push('tema.css: falta el modo cielo ligero');
  else if (iClaro < 0 || iLig < iClaro) errores.push('tema.css: el modo cielo ligero tiene que ir después de las reglas del campo en claro');
  if (/body:has\(> \.gx\) \.field[^{]*\{[^}]*mix-blend-mode:(screen|multiply)/.test(css)) errores.push('tema.css: el campo de partículas no puede volver a mezclarse con el cielo (mix-blend-mode): es el coste principal por fotograma');
  for (const j of ['assets/js/dcp6.js', 'assets/js/dcp8.js']) if (/alpha:\s*false/.test(leer(j))) errores.push(`${j}: el lienzo del campo tiene que ser transparente (sin alpha:false)`);
  /* EN TÁCTIL NO HAY CAMPO. Medido: un lienzo fijo a pantalla completa cuesta
     lo mismo esté congelado o no, porque lo caro es subir la textura a la GPU
     en cada fotograma. Si alguien quita esta puerta, el iPad vuelve a ir a
     tirones y no se nota en ninguna prueba de las otras. */
  for (const j of ['assets/js/dcp6.js', 'assets/js/dcp8.js']) {
    const c = leer(j);
    if (!/DCP\.campoVivo\(\)/.test(c) || !/cielo-quieto/.test(c)) {
      errores.push(`${j}: falta la puerta de táctil (DCP.campoVivo + html.cielo-quieto): el campo no puede montarse en un iPad`);
    }
  }
  /* Las cuatro formaciones de los pasos: si falta el fichero o la referencia,
     el iPad se queda con media pantalla vacía y no lo ve ninguna otra prueba. */
  for (const n of ['analizamos', 'disenamos', 'implantamos', 'medimos']) {
    if (!fs.existsSync(path.join(RAIZ, 'assets/img/pasos/paso-' + n + '.webp'))) {
      errores.push('falta assets/img/pasos/paso-' + n + '.webp (se genera con scripts/build-pasos.mjs)');
    }
  }
  for (const f of ['index.html', 'en/index.html']) {
    const h = leer(f);
    const n = (h.match(/class="paso-forma"/g) || []).length;
    if (n !== 4) errores.push(`${f}: hay ${n} formaciones de paso y tienen que ser 4`);
  }
  const css7 = leer('assets/css/dcp7.css');
  if (!/html\.cielo-quieto \.field\{\s*display:none/.test(css7)) errores.push('dcp7.css: falta «html.cielo-quieto .field{display:none}»');
  if (!/html\.cielo-quieto \.gx-t\{/.test(css7)) errores.push('dcp7.css: falta dejar quieto el cielo de la galaxia en táctil');
}

if (errores.length) { console.error(errores.map((e) => '✗ ' + e).join('\n')); console.error(`\n${errores.length} problema(s).`); process.exit(1); }
console.log(`✓ check:tema — ${paginas.length} páginas con tema, cielo y botón; derivados al día; ${medidos} contrastes de texto claro ≥ 4,5:1; cielo ligero en su sitio; D-Code OS ES/EN ${JSON.stringify(est['index.html'])}`);
