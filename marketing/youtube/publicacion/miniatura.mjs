// Renderiza la miniatura a PNG (1280x720) y también una versión comprimida por debajo de 2 MB,
// que es el límite que acepta YouTube.
import { chromium } from '/home/claude/dcp-web/node_modules/playwright/index.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const AQUI = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--force-color-profile=srgb','--disable-lcd-text','--font-render-hinting=none','--no-sandbox'] });
const p = await (await b.newContext({ viewport:{width:1280,height:720}, deviceScaleFactor:1 })).newPage();
p.on('pageerror', e => console.error('PAGEERROR:', String(e).slice(0,200)));
await p.goto('file://' + resolve(AQUI,'miniatura.html'), { waitUntil:'load' });
await p.waitForFunction(() => window.LISTO === true, null, { timeout:30000 });
await p.locator('#c').screenshot({ path: resolve(AQUI,'miniatura-el-bucle.png') });
console.log('miniatura-el-bucle.png');
await b.close();
