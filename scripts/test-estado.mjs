#!/usr/bin/env node
/*
 * Pruebas del mecanismo de estado de producto, sobre una COPIA del repo en
 * un directorio temporal: nunca toca los ficheros de verdad.
 *
 * Demuestra que el estado no se puede adelantar sin prueba, que la web no
 * se puede retocar a mano sin que el centinela lo vea, y que cuando la
 * prueba existe la web cambia sola. Las pruebas que se inventan aquí son
 * FICTICIAS y viven solo en la copia temporal.
 *
 * Uso:  node scripts/test-estado.mjs      (npm run test:estado)
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { RAIZ } from './estado/modelo.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'estado-'));
const ficheros = execSync('git ls-files -z --cached --others --exclude-standard', { cwd: RAIZ }).toString().split('\0').filter(Boolean);
for (const f of ficheros) {
  const d = path.join(tmp, f);
  if (!fs.existsSync(path.join(RAIZ, f))) continue;
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.copyFileSync(path.join(RAIZ, f), d);
}
const ORIG = JSON.parse(fs.readFileSync(path.join(tmp, 'estado-producto.json'), 'utf8'));
const lee = (f) => fs.readFileSync(path.join(tmp, f), 'utf8');
const escribe = (f, t) => fs.writeFileSync(path.join(tmp, f), t);
const pon = (cfg) => escribe('estado-producto.json', JSON.stringify(cfg, null, 2));
const corre = (s) => { const r = spawnSync('node', [`scripts/${s}`], { cwd: tmp, encoding: 'utf8' }); return { ok: r.status === 0, out: r.stdout + r.stderr }; };
const copia = () => JSON.parse(JSON.stringify(ORIG));
const restaura = (...fs_) => { for (const f of fs_) escribe(f, fs.readFileSync(path.join(RAIZ, f), 'utf8')); pon(ORIG); corre('build-estado.mjs'); };

const resultados = [];
function caso(nombre, cond, detalle = '') { resultados.push([cond, nombre, detalle]); }

// 1. No se puede subir de estado sin la prueba.
{ const c = copia(); c.verifactu.estado = 'integrado'; pon(c);
  const b = corre('build-estado.mjs'), k = corre('check-estado.mjs');
  caso('«integrado» sin prueba: ni se genera ni pasa el centinela', !b.ok && !k.ok && /remisionPruebas: falta la prueba/.test(b.out) && /validacion: falta la prueba/.test(k.out)); }
// 2. Una prueba con fecha futura no vale.
{ const c = copia(); c.verifactu.estado = 'en-validacion';
  c.verifactu.evidencia.remisionPruebas = { fecha: '2999-01-01', entorno: 'preproduccion', referencia: 'PRUEBA-FICTICIA', respuesta: 'Correcto', commit: 'abcdef1' }; pon(c);
  const b = corre('build-estado.mjs'); caso('una prueba con fecha futura no vale', !b.ok && /fecha futura/.test(b.out)); }
// 3. Con la prueba, la web cambia sola.
{ const c = copia(); c.verifactu.estado = 'en-validacion';
  c.verifactu.evidencia.remisionPruebas = { fecha: ORIG.revisado, entorno: 'preproduccion', referencia: 'PRUEBA-FICTICIA', respuesta: 'Correcto', commit: 'abcdef1' }; pon(c);
  const b = corre('build-estado.mjs'), k = corre('check-estado.mjs'), h = lee('sistema-financiero.html'), d = lee('assets/js/finance-demo.js');
  caso('con la prueba: se genera, pasa, y la web y la demo cambian solas', b.ok && k.ok && h.includes('Integración VERI*FACTU en validación') && h.includes('es-hecho') && d.includes('"verifactu":"en-validacion"'));
  restaura(); }
// 4. Retocar a mano una región.
{ escribe('index.html', lee('index.html').replace('<span>Preparado para VERI*FACTU</span>', '<span>VERI*FACTU integrado</span>'));
  const k = corre('check-estado.mjs'); caso('retoque a mano de una región: el centinela lo ve', !k.ok && /index\.html: el contenido no coincide/.test(k.out)); restaura('index.html'); }
// 5. Afirmación prohibida en cualquier página.
{ escribe('garantias.html', lee('garantias.html').replace('</main>', '<p>Software 100% conforme y homologado.</p></main>'));
  const k = corre('check-estado.mjs'); caso('«100 % conforme / homologado» en cualquier página: falla', !k.ok && /garantias\.html: afirmación prohibida/.test(k.out)); restaura('garantias.html'); }
// 6. Un estado no alcanzado, escrito a mano fuera de las regiones.
{ escribe('sistema-financiero.html', lee('sistema-financiero.html').replace('<span class="eyebrow">Qué resuelve</span>', '<span class="eyebrow">VERI*FACTU operativo</span>'));
  const k = corre('check-estado.mjs'); caso('un estado no alcanzado escrito a mano: falla', !k.ok && /fuera de las regiones generadas/.test(k.out)); restaura('sistema-financiero.html'); }
// 7. Planes no acumulativos.
{ const c = copia(); c.conciliacion.incluidaEn = ['finance-ia']; pon(c);
  const k = corre('check-estado.mjs'); caso('conciliación en un plan y no en el de encima: falla', !k.ok && /acumulativos/.test(k.out)); restaura(); }
// 8. Borrar una región para escribir a mano.
{ escribe('en/cambios-en-proceso.html', lee('en/cambios-en-proceso.html').replace('<!--estado:vf-frase-->', ''));
  const k = corre('check-estado.mjs'); caso('borrar una región: falla', !k.ok && /faltan las regiones vf-frase/.test(k.out)); restaura('en/cambios-en-proceso.html'); }
// 9. Conciliación disponible: la web pasa a presente.
{ const c = copia(); c.conciliacion.estado = 'disponible'; const e = c.conciliacion.evidencia, f = ORIG.revisado;
  e.desarrollo = { fecha: f, rama: 'rama-ficticia', commit: 'abcdef1' }; e.pruebas = { fecha: f, informe: 'informe-ficticio', commit: 'abcdef2' }; e.disponible = { fecha: f, commit: 'abcdef3', entorno: 'produccion' }; pon(c);
  const b = corre('build-estado.mjs'), k = corre('check-estado.mjs'), h = lee('sistema-financiero.html'), d = lee('assets/js/finance-demo.js');
  caso('conciliación «disponible» con pruebas: presente en la web y en la demo', b.ok && k.ok && h.includes('Cruza el extracto del banco') && !h.includes('Así funcionará') && d.includes('"conciliacion":"disponible"'));
  restaura(); }
// 10. Y de vuelta al estado real, todo en verde.
{ const k = corre('check-estado.mjs'); caso('de vuelta al estado real: en verde', k.ok); }

fs.rmSync(tmp, { recursive: true, force: true });
for (const [ok, n] of resultados) console.log(`${ok ? '✓' : '✗'} ${n}`);
const mal = resultados.filter((r) => !r[0]).length;
if (mal) { console.error(`✗ test:estado — ${mal} de ${resultados.length} fallan`); process.exit(1); }
console.log(`✓ test:estado — ${resultados.length} de ${resultados.length}`);
