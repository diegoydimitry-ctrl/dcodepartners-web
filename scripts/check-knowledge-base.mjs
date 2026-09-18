#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════════════
 * LO QUE EL ASISTENTE SABE TIENE QUE SER LO QUE LA WEB DICE
 * ══════════════════════════════════════════════════════════════════════════
 *
 * EL FALLO QUE ESTE CENTINELA NO HABRÍA DEJADO PASAR
 *
 * `assets/data/knowledge-base.json` es lo único que el chatbot sabe: se
 * genera a partir del texto real de las páginas y viaja en el contexto de
 * cada respuesta. El generador dice de sí mismo que «se ejecuta
 * automáticamente en cada `npm run build` (ver vercel.json)». No es cierto:
 * el proyecto de Vercel no tiene framework ni comando de construcción —esa
 * misma ausencia es la que publicaba como estático todo lo versionado—, así
 * que en un despliegue no se ejecuta nada. Lo que se sirve es el fichero tal
 * y como esté en el repositorio.
 *
 * Consecuencia real, medida el 18-09-2026: el fichero se generó el 01-09 y
 * el 16-09 se rediseñó `/conocenos`. Durante diecisiete días el asistente
 * respondía que el cargo de un fundador era «D.S.» —el monograma que había
 * antes en el hueco de la foto— en vez de «Estrategia y alianzas». Nadie
 * podía verlo: la página estaba bien, el JSON estaba bien formado, y ninguna
 * prueba comparaba una cosa con la otra.
 *
 * QUÉ COMPRUEBA
 *
 * Regenera la base de conocimiento a partir del HTML actual y la compara con
 * la versionada, ignorando `generatedAt` —que cambia en cada ejecución y no
 * es contenido—. Si difieren, el asistente está contestando con texto que la
 * web ya no dice, y se arregla con `npm run generate-kb`.
 *
 * NO deja el árbol tocado: el fichero se restaura siempre, pase o falle.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RUTA = path.join(RAIZ, 'assets/data/knowledge-base.json');

/** El contenido que importa: todo menos la marca de tiempo de generación. */
function contenido(json) {
  const { generatedAt: _ignorado, ...resto } = json;
  return JSON.stringify(resto);
}

const versionada = readFileSync(RUTA, 'utf8');

let regenerada;
try {
  execFileSync(process.execPath, [path.join(RAIZ, 'scripts/build-knowledge-base.js')], {
    cwd: RAIZ,
    stdio: 'pipe',
  });
  regenerada = readFileSync(RUTA, 'utf8');
} finally {
  // Pase lo que pase, el repositorio se queda como estaba.
  writeFileSync(RUTA, versionada);
}

const antes = JSON.parse(versionada);
const ahora = JSON.parse(regenerada);

const paginas = ahora.pageCount ?? ahora.pages?.length ?? 0;
const trozos = ahora.chunkCount ?? 0;

/*
  Contar cero páginas significaría que el generador se ha roto —una carpeta
  que se movió, un selector que dejó de casar—, no que todo esté al día.
*/
if (paginas === 0) {
  console.error('\n✗ el generador no ha encontrado ninguna página: está roto, no al día\n');
  process.exit(1);
}

if (contenido(antes) === contenido(ahora)) {
  console.log(
    `Base de conocimiento del asistente: ${paginas} páginas · ${trozos} fragmentos · generada el ${String(antes.generatedAt).slice(0, 10)}.`,
  );
  console.log('✓ el asistente sabe exactamente lo que dice la web.');
  process.exit(0);
}

/* Qué ha cambiado, con nombre y apellidos, para no tener que diffear 260 KB. */
const porUrl = (j) => new Map((j.pages ?? []).map((p) => [p.url ?? p.path ?? p.title, JSON.stringify(p)]));
const a = porUrl(antes);
const b = porUrl(ahora);
const cambiadas = [...b.keys()].filter((k) => a.has(k) && a.get(k) !== b.get(k));
const nuevas = [...b.keys()].filter((k) => !a.has(k));
const retiradas = [...a.keys()].filter((k) => !b.has(k));

console.error('\n✗ la base de conocimiento del asistente no coincide con el contenido de la web.');
console.error(`  versionada: ${String(antes.generatedAt).slice(0, 10)} · ${antes.pageCount ?? antes.pages?.length} páginas`);
console.error(`  regenerada: ${paginas} páginas`);
for (const u of cambiadas.slice(0, 12)) console.error(`  · cambia:   ${u}`);
if (cambiadas.length > 12) console.error(`  · … y ${cambiadas.length - 12} más`);
for (const u of nuevas.slice(0, 8)) console.error(`  · nueva:    ${u}`);
for (const u of retiradas.slice(0, 8)) console.error(`  · retirada: ${u}`);
console.error('\n  El asistente responde con texto que la web ya no dice.');
console.error('  Arréglalo con:  npm run generate-kb\n');
process.exit(1);
