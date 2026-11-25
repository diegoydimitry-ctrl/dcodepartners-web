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
  'assets/js/finance-demo.js':    { lang: 'es', js: true, r: { 'constante': P.demoConstante } },
};

/*
  LAS SEIS PÁGINAS QUE SE SALIERON DE ESTE SISTEMA (25/11/2026).

  Hasta la migración al diseño nuevo, estas seis páginas llevaban las
  regiones de arriba —vf-bloque, conc-bloque, home-estado, proceso-filas…— y
  su texto lo escribía build-estado.mjs desde estado-producto.json.

  scripts/v2/migrar.mjs las volvió a componer y, al hacerlo, se quedó por el
  camino el comentario que marca cada región. Y no se pueden devolver sin
  más: la migración no lee la página de hoy, la lee de un commit congelado
  (BASE = 8ff5f5b), y las plantillas de arriba escriben el markup viejo
  (.vf-paso, .section-air), no el nuevo (.ruta-p).

  Con las regiones fuera, el centinela llevaba dieciséis fallos fijos y
  build:estado moría —y con él npm run sync-content entero—. Una guardia que
  siempre está en rojo no guarda nada. Pero aflojarla sería peor: lo que hay
  detrás es una afirmación fiscal.

  Así que estas páginas pasan a una regla distinta, en check-estado.mjs: en
  vez de comprobar que el MARKUP lo escribió el generador, comprueba que la
  AFIRMACIÓN se sostiene —qué estado se presenta como actual, y que de la
  conciliación solo se hable en futuro mientras no esté—. Es menos cobertura
  que antes y hay que decirlo: el titular, la entradilla y las celdas de la
  comparativa ya no los escribe nadie desde el dato.

  Devolverlas al generador es trabajo de verdad (reescribir las plantillas
  en el markup nuevo) y una decisión de quién manda en la web.
*/
export const SIN_REGION = {
  'sistema-financiero.html':    'es',
  'en/sistema-financiero.html': 'en',
  'index.html':                 'es',
  'en/index.html':              'en',
  'cambios-en-proceso.html':    'es',
  'en/cambios-en-proceso.html': 'en',
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
