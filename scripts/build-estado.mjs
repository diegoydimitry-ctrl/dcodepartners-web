#!/usr/bin/env node
/*
 * Escribe en la web lo que estado-producto.json permite decir sobre
 * VERI*FACTU y la conciliación bancaria. Si el fichero no se sostiene
 * (un estado sin su prueba, una fecha futura), no escribe NADA: una web a
 * medio actualizar es peor que una web que no se ha tocado.
 *
 * Uso:  node scripts/build-estado.mjs      (lo llama npm run sync-content)
 */
import { carga } from './estado/modelo.mjs';
import { REGIONES, ENTEROS, rehaz, lee, escribe } from './estado/regiones.mjs';

const { cfg, errores, avisos } = carga();
for (const a of avisos) console.warn('  aviso · ' + a);
if (errores.length) {
  console.error('✗ estado-producto.json no se sostiene; no se escribe nada:\n  ' + errores.join('\n  '));
  process.exit(1);
}

const cambios = [];
const pendientes = [];
for (const [rel, def] of Object.entries(REGIONES)) {
  const antes = lee(rel);
  const { texto, faltan } = rehaz(antes, def, cfg);
  if (faltan.length) { console.error(`✗ ${rel}: faltan las regiones ${faltan.join(', ')}`); process.exit(1); }
  if (texto !== antes) pendientes.push([rel, texto]);
}
for (const [rel, fn] of Object.entries(ENTEROS)) {
  const nuevo = fn(cfg);
  let antes = null; try { antes = lee(rel); } catch {}
  if (nuevo !== antes) pendientes.push([rel, nuevo]);
}
for (const [rel, texto] of pendientes) { escribe(rel, texto); cambios.push(rel); }

console.log(`✓ Estado de producto · VERI*FACTU: ${cfg.verifactu.estado} · conciliación: ${cfg.conciliacion.estado}` +
  (cambios.length ? ` · reescritos: ${cambios.join(', ')}` : ' · nada que cambiar'));
