#!/usr/bin/env node
/*
 * LOS PRECIOS, EN UN SOLO SITIO
 * ---------------------------------------------------------------------------
 * La web enseña precios «desde» en la portada y en servicios. Escritos a mano
 * en cada página, el día que cambie uno la web dirá dos cosas distintas según
 * dónde mire quien entra — que es exactamente lo que no puede pasar con un
 * precio. Así que viven en precios.json y este script los escribe.
 *
 * Marca en el HTML:  <span data-precio="finance"></span>
 *                    <span data-precio="finance" data-precio-detalle></span>
 *                    <p data-precio-aviso></p>
 * El idioma sale del <html lang>.
 *
 * Uso:  node scripts/build-precios.mjs          (escribe)
 *       node scripts/build-precios.mjs --check  (falla si algo no coincide)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CFG = JSON.parse(fs.readFileSync(path.join(RAIZ, 'precios.json'), 'utf8'));
const CAT = JSON.parse(fs.readFileSync(path.join(RAIZ, 'catalogo.json'), 'utf8'));
const CHECK = process.argv.includes('--check');

function paginas(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) paginas(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let escritos = 0, marcas = 0, errores = [];

for (const f of paginas(RAIZ)) {
  const original = fs.readFileSync(f, 'utf8');
  if (!/data-precio/.test(original)) continue;
  const lang = /<html[^>]*\blang="en"/.test(original) ? 'en' : 'es';
  let s = original;

  s = s.replace(/(<([a-z]+)([^>]*\bdata-precio="([a-z]+)"[^>]*)>)([\s\S]*?)(<\/\2>)/g, (m, abre, tag, attrs, clave, dentro, cierra) => {
    const d = CFG.desde[clave];
    if (!d) { errores.push(`${path.relative(RAIZ, f)}: data-precio="${clave}" no existe en precios.json`); return m; }
    const detalle = /data-precio-detalle/.test(attrs);
    const valor = detalle ? d['detalle_' + lang] : d[lang];
    marcas++;
    return abre + esc(valor) + cierra;
  });

  s = s.replace(/(<([a-z]+)([^>]*\bdata-precio-aviso[^>]*)>)([\s\S]*?)(<\/\2>)/g,
    (m, abre, tag, attrs, dentro, cierra) => { marcas++; return abre + esc(CFG.aviso[lang]) + cierra; });

  if (s !== original) {
    if (CHECK) errores.push(`${path.relative(RAIZ, f)}: los precios no coinciden con precios.json`);
    else { fs.writeFileSync(f, s); escritos++; }
  }
}

/* ─────────────── DOS FUENTES NO PUEDEN DECIR COSAS DISTINTAS ───────────────
   catalogo.json manda: es el catálogo comercial entero y de él vive /precios.
   precios.json solo guarda los «desde» que se escriben sueltos por la web.
   Si alguien toca uno y se olvida del otro, la web dice dos precios para lo
   mismo, que es exactamente lo que esta ronda vino a quitar. */
{
  const dePrecio = (id) => (CAT.productos.find((p) => p.id === id) || {});
  /* Se comparan los NÚMEROS, no las frases: «Desde 29 €/mes» y «29 €» dicen
     lo mismo y se escriben distinto según dónde vayan. Lo que no puede pasar
     es que uno diga 29 y el otro 39. */
  const cifras = (t) => (String(t).match(/[\d][\d.,]*/g) || []).map((x) => x.replace(/[.,](?=\d{3}\b)/g, ''));
  const pares = [
    ['finance', 'finance-1', ['precio_mes', 'precio'], ['es', 'detalle_es']],
    ['medida', 'medida-1', ['precio'], ['es']],
    ['agentes', 'agente-1', ['precio'], ['es']],
  ];
  for (const [clave, id, campos] of pares) {
    const prod = dePrecio(id);
    if (!prod.es) { errores.push(`catalogo.json: falta el producto ${id}, del que sale «desde ${clave}»`); continue; }
    for (const lang of ['es', 'en']) {
      const d = CFG.desde[clave] || {};
      const puesto = cifras((d[lang] || '') + ' ' + (d['detalle_' + lang] || '')).sort().join('|');
      const esperado = cifras(campos.map((c) => prod[lang][c] || '').join(' ')).sort().join('|');
      if (esperado !== puesto) {
        errores.push(`precios.json «desde.${clave}.${lang}» lleva ${puesto || '(nada)'} y catalogo.json (${id}) lleva ${esperado || '(nada)'}`);
      }
    }
  }
  /* Y la página de precios tiene que llevar de verdad lo que dice el catálogo:
     si se edita a mano y se olvida regenerarla, esto lo caza. */
  for (const [pagina, lang] of [['precios.html', 'es'], ['en/precios.html', 'en']]) {
    const ruta = path.join(RAIZ, pagina);
    if (!fs.existsSync(ruta)) { errores.push(`falta ${pagina} (se genera con npm run build:catalogo)`); continue; }
    const h = fs.readFileSync(ruta, 'utf8');
    /* El precio tiene que estar EN LA FICHA DE ESE PRODUCTO, no en cualquier
       sitio de la página: «390 €» suelto lo cumpliría cualquier otro texto
       que lleve esa cifra, y entonces el aviso no avisa de nada. */
    for (const prod of CAT.productos.concat(CAT.packs)) {
      const i = h.indexOf(`data-id="${prod.id}"`);
      if (i < 0) { errores.push(`${pagina}: no aparece la ficha de ${prod.id}`); continue; }
      const ficha = h.slice(i, h.indexOf('</article>', i));
      for (const campo of ['precio', 'precio_mes']) {
        const v = prod[lang][campo];
        if (!v) continue;
        if (!ficha.includes(esc(v))) errores.push(`${pagina}: la ficha de ${prod.id} no lleva «${v}» (${campo})`);
      }
    }
    if (!h.includes(esc(CAT.aviso[lang]))) errores.push(`${pagina}: falta el aviso de precios de referencia`);
  }
}

if (errores.length) {
  console.error('✗ check:precios — ' + errores.length + ' problema(s):');
  errores.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log(CHECK
  ? `✓ check:precios — ${marcas} marcas al día y el catálogo cuadra con la web (revisado ${CAT.revisado})`
  : `✓ Precios escritos: ${marcas} marcas en ${escritos} página(s) (revisado ${CFG.revisado})`);
