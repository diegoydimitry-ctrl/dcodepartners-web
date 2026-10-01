// Renderiza cada página de textos-superponer.html como PNG 1080×1920 con transparencia → capas/NN.png
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
(async () => {
  fs.mkdirSync('capas', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + process.cwd() + '/textos-superponer.html'); await p.evaluate(() => document.fonts.ready);
  const els = await p.$$('.pg');
  for (let i = 0; i < els.length; i++)
    await els[i].screenshot({ path: `capas/${String(i + 1).padStart(2, '0')}.png`, omitBackground: true });
  await b.close(); console.log(els.length, 'capas');
})();
