/**
 * ══════════════════════════════════════════════════════════════════════════
 * QUÉ CAMBIA EN LA SUPERFICIE PÚBLICA ENTRE DOS REFERENCIAS
 * ══════════════════════════════════════════════════════════════════════════
 *
 * `check:superficie` contesta «¿se publica hoy algo interno?». Esta contesta
 * la pregunta que hay que responder ANTES de fusionar: «¿qué deja de estar
 * publicado, exactamente, y qué empieza a estarlo?».
 *
 * Aplica la misma lógica que @vercel/client —`git ls-files` + `.vercelignore`
 * de CADA referencia— y compara los dos conjuntos. Nada de suposiciones: si
 * una rama trae su propio `.vercelignore`, se usa el suyo.
 *
 * Uso:  npm run superficie:diff -- main seguridad/superficie-despliegue
 *
 * Un matiz que evita leer mal el resultado: lo que hay bajo `api/` NO se
 * sirve como estático. Vercel lo mete dentro del bundle de la función y
 * pedirlo por HTTP devuelve 404. Por eso el fichero que se movió a
 * `api/_lib/` figura como «entra» y sin embargo deja de ser superficie
 * pública: es justo el sitio al que se movió para dejar de serlo.
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { deployedFiles } from './check-deploy-surface.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

function superficie(ref) {
  const ficheros = git('ls-tree', '-r', '--name-only', ref).split('\n').filter(Boolean);
  /*
    Una referencia puede no tener `.vercelignore` —`main` es justo ese caso, y
    por eso publica 123 de 124 ficheros—. Se pregunta primero si el fichero
    existe en ese árbol para no ensuciar la salida con el error de git.
  */
  const tiene = git('ls-tree', '-r', '--name-only', ref).split('\n').includes('.vercelignore');
  const ignore = tiene ? git('show', `${ref}:.vercelignore`) : '';
  return { ficheros, desplegados: new Set(deployedFiles(ficheros, ignore)) };
}

const [refA, refB] = process.argv.slice(2);
const a = superficie(refA);
const b = superficie(refB);

const salen = [...a.desplegados].filter((f) => !b.desplegados.has(f)).sort();
const entran = [...b.desplegados].filter((f) => !a.desplegados.has(f)).sort();

const familia = (f) => {
  if (f.startsWith('docs/')) return 'docs/';
  if (f.startsWith('scripts/')) return 'scripts/';
  if (f.startsWith('.github/')) return '.github/';
  if (f.startsWith('automation/')) return 'automation/';
  if (f.startsWith('lib/')) return 'lib/';
  if (/^[^/]+\.md$/.test(f)) return '*.md en la raíz';
  if (/\.(yml|yaml)$/.test(f)) return '*.yml';
  return 'otros';
};

const porFamilia = {};
for (const f of salen) (porFamilia[familia(f)] ??= []).push(f);

console.log(`SUPERFICIE PÚBLICA · ${refA} → ${refB}\n`);
console.log(`  ${refA}: ${a.ficheros.length} ficheros versionados · ${a.desplegados.size} publicados`);
console.log(`  ${refB}: ${b.ficheros.length} ficheros versionados · ${b.desplegados.size} publicados`);
console.log(`\n  DEJAN DE PUBLICARSE: ${salen.length}`);
for (const [fam, fs] of Object.entries(porFamilia).sort((x, y) => y[1].length - x[1].length)) {
  console.log(`\n  ── ${fam} (${fs.length})`);
  for (const f of fs.slice(0, 14)) console.log(`     ${f}`);
  if (fs.length > 14) console.log(`     … y ${fs.length - 14} más`);
}
/*
  Matiz que evita una lectura equivocada: lo que hay bajo `api/` NO se sirve
  como estático. Vercel lo usa para construir las funciones y lo mete DENTRO
  del bundle; pedirlo por HTTP devuelve 404. Por eso `api/_lib/providers.js`
  aparece aquí como "entra" y sin embargo no es superficie pública: es
  exactamente el sitio al que se movió el fichero para dejar de serlo.
  Comprobado con `vercel build` y con una petición real al Preview.
*/
const sonEstaticos = (f) => !f.startsWith('api/');
console.log(`\n  EMPIEZAN A PUBLICARSE: ${entran.filter(sonEstaticos).length} como estático` +
  (entran.some((f) => !sonEstaticos(f)) ? `, ${entran.filter((f) => !sonEstaticos(f)).length} dentro de una función (no accesible por HTTP)` : ''));
for (const f of entran) console.log(`     ${f}${sonEstaticos(f) ? '' : '   ← dentro de la función, responde 404'}`);
