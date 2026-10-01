const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + process.cwd() + '/textos.html'); await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: 'reel-textos-canva.pdf', width: '1080px', height: '1920px', printBackground: true });
  await p.setViewportSize({ width: 1080, height: 1920 });
  for (const n of [1, 5, 14]) { await p.evaluate(n => window.scrollTo(0, (n - 1) * 1920), n); await p.screenshot({ path: `prev-${n}.png` }); }
  await b.close();
})();
