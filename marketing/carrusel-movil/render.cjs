// una página cada vez (evita recortes de la captura por elemento con transformaciones)
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + process.cwd() + '/' + (process.argv[2] || 'carrusel.html')); await p.evaluate(() => document.fonts.ready);
  const n = await p.$$eval('.pg', e => e.length);
  for (let i = 0; i < n; i++) {
    await p.evaluate(i => document.querySelectorAll('.pg').forEach((e, j) => e.style.display = j === i ? 'block' : 'none'), i);
    await p.screenshot({ path: `${process.argv[3] || 'salida'}/${String(i + 1).padStart(2, '0')}.png`, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  }
  await b.close(); console.log(n, 'png');
})();
