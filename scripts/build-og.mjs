#!/usr/bin/env node
/*
 * LA IMAGEN QUE SE VE AL COMPARTIR LA WEB
 * ---------------------------------------------------------------------------
 * assets/og-image.png es lo primero que ve alguien cuando le pasan el enlace
 * por WhatsApp o lo ven en LinkedIn. La anterior seguía diciendo «Growth
 * Partners · Un mes de servicio gratuito»: una posición y una oferta que ya no
 * existen en ninguna página. Una imagen fija que hay que acordarse de rehacer
 * se queda vieja siempre, así que se genera: misma tipografía, mismos colores
 * y mismo mensaje que la portada, tomados del propio sitio.
 *
 * Uso:  node scripts/build-og.mjs           (escribe assets/og-image*.png)
 *       node scripts/build-og.mjs --check   (falla si no existen)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(RAIZ, 'package.json'));
const SALIDAS = [
  { fichero: 'assets/og-image.png', lang: 'es' },
  { fichero: 'assets/og-image-en.png', lang: 'en' },
];

if (process.argv.includes('--check')) {
  const faltan = SALIDAS.filter((s) => !fs.existsSync(path.join(RAIZ, s.fichero)));
  if (faltan.length) { console.error('✗ falta ' + faltan.map((f) => f.fichero).join(', ') + ': ejecuta node scripts/build-og.mjs'); process.exit(1); }
  console.log('✓ imágenes para compartir en su sitio'); process.exit(0);
}

const TXT = {
  es: {
    kicker: 'SISTEMAS A MEDIDA · SOFTWARE PROPIO',
    t1: 'Lo que tu equipo repite cada semana',
    t2: 'puede hacerlo un sistema.',
    pie: ['Cuatro sistemas que puedes probar', 'D-Code Finance · software propio'],
  },
  en: {
    kicker: 'SYSTEMS MADE TO MEASURE · OUR OWN SOFTWARE',
    t1: 'What your team repeats every week',
    t2: 'a system can do.',
    pie: ['Four systems you can try', 'D-Code Finance · our own software'],
  },
};

const b64 = (p) => fs.readFileSync(path.join(RAIZ, p)).toString('base64');
const FUENTES = {
  sg: b64('assets/fonts/spacegrotesk-variable.woff2'),
  inter: b64('assets/fonts/inter-variable.woff2'),
  mono: b64('assets/fonts/jetbrainsmono-variable.woff2'),
};
const CAPTURA = b64('assets/img/demos/finance-dark.webp');

function html(lang) {
  const t = TXT[lang];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
  @font-face{font-family:SG;src:url(data:font/woff2;base64,${FUENTES.sg}) format('woff2');font-weight:300 700;}
  @font-face{font-family:IN;src:url(data:font/woff2;base64,${FUENTES.inter}) format('woff2');font-weight:100 900;}
  @font-face{font-family:MO;src:url(data:font/woff2;base64,${FUENTES.mono}) format('woff2');font-weight:100 800;}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;background:#05070f;color:#f1f4fb;font-family:IN,sans-serif;position:relative}
  .fondo{position:absolute;inset:0;background:
    radial-gradient(60% 55% at 12% 0%, rgba(38,58,140,.55), transparent 70%),
    radial-gradient(55% 50% at 100% 100%, rgba(84,42,150,.45), transparent 70%),
    radial-gradient(40% 35% at 78% 20%, rgba(40,140,200,.18), transparent 70%), #05070f;}
  .estrellas{position:absolute;inset:0;opacity:.7;background-image:
    radial-gradient(1.6px 1.6px at 12% 22%, rgba(242,247,255,.95), transparent),
    radial-gradient(1.3px 1.3px at 28% 68%, rgba(214,226,255,.75), transparent),
    radial-gradient(1.8px 1.8px at 46% 14%, rgba(130,228,255,.8), transparent),
    radial-gradient(1.2px 1.2px at 62% 52%, rgba(200,176,255,.7), transparent),
    radial-gradient(1.5px 1.5px at 78% 30%, rgba(242,247,255,.8), transparent),
    radial-gradient(1.2px 1.2px at 88% 72%, rgba(190,206,255,.6), transparent),
    radial-gradient(1.1px 1.1px at 36% 86%, rgba(242,247,255,.6), transparent),
    radial-gradient(1.4px 1.4px at 68% 88%, rgba(130,228,255,.5), transparent);}
  .caja{position:absolute;inset:0;padding:62px 64px;display:flex;flex-direction:column;justify-content:space-between}
  .marca{display:flex;align-items:center;gap:14px}
  .marca svg{width:44px;height:38px;color:#f1f4fb}
  .marca b{font-family:SG,sans-serif;font-weight:600;font-size:30px;letter-spacing:-.01em}
  .marca i{font-style:normal;font-family:MO,monospace;font-size:12px;letter-spacing:.24em;color:#8ea0c4;margin-top:6px;display:block}
  .kicker{font-family:MO,monospace;font-size:13px;letter-spacing:.2em;color:#8ea0c4;margin-bottom:18px}
  h1{font-family:SG,sans-serif;font-weight:600;font-size:56px;line-height:1.06;letter-spacing:-.03em;max-width:700px}
  h1 span{display:block;background:linear-gradient(94deg,#43e0ff 0%,#5b8cff 42%,#9b6bff 72%,#ff6b9d 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
  .pie{display:flex;gap:26px;font-family:MO,monospace;font-size:13px;letter-spacing:.06em;color:#a7b0c4}
  .pie span{display:flex;align-items:center;gap:9px}
  .pie i{width:6px;height:6px;border-radius:50%;background:#5b8cff;box-shadow:0 0 10px 1px rgba(91,140,255,.8)}
  .foto{position:absolute;right:-90px;bottom:-40px;width:620px;border-radius:14px;overflow:hidden;
    border:1px solid rgba(150,174,245,.22);box-shadow:0 40px 90px -30px rgba(0,0,0,.95);transform:rotate(-4deg)}
  .foto img{display:block;width:100%}
  .velo{position:absolute;inset:0;background:
    linear-gradient(100deg,#05070f 30%,rgba(5,7,15,.88) 46%,rgba(5,7,15,.3) 70%,transparent 100%),
    linear-gradient(0deg,#05070f 0%,rgba(5,7,15,.92) 9%,rgba(5,7,15,.45) 17%,transparent 26%)}
  </style></head><body>
  <div class="fondo"></div><div class="estrellas"></div>
  <div class="foto"><img src="data:image/webp;base64,${CAPTURA}"></div>
  <div class="velo"></div>
  <div class="caja">
    <div class="marca">
      <svg viewBox="0 0 120 100" fill="currentColor" aria-hidden="true"><g><rect x="26" y="1" width="16" height="16" rx="2"/><rect x="1" y="27" width="13" height="13" rx="2"/><rect x="35" y="26" width="13" height="13" rx="2"/><rect x="2" y="64" width="12" height="12" rx="2"/><rect x="35" y="64" width="13" height="13" rx="2"/><rect x="26" y="83" width="16" height="16" rx="2"/><path d="M48 1H86A32 32 0 0 1 118 33V38H102V33A16 16 0 0 0 86 17H48Z"/><rect x="102" y="43" width="16" height="16" rx="2"/><path d="M48 99H86A32 32 0 0 0 118 67V63H102V67A16 16 0 0 1 86 83H48Z"/></g><rect x="16" y="45" width="15" height="15" rx="2" fill="#5b8cff"/></svg>
      <div><b>D-Code Partners</b></div>
    </div>
    <div>
      <p class="kicker">${t.kicker}</p>
      <h1>${t.t1}<span>${t.t2}</span></h1>
    </div>
    <div class="pie">${t.pie.map((p) => `<span><i></i>${p}</span>`).join('')}</div>
  </div>
  </body></html>`;
}

const { chromium } = require('playwright');
const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await br.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const s of SALIDAS) {
  const pg = await ctx.newPage();
  await pg.setContent(html(s.lang), { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(250);
  await pg.screenshot({ path: path.join(RAIZ, s.fichero) });
  await pg.close();
  console.log('✓ ' + s.fichero + ' (' + (fs.statSync(path.join(RAIZ, s.fichero)).size / 1024).toFixed(0) + ' KB)');
}
await br.close();
process.exit(0);
