/*
 * Dónde vive cada región generada. Una región es un trozo de página entre
 *   <!--estado:ID--> … <!--/estado:ID-->     (HTML)
 *   /*estado:ID*\/ … /*\/estado:ID*\/          (JS)
 * cuyo contenido es función del estado. La lista es cerrada a propósito: si
 * alguien borra una región para escribir el texto a mano, el centinela falla
 * porque la región falta, no porque el texto sea distinto.
 */
import fs from 'node:fs';
import path from 'node:path';
import * as P from './plantillas.mjs';
import { RAIZ } from './modelo.mjs';

function cuentaFrentes(lang) {
  return (cfg, _lang, pagina) => {
    const i = pagina.indexOf('board-state--wip');
    const j = pagina.indexOf('<div class="board">', i);
    const n = (pagina.slice(i, j < 0 ? undefined : j).match(/class="board-row"/g) || []).length;
    return lang === 'en' ? `${n} fronts` : `${n} frentes`;
  };
}

const FINANCE = {
  'vf-bloque': P.vfBloque,
  'conc-bloque': P.concBloque,
  'vf-ficha': P.vfFicha,
  'conc-plan-finance': P.concPlan('finance'),
  'conc-plan-finance-ia': P.concPlan('finance-ia'),
  'conc-plan-finance-medida': P.concPlan('finance-medida'),
  'comparativa': P.comparativa,
  'conc-conexion': P.concConexion,
};

export const REGIONES = {
  'sistema-financiero.html':      { lang: 'es', r: FINANCE },
  'en/sistema-financiero.html':   { lang: 'en', r: FINANCE },
  'index.html':                   { lang: 'es', r: { 'home-estado': P.homeEstado } },
  'en/index.html':                { lang: 'en', r: { 'home-estado': P.homeEstado } },
  // El recuento va DESPUÉS de las filas: cuenta lo que las filas dejan.
  'cambios-en-proceso.html':      { lang: 'es', r: { 'proceso-filas': P.procesoFilas, 'vf-frase': P.vfFrase, 'proceso-cuenta': cuentaFrentes('es') } },
  'en/cambios-en-proceso.html':   { lang: 'en', r: { 'proceso-filas': P.procesoFilas, 'vf-frase': P.vfFrase, 'proceso-cuenta': cuentaFrentes('en') } },
  'assets/js/finance-demo.js':    { lang: 'es', js: true, r: { 'constante': P.demoConstante } },
};
// Ficheros que se generan enteros.
export const ENTEROS = {
  'api/_lib/estado-producto.js': P.asistente,
};

const marcas = (id, js) => js ? [`/*estado:${id}*/`, `/*/estado:${id}*/`] : [`<!--estado:${id}-->`, `<!--/estado:${id}-->`];

/** Devuelve { texto, faltan } con cada región rehecha a partir de cfg. */
export function rehaz(texto, def, cfg) {
  const faltan = [];
  for (const [id, fn] of Object.entries(def.r)) {
    const [a, b] = marcas(id, def.js);
    const i = texto.indexOf(a), j = texto.indexOf(b);
    if (i < 0 || j < 0 || j < i || texto.indexOf(a, i + 1) >= 0) { faltan.push(id); continue; }
    const dentro = fn(cfg, def.lang, texto);
    texto = texto.slice(0, i + a.length) + dentro + texto.slice(j);
  }
  return { texto, faltan };
}

/** Quita el contenido de todas las regiones (para barrer lo escrito a mano). */
export function sinRegiones(texto) {
  return texto
    .replace(/<!--estado:([\w-]+)-->[\s\S]*?<!--\/estado:\1-->/g, ' ')
    .replace(/\/\*estado:([\w-]+)\*\/[\s\S]*?\/\*\/estado:\1\*\//g, ' ');
}

export const lee = (rel) => fs.readFileSync(path.join(RAIZ, rel), 'utf8');
export const escribe = (rel, t) => fs.writeFileSync(path.join(RAIZ, rel), t);
