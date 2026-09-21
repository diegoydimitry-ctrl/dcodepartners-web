#!/usr/bin/env node
/*
 * CENTINELA del estado de producto (VERI*FACTU y conciliación bancaria).
 *
 * Falla si:
 *  1. estado-producto.json no se sostiene: un estado sin la prueba que
 *     exige, una fecha futura, planes no acumulativos, una fuente no oficial.
 *  2. Alguna región generada falta o no coincide con lo que el estado dice
 *     (alguien la editó a mano, o cambió el estado sin regenerar).
 *  3. En cualquier parte de lo que se publica aparece una afirmación que el
 *     estado no sostiene: «implantado», «certificado», «homologado»,
 *     «100 % conforme», «cumple VERI*FACTU», sus equivalentes en inglés, o
 *     la vieja promesa de implantación «en un día» sin formulario.
 *  4. Fuera de las regiones generadas, la ficha, la portada o el tablero
 *     nombran un estado de VERI*FACTU que todavía no se ha alcanzado, o
 *     hablan de conciliación como si existiera.
 *
 * Y antes de todo eso se prueba a sí mismo: frases que tiene que cazar y
 * frases que no, para que el detector no se pueda ablandar sin que se note.
 *
 * Uso:  node scripts/check-estado.mjs      (npm run check:estado)
 */
import fs from 'node:fs';
import path from 'node:path';
import { carga, RAIZ, VF, vfN, concN } from './estado/modelo.mjs';
import { REGIONES, ENTEROS, rehaz, sinRegiones, lee } from './estado/regiones.mjs';

const fallos = [];
const falla = (m) => fallos.push(m);

/* ── Detector de afirmaciones prohibidas ────────────────────────────── */
const VFRX = 'VERI\\s?\\*?\\s?FACTU';
const FISCAL = `${VFRX}|AEAT|Hacienda|Agencia\\s+Tributaria|Tax\\s+Agency|factur|invoic|fiscal|\\btax\\b|RD\\s*1007|antifraude|D-Code\\s+Finance`;
export const PROHIBIDAS = [
  ['implantado',        new RegExp(`${VFRX}\\s+implantad[oa]s?|implantad[oa]s?\\s+(?:de\\s+|con\\s+|para\\s+)?${VFRX}`, 'i')],
  ['100 %',             /\b100\s*%\s*(?:conforme|adaptad|compatible|cumpl|legal|homolog|certif|compliant|verifactu|veri\*factu|seguro)/i],
  ['homologado',        /homolog/i],
  // «Certificación» a secas es legítima en otros contextos (la política de
  // seguridad dice, precisamente, que NO hay ISO 27001). Lo prohibido es
  // atribuírsela a la facturación o a lo fiscal.
  ['certificado',       new RegExp(`certifi\\w*[^.<>]{0,120}(?:${FISCAL})|(?:${FISCAL})[^.<>]{0,120}certifi\\w*|(?:sistema|software|programa)\\s+certificad`, 'i')],
  ['cumple',            new RegExp(`\\bcumpl\\w*[^.<>]{0,80}${VFRX}|${VFRX}[^.<>]{0,80}\\bcumpl\\w*|\\bcumpl\\w*\\s+(?:con\\s+)?(?:la\\s+|el\\s+)?(?:normativa\\s+(?:fiscal|antifraude)|ley\\s+antifraude|reglamento\\s+de\\s+(?:facturaci|sistemas)|rd\\s*1007|orden\\s+hac)`, 'i')],
  ['conforme',          new RegExp(`conform\\w*[^.<>]{0,60}(?:${VFRX}|AEAT|RD\\s*1007|Real\\s+Decreto\\s+1007|Orden\\s+HAC|Ley\\s+Antifraude|normativa\\s+fiscal)`, 'i')],
  ['adaptado a',        new RegExp(`adaptad[oa]s?\\s+(?:al?\\s+)?(?:${VFRX}|la\\s+(?:normativa|ley)\\s+(?:antifraude|${VFRX}))`, 'i')],
  ['garantiza',         /garantiz\w*\s+(?:el\s+|tu\s+|su\s+)?cumplimiento/i],
  ['avalado',           /(?:aprobad|validad|avalad|reconocid|autorizad)[oa]s?\s+por\s+(?:la\s+)?(?:AEAT|Agencia\s+Tributaria|Hacienda)/i],
  ['compliant',         /\bcompliant\b|\bcomplies\s+with\b/i],
  ['compliance',        new RegExp(`\\bcompliance\\b[^.<>]{0,60}${VFRX}|${VFRX}[^.<>]{0,60}\\bcompliance\\b`, 'i')],
  ['approved by',       /(?:approved|endorsed|validated|authori[sz]ed)\s+by\s+(?:the\s+)?(?:AEAT|Spanish\s+Tax|Tax\s+Agency)/i],
  ['implemented',       new RegExp(`${VFRX}[\\s-]+(?:implemented|approved|ready\\s+and\\s+compliant)|(?:fully|already)\\s+implemented\\s+${VFRX}`, 'i')],
  ['un día (antiguo)',  /implant\w*\s+en\s+un\s+d[ií]a|te\s+lo\s+implantamos\s+en|(?:set\s+it\s+up|put\s+it\s+in\s+place|rollout)\s+in\s+a\s+day/i],
];
function detecta(texto) {
  const hall = [];
  for (const [id, rx] of PROHIBIDAS) {
    const m = texto.match(rx);
    if (m) hall.push([id, m[0]]);
  }
  return hall;
}

// Meta-prueba: si el detector deja de cazar esto, o empieza a cazar lo
// otro, el que está roto es él.
const CAZA = [
  'VERI*FACTU implantado en todos los planes', 'Software 100% conforme', 'Programa homologado por Hacienda',
  'Sistema de facturación certificado', 'Software certificado', 'Cumple con VERI*FACTU', 'Adaptado a VERI*FACTU', 'Conforme a la normativa fiscal',
  'Garantizamos el cumplimiento', 'Aprobado por la AEAT', 'Fully compliant with VERI*FACTU', 'Certified invoicing software', 'VERI*FACTU certified',
  'VERI*FACTU compliance included', 'VERI*FACTU implemented', 'Te lo implantamos en un día', 'We set it up in a day',
];
const DEJA = [
  'Preparado para VERI*FACTU', 'Integración VERI*FACTU en validación', 'VERI*FACTU integrado', 'VERI*FACTU operativo',
  'Ready for VERI*FACTU', 'tratamos los datos personales conforme al Reglamento (UE) 2016/679', 'conforme al artículo 28 RGPD',
  'Se cumple hoy.', 'no dispone de una certificación ISO 27001', 'does not currently hold ISO 27001 certification', 'ponemos en marcha tu sistema en 1 día', 'Hablemos de implantarlo', 'Registro fiscal · VERI*FACTU',
];
for (const f of CAZA) if (!detecta(f).length) falla(`meta-prueba: el detector NO caza «${f}»`);
for (const f of DEJA) { const h = detecta(f); if (h.length) falla(`meta-prueba: el detector caza por error «${f}» (${h[0][0]})`); }

/* ── 1. El fichero de estado ────────────────────────────────────────── */
const { cfg, errores, avisos } = carga();
for (const e of errores) falla('estado-producto.json · ' + e);
for (const a of avisos) console.warn('  aviso · ' + a);

/* ── 2. Regiones generadas ──────────────────────────────────────────── */
if (cfg && !errores.length) {
  for (const [rel, def] of Object.entries(REGIONES)) {
    let actual; try { actual = lee(rel); } catch { falla(`${rel}: no existe`); continue; }
    const { texto, faltan } = rehaz(actual, def, cfg);
    if (faltan.length) falla(`${rel}: faltan las regiones ${faltan.join(', ')} (o están duplicadas)`);
    else if (texto !== actual) falla(`${rel}: el contenido no coincide con estado-producto.json — ejecuta npm run build:estado (y no edites las regiones a mano)`);
  }
  for (const [rel, fn] of Object.entries(ENTEROS)) {
    let actual = null; try { actual = lee(rel); } catch {}
    if (actual !== fn(cfg)) falla(`${rel}: no coincide con estado-producto.json — ejecuta npm run build:estado`);
  }
}

/* ── 3. Barrido de todo lo que se publica ───────────────────────────── */
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', laquo: '«', raquo: '»',
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ', uuml: 'ü', iexcl: '¡', iquest: '¿', euro: '€', middot: '·', hellip: '…', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”' };
const decode = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, n) => (n in ENT ? ENT[n] : m));
const texto = (s) => decode(s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (m) => m).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

function lista(dir, ext, out = []) {
  const abs = path.join(RAIZ, dir);
  if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.git'].includes(e.name)) lista(rel, ext, out); }
    else if (ext.some((x) => e.name.endsWith(x))) out.push(rel);
  }
  return out;
}
const publicados = [
  ...fs.readdirSync(RAIZ).filter((f) => f.endsWith('.html')),
  ...['en', 'blog', 'departamentos', 'servicios', 'sistema-financiero'].flatMap((d) => lista(d, ['.html'])),
  ...lista('assets/js', ['.js']),
  ...lista('assets/data', ['.json']),
  ...lista('api', ['.js']),
];
let barridos = 0;
for (const rel of [...new Set(publicados)]) {
  let s = lee(rel);
  if (rel === 'api/_lib/estado-producto.js') s = s.split('\\n').filter((l) => !l.startsWith('- Nunca digas')).join('\n');
  const t = rel.endsWith('.html') ? texto(s) : decode(s);
  for (const [id, m] of detecta(t)) falla(`${rel}: afirmación prohibida (${id}) «${m.slice(0, 90)}»`);
  barridos++;
}

/* ── 4. Fuera de las regiones, nada que el estado no sostenga ───────── */
if (cfg && !errores.length) {
  const ZONA = ['sistema-financiero.html', 'en/sistema-financiero.html', 'index.html', 'en/index.html', 'cambios-en-proceso.html', 'en/cambios-en-proceso.html'];
  const n = vfN(cfg);
  for (const rel of ZONA) {
    const t = texto(sinRegiones(lee(rel)));
    for (const s of Object.values(VF)) {
      if (s.n <= n) continue;
      for (const etiqueta of [s.es, s.en]) if (t.toLowerCase().includes(etiqueta.toLowerCase())) falla(`${rel}: dice «${etiqueta}» fuera de las regiones generadas y el estado es «${cfg.verifactu.estado}»`);
    }
    if (concN(cfg) < 4) {
      const m = t.match(/concili\w*|reconcil\w*/i);
      if (m) falla(`${rel}: habla de «${m[0]}» fuera de las regiones generadas y la conciliación está «${cfg.conciliacion.estado}»`);
    }
  }
}

if (fallos.length) {
  console.error(`✗ check:estado — ${fallos.length} fallo(s):\n  ` + fallos.join('\n  '));
  process.exit(1);
}
console.log(`✓ check:estado — estado VERI*FACTU «${cfg.verifactu.estado}», conciliación «${cfg.conciliacion.estado}»; ` +
  `${Object.keys(REGIONES).length + Object.keys(ENTEROS).length} ficheros generados al día; ${barridos} ficheros publicados barridos; ` +
  `meta-prueba ${CAZA.length} cazadas / ${DEJA.length} respetadas`);
