import { pathToFileURL } from 'node:url'
const [url, salida] = process.argv.slice(2)
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const b = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH })
const p = await b.newPage(); await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready)
await p.pdf({ path: salida, format: 'A4', printBackground: true, preferCSSPageSize: true }); await b.close()
