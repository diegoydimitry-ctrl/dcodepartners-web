#!/usr/bin/env node
// Genera, a partir de los CSV del estudio (que NO se modifican), los
// borradores de la campaña: mapa keyword → grupo → anuncio → landing → demo
// y ficheros para Google Ads Editor, todo en estado PAUSADO y con cada
// texto marcado como LISTO / CONDICIONADO / BLOQUEADO.
//   node marketing/google-ads/campana/generar-borradores.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const GA = path.resolve(AQUI, '..');
const RAIZ = path.resolve(GA, '../..');
const { LANDINGS } = require(path.join(RAIZ, 'api/_lib/ads/landings.js'));
const DEMOS = require(path.join(RAIZ, 'assets/ads/demos.js'));
const DOMINIO = 'https://dcodepartners.com';

export function leerCsv(f, sep = ';') {
  const txt = readFileSync(f, 'utf8').replace(/^﻿/, '');
  const filas = []; let fila = []; let celda = ''; let q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) { if (c === '"' && txt[i + 1] === '"') { celda += '"'; i++; } else if (c === '"') q = false; else celda += c; }
    else if (c === '"') q = true;
    else if (c === sep) { fila.push(celda); celda = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && txt[i + 1] === '\n') i++; fila.push(celda); filas.push(fila); fila = []; celda = ''; }
    else celda += c;
  }
  if (celda || fila.length) { fila.push(celda); filas.push(fila); }
  const [cab, ...resto] = filas.filter((x) => x.some((v) => v !== ''));
  return resto.map((c) => Object.fromEntries(cab.map((h, i) => [h, c[i] ?? ''])));
}
const csv = (filas, sep = ',') => filas.map((f) => f.map((v) => {
  const s = String(v ?? '');
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}).join(sep)).join('\n') + '\n';

// Estado de cada condición del borrador de anuncios, a 18/09/2026.
export const CONDICIONES = [
  { patron: /precio/i, cond: /Solo si la landing publica precios|Reconciliar PRICING/i, estado: 'BLOQUEADO', motivo: 'Las landings no publican precios y el pricing está sin reconciliar (19/08 vs 18/09).' },
  { cond: /^Ídem$/, estado: null },
  { cond: /Solo cuando exista el vídeo/i, estado: 'CONDICIONADO', motivo: 'Demo y vídeo existen en la Preview; se pueden usar cuando las landings estén publicadas en producción.' },
  { cond: /Verificar que el generador está activo/i, estado: 'LISTO', motivo: 'CM/Generador de Propuestas IA activo en n8n (export 13/09/2026); la landing dice que la propuesta es un borrador revisado por una persona.' },
  { cond: /Modelo 3/i, estado: 'BLOQUEADO', motivo: 'La web actual no promete prueba sin factura (condiciones caso a caso). Decisión de Dirección pendiente.' },
];
const GRATUITO = /gratuit|sin compromiso|30 d[ií]as|sin factura|precios publicados|^precios$/i;

export function estadoTexto(texto, condicion) {
  if (/demo real/i.test(texto)) {
    return { estado: 'BLOQUEADO', motivo: 'La demo es un recorrido con datos inventados: no se puede llamar «demo real».' };
  }
  if (/recibe su propuesta/i.test(texto)) {
    return { estado: 'BLOQUEADO', motivo: 'Da a entender que la propuesta se envía sola; para google_ads la propuesta es un borrador interno hasta el diagnóstico.' };
  }
  if (GRATUITO.test(texto)) {
    if (/gratuit|sin compromiso/i.test(texto)) return { estado: 'BLOQUEADO', motivo: 'Que el diagnóstico sea gratuito no está publicado en la web ni confirmado: decisión pendiente.' };
    return { estado: 'BLOQUEADO', motivo: 'Depende de prueba sin factura o de precios publicados: no confirmado.' };
  }
  if (!condicion) return { estado: 'LISTO', motivo: '' };
  if (/^Ídem$/.test(condicion)) {
    // «Ídem» en el borrador remite a la condición del mismo tipo de texto.
    if (/€|precio/i.test(texto)) return { estado: 'BLOQUEADO', motivo: CONDICIONES[0].motivo };
    if (/demo|v[ií]deo|funciona/i.test(texto)) return { estado: 'CONDICIONADO', motivo: CONDICIONES[2].motivo };
    return { estado: 'BLOQUEADO', motivo: 'Condición «Ídem» sin resolver' };
  }
  for (const c of CONDICIONES) if (c.cond.test(condicion) && c.estado) return { estado: c.estado, motivo: c.motivo };
  return { estado: 'BLOQUEADO', motivo: `Condición no resuelta: ${condicion}` };
}

const GRUPO_LANDING = {
  GA1: '/automatizacion-procesos', GA2: '/automatizacion-seguimiento-comercial', GA3: '/automatizacion-atencion-clientes',
};
const LANDING_GRUPO = Object.fromEntries(Object.entries(GRUPO_LANDING).map(([g, l]) => [l, g]));
const NOMBRE_GRUPO = { GA1: 'GA1 Proveedor de automatizacion', GA2: 'GA2 Seguimiento comercial', GA3: 'GA3 Consultas de clientes', MARCA: 'MARCA D-Code' };
const CAMPANA = 'DCODE Search Fase1 Madrid (BORRADOR)';
const CAMPANA_MARCA = 'DCODE Search Marca (BORRADOR)';

export function construir() {
  const kws = leerCsv(path.join(GA, '03_keywords_candidatas.csv'));
  const negs = leerCsv(path.join(GA, '04_keywords_negativas.csv'));
  // 07 es el borrador del estudio (no se toca). 07b añade textos nuevos que
  // hicieron falta al revisar el 07 contra las reglas (motivo en cada fila).
  const ads = [...leerCsv(path.join(GA, '07_anuncios_borrador.csv')), ...leerCsv(path.join(GA, '07b_anuncios_complemento.csv'))];

  // ── keywords de la Fase 1 ──
  const mapa = [];
  for (const k of kws.filter((x) => x.fase_test.startsWith('Fase 1'))) {
    const marca = /d-code/i.test(k.keyword);
    const landing = marca ? '/automatizacion-procesos' : k.landing_propuesta;
    const grupo = marca ? 'MARCA' : LANDING_GRUPO[landing];
    if (!grupo) throw new Error(`Keyword sin grupo: ${k.keyword}`);
    const tipo = k.concordancia_propuesta.toLowerCase().startsWith('exact') ? 'Exact' : k.concordancia_propuesta.toLowerCase().startsWith('frase') ? 'Phrase' : null;
    if (!tipo) throw new Error(`Concordancia no permitida (${k.concordancia_propuesta}) en ${k.keyword}`);
    mapa.push({ keyword: k.keyword, concordancia: tipo, grupo, anuncio: `RSA-${grupo === 'MARCA' ? 'GA1' : grupo}`, landing, demo: LANDINGS[landing].demo, riesgo: k.riesgo });
  }
  // La variante sin guion de la marca.
  if (mapa.some((m) => m.grupo === 'MARCA')) mapa.push({ ...mapa.find((m) => m.grupo === 'MARCA'), keyword: 'dcode partners' });

  // ── anuncios ──
  const rsa = {};
  const textos = [];
  for (const a of ads) {
    const g = a.grupo.slice(0, 3);
    const e = estadoTexto(a.texto, a.condicion_antes_de_usar);
    textos.push({ ...a, estado: e.estado, motivo: e.motivo });
    if (a.elemento === 'Título' || a.elemento === 'Descripción') {
      rsa[g] = rsa[g] || { titulos: [], descripciones: [] };
      if (e.estado !== 'BLOQUEADO') rsa[g][a.elemento === 'Título' ? 'titulos' : 'descripciones'].push({ texto: a.texto, estado: e.estado });
    }
  }
  return { mapa, rsa, textos, negs };
}

function escribir() {
  const { mapa, rsa, textos, negs } = construir();
  const out = path.join(GA, 'campana');
  const ed = path.join(out, 'editor');
  mkdirSync(ed, { recursive: true });

  writeFileSync(path.join(out, 'mapa-keyword-grupo-anuncio-landing-demo.csv'), '﻿' + csv([
    ['keyword', 'concordancia', 'grupo', 'anuncio', 'landing', 'url_final', 'demo', 'video', 'estado', 'riesgo'],
    ...mapa.map((m) => [m.keyword, m.concordancia, NOMBRE_GRUPO[m.grupo], m.anuncio, m.landing, DOMINIO + m.landing, m.demo,
      existsSync(path.join(RAIZ, `assets/ads/video/demo-${m.demo}.mp4`)) ? `demo-${m.demo}.mp4` : 'NO GENERADO', 'BORRADOR · PAUSADO', m.riesgo]),
  ], ';'));

  writeFileSync(path.join(out, 'anuncios-estado.csv'), '﻿' + csv([
    ['grupo', 'elemento', 'n', 'texto', 'caracteres', 'limite', 'condicion_original', 'estado', 'motivo'],
    ...textos.map((t) => [t.grupo, t.elemento, t.n, t.texto, t.caracteres, t.limite, t.condicion_antes_de_usar, t.estado, t.motivo]),
  ], ';'));

  // Google Ads Editor (importación): todo PAUSADO.
  writeFileSync(path.join(ed, 'keywords.csv'), csv([
    ['Campaign', 'Ad Group', 'Keyword', 'Criterion Type', 'Final URL', 'Status'],
    ...mapa.map((m) => [m.grupo === 'MARCA' ? CAMPANA_MARCA : CAMPANA, NOMBRE_GRUPO[m.grupo], m.keyword, m.concordancia, DOMINIO + m.landing, 'Paused']),
  ]));
  writeFileSync(path.join(ed, 'negativas-DCODE-BASE.csv'), csv([
    ['Shared Set Name', 'Keyword', 'Criterion Type'],
    ...negs.map((n) => ['DCODE-BASE', n.negativa, n.concordancia_negativa.startsWith('Frase') ? 'Negative Phrase' : 'Negative Broad']),
  ]));
  const cab = ['Campaign', 'Ad Group', 'Ad type', ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`), ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`), 'Path 1', 'Path 2', 'Final URL', 'Status'];
  const filasRsa = [];
  const paths = { GA1: ['automatizacion', 'demo'], GA2: ['seguimiento', 'demo'], GA3: ['consultas', 'demo'] };
  for (const [g, r] of Object.entries(rsa)) {
    const soloListos = r.titulos.filter((t) => t.estado === 'LISTO').map((t) => t.texto);
    const conCondicionados = r.titulos.map((t) => t.texto);
    const descL = r.descripciones.filter((d) => d.estado === 'LISTO').map((d) => d.texto);
    const descC = r.descripciones.map((d) => d.texto);
    for (const [variante, tit, desc] of [['A (solo LISTO)', soloListos, descL], ['B (LISTO + CONDICIONADO: exige landings en producción)', conCondicionados, descC]]) {
      if (tit.length < 3 || desc.length < 2) throw new Error(`${g} ${variante}: menos de 3 títulos o 2 descripciones utilizables`);
      filasRsa.push([CAMPANA, NOMBRE_GRUPO[g], `Responsive search ad · ${variante}`,
        ...Array.from({ length: 15 }, (_, i) => tit[i] || ''), ...Array.from({ length: 4 }, (_, i) => desc[i] || ''),
        ...paths[g], DOMINIO + GRUPO_LANDING[g], 'Paused']);
    }
  }
  writeFileSync(path.join(ed, 'anuncios-rsa.csv'), csv([cab, ...filasRsa]));
  const listos = textos.filter((t) => t.estado === 'LISTO').length;
  const cond = textos.filter((t) => t.estado === 'CONDICIONADO').length;
  const bloq = textos.filter((t) => t.estado === 'BLOQUEADO').length;
  console.log(`keywords Fase 1: ${mapa.length} · negativas: ${negs.length} · textos: ${listos} LISTO, ${cond} CONDICIONADO, ${bloq} BLOQUEADO · RSA: ${filasRsa.length}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) escribir();
