/* Fotos sueltas de una demo en varios tiempos: node fotos.mjs <url> <salida.jpg> t1 t2 ... */
import { pathToFileURL } from 'node:url'
const [url, salida, ...ts] = process.argv.slice(2)
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const b = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const W = +(process.env.ANCHO || 540), H = +(process.env.ALTO || 960)
const p = await (await b.newContext({ viewport: { width: W, height: H } })).newPage()
p.on('pageerror', (e) => console.error('[pág]', e.message.slice(0, 3000)))
await p.goto(url); await p.waitForFunction(() => window.LISTO === true, null, { timeout: 120000 }); await p.evaluate(() => document.fonts.ready)
const bufs = []
for (const t of ts) { await p.evaluate((t) => window.renderAt(t), +t); bufs.push(await p.screenshot({ type: 'jpeg', quality: 90, timeout: 300000 })) }
await b.close()
const { execFileSync } = await import('node:child_process'); const fs = await import('node:fs')
bufs.forEach((b, i) => fs.writeFileSync(`${salida}.${i}.jpg`, b))
execFileSync('convert', [...bufs.map((_, i) => `${salida}.${i}.jpg`), '+append', salida])
bufs.forEach((_, i) => fs.unlinkSync(`${salida}.${i}.jpg`))
