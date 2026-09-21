/*
 * El estado de producto que la web tiene permitido contar.
 *
 * Qué problema resuelve: «Preparado para VERI*FACTU» escrito a mano en seis
 * sitios es una frase que alguien se olvidará de cambiar en uno, o que
 * alguien cambiará en uno sin que haya pasado nada. Aquí el estado es UN
 * dato (estado-producto.json), y cada estado exige su prueba: no se puede
 * poner «integrado» sin la validación que lo sostiene, ni «operativo» sin la
 * remisión real y la declaración responsable firmada.
 *
 * Lo usan build-estado.mjs (escribe la web a partir del dato) y
 * check-estado.mjs (falla si la web no coincide o si el dato no se sostiene).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const FICHERO = path.join(RAIZ, 'estado-producto.json');

/* ── Los estados, en orden ──────────────────────────────────────────── */
export const VF = {
  'preparado':     { n: 1, es: 'Preparado para VERI*FACTU',            en: 'Ready for VERI*FACTU',                 cortoEs: 'Preparado',     cortoEn: 'Ready' },
  'en-validacion': { n: 2, es: 'Integración VERI*FACTU en validación', en: 'VERI*FACTU integration in validation', cortoEs: 'En validación', cortoEn: 'In validation' },
  'integrado':     { n: 3, es: 'VERI*FACTU integrado',                 en: 'VERI*FACTU integrated',                cortoEs: 'Integrado',     cortoEn: 'Integrated' },
  'operativo':     { n: 4, es: 'VERI*FACTU operativo',                 en: 'VERI*FACTU operational',               cortoEs: 'Operativo',     cortoEn: 'Operational' },
};
export const CONC = {
  'planificada':   { n: 1, es: 'Próximamente',  en: 'Coming soon' },
  'en-desarrollo': { n: 2, es: 'En desarrollo', en: 'In development' },
  'en-pruebas':    { n: 3, es: 'En pruebas',    en: 'In testing' },
  'disponible':    { n: 4, es: 'Disponible',    en: 'Available' },
};
export const PLANES = ['finance', 'finance-ia', 'finance-medida'];

/* ── Qué prueba exige cada estado ───────────────────────────────────── */
export const EXIGE = {
  verifactu: {
    'preparado':     [],
    'en-validacion': ['remisionPruebas'],
    'integrado':     ['remisionPruebas', 'validacion'],
    'operativo':     ['remisionPruebas', 'validacion', 'remisionProduccion', 'declaracionResponsable'],
  },
  conciliacion: {
    'planificada':   ['decision'],
    'en-desarrollo': ['decision', 'desarrollo'],
    'en-pruebas':    ['decision', 'desarrollo', 'pruebas'],
    'disponible':    ['decision', 'desarrollo', 'pruebas', 'disponible'],
  },
};
// Forma de cada prueba. 'fecha' = AAAA-MM-DD no futura; 'commit' = hash de
// git; 'texto' = no vacío; un array = uno de esos valores; true = debe ser
// exactamente true (una casilla que alguien marca a sabiendas).
export const FORMA = {
  remisionPruebas:        { fecha: 'fecha', entorno: ['pruebas', 'preproduccion'], referencia: 'texto', respuesta: ['Correcto', 'AceptadoConErrores'], commit: 'commit' },
  validacion:             { fecha: 'fecha', informe: 'texto', huellaContrastadaConVectoresOficiales: true, xmlValidadoContraXsdOficial: true, commit: 'commit' },
  remisionProduccion:     { fecha: 'fecha', referencia: 'texto', respuesta: ['Correcto', 'AceptadoConErrores'], commit: 'commit' },
  declaracionResponsable: { fecha: 'fecha', firmante: 'texto', documento: 'texto' },
  qrEnFactura:            { fecha: 'fecha', commit: 'commit' },
  decision:               { fecha: 'fecha', quien: 'texto', que: 'texto' },
  desarrollo:             { fecha: 'fecha', rama: 'texto', commit: 'commit' },
  pruebas:                { fecha: 'fecha', informe: 'texto', commit: 'commit' },
  disponible:             { fecha: 'fecha', commit: 'commit', entorno: ['produccion'] },
};
// Orden cronológico que las pruebas tienen que respetar.
const ORDEN = {
  verifactu: ['remisionPruebas', 'validacion', 'remisionProduccion'],
  conciliacion: ['decision', 'desarrollo', 'pruebas', 'disponible'],
};

const hoyISO = () => new Date().toISOString().slice(0, 10);
const esFecha = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + 'T00:00:00Z'));

function validaPrueba(nombre, dato, errores, donde) {
  const forma = FORMA[nombre];
  if (!dato || typeof dato !== 'object') { errores.push(`${donde}.${nombre}: falta la prueba`); return; }
  for (const [campo, regla] of Object.entries(forma)) {
    const v = dato[campo];
    const d = `${donde}.${nombre}.${campo}`;
    if (regla === 'fecha') {
      if (!esFecha(v)) errores.push(`${d}: fecha AAAA-MM-DD obligatoria`);
      else if (v > hoyISO()) errores.push(`${d}: ${v} es una fecha futura`);
    } else if (regla === 'commit') {
      if (typeof v !== 'string' || !/^[0-9a-f]{7,40}$/.test(v)) errores.push(`${d}: hash de commit obligatorio`);
    } else if (regla === 'texto') {
      if (typeof v !== 'string' || v.trim().length < 3) errores.push(`${d}: texto obligatorio`);
    } else if (regla === true) {
      if (v !== true) errores.push(`${d}: tiene que ser true (y alguien tiene que haberlo comprobado)`);
    } else if (Array.isArray(regla)) {
      if (!regla.includes(v)) errores.push(`${d}: tiene que ser uno de ${regla.join(' | ')}`);
    }
  }
}

/** Lee y valida. Devuelve { cfg, errores, avisos }. */
export function carga(fichero = FICHERO) {
  const errores = [], avisos = [];
  let cfg;
  try { cfg = JSON.parse(fs.readFileSync(fichero, 'utf8')); }
  catch (e) { return { cfg: null, errores: [`No se puede leer ${path.basename(fichero)}: ${e.message}`], avisos }; }

  if (!esFecha(cfg.revisado)) errores.push('revisado: fecha AAAA-MM-DD obligatoria');
  else if (cfg.revisado > hoyISO()) errores.push('revisado: fecha futura');

  for (const [tema, estados] of [['verifactu', VF], ['conciliacion', CONC]]) {
    const t = cfg[tema];
    if (!t) { errores.push(`${tema}: falta`); continue; }
    if (!estados[t.estado]) { errores.push(`${tema}.estado: «${t.estado}» no es un estado (${Object.keys(estados).join(', ')})`); continue; }
    const f = t.fuente || {};
    for (const k of ['repositorio', 'commit', 'fichero', 'dato']) if (!f[k]) errores.push(`${tema}.fuente.${k}: obligatorio`);
    if (f.commit && !/^[0-9a-f]{7,40}$/.test(f.commit)) errores.push(`${tema}.fuente.commit: no es un hash`);
    const ev = t.evidencia || {};
    for (const nombre of EXIGE[tema][t.estado]) validaPrueba(nombre, ev[nombre], errores, `${tema}.evidencia`);
    // Pruebas de estados todavía no alcanzados: se permiten, pero se avisa.
    for (const [nombre, dato] of Object.entries(ev)) {
      if (dato && !EXIGE[tema][t.estado].includes(nombre)) avisos.push(`${tema}.evidencia.${nombre} está rellena pero el estado sigue en «${t.estado}»`);
    }
    // Cronología.
    let ant = null;
    for (const nombre of ORDEN[tema]) {
      const fch = ev[nombre] && ev[nombre].fecha;
      if (!fch || !EXIGE[tema][t.estado].includes(nombre)) continue;
      if (ant && fch < ant.f) errores.push(`${tema}.evidencia.${nombre}.fecha (${fch}) es anterior a ${ant.n} (${ant.f})`);
      ant = { n: nombre, f: fch };
    }
  }
  const vf = cfg.verifactu || {};
  if (vf.qrEnFactura) validaPrueba('qrEnFactura', vf.qrEnFactura, errores, 'verifactu');
  if (vf.estado === 'operativo' && vf.evidencia?.declaracionResponsable?.fecha && vf.evidencia?.remisionProduccion?.fecha &&
      vf.evidencia.declaracionResponsable.fecha > hoyISO()) errores.push('verifactu.evidencia.declaracionResponsable: fecha futura');

  // Los planes son acumulativos («todo lo del plan anterior»): si la
  // conciliación está en uno, tiene que estar en todos los de encima.
  const inc = (cfg.conciliacion && cfg.conciliacion.incluidaEn) || [];
  for (const p of inc) if (!PLANES.includes(p)) errores.push(`conciliacion.incluidaEn: «${p}» no es un plan (${PLANES.join(', ')})`);
  const idx = inc.map((p) => PLANES.indexOf(p)).filter((i) => i >= 0);
  if (idx.length) {
    const desde = Math.min(...idx);
    for (let i = desde; i < PLANES.length; i++) if (!inc.includes(PLANES[i])) errores.push(`conciliacion.incluidaEn: está en ${PLANES[desde]} pero no en ${PLANES[i]}, y los planes son acumulativos`);
  }

  const c = cfg.calendario || {};
  for (const k of ['sociedades', 'resto', 'consultado']) if (!esFecha(c[k])) errores.push(`calendario.${k}: fecha obligatoria`);
  for (const k of ['norma', 'url']) if (!c[k]) errores.push(`calendario.${k}: obligatorio`);
  if (c.url && !/^https:\/\/(sede\.)?agenciatributaria\.gob\.es\/|^https:\/\/www\.boe\.es\//.test(c.url)) errores.push('calendario.url: tiene que ser una fuente oficial (AEAT o BOE)');

  return { cfg, errores, avisos };
}

/* ── Utilidades que comparten generador y centinela ─────────────────── */
export const vfN = (cfg) => VF[cfg.verifactu.estado].n;
export const concN = (cfg) => CONC[cfg.conciliacion.estado].n;
export function fechaLarga(iso, lang) {
  const [a, m, d] = iso.split('-').map(Number);
  const ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return lang === 'en' ? `${d} ${EN[m - 1]} ${a}` : `${d} de ${ES[m - 1]} de ${a}`;
}
export const fechaCorta = (iso) => { const [a, m, d] = iso.split('-'); return `${d}/${m}/${a}`; };
