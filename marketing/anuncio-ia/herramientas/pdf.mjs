/* HTML → PDF de página fija: node pdf.mjs <url> <salida.pdf> <ancho> <alto> */
import { pathToFileURL } from 'node:url'
const [url, salida, w, h] = process.argv.slice(2)
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const b = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH })
const p = await (await b.newContext({ viewport: { width: +w, height: +h } })).newPage()
await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready)
await p.pdf({ path: salida, width: w + 'px', height: h + 'px', printBackground: true, preferCSSPageSize: true })
await b.close()
