import { pathToFileURL } from 'node:url'
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const b = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH })
const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'es-ES' })
const p = await ctx.newPage()
await p.goto('http://127.0.0.1:4800/login')
await p.screenshot({ path: process.argv[2] + '/fin-login.png' })
const btn = p.getByRole('button', { name: /entrar/i })
await btn.click()
await p.waitForLoadState('networkidle')
console.log('tras login', p.url())
for (const r of ['/', '/facturas', '/tesoreria', '/radar', '/cobros', '/facturas/nueva', '/gastos', '/proyectos']) {
  try { await p.goto('http://127.0.0.1:4800' + r, { waitUntil: 'networkidle' }); await p.screenshot({ path: process.argv[2] + '/fin' + r.replace(/\//g, '_') + '.png', fullPage: false }); console.log(r, p.url(), (await p.title())) } catch (e) { console.log(r, 'ERR', e.message.slice(0, 100)) }
}
await b.close()
