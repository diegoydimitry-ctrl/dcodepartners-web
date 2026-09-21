#!/usr/bin/env node
/*
 * La demo de D-Code Finance en inglés se GENERA a partir de la española.
 *
 * Antes eran dos ficheros escritos a mano, y el inglés se quedó atrás: cuando
 * la demo española dejó de tener pantallas vacías, la inglesa seguía con
 * Cobros y Duplicados en blanco. Con dos copias eso vuelve a pasar la próxima
 * vez que se toque una sola. Así que hay una sola demo —finance-demo.js— y
 * esto la traduce:
 *
 *   1. Recorre el código y cambia cada literal entre comillas simples que
 *      esté en scripts/demo-en/textos.json por su versión inglesa. Solo
 *      literales enteros: nunca un trozo, nunca un comentario, nunca un
 *      identificador (las rutas, las claves y las clases no se tocan).
 *   2. Aplica unos pocos cambios de CÓDIGO que dependen del idioma de los
 *      datos (expresiones regulares sobre textos de finance-demo-data.en.js,
 *      los nombres de los meses). Cada uno se comprueba: si el original cambia
 *      y el cambio ya no encaja, el script falla en vez de generar una demo
 *      a medias.
 *   3. Avisa de los literales en español que se han quedado sin traducir.
 *
 * Uso:  node scripts/build-demo-en.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEN = path.join(RAIZ, 'assets/js/finance-demo.js');
const DESTINO = path.join(RAIZ, 'assets/js/finance-demo.en.js');
const TEXTOS = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/demo-en/textos.json'), 'utf8'));

const src = fs.readFileSync(ORIGEN, 'utf8');

/* ── 1. Literales ─────────────────────────────────────────────────────── */
let out = '', i = 0, n = src.length, cambiados = 0;
const sinTraducir = new Set();
const pareceEspanol = (t) => /[áéíóúñ¿¡]/i.test(t.replace(/<[^>]*>/g, '')) ||
  /\b(de|del|la|las|los|una?|que|con|por|para|sin|más|sus?)\b/.test(t.replace(/<[^>]*>/g, ' '));
while (i < n) {
  const c = src[i];
  if (src.startsWith('/*', i)) { const j = src.indexOf('*/', i + 2) + 2; out += src.slice(i, j); i = j; continue; }
  if (src.startsWith('//', i) && (i === 0 || ' \t\n;{}(,'.includes(src[i - 1]))) {
    const j = src.indexOf('\n', i); out += src.slice(i, j); i = j; continue;
  }
  if (c === '"') {
    let j = i + 1;
    while (src[j] !== '"' && src[j] !== '\n') { if (src[j] === '\\') j++; j++; }
    out += src.slice(i, j + 1); i = j + 1; continue;
  }
  if (c === "'") {
    let j = i + 1;
    while (src[j] !== "'") { if (src[j] === '\\') j++; j++; }
    const lit = src.slice(i + 1, j);
    if (Object.prototype.hasOwnProperty.call(TEXTOS, lit)) {
      const en = TEXTOS[lit];
      if (en !== lit) cambiados++;
      out += "'" + en + "'";
    } else {
      if (pareceEspanol(lit) && /[a-záéíóúñ]{3,}/i.test(lit)) sinTraducir.add(lit);
      out += "'" + lit + "'";
    }
    i = j + 1; continue;
  }
  out += c; i++;
}

/* ── 2. Código que depende del idioma de los datos ────────────────────── */
function cambia(desde, hasta, veces = 1) {
  const k = out.split(desde).length - 1;
  if (k !== veces) { console.error(`✗ Se esperaban ${veces} apariciones de:\n  ${desde}\n  y hay ${k}. Revisa el cambio.`); process.exit(1); }
  out = out.split(desde).join(hasta);
}
// Los conceptos de gasto fijo en los datos ingleses acaban en «— monthly».
cambia("/cuota mensual/.test(", "/cuota mensual|\\u2014 monthly/.test(");
// El estado de un cliente en los datos ingleses es «client», no «cliente».
cambia("estado === 'cliente'", "estado === 'client'", 4);
// Las retenciones se estiman sobre las categorías de servicios profesionales.
cambia("/profesional|Subcontrat/i.test(", "/profesional|Subcontrat|Professional|Subcontract/i.test(");
// El origen de cada documento archivado.
cambia("/asistente|PDF|Foto/.test(", "/asistente|PDF|Foto|assistant|Photo/.test(");
// Los meses: en la ficha del cliente, en la curva de caja y en «Periodo: …».
cambia("var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];",
       "var MESES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];");
cambia("return d.getUTCDate() + ' ' + ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'][d.getUTCMonth()];",
       "return d.getUTCDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()];");
// Ordenar por fecha: los datos ingleses ponen el mes en inglés.
cambia("var d2 = /^(\\d{1,2}) (ene|feb|mar|abr|may|jun|jul|ago|sept?|oct|nov|dic)\\w* (\\d{4})/.exec(t);\n      if (d2) return Date.UTC(+d2[3], ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].indexOf(d2[2].slice(0, 3)), +d2[1]);",
       "var d2 = /^(\\d{1,2}) (jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)\\w* (\\d{4})/i.exec(t);\n      if (d2) return Date.UTC(+d2[3], ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(d2[2].slice(0, 3).toLowerCase()), +d2[1]);");
// El color de cada estado se elige por palabras: se añaden las inglesas.
cambia("function estadoVisual(valor) {\n    var v = (valor || '').toLowerCase();",
       "function estadoVisual(valor) {\n    var v = (valor || '').toLowerCase();\n" +
       "    if (/^(draft|drafts)$/.test(v)) return 'draft';\n" +
       "    if (/^(sent|in progress)$/.test(v)) return 'info';\n" +
       "    if (/^(overdue|rejected|expired)$/.test(v)) return 'danger';\n" +
       "    if (/^(being chased|pending review|review|held|probable|possible)$/.test(v)) return 'warning';\n" +
       "    if (/^(outstanding|pending)$/.test(v)) return 'pending';\n" +
       "    if (/^(booked|dismissed|fulfilled|invoiced|converted)$/.test(v)) return 'success';");

// Palabras sueltas en minúscula que se ENSEÑAN (las demás minúsculas son claves
// y rutas, y no se tocan).
cambia("(minC.f === FS.hoy ? 'hoy' : fechaCorta(minC.f))", "(minC.f === FS.hoy ? 'today' : fechaCorta(minC.f))");
cambia("hint: minC.f === FS.hoy ? 'hoy' : ", "hint: minC.f === FS.hoy ? 'today' : ");
cambia("(c.metodo || 'transferencia').toLowerCase()", "(c.metodo || 'bank transfer').toLowerCase()");
cambia("(f.tipo === 'rectificativa' ? 'rectificativa' : 'ordinaria')", "(f.tipo === 'rectificativa' ? 'corrective' : 'standard')");
cambia("(tipo === 'R1' ? 'rectificativa' : 'completa')", "(tipo === 'R1' ? 'corrective' : 'complete')");
cambia("p: ['facturas','cobros','gastos','proyectos','impuestos'", "p: ['invoices','collections','expenses','projects','taxes'", 3);
cambia("p: ['facturas','cobros','gastos','impuestos']", "p: ['invoices','collections','expenses','taxes']");
cambia("p: ['pedidos','albaranes','proyectos']", "p: ['orders','delivery notes','projects']");
cambia("'settings','usuarios']", "'settings','users']");
cambia("p: ['ver']", "p: ['view']");
cambia("'Owner', 'hoy',", "'Owner', 'today',");

const cabecera = '/* GENERADO por scripts/build-demo-en.mjs a partir de finance-demo.js.\n' +
  '   No se edita a mano: se edita la demo española y se vuelve a generar. */\n';
fs.writeFileSync(DESTINO, cabecera + out);
console.log(`Demo en inglés: ${cambiados} literales traducidos → ${path.relative(RAIZ, DESTINO)}`);
if (sinTraducir.size) {
  console.log(`Atención: ${sinTraducir.size} literales que parecen español siguen sin traducir:`);
  [...sinTraducir].slice(0, 60).forEach((t) => console.log('   · ' + t.slice(0, 110)));
}
