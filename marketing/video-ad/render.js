#!/usr/bin/env node
/**
 * Renderiza el anuncio de D-Code Partners a MP4 (H.264 + AAC).
 *
 * Carga ad.html en Chromium, avanza el tiempo fotograma a fotograma con
 * window.__render(t) y envía cada PNG por una tubería a ffmpeg. Los fotogramas
 * nunca tocan el disco.
 *
 * Con --workers N el tramo se reparte entre N procesos que codifican segmentos
 * en paralelo; después se unen sin recodificar (-c:v copy) y se añade el audio.
 * Cada segmento empieza en fotograma clave (keyint fijo, scenecut desactivado),
 * que es lo que hace que la unión sea exacta.
 *
 *   node render.js --fmt 9x16
 *   node render.js --fmt 16x9 --workers 4
 *   node render.js --fmt 9x16 --no-audio --out out/mudo.mp4
 */

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const path         = require('path');
const fs           = require('fs');
const os           = require('os');

/* ───────────────────────────── argumentos ───────────────────────────── */

const argv = process.argv.slice(2);
const flag = (name, def = null) => {
  const i = argv.indexOf('--' + name);
  return i === -1 ? def : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true);
};

const FMT  = flag('fmt', '9x16') === '16x9' ? '16x9' : '9x16';
const FPS  = parseInt(flag('fps', '30'), 10);
const DUR  = parseFloat(flag('dur', '40'));
const DIR  = __dirname;
const SEG  = flag('seg', null);                      // "i/N" → modo trabajador
const OUT  = path.resolve(DIR, flag('out', `out/dcode-anuncio-${FMT}.mp4`));
const AUDIO = flag('no-audio') ? null
            : path.resolve(DIR, flag('audio', 'out/banda-sonora.wav'));

const [W, H] = FMT === '9x16' ? [1080, 1920] : [1920, 1080];
const TOTAL  = Math.round(DUR * FPS);
const WORKERS = Math.max(1, Math.min(
  parseInt(flag('workers', String(Math.max(1, Math.min(4, os.cpus().length)))), 10),
  8
));

function findFfmpeg() {
  const candidates = [
    process.env.FFMPEG_PATH,
    (() => { try { return require('ffmpeg-static'); } catch { return null; } })(),
    '/usr/bin/ffmpeg', '/usr/local/bin/ffmpeg'
  ].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(c)) return c;
  throw new Error('No se encontró ffmpeg con libx264/aac. `npm i ffmpeg-static` o define FFMPEG_PATH.');
}
const FFMPEG = findFfmpeg();

/* Parámetros de vídeo idénticos en todos los segmentos: sin esto la unión
   sin recodificar produciría saltos. */
const VIDEO_ARGS = [
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
  '-profile:v', 'high', '-pix_fmt', 'yuv420p',
  '-x264-params', 'keyint=60:min-keyint=60:scenecut=0',
  '-r', String(FPS)
];

/* ──────────────────── captura de un rango de fotogramas ──────────────────── */

async function renderRange(from, to, outFile, label) {
  const ff = spawn(FFMPEG, [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', 'pipe:0',
    ...VIDEO_ARGS, '-an', outFile
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  const ffDone = new Promise((res, rej) => {
    ff.on('close', c => c === 0 ? res() : rej(new Error(`ffmpeg salió con código ${c}`)));
    ff.on('error', rej);
  });
  ff.stdin.on('error', e => { if (e.code !== 'EPIPE') throw e; });

  const browser = await chromium.launch({
    args: ['--force-color-profile=srgb', '--disable-lcd-text', '--hide-scrollbars']
  });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(DIR, 'ad.html') + `?fmt=${FMT}&t=0`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });

  const canvas = page.locator('#stage');
  const t0 = Date.now();

  for (let f = from; f < to; f++) {
    await page.evaluate(tt => window.__render(tt), f / FPS);
    const png = await canvas.screenshot({ type: 'png', animations: 'disabled' });
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));

    if (label && (f - from) % 30 === 0) {
      const done = f - from + 1, n = to - from;
      const el = (Date.now() - t0) / 1000;
      process.stderr.write(
        `\r  ${label}  ${done}/${n}  ${(done / n * 100).toFixed(0)}%  ` +
        `${el.toFixed(0)}s  eta ${(el / done * (n - done)).toFixed(0)}s      `
      );
    }
  }

  ff.stdin.end();
  await browser.close();
  await ffDone;
}

/* ────────────────────────────── orquestación ────────────────────────────── */

function run(cmd, args) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] });
    p.on('close', c => c === 0 ? res() : rej(new Error(`${path.basename(cmd)} salió con código ${c}`)));
    p.on('error', rej);
  });
}

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  /* Modo trabajador: renderiza su tramo y termina. */
  if (SEG) {
    const [i, n] = String(SEG).split('/').map(Number);
    const from = Math.floor(TOTAL * i / n);
    const to   = Math.floor(TOTAL * (i + 1) / n);
    await renderRange(from, to, OUT, null);
    return;
  }

  const hasAudio = AUDIO && fs.existsSync(AUDIO);
  if (AUDIO && !hasAudio) console.warn(`aviso: no existe ${AUDIO}; se renderiza sin sonido.`);

  console.log(`render ${FMT}  ${W}×${H}  ${FPS}fps  ${TOTAL} fotogramas  ${WORKERS} proceso(s)`);
  const t0 = Date.now();

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dcode-seg-'));
  const segs = [];

  try {
    if (WORKERS === 1) {
      const only = path.join(tmpDir, 'seg-0.mp4');
      await renderRange(0, TOTAL, only, 'vídeo');
      segs.push(only);
      process.stderr.write('\n');
    } else {
      // Cada trabajador es este mismo script con --seg i/N.
      await Promise.all(Array.from({ length: WORKERS }, (_, i) => {
        const out = path.join(tmpDir, `seg-${i}.mp4`);
        segs.push(out);
        return run(process.execPath, [
          __filename, '--fmt', FMT, '--fps', String(FPS), '--dur', String(DUR),
          '--seg', `${i}/${WORKERS}`, '--out', out
        ]);
      }));
      console.log(`  ${WORKERS} segmentos listos en ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }

    // Unión sin recodificar + audio.
    const list = path.join(tmpDir, 'segments.txt');
    fs.writeFileSync(list, segs.map(s => `file '${s.replace(/'/g, "'\\''")}'`).join('\n'));

    await run(FFMPEG, [
      '-y', '-loglevel', 'error',
      '-f', 'concat', '-safe', '0', '-i', list,
      ...(hasAudio ? ['-i', AUDIO] : []),
      '-map', '0:v:0', ...(hasAudio ? ['-map', '1:a:0'] : []),
      '-c:v', 'copy',
      ...(hasAudio ? ['-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2', '-shortest'] : []),
      '-movflags', '+faststart',
      OUT
    ]);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  const mb = (fs.statSync(OUT).size / 1048576).toFixed(2);
  console.log(`listo   → ${OUT}  (${mb} MB, ${((Date.now() - t0) / 1000).toFixed(0)}s)`);
})().catch(err => { console.error('\nERROR:', err.message); process.exit(1); });
