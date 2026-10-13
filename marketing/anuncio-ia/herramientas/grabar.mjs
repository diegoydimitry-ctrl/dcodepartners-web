/* Graba una demo fotograma a fotograma: node grabar.mjs <url> <carpeta> <t0> <t1> [fps] */
import { pathToFileURL } from 'node:url'; import fs from 'node:fs'
const [url, dir, t0s, t1s, fpss] = process.argv.slice(2)
const t0 = +t0s, t1 = +t1s, fps = +(fpss || 30)
fs.mkdirSync(dir, { recursive: true })
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const b = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const W = +(process.env.ANCHO || 1080), H = +(process.env.ALTO || 1920)
const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })).newPage()
p.on('console', (m) => { if (m.type() === 'error') console.error('[pág]', m.text().slice(0, 400)) })
p.on('pageerror', (e) => console.error('[pág]', e.message.slice(0, 2000)))
await p.goto(url)
await p.waitForFunction(() => window.LISTO === true, null, { timeout: 120000 })
await p.evaluate(() => document.fonts.ready)
const n = Math.round((t1 - t0) * fps)
const ini = Date.now()
for (let i = 0; i <= n; i++) {
  const t = t0 + i / fps
  await p.evaluate((t) => window.renderAt(t), t)
  await p.screenshot({ path: `${dir}/f${String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 94, timeout: 300000 })
  if (i % 15 === 0) console.log(`fotograma ${i}/${n} · ${((Date.now() - ini) / 1000 / (i + 1)).toFixed(2)} s/fot`)
}
await b.close()
