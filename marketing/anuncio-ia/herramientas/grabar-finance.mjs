/*
 * Graba D-Code Finance (la demo de verdad, en local, con datos inventados) en
 * tamaño de teléfono: 360×640 a 3x = 1080×1920. Cada acción es real (clic,
 * scroll, cambio de vista); se hace foto tras cada pequeño paso para que el
 * vídeo salga fluido. Un círculo marca dónde se toca.
 */
import { pathToFileURL } from 'node:url'; import fs from 'node:fs'
const dir = process.argv[2]
fs.mkdirSync(dir, { recursive: true })
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const b = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH })
const ctx = await b.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'es-ES' })
const p = await ctx.newPage()
const BASE = 'http://127.0.0.1:4800'
let n = 0
const foto = async (veces = 1) => { const buf = await p.screenshot({ type: 'jpeg', quality: 93, timeout: 120000 }); for (let i = 0; i < veces; i++) fs.writeFileSync(`${dir}/f${String(n++).padStart(5, '0')}.jpg`, buf) }
const toque = `
  (() => { if (document.getElementById('__toque')) return;
    const d = document.createElement('div'); d.id = '__toque';
    d.style.cssText = 'position:fixed;z-index:2147483647;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(17,18,20,.18);border:2px solid rgba(17,18,20,.55);pointer-events:none;opacity:0;transition:none';
    document.documentElement.appendChild(d) })()`
const ponToque = (x, y, o, s) => p.evaluate(([x, y, o, s]) => { const d = document.getElementById('__toque'); if (!d) return; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.opacity = o; d.style.transform = `scale(${s})` }, [x, y, o, s])
async function tocar(loc, tras = async () => {}) {
  await p.evaluate(toque)
  const bb = await loc.boundingBox(); const x = bb.x + bb.width / 2, y = bb.y + bb.height / 2
  for (let i = 0; i < 6; i++) { await ponToque(x, y, i / 6, 1.3 - i * 0.05); await foto() }
  for (let i = 0; i < 4; i++) { await ponToque(x, y, 1, 1 - i * 0.08); await foto() }
  await loc.click()
  await tras()
  await p.evaluate(toque)
  for (let i = 0; i < 4; i++) { await ponToque(x, y, 1 - i / 4, 0.7 + i * 0.15); await foto() }
  await ponToque(x, y, 0, 1)
}
// el contenedor que de verdad hace scroll (la app puede usar uno interior)
const contenedor = `(() => { const c = [...document.querySelectorAll('*')].filter((e) => { const s = getComputedStyle(e); return /(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 40 }).sort((a, b) => b.clientHeight - a.clientHeight)[0]; return c || document.scrollingElement })()`
async function deslizar(hasta, fotogramas) {
  const desde = await p.evaluate(`${contenedor}.scrollTop`)
  for (let i = 1; i <= fotogramas; i++) {
    const u = i / fotogramas, s = u * u * (3 - 2 * u)
    await p.evaluate(`${contenedor}.scrollTop = ${desde + (hasta - desde) * s}`)
    await foto()
  }
}
const esperar = async () => { await p.waitForLoadState('networkidle').catch(() => {}); await p.evaluate(() => document.fonts.ready) }

// 1 · Entrar
await p.goto(BASE + '/login'); await esperar()
await foto(10)
await tocar(p.getByRole('button', { name: /^entrar$/i }), async () => { await p.waitForURL('**/dashboard'); await esperar() })
await foto(14)
// 2 · El panel: bajar despacio por los números
await deslizar(420, 36); await foto(8)
await deslizar(900, 30); await foto(8)
// 3 · Tesorería: cambiar el horizonte de 30 a 60 y 90 días
await p.goto(BASE + '/tesoreria'); await esperar()
await foto(12)
for (const d of ['60 días', '90 días']) {
  const btn = p.getByRole('button', { name: d }).or(p.getByRole('link', { name: d })).or(p.getByText(d, { exact: true })).first()
  await tocar(btn, async () => { await esperar(); await p.waitForTimeout(300) })
  await foto(12)
}
// 4 · Radar: lo que la app ha encontrado sola
await p.goto(BASE + '/radar'); await esperar()
await foto(12)
await deslizar(380, 30); await foto(10)
console.log('fotogramas', n)
await b.close()
