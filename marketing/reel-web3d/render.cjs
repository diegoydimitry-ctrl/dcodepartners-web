// Captura fotograma a fotograma (servir antes esta carpeta: python3 -m http.server 8770 --bind 127.0.0.1).
//   node render.cjs --pagina "web/index.html?captura&s=vela&esc=1.5" --dir render/vela          → JPEG numerados
//   node render.cjs --pagina "montaje/index.html?captura" --salida render/imagen.mp4            → vídeo
//   … --fotos 1,3.2,9 → render/fotos/<nombre>-tNNN.png     … --desde 0 --hasta 10 (segundos)
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
(async () => {
  const nav = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--force-color-profile=srgb', '--font-render-hinting=none'] });
  const pag = await nav.newPage({ viewport: { width: 1080, height: 1920 } });
  pag.on('pageerror', (e) => { console.error('[web] error:', e.message); process.exit(2); });
  pag.on('console', (m) => { if (m.type() === 'error') console.error('[web]', m.text().slice(0, 300)); });
  await pag.goto('http://127.0.0.1:8770/' + arg('--pagina'));
  await pag.waitForFunction(() => window.LISTO === true, null, { timeout: 300000 });
  const META = await pag.evaluate(() => window.META); console.log(JSON.stringify(META));
  const pinta = async (n) => { await pag.evaluate((n) => window.pintaFrame(n), n); };
  if (arg('--fotos')) { fs.mkdirSync(path.join(__dirname, 'render/fotos'), { recursive: true });
    for (const t of arg('--fotos').split(',').map(Number)) { const t0 = Date.now(); await pinta(Math.round(t * META.fps));
      fs.writeFileSync(path.join(__dirname, 'render/fotos', `${arg('--nombre') || 'x'}-t${t.toFixed(2).padStart(6, '0')}.png`), await pag.screenshot({ type: 'png', timeout: 300000 })); console.log(t, ((Date.now() - t0) / 1000).toFixed(1) + ' s'); }
  } else {
    const n0 = Math.round(Number(arg('--desde') || 0) * META.fps), n1 = Math.round(Number(arg('--hasta') || META.duracion) * META.fps), t0 = Date.now();
    let ff = null, dir = arg('--dir');
    if (dir) fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
    else ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(META.fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', path.join(__dirname, arg('--salida'))], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let n = n0; n < n1; n++) { await pinta(n); const img = await pag.screenshot({ type: 'jpeg', quality: 96, timeout: 300000 });
      if (dir) fs.writeFileSync(path.join(__dirname, dir, String(n).padStart(4, '0') + '.jpg'), img); else if (!ff.stdin.write(img)) await new Promise((r) => ff.stdin.once('drain', r));
      if ((n - n0) % 30 === 0) console.log(`${n}/${n1} · ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
    if (ff) { ff.stdin.end(); await new Promise((r) => ff.on('close', r)); }
    console.log(`LISTO ${n1 - n0} fotogramas en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  await nav.close();
})();
