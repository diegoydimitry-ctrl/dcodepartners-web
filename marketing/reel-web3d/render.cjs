// Captura fotograma a fotograma de web/index.html?captura (servida en http://127.0.0.1:8770 desde esta carpeta).
//   node render.cjs --fotos 1,3.2,9        → render/fotos/tNNN.png
//   node render.cjs --desde 0 --hasta 10 --salida a.mp4
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
(async () => {
  const OUT = path.join(__dirname, 'render'); fs.mkdirSync(path.join(OUT, 'fotos'), { recursive: true });
  const nav = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--force-color-profile=srgb', '--font-render-hinting=none'] });
  const pag = await nav.newPage({ viewport: { width: 1080, height: 1920 } });
  pag.on('pageerror', (e) => { console.error('[web] error:', e.message); process.exit(2); });
  pag.on('console', (m) => { if (m.type() === 'error') console.error('[web]', m.text().slice(0, 300)); });
  const t00 = Date.now();
  await pag.goto('http://127.0.0.1:8770/web/index.html?captura' + (process.env.EXTRA || ''));
  await pag.waitForFunction(() => window.LISTO === true, null, { timeout: 300000 });
  const META = await pag.evaluate(() => window.META); console.log('cargada en', ((Date.now() - t00) / 1000).toFixed(1), 's', JSON.stringify(META));
  if (arg('--fotos')) {
    for (const t of arg('--fotos').split(',').map(Number)) { const t0 = Date.now(); await pag.evaluate((t) => window.pintaT(t), t);
      fs.writeFileSync(path.join(OUT, 'fotos', `t${t.toFixed(2).padStart(6, '0')}.png`), await pag.screenshot({ type: 'png' })); console.log(t, ((Date.now() - t0) / 1000).toFixed(1) + ' s'); }
  } else {
    const n0 = Math.round(Number(arg('--desde') || 0) * META.fps), n1 = Math.round(Number(arg('--hasta') || META.duracion) * META.fps);
    const dest = path.join(OUT, arg('--salida') || 'imagen.mp4');
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(META.fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', dest], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let n = n0; n < n1; n++) { await pag.evaluate((n) => window.pintaFrame(n), n); const img = await pag.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(img)) await new Promise((r) => ff.stdin.once('drain', r));
      if ((n - n0) % 30 === 0) console.log(`${n}/${n1} · ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
    ff.stdin.end(); await new Promise((r) => ff.on('close', r)); console.log(`${n1 - n0} fotogramas → ${dest} en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  await nav.close();
})();
