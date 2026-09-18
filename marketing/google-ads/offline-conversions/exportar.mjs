#!/usr/bin/env node
// Uso: node marketing/google-ads/offline-conversions/exportar.mjs leads.csv|leads.json [salida.csv]
// Entrada: export de la tabla Leads de Airtable (CSV con cabeceras = nombres
// de columna) o JSON [{id, fields}]. Salida: CSV listo para
// Google Ads → Objetivos → Conversiones → Subidas.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { generarConversiones, aCsv } = require('./conversiones.cjs');

function parseCsv(txt) {
  const filas = []; let fila = []; let celda = ''; let q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) { if (c === '"' && txt[i + 1] === '"') { celda += '"'; i++; } else if (c === '"') q = false; else celda += c; }
    else if (c === '"') q = true;
    else if (c === ',') { fila.push(celda); celda = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && txt[i + 1] === '\n') i++; fila.push(celda); filas.push(fila); fila = []; celda = ''; }
    else celda += c;
  }
  if (celda || fila.length) { fila.push(celda); filas.push(fila); }
  const [cab, ...resto] = filas.filter((f) => f.some((x) => x !== ''));
  return resto.map((f, i) => ({ id: `fila${i + 2}`, fields: Object.fromEntries(cab.map((h, j) => [h.replace(/^﻿/, ''), f[j] ?? ''])) }));
}

const [entrada, salida = 'conversiones-offline.csv'] = process.argv.slice(2);
if (!entrada) { console.error('Uso: exportar.mjs leads.csv|leads.json [salida.csv]'); process.exit(1); }
const txt = readFileSync(entrada, 'utf8');
const registros = entrada.endsWith('.json') ? JSON.parse(txt) : parseCsv(txt);
const r = generarConversiones(registros);
writeFileSync(salida, aCsv(r.filas));
console.log(`${r.filas.length} conversiones → ${salida}`);
r.avisos.forEach((a) => console.log(`  ! ${a}`));
if (r.braid.length) console.log(`  ${r.braid.length} conversiones con GBRAID/WBRAID: subir por Data Manager (no caben en esta plantilla).`);
if (r.paraMarcar.length) {
  console.log('\nDespués de subirlo, marca en Airtable «Conversiones enviadas»:');
  r.paraMarcar.forEach((m) => console.log(`  · ${m.empresa} (${m.id}) → ${m.conversion}`));
}
