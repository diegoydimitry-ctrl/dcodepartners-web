/* Lanza varias grabaciones una detrás de otra: node cola.mjs <base> nombre|url|t0|t1 ... */
import { spawnSync } from 'node:child_process'
const [base, ...trabajos] = process.argv.slice(2)
for (const tr of trabajos) {
  const [nombre, url, t0, t1] = tr.split('|')
  const r = spawnSync('node', [`${base}/herramientas/grabar.mjs`, url, `${base}/cap/${nombre}`, t0, t1, '30'], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', maxBuffer: 1 << 26 })
  console.log(`== ${nombre} (salida ${r.status})\n${(r.stdout || '').split('\n').slice(-3).join('\n')}${(r.stderr || '').slice(-1500)}`)
}
console.log('COLA TERMINADA')
